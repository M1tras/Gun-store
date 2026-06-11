import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const s = {
  hero: {
    textAlign: 'center',
    padding: '4rem 1rem',
    background: '#fff',
    borderRadius: '8px',
    marginBottom: '2rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  title: { fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#1a1a1a' },
  subtitle: { fontSize: '1.1rem', color: '#555', marginBottom: '2rem' },
  btnRow: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  btnPrimary: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: '#f0a500',
    color: '#1a1a1a',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 700,
    fontSize: '1rem',
  },
  btnSecondary: {
    display: 'inline-block',
    padding: '0.75rem 2rem',
    background: '#1a1a1a',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 700,
    fontSize: '1rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  cardTitle: { fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' },
  notice: {
    marginTop: '2rem',
    padding: '1rem 1.25rem',
    background: '#fff8e1',
    borderLeft: '4px solid #f0a500',
    borderRadius: '4px',
    fontSize: '0.9rem',
    color: '#555',
  },
};

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <section style={s.hero}>
        <h1 style={s.title}>Jager</h1>
        <p style={s.subtitle}>Professional hunting equipment & licensed firearms supplies</p>
        <div style={s.btnRow}>
          <Link to="/products" style={s.btnPrimary}>Browse Products</Link>
          {!user && <Link to="/register" style={s.btnSecondary}>Create Account</Link>}
        </div>
      </section>

      <div style={s.features}>
        <div style={s.card}>
          <div style={s.cardTitle}>Wide Selection</div>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            Hunting gear, optics, accessories and licensed firearms from trusted brands.
          </p>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Licensed & Compliant</div>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            Restricted items are sold exclusively to verified license holders aged 18+.
          </p>
        </div>
        <div style={s.card}>
          <div style={s.cardTitle}>Secure Orders</div>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
            Track all your orders from a personal dashboard. Fast shipping nationwide.
          </p>
        </div>
      </div>

      <div style={s.notice}>
        <strong>Legal notice:</strong> Sale of restricted firearms and ammunition is subject to
        applicable laws. A valid gun license is required at checkout for restricted items.
        Purchasers must be 18 years of age or older.
      </div>
    </div>
  );
}
