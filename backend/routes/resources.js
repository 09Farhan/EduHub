const express = require('express');
const router = express.Router();
const ResourceLink = require('../models/ResourceLink');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all pending resource links
// @route   GET /api/resources/pending
// @access  Private/Admin
router.get('/pending', protect, admin, async (req, res) => {
  try {
    const pendingLinks = await ResourceLink.find({ isApproved: false })
      .populate('topic', 'title')
      .populate('submittedBy', 'username email');
    res.json(pendingLinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Approve a resource link
// @route   PUT /api/resources/:id/approve
// @access  Private/Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
  try {
    const resource = await ResourceLink.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.isApproved = true;
    resource.approvedBy = req.user._id;

    const approvedResource = await resource.save();
    res.json({ message: 'Resource approved successfully', resource: approvedResource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reject/Delete a resource link
// @route   DELETE /api/resources/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const resource = await ResourceLink.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await ResourceLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resource removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
