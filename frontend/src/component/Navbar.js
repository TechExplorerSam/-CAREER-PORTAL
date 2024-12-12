import React from "react";
import { AppBar, Toolbar, Typography, Button, makeStyles, IconButton, Fade } from "@material-ui/core";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useHistory } from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import WorkIcon from '@material-ui/icons/Work';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LoginIcon from '@material-ui/icons/LockOpen';
import SignupIcon from '@material-ui/icons/PersonAdd';
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "linear-gradient(to right, #A41034, #D32F2F)",
    animation: `$fadeIn 2s ease`,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
  },
  logoContainer: {
    backgroundColor: "#FFFFFF",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(4),
    transition: "transform 0.3s ease-in-out",
    cursor: "pointer",
    '&:hover': {
      transform: "scale(1.1)",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    },
  },
  logo: {
    height: "60px",
    [theme.breakpoints.down('sm')]: {
      height: "50px",
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textAlign: 'left',
    marginLeft: theme.spacing(2),
    color: "white",
    animation: `$slideIn 1s ease`,
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    marginLeft: theme.spacing(2),
    fontWeight: 600,
    color: "white",
    textTransform: "uppercase",
    '&:hover': {
      backgroundColor: "#ffffff20",
      transform: "scale(1.1)",
      transition: "transform 0.3s ease-in-out",
    },
    transition: "background-color 0.3s ease-in-out, transform 0.3s ease-in-out",
  },
  authButtons: {
    display: 'flex',
    alignItems: 'center',
    animation: `$fadeIn 1.5s ease`,
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes slideIn": {
    "0%": {
      transform: "translateX(-100%)",
    },
    "100%": {
      transform: "translateX(0)",
    },
  },
}));

const Navbar = (props) => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = (location) => {
    console.log(location);
    history.push(location);
  };

  const redirectToWebsite = () => {
    window.open("https://cutm.ac.in/", "_blank");
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={classes.logoContainer} onClick={redirectToWebsite}>
            <img 
              src="https://cutm.ac.in/wp-content/uploads/Centurion_University_of_Technology_and_Management_Logo.webp" 
              alt="Logo" 
              className={classes.logo} 
            />
          </div>
          <Typography variant="h6" className={classes.title}>
            Career Portal
          </Typography>
        </div>
        <Fade in={true} timeout={1000}>
          {isAuth() ? (
            userType() === "recruiter" ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<HomeIcon />}
                  onClick={() => handleClick("/home")}
                  className={classes.button}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  startIcon={<AddIcon />}
                  onClick={() => handleClick("/addjob")}
                  className={classes.button}
                >
                  Add Jobs
                </Button>
                <Button
                  color="inherit"
                  startIcon={<WorkIcon />}
                  onClick={() => handleClick("/myjobs")}
                  className={classes.button}
                >
                  My Jobs
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  onClick={() => handleClick("/employees")}
                  className={classes.button}
                >
                  Employees
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  onClick={() => handleClick("/profile")}
                  className={classes.button}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  startIcon={<ExitToAppIcon />}
                  onClick={() => handleClick("/logout")}
                  className={classes.button}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  startIcon={<HomeIcon />}
                  onClick={() => handleClick("/home")}
                  className={classes.button}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  startIcon={<WorkIcon />}
                  onClick={() => handleClick("/applications")}
                  className={classes.button}
                >
                  Applications
                </Button>
                <Button
                  color="inherit"
                  startIcon={<PersonIcon />}
                  onClick={() => handleClick("/profile")}
                  className={classes.button}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  startIcon={<ExitToAppIcon />}
                  onClick={() => handleClick("/logout")}
                  className={classes.button}
                >
                  Logout
                </Button>
              </>
            )
          ) : (
            <div className={classes.authButtons}>
              <ButtonGroup variant="text" color="inherit">
                <Button
                  startIcon={<LoginIcon />}
                  onClick={() => handleClick("/login")}
                  className={classes.button}
                >
                  Login
                </Button>
                <Button
                  startIcon={<SignupIcon />}
                  onClick={() => handleClick("/signup")}
                  className={classes.button}
                >
                  Signup
                </Button>
              </ButtonGroup>
            </div>
          )}
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
