import React from 'react';
import './Footer.css'; // Import the CSS file for styling
import { useState } from 'react';
import axios from 'axios';
import apiList from '../lib/apiList';


  const Footer = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!email) {
        setMessage('Please enter a valid email address.');
        return;
      }
  
      try {
        const response = await axios.post(apiList.subscribe, { email });
        setMessage(response.data.message);
        setEmail('');
      } catch (error) {
        console.error('Error subscribing:', error);
        setMessage('Failed to subscribe. Please try again later.');
      }
    };
  
  
  return (
    
    <footer className="footer">
      <div className="footer-content">
        {/* About Section */}
        <div className="footer-section about">
          <h2>Centurion University</h2>
          <p>
            Centurion University of Technology and Management is committed to
            providing students and job seekers with the best opportunities to
            succeed in their careers.
          </p>
          <div className="contact">
            <span><i className="fas fa-phone"></i> +91 8260077222</span>
            <span><i className="fas fa-envelope"></i> contact@cutm.ac.in</span>
          </div>
          <div className="socials">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><a href="https://cutm.ac.in/connect/work-at-cutm/">Job Search</a></li>
            <li><a href="https://conference.cutm.ac.in/aboutus.html#:~:text=Centurion%20University%20of%20Technology%20and%20Management%20(CUTM)&text=Recently%2C%20Centurion%20University's%20School%20of,to%20be%20recognized%20as%20such.">About Us</a></li>
            <li><a href="https://cutm.ac.in/contact/">Contact Us</a></li>
            <li><a href="https://cutm.ac.in/terms-of-use/">Terms & Conditions</a></li>
            <li><a href="https://cutm.ac.in/privacy-policy/">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section newsletter">
          <h2>Newsletter</h2>
          <p>Subscribe to our newsletter to get the latest job postings and career tips.</p>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Enter your email" required  onChange={(e) => setEmail(e.target.value)}  value={email}/>
            <button type="submit">Subscribe</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Centurion University of Technology and Management | All Rights Reserved
      </div>
    </footer>
  );
}


export default Footer;
