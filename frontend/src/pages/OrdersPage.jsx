import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_COLORS = {
  pending: { bg: '#fff8e1', color: '#856404' },
  confirmed: { bg: '#d1ecf1', color: '#0c5460' },
  shipped: { bg: '#cce5ff', color: '#004085' },
  delivered: { bg: '#d4edda', color: '#155724' },
  cancelled: { bg: '#f8d7da', color: '#721c24' },
};

const s = {
  orderCard: {
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f0f0f0',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  orderId: { fontWeight: 700, fontSize: '0.95rem' },
  statusBadge: (status) => ({
    padding: '0.2rem 0.6rem',
    borderRadius: '3px',
    fontSize: '0.8rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    ...(STATUS_COLORS[status] || { bg: '#eee', color: '#555' }),
    background: (STATUS_COLORS[status] || {}).bg,
    color: (STATUS_COLORS[status] || {}).color,
  }),
  total: { fontWeight: 700 },
  itemsList: { padding: '0.75rem 1.25rem', listStyle: 'none', margin: 0 },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.4rem 0',
    borderBottom: '1px solid #f8f8f8',
    fontSize: '0.9rem',
  },
  restrictedTag: {
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffc107',
    borderRadius: '3px',
    padding: '0.1rem 0.3rem',
    fontSize: '0.7rem',
    marginLeft: '0.35rem',
  },
  meta: { color: '#888', fontSize: '0.8rem' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/api/orders')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading orders…</p>;
  if (error) return <p style={{ color: '#c0392b' }}>{error}</p>;

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ color: '#888' }}>You haven&apos;t placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={s.orderCard}>
            <div style={s.orderHeader}>
              <span style={s.orderId}>Order #{order.id}</span>
              <span style={s.statusBadge(order.status)}>{order.status}</span>
              <span style={s.total}>€{parseFloat(order.totalPrice).toFixed(2)}</span>
              <span style={s.meta}>
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            <ul style={s.itemsList}>
              {order.OrderItems?.map((item) => (
                <li key={item.id} style={s.item}>
                  <span>
                    {item.Product?.name || `Product #${item.productId}`}
                    {item.Product?.isRestricted && (
                      <span style={s.restrictedTag}>RESTRICTED</span>
                    )}
                  </span>
                  <span style={{ color: '#555' }}>
                    {item.quantity} × €{parseFloat(item.unitPrice).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
