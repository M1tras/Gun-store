import React from 'react';

const ORANGE = '#f0a500';
const STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

export default function OrderStatusTimeline({ status }) {
  const idx = STEPS.indexOf(status);
  const cancelled = status === 'cancelled';

  if (cancelled) {
    return (
      <div style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#e74c3c', flexShrink: 0 }} />
        <span style={{ fontSize: '0.65rem', color: '#e74c3c', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Cancelled
        </span>
      </div>
    );
  }

  return (
    <div style={{ padding: '0.85rem 1.1rem' }}>
      {/* Circles + connectors */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div style={{
              width: i === idx ? 12 : 8,
              height: i === idx ? 12 : 8,
              borderRadius: '50%',
              background: i <= idx ? ORANGE : '#252525',
              flexShrink: 0,
              boxShadow: i === idx ? `0 0 8px ${ORANGE}` : 'none',
              transition: 'all 0.3s',
            }} />
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1,
                height: 1,
                background: i < idx ? ORANGE : '#252525',
                transition: 'background 0.3s',
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Labels */}
      <div style={{ display: 'flex', marginTop: '5px' }}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <span style={{
              fontSize: '0.55rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: i === idx ? 700 : 400,
              color: i === idx ? ORANGE : i < idx ? '#555' : '#333',
              flexShrink: 0,
            }}>
              {step}
            </span>
            {i < STEPS.length - 1 && <div style={{ flex: 1 }} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
