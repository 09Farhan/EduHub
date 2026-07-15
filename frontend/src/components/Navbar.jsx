import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBookOpen, FaUserShield, FaSignOutAlt, FaSignInAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav} className="glass-panel">
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logoWrap}>
          <FaBookOpen style={styles.logoIcon} />
          <span style={styles.logoText}>EduSyllabus <span style={styles.logoHub}>Hub</span></span>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>Home</Link>
          
          {user ? (
            <div style={styles.userMenu}>
              <div style={styles.userProfile}>
                <FaUser style={styles.userIcon} />
                <span style={styles.username}>{user.username}</span>
                <span className={`comment-role-badge role-${user.role}`} style={{marginLeft: '5px'}}>
                  {user.role}
                </span>
              </div>
              
              {user.role === 'admin' && (
                <Link to="/admin" style={styles.adminBtn} className="btn btn-sm btn-secondary">
                  <FaUserShield /> Dashboard
                </Link>
              )}

              <button onClick={handleLogout} style={styles.logoutBtn} className="btn btn-sm btn-danger">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              <FaSignInAlt /> Login / Join
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: '15px 30px',
    margin: '20px',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    fontSize: '1.8rem',
    color: 'var(--accent-cyan)',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: '800',
    letterSpacing: '-0.02em',
  },
  logoHub: {
    color: 'var(--accent-cyan)',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
  },
  link: {
    fontWeight: '500',
    color: 'var(--text-secondary)',
    transition: 'var(--transition-smooth)',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid var(--border-glass)',
  },
  userIcon: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
  },
  username: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  adminBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  }
};

export default Navbar;
