import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,

  Checkbox,
} from "@material-ui/core";

import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";
import Footer from "./Footer";

const useStyles = makeStyles((theme) => ({
  jobTileOuter: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    borderRadius: '10px',
    backgroundColor: '#f4f6f8',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.15)',
    },
  },
  jobDetails: {
    color: '#444',
    fontSize: '1rem',
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 'bold',
    color: '#333',
  },
  chip: {
    backgroundColor: '#2196f3',
    color: '#fff',
    marginRight: '5px',
  },
  button: {
    padding: theme.spacing(19),
    borderRadius: '8px',
    backgroundColor: '#4caf50',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#388e3c',
    },
  },
  popupDialog: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: theme.spacing(4),
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '50%',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: theme.shadows[5],
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  submitButton: {
    padding: '10px 50px',
    marginTop: theme.spacing(2),
    alignSelf: 'center',
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  modalContent: {
    position: 'relative',
    maxWidth: '600px',
    margin: 'auto',
    padding: theme.spacing(2),
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  modalBody: {
    maxHeight: '400px',  // Set a max height for the body of the modal
    overflowY: 'auto',   // Enable vertical scrolling if content overflows
    paddingRight: theme.spacing(1), // Optional: to avoid content touching the right edge
  },
  textField: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
 
}));


const JobTile = (props) => {
  const classes = useStyles();
  const { job } = props;
  const setPopup = useContext(SetPopupContext);

  const [open, setOpen] = useState(false);
  const [sop, setSop] = useState("");
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [min10thPercentage, setMin10thPercentage] = useState('');
  const [min12thPercentage, setMin12thPercentage] = useState('');
  const [minGraduationGPA, setMinGraduationGPA] = useState('');
  
  const handleClose = () => {
    setOpen(false);
    setSop("");
  };

  const handleApply = () => {
    console.log(job._id);
    console.log(sop);
    axios
      .post(
        `${apiList.jobs}/${job._id}/applications`,
        {
          sop: sop,
          experience: experience,
          qualification: qualification,
          ageLimit: ageLimit,
          min10thPercentage: min10thPercentage,
          min12thPercentage: min12thPercentage,
          minGraduationGPA: minGraduationGPA,
          
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data.message,
        });
        handleClose();
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        handleClose();
      });
  };

  const deadline = new Date(job.deadline).toLocaleDateString();

  return (
    
    <Paper className={classes.jobTileOuter} elevation={3}>
    <Grid container>
      <Grid container item xs={9} spacing={1} direction="column">
        <Grid item>
          <Typography variant="h5" className={classes.title}>{job.title}</Typography>
        </Grid>
        <Grid item>
          <Rating value={job.rating !== -1 ? job.rating : null} readOnly />
        </Grid>
        <Grid item className={classes.jobDetails}>Role: {job.jobType}</Grid>
        <Grid item className={classes.jobDetails}>Salary: &#8377; {job.salary} per month</Grid>
        <Grid item className={classes.jobDetails}>
          Duration: {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
        </Grid>
        <Grid item className={classes.jobDetails}>Posted By: {job.recruiter.name}</Grid>
        <Grid item className={classes.jobDetails}>Application Deadline: {deadline}</Grid>
        <Grid item className={classes.jobDetails}>Minimum Tenth Percentage: {job.min10thPercentage}</Grid>
        <Grid item className={classes.jobDetails}>Minimum Twelfth Percentage: {job.min12thPercentage}</Grid>
        <Grid item className={classes.jobDetails}>Minimum Graduation GPA: {job.minGraduationGPA}</Grid>
        <Grid item className={classes.jobDetails}>Age Limit: {job.ageLimit}</Grid>
        <Grid item className={classes.jobDetails}>Qualification: {job.qualification}</Grid>

        <Grid item>
          {job.skillsets.map((skill) => (
            <Chip label={skill} className={classes.chip} />
          ))}
        </Grid>
        
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          className={classes.button}
          onClick={() => setOpen(true)}
          disabled={userType() === "recruiter"}
        >
          Apply
        </Button>
      </Grid>
    </Grid>
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
  <Paper className={classes.modalContent}>
    <div className={classes.modalBody}>
      <TextField
        label="Write SOP (upto 250 words)"
        multiline
        rows={8}
        className={classes.textField}
        variant="outlined"
        value={sop}
        onChange={(event) => {
          if (event.target.value.split(" ").filter((n) => n !== "").length <= 250) {
            setSop(event.target.value);
          }
        }}
      />
       <FormControl className={classes.textField}>
          <InputLabel>Qualification</InputLabel>
          <Select
            value={qualification}
            onChange={(event) => setQualification(event.target.value)}
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

      <TextField
        label="Experience (in years)"
        type="number"
        className={classes.textField}
        variant="outlined"
        value={experience}
        onChange={(event) => setExperience(event.target.value)}
        required
      />
     
      <TextField
        label="Age Limit"
        type="number"
        className={classes.textField}
        variant="outlined"
        value={ageLimit}
        onChange={(event) => setAgeLimit(event.target.value)}
        required
      />
      <TextField
        label="Min 10th Percentage"
        type="number"
        className={classes.textField}
        variant="outlined"
        value={min10thPercentage}
        onChange={(event) => setMin10thPercentage(event.target.value)}
        required
      />
      <TextField
        label="Min 12th Percentage"
        type="number"
        className={classes.textField}
        variant="outlined"
        value={min12thPercentage}
        onChange={(event) => setMin12thPercentage(event.target.value)}
        required
      />
      <TextField
        label="Min Graduation GPA"
        type="number"
        className={classes.textField}
        variant="outlined"
        value={minGraduationGPA}
        onChange={(event) => setMinGraduationGPA(event.target.value)}
        required
      />
    </div>
    <Button
      variant="contained"
      className={classes.submitButton}
      onClick={handleApply}
    >
      Submit
    </Button>
  </Paper>
</Modal>


  </Paper>
  );
};

const FilterPopup = (props) => {
  const classes = useStyles();
  const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
  return (
    <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
      <Paper
        style={{
          padding: "50px",
          outline: "none",
          minWidth: "50%",
        }}
      >
        <Grid container direction="column" alignItems="center" spacing={3}>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Job Type
            </Grid>
            <Grid
              container
              item
              xs={9}
              justify="space-around"
              // alignItems="center"
            >
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="fullTime"
                      checked={searchOptions.jobType.fullTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Full Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="partTime"
                      checked={searchOptions.jobType.partTime}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Part Time"
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="wfh"
                      checked={searchOptions.jobType.wfh}
                      onChange={(event) => {
                        setSearchOptions({
                          ...searchOptions,
                          jobType: {
                            ...searchOptions.jobType,
                            [event.target.name]: event.target.checked,
                          },
                        });
                      }}
                    />
                  }
                  label="Work From Home"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Salary
            </Grid>
            <Grid item xs={9}>
              <Slider
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => {
                  return value * (100000 / 100);
                }}
                marks={[
                  { value: 0, label: "0" },
                  { value: 100, label: "100000" },
                ]}
                value={searchOptions.salary}
                onChange={(event, value) =>
                  setSearchOptions({
                    ...searchOptions,
                    salary: value,
                  })
                }
              />
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Duration
            </Grid>
            <Grid item xs={9}>
              <TextField
                select
                label="Duration"
                variant="outlined"
                fullWidth
                value={searchOptions.duration}
                onChange={(event) =>
                  setSearchOptions({
                    ...searchOptions,
                    duration: event.target.value,
                  })
                }
              >
                <MenuItem value="0">All</MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
                <MenuItem value="3">3</MenuItem>
                <MenuItem value="4">4</MenuItem>
                <MenuItem value="5">5</MenuItem>
                <MenuItem value="6">6</MenuItem>
                <MenuItem value="7">7</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Grid container item alignItems="center">
            <Grid item xs={3}>
              Sort
            </Grid>
            <Grid item container direction="row" xs={9}>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="salary"
                    checked={searchOptions.sort.salary.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="salary"
                  />
                </Grid>
                <Grid item>
                  <label for="salary">
                    <Typography>Salary</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.salary.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          salary: {
                            ...searchOptions.sort.salary,
                            desc: !searchOptions.sort.salary.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.salary.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="duration"
                    checked={searchOptions.sort.duration.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="duration"
                  />
                </Grid>
                <Grid item>
                  <label for="duration">
                    <Typography>Duration</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.duration.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          duration: {
                            ...searchOptions.sort.duration,
                            desc: !searchOptions.sort.duration.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.duration.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={4}
                justify="space-around"
                alignItems="center"
                style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}
              >
                <Grid item>
                  <Checkbox
                    name="rating"
                    checked={searchOptions.sort.rating.status}
                    onChange={(event) =>
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            status: event.target.checked,
                          },
                        },
                      })
                    }
                    id="rating"
                  />
                </Grid>
                <Grid item>
                  <label for="rating">
                    <Typography>Rating</Typography>
                  </label>
                </Grid>
                <Grid item>
                  <IconButton
                    disabled={!searchOptions.sort.rating.status}
                    onClick={() => {
                      setSearchOptions({
                        ...searchOptions,
                        sort: {
                          ...searchOptions.sort,
                          rating: {
                            ...searchOptions.sort.rating,
                            desc: !searchOptions.sort.rating.desc,
                          },
                        },
                      });
                    }}
                  >
                    {searchOptions.sort.rating.desc ? (
                      <ArrowDownwardIcon />
                    ) : (
                      <ArrowUpwardIcon />
                    )}
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="primary"
              style={{ padding: "10px 50px" }}
              onClick={() => getData()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
    
  );
};

const Home = (props) => {
  const [jobs, setJobs] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    query: "",
    jobType: {
      fullTime: false,
      partTime: false,
      wfh: false,
    },
    salary: [0, 100],
    duration: "0",
    sort: {
      salary: {
        status: false,
        desc: false,
      },
      duration: {
        status: false,
        desc: false,
      },
      rating: {
        status: false,
        desc: false,
      },
    },
  });

  const setPopup = useContext(SetPopupContext);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let searchParams = [];
    if (searchOptions.query !== "") {
      searchParams = [...searchParams, `q=${searchOptions.query}`];
    }
    if (searchOptions.jobType.fullTime) {
      searchParams = [...searchParams, `jobType=Full%20Time`];
    }
    if (searchOptions.jobType.partTime) {
      searchParams = [...searchParams, `jobType=Part%20Time`];
    }
    if (searchOptions.jobType.wfh) {
      searchParams = [...searchParams, `jobType=Work%20From%20Home`];
    }
    if (searchOptions.salary[0] != 0) {
      searchParams = [
        ...searchParams,
        `salaryMin=${searchOptions.salary[0] * 1000}`,
      ];
    }
    if (searchOptions.salary[1] != 100) {
      searchParams = [
        ...searchParams,
        `salaryMax=${searchOptions.salary[1] * 1000}`,
      ];
    }
    if (searchOptions.duration != "0") {
      searchParams = [...searchParams, `duration=${searchOptions.duration}`];
    }

    let asc = [],
      desc = [];

    Object.keys(searchOptions.sort).forEach((obj) => {
      const item = searchOptions.sort[obj];
      if (item.status) {
        if (item.desc) {
          desc = [...desc, `desc=${obj}`];
        } else {
          asc = [...asc, `asc=${obj}`];
        }
      }
    });
    searchParams = [...searchParams, ...asc, ...desc];
    const queryString = searchParams.join("&");
    console.log(queryString);
    let address = apiList.jobs;
    if (queryString !== "") {
      address = `${address}?${queryString}`;
    }

    axios
      .get(address, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setJobs(
          response.data.filter((obj) => {
            const today = new Date();
            const deadline = new Date(obj.deadline);
            return deadline > today;
          })
        );
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <>
      <Grid
        container
        item
        direction="column"
        alignItems="center"
        style={{ padding: "30px", minHeight: "93vh" }}
      >
        <Grid
          item
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Grid item xs>
            <Typography variant="h2">Jobs</Typography>
          </Grid>
          <Grid item xs>
            <TextField
              label="Search Jobs"
              value={searchOptions.query}
              onChange={(event) =>
                setSearchOptions({
                  ...searchOptions,
                  query: event.target.value,
                })
              }
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  getData();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => getData()}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ width: "500px" }}
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => setFilterOpen(true)}>
              <FilterListIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Grid
          container
          item
          xs
          direction="column"
          alignItems="stretch"
          justify="center"
        >
          {jobs.length > 0 ? (
            jobs.map((job) => {
              return <JobTile job={job} />;
            })
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              No jobs found
            </Typography>
          )}
        </Grid>
        {/* <Grid item>
          <Pagination count={10} color="primary" />
        </Grid> */}
      </Grid>
      <FilterPopup
        open={filterOpen}
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        handleClose={() => setFilterOpen(false)}
        getData={() => {
          getData();
          setFilterOpen(false);
        }}
      />
      <Footer/>
    </>
  );
};

export default Home;
