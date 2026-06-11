import { useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

export default function VantaBackground() {
  const el = useRef(null);
  const effect = useRef(null);

  useEffect(() => {
    effect.current = NET({
      el: el.current,
      THREE,
      color: 0xf0a500,
      backgroundColor: 0x0d0d0d,
      points: 10,
      maxDistance: 22,
      spacing: 18,
      showDots: true,
    });
    return () => effect.current?.destroy();
  }, []);

  return (
    <div
      ref={el}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
