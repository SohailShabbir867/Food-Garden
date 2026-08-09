// backend/utils/sendEmail.js
// Wraps the Nodemailer transporter with ready-made, branded email templates.

const transporter = require("../config/nodemailer");

const BRAND_COLOR = "#e21b70";
const BRAND_DARK = "#3A0519";

// Shared email shell so every email looks consistent.
const emailShell = (title, bodyHtml) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff;">
    <div style="background: ${BRAND_DARK}; padding: 24px; text-align: center;">
      <h1 style="color: ${BRAND_COLOR}; margin: 0; font-size: 22px; letter-spacing: 0.5px;">Food Garden 🍔</h1>
    </div>
    <div style="padding: 32px 28px; color: #333;">
      <h2 style="color: ${BRAND_DARK}; font-size: 18px; margin-top: 0;">${title}</h2>
      ${bodyHtml}
      <p style="font-size: 12px; color: #999; margin-top: 32px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
    <div style="background: #f7f7f7; padding: 16px; text-align: center; font-size: 12px; color: #aaa;">
      &copy; ${new Date().getFullYear()} Food Garden. All rights reserved.
    </div>
  </div>
`;

const otpBlock = (otp, expiryMinutes) => `
  <p style="font-size: 14px; line-height: 1.6;">Use the code below to continue. This code expires in <strong>${expiryMinutes} minutes</strong>.</p>
  <div style="background: #fdf0f5; border: 1px dashed ${BRAND_COLOR}; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
    <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: ${BRAND_DARK};">${otp}</span>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  const fromName = process.env.EMAIL_FROM_NAME || "Food Garden";
  await transporter.sendMail({
    from: `"${fromName}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ── Signup verification OTP ──────────────────────────────────────
const sendSignupOtpEmail = async (to, name, otp) => {
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
  const html = emailShell(
    `Hi ${name}, verify your email`,
    `
      <p style="font-size: 14px; line-height: 1.6;">Welcome to Food Garden! Enter this code to verify your account and start ordering.</p>
      ${otpBlock(otp, expiryMinutes)}
    `
  );
  await sendEmail({ to, subject: "Verify your Food Garden account", html });
};

// ── Forgot password OTP ──────────────────────────────────────────
const sendPasswordResetOtpEmail = async (to, name, otp) => {
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
  const html = emailShell(
    `Hi ${name}, reset your password`,
    `
      <p style="font-size: 14px; line-height: 1.6;">We received a request to reset your password. Use the code below to continue.</p>
      ${otpBlock(otp, expiryMinutes)}
    `
  );
  await sendEmail({ to, subject: "Reset your Food Garden password", html });
};

module.exports = {
  sendEmail,
  sendSignupOtpEmail,
  sendPasswordResetOtpEmail,
};
