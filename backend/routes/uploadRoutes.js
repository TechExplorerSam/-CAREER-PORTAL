const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("util");
const { pipeline } = require('stream/promises');
const Post=require('../db/posts')
const router = express.Router();
const sendNewsletterLatest= require('../db/Newsletter/Newsletter');
const parseResume = require('../Resume parser/Resumeparser');

async function getMulter() {
  const multer = await import('multer');
  return multer.default;
}

// Helper function to handle file upload
const handleFileUpload = async (req, res, validExtensions, folderName) => {
  const multer = await getMulter();
  const upload = multer().single("file");

  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "Error while uploading",
      });
    }

    const { file } = req;
    if (!validExtensions.includes(file.detectedFileExtension)) {
      return res.status(400).json({
        message: "Invalid format",
      });
    }

    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    try {
      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../public/${folderName}/${filename}`)
      );

       // Parse the resume after successful upload
      //  const resumePath = `${__dirname}/../public/${folderName}/${filename}`;
      //  const parsedData = await parseResume(resumePath);
 
      res.send({
        message: "File uploaded successfully",
        url: `/host/${folderName}/${filename}`,
        // parsedData, // Return the parsed resume data
      });
    } catch (err) {
      res.status(400).json({
        message: "Error while uploading",
      });
    }
  });
};
const PostsFileUpload = async (req, res, validExtensions, folderName) => {
  const multer = await getMulter();
  const upload = multer().single("file");

  // Handle the file upload
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: "Error while uploading file" });
    }

    const { file } = req;
    const { title, content, type } = req.body;

    // Check if the file format is valid
    if (!validExtensions.includes(file.detectedFileExtension)) {
      return res.status(400).json({ message: "Invalid file format" });
    }

    // Generate a unique filename
    const filename = `${uuidv4()}${file.detectedFileExtension}`;

    try {
      // Save the file to the public folder
      await pipeline(
        file.stream,
        fs.createWriteStream(`${__dirname}/../public/${folderName}/${filename}`)
      );

      // Construct the file URL
      const fileUrl = `/host/${folderName}/${filename}`;

      // Now, create the post in the database
      const newPost = new Post({
        title,
        type,
        content,
        fileUrl, // Store the file URL in the post
        createdAt: new Date(),
      });

      // Save the post to the database
      await newPost.save();

      // Send response after both file upload and post creation are done
      res.status(201).json({
        message: "Post created successfully",
        post: newPost,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error creating the post" });
    }
  });
};


// Resume Upload
// router.post("/resume", async (req, res) => {
//   await handleFileUpload(req, res, [".pdf"], "resume");
// });

// Profile Image Upload
router.post("/profile", async (req, res) => {
  await handleFileUpload(req, res, [".jpg", ".png"], "profile");
});

// CV Upload
router.post("/cv", async (req, res) => {
  await handleFileUpload(req, res, [".pdf"], "cv");
  
});

// 10th Certificate Upload
router.post("/tenthCertificate", async (req, res) => {
  await handleFileUpload(req, res, [".pdf"], "tenthCertificate");
});

// 12th Certificate Upload
router.post("/twelfthCertificate", async (req, res) => {
  await handleFileUpload(req, res, [".pdf"], "twelfthCertificate");
});

// Cover Letter Upload
// router.post("/coverLetter", async (req, res) => {
//   await handleFileUpload(req, res, [".pdf"], "coverLetters");
// });

router.post("/posts", async (req, res) => {
     await PostsFileUpload(req, res,[".jpg", ".png", ".pdf"], "uploads");
   });

   router.get('/get-posts', async (req, res) => {
    try {
      const posts = await Post.find(); // Fetch all posts from the database
      res.json(posts); // Return posts in JSON format
      const latestPosts = await Post.find().sort({ createdAt: -1 }).limit(5);
      await sendNewsletterLatest(latestPosts); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
    }
  });
  router.get('/unsubscribe', async (req, res) => {
    const email = req.query.email;
    await Subscriber.deleteOne({ email });
    res.send('You have successfully unsubscribed.');
  });
  
module.exports = router;
