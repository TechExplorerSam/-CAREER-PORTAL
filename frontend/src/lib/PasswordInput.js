import { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%", // Full width
    marginBottom: theme.spacing(2), // Space between fields
    "& .MuiOutlinedInput-root": {
      borderRadius: '15px',  // Rounded corners
      background: '#ffffff', // White background
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
      transition: '0.3s',
      "&.Mui-focused": {
        boxShadow: '0 8px 12px rgba(0, 0, 0, 0.2)', // Slightly larger shadow when focused
      },
    },
    "& .MuiOutlinedInput-input": {
      height: '100px',  // Fixed height
      padding: '12px',  // Padding inside the input
    },
    "& .MuiInputAdornment-root": {
      color: "#777", // Slightly dimmed icon color
    },
  },
  helperText: {
    fontSize: '0.8rem',  // Smaller font for helper text
    color: theme.palette.error.main,  // Red for error messages
  },
}));

const PasswordInput = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const classes = useStyles(); // Use the styles

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl
      variant="outlined"
      error={props.error ? props.error : null}
      fullWidth
      className={classes.root} // Apply the styles
    >
      <InputLabel htmlFor="outlined-adornment-password">{props.label}</InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        value={props.value}
        onChange={(event) => props.onChange(event)}
        labelWidth={props.labelWidth ? props.labelWidth : 70}
        className={props.className}
        onBlur={props.onBlur ? props.onBlur : null}
        inputProps={{
          style: { height: '100%' }, // Ensure the input field takes the full height
        }}
      />
      {props.helperText ? (
        <FormHelperText className={classes.helperText}>{props.helperText}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default PasswordInput;
