import { useContext, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  TextField,
  MenuItem,
  makeStyles,
  FormControl,
  Select,
  InputLabel,
 
  Box,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

// Define the styles using makeStyles
const useStyles = makeStyles((theme) => ({
  body: {
    height: "100%",
    background: "linear-gradient(to right, #f8f9fa, #e9ecef)", // Subtle gradient
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: "70px 50px",
    minHeight: "193vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: "40px",
    outline: "none",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)", // Soft shadow
    width: "100%",
    maxWidth: "800px", // Max width for better alignment on large screens
  },
  title: {
    color: theme.palette.primary.main,
    marginBottom: "20px",
    fontSize: "2rem",
    fontWeight: 600,
  },
  formGrid: {
    width: "100%",
  },
  formItem: {
    marginBottom: "20px",
  },
  button: {
    padding: "12px 60px",
    marginTop: "20px",
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    borderRadius: "30px",
    fontWeight: "bold",
    textTransform: "none",
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  inputField: {
    borderRadius: "10px",
    marginBottom: "15px",
    "& .MuiInputBase-root": {
      padding: "10px",
    },
  },
  inputBox: {
    width: "100%",
    marginBottom: "15px",
  },
  inputLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  skillContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "10px",
  },
  skillInput: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "8px 12px",
    fontSize: "0.9rem",
  },
  formSection: {
    width: "100%",
    marginBottom: "15px",
  },
  criteriaTitle: {
    color: theme.palette.secondary.main,
    fontSize: "1.2rem",
    fontWeight: 600,
    marginBottom: "15px",
  },
}));

const CreateJobs = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 30,
    deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
      .toISOString()
      .substr(0, 16),
    skillsets: [],
    jobType: "Full-Time",
    duration: 0,
    salary: 0,
    experience: 0, // New field for experience
    qualification: "", // New field for qualification
    ageLimit: 0, // New field for age limit
    min10thPercentage: 0, // New field for minimum 10th percentage
    min12thPercentage: 0, // New field for minimum 12th percentage
    minGraduationGPA: 0, // New field for minimum graduation GPA
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    axios
      .post(apiList.jobs, jobDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setJobDetails({
          title: "",
          maxApplicants: 100,
          maxPositions: 30,
          deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .substr(0, 16),
          skillsets: [],
          jobType: "Full-Time",
          duration: 0,
          salary: 0,
          experience: 0,
          qualification: "",
          ageLimit: 0,
          min10thPercentage: 0,
          min12thPercentage: 0,
          minGraduationGPA: 0,
        });
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
  };
  

  return (
    <Grid container className={classes.body} justify="center">
      <Grid item className={classes.container}>
        <Typography variant="h2" className={classes.title}>
          Add Job
        </Typography>
        <Paper className={classes.paper}>
          <Grid container className={classes.formGrid} direction="column" spacing={3}>
            {/* Job Title */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Job Title"
                value={jobDetails.title}
                onChange={(e) => handleInput("title", e.target.value)}
                variant="outlined"
                fullWidth
                className={classes.inputField}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {/* Skills */}
            <Grid item className={classes.formItem}>
              <ChipInput
                className={classes.inputBox}
                label="Skills"
                variant="outlined"
                helperText="Press enter to add skills"
                value={jobDetails.skillsets}
                onAdd={(chip) => setJobDetails({ ...jobDetails, skillsets: [...jobDetails.skillsets, chip] })}
                onDelete={(chip, index) => {
                  const skillsets = [...jobDetails.skillsets];
                  skillsets.splice(index, 1);
                  setJobDetails({ ...jobDetails, skillsets });
                }}
                fullWidth
              />
            </Grid>
            {/* Job Type */}
            <Grid item className={classes.formItem}>
              <TextField
                select
                label="Job Type"
                variant="outlined"
                value={jobDetails.jobType}
                onChange={(e) => handleInput("jobType", e.target.value)}
                fullWidth
                className={classes.inputField}
              >
                <MenuItem value="Full-Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Work From Home">Work From Home</MenuItem>
              </TextField>
            </Grid>
            {/* Experience Requirement */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Experience (Years)"
                type="number"
                variant="outlined"
                value={jobDetails.experience}
                onChange={(e) => handleInput("experience", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            {/* Qualification */}
            <Grid item className={classes.formItem}>
            <FormControl className={classes.qualification}>
          <InputLabel>Qualification</InputLabel>
          <Select
            value={jobDetails.qualification}
            onChange={(e) => handleInput("qualification",e.target.value)}
          >
            <MenuItem value="BSc">BSc</MenuItem>
            <MenuItem value="MSc">MSc</MenuItem>
            <MenuItem value="B.Tech">B.Tech</MenuItem>
            <MenuItem value="M.Tech">M.Tech</MenuItem>
            <MenuItem value="PhD">PhD</MenuItem>
            <MenuItem value="Diploma">Diploma</MenuItem>
            <MenuItem value="MBA">MBA</MenuItem>
            <MenuItem value="BBA">BBA</MenuItem>
          </Select>
        </FormControl>
            </Grid>
            {/* Age Limit */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Age Limit"
                type="number"
                variant="outlined"
                value={jobDetails.ageLimit}
                onChange={(e) => handleInput("ageLimit", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 18 } }}
              />
            </Grid>
            <Grid item className={classes.formItem}>
              <TextField
                label="Salary"
                type="number"
                variant="outlined"
                value={jobDetails.salary}
                onChange={(e) => handleInput("salary", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            {/* Minimum 10th Percentage */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Minimum 10th Percentage"
                type="number"
                variant="outlined"
                value={jobDetails.min10thPercentage}
                onChange={(e) => handleInput("min10thPercentage", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            {/* Minimum 12th Percentage */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Minimum 12th Percentage"
                type="number"
                variant="outlined"
                value={jobDetails.min12thPercentage}
                onChange={(e) => handleInput("min12thPercentage", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            {/* Minimum Graduation GPA */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Minimum Graduation GPA"
                type="number"
                variant="outlined"
                value={jobDetails.minGraduationGPA}
                onChange={(e) => handleInput("minGraduationGPA", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 0, max: 10 } }}
              />
            </Grid>
            {/* Max Applicants */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Max Applicants"
                type="number"
                variant="outlined"
                value={jobDetails.maxApplicants}
                onChange={(e) => handleInput("maxApplicants", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            {/* Max Positions */}
            <Grid item className={classes.formItem}>
              <TextField
                label="Max Positions"
                type="number"
                variant="outlined"
                value={jobDetails.maxPositions}
                onChange={(e) => handleInput("maxPositions", e.target.value)}
                fullWidth
                className={classes.inputField}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item className={classes.formItem}>
              <Button
                variant="contained"
                className={classes.button}
                onClick={handleUpdate}
              >
                Add Job
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CreateJobs;
