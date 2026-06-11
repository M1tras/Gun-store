import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const styles = {
  nav: {
    background: '#1a1a1a',
    color: '#fff',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '56px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontWeight: 700,
    fontSize: '1.25rem',
    textDecoration: 'none',
    color: '#f0a500',
    letterSpacing: '0.05em',
  },
  links: {
    display: 'flex',
    gap: '1.25rem',
    alignItems: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  link: {
    color: '#ddd',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.15s',
  },
  adminLink: {
    color: '#f0a500',
    textDecoration: 'none',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  btn: {
    background: 'transparent',
    border: '1px solid #555',
    color: '#ddd',
    padding: '0.3rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  userInfo: {
    fontSize: '0.85rem',
    color: '#aaa',
    marginRight: '0.5rem',
  },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>JAGER</Link>
      <ul style={styles.links}>
        <li><Link to="/products" style={styles.link}>Products</Link></li>
        <li>
          <Link to="/cart" style={{ ...styles.link, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Cart
            {totalItems > 0 && (
              <span style={{
                background: '#f0a500',
                color: '#1a1a1a',
                borderRadius: '10px',
                padding: '0.05rem 0.45rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                lineHeight: '1.4',
              }}>
                {totalItems}
              </span>
            )}
          </Link>
        </li>

        {user ? (
          <>
            <li><Link to="/orders" style={styles.link}>My Orders</Link></li>
            {user.role === 'admin' && (
              <li><Link to="/admin/products" style={styles.adminLink}>Admin</Link></li>
            )}
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={styles.userInfo}>{user.name}</span>
              <button style={styles.btn} onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={styles.link}>Login</Link></li>
            <li><Link to="/register" style={styles.link}>Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
