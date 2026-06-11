import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import OrderStatusTimeline from '../components/OrderStatusTimeline';
import { useToast } from '../context/ToastContext';
import EmptyState, { EmptyOrders } from '../components/EmptyState';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const SURFACE2 = '#1e1e1e';
const BORDER = '#2a2a2a';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLOR = {
  pending:   ORANGE,
  confirmed: '#64b5f6',
  shipped:   '#4fc3f7',
  delivered: '#81c784',
  cancelled: '#e57373',
};

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingStatus, setPendingStatus] = useState({});
  const [saving, setSaving] = useState({});

  const load = () => {
    setLoading(true);
    api.get('/api/orders/admin')
      .then(res => {
        setOrders(res.data.orders);
        const initial = {};
        res.data.orders.forEach(o => { initial[o.id] = o.status; });
        setPendingStatus(initial);
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleUpdate = async (orderId) => {
    const status = pendingStatus[orderId];
    setSaving(prev => ({ ...prev, [orderId]: true }));
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast('success', `Order #${orderId} → ${status}`);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Admin</div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Orders</h2>
        </div>
        {!loading && <span style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{orders.length} orders</span>}
      </div>

      {loading ? (
        <p style={{ color: '#555' }}>Loading…</p>
      ) : orders.length === 0 ? (
        <EmptyState icon={<EmptyOrders />} title="No orders yet" description="Orders will appear here once customers start purchasing." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map(order => {
            const color = STATUS_COLOR[order.status] || '#666';
            const changed = pendingStatus[order.id] !== order.status;

            return (
              <div key={order.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', padding: '0.9rem 1.1rem', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order </span>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#eee' }}>#{order.id}</span>
                    {order.User && (
                      <span style={{ fontSize: '0.75rem', color: '#555', marginLeft: '0.75rem' }}>
                        {order.User.name} · {order.User.email}
                      </span>
                    )}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>€{parseFloat(order.totalPrice).toFixed(2)}</span>
                  <span style={{ fontSize: '0.72rem', color: '#444' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Timeline */}
                <div style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <OrderStatusTimeline status={order.status} />
                </div>

                {/* Items */}
                <div style={{ padding: '0.75rem 1.1rem', borderBottom: `1px solid ${BORDER}` }}>
                  {order.OrderItems?.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #1a1a1a', fontSize: '0.82rem' }}>
                      <span style={{ color: '#aaa' }}>
                        {item.Product?.name || `#${item.productId}`}
                        {item.Product?.isRestricted && <span style={{ color: ORANGE, fontSize: '0.62rem', marginLeft: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>· Restricted</span>}
                      </span>
                      <span style={{ color: '#555', marginLeft: '1rem', flexShrink: 0 }}>{item.quantity} × €{parseFloat(item.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Status control */}
                <div style={{ padding: '0.85rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', fontWeight: 700 }}>Status</span>
                  <select
                    value={pendingStatus[order.id] ?? order.status}
                    onChange={e => setPendingStatus(prev => ({ ...prev, [order.id]: e.target.value }))}
                    style={{
                      background: SURFACE2, border: `1px solid ${changed ? ORANGE + '66' : BORDER}`,
                      color: STATUS_COLOR[pendingStatus[order.id]] || '#aaa',
                      borderRadius: '4px', padding: '0.4rem 0.65rem',
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em',
                      cursor: 'pointer', outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleUpdate(order.id)}
                    disabled={!changed || saving[order.id]}
                    style={{
                      padding: '0.4rem 0.9rem',
                      background: changed && !saving[order.id] ? ORANGE : '#1a1a1a',
                      color: changed && !saving[order.id] ? '#000' : '#333',
                      border: 'none', borderRadius: '4px',
                      fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.08em',
                      textTransform: 'uppercase', cursor: changed && !saving[order.id] ? 'pointer' : 'not-allowed',
                      transition: 'all 0.15s',
                    }}
                  >
                    {saving[order.id] ? '…' : 'Update'}
                  </button>
                  {!changed && (
                    <span style={{
                      fontSize: '0.62rem', color: color, letterSpacing: '0.1em',
                      textTransform: 'uppercase', fontWeight: 700,
                      border: `1px solid ${color}33`, background: `${color}11`,
                      borderRadius: '3px', padding: '0.2rem 0.5rem',
                    }}>
                      {order.status}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
