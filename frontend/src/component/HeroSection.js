import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory from react-router-dom

function HeroSection() {
  // Create a state variable to store the search query
  const [query, setQuery] = useState('');

  // Use the useHistory hook to navigate programmatically
  const history = useHistory();

  // Handle the search functionality
  const handleSearch = () => {
    if (query.trim()) {
      // Navigate to the search results page with the query in the URL
      history.push(`/jobs?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const heroSectionStyles = {
    background: 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)',
    color: '#fff',
    padding: '80px 20px',
    textAlign: 'center',
    transition: 'background 0.5s ease-in-out',
  };

  const heroSectionHoverStyles = {
    background: 'linear-gradient(45deg, #2575fc 30%, #6a11cb 90%)',
  };

  const heroContentStyles = {
    animation: 'fadeIn 1.5s ease-out',
  };

  const headingStyles = {
    fontSize: '3.5rem',
    fontWeight: '700',
    marginBottom: '20px',
  };

  const paragraphStyles = {
    fontSize: '1.2rem',
    marginBottom: '40px',
    lineHeight: '1.6',
    animation: 'fadeIn 2s ease-out',
  };

  const searchBarStyles = {
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '30px',
    animation: 'slideIn 2s ease-out',
  };

  const searchInputStyles = {
    width: '350px',
    padding: '12px 20px',
    borderRadius: '25px',
    border: '2px solid #fff',
    outline: 'none',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  };

  const searchButtonStyles = {
    backgroundColor: '#ff4081',
    color: '#fff',
    padding: '12px 30px',
    border: 'none',
    borderRadius: '25px',
    marginLeft: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const ctaButtonsStyles = {
    marginTop: '40px',
  };

  const primaryBtnStyles = {
    padding: '12px 30px',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#ff4081',
    color: 'white',
    marginRight: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  const secondaryBtnStyles = {
    padding: '12px 30px',
    borderRadius: '50px',
    border: '2px solid #fff',
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
  };

  return (
    <div
      className="hero-section"
      style={heroSectionStyles}
      onMouseEnter={() => (document.querySelector('.hero-section').style.background = heroSectionHoverStyles.background)}
      onMouseLeave={() => (document.querySelector('.hero-section').style.background = heroSectionStyles.background)}
    >
      <div className="hero-content" style={heroContentStyles}>
        <h1 style={headingStyles}>Find Your Perfect Job at Centurion University</h1>
        <p style={paragraphStyles}>
          Your journey to a successful career starts here. Explore opportunities that match your skills and aspirations.
        </p>

        <div className="search-bar" style={searchBarStyles}>
          <input
            type="text"
            className="search-input"
            style={searchInputStyles}
            placeholder="Search jobs by title, company"
            value={query}  // Bind the input to the state
            onChange={(e) => setQuery(e.target.value)}  // Update state on input change
          />
          <button className="search-button" style={searchButtonStyles} onClick={handleSearch}>
            Search Jobs
          </button>
        </div>

        <div className="cta-buttons" style={ctaButtonsStyles}>
          <button
            className="primary-btn"
            style={primaryBtnStyles}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#ff80ab')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#ff4081')}
            onClick={() => (window.location.href = '/signup')}
          >
            Create Profile
          </button>
          <button
            className="secondary-btn"
            style={secondaryBtnStyles}
            onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
            onClick={() => (window.location.href = '/jobs')}
          >
            View All Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
