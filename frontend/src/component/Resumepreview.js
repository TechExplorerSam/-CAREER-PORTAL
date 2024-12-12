import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import apiList from '../lib/apiList';

// Modern styles
const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '15px',
  },
  name: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#333',
    margin: '0',
  },
  contact: {
    fontSize: '1.1em',
    color: '#666',
    marginBottom: '10px',
  },
  section: {
    margin: '20px 0',
    padding: '10px 0',
    borderBottom: '2px solid #e1e1e1',
  },
  sectionTitle: {
    color: '#007bff',
    fontSize: '1.8em',
    marginBottom: '10px',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e1e1e1',
    paddingBottom: '5px',
  },
  list: {
    paddingLeft: '20px',
    listStyleType: 'none',
  },
  listItem: {
    marginBottom: '15px',
    padding: '5px 0',
    borderBottom: '1px solid #e1e1e1',
    fontSize: '1.1em',
  },
  jobDescriptionTitle: {
    fontWeight: 'bold',
    fontSize: '1.2em',
    margin: '10px 0 5px 0',
    color: '#007bff',
  },
  jobDescription: {
    marginBottom: '10px',
    fontSize: '1em',
    color: '#444',
    lineHeight: '1.4',
    fontStyle: 'italic',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    textAlign: 'center',
    transition: 'background-color 0.3s',
    marginTop: '20px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '0.9em',
    color: '#999',
  },
};

const ResumePreview = () => {
  const { email } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`${apiList.resumbebuilderviewreume}/${email}`);
        setResume(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching resume:', error);
        setLoading(false);
      }
    };

    if (email) {
      fetchResume();
    }
  }, [email]);

  const handleDownload = () => {
    if (!resume) return;

    const doc = new jsPDF();
    const margin = 10; // Margin for the PDF
    let verticalOffset = 20; // Starting vertical position

    // PDF Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(resume.name, margin, verticalOffset);
    verticalOffset += 10; // Move down for contact info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${resume.email} | ${resume.phone}`, margin, verticalOffset);
    verticalOffset += 10; // Move down for line
    doc.line(margin, verticalOffset, 200 - margin, verticalOffset); // Horizontal line
    verticalOffset += 5; // Move down after line

    // Education Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Education', margin, verticalOffset);
    verticalOffset += 10; // Move down for the list
    doc.setFontSize(12);
    resume.education.forEach((edu, index) => {
      doc.text(`${edu.degree}, ${edu.institution} (${edu.startYear} - ${edu.endYear})`, margin, verticalOffset);
      verticalOffset += 8; // Adjusted spacing for education items
    });

    verticalOffset += 10; // Additional space before Experience

    // Experience Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Experience', margin, verticalOffset);
    verticalOffset += 10; // Move down for the list
    resume.experience.forEach((exp, index) => {
      doc.text(`${exp.jobTitle} at ${exp.company} (${exp.startYear} - ${exp.endYear})`, margin, verticalOffset);
      verticalOffset += 12; // Spacing for job title
      doc.setFont('helvetica', 'bold');
      doc.text('Job Description:', margin, verticalOffset); // Job description label
      verticalOffset += 15; // Space after label
      doc.setFont('helvetica', 'normal');
      doc.text(exp.description, margin + 20, verticalOffset); // Indented description
      verticalOffset += 30; // Extra spacing after description for clarity
      verticalOffset += 5; // Additional space between experiences
    });

    verticalOffset += 20; // Space before Skills

    // Skills Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Skills', margin, verticalOffset);
    doc.setFontSize(12);
    verticalOffset += 10; // Move down for skills list
    doc.text(resume.skills.join(', '), margin, verticalOffset);

    doc.save('resume.pdf');
  };

  if (loading) {
    return <div>Loading resume...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.name}>{resume.name}</div>
        <div style={styles.contact}>{resume.email} | {resume.phone}</div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Education</h2>
        <ul style={styles.list}>
          {resume.education.map((edu, index) => (
            <li key={index} style={styles.listItem}>
              <strong>{edu.degree}</strong> from {edu.institution} ({edu.startYear} - {edu.endYear})
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Experience</h2>
        <ul style={styles.list}>
          {resume.experience.map((exp, index) => (
            <li key={index} style={styles.listItem}>
              <strong>{exp.jobTitle}</strong> at {exp.company} ({exp.startYear} - {exp.endYear})
              <div style={styles.jobDescriptionTitle}>Job Description:</div>
              <p style={styles.jobDescription}>{exp.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Skills</h2>
        <p>{resume.skills.join(', ')}</p>
      </div>

      <button onClick={handleDownload} style={styles.button}>Download as PDF</button>

      <div style={styles.footer}>
        <p>© {new Date().getFullYear()} CUTM. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ResumePreview;
