import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../context/AuthContext';
import { FaChevronRight, FaArrowRight, FaBookOpen } from 'react-icons/fa';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subjectData, setSubjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjectData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/subjects/${id}`);
        if (!response.ok) {
          throw new Error('Subject not found');
        }
        const data = await response.json();
        setSubjectData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [id]);

  if (loading) {
    return <div style={styles.loadingWrap}>Loading subject syllabus...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorWrap} className="glass-panel">
        <h2>Oops! {error}</h2>
        <p>Return to <Link to="/" style={styles.link}>Home</Link>.</p>
      </div>
    );
  }

  const { subject, modules } = subjectData;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumbs-separator"><FaChevronRight style={{fontSize: '0.7rem'}} /></span>
        <Link to={`/semester/${subject.semester?.number}`}>Semester {subject.semester?.number}</Link>
        <span className="breadcrumbs-separator"><FaChevronRight style={{fontSize: '0.7rem'}} /></span>
        <span>{subject.code}</span>
      </div>

      {/* Header Info */}
      <div style={styles.header} className="glass-panel">
        <span className="subject-code-pill">{subject.code}</span>
        <h1 style={styles.title}>{subject.name}</h1>
        <p style={styles.description}>{subject.description || 'No overview available.'}</p>
        <div style={styles.metaRow}>
          <span>Semester: <strong>{subject.semester?.number}</strong></span>
          <span style={styles.separator}>|</span>
          <span>Credits: <strong>{subject.credits}</strong></span>
          <span style={styles.separator}>|</span>
          <span>Total Modules: <strong>{modules.length}</strong></span>
        </div>
      </div>

      {/* Modules List */}
      <div style={styles.sectionHeaderWrap}>
        <h2 style={styles.sectionTitle}>Syllabus Breakdown</h2>
      </div>

      {modules.length === 0 ? (
        <div style={styles.emptyState} className="glass-panel">
          <FaBookOpen style={styles.emptyIcon} />
          <p>No modules are currently listed for this subject.</p>
        </div>
      ) : (
        modules.map((mod) => (
          <div key={mod._id} className="module-section">
            <div className="module-header">
              <div className="module-title-wrap">
                <span className="module-pill">Module {mod.moduleNumber}</span>
                <h3 className="module-name">{mod.name}</h3>
              </div>
              {mod.description && <span style={styles.modDesc}>{mod.description}</span>}
            </div>
            <div className="module-body">
              {mod.topics?.length === 0 ? (
                <p style={styles.noTopics}>No topics listed in this module yet.</p>
              ) : (
                <div className="topics-list">
                  {mod.topics?.map((topic) => (
                    <div
                      key={topic._id}
                      onClick={() => navigate(`/topic/${topic._id}`)}
                      className="topic-row"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="topic-content">
                        <h4 className="topic-title">{topic.title}</h4>
                        {topic.description && <p className="topic-desc">{topic.description}</p>}
                      </div>
                      <FaArrowRight style={styles.arrowIcon} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
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
  title: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-cyan) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '10px 0',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: '1.05rem',
    marginBottom: '20px',
    maxWidth: '800px',
  },
  metaRow: {
    display: 'flex',
    gap: '20px',
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
    borderTop: '1px solid var(--border-glass)',
    paddingTop: '15px',
    flexWrap: 'wrap',
  },
  separator: {
    color: 'var(--text-muted)',
  },
  sectionHeaderWrap: {
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '10px',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
  },
  modDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    maxWidth: '50%',
    textAlign: 'right',
  },
  noTopics: {
    color: 'var(--text-muted)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  arrowIcon: {
    color: 'var(--accent-cyan)',
    fontSize: '1.1rem',
  },
  emptyState: {
    padding: '50px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'var(--text-muted)',
    marginBottom: '15px',
  }
};

export default SubjectDetail;
