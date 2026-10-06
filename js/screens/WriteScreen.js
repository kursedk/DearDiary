// Screen 3: Write / Edit Diary Entry Screen
window.WriteScreen = function WriteScreen({ user, editingEntry, onSaveSuccess, onDiscard, showToast }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = React.useState(editingEntry ? editingEntry.title : '');
  const [content, setContent] = React.useState(editingEntry ? editingEntry.content : '');
  const [date, setDate] = React.useState(editingEntry ? editingEntry.date : todayStr);
  const [mood, setMood] = React.useState(editingEntry ? editingEntry.mood : 'Calm');
  const [tags, setTags] = React.useState(editingEntry ? (editingEntry.tags || []) : []);
  const [images, setImages] = React.useState(editingEntry ? (editingEntry.images || []) : []);
  const [reminder, setReminder] = React.useState(editingEntry ? (editingEntry.reminder || null) : null);

  const [lightboxIndex, setLightboxIndex] = React.useState(-1);
  const [saveStatus, setSaveStatus] = React.useState('Ready'); // 'Ready' | 'Autosaving...' | 'Draft Saved' | 'Saved'
  const [showDiscardConfirm, setShowDiscardConfirm] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  // Load auto-saved draft if starting new entry and draft exists
  React.useEffect(() => {
    if (!editingEntry) {
      const draft = window.StorageService.getDraft(user.id);
      if (draft && (draft.title || draft.content || (draft.images && draft.images.length > 0) || draft.reminder)) {
        setTitle(draft.title || '');
        setContent(draft.content || '');
        setDate(draft.date || todayStr);
        setMood(draft.mood || 'Calm');
        setTags(draft.tags || []);
        setImages(draft.images || []);
        setReminder(draft.reminder || null);
        setSaveStatus('Draft restored');
      }
    }
  }, [editingEntry, user.id]);

  // Track field changes
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  // Debounced Autosave Draft effect
  React.useEffect(() => {
    if (!isDirty || editingEntry) return;

    setSaveStatus('Autosaving draft...');
    const timer = setTimeout(() => {
      window.StorageService.saveDraft(user.id, { title, content, date, mood, tags, images, reminder });
      setSaveStatus(`Draft saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [title, content, date, mood, tags, images, reminder, isDirty, editingEntry, user.id]);

  // Keyboard shortcut Cmd+S / Ctrl+S to save
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleSave = () => {
    if (!content.trim() && !title.trim() && images.length === 0) {
      showToast('Please write a title, content, or attach a photo for your entry.', 'warning');
      return;
    }

    const payload = {
      id: editingEntry ? editingEntry.id : undefined,
      title: title.trim() || 'Untitled Entry',
      content: content.trim(),
      date,
      mood,
      tags,
      images,
      reminder,
      isDemo: false
    };

    const saved = window.StorageService.saveEntry(user.id, payload);
    setIsDirty(false);
    showToast(editingEntry ? 'Entry updated successfully.' : 'Diary entry saved!', 'success');
    onSaveSuccess(saved);
  };

  const handleDiscardClick = () => {
    if (isDirty && (title.trim() || content.trim() || images.length > 0)) {
      setShowDiscardConfirm(true);
    } else {
      window.StorageService.clearDraft(user.id);
      onDiscard();
    }
  };

  const confirmDiscard = () => {
    setShowDiscardConfirm(false);
    window.StorageService.clearDraft(user.id);
    onDiscard();
  };

  return (
    <div className="write-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Controls Bar */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            type="button"
            className="btn-subtle text-sm"
            onClick={handleDiscardClick}
          >
            &larr; Back
          </button>
        </div>

        <div className="flex-gap-md">
          <span className="text-muted text-xs font-medium" style={{ fontStyle: 'italic' }}>
            {saveStatus}
          </span>
          
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleDiscardClick}
          >
            Discard
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>{editingEntry ? 'Update Entry' : 'Save Entry'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title Input */}
        <input
          type="text"
          className="form-input serif font-bold"
          style={{
            fontSize: '1.75rem',
            border: 'none',
            borderBottom: '1px solid var(--border-subtle)',
            borderRadius: '0',
            padding: '0.5rem 0',
            backgroundColor: 'transparent'
          }}
          placeholder="Title of your entry..."
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />

        {/* Date and Mood Picker Controls */}
        <div className="grid-2">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="entry-date" className="form-label">Entry Date</label>
            <input
              id="entry-date"
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => { setDate(e.target.value); setIsDirty(true); }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Select Mood</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {(window.MOOD_OPTIONS || []).map((m) => (
                <window.MoodBadge
                  key={m.id}
                  mood={m.id}
                  selected={mood === m.id}
                  onClick={() => { setMood(m.id); setIsDirty(true); }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Tagging Options */}
        <window.TagInput
          tags={tags}
          onChange={(newTags) => { setTags(newTags); setIsDirty(true); }}
        />

        {/* Memory Snapshots (Attached Pictures) */}
        <window.ImageAttachment
          images={images}
          onChange={(newImages) => { setImages(newImages); setIsDirty(true); }}
          onOpenLightbox={(idx) => setLightboxIndex(idx)}
        />

        {/* Optional Linked Reminder */}
        <window.ReminderPicker
          reminder={reminder}
          onChange={(newReminder) => { setReminder(newReminder); setIsDirty(true); }}
        />

        {/* Body Textarea */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label htmlFor="entry-content" className="form-label">Your Journal Entry</label>
          <textarea
            id="entry-content"
            className="form-textarea serif"
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              minHeight: '320px',
              padding: '1rem',
              borderRadius: 'var(--radius-md)'
            }}
            placeholder="Write freely. Express how your day went, your ideas, feelings, or whatever comes to mind..."
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>
      </div>

      {/* Lightbox Viewer */}
      {lightboxIndex >= 0 && (
        <window.ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(-1)}
          onSelectIndex={(newIdx) => setLightboxIndex(newIdx)}
        />
      )}

      {/* Discard Confirmation Modal */}
      <window.ConfirmModal
        isOpen={showDiscardConfirm}
        title="Discard Unsaved Changes?"
        message="You have unsaved changes in this entry. Discarding will erase your current draft."
        confirmText="Discard Changes"
        cancelText="Keep Writing"
        isDanger={true}
        onConfirm={confirmDiscard}
        onCancel={() => setShowDiscardConfirm(false)}
      />
    </div>
  );
};

