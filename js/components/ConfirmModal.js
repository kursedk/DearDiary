// Accessible Confirmation Modal Dialog
window.ConfirmModal = function ConfirmModal({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false, onConfirm, onCancel }) {
  if (!isOpen) return null;

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <h3 id="modal-title" className="font-semibold" style={{ fontSize: '1.1rem', color: isDanger ? '#DC2626' : 'var(--text-primary)' }}>
            {title}
          </h3>
          <button type="button" className="btn-subtle btn-icon-only" onClick={onCancel} aria-label="Close modal">
            &times;
          </button>
        </div>
        <div className="modal-body text-secondary" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
          {message}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
