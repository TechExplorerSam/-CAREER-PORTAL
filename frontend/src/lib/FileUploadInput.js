import { useState, useContext } from "react";
import { Grid, Button, TextField, LinearProgress } from "@material-ui/core";
import { CloudUpload } from "@material-ui/icons";
import Axios from "axios";
import PropTypes from "prop-types";

import { SetPopupContext } from "../App";

const FileUploadInput = (props) => {
  const { uploadTo, identifier, handleInput, className, label, icon } = props;
  const setPopup = useContext(SetPopupContext);

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // New state to store the file name
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleFileValidation = (file) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setPopup({
        open: true,
        severity: "error",
        message: "Unsupported file type. Please upload a PDF, JPG, or PNG file.",
      });
      return false;
    }

    if (file.size > maxSize) {
      setPopup({
        open: true,
        severity: "error",
        message: "File size exceeds the 5MB limit. Please choose a smaller file.",
      });
      return false;
    }

    return true;
  };

  const handleUpload = () => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    Axios.post(uploadTo, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        setUploadPercentage(
          parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          )
        );
      },
    })
      .then((response) => {
        handleInput(identifier, response.data.url);
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        setUploadPercentage(0); // Reset progress after success
        setFileName(file.name); // Store file name after successful upload
        setFile(null); // Clear the file after successful upload
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response?.data?.message || err.message || "An error occurred during the upload",
        });
      });
  };

  return (
    <Grid container item xs={12} direction="column" className={className}>
      <Grid container item xs={12} spacing={0}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            component="label"
            style={{ width: "100%", height: "100%" }}
          >
            {icon}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={(event) => {
                const selectedFile = event.target.files[0];
                if (handleFileValidation(selectedFile)) {
                  setUploadPercentage(0);
                  setFile(selectedFile);
                  setFileName(selectedFile.name); // Update file name state
                }
              }}
            />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label={label}
            value={fileName} // Use fileName state for the TextField value
            InputProps={{
              readOnly: true,
            }}
            variant="outlined"
            style={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="secondary"
            style={{ width: "100%", height: "100%" }}
            onClick={handleUpload}
            disabled={!file}
          >
            <CloudUpload />
          </Button>
        </Grid>
      </Grid>
      {uploadPercentage > 0 && (
        <Grid item xs={12} style={{ marginTop: "10px" }}>
          <LinearProgress variant="determinate" value={uploadPercentage} />
        </Grid>
      )}
    </Grid>
  );
};

FileUploadInput.propTypes = {
  uploadTo: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

export default FileUploadInput;
