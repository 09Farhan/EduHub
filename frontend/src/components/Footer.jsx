import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p style={styles.text}>© {new Date().getFullYear()} EduSyllabus Hub. Built for B.Tech CSE Students.</p>
        <p style={styles.subtext}>A comprehensive semester-wise syllabus index & vetted reference directory.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    borderTop: '1px solid var(--border-glass)',
    padding: '30px 20px',
    marginTop: '60px',
    background: 'rgba(10, 11, 16, 0.5)',
    textAlign: 'center',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  text: {
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    marginBottom: '8px',
  },
  subtext: {
    color: 'var(--text-muted)',
    fontSize: '0.8rem',
  }
};

export default Footer;
