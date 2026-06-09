import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const ORANGE = '#f0a500';
const BG = '#0d0d0d';
const SURFACE = '#141414';
const BORDER = '#2a2a2a';
const MUTED = '#777';

function IconBrowse({ active }) {
  const c = active ? ORANGE : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.25s' }}>
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}

function IconCart({ active }) {
  const c = active ? ORANGE : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.25s' }}>
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  );
}

function IconOrders({ active }) {
  const c = active ? ORANGE : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.25s' }}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="16" y2="17"/>
    </svg>
  );
}

function IconProfile({ active }) {
  const c = active ? ORANGE : MUTED;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.25s' }}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tabs = useMemo(() => [
    { to: '/products', label: 'Browse',  active: path.startsWith('/products') },
    { to: '/cart',     label: 'Cart',    active: path === '/cart', badge: totalItems > 0 ? totalItems : null },
    { to: '/orders',   label: 'Orders',  active: path === '/orders' },
    { to: user ? '/login' : '/login', label: user ? user.name.split(' ')[0] : 'Profile', active: path === '/login' || path === '/register' },
  ], [path, totalItems, user]);

  const activeIndex = tabs.findIndex((t) => t.active);

  return (
    <>
      {/* Top bar */}
      <nav style={{
        background: BG,
        borderBottom: `1px solid ${BORDER}`,
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '52px',
        position: 'sticky',
        top: 0,
        zIndex: 200,
      }}>
        <div style={{ width: 32 }} />
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.25em', color: ORANGE, textDecoration: 'none', textTransform: 'uppercase' }}>
          Jager
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user?.role === 'admin' && (
            <Link to="/admin/products" style={{ color: ORANGE, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
              Admin
            </Link>
          )}
          {user && (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: MUTED, fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', padding: 0 }}>
              Out
            </button>
          )}
        </div>
      </nav>

      {/* Bottom tab bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: SURFACE,
        borderTop: `1px solid ${BORDER}`,
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 200,
      }}>
        {/* Sliding top indicator */}
        {activeIndex !== -1 && (
          <div style={{
            position: 'absolute',
            top: 0,
            height: '2px',
            width: `${100 / tabs.length}%`,
            background: ORANGE,
            borderRadius: '0 0 2px 2px',
            transform: `translateX(${activeIndex * 100}%)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: `0 0 8px ${ORANGE}88`,
          }} />
        )}

        {tabs.map((tab, i) => {
          const icons = [
            <IconBrowse active={tab.active} />,
            <IconCart   active={tab.active} />,
            <IconOrders active={tab.active} />,
            <IconProfile active={tab.active} />,
          ];
          return (
            <Link
              key={tab.to + tab.label}
              to={tab.to}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                color: tab.active ? ORANGE : MUTED,
                position: 'relative',
                gap: '2px',
                transition: 'color 0.25s',
              }}
            >
              <span style={{
                position: 'relative',
                transform: tab.active ? 'scale(1.15) translateY(-1px)' : 'scale(1) translateY(0)',
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
              }}>
                {icons[i]}
                {tab.badge && (
                  <span style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    background: ORANGE,
                    color: '#000',
                    borderRadius: '99px',
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    padding: '1px 4px',
                    lineHeight: 1.3,
                    minWidth: 14,
                    textAlign: 'center',
                  }}>
                    {tab.badge}
                  </span>
                )}
              </span>
              <span style={{
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginTop: '3px',
                color: tab.active ? ORANGE : MUTED,
                transition: 'color 0.25s',
              }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
