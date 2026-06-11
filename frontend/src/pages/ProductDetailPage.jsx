import React, { useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const SURFACE2 = '#1e1e1e';
const BORDER = '#2a2a2a';

function Lightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'toast-in 0.2s ease both',
      }}
    >
      <img
        src={src} alt={alt}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '92vw', maxHeight: '88vh', objectFit: 'contain',
          borderRadius: '4px', boxShadow: '0 0 80px rgba(0,0,0,0.8)',
          animation: 'toast-in 0.25s cubic-bezier(0.4,0,0.2,1) both',
        }}
      />
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: '1.25rem', right: '1.5rem',
          background: 'none', border: 'none', color: '#666',
          fontSize: '1.75rem', cursor: 'pointer', lineHeight: 1, padding: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#eee'}
        onMouseLeave={e => e.currentTarget.style.color = '#666'}
      >
        ✕
      </button>
    </div>,
    document.body
  );
}

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 0',
          background: 'none',
          border: 'none',
          color: '#aaa',
          cursor: 'pointer',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}
      >
        <span>{title}</span>
        <span style={{ color: open ? ORANGE : '#444', fontSize: '1.1rem', lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && <div style={{ paddingBottom: '1rem' }}>{children}</div>}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { addItem, items } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [lightbox, setLightbox] = useState(false);
  const closeLightbox = useCallback(() => setLightbox(false), []);

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setFetchError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    const inCart = items.find((i) => i.productId === product.id)?.quantity || 0;
    const available = product.stock - inCart;
    if (quantity > available) {
      showToast('error', available === 0
        ? `No more available — you already have the full stock in your cart.`
        : `Only ${available} more available (${inCart} already in cart).`);
      return;
    }
    addItem(product, quantity);
    showToast('success', `${quantity} × "${product.name}" added to loadout`);
  };

  const canBuyRestricted = user && user.hasGunLicense && user.age >= 18;

  if (loading) return <p style={{ color: '#666', padding: '2rem 0' }}>Loading…</p>;
  if (fetchError) return <p style={{ color: '#e74c3c' }}>{fetchError}</p>;
  if (!product) return null;

  const cartQty = items.find((i) => i.productId === product.id)?.quantity || 0;
  const availableStock = product.stock - cartQty;
  const outOfStock = availableStock === 0;
  const purchaseBlocked = product.isRestricted && (!user || !canBuyRestricted);

  return (
    <div>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#555', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        ← Back
      </Link>

      {/* Hero image */}
      <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem', background: '#111', aspectRatio: '16/9', maxHeight: '340px' }}>
        {lightbox && product.imageUrl && <Lightbox src={product.imageUrl} alt={product.name} onClose={closeLightbox} />}
      {product.imageUrl ? (
          <img
            src={product.imageUrl} alt={product.name}
            onClick={() => setLightbox(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', cursor: 'zoom-in' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            No image available
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)', pointerEvents: 'none' }} />
        {/* Title on image */}
        <div style={{ position: 'absolute', bottom: '1.25rem', left: '1.25rem', right: '1.25rem' }}>
          {product.isRestricted && (
            <span style={{ display: 'inline-block', background: 'rgba(240,165,0,0.15)', color: ORANGE, border: `1px solid rgba(240,165,0,0.3)`, borderRadius: '3px', padding: '0.15rem 0.5rem', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              License Required
            </span>
          )}
          <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.75rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {product.name}
          </h1>
        </div>
      </div>

      {/* Price + stock row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
          €{parseFloat(product.price).toFixed(2)}
        </span>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: product.stock === 0 ? '#e74c3c' : '#555' }}>
          {product.stock === 0 ? 'Out of stock' : outOfStock ? 'All stock in cart' : `${availableStock} in stock`}
          {cartQty > 0 && product.stock > 0 && !outOfStock && ` · ${cartQty} in cart`}
        </span>
      </div>

      {/* Action area */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        {/* Restriction warnings */}
        {product.isRestricted && !user && (
          <div style={{ borderLeft: `3px solid ${ORANGE}`, paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>
            Restricted item. <Link to="/login" style={{ color: ORANGE }}>Sign in</Link> with a verified gun license to purchase.
          </div>
        )}
        {product.isRestricted && user && !user.hasGunLicense && (
          <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>
            A valid gun license is required. Your account does not have one on record.
          </div>
        )}
        {product.isRestricted && user && user.hasGunLicense && user.age < 18 && (
          <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#888', lineHeight: 1.6 }}>
            Must be 18+ to purchase restricted items.
          </div>
        )}

        {!purchaseBlocked && !outOfStock && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontWeight: 700 }}>Qty</span>
            <div style={{ display: 'flex', alignItems: 'center', background: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: '4px', overflow: 'hidden' }}>
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ width: 36, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem' }}>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))} style={{ width: 36, height: 36, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
          </div>
        )}

        <button
          onClick={handleAddToCart}
          disabled={purchaseBlocked || outOfStock}
          style={{
            width: '100%',
            padding: '0.85rem',
            background: purchaseBlocked || outOfStock ? '#1a1a1a' : ORANGE,
            color: purchaseBlocked || outOfStock ? '#444' : '#000',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 800,
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: purchaseBlocked || outOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          {outOfStock ? 'Out of Stock' : purchaseBlocked ? 'License Required' : 'Add to Loadout'}
        </button>
      </div>

      {/* Accordion sections */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '0 1.25rem' }}>
        <Section title="Information" defaultOpen={true}>
          {product.description ? (
            <p style={{ margin: 0, color: '#888', fontSize: '0.88rem', lineHeight: 1.7 }}>{product.description}</p>
          ) : (
            <p style={{ margin: 0, color: '#444', fontSize: '0.85rem' }}>No description available.</p>
          )}
        </Section>

        <Section title="Specifications">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0', fontSize: '0.8rem' }}>
            {[
              ['SKU', `PRD-${String(product.id).padStart(4, '0')}`],
              ['Status', product.stock > 0 ? 'In Stock' : 'Unavailable'],
              ['Type', product.isRestricted ? 'Restricted' : 'Standard'],
              ['Price', `€${parseFloat(product.price).toFixed(2)}`],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <div style={{ padding: '0.6rem 0', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700, borderBottom: `1px solid #1a1a1a` }}>{k}</div>
                <div style={{ padding: '0.6rem 0', color: '#ccc', borderBottom: `1px solid #1a1a1a`, textAlign: 'right' }}>{v}</div>
              </React.Fragment>
            ))}
          </div>
        </Section>

        <Section title="Purchasing Info">
          <div style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.7 }}>
            {product.isRestricted ? (
              <>This is a <span style={{ color: ORANGE }}>restricted item</span>. A valid firearms license and minimum age of 18 are required for purchase. Verification is performed at checkout.</>
            ) : (
              <>This item is available for purchase without special licensing requirements. Add to your loadout and proceed to checkout when ready.</>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
}
