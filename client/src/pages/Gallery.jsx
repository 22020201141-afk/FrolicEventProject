import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { eventAPI } from '../utils/api';
import './Gallery.css';

export default function Gallery() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await eventAPI.getEvents();
        if (res && res.success) {
          if (mounted) setEvents(res.data || []);
        } else {
          throw new Error(res?.message || 'Failed to fetch events');
        }
      } catch (err) {
        console.error('Gallery: failed to fetch events', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => { mounted = false; };
  }, []);

  const openGallery = (event) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
    setIsLightboxOpen(false);
    setIsModalOpen(true);
  };

  const closeGallery = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setCurrentImageIndex(0);
    setIsLightboxOpen(false);
  };

  const openImageInLightbox = (idx) => {
    setCurrentImageIndex(idx);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (!selectedEvent?.images?.length) return;
    setCurrentImageIndex((i) => (i - 1 + selectedEvent.images.length) % selectedEvent.images.length);
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (!selectedEvent?.images?.length) return;
    setCurrentImageIndex((i) => (i + 1) % selectedEvent.images.length);
  };

  // Keyboard navigation for lightbox and modal
  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) closeLightbox(); else closeGallery();
      }
      if (e.key === 'ArrowLeft') {
        if (isLightboxOpen) prevImage(); else if (selectedEvent?.images?.length) setCurrentImageIndex(i => (i - 1 + selectedEvent.images.length) % selectedEvent.images.length);
      }
      if (e.key === 'ArrowRight') {
        if (isLightboxOpen) nextImage(); else if (selectedEvent?.images?.length) setCurrentImageIndex(i => (i + 1) % selectedEvent.images.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen, isLightboxOpen, selectedEvent]);

  // Keep the active thumbnail in view when selection changes
  useEffect(() => {
    const id = `thumb-${currentImageIndex}`;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // reset image loaded flag for fade-in effect
    setImgLoaded(false);
  }, [currentImageIndex, selectedEvent]);

  const selectImage = (idx) => {
    setCurrentImageIndex(idx);
    setIsLightboxOpen(false);
  }; 

  return (
    <div className="gallery-page events-page-modern">
      <div className="events-container-modern">
        <div className="events-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>

        <div className="events-container-modern">
          <motion.div
            className="events-header-modern"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="header-badge">
              <Sparkles size={16} />
              <span>Explore Moments</span>
            </div>
            <h1 className="events-page-title">Explore <span className="gradient-text">Events Gallery</span></h1>
            <p className="events-page-subtitle">Relive memorable moments from our campus events — photos, highlights and behind-the-scenes.</p>
          </motion.div>
        </div>

        {loading ? (
          <div className="loading">Loading gallery...</div>
        ) : (
          <div className="gallery-grid">
            {events.length === 0 && <p className="empty">No events or images found.</p>}

            {events.map((evt) => (
              <div key={evt._id} className="gallery-card" aria-label={evt.name}>
                <div className="thumb" onClick={() => openGallery(evt)}>
                  {evt.images && evt.images.length > 0 ? (
                    <img loading="lazy" src={evt.images[0]} alt={evt.name} />
                  ) : (
                    <div className="thumb-placeholder">No Image</div>
                  )}

                  <div className="thumb-gradient" />
                  <div className="thumb-overlay">
                    <div className="overlay-left">
                      <h3 className="overlay-title">{evt.name}</h3>
                      <p className="overlay-date">{new Date(evt.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div className="overlay-right">
                      <button className="view-button" onClick={(e) => { e.stopPropagation(); openGallery(evt); }}>
                        View Gallery
                      </button>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <p className="event-meta">{evt.images?.length || 0} images • {evt.location || ''}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && selectedEvent && (
          <div className="gallery-modal" role="dialog" aria-modal="true" onClick={closeGallery}>
            <div className="gallery-modal-backdrop" />
            <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeGallery} aria-label="Close">✕</button>

              <div className="modal-header">
                <div className="modal-title">
                  <h3>{selectedEvent.name}</h3>
                  <p className="modal-sub">{selectedEvent.description || 'Browse images captured from this event'}</p>
                </div>
              </div>

              {/* Two-column preview + thumbnail rail */}
              <div className="modal-body">
                <div className="preview">
                <div className="preview-image-wrap" onClick={() => setIsLightboxOpen(true)}>
                    <img
                      src={selectedEvent.images?.[currentImageIndex] || '/placeholder-event.jpg'}
                      alt={`${selectedEvent.name} ${currentImageIndex + 1}`}
                      loading="lazy"
                      onLoad={() => setImgLoaded(true)}
                      style={{ opacity: imgLoaded ? 1 : 0.01, transition: 'opacity .36s ease' }}
                    />
                    <button className="preview-nav left" onClick={(e) => { e.stopPropagation(); prevImage(e); }} aria-label="Previous">‹</button>
                    <button className="preview-nav right" onClick={(e) => { e.stopPropagation(); nextImage(e); }} aria-label="Next">›</button>
                  </div>

                  <div className="preview-actions">
                    <div className="preview-caption">{selectedEvent.name} • {new Date(selectedEvent.eventDate).toLocaleDateString()}</div>
                    <a className="image-download" href={selectedEvent.images?.[currentImageIndex] || '#'} target="_blank" rel="noopener noreferrer" download={!!selectedEvent.images?.[currentImageIndex]}>Download</a>
                  </div>
                </div>

                <aside className="thumb-rail" aria-label="Image thumbnails">
                  <div className="thumbs-grid">
                    {selectedEvent.images && selectedEvent.images.length > 0 ? (
                      selectedEvent.images.map((img, idx) => (
                        <button
                          key={idx}
                          id={`thumb-${idx}`}
                          className={`thumb-small ${idx === currentImageIndex ? 'active' : ''}`}
                          onClick={() => selectImage(idx)}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img src={img} alt={`thumb-${idx}`} loading="lazy" />
                        </button>
                      ))
                    ) : (
                      <div className="empty-gallery">No images available for this event.</div>
                    )}
                  </div>
                </aside>
              </div>

              {/* Lightbox (opens on top of modal) */}
              {isLightboxOpen && (
                <div className="lightbox" role="dialog" aria-modal="true" onClick={closeLightbox}>
                  <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                    <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">✕</button>
                    <button className="lightbox-nav left" onClick={prevImage}>‹</button>
                    <div className="lightbox-img-wrap">
                      <img src={selectedEvent.images[currentImageIndex]} alt={`${selectedEvent.name} ${currentImageIndex + 1}`} />
                      <div className="lightbox-caption">{selectedEvent.name} — Image {currentImageIndex + 1} / {selectedEvent.images.length}</div>
                    </div>
                    <button className="lightbox-nav right" onClick={nextImage}>›</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
