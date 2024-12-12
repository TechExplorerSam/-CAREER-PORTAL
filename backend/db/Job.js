const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model for recruiters
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  maxApplicants: {
    type: Number,
    default: 100,
    required: true,
  },
  maxPositions: {
    type: Number,
    default: 30,
    required: true,
  },
  dateOfPosting: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  skillsets: [
    {
      type: String,
      required: true,
    },
  ],
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Work From Home"],
    default: "Full-Time",
    required: true,
  },
  duration: {
    type: Number, // In months
    default: 0,
  },
  salary: {
    type: Number, // In INR or USD, based on your project
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  experience: {
    type: Number, // Experience in years
    default: 0,
    required: true,
  },
  qualification: {
    type: [String], // e.g., "Bachelor's Degree", "Master's Degree", etc.
    required: true,
   enum: ["BSc", "MSc", "B.Tech", "M.Tech", "PhD", "Diploma", "MBA", "BBA"] // add any other relevant degrees


  },
  ageLimit: {
    type: Number, // Age limit for applicants
    min: 18,
    default: 18,
    required: true,
  },
  min10thPercentage: {
    type: Number, // Minimum percentage in Class 10
    min: 0,
    max: 100,
    default: 0,
    required: true,
  },
  min12thPercentage: {
    type: Number, // Minimum percentage in Class 12
    min: 0,
    max: 100,
    default: 0,
    required: true,
  },
  minGraduationGPA: {
    type: Number, // Minimum GPA for Graduation
    min: 0,
    max: 10,
    default: 0,
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
