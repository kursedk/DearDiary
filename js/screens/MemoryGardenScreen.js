// Memory Garden Screen
// A VR-inspired, immersive view of diary entries as glowing lanterns in a night garden.
window.MemoryGardenScreen = function MemoryGardenScreen({ user, entries, onNavigateWrite, onBack }) {
  // ---- State ----
  const [selectedEntry, setSelectedEntry] = React.useState(null);
  const [lightboxImages, setLightboxImages] = React.useState(null); // { images: [], index: number }
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [vrAvailable, setVrAvailable] = React.useState(false);
  const [vrSession, setVrSession] = React.useState(null);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef(null);
  const panRef = React.useRef({ x: 0, y: 0 });
  const sceneRef = React.useRef(null);
  const viewportRef = React.useRef(null);

  // ---- VR Detection ----
  React.useEffect(() => {
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        setVrAvailable(supported);
      }).catch(() => setVrAvailable(false));
    }
  }, []);

  // ---- Keyboard navigation ----
  React.useEffect(() => {
    const STEP = 60;
    const handleKey = (e) => {
      if (selectedEntry) {
        if (e.key === 'Escape') { setSelectedEntry(null); return; }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          const idx = entries.findIndex(en => en.id === selectedEntry.id);
          let next = e.key === 'ArrowLeft' ? idx - 1 : idx + 1;
          if (next >= 0 && next < entries.length) setSelectedEntry(entries[next]);
          return;
        }
      }
      if (e.key === 'ArrowLeft')  setPan(p => ({ ...p, x: p.x + STEP }));
      if (e.key === 'ArrowRight') setPan(p => ({ ...p, x: p.x - STEP }));
      if (e.key === 'ArrowUp')    setPan(p => ({ ...p, y: p.y + STEP }));
      if (e.key === 'ArrowDown')  setPan(p => ({ ...p, y: p.y - STEP }));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedEntry, entries]);

  // ---- Mouse pan ----
  const onMouseDown = (e) => {
    if (e.target.closest('.garden-lantern-wrap') || e.target.closest('.garden-detail-panel')) return;
    setIsDragging(true);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: panRef.current.x, py: panRef.current.y };
  };

  const onMouseMove = (e) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    const newPan = { x: dragStart.current.px + dx, y: dragStart.current.py + dy };
    panRef.current = newPan;
    setPan(newPan);
  };

  const onMouseUp = () => { setIsDragging(false); dragStart.current = null; };

  // ---- Touch pan ----
  const touchStart = React.useRef(null);
  const onTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    touchStart.current = { tx: e.touches[0].clientX, ty: e.touches[0].clientY, px: panRef.current.x, py: panRef.current.y };
  };
  const onTouchMove = (e) => {
    if (!touchStart.current || e.touches.length !== 1) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - touchStart.current.tx;
    const dy = e.touches[0].clientY - touchStart.current.ty;
    const newPan = { x: touchStart.current.px + dx, y: touchStart.current.py + dy };
    panRef.current = newPan;
    setPan(newPan);
  };
  const onTouchEnd = () => { touchStart.current = null; };

  // ---- Enter VR ----
  const enterVR = async () => {
    if (!navigator.xr || !vrAvailable) return;
    try {
      const session = await navigator.xr.requestSession('immersive-vr');
      setVrSession(session);
      session.addEventListener('end', () => setVrSession(null));
    } catch (err) {
      console.warn('VR session failed:', err);
    }
  };

  const exitVR = () => {
    if (vrSession) { vrSession.end(); }
  };

  // ---- Lantern layout ----
  // Scatter lanterns in a generous virtual canvas; positions are deterministic per entry id.
  const getLanternPosition = (entry, index, total) => {
    // Use entry id hash for stable pseudo-random positions
    let hash = 0;
    for (let i = 0; i < entry.id.length; i++) {
      hash = (hash << 5) - hash + entry.id.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    const cols = Math.ceil(Math.sqrt(total * 1.5));
    const col  = index % cols;
    const row  = Math.floor(index / cols);
    const jitterX = ((absHash % 100) - 50) * 0.9; // ±45px
    const jitterY = (((absHash >> 8) % 80) - 40) * 0.7; // ±28px

    const cellW = 160;
    const cellH = 190;
    const offsetX = 100;
    const offsetY = 60;

    return {
      left: offsetX + col * cellW + jitterX,
      top:  offsetY + row * cellH + jitterY,
    };
  };

  const MOOD_CONFIG = {
    Happy:      { color: '#fbbf24', glow: 'rgba(251,191,36,0.45)',  emoji: '😊', size: 52 },
    Calm:       { color: '#6ee7b7', glow: 'rgba(110,231,183,0.40)', emoji: '🌿', size: 48 },
    Grateful:   { color: '#f59e0b', glow: 'rgba(245,158,11,0.40)',  emoji: '✨', size: 50 },
    Reflective: { color: '#a78bfa', glow: 'rgba(167,139,250,0.40)', emoji: '🌧️', size: 48 },
    Energetic:  { color: '#f472b6', glow: 'rgba(244,114,182,0.40)', emoji: '⚡', size: 52 },
    Anxious:    { color: '#94a3b8', glow: 'rgba(148,163,184,0.35)', emoji: '☁️', size: 44 },
    Sad:        { color: '#60a5fa', glow: 'rgba(96,165,250,0.40)',  emoji: '💧', size: 44 },
    default:    { color: '#d4a96a', glow: 'rgba(212,169,106,0.40)', emoji: '🏮', size: 48 },
  };

  const getMoodCfg = (mood) => MOOD_CONFIG[mood] || MOOD_CONFIG.default;

  // ---- Format date nicely ----
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr + 'T12:00:00').toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return dateStr; }
  };

  // ---- Ambient particles ----
  const particles = React.useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: (i * 5.7 + 7) % 100,
      bottom: (i * 3.1 + 5) % 35,
      delay: (i * 0.7) % 5,
      duration: 4 + (i % 5),
      size: 2 + (i % 3),
    }));
  }, []);

  // ---- Empty state ----
  if (entries.length === 0) {
    return (
      <div className="garden-page" role="main" aria-label="Memory Garden">
        <div className="garden-topbar">
          <div className="garden-topbar-left">
            <div className="garden-topbar-title">
              <span>🏮</span> Memory Garden
            </div>
            <div className="garden-topbar-subtitle">Your diary entries, visualised as glowing lanterns</div>
          </div>
          <div className="garden-topbar-right">
            <button className="garden-btn garden-btn-exit" onClick={onBack}>
              ← Back to Diary
            </button>
          </div>
        </div>

        <div className="garden-scene">
          <div className="garden-stars" aria-hidden="true"></div>
          <div className="garden-mist" aria-hidden="true"></div>
          <div className="garden-ground" aria-hidden="true"></div>

          <div className="garden-empty" role="status">
            <div className="garden-empty-icon" aria-hidden="true">🌱</div>
            <h2 className="garden-empty-title">Your garden is waiting</h2>
            <p className="garden-empty-desc">
              Every diary entry you write will bloom here as a glowing lantern.
              Write your first entry to plant the first light.
            </p>
            <button className="garden-empty-cta" onClick={onNavigateWrite}>
              ✍️ Write your first entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Main garden view ----
  const isSelected = (entry) => selectedEntry && selectedEntry.id === entry.id;

  return (
    <div className="garden-page" role="main" aria-label="Memory Garden">
      {/* ---- Top bar ---- */}
      <div className="garden-topbar" role="banner">
        <div className="garden-topbar-left">
          <div className="garden-topbar-title">
            <span aria-hidden="true">🏮</span> Memory Garden
          </div>
          <div className="garden-topbar-subtitle">
            {entries.length} {entries.length === 1 ? 'memory' : 'memories'} glowing in your garden
          </div>
        </div>
        <div className="garden-topbar-right">
          {/* VR button — only when available */}
          {vrAvailable && !vrSession && (
            <button
              className="garden-btn garden-btn-vr"
              onClick={enterVR}
              title="Enter immersive VR mode (requires a compatible headset)"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 8a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/>
              </svg>
              Enter VR
            </button>
          )}
          {vrSession && (
            <button className="garden-btn garden-btn-vr" onClick={exitVR}>
              ✕ Exit VR
            </button>
          )}
          {/* VR unavailable notice */}
          {!vrAvailable && (
            <div className="garden-vr-notice" title="VR headset or browser support not detected — the browser version is fully usable">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              VR optional — browser view active
            </div>
          )}
          <button className="garden-btn garden-btn-exit" onClick={onBack} aria-label="Return to diary">
            ← Back to Diary
          </button>
        </div>
      </div>

      {/* ---- Scene ---- */}
      <div
        className="garden-scene"
        ref={sceneRef}
        aria-label="Interactive memory garden — use arrow keys or drag to pan, click a lantern to view its entry"
        tabIndex={-1}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="garden-stars" aria-hidden="true"></div>
        <div className="garden-mist" aria-hidden="true"></div>
        <div className="garden-ground" aria-hidden="true"></div>

        {/* Ambient floating particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="garden-particle"
            aria-hidden="true"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}

        {/* Pan viewport */}
        <div
          className="garden-viewport"
          ref={viewportRef}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
          aria-hidden={!!selectedEntry}
        >
          {entries.map((entry, index) => {
            const cfg  = getMoodCfg(entry.mood);
            const pos  = getLanternPosition(entry, index, entries.length);
            const swayDelay   = (index * 0.37) % 3;
            const swayDuration = 3 + (index % 4) * 0.5;
            const selected = isSelected(entry);

            return (
              <div
                key={entry.id}
                className={`garden-lantern-wrap${selected ? ' selected' : ''}`}
                style={{ left: pos.left, top: pos.top }}
                role="button"
                tabIndex={0}
                aria-label={`${entry.title || 'Untitled Entry'} — ${entry.mood || 'No mood'}, ${formatDate(entry.date)}`}
                aria-pressed={selected}
                onClick={() => setSelectedEntry(entry)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedEntry(entry); } }}
              >
                {/* Tooltip */}
                <div className="lantern-tooltip" role="tooltip">
                  {cfg.emoji} {entry.title || 'Untitled Entry'}
                </div>

                {/* String */}
                <div className="lantern-string" aria-hidden="true" />

                {/* Body */}
                <div
                  className="lantern-body"
                  aria-hidden="true"
                  style={{
                    width:  cfg.size,
                    height: Math.round(cfg.size * 1.22),
                    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.45), ${cfg.color} 70%)`,
                    boxShadow: `0 0 ${cfg.size * 0.55}px ${cfg.size * 0.22}px ${cfg.glow}`,
                    animation: `lanternSway ${swayDuration}s ease-in-out ${swayDelay}s infinite`,
                  }}
                >
                  <div className="lantern-glow-inner" />
                  <span style={{ position: 'relative', zIndex: 1, fontSize: cfg.size * 0.4 }}>
                    {cfg.emoji}
                  </span>
                </div>

                <div className="lantern-label">
                  {entry.title || 'Untitled'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls hint */}
        <div className="garden-controls-hint" aria-label="Navigation controls">
          <span>🖱 Drag to pan</span>
          <span>⌨ Arrow keys</span>
          <span>Click a lantern to read</span>
          {selectedEntry && <span>← → browse entries</span>}
          {selectedEntry && <span>Esc to close</span>}
        </div>

        {/* ---- Entry Detail Side Panel ---- */}
        {selectedEntry && (
          <aside
            className="garden-detail-panel"
            role="complementary"
            aria-label={`Diary entry: ${selectedEntry.title || 'Untitled Entry'}`}
          >
            <div className="garden-detail-header">
              <button
                className="garden-detail-back-btn"
                onClick={() => setSelectedEntry(null)}
                aria-label="Return to garden view"
              >
                ← Back to Garden
              </button>
              <button
                className="garden-detail-close-btn"
                onClick={() => setSelectedEntry(null)}
                aria-label="Close entry panel"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="garden-detail-body">
              {/* Meta row */}
              <div className="garden-detail-meta">
                {selectedEntry.mood && (
                  <span
                    className="garden-detail-mood-badge"
                    style={{
                      background: `${getMoodCfg(selectedEntry.mood).glow.replace('0.40', '0.18').replace('0.45', '0.18').replace('0.35', '0.15')}`,
                      borderColor: `${getMoodCfg(selectedEntry.mood).color}44`,
                    }}
                  >
                    {getMoodCfg(selectedEntry.mood).emoji} {selectedEntry.mood}
                  </span>
                )}
                <span className="garden-detail-date">
                  {formatDate(selectedEntry.date)}
                </span>
              </div>

              {/* Title */}
              <h2 className="garden-detail-title">
                {selectedEntry.title || 'Untitled Entry'}
              </h2>

              <div className="garden-detail-divider" aria-hidden="true" />

              {/* Content */}
              <div className="garden-detail-content">
                {selectedEntry.content || <em style={{ opacity: 0.45 }}>No content written for this entry.</em>}
              </div>

              {/* Tags */}
              {selectedEntry.tags && selectedEntry.tags.length > 0 && (
                <div className="garden-detail-tags" aria-label="Tags">
                  {selectedEntry.tags.map(tag => (
                    <span key={tag} className="garden-detail-tag">#{tag}</span>
                  ))}
                </div>
              )}

              {/* Images */}
              {selectedEntry.images && selectedEntry.images.length > 0 && (
                <div>
                  <div className="garden-detail-divider" aria-hidden="true" style={{ marginTop: '1.25rem' }} />
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.6rem' }}>
                    {selectedEntry.images.length} attached {selectedEntry.images.length === 1 ? 'photo' : 'photos'}
                  </p>
                  <div className="garden-detail-images" role="list" aria-label="Attached photos">
                    {selectedEntry.images.map((img, i) => (
                      <img
                        key={img.id || i}
                        src={img.url}
                        alt={img.caption || img.name || `Photo ${i + 1}`}
                        className="garden-detail-image-thumb"
                        role="listitem"
                        tabIndex={0}
                        onClick={() => { setLightboxImages(selectedEntry.images); setLightboxIndex(i); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') { setLightboxImages(selectedEntry.images); setLightboxIndex(i); } }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Browse navigation */}
              {entries.length > 1 && (
                <div style={{
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                }}>
                  {(() => {
                    const idx = entries.findIndex(e => e.id === selectedEntry.id);
                    const prev = entries[idx - 1];
                    const next = entries[idx + 1];
                    return (
                      <>
                        <button
                          className="garden-detail-back-btn"
                          disabled={!prev}
                          onClick={() => prev && setSelectedEntry(prev)}
                          title={prev ? prev.title : ''}
                          style={{ opacity: prev ? 1 : 0.3 }}
                          aria-label={prev ? `Previous entry: ${prev.title}` : 'No previous entry'}
                        >
                          ← Prev
                        </button>
                        <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', alignSelf: 'center' }}>
                          {idx + 1} / {entries.length}
                        </span>
                        <button
                          className="garden-detail-back-btn"
                          disabled={!next}
                          onClick={() => next && setSelectedEntry(next)}
                          title={next ? next.title : ''}
                          style={{ opacity: next ? 1 : 0.3 }}
                          aria-label={next ? `Next entry: ${next.title}` : 'No next entry'}
                        >
                          Next →
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ---- Image Lightbox ---- */}
      {lightboxImages && (
        <window.ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onSelectIndex={setLightboxIndex}
          onClose={() => setLightboxImages(null)}
        />
      )}
    </div>
  );
};
