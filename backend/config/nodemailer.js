// backend/config/nodemailer.js
// Gmail SMTP transporter using an App Password (NOT your normal Gmail password).
//
// Setup:
//   1. Enable 2-Step Verification on the sending Gmail account.
//   2. Generate an App Password at https://myaccount.google.com/apppasswords
//   3. Put the Gmail address in EMAIL_USER and the 16-char app password
//      in EMAIL_APP_PASSWORD inside backend/.env

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Fail loudly at startup if the Gmail credentials are wrong/missing,
// instead of failing silently the first time someone signs up.
transporter.verify((error) => {
  if (error) {
    console.error("❌ Nodemailer/Gmail connection failed:", error.message);
    console.error("   Check EMAIL_USER and EMAIL_APP_PASSWORD in backend/.env");
  } else {
    console.log("✅ Nodemailer is ready to send emails via Gmail");
  }
});

module.exports = transporter;
