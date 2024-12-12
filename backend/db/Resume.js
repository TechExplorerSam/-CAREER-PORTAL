// db/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  education: [
    {
      degree: String,
      institution: String,
      startYear: Number,
      endYear: Number,
    },
  ],
  experience: [
    {
      jobTitle: String,
      company: String,
      startYear: Number,
      endYear: Number,
      description: String,
    },
  ],
  skills: [String],
  createdAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
