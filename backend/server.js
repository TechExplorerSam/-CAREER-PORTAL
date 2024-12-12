const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");
const cron = require('node-cron');
const Post=require('./db/posts');
const { google } = require('googleapis');
const sendNewsletterLatest=require('./db/Newsletter/Newsletter')
const calendar = require('./lib/googleauth');
const Application = require("./db/Application");
const JobApplicant = require("./db/JobApplicant");
const User = require("./db/User");
const nodemailer = require('nodemailer');  // Import Nodemailer
require('dotenv').config();
const path = require('path');

// MongoDB
mongoose
  .connect("mongodb://localhost:27017/jobPortal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/cv")) {
  fs.mkdirSync("./public/cv");
}

if (!fs.existsSync("./public/tenthCertificate")) {
  fs.mkdirSync("./public/tenthCertificate");
}

if (!fs.existsSync("./public/twelfthCertificate")) {
  fs.mkdirSync("./public/twelfthCertificate");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const port = 4444;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

// Set up the Nodemailer transporter (using Gmail as an example)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Or use your preferred email service
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,   // Your email password (or app-specific password if 2FA is enabled)
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL,  // Sender address
    to:to,                            // Recipient address
    subject:subject,                       // Subject line
    text:text,                          // Plain text body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;  // Rethrow the error for further handling
  }
};

app.post('/schedule-interview/:jobId', async (req, res) => {
  const { jobId } = req.params; // Retrieve jobId from URL parameters
  const { summary, description, location, startTime, endTime } = req.body;

  // Input validation
  if (!summary || !location || !startTime || !endTime || !jobId) {
    console.error('Missing required fields in the request body:', {
      summary,
      location,
      startTime,
      endTime,
      jobId,
    });
    return res.status(400).json({ message: 'All fields are required to schedule the interview.' });
  }

  try {
    console.log('Attempting to schedule interview for jobId:', jobId);

    // Define Google Calendar event details
    const event = {
      summary,
      location,
      description,
      start: { dateTime: startTime, timeZone: 'America/Los_Angeles' },
      end: { dateTime: endTime, timeZone: 'America/Los_Angeles' },
    };

    // Log event details before inserting into Google Calendar
    console.log('Google Calendar event details:', event);

    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: '5f07090b1586ce462b6fe00692aa0c78f340172cc7e55da03e73fd973c36a708@group.calendar.google.com', // Replace with your actual calendar ID
      resource: event,
    });

    console.log('Event successfully added to Google Calendar:', response);

    // Fetch all applications for the specified jobId
    console.log('Fetching applications for jobId:', jobId);
    const applications = await Application.find({ jobId });
    if (applications.length === 0) {
      console.error('No applicants found for this job:', jobId);
      return res.status(404).json({ message: 'No applicants found for this job.' });
    }
    console.log(`Found ${applications.length} applications for jobId:`, jobId);

    // Loop through each application and fetch the user by userId
    for (const application of applications) {
      const userId = application.userId;
      console.log('Fetching user details for userId:', userId);

      try {
        // Fetch the JobApplicant using userId
        const applicant = await User.findOne({ _id: userId });
        const applicant_name=await JobApplicant.findOne({ _id: userId })

        if (!applicant) {
          console.error(`No applicant found for userId: ${userId}`);
          continue; // Skip to the next applicant if the user is not found
        }

        console.log('Applicant found:', applicant);

        // Define email content
        const emailBody = `
          Hello ${applicant_name.name},

          You have been shortlisted for an interview for the job: ${summary}

          Interview Details:
          Job Name: ${summary}
          Location: ${location}
          Description: ${description}
          Start Time: ${new Date(startTime).toLocaleString()}
          End Time: ${new Date(endTime).toLocaleString()}

          Best of luck!

          Regards,
          The Hiring Team
        `;

        // Send email to the applicant using the sendEmail function
        console.log('Sending interview email to:', applicant.email);
        await sendEmail({
          to: applicant.email,
          subject: 'Interview Scheduled',
          text: emailBody,
        });

        console.log('Interview email sent to:', applicant.email);
      } catch (error) {
        console.error(`Error fetching user or sending email for userId ${userId}:`, error);
      }
    }

    // Success response
    console.log('Interview scheduled and emails sent to all applicants successfully.');
    res.send('Interview scheduled successfully and emails sent to all applicants.');
  } catch (error) {
    console.error('Error scheduling interview and sending emails:', error);
    res.status(500).send('Error scheduling interview and sending emails.');
  }
});

// app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});
// Schedule the newsletter to be sent every Monday at 8 AM
cron.schedule('0 8 * * MON', async () => {
  try {
    const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(5);
    await sendNewsletterLatest(latestPosts);
    console.log('Weekly newsletter sent');
  } catch (error) {
    console.log('Error in scheduled newsletter:', error);
  }
});
