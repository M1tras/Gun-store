import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  empty: { color: '#888', padding: '2rem 0', textAlign: 'center' },
  table: { width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' },
  th: { textAlign: 'left', padding: '0.6rem 0.75rem', borderBottom: '2px solid #eee', fontWeight: 600, fontSize: '0.85rem', color: '#555' },
  td: { padding: '0.75rem', borderBottom: '1px solid #f0f0f0', verticalAlign: 'middle' },
  img: { width: '52px', height: '52px', objectFit: 'cover', borderRadius: '4px', background: '#eee' },
  imgPlaceholder: { width: '52px', height: '52px', background: '#e0e0e0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#aaa' },
  productName: { fontWeight: 600, fontSize: '0.95rem' },
  badge: { display: 'inline-block', background: '#fff3cd', color: '#856404', border: '1px solid #ffc107', borderRadius: '3px', padding: '0.1rem 0.35rem', fontSize: '0.7rem', fontWeight: 600, marginLeft: '0.4rem' },
  qtyInput: { width: '60px', padding: '0.35rem 0.5rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.9rem', textAlign: 'center' },
  removeBtn: { background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '0.85rem', padding: '0.25rem 0.5rem' },
  summary: { display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', alignItems: 'center', borderTop: '2px solid #eee', paddingTop: '1rem' },
  total: { fontSize: '1.2rem', fontWeight: 700 },
  checkoutBtn: { padding: '0.75rem 2rem', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  clearBtn: { padding: '0.75rem 1.25rem', background: 'transparent', color: '#888', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.9rem', cursor: 'pointer' },
  success: { background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', padding: '0.75rem 1rem', color: '#155724', marginBottom: '1rem', fontSize: '0.95rem' },
  error: { background: '#fdecea', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '0.75rem 1rem', color: '#721c24', marginBottom: '1rem', fontSize: '0.95rem' },
  warn: { background: '#fff8e1', borderLeft: '4px solid #f0a500', padding: '0.75rem 1rem', borderRadius: '4px', fontSize: '0.88rem', color: '#555', marginBottom: '1rem' },
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState(null);

  const hasRestricted = items.some((i) => i.isRestricted);
  const canBuyRestricted = user && user.hasGunLicense && user.age >= 18;
  const checkoutBlocked = hasRestricted && (!user || !canBuyRestricted);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setMessage(null);
    setOrdering(true);

    try {
      await api.post('/api/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      setMessage({ type: 'success', text: 'Order placed successfully! View it in My Orders.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to place order.' });
    } finally {
      setOrdering(false);
    }
  };

  if (items.length === 0 && !message) {
    return (
      <div>
        <h2 style={{ marginBottom: '1rem' }}>Cart</h2>
        <div style={s.empty}>
          <p>Your cart is empty.</p>
          <Link to="/products" style={{ color: '#f0a500', fontWeight: 600 }}>Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={s.header}>
        <h2 style={{ margin: 0 }}>Cart</h2>
        {items.length > 0 && (
          <button style={s.clearBtn} onClick={clearCart}>Clear cart</button>
        )}
      </div>

      {message && (
        <div style={message.type === 'success' ? s.success : s.error}>
          {message.text}
          {message.type === 'success' && (
            <> <Link to="/orders" style={{ color: 'inherit', fontWeight: 600 }}>View orders →</Link></>
          )}
        </div>
      )}

      {items.length > 0 && (
        <>
          {hasRestricted && !user && (
            <div style={s.warn}>
              Your cart contains restricted items. <Link to="/login">Sign in</Link> with a verified gun license to check out.
            </div>
          )}
          {hasRestricted && user && !canBuyRestricted && (
            <div style={s.warn}>
              Your cart contains restricted items that require a valid gun license and age 18+. Your account does not meet this requirement.
            </div>
          )}

          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}></th>
                <th style={s.th}>Product</th>
                <th style={s.th}>Unit price</th>
                <th style={s.th}>Qty</th>
                <th style={s.th}>Subtotal</th>
                <th style={s.th}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td style={s.td}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} style={s.img} />
                    ) : (
                      <div style={s.imgPlaceholder}>No img</div>
                    )}
                  </td>
                  <td style={s.td}>
                    <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span style={s.productName}>{item.name}</span>
                    </Link>
                    {item.isRestricted && <span style={s.badge}>LICENSE REQ.</span>}
                  </td>
                  <td style={s.td}>€{item.price.toFixed(2)}</td>
                  <td style={s.td}>
                    <input
                      style={s.qtyInput}
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, e.target.value)}
                    />
                  </td>
                  <td style={s.td}>€{(item.price * item.quantity).toFixed(2)}</td>
                  <td style={s.td}>
                    <button style={s.removeBtn} onClick={() => removeItem(item.productId)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={s.summary}>
            <span style={s.total}>Total: €{totalPrice.toFixed(2)}</span>
            <button
              style={{ ...s.checkoutBtn, ...(checkoutBlocked || ordering ? { background: '#aaa', cursor: 'not-allowed' } : {}) }}
              onClick={handleCheckout}
              disabled={checkoutBlocked || ordering}
            >
              {ordering ? 'Placing order…' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
