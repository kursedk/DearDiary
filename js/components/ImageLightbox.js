// Lightbox Modal Component for Fullscreen Memory Snapshots View
window.ImageLightbox = function ImageLightbox({ images, currentIndex, onClose, onSelectIndex }) {
  if (!images || images.length === 0 || currentIndex < 0 || currentIndex >= images.length) return null;

  const currentImg = images[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onSelectIndex((currentIndex + 1) % images.length);
  };

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onSelectIndex((currentIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onSelectIndex((currentIndex + 1) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onSelectIndex]);

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top bar controls */}
        <div className="lightbox-header">
          <div className="lightbox-title-area">
            <span className="lightbox-counter">{currentIndex + 1} of {images.length}</span>
            <span className="lightbox-caption">{currentImg.caption || currentImg.name || 'Memory Snapshot'}</span>
          </div>

          <div className="flex-gap-sm">
            {currentImg.url && (
              <a
                href={currentImg.url}
                download={currentImg.name || 'memory_snapshot.jpg'}
                target="_blank"
                rel="noreferrer"
                className="btn-subtle text-xs"
                style={{ color: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)' }}
                title="Download photo"
              >
                ⬇ Save Photo
              </a>
            )}
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={onClose}
              aria-label="Close Lightbox"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Main image stage */}
        <div className="lightbox-stage">
          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              &#10094;
            </button>
          )}

          <img
            src={currentImg.url}
            alt={currentImg.caption || currentImg.name || 'Memory Snapshot'}
            className="lightbox-image"
          />

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={handleNext}
              aria-label="Next image"
            >
              &#10095;
            </button>
          )}
        </div>

        {/* Bottom thumbnail strip if multiple images */}
        {images.length > 1 && (
          <div className="lightbox-thumbnails-strip">
            {images.map((img, idx) => (
              <div
                key={img.id || idx}
                className={`lightbox-thumb-item ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => onSelectIndex(idx)}
              >
                <img src={img.url} alt={`Thumbnail ${idx + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
