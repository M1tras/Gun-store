import React, { useRef, useState } from 'react';

const THRESHOLD = 80;

export default function SwipeToRemove({ onRemove, children }) {
  const startX = useRef(0);
  const dragging = useRef(false);
  const [offset, setOffset] = useState(0);
  const [isRemoving, setIsRemoving] = useState(false);

  const begin = (clientX) => {
    startX.current = clientX;
    dragging.current = true;
  };

  const move = (clientX) => {
    if (!dragging.current) return;
    const dx = clientX - startX.current;
    if (dx < 0) setOffset(Math.max(dx, -160));
  };

  const end = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (offset < -THRESHOLD) {
      setIsRemoving(true);
      setOffset(-400);
      setTimeout(onRemove, 300);
    } else {
      setOffset(0);
    }
  };

  // Mouse
  const onMouseDown = (e) => begin(e.clientX);
  const onMouseMove = (e) => move(e.clientX);
  const onMouseUp   = () => end();

  // Touch
  const onTouchStart = (e) => begin(e.touches[0].clientX);
  const onTouchMove  = (e) => move(e.touches[0].clientX);
  const onTouchEnd   = () => end();

  const hintOpacity = Math.min(-offset / THRESHOLD, 1);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '8px' }}>
      {/* Red delete hint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#1e0808',
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        paddingRight: '1.25rem',
        opacity: hintOpacity,
        pointerEvents: 'none',
      }}>
        <span style={{ color: '#e74c3c', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          ✕ Remove
        </span>
      </div>

      {/* Draggable content */}
      <div
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offset}px)`,
          transition: dragging.current ? 'none' : 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          touchAction: 'pan-y',
          userSelect: 'none',
          cursor: dragging.current ? 'grabbing' : 'grab',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
