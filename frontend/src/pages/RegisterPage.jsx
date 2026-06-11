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

export default function RegisterPage() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', hasGunLicense: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const age = parseInt(form.age, 10);
    if (isNaN(age) || age < 1) { setError('Please enter a valid age.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', { ...form, age });
      saveSession(data);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '2rem auto' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.3rem' }}>Jager</div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Create Account</h2>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '1.75rem' }}>
        {error && (
          <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '0.75rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#e74c3c' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {[
            { id: 'name', label: 'Full Name', type: 'text', autoComplete: 'name' },
            { id: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
            { id: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', hint: 'Min. 6 characters' },
          ].map(({ id, label, type, autoComplete, hint }) => (
            <div key={id} style={{ marginBottom: '1rem' }}>
              <label style={labelStyle} htmlFor={id}>{label}</label>
              <input style={inputStyle} id={id} name={id} type={type} value={form[id]} onChange={handleChange} required autoComplete={autoComplete} />
              {hint && <div style={{ fontSize: '0.72rem', color: '#444', marginTop: '0.3rem' }}>{hint}</div>}
            </div>
          ))}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle} htmlFor="age">Age</label>
            <input style={{ ...inputStyle, width: '100px' }} id="age" name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.85rem', background: '#0d0d0d', border: `1px solid ${BORDER}`, borderRadius: '4px' }}>
            <input
              id="hasGunLicense"
              name="hasGunLicense"
              type="checkbox"
              checked={form.hasGunLicense}
              onChange={handleChange}
              style={{ width: 18, height: 18, cursor: 'pointer', marginTop: 1, accentColor: ORANGE, flexShrink: 0 }}
            />
            <div>
              <label style={{ ...labelStyle, marginBottom: '0.15rem', cursor: 'pointer', display: 'block' }} htmlFor="hasGunLicense">
                I hold a valid gun license
              </label>
              <div style={{ fontSize: '0.72rem', color: '#444', lineHeight: 1.5 }}>Required to purchase restricted firearms and ammunition.</div>
            </div>
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
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.82rem', color: '#555' }}>
        Already have an account? <Link to="/login" style={{ color: ORANGE, fontWeight: 700 }}>Sign in</Link>
      </p>
    </div>
  );
}
