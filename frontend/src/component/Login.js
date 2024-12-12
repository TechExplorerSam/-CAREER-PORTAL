import { useContext, useState } from "react";
import {
  Grid,
  Button,
  Typography,
  makeStyles,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  body: {
    width:"50%",
    padding: "70px",
    borderRadius: "20px",
    backdropFilter: "blur(15px)", // Glass effect
    background: "rgba(255, 255, 255, 0.2)", // Transparent background
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    width:"50%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #6e8efb, #a777e3)", // Gradient background
  },
  logo: {
    height: '120px',
    width: '120px',
    marginBottom: theme.spacing(3),
    animation: `$scaleUp 3s infinite ease-in-out`, // Logo animation
  },
  "@keyframes scaleUp": {
    "0%": {
      transform: "scale(1)",
    },
    "50%": {
      transform: "scale(1.1)",
    },
    "100%": {
      transform: "scale(1)",
    },
  },
  title: {
    marginBottom: theme.spacing(4),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: "'Poppins', sans-serif",
    textTransform: 'uppercase',
    fontSize: '2.2rem',
  },
  inputBox: {
    height: "50%",
    width: "100%",
    marginBottom: theme.spacing(3),
    "& .MuiInputBase-root": {
      borderRadius: '15px',
      background: 'rgba(255, 255, 255, 0.8)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transition: '0.3s',
    },
  },
  submitButton: {
    width: "100%",
    padding: "14px",
    background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
    color: '#ffffff',
    fontWeight: 'bold',
    borderRadius: '15px',
    transition: '0.3s',
    '&:hover': {
      boxShadow: '0 8px 15px rgba(255, 65, 108, 0.4)',
      transform: 'scale(1.05)',
    },
  },
  background: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #6e8efb 30%, #e2e2e2 100%)',
    zIndex: '-1',
    borderRadius: '15px',
  },
  decoration: {
    position: 'absolute',
    top: '25%',
    right: '5%',
    opacity: '0.3',
    zIndex: '-1',
  },
  footerText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: theme.spacing(2),
    fontFamily: "'Roboto', sans-serif",
    fontSize: '0.9rem',
  },
}));

const Login = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" },
  });
  const [loading, setLoading] = useState(false);

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: { error: status, message: message },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      setLoading(true);
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <div className={classes.container}>
      <Paper elevation={3} className={classes.body}>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          onKeyPress={handleKeyPress}
          tabIndex={0}
        >
          <Grid item>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpykLb7bBoo2h5U1ib1xTEiD53j4C-mY_BTA&s"
              className={classes.logo}
              alt="CUTM Logo"
            />

            
            <Typography variant="h4" className={classes.title}>
              Login
            </Typography>
          </Grid>
          <Grid item>
            <EmailInput
              label="Email"
              value={loginDetails.email}
              onChange={(event) => handleInput("email", event.target.value)}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              className={classes.inputBox}
            />
          </Grid>
          <Grid item>
            <PasswordInput
              label="Password"
              value={loginDetails.password}
              onChange={(event) => handleInput("password", event.target.value)}
              className={classes.inputBox}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleLogin}
              className={classes.submitButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
    </div>
  );
};

export default Login;
