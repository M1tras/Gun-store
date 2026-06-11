import React from 'react';

const SURFACE = '#141414';
const BORDER = '#2a2a2a';

export function EmptyProducts() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="28" stroke="#2a2a2a" strokeWidth="1.5"/>
      <circle cx="36" cy="36" r="18" stroke="#2a2a2a" strokeWidth="1.5"/>
      <circle cx="36" cy="36" r="3" fill="#333"/>
      <line x1="36" y1="8" x2="36" y2="20" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="36" y1="52" x2="36" y2="64" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="8" y1="36" x2="20" y2="36" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="52" y1="36" x2="64" y2="36" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function EmptyOrders() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="12" width="40" height="50" rx="3" stroke="#2a2a2a" strokeWidth="1.5"/>
      <path d="M28 12v4a8 8 0 0016 0v-4" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="34" x2="46" y2="34" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="42" x2="46" y2="42" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="26" y1="50" x2="36" y2="50" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function EmptyCart() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 16L12 24v28a4 4 0 004 4h40a4 4 0 004-4V24l-6-8z" stroke="#2a2a2a" strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="12" y1="24" x2="60" y2="24" stroke="#2a2a2a" strokeWidth="1.5"/>
      <path d="M44 32a8 8 0 01-16 0" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px',
      padding: '3.5rem 2rem', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
    }}>
      {icon}
      <div style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444', marginTop: '0.25rem' }}>
        {title}
      </div>
      {description && <p style={{ margin: 0, color: '#3a3a3a', fontSize: '0.82rem', lineHeight: 1.6, maxWidth: '260px' }}>{description}</p>}
      {action}
    </div>
  );
}
