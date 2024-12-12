// googleauth.js
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Load the Service Account key file
const keyPath = path.join(__dirname, 'my-career-portal-project-4a34248ceb24.json');
const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

// Authenticate using the service account
const auth = new google.auth.JWT(
  keyFile.client_email,
  null,
  keyFile.private_key,
  ['https://www.googleapis.com/auth/calendar']
);

// Create the calendar instance
const calendar = google.calendar({ version: 'v3', auth });

module.exports = calendar;
