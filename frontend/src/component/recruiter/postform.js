import React, { useState } from 'react';
import apiList from './../../lib/apiList'; // Ensure this points to your API endpoint

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('blog');
  const [file, setFile] = useState(null); // File state
  const [submitMessage, setSubmitMessage] = useState(''); // Success/Failure message

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Capture the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file upload and form submission
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('type', type);
    if (file) {
      formData.append('file', file); // Append the file if it exists
    }

    // Call backend API to submit the post with file
    try {
      const response = await fetch(apiList.post, {
        method: 'POST',
        body: formData // Send FormData
      });

      if (response.ok) {
        setSubmitMessage('Post submitted successfully!');
        setTitle(''); // Clear fields after submission
        setContent('');
        setFile(null);
      } else {
        setSubmitMessage('Error submitting post');
      }
    } catch (error) {
      setSubmitMessage('Error submitting post');
    }
  };

  return (
    <div>
      <style>{`
        /* Styling the Post Form Container */
        .post-form {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          font-family: 'Arial', sans-serif;
        }

        /* Title Styling */
        .form-title {
          text-align: center;
          color: #333;
          font-size: 24px;
          margin-bottom: 20px;
          font-weight: bold;
        }

        /* Form Group Styling */
        .form-group {
          margin-bottom: 15px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #555;
          font-weight: bold;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          font-size: 16px;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #007bff;
          outline: none;
        }

        /* Textarea Styling */
        textarea {
          height: 150px;
        }

        /* Submit Button Styling */
        .submit-button {
          display: block;
          width: 100%;
          background-color: #007bff;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }

        /* Message Styles */
        .submit-message {
          margin-top: 10px;
          font-size: 16px;
          color: green;
          text-align: center;
        }
      `}</style>

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="post-form">
        <h2 className="form-title">Create a New Post</h2>

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your post title"
            required
          />
        </div>

        {/* Content Field */}
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post here..."
            required
          ></textarea>
        </div>

        {/* Post Type Dropdown */}
        <div className="form-group">
          <label htmlFor="type">Post Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="blog">Blog Post</option>
            <option value="announcement">Announcement</option>
            <option value="promotion">Promotion</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label htmlFor="file">Attach a File</label>
          <input type="file" id="file" onChange={handleFileChange} />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">Submit Post</button>

        {/* Display Success/Error Message */}
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </form>
    </div>
  );
};

export default PostForm;
