import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

const ORANGE = '#f0a500';
const COLORS = {
  success: '#4caf50',
  error:   '#e74c3c',
  info:    ORANGE,
};

function ToastItem({ toast, onDismiss }) {
  const [leaving, setLeaving] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setLeaving(true);
    setTimeout(() => onDismiss(toast.id), 280);
  }, [toast.id, onDismiss]);

  React.useEffect(() => {
    const t = setTimeout(dismiss, 3000);
    return () => clearTimeout(t);
  }, [dismiss]);

  const color = COLORS[toast.type] || ORANGE;

  return (
    <div
      onClick={dismiss}
      style={{
        background: '#141414',
        border: `1px solid ${color}33`,
        borderLeft: `3px solid ${color}`,
        borderRadius: '6px',
        padding: '0.75rem 1rem',
        color: '#eee',
        fontSize: '0.85rem',
        lineHeight: 1.4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        cursor: 'pointer',
        animation: `${leaving ? 'toast-out' : 'toast-in'} 0.28s cubic-bezier(0.4,0,0.2,1) both`,
        userSelect: 'none',
      }}
    >
      {toast.text}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((type, text) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, text }]);
  }, []);

  const portal = ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      bottom: 80,
      left: '1rem',
      right: '1rem',
      zIndex: 400,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={dismiss} />
        </div>
      ))}
    </div>,
    document.body
  );

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      {portal}
    </ToastCtx.Provider>
  );
}
