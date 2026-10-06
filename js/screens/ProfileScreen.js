// Screen 5: Profile & Settings Screen
window.ProfileScreen = function ProfileScreen({ user, onUpdateUser, onLogout, onDeleteAccount, onLoadDemo, onClearDemo, onClearAllEntries, showToast }) {
  const [name, setName] = React.useState(user.name || '');
  const [bio, setBio] = React.useState(user.bio || '');
  const [preferredTime, setPreferredTime] = React.useState(user.preferredTime || '20:30');
  const [theme, setTheme] = React.useState(document.documentElement.getAttribute('data-theme') || user.theme || 'light');

  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const [showDeleteAccConfirm, setShowDeleteAccConfirm] = React.useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = window.AuthService.updateProfile({ name, bio, preferredTime, theme });
    if (updated) {
      onUpdateUser(updated);
      showToast('Profile settings updated.', 'success');
    }
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    window.AuthService.updateProfile({ theme: newTheme });
    showToast(`Theme changed to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}.`, 'info');
  };

  const handleExportJSON = () => {
    window.StorageService.exportJSON(user.id);
    showToast('JSON backup file generated.', 'success');
  };

  const handleExportMarkdown = () => {
    window.StorageService.exportMarkdown(user.id);
    showToast('Markdown export file generated.', 'success');
  };

  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          let count = 0;
          imported.forEach(entry => {
            if (entry.title || entry.content) {
              window.StorageService.saveEntry(user.id, entry);
              count++;
            }
          });
          showToast(`Imported ${count} entries successfully!`, 'success');
          window.location.reload();
        } else {
          showToast('Invalid JSON file format.', 'error');
        }
      } catch (err) {
        showToast('Error reading import file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="profile-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="flex-between">
        <div>
          <h1 className="serif font-bold" style={{ fontSize: '1.8rem' }}>
            Profile & Settings
          </h1>
          <p className="text-secondary text-sm">
            Manage your personal preferences, theme, data backup, and account settings.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onLogout}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Details Form */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="serif font-semibold" style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>
          Personal Information
        </h2>

        <form onSubmit={handleSaveProfile}>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="user-name" className="form-label">Display Name</label>
              <input
                id="user-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="user-email" className="form-label">Email Address</label>
              <input
                id="user-email"
                type="email"
                className="form-input"
                value={user.email}
                disabled
                style={{ opacity: 0.7, backgroundColor: 'var(--bg-tertiary)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="user-bio" className="form-label">Personal Reflection Statement / Bio</label>
            <input
              id="user-bio"
              type="text"
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Journaling for mindfulness and self-growth..."
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="user-reminder" className="form-label">
              <span>Preferred Daily Writing Reminder Time</span>
            </label>
            <input
              id="user-reminder"
              type="time"
              className="form-input"
              style={{ maxWidth: '200px' }}
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Profile Changes
          </button>
        </form>
      </div>

      {/* Theme Settings */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="serif font-semibold" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
          Appearance & Theme
        </h2>
        <p className="text-secondary text-sm" style={{ marginBottom: '1.25rem' }}>
          Choose a visual ambiance that feels peaceful and comfortable for your eyes.
        </p>

        <div className="grid-3">
          <button
            type="button"
            className="card"
            style={{
              padding: '1.25rem',
              border: theme === 'light' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
              backgroundColor: '#FAF8F5',
              color: '#2C2A29',
              textAlign: 'left',
              cursor: 'pointer'
            }}
            onClick={() => handleThemeChange('light')}
          >
            <div className="font-semibold" style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>☀️ Gentle Light</div>
            <div className="text-xs" style={{ color: '#66605C' }}>Soft warm cream background with crisp sage accents.</div>
          </button>

          <button
            type="button"
            className="card"
            style={{
              padding: '1.25rem',
              border: theme === 'dark' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
              backgroundColor: '#1E2126',
              color: '#ECEAE6',
              textAlign: 'left',
              cursor: 'pointer'
            }}
            onClick={() => handleThemeChange('dark')}
          >
            <div className="font-semibold" style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>🌙 Serene Dark</div>
            <div className="text-xs" style={{ color: '#AAA69E' }}>Low-glare dark palette for peaceful evening writing.</div>
          </button>

          <button
            type="button"
            className="card"
            style={{
              padding: '1.25rem',
              border: theme === 'sepia' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
              backgroundColor: '#FCF7F0',
              color: '#382E25',
              textAlign: 'left',
              cursor: 'pointer'
            }}
            onClick={() => handleThemeChange('sepia')}
          >
            <div className="font-semibold" style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>📜 Warm Sepia</div>
            <div className="text-xs" style={{ color: '#6B5B4E' }}>Cozy book-like aesthetic with warm amber tones.</div>
          </button>
        </div>
      </div>

      {/* Privacy Guarantee & Data Backup Section */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 className="serif font-semibold" style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
          Data Privacy & Exports
        </h2>
        <p className="text-secondary text-sm" style={{ marginBottom: '1.25rem' }}>
          Your diary entries remain private to you. Data is stored safely within your web browser. You can export a backup or import entries anytime.
        </p>

        <div className="flex-gap-md" style={{ flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" onClick={handleExportJSON}>
            Export Backup (JSON)
          </button>

          <button type="button" className="btn btn-secondary" onClick={handleExportMarkdown}>
            Export Document (Markdown)
          </button>

          <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
            <span>Import Backup (JSON)</span>
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>
        </div>

        <div className="flex-gap-md" style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onLoadDemo}>
            Load Sample Demo Entries
          </button>

          <button type="button" className="btn btn-subtle btn-sm text-secondary" onClick={onClearDemo}>
            Remove Sample Demo Entries
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ padding: '2rem', borderColor: 'rgba(220, 38, 38, 0.3)' }}>
        <h2 className="serif font-semibold" style={{ fontSize: '1.25rem', color: '#DC2626', marginBottom: '0.4rem' }}>
          Account & Data Actions
        </h2>
        <p className="text-secondary text-sm" style={{ marginBottom: '1.25rem' }}>
          Destructive actions require explicit confirmation.
        </p>

        <div className="flex-gap-md" style={{ flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => setShowClearConfirm(true)}
          >
            Clear All My Entries
          </button>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => setShowDeleteAccConfirm(true)}
          >
            Delete Account & Purge Data
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <window.ConfirmModal
        isOpen={showClearConfirm}
        title="Clear All Diary Entries?"
        message="This will permanently remove all diary entries created by your account. This action cannot be reversed."
        confirmText="Yes, Clear All Entries"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => {
          setShowClearConfirm(false);
          onClearAllEntries();
          showToast('All entries cleared.', 'info');
        }}
        onCancel={() => setShowClearConfirm(false)}
      />

      <window.ConfirmModal
        isOpen={showDeleteAccConfirm}
        title="Delete Account & Data?"
        message="Are you sure you want to permanently delete your account and all stored data? You will be signed out immediately."
        confirmText="Permanently Delete Account"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={() => {
          setShowDeleteAccConfirm(false);
          onDeleteAccount();
          showToast('Account deleted.', 'info');
        }}
        onCancel={() => setShowDeleteAccConfirm(false)}
      />
    </div>
  );
};
