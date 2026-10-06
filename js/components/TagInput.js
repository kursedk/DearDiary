// Tag Selector and Custom Tag Input Component
window.TagInput = function TagInput({ tags = [], onChange }) {
  const [customTag, setCustomTag] = React.useState('');
  const defaultTags = window.DEFAULT_TAGS || ['Reflection', 'Work', 'Mindfulness', 'Grateful', 'Goals'];

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      onChange(tags.filter(t => t !== tag));
    } else {
      onChange([...tags, tag]);
    }
  };

  const handleAddCustom = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && customTag.trim()) {
      e.preventDefault();
      const cleaned = customTag.trim().replace(/^#/, '');
      if (!tags.includes(cleaned)) {
        onChange([...tags, cleaned]);
      }
      setCustomTag('');
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        <span>Tags & Categories</span>
        <span className="text-muted text-xs">Select or add custom tags</span>
      </label>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
        {defaultTags.map(tag => {
          const isSelected = tags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`tag-chip ${isSelected ? 'active-tag' : ''}`}
              onClick={() => toggleTag(tag)}
              style={{
                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                cursor: 'pointer'
              }}
            >
              #{tag}
            </button>
          );
        })}

        {/* Custom selected tags not in defaults */}
        {tags.filter(t => !defaultTags.includes(t)).map(tag => (
          <button
            key={tag}
            type="button"
            className="tag-chip active-tag"
            onClick={() => toggleTag(tag)}
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#FFFFFF',
              borderColor: 'var(--accent-primary)',
              cursor: 'pointer'
            }}
          >
            #{tag} &times;
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          className="form-input"
          style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
          placeholder="Add custom tag (e.g. Travel, Family)..."
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyDown={handleAddCustom}
        />
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={handleAddCustom}
          disabled={!customTag.trim()}
        >
          Add
        </button>
      </div>
    </div>
  );
};
