const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Please add a subject code'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a subject name'],
      trim: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Semester',
      required: true,
    },
    credits: {
      type: Number,
      required: [true, 'Please add subject credits'],
      default: 3,
    },
    department: {
      type: String,
      required: [true, 'Please add a department'],
      enum: ['CSE', 'AIML', 'IT', 'ECE', 'EE', 'Civil'],
      default: 'CSE',
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

module.exports = mongoose.model('Subject', subjectSchema);
