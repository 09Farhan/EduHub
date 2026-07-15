const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: [true, 'Please add a semester number'],
      unique: true,
      min: 1,
      max: 8,
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

module.exports = mongoose.model('Semester', semesterSchema);
