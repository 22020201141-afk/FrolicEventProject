import React, { useEffect, useState, useRef } from 'react';
import { Building2, MapPin, Globe, X, Link as LinkIcon, LayoutGrid, List, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminAPI } from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import './Institutes.css';

// Persisted layout choice key
const LAYOUT_KEY = 'institutes_layout';

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 }
};

const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0,2)
    .join('')
    .toUpperCase();
};

const Institutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [deptCounts, setDeptCounts] = useState({});
  const [copyMsg, setCopyMsg] = useState('');

  const [layout, setLayout] = useState(() => localStorage.getItem(LAYOUT_KEY) || 'grid');

  useEffect(() => {
    if (layout) localStorage.setItem(LAYOUT_KEY, layout);
  }, [layout]);

  const params = useParams();
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminAPI.getInstitutes();
        const list = res.data || [];
        setInstitutes(list);

        // If URL contains an institute id, auto-open it
        if (params?.id) {
          const found = list.find(i => i._id === params.id);
          if (found) {
            setSelected(found);
            // scroll the selected card into view after next tick
            setTimeout(() => {
              const el = document.getElementById(`inst-card-${params.id}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 150);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load institutes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params?.id]);

  useEffect(() => {
    if (!selected) return;
    const loadDepts = async () => {
      try {
        setDeptLoading(true);
        const res = await adminAPI.getDepartmentsByInstitute(selected._id);
        setDepartments(res.data || []);
      } catch (err) {
        setDepartments([]);
      } finally {
        setDeptLoading(false);
      }
    };
    loadDepts();
  }, [selected]);

  // lazy fetch department counts when hovered/focused
  const fetchDeptCount = async (id) => {
    if (deptCounts[id] !== undefined) return;
    setDeptCounts(prev => ({ ...prev, [id]: null })); // null = loading
    try {
      const res = await adminAPI.getDepartmentsByInstitute(id);
      setDeptCounts(prev => ({ ...prev, [id]: (res.data || []).length }));
    } catch (e) {
      setDeptCounts(prev => ({ ...prev, [id]: 0 }));
    }
  };

  // Manage modal focus and ESC key
  useEffect(() => {
    if (selected) {
      lastActiveRef.current = document.activeElement;
      setTimeout(() => modalRef.current?.focus(), 0);
    }

    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Enter' && document.activeElement?.dataset?.instId) {
        const id = document.activeElement.dataset.instId;
        const inst = institutes.find(i => i._id === id);
        if (inst) openInstitute(inst);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, institutes]);

  const filtered = institutes.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

  const openInstitute = (inst) => {
    setSelected(inst);
    navigate(`/institute/${inst._id}`);
  };

  const closeModal = () => {
    setSelected(null);
    setDepartments([]);
    navigate('/institute');
    // return focus
    setTimeout(() => lastActiveRef.current?.focus(), 0);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyMsg('Link copied to clipboard!');
      setTimeout(() => setCopyMsg(''), 2500);
    } catch (e) {
      setCopyMsg('Failed to copy');
      setTimeout(() => setCopyMsg(''), 2500);
    }
  };

  // skeleton placeholders when loading
  const renderSkeletons = () => {
    const items = Array.from({ length: 6 });
    return (
      <div className="institutes-grid">
        {items.map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-avatar" />
            <div className="skeleton-lines">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line small" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="institutes-page">
      <div className="institutes-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </div>

      <div className="institutes-container">
        <div className="institutes-header">
          <div>
            <h1 className="institutes-title">Participating Institutes</h1>
            <p className="institutes-subtitle">Explore colleges and universities in our network</p>
          </div>

          <div className="institutes-actions">
            <div className="layout-toggle-group" role="tablist" aria-label="Layout">
              <button
                className={`layout-toggle ${layout === 'grid' ? 'active' : ''}`}
                onClick={() => setLayout('grid')}
                aria-pressed={layout === 'grid'}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid />
              </button>
              <button
                className={`layout-toggle ${layout === 'list' ? 'active' : ''}`}
                onClick={() => setLayout('list')}
                aria-pressed={layout === 'list'}
                title="List view"
                aria-label="List view"
              >
                <List />
              </button>
            </div>

            <div className="institutes-search-box">
              <Search />
              <input
                type="search"
                placeholder="Search institutes by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="institutes-search"
                aria-label="Search institutes"
              />
            </div>

            <button className="primary-btn" onClick={() => setQuery('')} aria-label="Clear search">Clear</button>
          </div>
        </div>

        {loading ? (
          renderSkeletons()
        ) : error ? (
          <div className="no-institutes">
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="no-institutes">
            <Building2 size={80} />
            <h2>No matching institutes</h2>
            <p>Try a different search term or clear filters.</p>
          </div>
        ) : (
          <motion.div className={`institutes-grid ${layout === 'list' ? 'layout-list' : 'layout-grid'}`} initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
            {filtered.map((inst) => (
              <motion.div
                key={inst._id}
                id={`inst-card-${inst._id}`}
                className="institute-card"
                variants={cardVariants}
                onClick={() => openInstitute(inst)}
                onMouseEnter={() => fetchDeptCount(inst._id)}
                tabIndex={0}
                data-inst-id={inst._id}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openInstitute(inst); }}
                role="button"
                aria-label={`Open ${inst.name} details`}
              >
                <div className="institute-image">
                  <img src={inst.image || 'https://picsum.photos/800/480?random=' + inst._id} alt={inst.name} onError={(e) => { e.target.src = 'https://picsum.photos/800/480'; }} />
                  <div className="image-gradient-overlay"></div>
                  <div className="coordinator-badge">{inst.coordinator ? getInitials(inst.coordinator.fullName) : 'NA'}</div>
                </div>

                <div className="institute-content">
                  <h3 className="institute-name">{inst.name}</h3>
                  <p className="institute-desc">{inst.description}</p>

                  <div className="institute-meta-row">
                    <div className="meta-left">
                      <div className="meta-item"><MapPin size={14} /><span style={{ marginLeft: 6 }}>{inst.location || 'Location'}</span></div>
                      <div className="meta-item"><Globe size={14} /><span style={{ marginLeft: 6 }}>{inst.website || 'Website'}</span></div>
                    </div>
                    <div className="meta-right">
                      <div className="dept-count">
                        {deptCounts[inst._id] === undefined ? '' : deptCounts[inst._id] === null ? <div className="count-loader" /> : <span className="count-badge">{deptCounts[inst._id]} depts</span>}
                      </div>
                      <button className="details-btn" onClick={(e) => { e.stopPropagation(); openInstitute(inst); }}>View Departments</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="institutes-modal" onClick={closeModal}>
          <motion.div
            className="institutes-modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            tabIndex={-1}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="institute-modal-title"
          >
            <button className="modal-close" onClick={closeModal} aria-label="Close"><X /></button>
            <div className="modal-grid">
              <div className="modal-left">
                <div className="modal-logo-lg" style={{ backgroundImage: selected.image ? `url(${selected.image})` : undefined }} />
                <h2 id="institute-modal-title">{selected.name}</h2>
                <p className="institute-full-desc">{selected.description}</p>
                <div className="modal-meta">
                  <div className="meta-item"><MapPin size={14} /><span style={{ marginLeft: 8 }}>{selected.location || 'Location'}</span></div>
                  <div className="meta-item"><Globe size={14} /><span style={{ marginLeft: 8 }}>{selected.website || 'Website'}</span></div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button className="copy-btn" onClick={copyLink}><LinkIcon size={14} /> <span style={{ marginLeft: 8 }}>Copy Link</span></button>
                  <div aria-live="polite" className="copy-msg">{copyMsg}</div>
                </div>
              </div>

              <div className="modal-right">
                <h3>Departments</h3>
                {deptLoading ? (
                  <p>Loading departments...</p>
                ) : departments.length === 0 ? (
                  <p>No departments listed for this institute.</p>
                ) : (
                  <div className="dept-list">
                    {departments.map(d => (
                      <div key={d._id} className="dept-card">
                        <div className="dept-image" style={{ backgroundImage: d.image ? `url(${d.image})` : undefined }}>
                          {!d.image && <Building2 />}
                        </div>
                        <div>
                          <h4>{d.name}</h4>
                          <p style={{ color: 'rgba(255,255,255,0.7)' }}>{d.description?.slice(0,140)}{d.description?.length > 140 ? '...' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Institutes;