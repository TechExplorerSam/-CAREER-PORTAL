import { useState, useContext } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Chip,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    padding: "60px 60px",
    backgroundColor: "#f7f7f7",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  inputBox: {
    width: "400px",
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#A41034",
      },
      "&:hover fieldset": {
        borderColor: "#FF4081",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6200EA",
      },
    },
  },
  submitButton: {
    width: "400px",
    padding: "10px",
    backgroundColor: "#A41034",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#FF4081",
    },
    transition: "background-color 0.3s ease-in-out",
    marginTop: "20px",
  },
  title: {
    color: "#A41034",
    fontWeight: "bold",
    marginBottom: "20px",
    animation: `$fadeIn 1.5s ease-in-out`,
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(-20px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  formControl: {
    width: "400px",
    marginBottom: "20px",
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: "#6200EA",
    color: "#fff",
  },
}));

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid
          item
          container
          className={classes.inputBox}
          key={key}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <Grid item xs={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const Signup = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [signupDetails, setSignupDetails] = useState({
    type: "applicant",
    email: "",
    password: "",
    name: "",
    dob: "",
    gender: "",
    address: "",
   
    department:"",
    highestQualification: "",
    cgpa: "",
    education: [],
    skills: [],
    certifications: [],
    resume: "",
    profile: "",
    cv: "",
    bio: "",
    contactNumber: "",
    tenthCertificate: "",
    twelfthCertificate: "",
    collegeaddress:"",
     CUTMBRANCH: "", // New field for CUTM branch
  });

  const [phone, setPhone] = useState("");


  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    password: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },
    name: {
      untouched: true,
      required: true,
      error: false,
      message: "",
    },


    
  //   department: {
  //   untouched: true,
  //   required: true,
  //   error: false,
  //   message: "",
  // },
  // CUTMBRANCH: {
  //   untouched: true,
  //   required: true,
  //   error: false,
  //   message: "",
  // },
  // collegeaddress: {
  //   untouched: true,
  //   required: true,
  //   error: false,
  //   message: "",
  // },
   
  });

  const handleInput = (key, value) => {
    setSignupDetails({
      ...signupDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        required: true,
        untouched: false,
        error: status,
        message: message,
      },
    });
  };

  const handleSignup = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    

    let updatedDetails = {
      ...signupDetails,
      education: education.filter((obj) => obj.institutionName.trim() !== ""),
      
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }


    setSignupDetails(updatedDetails);

    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Signed up successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleLoginRecruiter = () => {
    const tmpErrorHandler = {};
    Object.keys(inputErrorHandler).forEach((obj) => {
      if (inputErrorHandler[obj].required && inputErrorHandler[obj].untouched) {
        tmpErrorHandler[obj] = {
          required: true,
          untouched: false,
          error: true,
          message: `${obj[0].toUpperCase() + obj.substr(1)} is required`,
        };
      } else {
        tmpErrorHandler[obj] = inputErrorHandler[obj];
      }
    });

    let updatedDetails = {
      ...signupDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...signupDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...signupDetails,
        contactNumber: "",
      };
    }

    

    setSignupDetails(updatedDetails);
  


    const verified = !Object.keys(tmpErrorHandler).some((obj) => {
      return tmpErrorHandler[obj].error;
    });

    console.log(updatedDetails);

    if (verified) {
      axios
        .post(apiList.signup, updatedDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
         })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setInputErrorHandler(tmpErrorHandler);
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <Paper elevation={3} className={classes.body}>
      <Grid container direction="column" spacing={4} alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h2" className={classes.title}>
            Signup
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            select
            label="Category"
            variant="outlined"
            className={classes.inputBox}
            value={signupDetails.type}
            onChange={(event) => {
              handleInput("type", event.target.value);
            }}
          >
            <MenuItem value="applicant">Applicant</MenuItem>
            <MenuItem value="recruiter">Recruiter</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="Name"
            value={signupDetails.name}
            onChange={(event) => handleInput("name", event.target.value)}
            className={classes.inputBox}
            error={inputErrorHandler.name.error}
            helperText={inputErrorHandler.name.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("name", true, "Name is required");
              } else {
                handleInputError("name", false, "");
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
     
          <EmailInput
            label="Email"
            value={signupDetails.email}
            onChange={(event) => handleInput("email", event.target.value)}
            inputErrorHandler={inputErrorHandler}
            handleInputError={handleInputError}
            className={classes.inputBox}
            required={true}
          />



        </Grid>
        
        <Grid item>
          <TextField
            label="Date of Birth"
            type="date"
            value={signupDetails.dob}
            onChange={(event) => handleInput("dob", event.target.value)}
            className={classes.inputBox}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              value={signupDetails.gender}
              onChange={(event) => handleInput("gender", event.target.value)}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <TextField
            label="Address"
            value={signupDetails.address}
            onChange={(event) => handleInput("address", event.target.value)}
            className={classes.inputBox}
            variant="outlined"
            multiline
            rows={3}
          />
        </Grid>
        <Grid item>
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
          />
        </Grid>
       
       
       
       
        <Grid item>
        <Grid item>
          <PasswordInput
            label="Password"
            value={signupDetails.password}
            onChange={(event) => handleInput("password", event.target.value)}
             className={classes.inputBox}
            error={inputErrorHandler.password.error}
            helperText={inputErrorHandler.password.message}
            onBlur={(event) => {
              if (event.target.value === "") {
                handleInputError("password", true, "Password is required");
              } else {
                handleInputError("password", false, "");
              }
            }}
            />
        </Grid>
        {signupDetails.type === 'applicant' && (
                <>
                 
        <Grid item>
          <TextField
            label="CGPA/Percentage"
            value={signupDetails.cgpa}
            onChange={(event) => handleInput("cgpa", event.target.value)}
            className={classes.inputBox}
            variant="outlined"
          />
        </Grid>
        <MultifieldInput education={education} setEducation={setEducation} />
        <Grid item>
          <ChipInput
            className={classes.inputBox}
            label="Skills"
            variant="outlined"
            helperText="Press enter to add skills"
            onChange={(chips) =>
              setSignupDetails({ ...signupDetails, skills: chips })
            }
          />
          <br></br>
          <br></br>
          <Grid item>
          <ChipInput
            className={classes.inputBox}
            label="Certifications"
            variant="outlined"
            helperText="Press enter to add certifications"
            onChange={(chips) =>
              setSignupDetails({ ...signupDetails, certifications: chips })
            }
          />
        </Grid>

        </Grid>
        <br></br>
        <Grid item>
          <TextField
            label="Highest Qualification"
            value={signupDetails.highestQualification}
            onChange={(event) =>
              handleInput("highestQualification", event.target.value)
            }
            className={classes.inputBox}
            variant="outlined"
          />
        </Grid>
        { <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="CV (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadCV}
            handleInput={handleInput}
            identifier={"cv"}
          />
          
        </Grid>

        
        }
         { <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="10th Certificate (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadTenthCertificate}
            handleInput={handleInput}
            identifier={"tenthCertificate"}
          />
        </Grid> }
        { <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="12th Certificate (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadTwelfthCertificate}
            handleInput={handleInput}
            identifier={"twelfthCertificate"}
          />
        </Grid> }
                  
                </>
            )}

          {/* <FileUploadInput
            className={classes.inputBox}
            label="Resume (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadResume}
            handleInput={handleInput}
            identifier={"resume"}
          /> */}
        </Grid>
        {/* <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="CV (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadCV}
            handleInput={handleInput}
            identifier={"cv"}
          />
        </Grid> */}
        <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="Profile Photo (.jpg/.png/.jpeg)"
            icon={<FaceIcon />}
            uploadTo={apiList.uploadProfileImage}
            handleInput={handleInput}
            identifier={"profile"}
          />
        </Grid>
        {/* <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="10th Certificate (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadTenthCertificate}
            handleInput={handleInput}
            identifier={"tenthCertificate"}
          />
        </Grid> */}
        {/* <Grid item>
          <FileUploadInput
            className={classes.inputBox}
            label="12th Certificate (.pdf)"
            icon={<DescriptionIcon />}
            uploadTo={apiList.uploadTwelfthCertificate}
            handleInput={handleInput}
            identifier={"twelfthCertificate"}
          />
        </Grid> */}

        {signupDetails.type === "recruiter" && (
          <>
            <Grid item>
              <TextField
                label="Department"
                value={signupDetails.department}
                onChange={(event) => handleInput("department", event.target.value)}
                className={classes.inputBox}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                label="CUTM Branch"
                value={signupDetails.CUTMBRANCH}
                onChange={(event) => handleInput("CUTMBRANCH", event.target.value)}
                className={classes.inputBox}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <TextField
                label="College Address"
                value={signupDetails.collegeaddress}
                onChange={(event) => handleInput("collegeaddress", event.target.value)}
                className={classes.inputBox}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item style={{ width: "100%" }}>
              <TextField
                label="Bio (upto 250 words)"
                multiline
                rows={8}
                style={{ width: "100%" }}
                variant="outlined"
                value={signupDetails.bio}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    handleInput("bio", event.target.value);
                  }
                }}
              />
            </Grid>

          </>
        )}
       
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={signupDetails.type === "recruiter" ? handleLoginRecruiter : handleSignup}
            className={classes.submitButton}
          >
            {signupDetails.type === "recruiter" ? "Sign Up as Recruiter" : "Sign Up as Applicant"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Signup;
