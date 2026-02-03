import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventAPI } from '../utils/api';
import { isAuthenticated, getUser } from '../utils/auth';
import './EventDetail.css';
import PaymentModal from '../components/PaymentModal';
import { 
  Calendar, MapPin, Users, Clock, DollarSign, 
  Star, Sparkles, Trophy, Target, Heart, Zap,
  ChevronRight, ArrowRight, Globe, Award, Flame
} from 'lucide-react';

const EventDetail = () => {
   const { id } = useParams();
   const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        console.log('EventDetail auth debug - token:', localStorage.getItem('token'));
        console.log('EventDetail auth debug - user (local):', getUser());

        setLoading(true);
        const res = await eventAPI.getEventById(id);
        setEvent(res.data);
        console.log('Fetched event:', res.data);

        // If token exists but user not in localStorage, fetch profile to ensure role is loaded
        if (isAuthenticated() && !getUser()) {
          try {
            const profile = await (await import('../utils/api')).authAPI.getProfile();
            (await import('../utils/auth')).setUser(profile.data);
            console.log('EventDetail fetched profile:', profile.data);
          } catch (err) {
            console.error('Failed to fetch profile from EventDetail', err);
          }
        }

        if (isAuthenticated()) {
          const status = await eventAPI.checkRegistrationStatus(id);
          setRegistered(status.data.registered);
          if(status.data.registered) setRegistrationId(status.data.registrationId);
        }
      } catch (err) {
        setError(err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleRegister = async () => {
    console.log('Handle register called');
    if (!isAuthenticated()) {
      console.log('Not authenticated, navigating to login');
      return navigate('/login');
    }
    const user = getUser();
    console.log('User:', user);
    const role = user?.role?.toString?.().toLowerCase?.() || '';
    if (role !== 'student') {
      console.log('User role not student (role:', user?.role, ')');
      return alert('Only students can register for events');
    }

    try {
      console.log('Calling register API for event:', id);
      const res = await eventAPI.registerForEvent(id);
      console.log('Registration response:', res);
      // API returns { success, data: { registrationId }, message }
      const regId = res?.data?.registrationId || res?.registrationId || (res?.data && res.data.data && res.data.data.registrationId);
      setRegistrationId(regId);
      // Open payment modal
      setShowPayment(true);
    } catch (err) {
      console.log('Registration error:', err);
      alert(err.message || 'Registration failed');
    }
  };

  const handlePaymentSuccess = (data) => {
    setShowPayment(false);
    alert('Payment successful! Transaction: ' + data.transactionId);
    setRegistered(true);
  };

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.7)' }}>Loading event details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="event-detail-page">
        <div className="detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            color: '#f87171',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Error</h2>
            <p>{error}</p>
            <button
              className="register-cta"
              onClick={() => navigate('/events')}
              style={{ marginTop: '1rem' }}
            >
              Return to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="event-detail-page">
        <div className="detail-container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <div style={{ 
            padding: '2rem', 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '500px',
            margin: '0 auto'
          }}>
            <h2 style={{ color: '#ffffff', marginBottom: '1rem' }}>Event Not Found</h2>
            <p>The event you're looking for doesn't exist or has been removed.</p>
            <button
              className="register-cta"
              onClick={() => navigate('/events')}
              style={{ marginTop: '1rem' }}
            >
              Explore More Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = event.images?.[0] || event.image || '/placeholder-event.jpg';
  console.log('Main image URL:', mainImage);

  return (
    <div className="event-detail-page">
      {/* Hero Section - Image Only with Register Button */}
      <motion.div 
        className="hero-image-only" 
        style={{backgroundImage: `url(${mainImage})`}}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-image-overlay"></div>
        <motion.div 
          className="hero-register-button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          {(() => {
            const user = getUser();
            const role = user?.role?.toString?.().toLowerCase?.() || '';
            const authInitDone = window.__authInitialized === true;

            if (isAuthenticated() && role === 'student') {
              return !registered ? (
                <motion.button 
                  className="register-cta-only" 
                  onClick={handleRegister}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles size={20} />
                  Secure Your Event
                  <ArrowRight size={20} />
                </motion.button>
              ) : (
                <motion.button 
                  className="registered-only" 
                  disabled
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Trophy size={20} />
                  You're Registered
                </motion.button>
              );
            }

            if (isAuthenticated() && !user && !authInitDone) {
              return <button className="register-cta-only" disabled>Preparing...</button>;
            }

            if (!isAuthenticated() || (isAuthenticated() && !user && authInitDone)) {
              return (
                <motion.button 
                  className="register-cta-only" 
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In to Join
                  <ArrowRight size={20} />
                </motion.button>
              );
            }

            return (
              <motion.button 
                className="register-cta-only" 
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In to Join
                <ArrowRight size={20} />
              </motion.button>
            );
          })()}
        </motion.div>
      </motion.div>

      {/* Enhanced Details Container */}
      <motion.div 
        className="detail-container"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="experience-section">
          <div className="section-header">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles size={24} />
            </motion.div>
            <h2>The Experience</h2>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles size={24} />
            </motion.div>
          </div>
          <p>{event.description}</p>
        </div>

        <div className="detail-grid">
          <motion.div 
            className="detail-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8 }}
          >
            <div className="card-icon">
              <MapPin size={28} />
            </div>
            <strong>Location</strong>
            <p>{event.location}</p>
            <div className="card-accent"></div>
          </motion.div>
          
          <motion.div 
            className="detail-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -8 }}
          >
            <div className="card-icon">
              <DollarSign size={28} />
            </div>
            <strong>Entry Fee</strong>
            <p>₹{event.fees}</p>
            <div className="card-accent"></div>
          </motion.div>
          
          <motion.div 
            className="detail-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ y: -8 }}
          >
            <div className="card-icon">
              <Users size={28} />
            </div>
            <strong>Participants</strong>
            <p>{event.minParticipants} - {event.maxParticipants}</p>
            <div className="card-accent"></div>
          </motion.div>
          
          <motion.div 
            className="detail-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ y: -8 }}
          >
            <div className="card-icon">
              <Clock size={28} />
            </div>
            <strong>Registration Ends</strong>
            <p>{new Date(event.registrationEndDate).toLocaleDateString()}</p>
            <div className="card-accent"></div>
          </motion.div>
        </div>

        <motion.div 
          className="additional-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="info-card">
            <Target size={20} />
            <span>Be part of something extraordinary</span>
          </div>
          <div className="info-card">
            <Globe size={20} />
            <span>Connect with fellow enthusiasts</span>
          </div>
          <div className="info-card">
            <Award size={20} />
            <span>Showcase your skills and win prizes</span>
          </div>
        </motion.div>
      </motion.div>

      {showPayment && registrationId && (
        <PaymentModal registrationId={registrationId} amount={event.fees} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default EventDetail;