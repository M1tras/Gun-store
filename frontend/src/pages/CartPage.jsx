import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SwipeToRemove from '../components/SwipeToRemove';
import EmptyState, { EmptyCart } from '../components/EmptyState';
import api from '../api/axios';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const SURFACE2 = '#1e1e1e';
const BORDER = '#2a2a2a';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [ordering, setOrdering] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState(null);

  const hasRestricted = items.some((i) => i.isRestricted);
  const canBuyRestricted = user && user.hasGunLicense && user.age >= 18;
  const checkoutBlocked = hasRestricted && (!user || !canBuyRestricted);

  const handleCheckout = async () => {
    if (!user) { navigate('/login'); return; }
    setCheckoutMsg(null);
    setOrdering(true);
    try {
      await api.post('/api/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      setCheckoutMsg({ type: 'success', text: 'Order placed! View it in My Orders.' });
    } catch (err) {
      setCheckoutMsg({ type: 'error', text: err.response?.data?.message || 'Failed to place order.' });
    } finally {
      setOrdering(false);
    }
  };

  const handleRemove = (item) => {
    removeItem(item.productId);
    showToast('info', `"${item.name}" removed from loadout`);
  };

  if (items.length === 0 && !checkoutMsg) {
    return (
      <div>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Jager</div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Your Loadout</h2>
        </div>
        <EmptyState
          icon={<EmptyCart />}
          title="Loadout empty"
          description="Add items from the arsenal to start building your order."
          action={<Link to="/products" style={{ color: ORANGE, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>Browse Arsenal →</Link>}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Jager</div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Your Loadout</h2>
        </div>
        {items.length > 0 && (
          <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#444', fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', padding: 0 }}>
            Clear all
          </button>
        )}
      </div>

      {checkoutMsg && (
        <div style={{
          borderLeft: `3px solid ${checkoutMsg.type === 'success' ? '#4caf50' : '#e74c3c'}`,
          paddingLeft: '0.75rem', marginBottom: '1rem',
          fontSize: '0.85rem',
          color: checkoutMsg.type === 'success' ? '#4caf50' : '#e74c3c',
        }}>
          {checkoutMsg.text}
          {checkoutMsg.type === 'success' && (
            <> · <Link to="/orders" style={{ color: ORANGE }}>View orders →</Link></>
          )}
        </div>
      )}

      {hasRestricted && !user && (
        <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>
          Cart contains restricted items. <Link to="/login" style={{ color: ORANGE }}>Sign in</Link> with a verified gun license to check out.
        </div>
      )}
      {hasRestricted && user && !canBuyRestricted && (
        <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>
          Cart contains restricted items that require a valid gun license and age 18+.
        </div>
      )}

      {items.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {items.map((item) => (
              <SwipeToRemove key={item.productId} onRemove={() => handleRemove(item)}>
                <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '0.85rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                  {/* Thumbnail */}
                  <div style={{ width: 60, height: 60, borderRadius: '6px', overflow: 'hidden', background: '#111', flexShrink: 0 }}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.6rem' }}>N/A</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/products/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#eee', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    </Link>
                    <div style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.1rem' }}>
                      SKU: PRD-{String(item.productId).padStart(4, '0')}
                      {item.isRestricted && <span style={{ color: ORANGE, marginLeft: '0.5rem' }}>· License Req.</span>}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.3rem' }}>€{item.price.toFixed(2)}</div>
                  </div>

                  {/* Qty stepper */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: '4px', overflow: 'hidden' }}>
                      <button
                        onClick={() => item.quantity <= 1 ? handleRemove(item) : updateQuantity(item.productId, item.quantity - 1)}
                        style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >−</button>
                      <span style={{ width: 28, textAlign: 'center', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{ width: 28, height: 28, background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>€{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              </SwipeToRemove>
            ))}
          </div>

          {/* Transaction summary */}
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#555', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
              Transaction Summary
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
              {[['Subtotal', `€${totalPrice.toFixed(2)}`], ['Discount', '—'], ['Shipping', 'Free']].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}>{label}</span>
                  <span style={{ color: '#aaa' }}>{value}</span>
                </div>
              ))}
              <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#aaa', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Total</span>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.1rem' }}>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutBlocked || ordering}
              style={{
                width: '100%', padding: '0.9rem',
                background: checkoutBlocked || ordering ? '#1a1a1a' : ORANGE,
                color: checkoutBlocked || ordering ? '#444' : '#000',
                border: 'none', borderRadius: '4px', fontWeight: 800,
                fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: checkoutBlocked || ordering ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              <span>🔒</span>
              <span>{ordering ? 'Placing order…' : 'Secure Checkout'}</span>
            </button>

            {!user && (
              <p style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: '#444' }}>
                <Link to="/login" style={{ color: ORANGE }}>Sign in</Link> to complete your order
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
