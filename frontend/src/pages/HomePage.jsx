import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const BORDER = '#2a2a2a';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: `linear-gradient(160deg, #1a1a0e 0%, #0d0d0d 60%)`,
        border: `1px solid ${BORDER}`,
        borderRadius: '12px',
        padding: '3rem 2rem',
        marginBottom: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: '55%',
          background: `radial-gradient(ellipse at 80% 50%, rgba(240,165,0,0.08) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', marginBottom: '0.75rem', fontWeight: 700 }}>
            Professional Grade
          </div>
          <h1 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#fff' }}>
            JAGER<br />
            <span style={{ color: ORANGE }}>ARSENAL</span>
          </h1>
          <p style={{ margin: '0 0 2rem', color: '#888', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '380px' }}>
            Hunting equipment &amp; licensed firearms supplies. Built for those who demand precision.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              display: 'inline-block',
              padding: '0.7rem 1.75rem',
              background: ORANGE,
              color: '#000',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Browse Arsenal
            </Link>
            {!user && (
              <Link to="/register" style={{
                display: 'inline-block',
                padding: '0.7rem 1.75rem',
                background: 'transparent',
                color: '#aaa',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: `1px solid #333`,
              }}>
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { icon: '⌖', title: 'Wide Selection', desc: 'Optics, accessories and licensed firearms from trusted brands.' },
          { icon: '⊠', title: 'Licensed & Compliant', desc: 'Restricted items sold exclusively to verified license holders.' },
          { icon: '◫', title: 'Secure Orders', desc: 'Track all orders from your personal dashboard.' },
        ].map((f) => (
          <div key={f.title} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: ORANGE }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.4rem', color: '#eee' }}>{f.title}</div>
            <p style={{ margin: 0, color: '#666', fontSize: '0.82rem', lineHeight: 1.5 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Legal notice */}
      <div style={{ borderLeft: `3px solid ${ORANGE}`, padding: '0.75rem 1rem', background: '#0f0f00', borderRadius: '4px', fontSize: '0.8rem', color: '#777', lineHeight: 1.6 }}>
        <strong style={{ color: '#aaa' }}>Legal notice:</strong> Sale of restricted firearms and ammunition is subject to applicable laws.
        A valid gun license is required at checkout for restricted items. Purchasers must be 18 years or older.
      </div>
    </div>
  );
}
