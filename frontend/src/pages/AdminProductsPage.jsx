import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const SURFACE2 = '#1e1e1e';
const BORDER = '#2a2a2a';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', imageUrl: '', isRestricted: false };

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem',
  background: '#0d0d0d',
  border: `1px solid ${BORDER}`,
  borderRadius: '4px',
  fontSize: '0.9rem',
  color: '#eee',
  outline: 'none',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.35rem',
  fontWeight: 700,
  fontSize: '0.62rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#666',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/api/products')
      .then((res) => setProducts(res.data.products))
      .catch(() => setPageError('Failed to load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({ name: product.name, description: product.description || '', price: product.price, stock: product.stock, imageUrl: product.imageUrl || '', isRestricted: product.isRestricted });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.name.trim()) { setFormError('Product name is required.'); return; }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) { setFormError('Price must be a non-negative number.'); return; }
    const stock = parseInt(form.stock, 10);
    if (isNaN(stock) || stock < 0) { setFormError('Stock must be a non-negative integer.'); return; }
    setSaving(true);
    try {
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct.id}`, form);
        setFormSuccess('Product updated.');
      } else {
        await api.post('/api/products', form);
        setFormSuccess('Product created.');
      }
      load();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/products/${product.id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <p style={{ color: '#666', padding: '2rem 0' }}>Loading…</p>;
  if (pageError) return <p style={{ color: '#e74c3c' }}>{pageError}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Admin</div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Products</h2>
        </div>
        <button
          onClick={openCreate}
          style={{ padding: '0.55rem 1.1rem', background: ORANGE, color: '#000', border: 'none', borderRadius: '4px', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}
        >
          + Add Product
        </button>
      </div>

      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              {['ID', 'Name', 'Price', 'Stock', 'Restricted', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', color: '#555', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#444' }}>No products yet.</td>
              </tr>
            ) : products.map((p) => (
              <tr key={p.id} style={{ borderBottom: `1px solid #1a1a1a` }}>
                <td style={{ padding: '0.7rem 1rem', color: '#555' }}>{p.id}</td>
                <td style={{ padding: '0.7rem 1rem', color: '#ddd', fontWeight: 600 }}>{p.name}</td>
                <td style={{ padding: '0.7rem 1rem', color: '#aaa' }}>€{parseFloat(p.price).toFixed(2)}</td>
                <td style={{ padding: '0.7rem 1rem', color: '#aaa' }}>{p.stock}</td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  {p.isRestricted
                    ? <span style={{ color: ORANGE, fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Yes</span>
                    : <span style={{ color: '#333' }}>—</span>}
                </td>
                <td style={{ padding: '0.7rem 1rem' }}>
                  <button onClick={() => openEdit(p)} style={{ marginRight: '0.5rem', padding: '0.3rem 0.7rem', background: SURFACE2, color: '#aaa', border: `1px solid ${BORDER}`, borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p)} style={{ padding: '0.3rem 0.7rem', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c33', borderRadius: '3px', fontSize: '0.75rem', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: '1rem' }}
        >
          <div style={{ background: '#0f0f0f', border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '1.75rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontWeight: 800 }}>
              {editingProduct ? `Edit: ${editingProduct.name}` : 'New Product'}
            </h3>

            {formError && <div style={{ borderLeft: '3px solid #e74c3c', paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#e74c3c' }}>{formError}</div>}
            {formSuccess && <div style={{ borderLeft: `3px solid #4caf50`, paddingLeft: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#4caf50' }}>{formSuccess}</div>}

            <form onSubmit={handleSave} noValidate>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, height: '80px', resize: 'vertical' }} name="description" value={form.description} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={labelStyle}>Price (€) *</label>
                  <input style={inputStyle} name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                </div>
                <div>
                  <label style={labelStyle}>Stock *</label>
                  <input style={inputStyle} name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Image URL</label>
                <input style={inputStyle} name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.75rem', background: '#0d0d0d', border: `1px solid ${BORDER}`, borderRadius: '4px' }}>
                <input id="isRestricted" name="isRestricted" type="checkbox" checked={form.isRestricted} onChange={handleChange} style={{ width: 17, height: 17, cursor: 'pointer', accentColor: ORANGE, flexShrink: 0 }} />
                <label htmlFor="isRestricted" style={{ cursor: 'pointer', fontSize: '0.82rem', color: '#aaa' }}>Restricted item (gun license required)</label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={closeModal} style={{ padding: '0.6rem 1.1rem', background: 'none', border: `1px solid ${BORDER}`, color: '#666', borderRadius: '4px', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ padding: '0.6rem 1.25rem', background: saving ? '#1a1a1a' : ORANGE, color: saving ? '#444' : '#000', border: 'none', borderRadius: '4px', fontWeight: 800, fontSize: '0.82rem', cursor: saving ? 'not-allowed' : 'pointer', letterSpacing: '0.05em' }}>
                  {saving ? 'Saving…' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
