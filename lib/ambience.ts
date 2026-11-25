/**
 * Tiny procedural ambience engine: rain, wind and fog are synthesised from a
 * single noise buffer, so the app ships no audio files and stays light on mobile.
 */
type Layers = { rain: number; wind: number; fog: number };

const SMOOTH = 1.2;

export class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private fogGain: GainNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private target: Layers = { rain: 0, wind: 0, fog: 0 };

  get running() {
    return Boolean(this.ctx);
  }

  async start() {
    if (this.ctx) {
      await this.ctx.resume();
      return;
    }

    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    this.noise = this.buildNoise(ctx);
    this.ctx = ctx;
    this.master = master;

    this.rainGain = this.layer(ctx, master, this.noise, 'bandpass', 1400, 0.6);
    this.windGain = this.layer(ctx, master, this.noise, 'lowpass', 520, 0.9);
    this.fogGain = this.layer(ctx, master, this.noise, 'lowpass', 220, 0.7);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    if (this.windGain) lfoGain.connect(this.windGain.gain);
    lfo.start();
    this.windLfo = lfo;

    this.apply();
  }

  stop() {
    this.windLfo?.stop();
    this.windLfo = null;
    this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.rainGain = null;
    this.windGain = null;
    this.fogGain = null;
  }

  set(layers: Layers) {
    this.target = layers;
    this.apply();
  }

  /** Low rumble with a short crack on top. */
  thunder() {
    const ctx = this.ctx;
    const master = this.master;
    const noise = this.noise;
    if (!ctx || !master || !noise) return;

    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(320, now);
    lowpass.frequency.exponentialRampToValueAtTime(90, now + 2.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.55, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

    source.connect(lowpass).connect(gain).connect(master);
    source.start(now);
    source.stop(now + 2.7);

    const crack = ctx.createBufferSource();
    crack.buffer = noise;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 900;
    bandpass.Q.value = 0.8;
    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0.25, now);
    crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    crack.connect(bandpass).connect(crackGain).connect(master);
    crack.start(now);
    crack.stop(now + 0.4);
  }

  private apply() {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const ramp = (node: GainNode | null, value: number) => {
      if (!node) return;
      node.gain.cancelScheduledValues(now);
      node.gain.setTargetAtTime(Math.max(0.0001, value), now, SMOOTH);
    };
    ramp(this.rainGain, this.target.rain * 0.22);
    ramp(this.windGain, this.target.wind * 0.16);
    ramp(this.fogGain, this.target.fog * 0.1);
  }

  private buildNoise(ctx: AudioContext) {
    const seconds = 3;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buffer;
  }

  private layer(
    ctx: AudioContext,
    destination: AudioNode,
    buffer: AudioBuffer,
    type: BiquadFilterType,
    frequency: number,
    q: number
  ) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;

    const gain = ctx.createGain();
    gain.gain.value = 0.0001;

    source.connect(filter).connect(gain).connect(destination);
    source.start();
    return gain;
  }
}
