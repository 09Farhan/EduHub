import React, { useState } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { FaTrash, FaCommentAlt } from 'react-icons/fa';

const CommentSection = ({ topicId, comments, setComments }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ topicId, content }),
      });

      const data = await response.ok ? await response.json() : null;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post comment');
      }

      setComments((prev) => [data, ...prev]);
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="comments-container">
      <h2 style={styles.sectionTitle}>
        <FaCommentAlt style={styles.titleIcon} /> Topic Discussion ({comments.length})
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} style={styles.commentForm}>
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Ask a question or share thoughts about this topic..."
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          {error && <p style={styles.errorText}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div style={styles.loginPrompt} className="glass-panel">
          <p>You must be logged in to participate in the discussion.</p>
        </div>
      )}

      <div style={styles.commentsList}>
        {comments.length === 0 ? (
          <p style={styles.noComments}>No discussions yet. Be the first to ask a question!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="glass-panel comment-card animate-fade-in">
              <div className="comment-header">
                <div className="comment-user-info">
                  <span className="comment-username">{comment.user?.username || 'Unknown User'}</span>
                  <span className={`comment-role-badge role-${comment.user?.role || 'student'}`}>
                    {comment.user?.role || 'student'}
                  </span>
                </div>
                <div style={styles.headerRight}>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {user && (user.role === 'admin' || user._id === comment.user?._id) && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      style={styles.deleteBtn}
                      title="Delete Comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <div className="comment-body">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  sectionTitle: {
    fontSize: '1.6rem',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  titleIcon: {
    color: 'var(--accent-cyan)',
  },
  commentForm: {
    marginBottom: '30px',
  },
  errorText: {
    color: 'var(--danger)',
    fontSize: '0.9rem',
    marginBottom: '10px',
  },
  loginPrompt: {
    padding: '20px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    marginBottom: '30px',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  noComments: {
    textAlign: 'center',
    color: 'var(--text-muted)',
    padding: '30px 0',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
    padding: '2px',
  },
};

export default CommentSection;
