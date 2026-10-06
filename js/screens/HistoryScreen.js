// Screen 4: Diary History Screen
window.HistoryScreen = function HistoryScreen({ user, entries, onEditEntry, onDeleteEntry, showToast, onRefresh }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = React.useState('ALL');
  const [selectedTagFilter, setSelectedTagFilter] = React.useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = React.useState('ALL'); // 'ALL' | '7DAYS' | '30DAYS' | 'THIS_MONTH'
  const [attachmentFilter, setAttachmentFilter] = React.useState('ALL'); // 'ALL' | 'PHOTOS' | 'REMINDERS'
  
  // Selected detail view modal
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState(null);
  const [detailLightboxIndex, setDetailLightboxIndex] = React.useState(-1);

  // Extract all unique tags present across user entries
  const availableTags = React.useMemo(() => {
    const set = new Set();
    entries.forEach(e => {
      if (e.tags && Array.isArray(e.tags)) {
        e.tags.forEach(t => set.add(t));
      }
    });
    return Array.from(set).sort();
  }, [entries]);

  // Filtering logic
  const filteredEntries = React.useMemo(() => {
    return entries.filter(entry => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (entry.title || '').toLowerCase().includes(q);
        const matchBody = (entry.content || '').toLowerCase().includes(q);
        const matchTags = (entry.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchBody && !matchTags) return false;
      }

      // 2. Mood Filter
      if (selectedMoodFilter !== 'ALL') {
        if (entry.mood !== selectedMoodFilter) return false;
      }

      // 3. Tag Filter
      if (selectedTagFilter !== 'ALL') {
        if (!entry.tags || !entry.tags.includes(selectedTagFilter)) return false;
      }

      // 4. Date Range Filter
      if (dateRangeFilter !== 'ALL') {
        const entryTime = new Date(entry.date + 'T00:00:00').getTime();
        const now = Date.now();
        if (dateRangeFilter === '7DAYS' && now - entryTime > 7 * 86400000) return false;
        if (dateRangeFilter === '30DAYS' && now - entryTime > 30 * 86400000) return false;
      }

      // 5. Attachment / Reminder Filter
      if (attachmentFilter === 'PHOTOS') {
        if (!entry.images || entry.images.length === 0) return false;
      } else if (attachmentFilter === 'REMINDERS') {
        if (!entry.reminder || !entry.reminder.enabled) return false;
      }

      return true;
    });
  }, [entries, searchQuery, selectedMoodFilter, selectedTagFilter, dateRangeFilter, attachmentFilter]);

  const confirmDelete = () => {
    if (deleteTargetId) {
      onDeleteEntry(deleteTargetId);
      showToast('Entry deleted.', 'info');
      setDeleteTargetId(null);
      if (selectedEntry && selectedEntry.id === deleteTargetId) {
        setSelectedEntry(null);
      }
    }
  };

  const handleUpdateDetailImages = (newImages) => {
    if (!selectedEntry) return;
    const updated = { ...selectedEntry, images: newImages };
    window.StorageService.saveEntry(user.id, updated);
    setSelectedEntry(updated);
    if (onRefresh) onRefresh();
    showToast('Updated attached memory snapshots.', 'success');
  };

  const handleUpdateDetailReminder = (newReminder) => {
    if (!selectedEntry) return;
    const updated = { ...selectedEntry, reminder: newReminder };
    window.StorageService.saveEntry(user.id, updated);
    setSelectedEntry(updated);
    if (onRefresh) onRefresh();
    showToast(newReminder ? 'Reminder updated for this entry.' : 'Reminder turned off.', 'info');
  };

  return (
    <div className="history-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="serif font-bold" style={{ fontSize: '1.8rem' }}>
            Diary History
          </h1>
          <p className="text-secondary text-sm">
            Browse, search, and reflect on your previous entries ({filteredEntries.length} found).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search Input */}
        <div className="input-with-icon">
          <input
            type="text"
            className="form-input"
            placeholder="Search entries by title, keywords, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="input-icon-btn"
              onClick={() => setSearchQuery('')}
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="history-filter-bar" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Photos / Reminders Filter */}
          <select
            className="form-select"
            style={{ flex: 1, minWidth: '140px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            value={attachmentFilter}
            onChange={(e) => setAttachmentFilter(e.target.value)}
          >
            <option value="ALL">All Features</option>
            <option value="PHOTOS">📷 Has Memory Photos</option>
            <option value="REMINDERS">🔔 Has Reminders</option>
          </select>

          {/* Mood Filter */}
          <select
            className="form-select"
            style={{ flex: 1, minWidth: '140px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            value={selectedMoodFilter}
            onChange={(e) => setSelectedMoodFilter(e.target.value)}
          >
            <option value="ALL">All Moods</option>
            {(window.MOOD_OPTIONS || []).map(m => (
              <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            className="form-select"
            style={{ flex: 1, minWidth: '140px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            value={selectedTagFilter}
            onChange={(e) => setSelectedTagFilter(e.target.value)}
          >
            <option value="ALL">All Tags</option>
            {availableTags.map(t => (
              <option key={t} value={t}>#{t}</option>
            ))}
          </select>

          {/* Date Filter */}
          <select
            className="form-select"
            style={{ flex: 1, minWidth: '140px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
          >
            <option value="ALL">All Time</option>
            <option value="7DAYS">Past 7 Days</option>
            <option value="30DAYS">Past 30 Days</option>
          </select>

          {(searchQuery || selectedMoodFilter !== 'ALL' || selectedTagFilter !== 'ALL' || dateRangeFilter !== 'ALL' || attachmentFilter !== 'ALL') && (
            <button
              type="button"
              className="btn-subtle text-xs font-medium"
              onClick={() => {
                setSearchQuery('');
                setSelectedMoodFilter('ALL');
                setSelectedTagFilter('ALL');
                setDateRangeFilter('ALL');
                setAttachmentFilter('ALL');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3 className="serif font-semibold" style={{ fontSize: '1.2rem' }}>No entries found</h3>
          <p className="text-secondary text-sm">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="card card-hover"
              style={{ cursor: 'pointer', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              onClick={() => setSelectedEntry(entry)}
            >
              <div className="flex-between">
                <div className="flex-gap-sm" style={{ flexWrap: 'wrap' }}>
                  <span className="text-muted text-xs font-semibold" style={{ textTransform: 'uppercase' }}>
                    {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {entry.isDemo && (
                    <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)', fontSize: '0.7rem' }}>
                      Sample Demo
                    </span>
                  )}
                  {entry.reminder && entry.reminder.enabled && (
                    <window.ReminderBadge reminder={entry.reminder} />
                  )}
                  {entry.images && entry.images.length > 0 && (
                    <span className="badge" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent-text)', fontSize: '0.75rem' }}>
                      📷 {entry.images.length} {entry.images.length === 1 ? 'photo' : 'photos'}
                    </span>
                  )}
                </div>
                {entry.mood && <window.MoodBadge mood={entry.mood} />}
              </div>

              <h3 className="serif font-bold" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                {entry.title || 'Untitled Entry'}
              </h3>

              <p className="text-secondary text-sm" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: '1.6'
              }}>
                {entry.content}
              </p>

              {/* Photo Thumbnails Preview Row */}
              {entry.images && entry.images.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingTop: '0.25rem' }}>
                  {entry.images.slice(0, 4).map((img, i) => (
                    <img
                      key={img.id || i}
                      src={img.url}
                      alt="Thumbnail"
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                    />
                  ))}
                  {entry.images.length > 4 && (
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      +{entry.images.length - 4}
                    </div>
                  )}
                </div>
              )}

              {entry.tags && entry.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', paddingTop: '0.4rem' }}>
                  {entry.tags.map(t => (
                    <span key={t} className="tag-chip">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Readable Detail View Modal */}
      {selectedEntry && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setSelectedEntry(null)}>
          <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="text-muted text-xs font-semibold" style={{ textTransform: 'uppercase' }}>
                  {new Date(selectedEntry.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                {selectedEntry.mood && (
                  <div style={{ marginTop: '0.25rem' }}>
                    <window.MoodBadge mood={selectedEntry.mood} size="large" />
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-subtle btn-icon-only"
                onClick={() => setSelectedEntry(null)}
                aria-label="Close entry"
              >
                &times;
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h2 className="serif font-bold" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                {selectedEntry.title || 'Untitled Entry'}
              </h2>

              <div className="serif text-primary" style={{ fontSize: '1.1rem', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                {selectedEntry.content}
              </div>

              {/* Memory Snapshots in Detail View */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <window.ImageAttachment
                  images={selectedEntry.images || []}
                  onChange={handleUpdateDetailImages}
                  onOpenLightbox={(idx) => setDetailLightboxIndex(idx)}
                />
              </div>

              {/* Linked Reminder in Detail View */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <window.ReminderPicker
                  reminder={selectedEntry.reminder || null}
                  onChange={handleUpdateDetailReminder}
                />
              </div>

              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {selectedEntry.tags.map(t => (
                    <span key={t} className="tag-chip">#{t}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-danger-outline btn-sm"
                onClick={() => setDeleteTargetId(selectedEntry.id)}
              >
                Delete Entry
              </button>

              <div className="flex-gap-sm">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedEntry(null)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const entryToEdit = selectedEntry;
                    setSelectedEntry(null);
                    onEditEntry(entryToEdit);
                  }}
                >
                  Edit Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Viewer in History Detail View */}
      {selectedEntry && detailLightboxIndex >= 0 && (
        <window.ImageLightbox
          images={selectedEntry.images || []}
          currentIndex={detailLightboxIndex}
          onClose={() => setDetailLightboxIndex(-1)}
          onSelectIndex={(newIdx) => setDetailLightboxIndex(newIdx)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <window.ConfirmModal
        isOpen={!!deleteTargetId}
        title="Delete Diary Entry?"
        message="Are you sure you want to delete this entry? This action cannot be undone."
        confirmText="Delete Entry"
        cancelText="Cancel"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};

