const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Module = require('../models/Module');
const Topic = require('../models/Topic');
const Semester = require('../models/Semester');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all subjects (optionally filtered by query for search)
// @route   GET /api/subjects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const subjects = await Subject.find(query).populate('semester', 'number');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get subject details with nested modules and topics
// @route   GET /api/subjects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('semester', 'number');
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Find all modules for this subject
    const modules = await Module.find({ subject: subject._id }).sort({ moduleNumber: 1 });

    // Map modules and attach their topics
    const modulesWithTopics = await Promise.all(
      modules.map(async (mod) => {
        const topics = await Topic.find({ module: mod._id }).sort({ createdAt: 1 });
        return {
          ...mod.toObject(),
          topics,
        };
      })
    );

    res.json({
      subject,
      modules: modulesWithTopics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { code, name, semesterNumber, credits, department, description } = req.body;

  try {
    const semester = await Semester.findOne({ number: semesterNumber });
    if (!semester) {
      return res.status(404).json({ message: 'Semester number not found' });
    }

    const subjectExists = await Subject.findOne({ code });
    if (subjectExists) {
      return res.status(400).json({ message: 'Subject code already exists' });
    }

    const subject = await Subject.create({
      code,
      name,
      semester: semester._id,
      credits: credits || 3,
      department: department || 'CSE',
      description,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { code, name, credits, description } = req.body;

  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.code = code || subject.code;
    subject.name = name || subject.name;
    subject.credits = credits !== undefined ? credits : subject.credits;
    subject.description = description || subject.description;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a subject (cascade delete modules and topics)
// @route   DELETE /api/subjects/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Get all modules of this subject to delete topics inside them
    const modules = await Module.find({ subject: subject._id });
    const moduleIds = modules.map((mod) => mod._id);

    // Delete topics
    await Topic.deleteMany({ module: { $in: moduleIds } });

    // Delete modules
    await Module.deleteMany({ subject: subject._id });

    // Delete subject itself
    await Subject.findByIdAndDelete(req.params.id);

    res.json({ message: 'Subject and associated modules/topics deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a module inside a subject
// @route   POST /api/subjects/:id/modules
// @access  Private/Admin
router.post('/:id/modules', protect, admin, async (req, res) => {
  const { moduleNumber, name, description } = req.body;
  const subjectId = req.params.id;

  try {
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    const moduleExists = await Module.findOne({ subject: subjectId, moduleNumber });
    if (moduleExists) {
      return res.status(400).json({ message: `Module ${moduleNumber} already exists for this subject` });
    }

    const newModule = await Module.create({
      subject: subjectId,
      moduleNumber,
      name,
      description,
    });

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
