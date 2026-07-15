const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    moduleNumber: {
      type: Number,
      required: [true, 'Please add a module number'],
    },
    name: {
      type: String,
      required: [true, 'Please add a module name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure uniqueness of moduleNumber within a single subject
moduleSchema.index({ subject: 1, moduleNumber: 1 }, { unique: true });

module.exports = mongoose.model('Module', moduleSchema);
