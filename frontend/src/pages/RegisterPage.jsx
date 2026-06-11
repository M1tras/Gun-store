import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const s = {
  wrapper: {
    maxWidth: '440px',
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
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' },
  checkLabel: { fontSize: '0.95rem', cursor: 'pointer' },
  hint: { fontSize: '0.8rem', color: '#888', marginTop: '0.2rem' },
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

export default function RegisterPage() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    hasGunLicense: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const age = parseInt(form.age, 10);
    if (isNaN(age) || age < 1) {
      setError('Please enter a valid age.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        ...form,
        age,
      });
      saveSession(data);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrapper}>
      <h2 style={s.title}>Create Account</h2>

      {error && <div style={s.error}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div style={s.field}>
          <label style={s.label} htmlFor="name">Full Name</label>
          <input
            style={s.input}
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />
        </div>

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
            autoComplete="new-password"
          />
          <div style={s.hint}>Minimum 6 characters</div>
        </div>

        <div style={s.field}>
          <label style={s.label} htmlFor="age">Age</label>
          <input
            style={{ ...s.input, width: '120px' }}
            id="age"
            name="age"
            type="number"
            min="1"
            max="120"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={s.checkRow}>
          <input
            id="hasGunLicense"
            name="hasGunLicense"
            type="checkbox"
            checked={form.hasGunLicense}
            onChange={handleChange}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <label style={s.checkLabel} htmlFor="hasGunLicense">
            I hold a valid gun license
          </label>
        </div>
        <div style={{ ...s.hint, marginTop: '-0.5rem', marginBottom: '1rem' }}>
          Required to purchase restricted firearms and ammunition.
        </div>

        <button style={s.btn} type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p style={s.footer}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
