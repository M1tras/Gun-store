import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SkeletonCard } from '../components/SkeletonCard';
import EmptyState, { EmptyProducts } from '../components/EmptyState';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const SURFACE2 = '#1e1e1e';
const BORDER = '#2a2a2a';

export default function ProductsPage() {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [justAdded, setJustAdded] = useState({});
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .get('/api/products')
      .then((res) => setProducts(res.data.products))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addItem(product, 1);
    setJustAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setJustAdded((prev) => ({ ...prev, [product.id]: false })), 1500);
    showToast('success', `"${product.name}" added to loadout`);
  };

  const filtered = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Jager</div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Arsenal</h2>
        </div>
        {!loading && <span style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{filtered.length} items</span>}
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <svg style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search arsenal…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 2.5rem 0.65rem 2.4rem',
            background: SURFACE,
            border: `1px solid ${query ? 'rgba(240,165,0,0.35)' : BORDER}`,
            borderRadius: '6px',
            color: '#eee',
            fontSize: '0.88rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}
          >
            ✕
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem' }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? <div style={{ gridColumn: '1/-1' }}><EmptyState icon={<EmptyProducts />} title={query ? 'No results' : 'Arsenal empty'} description={query ? `Nothing matched "${query}". Try a different term.` : 'No products have been added yet.'} /></div>
            : filtered.map((p) => {
                const hovered = hoveredId === p.id;
                return (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div style={{
                      background: SURFACE,
                      border: `1px solid ${hovered ? 'rgba(240,165,0,0.45)' : BORDER}`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                      boxShadow: hovered ? '0 8px 24px rgba(240,165,0,0.12)' : 'none',
                      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    }}>
                      {/* Image */}
                      <div style={{ position: 'relative', height: '180px', background: '#111', overflow: 'hidden' }}>
                        {p.imageUrl ? (
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            style={{
                              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                              transform: hovered ? 'scale(1.06)' : 'scale(1)',
                              transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                            }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            No image
                          </div>
                        )}
                        {p.isRestricted && (
                          <span style={{
                            position: 'absolute', top: 8, left: 8,
                            background: 'rgba(240,165,0,0.15)', color: ORANGE,
                            border: `1px solid rgba(240,165,0,0.3)`, borderRadius: '3px',
                            padding: '0.15rem 0.45rem', fontSize: '0.6rem', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                          }}>
                            License Req.
                          </span>
                        )}
                        {p.stock === 0 && (
                          <div style={{
                            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.65rem', letterSpacing: '0.15em', color: '#666', textTransform: 'uppercase',
                          }}>
                            Out of Stock
                          </div>
                        )}
                      </div>

                      {/* Body */}
                      <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#eee', lineHeight: 1.3 }}>{p.name}</div>
                        {p.description && (
                          <div style={{ color: '#555', fontSize: '0.78rem', lineHeight: 1.5 }}>
                            {p.description.length > 70 ? p.description.slice(0, 70) + '…' : p.description}
                          </div>
                        )}
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>€{parseFloat(p.price).toFixed(2)}</span>
                          {p.stock > 0 ? (
                            <button
                              onClick={(e) => handleAddToCart(e, p)}
                              disabled={justAdded[p.id]}
                              style={{
                                padding: '0.35rem 0.85rem',
                                background: justAdded[p.id] ? '#1a3a1a' : SURFACE2,
                                color: justAdded[p.id] ? '#4caf50' : ORANGE,
                                border: `1px solid ${justAdded[p.id] ? '#4caf50' : BORDER}`,
                                borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                                cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase',
                                transition: 'all 0.15s', whiteSpace: 'nowrap',
                              }}
                            >
                              {justAdded[p.id] ? '✓' : '+ Cart'}
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.72rem', color: '#555', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Unavailable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
        }
      </div>
    </div>
  );
}
