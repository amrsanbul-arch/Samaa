'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { LANDMARKS } from '@/lib/landmarks';

type Props = {
  width: number;
  height: number;
  flyTo?: { lat: number; lng: number } | null;
  daylight?: boolean;
  /** Stop the render loop while the globe is hidden behind the scene. */
  paused?: boolean;
  onReady?: () => void;
};

const HOME = { lat: 24.5, lng: 44.5, altitude: 1.75 };
/** Short dive: fast enough to feel instant, slow enough to read as a zoom. */
const ZOOM_IN_MS = 700;
const ZOOM_OUT_MS = 900;

export default function GlobeScene({
  width,
  height,
  flyTo,
  daylight = false,
  paused = false,
  onReady,
}: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const wasFocused = useRef(false);

  const points = useMemo(
    () => LANDMARKS.map((item) => ({ lat: item.latitude, lng: item.longitude })),
    []
  );
  const rings = useMemo(
    () => (flyTo ? [{ lat: flyTo.lat, lng: flyTo.lng }] : []),
    [flyTo]
  );

  useEffect(() => {
    if (!ready) return;
    const globe = globeRef.current;
    if (!globe) return;

    globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const controls = globe.controls();
    controls.enablePan = false;
    controls.minDistance = 165;
    controls.maxDistance = 620;
    controls.rotateSpeed = 0.4;
    controls.zoomSpeed = 0.55;
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    controls.autoRotate = !flyTo && !reduceMotion;
    controls.autoRotateSpeed = 0.32;
  }, [ready, flyTo]);

  useEffect(() => {
    if (!ready) return;
    const globe = globeRef.current;
    if (!globe) return;
    const controls = globe.controls();

    if (flyTo) {
      controls.autoRotate = false;
      wasFocused.current = true;
      globe.pointOfView({ lat: flyTo.lat, lng: flyTo.lng, altitude: 0.55 }, ZOOM_IN_MS);
      return;
    }

    if (wasFocused.current) {
      wasFocused.current = false;
      globe.pointOfView(HOME, ZOOM_OUT_MS);
    }
  }, [ready, flyTo]);

  useEffect(() => {
    if (!ready) return;
    const globe = globeRef.current;
    if (!globe) return;
    if (paused) globe.pauseAnimation();
    else globe.resumeAnimation();
  }, [ready, paused]);

  const handleReady = () => {
    setReady(true);
    globeRef.current?.pointOfView(HOME, 0);
    onReady?.();
  };

  return (
    <Globe
      ref={globeRef}
      width={width}
      height={height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={daylight ? '/textures/earth-day.jpg' : '/textures/earth-night.jpg'}
      bumpImageUrl="/textures/earth-topology.png"
      showAtmosphere
      atmosphereColor={daylight ? '#7fb2e0' : '#4f86c6'}
      atmosphereAltitude={0.14}
      pointsData={points}
      pointLat="lat"
      pointLng="lng"
      pointColor={() => (daylight ? 'rgba(255, 246, 226, 0.95)' : 'rgba(255, 214, 150, 0.95)')}
      pointAltitude={0.012}
      pointRadius={0.16}
      pointsMerge={false}
      ringsData={rings}
      ringLat="lat"
      ringLng="lng"
      ringColor={() => (daylight ? 'rgba(255, 246, 226, 0.85)' : 'rgba(255, 214, 150, 0.85)')}
      ringMaxRadius={4}
      ringPropagationSpeed={2.4}
      ringRepeatPeriod={900}
      ringAltitude={0.01}
      onGlobeReady={handleReady}
    />
  );
}
