import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../context/AuthContext';
import { FaChevronRight, FaArrowRight, FaBookOpen } from 'react-icons/fa';

const SemesterDetail = () => {
  const { number } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dept = searchParams.get('dept') || 'CSE';

  const [semesterData, setSemesterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSemesterData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE_URL}/semesters/${number}?dept=${dept}`);
        if (!response.ok) {
          throw new Error('Semester not found');
        }
        const data = await response.json();
        setSemesterData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesterData();
  }, [number, dept]);

  if (loading) {
    return <div style={styles.loadingWrap}>Loading semester details...</div>;
  }

  if (error) {
    return (
      <div style={styles.errorWrap} className="glass-panel">
        <h2>Oops! {error}</h2>
        <p>Return to <Link to="/" style={styles.link}>Home</Link>.</p>
      </div>
    );
  }

  const { semester, subjects } = semesterData;

  // Calculate total credits for this semester
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <span className="breadcrumbs-separator"><FaChevronRight style={{fontSize: '0.7rem'}} /></span>
        <span>Semester {semester.number} ({dept})</span>
      </div>

      {/* Header Info */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Semester {semester.number} ({dept}) Syllabus</h1>
          <p style={styles.subtitle}>{semester.description || `B.Tech ${dept} syllabus resources`}</p>
        </div>
        <div style={styles.statsPanel} className="glass-panel">
          <div style={styles.statItem}>
            <span style={styles.statVal}>{subjects.length}</span>
            <span style={styles.statLabel}>Subjects</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statVal}>{totalCredits}</span>
            <span style={styles.statLabel}>Total Credits</span>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div style={styles.sectionHeaderWrap}>
        <h2 style={styles.sectionTitle}>Syllabus Index</h2>
      </div>

      {subjects.length === 0 ? (
        <div style={styles.emptyState} className="glass-panel">
          <FaBookOpen style={styles.emptyIcon} />
          <p>No subjects have been registered for {dept} in this semester yet.</p>
        </div>
      ) : (
        <div className="subjects-list">
          {subjects.map((subj) => (
            <div
              key={subj._id}
              onClick={() => navigate(`/subject/${subj._id}`)}
              className="glass-panel glass-panel-hover subject-item"
              style={{ cursor: 'pointer' }}
            >
              <div className="subject-info">
                <span className="subject-code-pill">{subj.code}</span>
                <h3 className="subject-name">{subj.name}</h3>
                <div className="subject-meta">
                  <span className="subject-meta-item">{subj.credits} Credit Points</span>
                  {subj.description && (
                    <>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span style={styles.truncateDesc}>{subj.description}</span>
                    </>
                  )}
                </div>
              </div>
              <FaArrowRight style={styles.arrowIcon} />
            </div>
          ))}
        </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '40px',
  },
  title: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #ffffff 40%, var(--accent-cyan) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem',
  },
  statsPanel: {
    display: 'flex',
    padding: '15px 30px',
    gap: '30px',
    background: 'rgba(255,255,255,0.02)',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statVal: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: 'var(--accent-cyan)',
    lineHeight: '1.2',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sectionHeaderWrap: {
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1.8rem',
  },
  truncateDesc: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '400px',
    display: 'inline-block',
  },
  arrowIcon: {
    color: 'var(--accent-cyan)',
    fontSize: '1.2rem',
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

export default SemesterDetail;
