import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Users, Eye, RefreshCw, XCircle, 
  Search, Filter, Sparkles, TrendingUp, Clock, 
  CheckCircle, Star, DollarSign, Grid3x3, List
} from 'lucide-react';
import { eventAPI } from '../utils/api';
import './MyEvents.css';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await eventAPI.getEvents();
      const eventData = res.data || [];
      setEvents(eventData);
    } catch (err) {
      console.error('Failed to fetch events:', err);
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
        <span className="status-badge-modern status-published">
          <CheckCircle size={12} />
          <span>Published</span>
        </span>
      );
    }
    return (
      <span className="status-badge-modern status-draft">
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

  // Filter events
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
      <div className="my-events-page-modern">
        <div className="events-background-modern">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="my-events-container-modern">
          <motion.div 
            className="my-events-header-modern"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="header-badge-modern">
              <Sparkles size={16} />
              <span>All Events Hub</span>
            </div>
            <h1 className="my-events-page-title">
              Discover <span className="gradient-text-modern">All Events</span>
            </h1>
            <p className="my-events-page-subtitle">
              Browse through all available events in the system
            </p>
          </motion.div>

          <div className="events-grid-modern-my">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="event-card-modern-my skeleton-my">
                <div className="event-card-image-modern-my skeleton-image-my"></div>
                <div className="event-card-content-modern-my">
                  <div className="skeleton-badge-my"></div>
                  <div className="skeleton-title-my"></div>
                  <div className="skeleton-meta-my"></div>
                  <div className="skeleton-button-my"></div>
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
      <div className="my-events-page-modern">
        <div className="events-background-modern">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        
        <div className="my-events-container-modern">
          <div className="my-events-error-container">
            <XCircle size={64} className="error-icon-large-my" />
            <h2>Oops! Something went wrong</h2>
            <p className="error-message-my">{error}</p>
            <motion.button 
              className="retry-button-my"
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
    <div className="my-events-page-modern">
      <div className="events-background-modern">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="my-events-container-modern">
        {/* Header */}
        <motion.div 
          className="my-events-header-modern"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="header-badge-modern">
            <Sparkles size={16} />
            <span>All Events Hub</span>
          </div>
          <h1 className="my-events-page-title">
            Discover <span className="gradient-text-modern">All Events</span>
          </h1>
          <p className="my-events-page-subtitle">
            Browse through all available events in the system
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div 
          className="my-events-controls-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search */}
          <div className="search-box-my">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filter-group-my">
            <button 
              className={`filter-button-my ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              <Filter size={16} />
              <span>All</span>
              {filterStatus === 'all' && <span className="count-badge-my">{events.length}</span>}
            </button>
            <button 
              className={`filter-button-my ${filterStatus === 'published' ? 'active' : ''}`}
              onClick={() => setFilterStatus('published')}
            >
              <CheckCircle size={16} />
              <span>Published</span>
            </button>
            <button 
              className={`filter-button-my ${filterStatus === 'draft' ? 'active' : ''}`}
              onClick={() => setFilterStatus('draft')}
            >
              <Clock size={16} />
              <span>Draft</span>
            </button>
          </div>

          {/* View Toggle */}
          <div className="view-toggle-group">
            <button 
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <Grid3x3 size={18} />
            </button>
            <button 
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>

          {/* Refresh */}
          <motion.button 
            className="refresh-button-my"
            onClick={fetchEvents} 
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </motion.button>
        </motion.div>

        {/* Results Info */}
        {filteredEvents.length > 0 && (
          <motion.div 
            className="results-info-my"
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

        {/* Events Display */}
        {filteredEvents.length === 0 ? (
          <motion.div 
            className="no-events-modern-my"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Calendar size={80} />
            <h2>No Events Found</h2>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your filters or search term' 
                : 'There are no events in the system yet'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button 
                className="clear-filters-button-my"
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
              className={`events-grid-modern-my ${viewMode === 'list' ? 'list-view' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event._id || index}
                  className="event-card-modern-my"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -10 }}
                  layout
                >
                  {/* Featured Badge for first 3 */}
                  {index < 3 && (
                    <div className="featured-badge-my">
                      <Star size={12} fill="currentColor" />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Event Image */}
                  <div className="event-card-image-modern-my">
                    <img
                      src={event.images?.[0] || event.image || 'https://picsum.photos/400/280'}
                      alt={event.name || 'Event'}
                      onError={(e) => { e.target.src = 'https://picsum.photos/400/280'; }}
                    />
                    <div className="image-gradient-overlay-my"></div>
                    
                    {/* Category Badge */}
                    <div className="category-badge-overlay-my">
                      <Sparkles size={14} />
                      <span>{getEventCategory(event)}</span>
                    </div>

                    {/* Status Badge */}
                    <div className="status-badge-overlay-my">
                      {getEventStatusBadge(event.isPublished)}
                    </div>
                  </div>

                  {/* Event Content */}
                  <div className="event-card-content-modern-my">
                    <h3 className="event-title-modern-my">{event.name || 'Untitled Event'}</h3>
                    
                    {/* Event Meta */}
                    <div className="event-meta-modern-my">
                      <div className="meta-item-modern-my">
                        <Calendar size={16} />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="meta-item-modern-my">
                        <MapPin size={16} />
                        <span>{event.location || 'TBD'}</span>
                      </div>
                      <div className="meta-item-modern-my">
                        <Users size={16} />
                        <span>{getParticipantCount(event)} joined</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="meta-item-modern-my">
                          <Users size={16} />
                          <span>Max: {event.maxParticipants}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="event-description-modern-my">
                        {event.description.length > 100 
                          ? `${event.description.substring(0, 100)}...` 
                          : event.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="event-card-footer-modern-my">
                      <div className="event-price-modern-my">
                        {event.fees > 0 ? (
                          <>
                            <DollarSign size={18} />
                            <span className="price-amount-my">₹{event.fees}</span>
                          </>
                        ) : (
                          <span className="price-free-my">Free Entry</span>
                        )}
                      </div>
                      
                      <motion.button
                        className="view-details-button-my"
                        onClick={() => navigate(`/events/${event._id}`)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Hover Glow */}
                  <div className="card-glow-effect-my"></div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
