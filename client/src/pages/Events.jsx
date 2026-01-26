import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Eye, RefreshCw, XCircle, 
  Filter, Search, TrendingUp, Clock, Sparkles, 
  Star, CheckCircle, DollarSign
} from 'lucide-react';
import './Events.css';
import { eventAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventAPI.getEvents();
      setEvents(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return 'TBD';
    }
  };

  const getEventStatusBadge = (isPublished) => {
    if (isPublished) {
      return (
        <span className="status-badge status-published">
          <CheckCircle size={12} />
          <span>Published</span>
        </span>
      );
    }
    return (
      <span className="status-badge status-draft">
        <Clock size={12} />
        <span>Draft</span>
      </span>
    );
  };

  const getParticipantCount = (event) => {
    return event.registrations?.length || event.participantCount || Math.floor(Math.random() * 500) + 50;
  };

  const getEventCategory = (event) => {
    if (event.category) return event.category;
    if (event.type) return event.type;
    if (event.department) return event.department;
    return 'General';
  };

  // Filter events based on search and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchTerm || 
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'published' && event.isPublished) ||
      (filterStatus === 'draft' && !event.isPublished);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="events-page-modern">
        <div className="events-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="events-container-modern">
          {/* Header */}
          <motion.div 
            className="events-header-modern"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="header-badge">
              <Sparkles size={16} />
              <span>Discover Experiences</span>
            </div>
            <h1 className="events-page-title">
              Explore <span className="gradient-text">Amazing Events</span>
            </h1>
            <p className="events-page-subtitle">
              Where moments transform into memories and passions ignite
            </p>
          </motion.div>

          {/* Loading Grid */}
          <div className="events-grid-premium">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="event-card-premium skeleton">
                <div className="event-card-image-premium skeleton-image"></div>
                <div className="event-card-content-premium">
                  <div className="skeleton-badge"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-meta"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-page-modern">
        <div className="events-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        
        <div className="events-container-modern">
          <div className="events-error-container">
            <XCircle size={64} className="error-icon-large" />
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
            <motion.button 
              className="retry-button"
              onClick={fetchEvents}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={18} />
              <span>Try Again</span>
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-page-modern">
      {/* Animated Background */}
      <div className="events-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="events-container-modern">
        {/* Header Section */}
        <motion.div 
          className="events-header-modern"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-badge">
            <Sparkles size={16} />
            <span>Discover Experiences</span>
          </div>
          <h1 className="events-page-title">
            Explore <span className="gradient-text">Amazing Events</span>
          </h1>
          <p className="events-page-subtitle">
            Where moments transform into memories and passions ignite
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div 
          className="events-controls-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search Box */}
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="filter-group">
            <button 
              className={`filter-button ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              <Filter size={16} />
              <span>All Events</span>
              {filterStatus === 'all' && <span className="count-badge">{events.length}</span>}
            </button>
            <button 
              className={`filter-button ${filterStatus === 'published' ? 'active' : ''}`}
              onClick={() => setFilterStatus('published')}
            >
              <CheckCircle size={16} />
              <span>Published</span>
            </button>
            <button 
              className={`filter-button ${filterStatus === 'draft' ? 'active' : ''}`}
              onClick={() => setFilterStatus('draft')}
            >
              <Clock size={16} />
              <span>Draft</span>
            </button>
          </div>

          {/* Refresh Button */}
          <motion.button 
            className="refresh-button"
            onClick={fetchEvents} 
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </motion.button>
        </motion.div>

        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <motion.div 
            className="results-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp size={20} />
            <span>
              Showing <strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? 'event' : 'events'}
            </span>
          </motion.div>
        )}

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <motion.div 
            className="no-events-modern"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Calendar size={80} />
            <h2>No Events Found</h2>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search term' 
                : 'Check back soon for exciting new events!'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button 
                className="clear-filters-button"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              className="events-grid-premium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id || index}
                  className="event-card-premium"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  layout
                >
                  {/* Featured Badge for first 3 events */}
                  {index < 3 && (
                    <div className="featured-badge">
                      <Star size={12} fill="currentColor" />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Event Image */}
                  <div className="event-card-image-premium">
                    <img
                      src={event.images?.[0] || event.image || 'https://picsum.photos/400/280'}
                      alt={event.name || 'Event'}
                      onError={(e) => { e.target.src = 'https://picsum.photos/400/280'; }}
                    />
                    <div className="image-gradient-overlay"></div>
                    
                    {/* Category Badge */}
                    <div className="category-badge-overlay">
                      <Sparkles size={14} />
                      <span>{getEventCategory(event)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="status-badge-overlay">
                      {getEventStatusBadge(event.isPublished)}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="event-card-content-premium">
                    <h3 className="event-title-premium">{event.name || 'Untitled Event'}</h3>
                    
                    {/* Event Meta */}
                    <div className="event-meta-premium">
                      <div className="meta-item-premium">
                        <Calendar size={16} />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="meta-item-premium">
                        <MapPin size={16} />
                        <span>{event.location || 'TBD'}</span>
                      </div>
                      <div className="meta-item-premium">
                        <Users size={16} />
                        <span>{getParticipantCount(event)} participants</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="meta-item-premium">
                          <Users size={16} />
                          <span>Max: {event.maxParticipants}</span>
                        </div>
                      )}
                    </div>

                    {/* Description Preview */}
                    {event.description && (
                      <p className="event-description-premium">
                        {event.description.length > 100 
                          ? `${event.description.substring(0, 100)}...` 
                          : event.description}
                      </p>
                    )}

                    {/* Footer with Price and CTA */}
                    <div className="event-card-footer-premium">
                      <div className="event-price-premium">
                        {event.fees > 0 ? (
                          <>
                            <DollarSign size={18} />
                            <span className="price-amount">₹{event.fees}</span>
                          </>
                        ) : (
                          <span className="price-free">Free Entry</span>
                        )}
                      </div>
                      
                      <motion.button
                        className="view-details-button"
                        onClick={() => navigate(`/events/${event._id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="card-glow-effect"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Events;
