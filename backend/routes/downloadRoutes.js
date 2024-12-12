const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/cv/:file", (req, res) => {
  const address = path.join(__dirname, `../public/cv/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});

router.get("/tenthCertificate/:file", (req, res) => {
  const address = path.join(__dirname, `../public/tenthCertificate/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});

router.get("/twelfthCertificate/:file", (req, res) => {
  const address = path.join(__dirname, `../public/twelfthCertificate/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});


router.get("/profile/:file", (req, res) => {
  const address = path.join(__dirname, `../public/profile/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address);
  });
});


router.get("/uploads/:file", (req, res) => {
  const address = path.join(__dirname, `../public/uploads/${req.params.file}`);
  fs.access(address, fs.F_OK, (err) => {
    if (err) {
      res.status(404).json({
        message: "File not found",
      });
      return;
    }
    res.sendFile(address); // Sends the file back to the frontend
  });
});

// router.get("/uploads/:file", (req, res) => {
//   const address = path.join(__dirname, `../public/uploads/${req.params.file}`);
//   fs.access(address, fs.F_OK, (err) => {
//     if (err) {
//       res.status(404).json({
//         message: "File not found",
//       });
//       return;
//     }
//     res.sendFile(address);
//   });
// });

 module.exports = router;
