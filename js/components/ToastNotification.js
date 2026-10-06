// Toast Notification System Component
window.ToastNotification = function ToastNotification({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`} role="status">
          <div style={{ flex: 1, fontSize: '0.9rem' }}>
            {toast.message}
          </div>
          <button
            type="button"
            className="btn-subtle btn-icon-only"
            style={{ padding: '0.2rem', color: 'var(--text-muted)' }}
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast notification"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};
