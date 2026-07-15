import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import ResourceCard from '../components/ResourceCard';
import CommentSection from '../components/CommentSection';
import { FaChevronRight, FaPlusCircle, FaBookOpen } from 'react-icons/fa';

const TopicDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [topicData, setTopicData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Suggest Resource Form State
  const [url, setUrl] = useState('');
  const [type, setType] = useState('long-form');
  const [description, setDescription] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTopicData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/topics/${id}`);
        if (!response.ok) {
          throw new Error('Topic details not found');
        }
        const data = await response.json();
        setTopicData(data.topic);
        setComments(data.comments || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicData();
  }, [id]);

  const [approvedResources, setApprovedResources] = useState([]);
  useEffect(() => {
    if (id) {
      const fetchResources = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/topics/${id}`);
          if (response.ok) {
            const data = await response.json();
            setApprovedResources(data.resources || []);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchResources();
    }
  }, [id, submitSuccess]); // Refetch when a resource is submitted/approved

  const handleSuggestResource = async (e) => {
    e.preventDefault();
    if (!url || !description) return;

    setSubmitting(true);
    setSubmitSuccess('');
    setSubmitError('');

    try {
      const response = await fetch(`${API_BASE_URL}/topics/${id}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ url, type, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit resource');
      }

      setSubmitSuccess(data.message);
      setUrl('');
      setDescription('');
      
      // If user is admin, immediately add to list
      if (user.role === 'admin') {
        setApprovedResources((prev) => [...prev, data.resource]);
      }
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={styles.loadingWrap}>Loading topic data...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorWrap} className="glass-panel">
        <h2>Oops! {error}</h2>
        <p>Return to <Link to="/" style={styles.link}>Home</Link>.</p>
      </div>
    );
  }

  const { module } = topicData;
  const { subject } = module;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumbs-separator"><FaChevronRight style={{fontSize: '0.7rem'}} /></span>
        <Link to={`/semester/${subject.semester?.number}`}>Semester {subject.semester?.number}</Link>
        <span className="breadcrumbs-separator"><FaChevronRight style={{fontSize: '0.7rem'}} /></span>
        <Link to={`/subject/${subject._id}`}>{subject.code}</Link>
        <span className="breadcrumbs-separator"><FaChevronRight style={{fontSize: '0.7rem'}} /></span>
        <span>{topicData.title}</span>
      </div>

      {/* Header Panel */}
      <div style={styles.header} className="glass-panel">
        <div style={styles.metaHeader}>
          <span className="subject-code-pill" style={{margin: 0}}>{subject.code}</span>
          <span style={styles.modLabel}>Module {module.moduleNumber}: {module.name}</span>
        </div>
        <h1 style={styles.title}>{topicData.title}</h1>
        {topicData.description && <p style={styles.desc}>{topicData.description}</p>}
      </div>

      {/* Approved Resources */}
      <div style={styles.sectionHeaderWrap}>
        <h2 style={styles.sectionTitle}>Approved Reference Materials</h2>
        <p style={styles.sectionSub}>Curated long-form (textbooks/guides), medium-length (articles), and short-form (videos/summaries) resources.</p>
      </div>

      {approvedResources.length === 0 ? (
        <div style={styles.emptyState} className="glass-panel">
          <FaBookOpen style={styles.emptyIcon} />
          <p>No verified resource links are active for this topic yet.</p>
        </div>
      ) : (
        <div className="resource-grid">
          {approvedResources.map((res) => (
            <ResourceCard key={res._id} resource={res} />
          ))}
        </div>
      )}

      {/* Suggest Link Panel */}
      <div style={styles.suggestWrap} className="glass-panel">
        <h3 style={styles.suggestTitle}>
          <FaPlusCircle style={{color: 'var(--accent-cyan)'}} /> Suggest study link for this Topic
        </h3>
        {user ? (
          <form onSubmit={handleSuggestResource} style={styles.form}>
            <div style={styles.formRow}>
              <div className="form-group" style={{flex: 2}}>
                <label className="form-label">Resource URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/tutorial"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Link Type</label>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="long-form">Long-form (Tutorial/Book)</option>
                  <option value="medium-length">Medium-length (Article/Blog)</option>
                  <option value="short-form">Short-form (Video/Cheat-sheet)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brief Description</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Stanford CS Lecture Notes, YouTube crash course, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {submitSuccess && <p style={styles.successText}>{submitSuccess}</p>}
            {submitError && <p style={styles.errorText}>{submitError}</p>}

            <button type="submit" className="btn btn-secondary btn-sm" disabled={submitting}>
              {submitting ? 'Submitting...' : user.role === 'admin' ? 'Add Link' : 'Submit for Approval'}
            </button>
          </form>
        ) : (
          <p style={styles.suggestLoginText}>
            Please <Link to="/login" style={styles.link}>login</Link> to contribute reference links to this topic.
          </p>
        )}
      </div>

      {/* Discussions (Comments) */}
      <CommentSection topicId={id} comments={comments} setComments={setComments} />
    </div>
  );
};

const styles = {
  loadingWrap: {
    padding: '80px 0',
    textAlign: 'center',
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
  },
  errorWrap: {
    padding: '40px',
    textAlign: 'center',
    marginTop: '40px',
  },
  link: {
    color: 'var(--accent-cyan)',
    textDecoration: 'underline',
  },
  header: {
    padding: '30px',
    marginBottom: '40px',
    background: 'rgba(27, 30, 50, 0.4)',
  },
  metaHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '15px',
  },
  modLabel: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
  },
  title: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-cyan) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '12px',
  },
  desc: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
  },
  sectionHeaderWrap: {
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '10px',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
    marginBottom: '4px',
  },
  sectionSub: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
  },
  emptyState: {
    padding: '50px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    marginBottom: '30px',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'var(--text-muted)',
    marginBottom: '15px',
  },
  suggestWrap: {
    padding: '30px',
    marginBottom: '40px',
    background: 'rgba(25, 20, 40, 0.3)',
    border: '1px solid rgba(127, 0, 255, 0.15)',
  },
  suggestTitle: {
    fontSize: '1.4rem',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  form: {
    marginTop: '15px',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  successText: {
    color: 'var(--success)',
    fontWeight: '500',
    marginBottom: '15px',
  },
  errorText: {
    color: 'var(--danger)',
    marginBottom: '15px',
  },
  suggestLoginText: {
    color: 'var(--text-secondary)',
  }
};

export default TopicDetail;
