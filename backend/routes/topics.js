const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const Module = require('../models/Module');
const ResourceLink = require('../models/ResourceLink');
const Comment = require('../models/Comment');
const { protect, admin } = require('../middleware/auth');

// @desc    Get topic details, approved resource links, and comments
// @route   GET /api/topics/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id)
      .populate({
        path: 'module',
        populate: {
          path: 'subject',
          select: 'code name credits',
        },
      });

    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Fetch approved resource links
    const approvedLinks = await ResourceLink.find({
      topic: topic._id,
      isApproved: true,
    }).populate('submittedBy', 'username');

    // Fetch comments
    const comments = await Comment.find({ topic: topic._id })
      .populate('user', 'username role')
      .sort({ createdAt: -1 });

    res.json({
      topic,
      resources: approvedLinks,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a topic inside a module
// @route   POST /api/topics
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { moduleId, title, description } = req.body;

  try {
    const moduleExists = await Module.findById(moduleId);
    if (!moduleExists) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const topic = await Topic.create({
      module: moduleId,
      title,
      description,
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { title, description } = req.body;

  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topic.title = title || topic.title;
    topic.description = description || topic.description;

    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Delete comments and resources of this topic
    await Comment.deleteMany({ topic: topic._id });
    await ResourceLink.deleteMany({ topic: topic._id });

    // Delete topic
    await Topic.findByIdAndDelete(req.params.id);

    res.json({ message: 'Topic and associated comments/resources deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Suggest or add a resource link for a topic
// @route   POST /api/topics/:id/resources
// @access  Private
router.post('/:id/resources', protect, async (req, res) => {
  const { url, type, description } = req.body;
  const topicId = req.params.id;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    // Admins' suggestions are automatically approved, students' require approval
    const isApproved = req.user.role === 'admin';

    const newResource = await ResourceLink.create({
      topic: topicId,
      url,
      type,
      description,
      isApproved,
      submittedBy: req.user._id,
      approvedBy: isApproved ? req.user._id : undefined,
    });

    res.status(201).json({
      message: isApproved
        ? 'Resource added successfully!'
        : 'Resource suggestion submitted. Awaiting admin approval.',
      resource: newResource,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
