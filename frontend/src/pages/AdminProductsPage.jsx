import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  isRestricted: false,
};

const s = {
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  btnPrimary: {
    padding: '0.6rem 1.25rem',
    background: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  btnDanger: {
    padding: '0.35rem 0.75rem',
    background: '#c0392b',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  btnEdit: {
    padding: '0.35rem 0.75rem',
    background: '#2980b9',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    marginRight: '0.4rem',
  },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { background: '#1a1a1a', color: '#fff', padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600 },
  td: { padding: '0.75rem 1rem', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', verticalAlign: 'middle' },
  restrictedBadge: {
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffc107',
    borderRadius: '3px',
    padding: '0.1rem 0.4rem',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#fff', borderRadius: '8px', padding: '2rem', width: '100%', maxWidth: '480px',
    maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
  },
  field: { marginBottom: '1rem' },
  label: { display: 'block', marginBottom: '0.3rem', fontWeight: 500, fontSize: '0.88rem' },
  input: { width: '100%', padding: '0.5rem 0.7rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.95rem' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  modalBtns: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' },
  btnCancel: { padding: '0.6rem 1.25rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 },
  error: { background: '#fdecea', border: '1px solid #f5c6cb', borderRadius: '4px', padding: '0.6rem 0.75rem', color: '#721c24', marginBottom: '1rem', fontSize: '0.88rem' },
  success: { background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', padding: '0.6rem 0.75rem', color: '#155724', marginBottom: '1rem', fontSize: '0.88rem' },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = create mode
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
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || '',
      isRestricted: product.isRestricted,
    });
    setFormError('');
    setFormSuccess('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!form.name.trim()) {
      setFormError('Product name is required.');
      return;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) {
      setFormError('Price must be a non-negative number.');
      return;
    }
    const stock = parseInt(form.stock, 10);
    if (isNaN(stock) || stock < 0) {
      setFormError('Stock must be a non-negative integer.');
      return;
    }

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

  if (loading) return <p>Loading…</p>;
  if (pageError) return <p style={{ color: '#c0392b' }}>{pageError}</p>;

  return (
    <div>
      <div style={s.topBar}>
        <h2 style={{ margin: 0 }}>Admin – Products</h2>
        <button style={s.btnPrimary} onClick={openCreate}>+ Add Product</button>
      </div>

      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Name</th>
            <th style={s.th}>Price</th>
            <th style={s.th}>Stock</th>
            <th style={s.th}>Restricted</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#888' }}>
                No products yet.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td style={s.td}>{p.id}</td>
                <td style={s.td}>{p.name}</td>
                <td style={s.td}>€{parseFloat(p.price).toFixed(2)}</td>
                <td style={s.td}>{p.stock}</td>
                <td style={s.td}>
                  {p.isRestricted ? <span style={s.restrictedBadge}>YES</span> : '—'}
                </td>
                <td style={s.td}>
                  <button style={s.btnEdit} onClick={() => openEdit(p)}>Edit</button>
                  <button style={s.btnDanger} onClick={() => handleDelete(p)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <h3 style={{ margin: '0 0 1.25rem' }}>
              {editingProduct ? `Edit: ${editingProduct.name}` : 'New Product'}
            </h3>

            {formError && <div style={s.error}>{formError}</div>}
            {formSuccess && <div style={s.success}>{formSuccess}</div>}

            <form onSubmit={handleSave} noValidate>
              <div style={s.field}>
                <label style={s.label}>Name *</label>
                <input style={s.input} name="name" value={form.name} onChange={handleChange} required />
              </div>

              <div style={s.field}>
                <label style={s.label}>Description</label>
                <textarea
                  style={{ ...s.input, height: '80px', resize: 'vertical' }}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={s.field}>
                  <label style={s.label}>Price (€) *</label>
                  <input style={s.input} name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Stock *</label>
                  <input style={s.input} name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
                </div>
              </div>

              <div style={s.field}>
                <label style={s.label}>Image URL</label>
                <input style={s.input} name="imageUrl" type="url" value={form.imageUrl} onChange={handleChange} />
              </div>

              <div style={{ ...s.field, ...s.checkRow }}>
                <input
                  id="isRestricted"
                  name="isRestricted"
                  type="checkbox"
                  checked={form.isRestricted}
                  onChange={handleChange}
                  style={{ width: '17px', height: '17px', cursor: 'pointer' }}
                />
                <label htmlFor="isRestricted" style={{ cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}>
                  Restricted item (gun license required)
                </label>
              </div>

              <div style={s.modalBtns}>
                <button type="button" style={s.btnCancel} onClick={closeModal}>Cancel</button>
                <button type="submit" style={s.btnPrimary} disabled={saving}>
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
