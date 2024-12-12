const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    education: [
      {
        institutionName: {
          type: String,
          required: true,
        },
        startYear: {
          type: Number,
          min: 1930,
          max: new Date().getFullYear(),
          required: true,
          validate: Number.isInteger,
        },
        endYear: {
          type: Number,
          max: new Date().getFullYear(),
          validate: [
            { validator: Number.isInteger, msg: "Year should be an integer" },
            {
              validator: function (value) {
                return this.startYear <= value;
              },
              msg: "End year should be greater than or equal to Start year",
            },
          ],
        },
      },
    ],
    skills: [String],
    rating: {
      type: Number,
      max: 5.0,
      default: -1.0,
      validate: {
        validator: function (v) {
          return v >= -1.0 && v <= 5.0;
        },
        msg: "Invalid rating",
      },
    },
    // resume: {
    //   type: String,
    // },

     contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
        },
        msg: "Phone number is invalid!",
      },
      required:true,
    },
    address:{
      type:String,
      required:true
      
    },

    cv:{
      type:String,
      required:true
    }
    ,

  cgpa:{
     type:String,
     required:true
  },
  certifications:{
    type:Array,
    required:true 
  },

  tenthCertificate:{
    type:String,
  required:true
    
  },
  twelfthCertificate:{
    type:String,
    required:true
  },
  highestQualification:{
    type:String,
    required:true
  },
    profile: {
      type: String,
      required:true
    },
    gender:{
      type: String,
      enum: ["male", "female", "other"],
      required: true
    },
    dob:{
      type: Date,
      required:true

    },
    email:{
      type: String,
      required: true,
      unique: true,
      // validate: {
      //   validator: function (v) {
      //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      //   },
      //   msg: "Invalid email address",
      // },
    
    },
    // parsedDetails: {
    //   skills: [String],
    //   experience: String,
    //   education: String,
    // },
    //  atsScore: { type: Number, default: 0 },
    
  },
 
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("JobApplicantInfo", schema);
