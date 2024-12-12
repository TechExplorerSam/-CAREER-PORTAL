import React from 'react';
import { Grid, Typography, Button, Card, CardContent, makeStyles } from '@material-ui/core';
import HeroSection from './HeroSection';
import Footer from './Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(45deg, #3F51B5 30%, #FF4081 90%)', // Gradient background
    // paddingBottom: theme.spacing(6), // Ensure space for footer
  },
  content: {
    flex: 1,
    padding: theme.spacing(4),
    backgroundColor: '#fff',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.shape.borderRadius,
    margin: '20px auto',
    width: '100%',
    maxWidth: '1200px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      maxWidth: '100%',
    },
  },
  welcomeText: {
    color: '#2E3B55',
    fontWeight: 700,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    fontSize: '3rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2.2rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8rem',
    },
  },
  button: {
    padding: '15px 30px',
    marginTop: theme.spacing(4),
    backgroundColor: '#FF4081',
    color: '#fff',
    fontWeight: 700,
    borderRadius: '50px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      backgroundColor: '#FF80AB',
      boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-5px)',
    },
  },
  card: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    backgroundColor: '#F1F1F1',
    borderRadius: '15px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-10px)',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    },
  },
  heroSection: {
    marginTop: theme.spacing(6),
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#fff', // Footer background is unaffected
    padding: theme.spacing(4),
    marginTop: theme.spacing(6), // Space before footer starts
  },
}));

const Welcome = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        className={classes.content}
      >
        <Typography variant="h2" className={classes.welcomeText}>
          Welcome to Career Portal CUTM
        </Typography>

        {/* New Dynamic Section with Card Elements */}
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" color="primary">
                  Find Jobs
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Explore career opportunities from the best employers in the industry.
                </Typography>
                <Button className={classes.button} onClick={() => window.location.href = '/jobs'}>Explore Now</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" color="primary">
                  Apply Instantly
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Submit your application with a single click and track your job progress.
                </Typography>
                <Button className={classes.button}  onClick={() => window.location.href = '/jobs'}>Apply Now</Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" color="primary">
                  Get Notified
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Receive real-time notifications about job openings and status updates.
                </Typography>
                <Button className={classes.button} onClick={() => window.location.href = '/signup'}>Sign Up</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <div className={classes.heroSection}>
          <HeroSection />
        </div>
      </Grid>

      {/* Footer component */}
      <Footer className={classes.footer} />
    </div>
  );
};

// Error Page
export const ErrorPage = () => {
  const classes = useStyles();
  
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      className={classes.content}
      style={{ minHeight: '100vh' }} // Make sure it takes the full height
    >
      <Typography variant="h2" color="secondary">
        404: Page Not Found
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Button className={classes.button} href="/">
        Back to Home
      </Button>
    </Grid>
  );
};

// Not Authorized Page
export const NotAuthorized = () => {
  const classes = useStyles();
  
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '93vh', padding: '30px', background: '#F5F5F5' }}
    >
      <Typography variant="h4" color="error">
        Access Denied
      </Typography>
      <Typography variant="body1" style={{ marginBottom: '20px' }}>
        You do not have permission to access this page.
      </Typography>
      <Button className={classes.button} href="/">
        Go Back Home
      </Button>
    </Grid>
  );
};

export default Welcome;
