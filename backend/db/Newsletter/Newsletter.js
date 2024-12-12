// utils/sendNewsletter.js
const nodemailer = require('nodemailer');
const Subscriber =require('../Subscriber')
require('dotenv').config();

const sendNewsletter = async (posts) => {
  try {
    const subscribers = await Subscriber.find();
    const emailList = subscribers.map(sub => sub.email);

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or any other email service provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = posts.map(post => `
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      ${post.fileUrl ? `<a href="${post.fileUrl}">View File</a>` : ''}
    `).join('<hr>');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailList,
      subject: 'Latest Posts Newsletter',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log('Newsletter sent successfully!');
  } catch (error) {
    console.log('Error sending newsletter:', error);
  }
};

module.exports = sendNewsletter;
