const express = require("express");
const mongoose = require("mongoose");
const jwtAuth = require("../lib/jwtAuth");
const nodemailer = require('nodemailer');
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const pdfParse = require('pdf-parse');
const path = require('path');
const Application = require("../db/Application");
const Rating = require("../db/Rating");
const authKeys=require("../lib/authKeys")
require('dotenv').config();
const Subscriber = require('../db/Subscriber');
const router = express.Router();
const Post=require('../db/posts')
const Resume=require('../db/Resume')
const ParsedResume = require('../db/parsedResume'); // Adjust path to parsed resume model
const { google } = require('googleapis');
const oAuth2Client = require('../lib/googleauth');
const calendar = google.calendar({ version: 'v3' });
// To add new job
router.post("/jobs", jwtAuth, (req, res) => {
  const user = req.user;

  // Check if the user is a recruiter
  if (user.type !== "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to add jobs",
    });
    return;
  }

  // Extract data from the request body
  const data = req.body;

  // Create a new job object including the eligibility criteria
  let job = new Job({
    userId: user._id,
    title: data.title,
    maxApplicants: data.maxApplicants,
    maxPositions: data.maxPositions,
    dateOfPosting: data.dateOfPosting,
    deadline: data.deadline,
    skillsets: data.skillsets,
    jobType: data.jobType,
    duration: data.duration,
    salary: data.salary,
    experience: data.experience,
    qualification: data.qualification,
    min10thPercentage: data.min10thPercentage,
    min12thPercentage: data.min12thPercentage,
    minGraduationGPA: data.minGraduationGPA,
  });

  // Save the job to the database
  job
    .save()
    .then(() => {
      res.json({ message: "Job added successfully to the database" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Error adding job" });
    });
});

// to get all the jobs [pagination] [for recruiter personal and for everyone]
router.get("/jobs", jwtAuth, (req, res) => {
  let user = req.user;

  let findParams = {};
  let sortParams = {};

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  // to list down jobs posted by a particular recruiter
  if (user.type === "recruiter" && req.query.myjobs) {
    findParams = {
      ...findParams,
      userId: user._id,
    };
  }

  if (req.query.q) {
    findParams = {
      ...findParams,
      title: {
        $regex: new RegExp(req.query.q, "i"),
      },
    };
  }

  if (req.query.jobType) {
    let jobTypes = [];
    if (Array.isArray(req.query.jobType)) {
      jobTypes = req.query.jobType;
    } else {
      jobTypes = [req.query.jobType];
    }
    console.log(jobTypes);
    findParams = {
      ...findParams,
      jobType: {
        $in: jobTypes,
      },
    };
  }

  if (req.query.salaryMin && req.query.salaryMax) {
    findParams = {
      ...findParams,
      $and: [
        {
          salary: {
            $gte: parseInt(req.query.salaryMin),
          },
        },
        {
          salary: {
            $lte: parseInt(req.query.salaryMax),
          },
        },
      ],
    };
  } else if (req.query.salaryMin) {
    findParams = {
      ...findParams,
      salary: {
        $gte: parseInt(req.query.salaryMin),
      },
    };
  } else if (req.query.salaryMax) {
    findParams = {
      ...findParams,
      salary: {
        $lte: parseInt(req.query.salaryMax),
      },
    };
  }

  if (req.query.duration) {
    findParams = {
      ...findParams,
      duration: {
        $lt: parseInt(req.query.duration),
      },
    };
  }

  if (req.query.asc) {
    if (Array.isArray(req.query.asc)) {
      req.query.asc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: 1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.asc]: 1,
      };
    }
  }

  if (req.query.desc) {
    if (Array.isArray(req.query.desc)) {
      req.query.desc.map((key) => {
        sortParams = {
          ...sortParams,
          [key]: -1,
        };
      });
    } else {
      sortParams = {
        ...sortParams,
        [req.query.desc]: -1,
      };
    }
  }

  console.log(findParams);
  console.log(sortParams);

  // Job.find(findParams).collation({ locale: "en" }).sort(sortParams);
  // .skip(skip)
  // .limit(limit)

  let arr = [
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "userId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    { $match: findParams },
  ];

  if (Object.keys(sortParams).length > 0) {
    arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
      {
        $sort: sortParams,
      },
    ];
  }

  console.log(arr);

  Job.aggregate(arr)
    .then((posts) => {
      if (posts == null) {
        res.status(404).json({
          message: "No job found",
        });
        return;
      }
      res.json(posts);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to get info about a particular job
router.get("/jobs/:id", jwtAuth, (req, res) => {
  Job.findOne({ _id: req.params.id })
    .then((job) => {
      if (job == null) {
        res.status(400).json({
          message: "Job does not exist",
        });
        return;
      }
      res.json(job);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to update info of a particular job
router.put("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to change the job details",
    });
    return;
  }
  Job.findOne({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job == null) {
        res.status(404).json({
          message: "Job does not exist",
        });
        return;
      }
      const data = req.body;
      if (data.maxApplicants) {
        job.maxApplicants = data.maxApplicants;
      }
      if (data.maxPositions) {
        job.maxPositions = data.maxPositions;
      }
      if (data.deadline) {
        job.deadline = data.deadline;
      }
      job
        .save()
        .then(() => {
          res.json({
            message: "Job details updated successfully",
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// to delete a job
router.delete("/jobs/:id", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type != "recruiter") {
    res.status(401).json({
      message: "You don't have permissions to delete the job",
    });
    return;
  }
  Job.findOneAndDelete({
    _id: req.params.id,
    userId: user.id,
  })
    .then((job) => {
      if (job === null) {
        res.status(401).json({
          message: "You don't have permissions to delete the job",
        });
        return;
      }
      res.json({
        message: "Job deleted successfully",
      });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update user details
router.put("/user", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.contactNumber) {
          recruiter.contactNumber = data.contactNumber;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        if(data.department){
          recruiter.department=data.department;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = data.name;
        }
        if (data.education) {
          jobApplicant.education = data.education;
        }
        if (data.skills) {
          jobApplicant.skills = data.skills;
        }
        if (data.cv) {
          jobApplicant.cv = data.cv;
        }
        if (data.profile) {
          jobApplicant.profile = data.profile;
        }
        if(data.tenthCertificate){
          jobApplicant.tenthCertificate=data.tenthCertificate;
        }
        if(data.twelfthCertificate){
          jobApplicant.twelfthCertificate=data.twelfthCertificate;
        }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

router.post("/jobs/:id/applications", jwtAuth, async (req, res) => {
  const user = req.user;
  if (user.type !== "applicant") {
    return res.status(401).json({ message: "You don't have permissions to apply for a job" });
  }

  const { sop, experience, qualification, ageLimit, min10thPercentage, min12thPercentage, minGraduationGPA } = req.body;
  const jobId = req.params.id;

  try {
    // Check if user has already applied for this job
    const previousApplication = await Application.findOne({
      userId: user._id,
      jobId,
      status: { $nin: ["deleted", "accepted", "cancelled"] },
    });
    if (previousApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // Find the job and verify its existence
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job does not exist" });
    }

    // Eligibility check for required skills, GPA, etc.
    const { requirements } = job;
    if (requirements) {
      if (user.tenthPercentage < requirements.minTenthPercentage) {
        return res.status(400).json({ message: "You don't meet the 10th percentage criteria" });
      }
      if (user.twelfthPercentage < requirements.minTwelfthPercentage) {
        return res.status(400).json({ message: "You don't meet the 12th percentage criteria" });
      }
      if (user.graduationGPA < requirements.minGraduationGPA) {
        return res.status(400).json({ message: "You don't meet the graduation GPA criteria" });
      }
      if (requirements.skills && !requirements.skills.every(skill => user.skills.includes(skill))) {
        return res.status(400).json({ message: "You don't meet the required skills criteria" });
      }
    }

    // Additional eligibility checks based on new fields
    if (experience < job.minExperience) {
      return res.status(400).json({ message: "You don't meet the experience criteria" });
    }
    
    // Updated qualification check
    if (!job.qualification.includes(qualification)) {
      return res.status(400).json({ message: "You don't meet the qualification criteria" });
    }
    if (ageLimit < job.minAgeLimit || ageLimit > job.maxAgeLimit) {
      return res.status(400).json({ message: "You don't meet the age limit criteria" });
    }
    if (min10thPercentage < job.requiredMin10thPercentage) {
      return res.status(400).json({ message: "You don't meet the 10th percentage criteria" });
    }
    if (min12thPercentage < job.requiredMin12thPercentage) {
      return res.status(400).json({ message: "You don't meet the 12th percentage criteria" });
    }
    if (minGraduationGPA < job.requiredMinGraduationGPA) {
      return res.status(400).json({ message: "You don't meet the graduation GPA criteria" });
    }

    // Check if job has open slots for applications
    const activeApplicationsCount = await Application.countDocuments({
      jobId,
      status: { $nin: ["rejected", "deleted", "cancelled", "finished"] },
    });
    if (activeApplicationsCount >= job.maxApplicants) {
      return res.status(400).json({ message: "Application limit reached for this job" });
    }

    // Check if user has fewer than 10 active applications and no accepted jobs
    const userActiveApplicationsCount = await Application.countDocuments({
      userId: user._id,
      status: { $nin: ["rejected", "deleted", "cancelled", "finished"] },
    });
    const acceptedJobs = await Application.countDocuments({ userId: user._id, status: "accepted" });
    if (userActiveApplicationsCount >= 1) {
      return res.status(400).json({ message: "You have more than 1 active application. Hence, you cannot apply" });
    }
    if (acceptedJobs > 0) {
      return res.status(400).json({ message: "You already have an accepted job. Hence, you cannot apply" });
    }

    // Create and save the application if all checks are passed
    const application = new Application({
      userId: user._id,
      recruiterId: job.userId,
      jobId,
      status: "applied",
      sop,
      experience,
      qualification,
      ageLimit,
      min10thPercentage,
      min12thPercentage,
      minGraduationGPA,
    });

    await application.save();
    res.json({ message: "Job application successful" });
  } catch (err) {
    res.status(500).json({ message: "Error processing application", error: err.message });
  }
});


// recruiter/applicant gets all his applications [pagination]
router.get("/applications", jwtAuth, (req, res) => {
  const user = req.user;

  // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

  Application.aggregate([
    {
      $lookup: {
        from: "jobapplicantinfos",
        localField: "userId",
        foreignField: "userId",
        as: "jobApplicant",
      },
    },
    { $unwind: "$jobApplicant" },
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "recruiterinfos",
        localField: "recruiterId",
        foreignField: "userId",
        as: "recruiter",
      },
    },
    { $unwind: "$recruiter" },
    {
      $match: {
        [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
      },
    },
    {
      $sort: {
        dateOfApplication: -1,
      },
    },
  ])
    .then((applications) => {
      res.json(applications);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", jwtAuth, (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const status = req.body.status;

  // "applied", // when a applicant is applied
  // "shortlisted", // when a applicant is shortlisted
  // "accepted", // when a applicant is accepted
  // "rejected", // when a applicant is rejected
  // "deleted", // when any job is deleted
  // "cancelled", // an application is cancelled by its author or when other application is accepted
  // "finished", // when job is over

  if (user.type === "recruiter") {
    if (status === "accepted") {
      // get job id from application
      // get job info for maxPositions count
      // count applications that are already accepted
      // compare and if condition is satisfied, then save

      Application.findOne({
        _id: id,
        recruiterId: user._id,
      })
        .then((application) => {
          if (application === null) {
            res.status(404).json({
              message: "Application not found",
            });
            return;
          }

          Job.findOne({
            _id: application.jobId,
            userId: user._id,
          }).then((job) => {
            if (job === null) {
              res.status(404).json({
                message: "Job does not exist",
              });
              return;
            }

            Application.countDocuments({
              recruiterId: user._id,
              jobId: job._id,
              status: "accepted",
            }).then((activeApplicationCount) => {
              if (activeApplicationCount < job.maxPositions) {
                // accepted
                application.status = status;
                application.dateOfJoining = req.body.dateOfJoining;
                application
                  .save()
                  .then(() => {
                    Application.updateMany(
                      {
                        _id: {
                          $ne: application._id,
                        },
                        userId: application.userId,
                        status: {
                          $nin: [
                            "rejected",
                            "deleted",
                            "cancelled",
                            "accepted",
                            "finished",
                          ],
                        },
                      },
                      {
                        $set: {
                          status: "cancelled",
                        },
                      },
                      { multi: true }
                    )
                      .then(() => {
                        if (status === "accepted") {
                          Job.findOneAndUpdate(
                            {
                              _id: job._id,
                              userId: user._id,
                            },
                            {
                              $set: {
                                acceptedCandidates: activeApplicationCount + 1,
                              },
                            }
                          )
                            .then(() => {
                              res.json({
                                message: `Application ${status} successfully`,
                              });
                            })
                            .catch((err) => {
                              res.status(400).json(err);
                            });
                        } else {
                          res.json({
                            message: `Application ${status} successfully`,
                          });
                        }
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                res.status(400).json({
                  message: "All positions for this job are already filled",
                });
              }
            });
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      Application.findOneAndUpdate(
        {
          _id: id,
          recruiterId: user._id,
          status: {
            $nin: ["rejected", "deleted", "cancelled"],
          },
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((application) => {
          if (application === null) {
            res.status(400).json({
              message: "Application status cannot be updated",
            });
            return;
          }
          if (status === "finished") {
            res.json({
              message: `Job ${status} successfully`,
            });
          } else {
            res.json({
              message: `Application ${status} successfully`,
            });
          }
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    }
  } else {
    if (status === "cancelled") {
      console.log(id);
      console.log(user._id);
      Application.findOneAndUpdate(
        {
          _id: id,
          userId: user._id,
        },
        {
          $set: {
            status: status,
          },
        }
      )
        .then((tmp) => {
          console.log(tmp);
          res.json({
            message: `Application ${status} successfully`,
          });
        })
        .catch((err) => {
          res.status(400).json(err);
        });
    } else {
      res.status(401).json({
        message: "You don't have permissions to update job status",
      });
    }
  }
});

// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recuiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = {};

    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams },
      { $sort: sortParams },
      {
        $project: {
          _id: 1,                   // Application ID
          applicantId: "$userId",    // Applicant ID
          job: 1,                    // Job details
          jobApplicant: 1,           // Applicant details
          status: 1,                 // Status field if exists
          createdAt: 1, 
          dateOfApplication:1, 
          sop:1,            // Any other fields I want to include
        },
      }
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});

// to add or update a rating [todo: test]
router.put("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type === "recruiter") {
    // can rate applicant
    Rating.findOne({
      senderId: user._id,
      receiverId: data.applicantId,
      category: "applicant",
    })
      .then((rating) => {
        if (rating === null) {
          console.log("new rating");
          Application.countDocuments({
            userId: data.applicantId,
            recruiterId: user._id,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "applicant",
                  receiverId: data.applicantId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.applicantId),
                          category: "applicant",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        // update the user's rating
                        if (result === null) {
                          res.status(400).json({
                            message: "Error while calculating rating",
                          });
                          return;
                        }
                        const avg = result[0].average;

                        JobApplicant.findOneAndUpdate(
                          {
                            userId: data.applicantId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((applicant) => {
                            if (applicant === null) {
                              res.status(400).json({
                                message:
                                  "Error while updating applicant's average rating",
                              });
                              return;
                            }
                            res.json({
                              message: "Rating added successfully",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "Applicant didn't worked under you. Hence you cannot give a rating.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.applicantId),
                    category: "applicant",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  // update the user's rating
                  if (result === null) {
                    res.status(400).json({
                      message: "Error while calculating rating",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  JobApplicant.findOneAndUpdate(
                    {
                      userId: data.applicantId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((applicant) => {
                      if (applicant === null) {
                        res.status(400).json({
                          message:
                            "Error while updating applicant's average rating",
                        });
                        return;
                      }
                      res.json({
                        message: "Rating updated successfully",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    // applicant can rate job
    Rating.findOne({
      senderId: user._id,
      receiverId: data.jobId,
      category: "job",
    })
      .then((rating) => {
        console.log(user._id);
        console.log(data.jobId);
        console.log(rating);
        if (rating === null) {
          console.log(rating);
          Application.countDocuments({
            userId: user._id,
            jobId: data.jobId,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "job",
                  receiverId: data.jobId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.jobId),
                          category: "job",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        if (result === null) {
                          res.status(400).json({
                            message: "Error while calculating rating",
                          });
                          return;
                        }
                        const avg = result[0].average;
                        Job.findOneAndUpdate(
                          {
                            _id: data.jobId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((foundJob) => {
                            if (foundJob === null) {
                              res.status(400).json({
                                message:
                                  "Error while updating job's average rating",
                              });
                              return;
                            }
                            res.json({
                              message: "Rating added successfully",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "You haven't worked for this job. Hence you cannot give a rating.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          // update the rating
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.jobId),
                    category: "job",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  if (result === null) {
                    res.status(400).json({
                      message: "Error while calculating rating",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  console.log(avg);

                  Job.findOneAndUpdate(
                    {
                      _id: data.jobId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((foundJob) => {
                      if (foundJob === null) {
                        res.status(400).json({
                          message: "Error while updating job's average rating",
                        });
                        return;
                      }
                      res.json({
                        message: "Rating added successfully",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get personal rating
router.get("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  Rating.findOne({
    senderId: user._id,
    receiverId: req.query.id,
    category: user.type === "recruiter" ? "applicant" : "job",
  }).then((rating) => {
    if (rating === null) {
      res.json({
        rating: -1,
      });
      return;
    }
    res.json({
      rating: rating.rating,
    });
  });
});
//
// Application.findOne({
//   _id: id,
//   userId: user._id,
// })
//   .then((application) => {
//     application.status = status;
//     application
//       .save()
//       .then(() => {
//         res.json({
//           message: `Application ${status} successfully`,
//         });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   })
//   .catch((err) => {
//     res.status(400).json(err);
//   });

// router.get("/jobs", (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       res.status(401).json(info);
//       return;
//     }
//   })(req, res, next);
// });
// Create a reusable transporter object using environment variables for email credentials
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // Or any other email service provider
    auth: {
      user: process.env.EMAIL_USER, // Securely store these in environment variables
      pass: process.env.EMAIL_PASS, // Use an app-specific password for Gmail
    },
  });
};

// POST route to send an email
router.post('/send-email', (req, res) => {
  const { recipientEmail, subject, text, htmlContent } = req.body;

  // Use a pre-configured transporter for sending the email
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email from environment variables
    to: recipientEmail, // Recipient's email
    subject: subject, // Subject line
    text: text, // Plain text body
    html: htmlContent, // HTML content if any
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).send({ message: 'Error sending email', error });
    }
    console.log('Email sent successfully:', info.response);
    res.status(200).send({ message: 'Email sent successfully', info });
  });
});


// router.get("/verify-email/:token", (req, res) => {
//   const { token } = req.params;

//   // Verify the token
//   jwt.verify(token, authKeys.jwtSecretKey, (err, decoded) => {
//     if (err) {
//       return res.status(400).json({
//         message: "Invalid or expired token. Please try verifying again.",
//       });
//     }

//     // Find the user by decoded _id
//     User.findById(decoded._id)
//       .then((user) => {
//         if (!user) {
//           return res.status(404).json({ message: "User not found." });
//         }

//         // If user is already verified
//         if (user.isVerified) {
//           return res
//             .status(400)
//             .json({ message: "Email is already verified." });
//         }

//         // Mark user as verified
//         user.isVerified = true;
//         user
//           .save()
//           .then(() => {
//             res.json({
//               message: "Email verified successfully!",
//             });
//           })
//           .catch((err) => {
//             res.status(500).json({ message: "Error verifying email", err });
//           });
//       })
//       .catch((err) => {
//         res.status(500).json({ message: "Error verifying user", err });
//       });
//   });
// });

// Post route to subscribe user
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'Email already subscribed.' });
    }

    // Create new subscriber
    const subscriber = new Subscriber({ email });
    await subscriber.save();
    
    

    // Send confirmation email (using nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,  // use your email
        pass: process.env.EMAIL_PASS,   // use your email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Newsletter Subscription Confirmation',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #007bff; padding: 20px; text-align: center; color: white;">
          <h1>Thank you for subscribing!</h1>
        </div>
  
        <div style="padding: 20px;">
          <h2 style="color: #007bff;">Hello,</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Welcome to our newsletter! We're excited to have you on board.
            Get ready to receive the latest news, updates, and exclusive content
            straight to your inbox.
          </p>
  
          <p style="font-size: 16px; line-height: 1.6;">
            Feel free to reply to this email if you have any questions or suggestions.
          </p>
  
          <div style="background-color: #f9f9f9; padding: 10px; margin-top: 20px;">
            <h3 style="color: #007bff;">Why Subscribe?</h3>
            <ul style="font-size: 16px;">
              <li>Get the latest updates on our products and services.</li>
              <li>Exclusive offers just for you!</li>
              <li>Be part of our growing community.</li>
            </ul>
          </div>
  
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://cutm.ac.in/" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">Visit Our Website</a>
          </div>
  
          <p style="font-size: 14px; color: #777; text-align: center; margin-top: 40px;">
            If you no longer wish to receive emails from us, you can <a href="http:localhost:4444/unsubscribe?email=${email}" style="color: #007bff;">unsubscribe</a>.
          </p>
        </div>
      </div>
    `,
  
      
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('Error sending confirmation email:', error);
      }
      console.log('Confirmation email sent:', info.response);
    });

    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: 'Failed to subscribe. Try again later.' });
  }
});
// Route to create or update a resume
router.post('/resumebuilder', async (req, res) => {
  const { name, email, phone, education, experience, skills } = req.body;
  education.forEach(edu => {
    console.log(`Degree: ${edu.degree}, Institution: ${edu.institution}`);
  });
  experience.forEach(exp => {
    console.log(`Job Title: ${exp.jobTitle}, Company: ${exp.company}`);
  });

  if (!email || !name) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    // Find an existing resume by email (email is usually unique for users)
    let resume = await Resume.findOne({ email });

    if (resume) {
      // Update existing resume
      resume.name = name;
      resume.phone = phone;
      resume.education = education;
      resume.experience = experience;
      resume.skills = skills;

      await resume.save();
      return res.status(200).json({ message: 'Resume updated successfully', resume });
    } else {
      // Create new resume
      resume = new Resume({
        name,
        email,
        phone,
         education,
         experience,
        skills,
      });

      await resume.save();
      return res.status(201).json({ message: 'Resume created successfully', resume });
    }
  } catch (error) {
    // Catch and send error response
    return res.status(500).json({ message: 'Error saving resume', error: error.message });
  }
});


// Route to get a user's resume
router.get('/resumebuildereview/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const resume = await Resume.findOne({ email });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resume', error });
  }
});

// Route to parse a specific applicant’s resume for a specific job
// Route to parse resume and calculate ATS score based on applicant email and jobId
router.post("/parse-resume/:applicantId/:jobId", jwtAuth, async (req, res) => {
  const { applicantId, jobId } = req.params; // Get applicantId and jobId from request parameters
  const user = req.user;
   console.log(applicantId)
  // Check if the user is a recruiter
  if (user.type !== "recruiter") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Find the applicant information by applicantId
    const applicant = await JobApplicant.findById(applicantId);
     // Fetch applicant using their ID
     
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }

    // Find the application by applicant's userId and jobId
    const application = await Application.findOne({ userId: applicantId, jobId }); // Use userId instead of email
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Simulate an ATS score
    const atsScore = Math.floor(Math.random() * 100);

    const responseData = {
      parsedData: {
        name: applicant.name,
        email: applicant.email,
        resume: applicant.resumeText,
      },
      score: atsScore,
    };

    res.json(responseData); // Return the parsed data and ATS score
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Error calculating ATS score", error: err }); // Send error response
  }
});


// Route to fetch all parsed resumes
router.get('/parsed-resume-candidates', jwtAuth, async (req, res) => {
  const { jobId, applicantId } = req.query;

  try {
    // Set up the filter object based on query parameters
    const filter = {};
    if (jobId) filter.jobId = jobId;
    if (applicantId) filter.userId = applicantId;

    // Fetch parsed resumes based on filters and populate user details
    const parsedResumes = await ParsedResume.find(filter).populate('userId', 'name email');

    // Calculate ATS score for each resume if not already included
    const resumesWithScores = await Promise.all(
      parsedResumes.map(async (parsedResume) => {
        if (!parsedResume.atsScore) {
          // Fetch job details for ATS score calculation
          const job = await Job.findById(parsedResume.jobId);
          const atsScore = calculateATSScore(parsedResume.content, job.requirements);
          parsedResume.atsScore = atsScore;
          await parsedResume.save(); // Save ATS score if updated
        }
        return parsedResume;
      })
    );

    res.json(resumesWithScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching parsed resumes' });
  }
});
// Route to initiate Google OAuth
// router.get('/auth/google', (req, res) => {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: ['https://www.googleapis.com/auth/calendar.events'],
//   });
//   res.redirect(authUrl);
// });
// // Callback Route
// router.get('/auth/google/callback', async (req, res) => {
//   const { code } = req.query;
//   const { tokens } = await oauth2Client.getToken(code);
//   oauth2Client.setCredentials(tokens);
//   res.redirect('http://localhost:3000/ScheduleInterview');
// });
// // Schedule interview
// // Schedule Interview Route
// router.post('/schedule-interview', async (req, res) => {
//   const { summary, description, location, startTime, endTime } = req.headers;

//   try {
//     const event = {
//       summary,
//       description,
//       location,
//       start: { dateTime: startTime },
//       end: { dateTime: endTime },
//     };

//     const response = await calendar.events.insert({
//       calendarId: 'primary',
//       resource: event,
//     });

//     res.status(200).send(response.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Failed to schedule interview');
//   }
// });

/// Endpoint to fetch all jobs
router.get("/jobslist", async (req, res) => {
  console.log("Received request to fetch all jobs"); // Log request start
  
  try {
    // Fetch all jobs from the database
    const jobs = await Job.find();
    console.log("Fetched jobs from database:", jobs); // Log the retrieved data
    
    // Check if jobs are found
    if (jobs.length === 0) {
      console.warn("No jobs found in the database");
    }

    res.json(jobs); // Send the jobs as a JSON response
  } catch (error) {
    console.error("Error fetching jobs:", error.message); // Log detailed error message
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }

  console.log("Request to fetch jobs completed"); // Log request completion
});




module.exports = router;