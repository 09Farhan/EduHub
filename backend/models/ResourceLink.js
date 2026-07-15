const mongoose = require('mongoose');

const resourceLinkSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    url: {
      type: String,
      required: [true, 'Please add a URL'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please select resource link length/type'],
      enum: ['long-form', 'medium-length', 'short-form'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description for the resource'],
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ResourceLink', resourceLinkSchema);
