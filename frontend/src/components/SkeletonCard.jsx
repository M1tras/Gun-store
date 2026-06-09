import React from 'react';

const SURFACE = '#141414';
const BORDER = '#2a2a2a';

const shimmer = {
  background: 'linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%)',
  backgroundSize: '200% 100%',
  animation: 'skeleton-pulse 1.4s ease infinite',
  borderRadius: '4px',
};

export function SkeletonCard() {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ ...shimmer, height: 180, borderRadius: 0 }} />
      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        <div style={{ ...shimmer, height: 13, width: '65%' }} />
        <div style={{ ...shimmer, height: 10, width: '85%', animationDelay: '0.1s' }} />
        <div style={{ ...shimmer, height: 10, width: '50%', animationDelay: '0.2s' }} />
        <div style={{ ...shimmer, height: 32, marginTop: '0.25rem', animationDelay: '0.15s' }} />
      </div>
    </div>
  );
}

export function SkeletonOrderCard() {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '0.9rem 1.1rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ ...shimmer, height: 13, width: 80 }} />
        <div style={{ ...shimmer, height: 18, width: 60, borderRadius: '3px', animationDelay: '0.05s' }} />
        <div style={{ ...shimmer, height: 13, width: 50, marginLeft: 'auto', animationDelay: '0.1s' }} />
      </div>
      {/* Timeline placeholder */}
      <div style={{ padding: '0.85rem 1.1rem', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: '0' }}>
        {[0,1,2,3].map(i => (
          <React.Fragment key={i}>
            <div style={{ ...shimmer, width: 10, height: 10, borderRadius: '50%', flexShrink: 0, animationDelay: `${i * 0.05}s` }} />
            {i < 3 && <div style={{ ...shimmer, flex: 1, height: 2, animationDelay: `${i * 0.05 + 0.02}s`, borderRadius: 0 }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ padding: '0.75rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[1, 0.7].map((w, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ ...shimmer, height: 11, width: `${w * 55}%`, animationDelay: `${i * 0.08}s` }} />
            <div style={{ ...shimmer, height: 11, width: '20%', animationDelay: `${i * 0.08 + 0.05}s` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
