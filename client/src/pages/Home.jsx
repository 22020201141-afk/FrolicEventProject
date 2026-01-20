import React, { useEffect, useState } from 'react';
/* eslint-disable no-unused-vars */
import { motion, useScroll, useTransform } from 'framer-motion';
/* eslint-enable no-unused-vars */
import { Calendar, Users, Trophy, Building2, Target, Zap, Award, ArrowRight, Star, CheckCircle } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';
import ScaleIn from '../components/animations/ScaleIn';
import StaggerChildren from '../components/animations/StaggerChildren';
import './Home.css';
import EventsGrid from '../components/EventsGrid';
import { adminAPI } from '../utils/api';

export default function Home({ onNavigate }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Hero counters (animated numbers)
  const [eventsCount, setEventsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [institutesCount, setInstitutesCount] = useState(0);

  useEffect(() => {
    // animate values when events are loaded or component mounts
    const targets = {
      events: Math.max(events.length || 0, 500),
      students: 50000,
      institutes: 100
    };

    const animate = (target, setter, duration = 900) => {
      let start = 0;
      const steps = Math.ceil(duration / 30);
      const increment = Math.ceil(target / steps);
      const id = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(id);
        } else {
          setter(start);
        }
      }, 30);
      return id;
    };

    const ids = [];
    ids.push(animate(targets.events, setEventsCount));
    ids.push(animate(targets.students, setStudentsCount));
    ids.push(animate(targets.institutes, setInstitutesCount));

    return () => ids.forEach(clearInterval);
  }, [events]);
  useEffect(() => {
    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }, []);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getEvents();
        // Show only the first 3 events on home page
        setEvents((response.data || []).slice(0, 3));
        setError(null);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  
  return (
    <div className="home-page-modern">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-backdrop animated-gradient" aria-hidden></div>
        <motion.div className="hero-container" style={{ y }}>
          <div className="hero-content">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <div className="hero-badge">
                <span className="badge-dot"></span>
                Flagship Campus Experiences
              </div>

              <motion.h1 className="hero-title" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.85, delay: 0.12 }}>
                Where Campus Energy <span className="gradient-text">Becomes Experience</span>
              </motion.h1>

              <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                Curate moments, lead the action, and celebrate every victory — in a platform built for bold campus experiences.
              </motion.p>

              <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <motion.button
                  className="cta-button primary neon"
                  onClick={() => onNavigate('/register')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Enter the Experience
                  <ArrowRight size={18} />
                </motion.button>

                <motion.button
                  className="cta-button secondary"
                  onClick={() => onNavigate('/events')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Browse What’s Next
                </motion.button>
              </motion.div>

              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">{eventsCount.toLocaleString()}</div>
                  <div className="stat-label">Active Events</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{studentsCount.toLocaleString()}</div>
                  <div className="stat-label">Students</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{institutesCount.toLocaleString()}</div>
                  <div className="stat-label">Institutes</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Floating Cards */}
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.div
              className="floating-card card-1 glow-card"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Calendar size={24} className="card-icon" />
              <div className="card-content">
                <h4>Code Clash Championship</h4>
                <p>Battle of Algorithms</p>
                <div className="card-meta">
                  <Users size={14} />
                  <span>1.8K coders</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="floating-card card-2 glow-card"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Trophy size={24} className="card-icon" />
              <div className="card-content">
                <h4>Art & Soul Fest</h4>
                <p>Creative Expression</p>
                <div className="card-meta">
                  <Star size={14} />
                  <span>Spotlight Event</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="floating-card card-3 glow-card"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, delay: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Award size={24} className="card-icon" />
              <div className="card-content">
                <h4>Dance Revolution</h4>
                <p>Rhythm & Movement</p>
                <div className="card-meta">
                  <CheckCircle size={14} />
                  <span>Doors Open</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Events Section */}
      <section id="events" className="events-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Live Action</span>
            <h2 className="section-title">What's Happening at Frolic</h2>
            <p className="section-subtitle">Dive into the pulse of campus life with events that spark creativity and competition</p>
          </FadeIn>
          
          {events.length > 0 ? (
            <>
              <EventsGrid events={events} onNavigate={onNavigate} />
              <div className="view-all-container">
                <button className="cta-button secondary" onClick={() => onNavigate('/my-events')}>
                  <span>View All Events</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </>
          ) : loading ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={80} />
              </div>
              <h3>Loading Events...</h3>
              <p>Please wait while we fetch the latest events.</p>
            </div>
          ) : error ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={80} />
              </div>
              <h3>Failed to Load Events</h3>
              <p>{error}</p>
              <button className="cta-button primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <Calendar size={80} />
              </div>
              <h3>No Events Yet</h3>
              <p>Check back soon for upcoming events!</p>
              <button className="cta-button primary" onClick={() => onNavigate('/register')}>
                Register to Get Notified
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - How It Works */}
      <section id="how-it-works" className="features-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Your Journey</span>
            <h2 className="section-title">How It All Works</h2>
          </FadeIn>
          
          <StaggerChildren staggerDelay={0.2} className="features-grid">
            <motion.div
              className="feature-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="feature-number">01</div>
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Find Your Spark</h3>
              <p>Unearth events that match your interests and passions. Discover opportunities waiting to be seized.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="feature-number">02</div>
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Claim Your Spot</h3>
              <p>Seamless sign-up in moments. Your journey begins with a single click into the action.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="feature-number">03</div>
              <div className="feature-icon">
                <Trophy size={32} />
              </div>
              <h3>Make Your Mark</h3>
              <p>Step into the arena, showcase your talent, and etch your name in campus history.</p>
            </motion.div>
          </StaggerChildren>
        </div>
      </section>

      {/* Institutes Section */}
      <section id="institutes" className="institutes-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Campus Alliance</span>
            <h2 className="section-title">United Campuses</h2>
            <p className="section-subtitle">Bridging institutions through shared experiences and collaborative spirit</p>
          </FadeIn>
          
          <ScaleIn delay={0.4}>
            <div className="empty-state">
              <div className="empty-icon">
                <Building2 size={80} />
              </div>
              <h3>Growing Together</h3>
              <p>More campuses joining the Frolic family every day. The future of inter-college collaboration awaits.</p>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="results-section">
        <div className="section-container">
          <FadeIn delay={0.2} className="section-header">
            <span className="section-label">Victory Lane</span>
            <h2 className="section-title">Champions' Circle</h2>
            <p className="section-subtitle">Honoring the trailblazers who turned challenges into triumphs</p>
          </FadeIn>
          
          <ScaleIn delay={0.4}>
            <div className="empty-state">
              <div className="empty-icon">
                <Trophy size={80} />
              </div>
              <h3>Anticipation Builds</h3>
              <p>The next chapter of champions is being written. Stay tuned for the reveal of extraordinary achievements.</p>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="about-content">
            <FadeIn delay={0.2} direction="left" className="about-text">
              <span className="section-label">Our Story</span>
              <h2 className="section-title">Where Campus Dreams Take Flight</h2>
              <p className="about-description">
                Frolic isn't just a platform—it's the heartbeat of campus innovation. We empower students to discover, compete, and celebrate in ways that transcend boundaries and create lasting memories.
              </p>
              
              <div className="about-features">
                <div className="about-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Unified Experience</h4>
                    <p>Every opportunity at your fingertips</p>
                  </div>
                </div>
                <div className="about-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Live Pulse</h4>
                    <p>Real-time insights and instant alerts</p>
                  </div>
                </div>
                <div className="about-feature">
                  <CheckCircle size={24} />
                  <div>
                    <h4>Fortress of Trust</h4>
                    <p>Your journey protected every step</p>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.4} direction="right" className="about-visual">
              <div className="about-card">
                <Zap size={48} />
                <h3>Lightning Quick</h3>
                <p>From interest to action in moments</p>
              </div>
              <div className="about-card">
                <Users size={48} />
                <h3>Connected Souls</h3>
                <p>50K+ dreamers sharing the journey</p>
              </div>
              <div className="about-card">
                <Award size={48} />
                <h3>Growth Tracker</h3>
                <p>Watch your legend unfold</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="section-container">
          <FadeIn delay={0.2}>
            <div className="final-cta-content">
              <h2>Your Moment Awaits</h2>
              <p>Step into the arena where campus legends are born</p>
              <div className="cta-actions">
                <motion.button
                  className="cta-button primary large"
                  onClick={() => onNavigate('/register')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Begin Your Quest
                  <ArrowRight size={24} />
                </motion.button>
                <motion.button
                  className="cta-button secondary large"
                  onClick={() => onNavigate('/events')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore the Scene
                </motion.button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}