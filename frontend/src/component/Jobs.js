// src/JobListingPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import isAuth from '../lib/isAuth';

const styles = {
  container: {
    width: '90%',
    margin: '20px auto',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '28px',
    marginBottom: '30px',
    color: '#333',
    fontWeight: 'bold',
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    position: 'relative',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9', // Light background color
    color: '#333',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
  },
  cardHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2a9d8f', // Attractive accent color
    marginBottom: '10px',
  },
  details: {
    fontSize: '14px',
    marginBottom: '10px',
    color: '#555',
  },
  button: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#2a9d8f', // Accent button color
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#21867a',
  },
};

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:4444/api/jobslist'); // Replace with actual URL
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobs();
  }, []);

  // Define the function to handle the click event
const handleApplyClick = () => {
    const isLoggedIn = Boolean(isAuth()); 
    if (isLoggedIn) {
      // User is logged in, proceed to signup or application page
      window.location.href = '/home';
    } else {
      // User is not logged in, show alert and redirect accordingly
      const hasAccount = window.confirm(
        "You are not logged in or don't have an account. If you already have an account, press OK to go to the login page. If not, press Cancel to go to the signup page."
      );
  
      if (hasAccount) {
        // Redirect to login page
        window.location.href = '/login';
      } else {
        // Redirect to signup page
        window.location.href = '/signup';
      }
    }
  };
  
  // Use this function in your component where the button is defined
  <button onClick={handleApplyClick} style={styles.button}>Apply Now</button>
  

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Exciting Job Opportunities</h1>
      <div style={styles.cardContainer}>
        {jobs.map((job, index) => (
          <div
            key={job._id}
            style={{
              ...styles.card,
              ...(hoveredCard === index ? styles.cardHover : {}),
            }}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h2 style={styles.title}>{job.title}</h2>
            <p style={styles.details}><strong>Skills Required:</strong> {job.skillsets.join(', ')}</p>
            <p style={styles.details}><strong>Job Type:</strong> {job.jobType}</p>
            <p style={styles.details}><strong>Duration:</strong> {job.duration || 'N/A'} months</p>
            <p style={styles.details}><strong>Salary:</strong> {job.salary ? `$${job.salary}` : 'Not specified'}</p>
            <p style={styles.details}><strong>Experience:</strong> {job.experience} years</p>
            <p style={styles.details}><strong>Apply By:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            <button
              style={{
                ...styles.button,
                ...(hoveredCard === index ? styles.buttonHover : {}),
              }}
              onClick={handleApplyClick}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListingPage;
