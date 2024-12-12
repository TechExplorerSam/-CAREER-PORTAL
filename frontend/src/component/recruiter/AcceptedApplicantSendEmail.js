import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Paper,
  Typography,
  withStyles,
  Grid,
} from "@material-ui/core";
import apiList from "../../lib/apiList";
import { SetPopupContext } from "../../App";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import  { userType } from "../../lib/isAuth";
// Define styles using withStyles
const styles = (theme) => ({
  paper: {
    padding: theme.spacing(5),
    margin: "auto",
    maxWidth: 600,
    borderRadius: "15px",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
    backgroundColor: "#fafafa",
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 600,
    color: "#2E3B55",
    fontSize: "1.8rem",
    textAlign: "center",
  },
  textField: {
    marginBottom: theme.spacing(3),
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "5px",
  },
  button: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#45a049",
    },
  },
  gridContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  inputLabel: {
    fontWeight: 600,
    color: "#2E3B55",
  },
  inputRoot: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
    },
  },
});

// EmailForm component
const EmailForm = ({ classes }) => {
  const setPopup = useContext(SetPopupContext);
  const [userRole, setUserRole] = useState(""); // State to store user role
  const [emailDetails, setEmailDetails] = useState({
    recipientEmail: "",
    subject: "",
    text: "",
    htmlContent: "",
  });

  useEffect(() => {
    // Fetch user role on component mount
    let isMounted = true; // Track whether the component is mounted
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(apiList.user, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.data);
        // console.log("Hi User role is"+response.data.type);
        // setUserRole(response.data.type); // Store user role in state
        // if(isAuth()){
        //  setUserRole( userType());
        // }
        if (isMounted) {
          setUserRole(response.data.role); // Set user role only if mounted
        }
        
      } catch (error) {
        console.error("Error fetching user role:", error);
        setPopup({
          open: true,
          severity: "error",
          message: "Error fetching user role",
        });
      }
    };

    fetchUserRole(); // Call the function to fetch user role
  }, [setPopup]); // Dependency array to avoid infinite loops

  const handleChange = (e) => {
    setEmailDetails({ ...emailDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(apiList.email, emailDetails);
      console.log(response.data);
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    }
  };

  // Redirect if user is not a recruiter
  if (userType() !== "recruiter") {
    return <Redirect to="/not-authorized" />;
  }
  

  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" className={classes.title}>
        Send Email
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12}>
            <TextField
              type="email"
              name="recipientEmail"
              placeholder="Recipient's email"
              value={emailDetails.recipientEmail}
              onChange={handleChange}
              required
              className={`${classes.textField} ${classes.inputRoot}`}
              variant="outlined"
              label="Recipient's Email"
              InputLabelProps={{
                className: classes.inputLabel,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="text"
              name="subject"
              placeholder="Subject"
              value={emailDetails.subject}
              onChange={handleChange}
              required
              className={`${classes.textField} ${classes.inputRoot}`}
              variant="outlined"
              label="Subject"
              InputLabelProps={{
                className: classes.inputLabel,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="text"
              placeholder="Plain text content"
              value={emailDetails.text}
              onChange={handleChange}
              required
              className={`${classes.textField} ${classes.inputRoot}`}
              variant="outlined"
              label="Plain Text Content"
              multiline
              rows={4}
              InputLabelProps={{
                className: classes.inputLabel,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="htmlContent"
              placeholder="HTML content (optional)"
              value={emailDetails.htmlContent}
              onChange={handleChange}
              className={`${classes.textField} ${classes.inputRoot}`}
              variant="outlined"
              label="HTML Content (Optional)"
              multiline
              rows={4}
              InputLabelProps={{
                className: classes.inputLabel,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              className={classes.button}
              fullWidth
            >
              Send Email
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

// Export the styled component
export default withStyles(styles)(EmailForm);
