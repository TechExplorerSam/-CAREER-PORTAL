const resumeParser = require('resume-parser');
const path = require('path');
const fs = require('fs');

const JobApplicant = require('../db/JobApplicant');

// Function to parse and store candidate information
const parseResume = async (resumePath) => {
  try {
    // Parse the resume using resume-parser library
    const parsedData = await resumeParser.parseResume(resumePath);
    
    // Update the candidate profile with parsed details
    await JobApplicant.findByIdAndUpdate(userId, {
      parsedDetails: {
        skills: parsedData.skills || [],
        experience: parsedData.experience || "N/A",
        education: parsedData.education || "N/A",
      },
    });

    console.log("Resume parsed successfully for candidate:");
  } catch (err) {
    console.error("Error parsing resume:", err);
  }
};
