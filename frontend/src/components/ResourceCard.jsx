import React from 'react';
import { FaBookReader, FaNewspaper, FaPlay, FaExternalLinkAlt } from 'react-icons/fa';

const ResourceCard = ({ resource }) => {
  const { url, type, description, submittedBy } = resource;

  const getTypeIcon = () => {
    switch (type) {
      case 'long-form':
        return <FaBookReader />;
      case 'medium-length':
        return <FaNewspaper />;
      case 'short-form':
        return <FaPlay />;
      default:
        return null;
    }
  };

  const getTypeName = () => {
    switch (type) {
      case 'long-form':
        return 'Long-Form (Detailed / Textbook)';
      case 'medium-length':
        return 'Medium-Length (Article / Blog)';
      case 'short-form':
        return 'Short-Form (Video / Cheat Sheet)';
      default:
        return type;
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'long-form':
        return 'type-long-form';
      case 'medium-length':
        return 'type-medium-length';
      case 'short-form':
        return 'type-short-form';
      default:
        return '';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover resource-card animate-fade-in">
      <div>
        <div className={`resource-type-indicator ${getTypeClass()}`}>
          {getTypeIcon()} {getTypeName()}
        </div>
        <h3 style={styles.cardDesc}>{description}</h3>
        <p style={styles.submitted}>
          Submitted by: <span style={styles.subUser}>{submittedBy?.username || 'System'}</span>
        </p>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-secondary btn-sm"
        style={styles.linkBtn}
      >
        Open Resource <FaExternalLinkAlt style={styles.btnIcon} />
      </a>
    </div>
  );
};

const styles = {
  cardDesc: {
    fontSize: '1.15rem',
    marginBottom: '10px',
    lineHeight: '1.4',
  },
  submitted: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginBottom: '20px',
  },
  subUser: {
    color: 'var(--accent-cyan)',
    fontWeight: '500',
  },
  linkBtn: {
    alignSelf: 'flex-start',
    marginTop: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
  },
  btnIcon: {
    fontSize: '0.8rem',
  }
};

export default ResourceCard;
