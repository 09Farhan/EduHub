const express = require('express');
const router = express.Router();
const Semester = require('../models/Semester');
const Subject = require('../models/Subject');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all semesters
// @route   GET /api/semesters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const semesters = await Semester.find().sort({ number: 1 });
    res.json(semesters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get specific semester details with subjects
// @route   GET /api/semesters/:number
// @access  Public
router.get('/:number', async (req, res) => {
  try {
    const semester = await Semester.findOne({ number: req.params.number });
    if (!semester) {
      return res.status(404).json({ message: 'Semester not found' });
    }

    const dept = req.query.dept || 'CSE';
    const subjects = await Subject.find({ semester: semester._id, department: dept }).sort({ code: 1 });

    res.json({
      semester,
      subjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a semester
// @route   POST /api/semesters
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { number, description } = req.body;

  try {
    const semesterExists = await Semester.findOne({ number });
    if (semesterExists) {
      return res.status(400).json({ message: `Semester ${number} already exists` });
    }

    const semester = await Semester.create({ number, description });
    res.status(201).json(semester);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
