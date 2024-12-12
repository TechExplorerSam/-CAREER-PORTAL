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
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
        },
        msg: "Phone number is invalid!",
      },
      required:true
    },
    dob:{
      type:String,
    },
    address:{
      type:String,
      },
      email:{
        type:String,
      },
    bio: {
      type: String,
      
    },
    department:{
      type: String,
       required:true
    }
    ,
    CUTMBRANCH:{
      type:String,
      required:true
    },

    profile:{
      type: String,
      required:true
    },
    collegeaddress:{
      type:String,
      required:true
    }
  },
  
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("RecruiterInfo", schema);


/*name: data.name,
              contactNumber: data.contactNumber,

              dob:data.dob,
              gender:data.gender,
              address:data.address,
              profile:data.profile,
              department:data.department,
              CUTMBRANCH:data.CUTMBRANCH,
              collegeaddress:data.collegeaddress,
              bio: data.bio,*/