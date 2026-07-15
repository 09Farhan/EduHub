import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../context/AuthContext';
import { FaSearch, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState(localStorage.getItem('selectedDept') || 'CSE');

  // B.Tech Departments
  const departments = [
    { code: 'CSE', name: 'CSE (Computer Science)' },
    { code: 'AIML', name: 'AIML (AI & Machine Learning)' },
    { code: 'IT', name: 'IT (Information Tech)' },
    { code: 'ECE', name: 'ECE (Electronics & Comm)' },
    { code: 'EE', name: 'EE (Electrical Eng)' },
    { code: 'Civil', name: 'Civil Engineering' },
  ];

  // Semesters hardcoded 1 to 8 for fast rendering
  const semestersList = [
    { number: 1, title: 'Semester 1', desc: 'Foundations & Basics' },
    { number: 2, title: 'Semester 2', desc: 'Core Programming & Data Structures' },
    { number: 3, title: 'Semester 3', desc: 'Discrete Mathematics & Logic' },
    { number: 4, title: 'Semester 4', desc: 'Operating Systems & DBMS' },
    { number: 5, title: 'Semester 5', desc: 'Networking & Software Engineering' },
    { number: 6, title: 'Semester 6', desc: 'Advanced CSE & Compiler Design' },
    { number: 7, title: 'Semester 7', desc: 'Cloud & Modern Architectures' },
    { number: 8, title: 'Semester 8', desc: 'Professional Ethics & Electives' },
  ];

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects`);
        if (response.ok) {
          const data = await response.json();
          setSubjects(data);
        }
      } catch (err) {
        console.error('Failed to load subjects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSubjects([]);
      return;
    }

    const filtered = subjects.filter(
      (subj) =>
        (subj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          subj.code.toLowerCase().includes(searchQuery.toLowerCase())) &&
        subj.department === selectedDept
    );
    setFilteredSubjects(filtered);
  }, [searchQuery, subjects, selectedDept]);

  const handleDeptChange = (deptCode) => {
    setSelectedDept(deptCode);
    localStorage.setItem('selectedDept', deptCode);
  };

  const handleSemesterClick = (num) => {
    navigate(`/semester/${num}?dept=${selectedDept}`);
  };

  const handleSubjectClick = (id) => {
    navigate(`/subject/${id}`);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Header */}
      <header className="hero-section">
        <h1 className="hero-title">EduSyllabus Hub</h1>
        <p className="hero-subtitle">
          Access the B.Tech syllabus, structured modules, and highly-vetted study resources curated specifically for you.
        </p>

        {/* Department Selector */}
        <div style={styles.deptSelector}>
          {departments.map((dept) => (
            <button
              key={dept.code}
              style={{
                ...styles.deptTab,
                ...(selectedDept === dept.code ? styles.deptTabActive : {}),
              }}
              onClick={() => handleDeptChange(dept.code)}
            >
              {dept.name}
            </button>
          ))}
        </div>

        {/* Global Search Bar */}
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={`Search ${selectedDept} subjects by name or code...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Conditional Rendering: Search Results vs Semesters Grid */}
      {searchQuery ? (
        <section style={styles.resultsSection}>
          <h2 style={styles.sectionHeader}>Search Results for {selectedDept} ({filteredSubjects.length})</h2>
          {loading ? (
            <p style={{ textAlign: 'center' }}>Loading subjects...</p>
          ) : filteredSubjects.length === 0 ? (
            <p style={styles.noResults}>No {selectedDept} subjects match "{searchQuery}"</p>
          ) : (
            <div className="subjects-list">
              {filteredSubjects.map((subj) => (
                <div
                  key={subj._id}
                  onClick={() => handleSubjectClick(subj._id)}
                  className="glass-panel glass-panel-hover subject-item"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="subject-info">
                    <span className="subject-code-pill">{subj.code}</span>
                    <h3 className="subject-name">{subj.name}</h3>
                    <div className="subject-meta">
                      <span className="subject-meta-item">
                        Semester {subj.semester?.number || 'N/A'}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>•</span>
                      <span className="subject-meta-item">{subj.credits} Credits</span>
                    </div>
                  </div>
                  <FaArrowRight style={styles.arrowIcon} />
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          <div style={styles.sectionHeaderWrap}>
            <h2 style={styles.sectionHeader}>Select Semester ({selectedDept})</h2>
          </div>
          <div className="semesters-grid">
            {semestersList.map((sem) => (
              <div
                key={sem.number}
                onClick={() => handleSemesterClick(sem.number)}
                className="glass-panel glass-panel-hover semester-card"
              >
                <div className="semester-number">{sem.number}</div>
                <h3 className="semester-title">{sem.title}</h3>
                <p className="semester-desc">{sem.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  deptSelector: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '30px',
    maxWidth: '800px',
    margin: '0 auto 30px',
  },
  deptTab: {
    padding: '10px 18px',
    borderRadius: '25px',
    border: '1px solid var(--border-glass)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'var(--transition-smooth)',
  },
  deptTabActive: {
    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%)',
    color: '#050508',
    borderColor: 'transparent',
    boxShadow: 'var(--shadow-glow)',
  },
  sectionHeaderWrap: {
    borderBottom: '1px solid var(--border-glass)',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  sectionHeader: {
    fontSize: '2rem',
    border: 'none',
    padding: 0,
    margin: 0,
    fontFamily: 'var(--font-display)',
  },
  resultsSection: {
    marginTop: '20px',
  },
  noResults: {
    textAlign: 'center',
    padding: '40px 0',
    color: 'var(--text-secondary)',
  },
  arrowIcon: {
    color: 'var(--accent-cyan)',
    fontSize: '1.2rem',
  },
};

export default Home;
