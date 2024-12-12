const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const apiRoutes=require("./apiRoutes")
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const router = express.Router();

router.post("/signup", (req, res) => {
  const data = req.body;
  let user = new User({
    email: data.email,
    password: data.password,
    type: data.type,
  });

  user
    .save()
    .then(() => {
      const userDetails =
        user.type == "recruiter"
          ? new Recruiter({
              userId: user._id,
              name: data.name,
              email:data.email,
              contactNumber: data.contactNumber,
               email:data.email,
              dob:data.dob,
              gender:data.gender,
              address:data.address,
              profile:data.profile,
              department:data.department,
              CUTMBRANCH:data.CUTMBRANCH,
              collegeaddress:data.collegeaddress,
              bio: data.bio,
            })
          : new JobApplicant({
              userId: user._id,
              name: data.name,
              email:data.email,
              education: data.education,
              skills: data.skills,
              certifications:data.certifications,
              rating: data.rating,
              cv:data.cv,
              contactNumber:data.contactNumber,
              cgpa:data.cgpa,
              dob:data.dob,
              gender:data.gender,
              address:data.address,
              institutename:data.institutename,
              tenthCertificate:data.tenthCertificate,
              twelfthCertificate:data.twelfthCertificate,
              highestQualification:data.highestQualification,
              profile: data.profile,
            });

      userDetails
        .save()
        .then(() => {

         
      
      
          // Token
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            type: user.type,
          });
          
            })
        
        .catch((err) => {
          user
            .delete()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
              res.status(500).json({ message: "Error registering user", error: err });
            });
          err;
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
    
});

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});

module.exports = router;
