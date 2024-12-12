import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import axios from 'axios';
import apiList from '../lib/apiList'; // Assuming apiList contains the API endpoints
import { userType } from '../lib/isAuth';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

const ResumeForm = () => {
  const [resume, setResume] = useState({
    name: '',
    email: '',
    phone: '',
    education: [{ degree: '', institution: '', startYear: '', endYear: '' }],
    experience: [{ jobTitle: '', company: '', startYear: '', endYear: '', description: '' }],
    skills: [''],
  });

  const history = useHistory(); // Use history for redirection
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
 

  // Fetch user data from API and populate the form
  useEffect(() => {
    if (token) {
      axios.get(apiList.user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = response.data;
        setResume((prevResume) => ({
          ...prevResume,
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.contactNumber || '',
          
          // Assuming userData has these fields, adapt based on your API response
        }));
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
    }
  }, [token]);

  const handleChange = (e) => {
    setResume({ ...resume, [e.target.name]: e.target.value });
  };

  const handleEducationChange = (index, e) => {
    const updatedEducation = resume.education.map((edu, idx) => {
      if (index === idx) {
        return { ...edu, [e.target.name]: e.target.value };
      }
      return edu;
    });
    setResume({ ...resume, education: updatedEducation });
  };

  const handleExperienceChange = (index, e) => {
    const updatedExperience = resume.experience.map((exp, idx) => {
      if (index === idx) {
        return { ...exp, [e.target.name]: e.target.value };
      }
      return exp;
    });
    setResume({ ...resume, experience: updatedExperience });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiList.resumebuilder, resume, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume');
    }
  };

  // Redirect if user is not an applicant
  if (userType() !== 'applicant') {
    return <Redirect to="/not-authorized" />;
  }

  const viewResume = () => {
    // Redirect to the view resume page with the email as a route parameter
    history.push(`/resumebuilder/view-resume/${resume.email}`);
  };

  return (
    <div className="resume-form-container">
      <form onSubmit={handleSubmit} className="resume-form">
        <h2>Personal Information</h2>
        <input
          type="text"
          name="name"
          value={resume.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={resume.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phone"
          value={resume.phone}
          onChange={handleChange}
          placeholder="Phone"
        />

        <h2>Education</h2>
        {resume.education.map((edu, index) => (
          <div key={index} className="education-section">
            <input
              type="text"
              name="degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(index, e)}
              placeholder="Degree"
              required
            />
            <input
              type="text"
              name="institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(index, e)}
              placeholder="Institution"
              required
            />
            <input
              type="number"
              name="startYear"
              value={edu.startYear}
              onChange={(e) => handleEducationChange(index, e)}
              placeholder="Start Year"
            />
            <input
              type="number"
              name="endYear"
              value={edu.endYear}
              onChange={(e) => handleEducationChange(index, e)}
              placeholder="End Year"
            />
          </div>
        ))}

        <h2>Experience</h2>
        {resume.experience.map((exp, index) => (
          <div key={index} className="experience-section">
            <input
              type="text"
              name="jobTitle"
              value={exp.jobTitle}
              onChange={(e) => handleExperienceChange(index, e)}
              placeholder="Job Title"
              required
            />
            <input
              type="text"
              name="company"
              value={exp.company}
              onChange={(e) => handleExperienceChange(index, e)}
              placeholder="Company"
              required
            />
            <input
              type="number"
              name="startYear"
              value={exp.startYear}
              onChange={(e) => handleExperienceChange(index, e)}
              placeholder="Start Year"
            />
            <input
              type="number"
              name="endYear"
              value={exp.endYear}
              onChange={(e) => handleExperienceChange(index, e)}
              placeholder="End Year"
            />
            <textarea
              name="description"
              value={exp.description}
              onChange={(e) => handleExperienceChange(index, e)}
              placeholder="Job Description"
            />
          </div>
        ))}

        <h2>Skills</h2>
        <input
          type="text"
          name="skills"
          value={resume.skills.join(', ')}
          onChange={(e) => setResume({ ...resume, skills: e.target.value.split(', ') })}
          placeholder="Skills (comma separated)"
        />

        <button type="submit" className="submit-btn">Save Resume</button>
        <button type="button" className="viewresume-btn" onClick={viewResume}>
          View Resume
        </button>
      </form>
      <style jsx>{`
        .resume-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
          padding: 20px;
        }

        .resume-form {
          max-width: 800px;
          width: 100%;
          background-color: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease-in-out;
        }

        .resume-form:hover {
          transform: translateY(-5px);
        }

        h2 {
          color: #333;
          font-family: 'Poppins', sans-serif;
          margin-bottom: 15px;
          font-size: 1.5rem;
        }

        input, textarea {
          width: 100%;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 10px;
          border: 1px solid #ccc;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        input:focus, textarea:focus {
          border-color: #4a90e2;
          outline: none;
        }

        .education-section, .experience-section {
          background-color: #f7f9fc;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 10px;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.2rem;
          font-family: 'Poppins', sans-serif;
          transition: background-color 0.3s ease;
        }
        .viewresume-btn{
          width: 100%;
          padding: 15px;
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 1.2rem;
          font-family: 'Poppins', sans-serif;
          transition: background-color 0.3s ease;
          margin-top: 10px;
        }

        .submit-btn:hover {
          background-color: #357ABD;
        }
      `}</style>

    </div>
  );
};

export default ResumeForm;
