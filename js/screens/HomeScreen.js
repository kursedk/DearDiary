// Screen 2: Home Dashboard Screen
window.HomeScreen = function HomeScreen({ user, entries, stats, onNavigateWrite, onNavigateHistory, onOpenEntry, onLoadDemo }) {
  const todayDateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const recentEntries = entries.slice(0, 4);

  // Filter entries with active reminders
  const activeReminders = React.useMemo(() => {
    return entries
      .filter(e => e.reminder && e.reminder.enabled && e.reminder.datetime)
      .sort((a, b) => new Date(a.reminder.datetime).getTime() - new Date(b.reminder.datetime).getTime());
  }, [entries]);

  return (
    <div className="home-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Greeting & Date */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="text-muted text-sm font-medium" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {todayDateStr}
          </span>
          <h1 className="serif font-bold" style={{ fontSize: '2rem', marginTop: '0.2rem', color: 'var(--text-primary)' }}>
            {getGreeting()}, {user.name ? user.name.split(' ')[0] : 'friend'}
          </h1>
        </div>

        {/* Writing Streak & Mood Summary */}
        {entries.length > 0 && (
          <div className="flex-gap-sm" style={{ flexWrap: 'wrap' }}>
            {stats.streak > 0 && (
              <div className="badge" style={{
                backgroundColor: 'var(--accent-warm-light)',
                color: 'var(--accent-warm)',
                padding: '0.4rem 0.85rem',
                fontSize: '0.85rem'
              }}>
                <span>🔥</span>
                <span className="font-semibold">{stats.streak} day streak</span>
              </div>
            )}
            {stats.dominantMood && (
              <window.MoodBadge mood={stats.dominantMood} />
            )}
          </div>
        )}
      </div>

      {/* Upcoming Reminders Banner (if any active reminders) */}
      {activeReminders.length > 0 && (
        <div className="card" style={{
          backgroundColor: 'var(--bg-secondary)',
          borderLeft: '4px solid var(--accent-primary)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <div className="flex-between">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🔔</span>
              <h3 className="serif font-bold text-md">Upcoming Memory Reminders</h3>
            </div>
            <span className="text-muted text-xs font-medium">({activeReminders.length} scheduled)</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {activeReminders.slice(0, 3).map(e => (
              <div
                key={e.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  gap: '0.75rem',
                  cursor: 'pointer'
                }}
                onClick={() => onOpenEntry(e.id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                  <span className="font-semibold text-sm text-primary">{e.title || 'Untitled Entry'}</span>
                  {e.reminder.note && (
                    <span className="text-secondary text-xs" style={{ fontStyle: 'italic' }}>
                      "{e.reminder.note}"
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <window.ReminderBadge reminder={e.reminder} />
                  <span className="text-xs text-muted">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prominent Write Today's Entry Action Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))',
        border: '1px solid var(--accent-light)',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ maxWidth: '520px' }}>
          <h2 className="serif font-semibold" style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>
            How are you feeling today?
          </h2>
          <p className="text-secondary text-sm">
            Take a few moments to untangle your thoughts, capture your wins, or record what you're grateful for.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={() => onNavigateWrite()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Write today's entry</span>
        </button>
      </div>

      {/* Recent Entries Section */}
      <div>
        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h3 className="serif font-semibold" style={{ fontSize: '1.25rem' }}>
            Recent Entries
          </h3>
          {entries.length > 0 && (
            <button
              type="button"
              className="btn-subtle text-sm font-medium"
              onClick={onNavigateHistory}
            >
              View all ({entries.length}) &rarr;
            </button>
          )}
        </div>

        {recentEntries.length === 0 ? (
          /* Empty State for New Users */
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <h4 className="serif font-semibold" style={{ fontSize: '1.2rem' }}>
              Your diary is completely fresh
            </h4>
            <p className="text-secondary text-sm" style={{ maxWidth: '420px', lineHeight: '1.6' }}>
              Write your very first entry today, or load realistic sample entries to explore how DearDiary works.
            </p>
            <div className="flex-gap-md" style={{ marginTop: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onNavigateWrite()}
              >
                Write First Entry
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onLoadDemo}
              >
                Load Sample Entries
              </button>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            {recentEntries.map(entry => (
              <div
                key={entry.id}
                className="card card-hover"
                style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}
                onClick={() => onOpenEntry(entry.id)}
              >
                <div>
                  <div className="flex-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span className="text-muted text-xs font-medium">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      {entry.reminder && entry.reminder.enabled && (
                        <window.ReminderBadge reminder={entry.reminder} />
                      )}
                    </div>
                    {entry.mood && <window.MoodBadge mood={entry.mood} />}
                  </div>

                  <h4 className="serif font-semibold" style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                    {entry.title || 'Untitled Entry'}
                  </h4>

                  <p className="text-secondary text-sm" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.5'
                  }}>
                    {entry.content}
                  </p>
                </div>

                {/* Attached Images Thumbnail Bar */}
                {entry.images && entry.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingTop: '0.25rem' }}>
                    {entry.images.slice(0, 3).map((img, i) => (
                      <img
                        key={img.id || i}
                        src={img.url}
                        alt="Photo"
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                      />
                    ))}
                    {entry.images.length > 3 && (
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        +{entry.images.length - 3}
                      </div>
                    )}
                  </div>
                )}

                {/* Tags Footer */}
                {entry.tags && entry.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    {entry.tags.map(t => (
                      <span key={t} className="tag-chip">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

