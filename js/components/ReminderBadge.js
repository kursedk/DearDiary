// Reminder Badge Component for Entry Cards and Headers
window.ReminderBadge = function ReminderBadge({ reminder, onClick }) {
  if (!reminder || !reminder.enabled || !reminder.datetime) return null;

  const reminderDate = new Date(reminder.datetime);
  const now = new Date();
  const isOverdue = reminderDate.getTime() < now.getTime();

  // Format date nicely
  const formatReminderText = (dt) => {
    const isToday = dt.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === dt.toDateString();

    const timeStr = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isToday) return `Today at ${timeStr}`;
    if (isTomorrow) return `Tomorrow at ${timeStr}`;

    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` at ${timeStr}`;
  };

  const badgeStyle = isOverdue ? {
    backgroundColor: 'var(--accent-warm-light)',
    color: 'var(--accent-warm)',
    borderColor: 'rgba(217, 119, 69, 0.3)'
  } : {
    backgroundColor: 'var(--accent-light)',
    color: 'var(--accent-text)',
    borderColor: 'rgba(74, 107, 93, 0.3)'
  };

  return (
    <span
      className="badge reminder-badge"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.78rem',
        fontWeight: 600,
        border: '1px solid',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
        ...badgeStyle
      }}
      onClick={onClick}
      title={reminder.note ? `Reminder Note: ${reminder.note}` : 'Linked Reminder'}
    >
      <span>{isOverdue ? '⏰' : '🔔'}</span>
      <span>{isOverdue ? 'Revisit Overdue: ' : 'Reminder: '}{formatReminderText(reminderDate)}</span>
    </span>
  );
};
