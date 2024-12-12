import React, { useEffect, useState } from 'react';
import axios from 'axios';
import apiList from '../../lib/apiList';

const ParseResumesForJobPage = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch all jobs for the recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(apiList.jobs, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [token]);

  // Fetch applicants for the selected job
  const fetchApplicantsForJob = async () => {
    try {
      const response = await axios.get(`${apiList.applicants}?jobId=${selectedJobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data)
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // Calculate ATS score for a selected applicant by email
  const handleCalculateATSScore = async (applicantId) => {
    try {
      const response = await axios.post(
        `${apiList.parsedResume}/${applicantId}/${selectedJobId}`,  // Pass applicantId instead of email
        
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setSelectedApplicant({
        ...response.data,
        atsScore: response.data.score,
      });
    } catch (error) {
      console.error("Error calculating ATS score:", error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Parse CVs for a Specific Job</h1>
      
      <label className="job-label">Select a Job:</label>
      <select className="job-select" onChange={(e) => setSelectedJobId(e.target.value)} value={selectedJobId}>
        <option value="">Select a Job</option>
        {jobs.map((job) => (
          <option key={job._id} value={job._id}>
            {job.title}
          </option>
        ))}
      </select>

      <button className="fetch-button" onClick={fetchApplicantsForJob} disabled={!selectedJobId}>
        Show Candidates
      </button>

      <div className="candidates-container">
        <h2 className="candidates-title">Candidate ATS Scores and Details</h2>
        {candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div key={candidate._id} className="candidate-card">
              <div className="candidate-avatar">
                <div className="avatar">👤</div>
              </div>
              <div className="candidate-details">
                <p><strong>Name:</strong> {candidate.jobApplicant.name}</p>
                <p><strong>Name:</strong> {candidate.applicantId}</p>
                <p><strong>Email:</strong> {candidate.jobApplicant.email}</p>
                <p><strong>Status:</strong> {candidate.status}</p>
                <p><strong>Applied for:</strong> {candidate.job.title}</p>
                <button
                  className="calculate-button"
                  onClick={() => handleCalculateATSScore(candidate.applicantId)}                >
                  Calculate ATS Score
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No candidates found for this job.</p>
        )}

        {selectedApplicant && (
          <div className="ats-score-container">
            <h3>ATS Score for {selectedApplicant.parsedData.name}</h3>
            <p><strong>Score:</strong> {selectedApplicant.atsScore}</p>
            <p><strong>Details:</strong> {JSON.stringify(selectedApplicant.parsedData)}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          padding: 30px;
          max-width: 900px;
          margin: auto;
          background: linear-gradient(to right, #f7f9fc, #e8ecf3);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .title {
          text-align: center;
          color: #2c3e50;
          font-size: 2.5rem;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .job-label {
          margin-top: 20px;
          display: block;
          color: #34495e;
          font-weight: 600;
        }

        .job-select {
          width: 100%;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #2980b9;
          margin-bottom: 20px;
          transition: border-color 0.3s;
        }

        .job-select:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
        }

        .fetch-button {
          width: 100%;
          padding: 12px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
          font-weight: bold;
        }

        .fetch-button:hover {
          background-color: #2980b9;
          transform: translateY(-2px);
        }

        .candidates-container {
          margin-top: 30px;
        }

        .candidates-title {
          color: #2c3e50;
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .candidate-card {
          display: flex;
          align-items: center;
          background-color: #ffffff;
          border: 1px solid #bdc3c7;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s;
        }

        .candidate-card:hover {
          transform: scale(1.02);
        }

        .candidate-avatar {
          flex-shrink: 0;
          margin-right: 15px;
          position: relative;
          width: 60px;
          height: 60px;
          background-color: #3498db;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          color: white;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .candidate-details {
          color: #555;
          flex-grow: 1;
        }

        .candidate-details p {
          margin: 5px 0;
          line-height: 1.6;
        }

        .calculate-button {
          padding: 10px 15px;
          background-color: #1abc9c;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
          font-weight: bold;
        }

        .calculate-button:hover {
          background-color: #16a085;
          transform: translateY(-2px);
        }

        .ats-score-container {
          background-color: #f4f6f8;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
        }

        .ats-score-container h3 {
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
};

export default ParseResumesForJobPage;
