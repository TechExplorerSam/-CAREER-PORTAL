import React, { useEffect, useState } from "react";
import { Paper, Grid, Typography, Button, Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { userType } from "../../lib/isAuth";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

// Define custom styles
const useStyles = makeStyles((theme) => ({
  container: {
    padding: "30px",
    margin: "20px auto",
    maxWidth: "800px",
    borderRadius: "15px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    marginBottom: theme.spacing(2),
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
}));

const CandidateDetailsPage = () => {
  const classes = useStyles();
  const [candidate, setCandidate] = useState(null);
  const [isFullyRead, setIsFullyRead] = useState(false);

  useEffect(() => {
    // Fetch the candidate data from localStorage
    const storedData = localStorage.getItem("candidateData");
    if (storedData) {
      setCandidate(JSON.parse(storedData));
    }

    // Scroll event listener to detect if the user reaches the bottom
    const handleScroll = () => {
      // Check if user scrolled to the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight
      ) {
        setIsFullyRead(true);
        // Set a flag in localStorage to indicate details are fully read
        localStorage.setItem("detailsRead", "true");
      }
    };

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

   // Redirect if user is not a recruiter
   if (userType() !== "recruiter") {
    return <Redirect to="/not-authorized" />;
  }

  if (!candidate) {
    return <Typography variant="h6">No candidate data available.</Typography>;
  }

  return (
    <Paper className={classes.container}>
      <Grid container justifyContent="center">
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Avatar
            src={candidate.profilepic} // Assuming profile picture path
            alt={candidate.name}
            className={classes.avatar}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            {candidate.name}
          </Typography>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
          
            <Typography variant="h6">Name: {candidate.name}</Typography>
            <Typography variant="h6">
              Education: {candidate.education}
            </Typography>
            <Typography variant="h6">
              Highest Qualification: {candidate.highestQualification}
            </Typography>
            <Typography variant="h6">
              Skills: {candidate.skills.join(", ")}
            </Typography>
            <Typography variant="h6">
              Gender: {candidate.gender}
            </Typography>
            <Typography variant="h6">
              ContactNumber: {candidate.contactNumber}
            </Typography>
            <Typography variant="h6">
              DOB: {candidate.dob}
            </Typography>
            <Typography variant="h6">
              CGPA: {candidate.cgpa}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(candidate.cv)}
              style={{ marginBottom: "10px" }}
            >
              Download CV
            </Button>
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.open(candidate.tenthCertificate)}
              style={{ marginBottom: "10px" }}
            >
              Download Class 10th Certificate
            </Button>
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.open(candidate.twelfthCertificate)}
            >
              Download Class 12th Certificate
            </Button>
          </Grid>

         
        </Grid>

      
      </Grid>
    </Paper>
  );
};

export default CandidateDetailsPage;
