// Mood Selector & Display Badge Component
window.MoodBadge = function MoodBadge({ mood, onClick, selected = false, size = 'normal' }) {
  const options = window.MOOD_OPTIONS || [];
  const found = options.find(m => m.id === mood) || { label: mood || 'Unspecified', emoji: '🌿', color: '#4A6B5D' };

  if (onClick) {
    return (
      <button
        type="button"
        className={`badge badge-mood ${selected ? 'active-mood' : ''}`}
        onClick={onClick}
        style={{
          border: selected ? `2px solid ${found.color}` : '1px solid var(--border-color)',
          backgroundColor: selected ? 'var(--accent-light)' : 'var(--bg-secondary)',
          color: selected ? 'var(--accent-text)' : 'var(--text-secondary)',
          padding: size === 'large' ? '0.5rem 1rem' : '0.35rem 0.75rem',
          fontSize: size === 'large' ? '0.95rem' : '0.85rem',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
        aria-pressed={selected}
      >
        <span>{found.emoji}</span>
        <span className="font-medium">{found.label}</span>
      </button>
    );
  }

  return (
    <span
      className="badge badge-mood"
      style={{
        backgroundColor: 'var(--accent-light)',
        color: 'var(--accent-text)'
      }}
    >
      <span>{found.emoji}</span>
      <span>{found.label}</span>
    </span>
  );
};
