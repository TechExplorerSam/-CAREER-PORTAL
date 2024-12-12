import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Link,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import apiList from '../../lib/apiList';
import { userType } from '../../lib/isAuth';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import { server } from '../../lib/apiList';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '20px',
    background: 'linear-gradient(135deg, #6a1b9a, #f50057)',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: '40px',
    fontSize: '3rem',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  postCard: {
    marginBottom: '30px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    borderRadius: '15px',
    backgroundColor: '#fff',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
    },
  },
  postTitle: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  postContent: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  postActions: {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewFileButton: {
    color: '#3f51b5',
    fontWeight: '600',
    textDecoration: 'none',
    '&:hover': {
      color: '#1a237e',
    },
  },
  loadMoreButton: {
    display: 'block',
    width: '100%',
    marginTop: '40px',
    padding: '12px',
    backgroundColor: '#ff4081',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '25px',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    '&:hover': {
      backgroundColor: '#e91e63',
      transform: 'scale(1.05)',
    },
  },
  cardContent: {
    padding: '20px',
    '&:last-child': {
      paddingBottom: '20px',
    },
  },
  gridContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    paddingBottom: '30px',
  },
  iframeContainer: {
    position: 'relative',
    width: '100%',
    height: '500px',
    marginTop: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    padding: '15px',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#333',
  },
  downloadButton: {
    marginTop: '20px',
    display: 'block',
    textAlign: 'center',
  },
}));

const PostList = () => {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [fileURL, setFileURL] = useState(null);
  const [fileType, setFileType] = useState(null);

  // Fetch the posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(apiList.getposts);
      const data = await response.json();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  // Fetch file from backend
  const getFile = (fileUrl) => {
    axios(`${server}${fileUrl}`, {
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const file = new Blob([response.data], { type: response.headers['content-type'] });
        const fileURL = URL.createObjectURL(file);
        setFileURL(fileURL);
        setFileType(response.headers['content-type']);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Close the file preview
  const closeFilePreview = () => {
    setFileURL(null);
    setFileType(null);
  };

  // Check if user is a recruiter
  if (userType() !== 'recruiter') {
    return <Redirect to="/not-authorized" />;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.title}>
        Posts
      </Typography>
      <div className={classes.gridContainer}>
        {posts.map((post) => (
          <Grid item key={post._id} xs={12} sm={6} md={4}>
            <Card className={classes.postCard}>
              <CardContent className={classes.cardContent}>
                <Typography variant="h5" className={classes.postTitle}>
                  {post.title}
                </Typography>
                <Typography className={classes.postContent}>
                  {post.content.length > 150 ? `${post.content.slice(0, 150)}...` : post.content}
                </Typography>
              </CardContent>
              <CardActions className={classes.postActions}>
                {post.fileUrl && (
                  <Button
                    onClick={() => getFile(post.fileUrl)}
                    className={classes.viewFileButton}
                  >
                    View File
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </div>

      {/* Render the file (PDF, image, etc.) */}
      {fileURL && (
        <div className={classes.iframeContainer}>
          <IconButton className={classes.closeButton} onClick={closeFilePreview}>
            <CloseIcon />
          </IconButton>
          {fileType === 'application/pdf' ? (
            <iframe src={fileURL} title="File Preview" style={{ width: '100%', height: '100%' }} />
          ) : (
            <img src={fileURL} alt="File" style={{ width: '100%', height: 'auto' }} />
          )}
          <div className={classes.downloadButton}>
            <a href={fileURL} download="file">
              <Button variant="contained" color="primary">Download File</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
