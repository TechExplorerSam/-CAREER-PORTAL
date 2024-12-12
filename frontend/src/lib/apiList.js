export const server = "http://localhost:4444";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  // uploadResume: `${server}/upload/resume`,
  uploadProfileImage: `${server}/upload/profile`,
  uploadCV: `${server}/upload/cv`,
  uploadTenthCertificate: `${server}/upload/tenthCertificate`,
  uploadTwelfthCertificate: `${server}/upload/twelfthCertificate`,
  // uploadCoverLetter: `${server}/upload/coverletter`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  // filterCandidates:`${server}/api/filterCandidates`,
  applicants: `${server}/api/applicants`,
  email:`${server}/api/send-email`,
  subscribe:`${server}/api/subscribe`,
  post:`${server}/upload/posts`,
  getposts:`${server}/upload/get-posts`,
  resumebuilder:`${server}/api/resumebuilder`,
  resumbebuilderviewreume:`${server}/api/resumebuildereview`,
  parsedResume:`${server}/api/parse-resume`,
  scheduleInterview:`${server}/schedule-interview`
};

export default apiList;
