const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

// @desc    Add a comment to a topic
// @route   POST /api/comments
// @access  Private
router.post('/', protect, async (req, res) => {
  const { topicId, content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Comment content cannot be empty' });
  }

  try {
    const comment = await Comment.create({
      topic: topicId,
      user: req.user._id,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'username role');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check ownership or admin status
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
