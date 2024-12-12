import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  Avatar,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { server } from "../../lib/apiList";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(45deg, #3f51b5, #1a237e)", // New stylish gradient background
  },
  profileCard: {
    padding: "40px",
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    textAlign: "center",
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for profile image
  },
  inputBox: {
    marginBottom: "20px",
  },
  updateButton: {
    marginTop: "30px",
    backgroundColor: "#ff4081",
    color: "#fff",
    padding: "12px 30px",
    borderRadius: "25px",
    fontSize: "16px",
    transition: "0.3s ease",
    "&:hover": {
      backgroundColor: "#e91e63",
    },
  },
  makepostsButton: {
    marginTop: "30px", // Adjusted to align with the other button
    backgroundColor: "#ff4081",
    color: "#fff",
    padding: "12px 30px",
    borderRadius: "25px",
    fontSize: "16px",
    transition: "0.3s ease",
    "&:hover": {
      backgroundColor: "#e91e63",
    },
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between", // Align buttons horizontally with space in between
    marginTop: "30px", // Add top margin to space out from the inputs
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    bio: "",
    contactNumber: "",
    department: "",
    profilePicture: "", // New field for profile picture
  });

  const [phone, setPhone] = useState("");

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProfileDetails(response.data);
        setPhone(response.data.contactNumber);
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const handleUpdate = () => {
    let updatedDetails = {
      ...profileDetails,
    };
    if (phone !== "") {
      updatedDetails = {
        ...profileDetails,
        contactNumber: `+${phone}`,
      };
    } else {
      updatedDetails = {
        ...profileDetails,
        contactNumber: "",
      };
    }

    axios
      .put(apiList.user, updatedDetails, {
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
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
      });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.profileCard}>
        {/* Profile Picture */}
        <Avatar
          src={`${server}${profileDetails.profile}`}
          alt={profileDetails.name}
          className={classes.profileImage}
        />

        {/* Name */}
        <Typography variant="h4" gutterBottom>
          {profileDetails.name || "Your Name"}
        </Typography>

        {/* Bio */}
        <TextField
          label="Bio (upto 250 words)"
          multiline
          rows={4}
          variant="outlined"
          className={classes.inputBox}
          value={profileDetails.bio}
          onChange={(e) => handleInput("bio", e.target.value)}
          fullWidth
        />

        {/* Phone */}
        <PhoneInput
          country={"in"}
          value={phone}
          onChange={(phone) => setPhone(phone)}
          style={{ width: "100%", marginBottom: "20px" }}
        />

        {/* Department */}
        <TextField
          label="Department"
          variant="outlined"
          className={classes.inputBox}
          value={profileDetails.department}
          onChange={(e) => handleInput("department", e.target.value)}
          fullWidth
        />

        {/* Buttons */}
        <div className={classes.buttonContainer}>
          <Button
            variant="contained"
            className={classes.updateButton}
            onClick={handleUpdate}
          >
            Update Details
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.makepostsButton}
            onClick={() => window.location.href='/postform'}
          >
            Make Posts
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Profile;
