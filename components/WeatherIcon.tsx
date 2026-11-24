import type { Condition } from '@/lib/types';

type Props = {
  condition: Condition;
  isDay?: boolean;
  className?: string;
};

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Cloud({ offset = 0 }: { offset?: number }) {
  return (
    <path
      {...base}
      transform={`translate(0 ${offset})`}
      d="M7.4 18.2h9.2a3.6 3.6 0 0 0 .3-7.2 5.6 5.6 0 0 0-10.7 1.3 3.1 3.1 0 0 0 1.2 5.9Z"
    />
  );
}

export default function WeatherIcon({ condition, isDay = true, className = 'h-6 w-6' }: Props) {
  if (condition === 'clear') {
    return isDay ? (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle {...base} cx="12" cy="12" r="4.2" />
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index * Math.PI) / 4;
          const x1 = 12 + Math.cos(angle) * 6.4;
          const y1 = 12 + Math.sin(angle) * 6.4;
          const x2 = 12 + Math.cos(angle) * 8.4;
          const y2 = 12 + Math.sin(angle) * 8.4;
          return <line key={index} {...base} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <path {...base} d="M20 14.4A8.2 8.2 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z" />
        <circle cx="17.5" cy="6" r="0.9" fill="currentColor" opacity="0.7" />
        <circle cx="20" cy="10" r="0.6" fill="currentColor" opacity="0.5" />
      </svg>
    );
  }

  if (condition === 'partly') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <circle {...base} cx="8.6" cy="8.2" r="3" />
        <path {...base} d="M8.6 2.4v1.4M8.6 12.6v1.4M2.8 8.2h1.4M13 8.2h1.4M4.5 4.1l1 1M11.7 11.3l1 1M12.7 4.1l-1 1M5.5 11.3l-1 1" opacity="0.85" />
        <Cloud offset={1.4} />
      </svg>
    );
  }

  if (condition === 'fog') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <Cloud offset={-1.6} />
        <path {...base} d="M4 18.4h16M6 21h12" opacity="0.85" />
      </svg>
    );
  }

  if (condition === 'drizzle' || condition === 'rain') {
    const heavy = condition === 'rain';
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <Cloud offset={-1.4} />
        {heavy ? (
          <path {...base} d="M7.6 17.6 6.6 21M12 17.6 11 21M16.4 17.6 15.4 21" />
        ) : (
          <path {...base} d="M8.4 18.2v1.4M12 18.2v1.4M15.6 18.2v1.4" />
        )}
      </svg>
    );
  }

  if (condition === 'snow') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <Cloud offset={-1.4} />
        <path {...base} d="M8 17.6v3.4M6.6 18.6l2.8 1.4M9.4 18.6l-2.8 1.4M15.6 17.6v3.4M14.2 18.6l2.8 1.4M17 18.6l-2.8 1.4" />
      </svg>
    );
  }

  if (condition === 'thunder') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden>
        <Cloud offset={-1.6} />
        <path {...base} d="M12.8 15.4 10.2 19h2.6l-1.2 3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <Cloud />
    </svg>
  );
}
