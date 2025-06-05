const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendAccessCode(email, code) {
  const mailOptions = {
    from: `"Streamline" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Streamline Access Code",
    text: `Your access code is: ${code}. It will expire in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
}

async function sendMilestoneEmail(email, count) {
  const mailOptions = {
    from: `"Streamline" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🎉 You've hit a referral milestone!",
    text: `Congratulations! You've successfully referred ${count} users. You just earned a new point!`,
  };

  return transporter.sendMail(mailOptions);
}
module.exports = { sendAccessCode, sendMilestoneEmail };
