'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { LANDMARKS } from '@/lib/landmarks';

type Props = {
  width: number;
  height: number;
  flyTo?: { lat: number; lng: number } | null;
  onReady?: () => void;
};

const HOME = { lat: 24.5, lng: 44.5, altitude: 1.75 };

export default function GlobeScene({ width, height, flyTo, onReady }: Props) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [ready, setReady] = useState(false);

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
    controls.autoRotate = !flyTo;
    controls.autoRotateSpeed = 0.32;
  }, [ready, flyTo]);

  useEffect(() => {
    if (!ready || !flyTo) return;
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.autoRotate = false;
    globe.pointOfView({ lat: flyTo.lat, lng: flyTo.lng, altitude: 0.42 }, 2400);
  }, [ready, flyTo]);

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
      globeImageUrl="/textures/earth-night.jpg"
      bumpImageUrl="/textures/earth-topology.png"
      showAtmosphere
      atmosphereColor="#6cc2ff"
      atmosphereAltitude={0.22}
      pointsData={points}
      pointLat="lat"
      pointLng="lng"
      pointColor={() => 'rgba(255, 214, 150, 0.95)'}
      pointAltitude={0.012}
      pointRadius={0.16}
      pointsMerge={false}
      ringsData={rings}
      ringLat="lat"
      ringLng="lng"
      ringColor={() => 'rgba(255, 214, 150, 0.85)'}
      ringMaxRadius={4}
      ringPropagationSpeed={2.4}
      ringRepeatPeriod={900}
      ringAltitude={0.01}
      onGlobeReady={handleReady}
    />
  );
}
