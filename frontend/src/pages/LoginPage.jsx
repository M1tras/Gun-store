import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const s = {
  wrapper: {
    maxWidth: '400px',
    margin: '2rem auto',
    background: '#fff',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  title: { marginTop: 0, marginBottom: '1.5rem' },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.35rem', fontWeight: 500, fontSize: '0.9rem' },
  input: {
    width: '100%',
    padding: '0.55rem 0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  btn: {
    width: '100%',
    padding: '0.7rem',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  error: {
    background: '#fdecea',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
    padding: '0.6rem 0.75rem',
    color: '#721c24',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  footer: { marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center', color: '#555' },
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
    <div style={s.wrapper}>
      <h2 style={s.title}>Sign In</h2>

      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div style={s.field}>
          <label style={s.label} htmlFor="email">Email</label>
          <input
            style={s.input}
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>

        <div style={s.field}>
          <label style={s.label} htmlFor="password">Password</label>
          <input
            style={s.input}
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
        </div>

        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p style={s.footer}>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
