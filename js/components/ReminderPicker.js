// Reminder Settings & Picker Component
window.ReminderPicker = function ReminderPicker({ reminder, onChange }) {
  const isEnabled = reminder && reminder.enabled;

  const defaultDatetime = () => {
    // Default to tomorrow morning at 9:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  };

  const [datetime, setDatetime] = React.useState(reminder ? (reminder.datetime || defaultDatetime()) : defaultDatetime());
  const [note, setNote] = React.useState(reminder ? (reminder.note || '') : '');

  // Keep internal state synced if reminder prop updates
  React.useEffect(() => {
    if (reminder && reminder.enabled) {
      setDatetime(reminder.datetime || defaultDatetime());
      setNote(reminder.note || '');
    }
  }, [reminder]);

  const handleToggle = (e) => {
    const checked = e.target.checked;
    if (checked) {
      const dt = datetime || defaultDatetime();
      onChange({
        enabled: true,
        datetime: dt,
        note: note,
        notified: false
      });
    } else {
      onChange(null);
    }
  };

  const handleDatetimeChange = (e) => {
    const val = e.target.value;
    setDatetime(val);
    if (isEnabled) {
      onChange({
        enabled: true,
        datetime: val,
        note: note,
        notified: false
      });
    }
  };

  const handleNoteChange = (e) => {
    const val = e.target.value;
    setNote(val);
    if (isEnabled) {
      onChange({
        enabled: true,
        datetime: datetime,
        note: val,
        notified: false
      });
    }
  };

  const setQuickPreset = (days, hour = 9) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    target.setHours(hour, 0, 0, 0);
    const dtStr = target.toISOString().slice(0, 16);

    setDatetime(dtStr);
    onChange({
      enabled: true,
      datetime: dtStr,
      note: note,
      notified: false
    });
  };

  const handleTurnOff = () => {
    onChange(null);
  };

  return (
    <div className="card reminder-picker-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header & Toggle */}
      <div className="flex-between" style={{ marginBottom: isEnabled ? '1rem' : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isEnabled ? 'var(--accent-light)' : 'var(--bg-tertiary)',
            color: isEnabled ? 'var(--accent-primary)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem'
          }}>
            🔔
          </div>
          <div>
            <h4 className="font-semibold" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Revisit & Follow-up Reminder
            </h4>
            <p className="text-secondary text-xs">
              Set a date & time to revisit this memory snapshot or follow up.
            </p>
          </div>
        </div>

        <label className="toggle-switch-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            className="toggle-switch-checkbox"
            checked={!!isEnabled}
            onChange={handleToggle}
          />
          <span className="toggle-switch-slider"></span>
        </label>
      </div>

      {/* Expanded Controls when Enabled */}
      {isEnabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Quick Presets */}
          <div>
            <span className="text-muted text-xs font-semibold" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem' }}>
              Quick Presets
            </span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm text-xs"
                onClick={() => setQuickPreset(1, 9)}
              >
                Tomorrow (9 AM)
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm text-xs"
                onClick={() => setQuickPreset(3, 9)}
              >
                In 3 Days
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm text-xs"
                onClick={() => setQuickPreset(7, 9)}
              >
                In 1 Week
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm text-xs"
                onClick={() => setQuickPreset(30, 9)}
              >
                In 1 Month
              </button>
            </div>
          </div>

          {/* Date & Time Picker */}
          <div className="grid-2">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="reminder-datetime" className="form-label text-xs">
                Reminder Date & Time
              </label>
              <input
                id="reminder-datetime"
                type="datetime-local"
                className="form-input text-xs"
                style={{ padding: '0.5rem 0.75rem' }}
                value={datetime}
                onChange={handleDatetimeChange}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="reminder-note" className="form-label text-xs">
                Reminder Note (Optional)
              </label>
              <input
                id="reminder-note"
                type="text"
                className="form-input text-xs"
                style={{ padding: '0.5rem 0.75rem' }}
                placeholder="e.g. Check back on goal or reflect on this day"
                value={note}
                onChange={handleNoteChange}
              />
            </div>
          </div>

          {/* Turn Off Option */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
            <button
              type="button"
              className="btn-subtle text-xs text-muted"
              style={{ color: '#DC2626' }}
              onClick={handleTurnOff}
            >
              Turn Off Reminder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
