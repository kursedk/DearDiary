// Image Attachment Manager Component for Entry Creation, Edit & Detail Views
window.ImageAttachment = function ImageAttachment({ images = [], onChange, readOnly = false, onOpenLightbox }) {
  const [showPresetModal, setShowPresetModal] = React.useState(false);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('');
  const [urlCaption, setUrlCaption] = React.useState('');
  const [isCompressing, setIsCompressing] = React.useState(false);

  // Compress uploaded image using Canvas to fit nicely into base64 Data URL
  const compressAndProcessImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const maxWidth = 1000;
          const maxHeight = 1000;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          resolve({
            id: 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            url: dataUrl,
            name: file.name || 'Memory Snapshot',
            caption: ''
          });
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsCompressing(true);
    try {
      const processed = await Promise.all(files.map(file => compressAndProcessImage(file)));
      onChange([...images, ...processed]);
    } catch (err) {
      console.error('Error processing image upload', err);
    } finally {
      setIsCompressing(false);
      e.target.value = ''; // Reset file input
    }
  };

  const handleAddPreset = (preset) => {
    const newImg = {
      id: 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      url: preset.url,
      name: preset.name,
      caption: preset.name
    };
    onChange([...images, newImg]);
    setShowPresetModal(false);
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const newImg = {
      id: 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      url: urlInput.trim(),
      name: 'Web Image',
      caption: urlCaption.trim() || 'Snapshot'
    };
    onChange([...images, newImg]);
    setUrlInput('');
    setUrlCaption('');
    setShowUrlInput(false);
  };

  const handleRemoveImage = (index, e) => {
    e.stopPropagation();
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="image-attachment-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Section Header */}
      <div className="flex-between">
        <label className="form-label" style={{ marginBottom: 0 }}>
          <span>Memory Snapshots ({images.length})</span>
          {isCompressing && <span className="text-muted text-xs">Optimizing photo...</span>}
        </label>

        {!readOnly && (
          <div className="flex-gap-sm">
            <button
              type="button"
              className="btn btn-secondary btn-sm text-xs"
              onClick={() => setShowPresetModal(true)}
            >
              🖼️ Preset Photos
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm text-xs"
              onClick={() => setShowUrlInput(true)}
            >
              🔗 Add URL
            </button>

            <label className="btn btn-primary btn-sm text-xs" style={{ cursor: 'pointer' }}>
              <span>📷 Attach Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* URL Input Drawer */}
      {showUrlInput && !readOnly && (
        <form onSubmit={handleAddUrl} className="card" style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="flex-between">
            <span className="font-semibold text-xs text-primary">Add Photo from Web Link</span>
            <button type="button" className="btn-subtle text-xs" onClick={() => setShowUrlInput(false)}>&times;</button>
          </div>

          <input
            type="url"
            className="form-input text-xs"
            placeholder="Paste Image URL (https://...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            required
            autoFocus
          />

          <input
            type="text"
            className="form-input text-xs"
            placeholder="Optional caption or title..."
            value={urlCaption}
            onChange={(e) => setUrlCaption(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="button" className="btn btn-secondary btn-sm text-xs" onClick={() => setShowUrlInput(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm text-xs">Attach Photo</button>
          </div>
        </form>
      )}

      {/* Preset Snapshots Selector Modal */}
      {showPresetModal && !readOnly && (
        <div className="modal-overlay" onClick={() => setShowPresetModal(false)}>
          <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="serif font-bold text-lg">Choose a Sample Memory Snapshot</h3>
              <button type="button" className="btn-subtle btn-icon-only" onClick={() => setShowPresetModal(false)}>&times;</button>
            </div>

            <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                {(window.PRESET_SNAPSHOTS || []).map(preset => (
                  <div
                    key={preset.id}
                    className="card card-hover"
                    style={{ padding: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'center' }}
                    onClick={() => handleAddPreset(preset)}
                  >
                    <img
                      src={preset.thumb || preset.url}
                      alt={preset.name}
                      style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <span className="font-medium text-xs text-primary">{preset.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowPresetModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Photos Thumbnail Grid */}
      {images.length === 0 ? (
        <div
          className="empty-snapshots-box"
          style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ fontSize: '1.8rem', marginBottom: '0.35rem' }}>📷</div>
          <p className="text-xs text-secondary font-medium">No photos attached yet</p>
          {!readOnly && (
            <p className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
              Attach pictures from your device, paste an image link, or pick sample snapshot presets.
            </p>
          )}
        </div>
      ) : (
        <div
          className="image-gallery-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {images.map((img, index) => (
            <div
              key={img.id || index}
              className="snapshot-thumb-card"
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                aspectRatio: '4 / 3',
                backgroundColor: 'var(--bg-tertiary)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                border: '1px solid var(--border-color)'
              }}
              onClick={() => onOpenLightbox && onOpenLightbox(index)}
            >
              <img
                src={img.url}
                alt={img.caption || img.name || 'Memory snapshot'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform var(--transition-normal)'
                }}
              />

              {/* Hover overlay gradient */}
              <div className="thumb-overlay" style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                display: 'flex',
                flexDirection: 'column',
                justifyBinding: 'space-between',
                padding: '0.5rem',
                opacity: 0,
                transition: 'opacity var(--transition-fast)'
              }}>
                {!readOnly && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      className="thumb-delete-btn"
                      style={{
                        backgroundColor: 'rgba(220, 38, 38, 0.85)',
                        color: '#FFFFFF',
                        borderRadius: 'var(--radius-full)',
                        width: '24px',
                        height: '24px',
                        padding: 0,
                        fontSize: '0.9rem',
                        lineHeight: 1
                      }}
                      onClick={(e) => handleRemoveImage(index, e)}
                      title="Remove snapshot"
                    >
                      &times;
                    </button>
                  </div>
                )}
                <div style={{ marginTop: 'auto' }}>
                  <span className="text-xs" style={{ color: '#FFFFFF', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {img.caption || img.name || 'View photo'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
