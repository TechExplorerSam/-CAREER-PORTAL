const mongoose = require('mongoose');

const ParsedResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobApplicantInfo',
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  education: {
    type: [String], // Array to store education entries
  },
  skills: {
    type: [String], // Array to store individual skills
  },
  experience: {
    type: [String], // Array to store experience entries
  },
  projects: {
    type: [String], // Array to store project details
  },
  summary: {
    type: String,
  },
  certifications: {
    type: [String], // Array to store certification details
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ParsedResume', ParsedResumeSchema);
