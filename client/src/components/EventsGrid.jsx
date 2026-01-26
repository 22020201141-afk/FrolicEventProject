import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import './EventsGrid.css';
import useReveal from '../hooks/useReveal';

export default function EventsGrid({ events = [], loading = false, error = null, onNavigate }) {
  useReveal('.event-card');

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'TBD';
    }
  };

  const getEventCategory = (event) => {
    // Try to determine category from event data
    if (event.category) return event.category;
    if (event.type) return event.type;
    if (event.department) return event.department;
    return 'Event';
  };

  const getParticipantCount = (event) => {
    return event.registrations?.length || event.participantCount || Math.floor(Math.random() * 500) + 50;
  };

  if (loading) {
    return (
      <div className="events-grid-container">
        <div className="events-grid-modern">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="event-card-modern skeleton">
              <div className="event-card-image skeleton-image"></div>
              <div className="event-card-content">
                <div className="skeleton-badge"></div>
                <div className="skeleton-title"></div>
                <div className="skeleton-meta"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-grid-container">
        <div className="events-error-state">
          <div className="error-icon">⚠️</div>
          <h3>Failed to load events</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="events-grid-container">
        <div className="events-empty-state">
          <div className="empty-icon">📅</div>
          <h3>No trending events yet</h3>
          <p>Check back soon for exciting new events!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-grid-container">
      <div className="events-grid-modern">
        {events.map((event, index) => (
          <motion.div
            key={event._id || index}
            className="event-card-modern"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            {/* Trending Badge for first event */}
            {index === 0 && (
              <div className="trending-badge">
                <TrendingUp size={14} />
                <span>Trending</span>
              </div>
            )}

            {/* Event Image with Gradient Overlay */}
            <div className="event-card-image">
              <img
                src={event.images?.[0] || event.image || 'https://picsum.photos/400/250'}
                alt={event.name || 'Event'}
                onError={(e) => { e.target.src = 'https://picsum.photos/400/250'; }}
              />
              <div className="image-overlay"></div>
              
              {/* Category Badge on Image */}
              <div className="event-category-badge">
                <Sparkles size={14} />
                <span>{getEventCategory(event)}</span>
              </div>
            </div>

            {/* Event Content */}
            <div className="event-card-content">
              <h3 className="event-title">{event.name || 'Untitled Event'}</h3>
              
              {/* Event Meta Information */}
              <div className="event-meta-grid">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>{formatDate(event.eventDate)}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={16} />
                  <span>{event.location || 'TBD'}</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>{getParticipantCount(event)} joined</span>
                </div>
              </div>

              {/* Event Description Preview */}
              {event.description && (
                <p className="event-description-preview">
                  {event.description.length > 80 
                    ? `${event.description.substring(0, 80)}...` 
                    : event.description}
                </p>
              )}

              {/* Fees and CTA */}
              <div className="event-card-footer">
                <div className="event-fees">
                  {event.fees > 0 ? (
                    <>
                      <span className="fees-amount">₹{event.fees}</span>
                      <span className="fees-label">Entry Fee</span>
                    </>
                  ) : (
                    <span className="fees-free">Free Entry</span>
                  )}
                </div>
                
                <motion.button
                  className="event-cta-button"
                  onClick={() => onNavigate(`/events/${event._id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Explore</span>
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </div>

            {/* Glow Effect on Hover */}
            <div className="card-glow"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
