import { createContext, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Grid, makeStyles } from "@material-ui/core";
import Welcome, { ErrorPage } from "./component/Welcome";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import Logout from "./component/Logout";
import Signup from "./component/Signup";
import Home from "./component/Home";
import Applications from "./component/Applications";
import Profile from "./component/Profile";
import CreateJobs from "./component/recruiter/CreateJobs";
import MyJobs from "./component/recruiter/MyJobs";
import JobApplications from "./component/recruiter/JobApplications";
import AcceptedApplicants from "./component/recruiter/AcceptedApplicants";
import RecruiterProfile from "./component/recruiter/Profile";
import MessagePopup from "./lib/MessagePopup";
import isAuth, { userType } from "./lib/isAuth";
import EmailForm from "./component/recruiter/AcceptedApplicantSendEmail";
import { NotAuthorized } from "./component/Welcome";
import CandidateDetailsPage from "./component/recruiter/CandidateDetails";
import PostForm from "./component/recruiter/postform";
import PostList from "./component/recruiter/postslist";
import ResumeForm from "./component/Resumeform";
import ResumePreview from "./component/Resumepreview";
import ParseResumesFromUsersPage from "./component/recruiter/parsedResume";
import ScheduleInterview from "./component/recruiter/ScheduleInterview";
import JobList from "./component/Jobs";

const useStyles = makeStyles((theme) => ({
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "98vh",
    paddingTop: "64px",
    boxSizing: "border-box",
    width: "100%",
  },
}));

export const SetPopupContext = createContext();

function App() {
  const classes = useStyles();
  const [popup, setPopup] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <BrowserRouter>
      <SetPopupContext.Provider value={setPopup}>
        <Grid container direction="column">
          <Grid item xs>
            <Navbar />
          </Grid>
          <Grid item className={classes.body}>
            <Switch>
              <Route exact path="/">
                <Welcome />
                
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/signup">
                <Signup />
              </Route>
              <Route exact path="/logout">
                <Logout />
              </Route>
              <Route exact path="/home">
                <Home />
              </Route>
              <Route exact path="/applications">
                <Applications />
              </Route>
              <Route exact path="/profile">
                {userType() === "recruiter" ? (
                  <RecruiterProfile />
                ) : (
                  <Profile />
                )}
              </Route>
              <Route exact path="/addjob">
                <CreateJobs />
              </Route>
              <Route exact path="/myjobs">
                <MyJobs />
              </Route>
              <Route exact path="/job/applications/:jobId">
                <JobApplications />
              </Route>
               <Route exact path="/parsed-candidates">
                <ParseResumesFromUsersPage/>
               </Route>
              <Route exact path="/postform">
                <PostForm />
              </Route>
              <Route exact path="/get-post">
                <PostList/>
              </Route>
              <Route exact path="/resumebuilder">
                <ResumeForm />
              </Route>
              <Route exact path="/jobs">
                <JobList/>
              </Route>
             
              <Route exact path="/ScheduleInterview">
                  <ScheduleInterview/>
              </Route>
              <Route exact path="/resumebuilder/view-resume/:email">
                <ResumePreview/>
              </Route>
              <Route exact path="/employees">
                <AcceptedApplicants />
              </Route>
             
              <Route exact path="/send-email">
              <EmailForm/>
              
              </Route> 
              <Route exact path="/candidate-details/:candidatename" >
                <CandidateDetailsPage/>
              </Route>
              
              <Route exact path="/not-authorized">
                <NotAuthorized/>
              </Route>
              <Route>
                <ErrorPage />
              </Route>
             
            </Switch>
          </Grid>
        </Grid>
        <MessagePopup
          open={popup.open}
          setOpen={(status) =>
            setPopup({
              ...popup,
              open: status,
            })
          }
          severity={popup.severity}
          message={popup.message}
        />
      </SetPopupContext.Provider>
    </BrowserRouter>
  );
}

export default App;
