import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserPlus, FaSignInAlt, FaBookOpen } from 'react-icons/fa';

const Login = () => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!username) {
          throw new Error('Username is required');
        }
        await register(username, email, password, role);
      } else {
        await login(email, password);
      }
      // Redirect handled by useEffect
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} className="animate-fade-in">
      <div style={styles.card} className="glass-panel">
        <div style={styles.brand}>
          <FaBookOpen style={styles.logoIcon} />
          <h1 style={styles.brandText}>EduSyllabus Hub</h1>
        </div>

        <h2 style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
        <p style={styles.sub}>{isRegister ? 'Join the student discussion & links directory' : 'Sign in to access student & admin actions'}</p>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. janesmith"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. student@edusyllabus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Account Role (Testing Toggle)</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student (Post comments & suggest links)</option>
                <option value="admin">Administrator (Complete syllabus CRUD + approvals)</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : isRegister ? (
              <>
                <FaUserPlus /> Register Account
              </>
            ) : (
              <>
                <FaSignInAlt /> Log In
              </>
            )}
          </button>
        </form>

        <div style={styles.toggleWrap}>
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={styles.toggleBtn}
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Demo credentials tip */}
        {!isRegister && (
          <div style={styles.demoTip} className="glass-panel">
            <p style={{fontWeight: 600, marginBottom: '4px', fontSize: '0.8rem'}}>Demo Credentials (after Seeding):</p>
            <p style={styles.tipText}><strong>Admin:</strong> admin@edusyllabus.com / admin123</p>
            <p style={styles.tipText}><strong>Student:</strong> student@edusyllabus.com / student123</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 0',
  },
  card: {
    width: '100%',
    maxWidth: '460px',
    padding: '40px',
    background: 'var(--bg-glass)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '25px',
  },
  logoIcon: {
    fontSize: '2rem',
    color: 'var(--accent-cyan)',
  },
  brandText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: '800',
  },
  title: {
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '6px',
  },
  sub: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    textAlign: 'center',
    marginBottom: '30px',
  },
  errorBanner: {
    background: 'rgba(255, 23, 68, 0.1)',
    border: '1px solid rgba(255, 23, 68, 0.3)',
    color: '#ff8a80',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.9rem',
  },
  submitBtn: {
    width: '100%',
    marginTop: '10px',
    display: 'flex',
    gap: '8px',
  },
  toggleWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '25px',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-cyan)',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  demoTip: {
    marginTop: '30px',
    padding: '15px',
    background: 'rgba(0, 242, 254, 0.02)',
    border: '1px solid rgba(0, 242, 254, 0.1)',
    borderRadius: '10px',
  },
  tipText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  }
};

export default Login;
