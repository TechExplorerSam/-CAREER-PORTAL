// src/components/ScheduleInterview.js
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { userType } from '../../lib/isAuth';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import apiList from '../../lib/apiList';

const ScheduleInterview = () => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const history = useHistory();
const token=localStorage.getItem('token');
  useEffect(() => {
    // Fetch the list of jobs when the component mounts
    const fetchJobs = async () => {
      try {
        const response = await axios.get(apiList.jobs,{
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
  
    const formattedStartTime = new Date(startTime).toISOString();
    const formattedEndTime = new Date(endTime).toISOString();
  
    if (formattedStartTime >= formattedEndTime) {
      alert('End time must be after the start time.');
      return;
    }
  
    const interviewDetails = {
      summary,
      description,
      location,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  
    try {
      // Add selectedJobId to the URL as a parameter
      const response = await axios.post(
        `http://localhost:4444/schedule-interview/${selectedJobId}`, 
        interviewDetails,
        
      );
  
      if (response.status === 200) {
        alert('Interview scheduled successfully!');
        history.push('/ScheduleInterview');
      } else {
        alert('Failed to schedule the interview. Please try again.');
      }
    } catch (error) {
      console.error('Scheduling failed:', error);
      alert('Failed to schedule the interview. Please try again.');
    }
  };
  

  // Redirect if user is not a recruiter
  if (userType() !== 'recruiter') {
    return <Redirect to="/not-authorized" />;
  }

  return (
    <form onSubmit={handleSchedule} style={styles.formContainer}>
      <h2 style={styles.heading}>Schedule an Interview</h2>
      
      {/* Dropdown for selecting job */}
      <select
        value={selectedJobId}
        onChange={(e) => setSelectedJobId(e.target.value)}
        required
        style={styles.select}
      >
        <option value="" disabled>Select a Job</option>
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>{job.title}</option>
        ))}
      </select>

      <input 
        type="text"
        name="summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="Summary"
        required 
        style={styles.input}
      />
      <input 
        type="text"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description" 
        style={styles.input}
      />
      <input 
        type="text"
        name="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        required 
        style={styles.input}
      />
      <input 
        type="datetime-local"
        name="startTime"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        required 
        style={styles.input}
      />
      <input 
        type="datetime-local"
        name="endTime"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        required 
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Schedule Interview</button>
    </form>
  );
};

const styles = {
  formContainer: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif'
  },
  heading: {
    color: '#333',
    marginBottom: '20px',
    fontSize: '24px',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    transition: 'border-color 0.3s',
  },
  button: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

styles.input[':focus'] = {
  borderColor: '#007bff',
  outline: 'none',
};

styles.button[':hover'] = {
  backgroundColor: '#0056b3',
};

export default ScheduleInterview;
