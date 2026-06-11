import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ORANGE = '#f0a500';
const SURFACE = '#141414';
const BORDER = '#2a2a2a';

const STATUS = {
  pending:   { color: ORANGE,     label: 'Pending' },
  confirmed: { color: '#64b5f6',  label: 'Confirmed' },
  shipped:   { color: '#4fc3f7',  label: 'Shipped' },
  delivered: { color: '#81c784',  label: 'Delivered' },
  cancelled: { color: '#e57373',  label: 'Cancelled' },
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

  if (loading) return <p style={{ color: '#666', padding: '2rem 0' }}>Loading orders…</p>;
  if (error) return <p style={{ color: '#e74c3c' }}>{error}</p>;

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: ORANGE, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Jager</div>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>My Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '3rem 2rem', textAlign: 'center', color: '#555' }}>
          <p style={{ margin: 0 }}>You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map((order) => {
            const st = STATUS[order.status] || { color: '#666', label: order.status };
            return (
              <div key={order.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1.1rem', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Order </span>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#eee' }}>#{order.id}</span>
                  </div>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: st.color,
                    border: `1px solid ${st.color}33`,
                    background: `${st.color}11`,
                    borderRadius: '3px',
                    padding: '0.2rem 0.55rem',
                  }}>
                    {st.label}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>€{parseFloat(order.totalPrice).toFixed(2)}</span>
                    <span style={{ fontSize: '0.72rem', color: '#444' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: '0.75rem 1.1rem' }}>
                  {order.OrderItems?.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: `1px solid #1a1a1a`, fontSize: '0.82rem' }}>
                      <span style={{ color: '#aaa' }}>
                        {item.Product?.name || `Product #${item.productId}`}
                        {item.Product?.isRestricted && (
                          <span style={{ color: ORANGE, fontSize: '0.62rem', marginLeft: '0.4rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>· Restricted</span>
                        )}
                      </span>
                      <span style={{ color: '#555', flexShrink: 0, marginLeft: '1rem' }}>
                        {item.quantity} × €{parseFloat(item.unitPrice).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
