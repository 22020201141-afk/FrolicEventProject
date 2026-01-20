import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, CreditCard, Eye, ArrowRight, RefreshCw, XCircle } from 'lucide-react';
import { authAPI } from '../utils/api';
import './MyEvents.css';
import ScaleIn from '../components/animations/ScaleIn';

const MyEvents = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await authAPI.getMyRegistrations();
      console.log('My Registrations Full Response:', res);
      console.log('Response data:', res.data);
      console.log('Response data type:', typeof res.data);
      console.log('Response data is array:', Array.isArray(res.data));
      const registrationData = res.data || [];
      console.log('Registration data to set:', registrationData);
      setRegistrations(registrationData);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      console.error('Error details:', err.response);
      setError(err.message || 'Failed to load your registered events');
      setRegistrations([]);
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

  const getRegistrationStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { className: 'status-badge status-pending', label: 'Pending' },
      CONFIRMED: { className: 'status-badge status-confirmed', label: 'Confirmed' },
      CANCELLED: { className: 'status-badge status-cancelled', label: 'Cancelled' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return <span className={config.className}>{config.label}</span>;
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    const paymentConfig = {
      PENDING: { className: 'payment-badge payment-pending', label: 'Payment Pending' },
      PAID: { className: 'payment-badge payment-paid', label: 'Paid' }
    };
    
    const config = paymentConfig[paymentStatus] || paymentConfig.PENDING;
    return <span className={config.className}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="my-events-page">
        <div className="events-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        <div className="my-events-container">
          <div className="my-events-header">
            <h1 className="page-title">My Events</h1>
            <p className="page-subtitle">View your registered events and their status</p>
          </div>
          <div className="events-grid">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="event-card skeleton-card">
                <div className="event-image-container skeleton">
                  <div className="skeleton-image"></div>
                </div>
                <div className="event-content">
                  <div className="event-meta-grid">
                    <div className="meta-item skeleton">
                      <div className="skeleton-text short"></div>
                    </div>
                    <div className="meta-item skeleton">
                      <div className="skeleton-text short"></div>
                    </div>
                  </div>
                  <div className="event-actions">
                    <div className="skeleton-button"></div>
                  </div>
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
      <div className="my-events-page">
        <div className="events-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        <div className="my-events-container">
          <div className="error-container">
            <XCircle size={64} className="error-icon" />
            <h2>Oops! Something went wrong</h2>
            <p className="error-message">{error}</p>
            <button className="retry-button" onClick={fetchEvents}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-events-page">
      <div className="events-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="my-events-container">
        <div className="my-events-header">
          <h1 className="page-title">My Events</h1>
          <p className="page-subtitle">View your registered events and their status</p>
          <button className="refresh-button" onClick={fetchEvents} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinning' : ''} />
            <span>Refresh</span>
          </button>
          {registrations.length > 0 && (
            <div className="event-count">
              <span className="count-badge">{registrations.length}</span>
              <span className="count-text">Registered Event{registrations.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {registrations.length === 0 ? (
          <ScaleIn>
            <div className="no-events">
              <div className="empty-icon-wrapper">
                <Calendar size={80} className="empty-icon" />
                <div className="icon-glow"></div>
              </div>
              <h2>No Registered Events</h2>
              <p>You haven't registered for any events yet. Browse available events to get started!</p>
              <button className="browse-button" onClick={() => navigate('/events')}>
                <span>Browse Events</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </ScaleIn>
        ) : (
          <div className="events-grid">
            {registrations.map((registration, index) => {
              const ev = registration.event;
              
              return (
                <ScaleIn key={registration.id || index} delay={index * 0.1}>
                  <div className="event-card">
                    <div className="event-image-container">
                      <img 
                        src={ev.isDeleted ? 'https://picsum.photos/400/250?blur=2' : (ev.images?.[0] || ev.image || 'https://picsum.photos/400/250?blur=2')} 
                        alt={ev.name || 'Event'} 
                        className="event-image"
                        onError={(e) => { e.target.src = 'https://picsum.photos/400/250?blur=2'; }}
                      />
                      <div className="event-image-overlay">
                        <h3 className="event-title">{ev.name || 'Untitled Event'}</h3>
                        {ev.isDeleted && <div className="deleted-badge">Event Deleted</div>}
                        {!ev.isDeleted && (
                          <div className="event-date-badge">
                            <Calendar size={14} />
                            <span>{formatDate(ev.eventDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="event-content">
                      <div className="event-meta-grid">
                        {!ev.isDeleted && (
                          <>
                            <div className="meta-item">
                              <MapPin size={16} className="meta-icon" />
                              <span>{ev.location || 'TBD'}</span>
                            </div>
                            <div className="meta-item">
                              <Users size={16} className="meta-icon" />
                              <span>{ev.maxParticipants || 0} max</span>
                            </div>
                            {(ev.fees && ev.fees > 0) && (
                              <div className="meta-item">
                                <CreditCard size={16} className="meta-icon" />
                                <span>₹{ev.fees}</span>
                              </div>
                            )}
                          </>
                        )}
                        {ev.isDeleted && (
                          <div className="meta-item deleted-message">
                            <span>This event has been removed by the administrator.</span>
                          </div>
                        )}
                      </div>

                      <div className="status-section">
                        {getRegistrationStatusBadge(registration.status)}
                        {getPaymentStatusBadge(registration.paymentStatus)}
                      </div>

                      {registration.transactionId && (
                        <div className="transaction-info">
                          <span className="transaction-label">Transaction ID:</span>
                          <span className="transaction-id">{registration.transactionId}</span>
                        </div>
                      )}

                      <div className="registration-date">
                        <span className="date-label">Registered on:</span>
                        <span className="date-value">{formatDate(registration.createdAt)}</span>
                      </div>

                      <div className="event-actions">
                        {!ev.isDeleted && (
                          <button 
                            className="btn-view" 
                            onClick={() => navigate(`/events/${ev._id}`)}
                          >
                            <Eye size={16} />
                            <span>View Details</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </ScaleIn>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
