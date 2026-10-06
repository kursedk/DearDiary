// Header and Navbar Navigation Component
window.Navbar = function Navbar({ currentRoute, setRoute, user, onNewEntry, entries = [], onOpenEntry }) {
  const [showRemindersModal, setShowRemindersModal] = React.useState(false);

  if (!user) return null; // Don't render nav bar on auth screen

  const activeReminders = (entries || [])
    .filter(e => e.reminder && e.reminder.enabled && e.reminder.datetime)
    .sort((a, b) => new Date(a.reminder.datetime).getTime() - new Date(b.reminder.datetime).getTime());

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <span className="nav-brand-title serif font-semibold">DearDiary</span>
      </div>

      <div className="nav-links">
        <button
          className={`nav-item ${currentRoute === 'home' ? 'active' : ''}`}
          onClick={() => setRoute('home')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${currentRoute === 'write' ? 'active' : ''}`}
          onClick={onNewEntry}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span>Write</span>
        </button>

        <button
          className={`nav-item ${currentRoute === 'history' ? 'active' : ''}`}
          onClick={() => setRoute('history')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>History</span>
        </button>

        <button
          className={`nav-item ${currentRoute === 'profile' ? 'active' : ''}`}
          onClick={() => setRoute('profile')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Settings</span>
        </button>
      </div>

      <div className="nav-user" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Reminders Bell Trigger */}
        <button
          type="button"
          className="btn-subtle"
          style={{
            position: 'relative',
            padding: '0.5rem',
            borderRadius: 'var(--radius-full)',
            color: activeReminders.length > 0 ? 'var(--accent-primary)' : 'var(--text-muted)'
          }}
          onClick={() => setShowRemindersModal(!showRemindersModal)}
          title={`${activeReminders.length} active memory reminders`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {activeReminders.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: 'var(--accent-warm)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                width: '17px',
                height: '17px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {activeReminders.length}
            </span>
          )}
        </button>

        <div className="user-avatar" title={user.name || user.email}>
          {(user.name || user.email).charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Reminders Popover Modal */}
      {showRemindersModal && (
        <div className="modal-overlay" onClick={() => setShowRemindersModal(false)}>
          <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔔</span>
                <h3 className="serif font-bold text-md">Scheduled Reminders</h3>
              </div>
              <button type="button" className="btn-subtle btn-icon-only" onClick={() => setShowRemindersModal(false)}>&times;</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {activeReminders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <p className="text-sm font-medium">No active reminders scheduled.</p>
                  <p className="text-xs" style={{ marginTop: '0.25rem' }}>You can link reminders to entries when writing or editing!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {activeReminders.map(e => (
                    <div
                      key={e.id}
                      className="card card-hover"
                      style={{ padding: '0.85rem 1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
                      onClick={() => {
                        setShowRemindersModal(false);
                        if (onOpenEntry) onOpenEntry(e.id);
                      }}
                    >
                      <div className="flex-between">
                        <span className="font-semibold text-sm text-primary">{e.title || 'Untitled Entry'}</span>
                        <window.ReminderBadge reminder={e.reminder} />
                      </div>
                      {e.reminder.note && (
                        <span className="text-secondary text-xs" style={{ fontStyle: 'italic' }}>
                          "{e.reminder.note}"
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowRemindersModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

