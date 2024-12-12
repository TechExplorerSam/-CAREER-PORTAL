import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, IconButton, Typography } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { SetPopupContext } from "../App";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dialogContent: {
    padding: theme.spacing(3),
  },
  dialogActions: {
    justifyContent: 'center',
    paddingBottom: theme.spacing(3),
  },
  iconButton: {
    color: theme.palette.common.white,
  },
  yesButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  noButton: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  icon: {
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
  },
}));

const Logout = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(true); // To control the dialog state
  const [confirmed, setConfirmed] = useState(false); // To handle logout confirmation

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    setPopup({
      open: true,
      severity: "success",
      message: "Logged out successfully",
    });
    setConfirmed(true); // Set confirmed to true to trigger Redirect
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog without logging out
  };

  if (confirmed) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title" className={classes.dialogTitle}>
          <Typography variant="h6">Confirm Logout</Typography>
          <IconButton className={classes.iconButton} onClick={handleClose}>
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <CheckCircleIcon className={classes.icon} color="secondary" />
          <DialogContentText id="logout-dialog-description" align="center">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={handleClose}
            variant="outlined"
            className={classes.noButton}
            startIcon={<CancelIcon />}
            
          >
            No
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            className={classes.yesButton}
            startIcon={<ExitToAppIcon />}
          >
            Yes, Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Logout;
