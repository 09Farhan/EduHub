import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE_URL } from '../context/AuthContext';
import { FaCheck, FaTimes, FaPlus, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('approvals');

  // Resource link list state
  const [pendingResources, setPendingResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(true);

  // Syllabus list state for deletion
  const [subjectsList, setSubjectsList] = useState([]);
  const [modulesList, setModulesList] = useState([]);

  // Syllabus creation forms state
  const [subjectForm, setSubjectForm] = useState({
    code: '',
    name: '',
    semesterNumber: '1',
    credits: '3',
    department: 'CSE',
    description: '',
  });

  const [moduleForm, setModuleForm] = useState({
    subjectId: '',
    moduleNumber: '1',
    name: '',
    description: '',
  });

  const [topicForm, setTopicForm] = useState({
    moduleId: '',
    title: '',
    description: '',
  });

  const [formFeedback, setFormFeedback] = useState({ type: '', msg: '' });

  // 1. Fetch pending approvals
  const fetchPendingResources = async () => {
    setLoadingResources(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resources/pending`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPendingResources(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResources(false);
    }
  };

  // 2. Fetch subjects & modules list
  const fetchSyllabusIndex = async () => {
    try {
      const subResponse = await fetch(`${API_BASE_URL}/subjects`);
      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubjectsList(subData);
        if (subData.length > 0) {
          // Set defaults for form selectors
          setModuleForm((prev) => ({ ...prev, subjectId: subData[0]._id }));
          
          // Fetch modules for first subject as topic default
          fetchModulesForSubject(subData[0]._id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchModulesForSubject = async (subjId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${subjId}`);
      if (response.ok) {
        const data = await response.json();
        setModulesList(data.modules || []);
        if (data.modules?.length > 0) {
          setTopicForm((prev) => ({ ...prev, moduleId: data.modules[0]._id }));
        } else {
          setTopicForm((prev) => ({ ...prev, moduleId: '' }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPendingResources();
      fetchSyllabusIndex();
    }
  }, [user]);

  // Approvals handler
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        setPendingResources((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this study link?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        setPendingResources((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Subject handler
  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setFormFeedback({ type: '', msg: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(subjectForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create subject');
      }

      setFormFeedback({ type: 'success', msg: `Subject ${data.code} created successfully!` });
      setSubjectForm({ code: '', name: '', semesterNumber: '1', credits: '3', department: 'CSE', description: '' });
      fetchSyllabusIndex();
    } catch (err) {
      setFormFeedback({ type: 'error', msg: err.message });
    }
  };

  // Create Module handler
  const handleCreateModule = async (e) => {
    e.preventDefault();
    setFormFeedback({ type: '', msg: '' });
    
    // We didn't create a separate post route for modules, but wait, let's see. Did we define a module creation route in subjects?
    // Wait, in backend/routes/subjects.js we have subject CRUD, but we should make sure we can create modules. Let's look at backend/routes/subjects.js. We don't have POST /api/modules! We should create a router for modules or add a route inside subjects.js. Let's check!
    // Ah, in backend/server.js we imported:
    // app.use('/api/subjects', require('./routes/subjects'));
    // Wait, we didn't add `/api/modules` or `/api/topics` routes. Wait!
    // Yes, in routes/topics.js we have:
    // `router.post('/', protect, admin, async (req, res) => { const { moduleId, title, description } = req.body; ... })`
    // So topic creation is POST `/api/topics` which exists!
    // But what about Module creation? Let's check backend/routes/subjects.js to see if we can create a module there, or if we should add it. Wait, in `backend/routes/subjects.js` there is no POST for modules.
    // Let's create a POST `/api/modules` in a new route file or add it to `backend/routes/subjects.js`. Yes, adding it to `backend/routes/subjects.js` or creating `backend/routes/modules.js` is easy. Let's write `POST /api/subjects/:id/modules` inside `backend/routes/subjects.js`. This is extremely RESTful!
    // Let's check if we did this. In `backend/routes/subjects.js` we have GET `/api/subjects/:id` and GET/POST/PUT/DELETE. We can easily add a POST `/api/subjects/:id/modules` to it. Let's inspect subjects.js first or update it. Since we wrote it, we know it doesn't have it.
    // Let's write the module creation handler assuming we will add `POST /api/subjects/:id/modules` to `backend/routes/subjects.js` in a minute.
    // Let's check the API call URL: `${API_BASE_URL}/subjects/${moduleForm.subjectId}/modules`. That's perfect.
  };

  // Create Topic handler
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setFormFeedback({ type: '', msg: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/topics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(topicForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create topic');
      }

      setFormFeedback({ type: 'success', msg: `Topic "${data.title}" added to module successfully!` });
      setTopicForm((prev) => ({ ...prev, title: '', description: '' }));
    } catch (err) {
      setFormFeedback({ type: 'error', msg: err.message });
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm('WARNING: Deleting a subject will permanently delete all its modules, topics, comments, and resources! Proceed?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete subject');
      }

      setSubjectsList((prev) => prev.filter((s) => s._id !== id));
      alert('Subject deleted successfully');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 style={styles.title}>Admin Panel Dashboard</h1>
      <p style={styles.subtitle}>Moderate student-submitted links and manage B.Tech CSE syllabus tree.</p>

      {/* Tabs */}
      <div className="admin-tab-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'approvals' ? 'active' : ''}`}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals ({pendingResources.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Add to Syllabus
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Delete / Purge Subjects
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'approvals' && (
        <div>
          <h2 style={styles.sectionHeader}>Awaiting Vetting</h2>
          {loadingResources ? (
            <p>Loading pending suggestions...</p>
          ) : pendingResources.length === 0 ? (
            <div style={styles.cleanState} className="glass-panel">
              <FaCheckCircle style={styles.cleanIcon} />
              <p>Everything is caught up! No links pending review.</p>
            </div>
          ) : (
            <table className="admin-table glass-panel">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Description</th>
                  <th>Length Type</th>
                  <th>URL</th>
                  <th>Suggested By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingResources.map((res) => (
                  <tr key={res._id}>
                    <td><strong>{res.topic?.title || 'Unknown Topic'}</strong></td>
                    <td>{res.description}</td>
                    <td><span className="comment-role-badge role-student">{res.type}</span></td>
                    <td>
                      <a href={res.url} target="_blank" rel="noopener noreferrer" style={styles.tableLink}>
                        {res.url.substring(0, 30)}...
                      </a>
                    </td>
                    <td>{res.submittedBy?.username || 'Guest'}</td>
                    <td>
                      <div style={styles.actionsWrap}>
                        <button
                          onClick={() => handleApprove(res._id)}
                          style={{ ...styles.actionBtn, background: 'var(--success)' }}
                          title="Approve Link"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleReject(res._id)}
                          style={{ ...styles.actionBtn, background: 'var(--danger)' }}
                          title="Reject & Delete"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div style={styles.createFormsGrid}>
          {/* Feedback banner */}
          {formFeedback.msg && (
            <div
              style={{
                ...styles.feedbackBanner,
                background: formFeedback.type === 'success' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                borderColor: formFeedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
                color: formFeedback.type === 'success' ? '#81c784' : '#ff8a80',
                gridColumn: '1 / -1',
              }}
            >
              {formFeedback.msg}
            </div>
          )}

          {/* Form 1: Add Subject */}
          <div className="glass-panel" style={styles.formCard}>
            <h3 style={styles.formTitle}><FaPlus /> Create Subject</h3>
            <form onSubmit={handleCreateSubject}>
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CS502"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Theory of Computation"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Semester (1 to 8)</label>
                <select
                  className="form-select"
                  value={subjectForm.semesterNumber}
                  onChange={(e) => setSubjectForm({ ...subjectForm, semesterNumber: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>Semester {num}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  value={subjectForm.department}
                  onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                >
                  <option value="CSE">CSE (Computer Science)</option>
                  <option value="AIML">AIML (AI & Machine Learning)</option>
                  <option value="IT">IT (Information Tech)</option>
                  <option value="ECE">ECE (Electronics & Comm)</option>
                  <option value="EE">EE (Electrical Eng)</option>
                  <option value="Civil">Civil Engineering</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Credit Points</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="6"
                  value={subjectForm.credits}
                  onChange={(e) => setSubjectForm({ ...subjectForm, credits: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brief Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="Subject overview and prerequisites..."
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Add Subject</button>
            </form>
          </div>

          {/* Form 2: Add Module */}
          <div className="glass-panel" style={styles.formCard}>
            <h3 style={styles.formTitle}><FaPlus /> Create Module</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setFormFeedback({ type: '', msg: '' });

                if (!moduleForm.subjectId) {
                  setFormFeedback({ type: 'error', msg: 'Please create a subject first.' });
                  return;
                }

                try {
                  const response = await fetch(`${API_BASE_URL}/subjects/${moduleForm.subjectId}/modules`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                      moduleNumber: moduleForm.moduleNumber,
                      name: moduleForm.name,
                      description: moduleForm.description,
                    }),
                  });

                  const data = await response.json();

                  if (!response.ok) {
                    throw new Error(data.message || 'Failed to create module');
                  }

                  setFormFeedback({ type: 'success', msg: `Module ${data.moduleNumber} created successfully!` });
                  setModuleForm({ ...moduleForm, name: '', description: '' });
                  fetchModulesForSubject(moduleForm.subjectId);
                } catch (err) {
                  setFormFeedback({ type: 'error', msg: err.message });
                }
              }}
            >
              <div className="form-group">
                <label className="form-label">Select Subject</label>
                <select
                  className="form-select"
                  value={moduleForm.subjectId}
                  onChange={(e) => {
                    setModuleForm({ ...moduleForm, subjectId: e.target.value });
                    fetchModulesForSubject(e.target.value);
                  }}
                >
                  {subjectsList.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      [{sub.code}] {sub.name} (Sem {sub.semester?.number})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Module Number</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="10"
                  value={moduleForm.moduleNumber}
                  onChange={(e) => setModuleForm({ ...moduleForm, moduleNumber: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Module Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Lexical Analysis"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Overview/Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="What is covered in this module..."
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Add Module</button>
            </form>
          </div>

          {/* Form 3: Add Topic */}
          <div className="glass-panel" style={styles.formCard}>
            <h3 style={styles.formTitle}><FaPlus /> Create Topic</h3>
            <form onSubmit={handleCreateTopic}>
              <div className="form-group">
                <label className="form-label">Select Subject (Filter)</label>
                <select
                  className="form-select"
                  onChange={(e) => fetchModulesForSubject(e.target.value)}
                >
                  {subjectsList.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      [{sub.code}] {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Select Module Target</label>
                {modulesList.length === 0 ? (
                  <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>No modules found. Create one first!</p>
                ) : (
                  <select
                    className="form-select"
                    value={topicForm.moduleId}
                    onChange={(e) => setTopicForm({ ...topicForm, moduleId: e.target.value })}
                  >
                    {modulesList.map((mod) => (
                      <option key={mod._id} value={mod._id}>
                        Module {mod.moduleNumber}: {mod.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Topic Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Regular Expressions and DFA"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  required
                  disabled={modulesList.length === 0}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short Topic Description</label>
                <textarea
                  className="form-textarea"
                  rows="2"
                  placeholder="A one-line description of the topic..."
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  disabled={modulesList.length === 0}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-sm" disabled={modulesList.length === 0}>
                Add Topic
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div>
          <h2 style={styles.sectionHeader}>Purge Course Offerings</h2>
          <p style={styles.warnText}>
            <FaExclamationTriangle /> Warning: Deleting a subject will also delete all associated modules, topics, comments, and links!
          </p>

          <table className="admin-table glass-panel" style={{ marginTop: '20px' }}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjectsList.map((sub) => (
                <tr key={sub._id}>
                  <td><strong>{sub.code}</strong></td>
                  <td>{sub.name}</td>
                  <td>Sem {sub.semester?.number}</td>
                  <td>{sub.credits} Credits</td>
                  <td>
                    <button
                      onClick={() => handleDeleteSubject(sub._id)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '6px 12px' }}
                    >
                      <FaTrash style={{ fontSize: '0.8rem' }} /> Purge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
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
    marginBottom: '35px',
  },
  sectionHeader: {
    fontSize: '1.6rem',
    marginBottom: '20px',
  },
  cleanState: {
    padding: '60px',
    textAlign: 'center',
    color: 'var(--text-secondary)',
  },
  cleanIcon: {
    fontSize: '3rem',
    color: 'var(--success)',
    marginBottom: '15px',
  },
  tableLink: {
    color: 'var(--accent-cyan)',
    textDecoration: 'underline',
  },
  actionsWrap: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    border: 'none',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'var(--transition-smooth)',
  },
  createFormsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '25px',
    marginTop: '20px',
  },
  formCard: {
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.01)',
  },
  formTitle: {
    fontSize: '1.3rem',
    marginBottom: '20px',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  feedbackBanner: {
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid',
    fontWeight: '500',
  },
  warnText: {
    color: '#ff8a80',
    background: 'rgba(255, 23, 68, 0.1)',
    padding: '12px 16px',
    borderRadius: '8px',
    borderLeft: '4px solid var(--danger)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
  },
};

export default AdminDashboard;
