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
      points: 7,
      maxDistance: 20,
      spacing: 16,
      showDots: false,
      speed: 0.1,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
    });
    return () => effect.current?.destroy();
  }, []);

  return (
    <div
      ref={el}
      style={{ position: 'fixed', top: '-10%', left: '-10%', width: '120%', height: '120%', zIndex: 0, pointerEvents: 'none', opacity: 0.35 }}
    />
  );
}
