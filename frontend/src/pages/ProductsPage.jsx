import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const s = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'box-shadow 0.15s',
  },
  img: { width: '100%', height: '180px', objectFit: 'cover', background: '#eee' },
  imgPlaceholder: {
    width: '100%',
    height: '180px',
    background: '#e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999',
    fontSize: '0.85rem',
  },
  body: { padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' },
  nameRow: { display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginBottom: '0.4rem' },
  name: { fontWeight: 600, fontSize: '0.95rem', flex: 1 },
  lockBadge: {
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffc107',
    borderRadius: '3px',
    padding: '0.1rem 0.35rem',
    fontSize: '0.72rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  price: { fontWeight: 700, color: '#1a1a1a', fontSize: '1.05rem', marginTop: 'auto', paddingTop: '0.5rem' },
  outOfStock: { color: '#c0392b', fontSize: '0.8rem', marginTop: '0.25rem' },
  addBtn: {
    marginTop: '0.75rem',
    padding: '0.45rem 0.75rem',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
  addedBtn: {
    marginTop: '0.75rem',
    padding: '0.45rem 0.75rem',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'default',
    width: '100%',
  },
  disabledBtn: {
    marginTop: '0.75rem',
    padding: '0.45rem 0.75rem',
    background: '#ccc',
    color: '#888',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'not-allowed',
    width: '100%',
  },
  error: { color: '#c0392b', padding: '1rem 0' },
  empty: { color: '#888', padding: '1rem 0' },
};

export default function ProductsPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Track which product ids were just added (for brief feedback)
  const [justAdded, setJustAdded] = useState({});

  useEffect(() => {
    api
      .get('/api/products')
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // don't navigate to product page
    addItem(product, 1);
    setJustAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setJustAdded((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  if (loading) return <p>Loading products…</p>;
  if (error) return <p style={s.error}>{error}</p>;

  return (
    <div>
      <div style={s.header}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <span style={{ color: '#888', fontSize: '0.9rem' }}>{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <p style={s.empty}>No products available yet.</p>
      ) : (
        <div style={s.grid}>
          {products.map((p) => (
            <Link key={p.id} to={`/products/${p.id}`} style={s.card}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.name} style={s.img} />
              ) : (
                <div style={s.imgPlaceholder}>No image</div>
              )}
              <div style={s.body}>
                <div style={s.nameRow}>
                  <span style={s.name}>{p.name}</span>
                  {p.isRestricted && <span style={s.lockBadge}>LICENSE REQ.</span>}
                </div>
                {p.description && (
                  <p style={{ margin: '0 0 0.5rem', color: '#666', fontSize: '0.85rem', lineHeight: 1.4 }}>
                    {p.description.length > 80 ? p.description.slice(0, 80) + '…' : p.description}
                  </p>
                )}
                <div style={s.price}>€{parseFloat(p.price).toFixed(2)}</div>
                {p.stock === 0 && <div style={s.outOfStock}>Out of stock</div>}
                {p.stock > 0 ? (
                  <button
                    style={justAdded[p.id] ? s.addedBtn : s.addBtn}
                    onClick={(e) => handleAddToCart(e, p)}
                    disabled={justAdded[p.id]}
                  >
                    {justAdded[p.id] ? 'Added!' : 'Add to Cart'}
                  </button>
                ) : (
                  <button style={s.disabledBtn} disabled onClick={(e) => e.preventDefault()}>
                    Out of Stock
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
