import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const BORDER = '#2a2a2a';

const inputStyle = {
  width: '100%',
  padding: '0.7rem 0.85rem',
  background: '#0d0d0d',
  border: `1px solid ${BORDER}`,
  borderRadius: '4px',
  fontSize: '0.95rem',
  color: '#eee',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: 700,
  fontSize: '0.65rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#666',
};

export default function LoginPage() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', form);
      saveSession(data);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '380px', margin: '2rem auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>Jager</div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Sign In</h2>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '1.75rem' }}>
        {error && (
          <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '0.75rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#e74c3c' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input style={inputStyle} id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle} htmlFor="password">Password</label>
            <input style={inputStyle} id="password" name="password" type="password" value={form.password} onChange={handleChange} required autoComplete="current-password" />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: loading ? '#1a1a1a' : ORANGE,
              color: loading ? '#444' : '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#555' }}>
        No account? <Link to="/register" style={{ color: ORANGE, fontWeight: 700 }}>Register here</Link>
      </p>
    </div>
  );
}
