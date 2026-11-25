import type { Condition } from '@/lib/types';

type Props = {
  condition: Condition;
  isDay?: boolean;
  className?: string;
};

// Flat, coloured glyphs: a gold sun, soft white clouds and blue drops.
const C = {
  sun: '#F7B733',
  sunDeep: '#E39A16',
  cloud: '#FFFFFF',
  cloudShade: '#C3CCDA',
  cloudDark: '#A7B3C4',
  drop: '#5AA8F0',
  flake: '#E8F3FF',
  bolt: '#FFC53D',
  moon: '#E6EDF8',
};

function Cloud({ shade = false }: { shade?: boolean }) {
  return (
    <g>
      <path
        d="M6.9 18.6h9.9a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.5 1.3 3 3 0 0 0 .4 5.7Z"
        fill={shade ? C.cloudShade : C.cloud}
      />
    </g>
  );
}

export default function WeatherIcon({ condition, isDay = true, className = 'h-6 w-6' }: Props) {
  if (condition === 'clear') {
    return isDay ? (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle cx="12" cy="12" r="5" fill={C.sun} />
        {Array.from({ length: 8 }).map((_, index) => {
          const a = (index * Math.PI) / 4;
          return (
            <line
              key={index}
              x1={12 + Math.cos(a) * 6.9}
              y1={12 + Math.sin(a) * 6.9}
              x2={12 + Math.cos(a) * 9.2}
              y2={12 + Math.sin(a) * 9.2}
              stroke={C.sun}
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          d="M20.2 14.6A8.4 8.4 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z"
          fill={C.moon}
        />
        <circle cx="17.6" cy="6.2" r="1" fill={C.moon} opacity="0.75" />
        <circle cx="20.3" cy="9.6" r="0.7" fill={C.moon} opacity="0.55" />
      </svg>
    );
  }

  if (condition === 'partly') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle cx="9" cy="8.4" r="4" fill={C.sun} />
        <path
          d="M6.9 19.4h9.9a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.5 1.3 3 3 0 0 0 .4 5.7Z"
          fill={C.cloud}
        />
      </svg>
    );
  }

  if (condition === 'fog') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          d="M6.9 15.4h9.9a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.5 1.3 3 3 0 0 0 .4 5.7Z"
          fill={C.cloudShade}
        />
        <path d="M4.5 18.4h15M6.5 21h11" stroke={C.cloudDark} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (condition === 'drizzle' || condition === 'rain') {
    const heavy = condition === 'rain';
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          d="M6.9 15.6h9.9a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.5 1.3 3 3 0 0 0 .4 5.7Z"
          fill={C.cloudShade}
        />
        {heavy
          ? [8, 12, 16].map((x) => (
              <line
                key={x}
                x1={x}
                y1="17.2"
                x2={x - 1}
                y2="21.2"
                stroke={C.drop}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))
          : [8.5, 12, 15.5].map((x) => (
              <circle key={x} cx={x} cy="19.2" r="1.1" fill={C.drop} />
            ))}
      </svg>
    );
  }

  if (condition === 'snow') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          d="M6.9 15.6h9.9a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.5 1.3 3 3 0 0 0 .4 5.7Z"
          fill={C.cloudShade}
        />
        {[8, 12, 16].map((x) => (
          <g key={x} stroke={C.flake} strokeWidth="1.5" strokeLinecap="round">
            <line x1={x} y1="17.6" x2={x} y2="21.2" />
            <line x1={x - 1.5} y1="18.5" x2={x + 1.5} y2="20.3" />
            <line x1={x + 1.5} y1="18.5" x2={x - 1.5} y2="20.3" />
          </g>
        ))}
      </svg>
    );
  }

  if (condition === 'thunder') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path
          d="M6.9 15.4h9.9a3.5 3.5 0 0 0 .2-7 5.5 5.5 0 0 0-10.5 1.3 3 3 0 0 0 .4 5.7Z"
          fill={C.cloudShade}
        />
        <path d="M13 15.8 10 20.2h2.6l-1 3.2" stroke={C.bolt} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <Cloud />
    </svg>
  );
}
