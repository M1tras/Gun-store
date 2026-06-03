import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const s = {
  card: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 0,
  },
  img: { width: '100%', height: '360px', objectFit: 'cover', display: 'block', background: '#eee' },
  imgPlaceholder: {
    width: '100%',
    height: '360px',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#aaa',
    fontSize: '1rem',
  },
  info: { padding: '2rem', display: 'flex', flexDirection: 'column' },
  name: { margin: '0 0 0.5rem', fontSize: '1.5rem', fontWeight: 700 },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffc107',
    borderRadius: '4px',
    padding: '0.25rem 0.6rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    marginBottom: '1rem',
    width: 'fit-content',
  },
  price: { fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.5rem' },
  stock: { color: '#555', fontSize: '0.9rem', marginBottom: '1.5rem' },
  desc: { color: '#555', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' },
  qtyInput: {
    width: '70px',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    textAlign: 'center',
  },
  btn: {
    padding: '0.75rem 1.75rem',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnDisabled: {
    padding: '0.75rem 1.75rem',
    background: '#aaa',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  warn: {
    background: '#fff8e1',
    borderLeft: '4px solid #f0a500',
    padding: '0.75rem 1rem',
    borderRadius: '4px',
    fontSize: '0.88rem',
    color: '#555',
    marginBottom: '1rem',
  },
  success: {
    background: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '4px',
    padding: '0.6rem 0.75rem',
    color: '#155724',
    marginBottom: '1rem',
    fontSize: '0.9rem',
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
  back: { display: 'inline-block', marginBottom: '1rem', color: '#555', fontSize: '0.9rem', textDecoration: 'none' },
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    api
      .get(`/api/products/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => setFetchError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setMessage({ type: 'success', text: `Added ${quantity} × "${product.name}" to cart.` });
  };

  // Determine if the user can purchase a restricted item
  const canBuyRestricted = user && user.hasGunLicense && user.age >= 18;

  if (loading) return <p>Loading…</p>;
  if (fetchError) return <p style={{ color: '#c0392b' }}>{fetchError}</p>;
  if (!product) return null;

  const outOfStock = product.stock === 0;
  const purchaseBlocked = product.isRestricted && (!user || !canBuyRestricted);

  return (
    <div>
      <Link to="/products" style={s.back}>← Back to products</Link>

      <div style={s.card}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} style={s.img} />
        ) : (
          <div style={s.imgPlaceholder}>No image available</div>
        )}

        <div style={s.info}>
          <h1 style={s.name}>{product.name}</h1>

          {product.isRestricted && (
            <div style={s.badge}>
              <span>🔒</span> Licensed firearms/restricted item
            </div>
          )}

          <div style={s.price}>€{parseFloat(product.price).toFixed(2)}</div>
          <div style={s.stock}>
            {outOfStock ? (
              <span style={{ color: '#c0392b', fontWeight: 600 }}>Out of stock</span>
            ) : (
              <span>{product.stock} in stock</span>
            )}
          </div>

          {product.description && <p style={s.desc}>{product.description}</p>}

          {/* Warnings for restricted item access */}
          {product.isRestricted && !user && (
            <div style={s.warn}>
              This is a restricted item. Please <Link to="/login">sign in</Link> with a verified gun
              license to purchase.
            </div>
          )}
          {product.isRestricted && user && !user.hasGunLicense && (
            <div style={s.warn}>
              A valid gun license is required to purchase this item. Your account does not have a
              gun license on record.
            </div>
          )}
          {product.isRestricted && user && user.hasGunLicense && user.age < 18 && (
            <div style={s.warn}>
              You must be 18 years or older to purchase restricted items.
            </div>
          )}

          {message && (
            <div style={message.type === 'success' ? s.success : s.error}>{message.text}</div>
          )}

          {!purchaseBlocked && !outOfStock && (
            <div style={s.qtyRow}>
              <label style={{ fontWeight: 500 }}>Qty:</label>
              <input
                style={s.qtyInput}
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          )}

          <button
            style={purchaseBlocked || outOfStock ? s.btnDisabled : s.btn}
            onClick={handleAddToCart}
            disabled={purchaseBlocked || outOfStock}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          {!purchaseBlocked && !outOfStock && (
            <Link to="/cart" style={{ marginTop: '0.5rem', fontSize: '0.88rem', color: '#555', display: 'inline-block' }}>
              View cart →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
