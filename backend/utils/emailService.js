const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@launchpad.com';

/**
 * Send an email. Silently fails if SMTP is not configured.
 */
async function sendMail(to, subject, html) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email] SMTP not configured. Would send to ${to}: ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({ from, to, subject, html });
    console.log(`[Email] Sent to ${to}: ${subject}`);
  } catch (err) {
    console.error(`[Email] Failed to send to ${to}:`, err.message);
  }
}

exports.sendConnectionRequestEmail = (to, startupName, supporterName) => {
  return sendMail(
    to,
    `New Connection Request on LaunchPad`,
    `<h2>New Connection Request</h2>
     <p><strong>${supporterName}</strong> has expressed interest in <strong>${startupName}</strong>.</p>
     <p>Log in to your LaunchPad dashboard to review the request.</p>`
  );
};

exports.sendConnectionAcceptedEmail = (to, startupName, supporterName) => {
  return sendMail(
    to,
    `Connection Accepted on LaunchPad`,
    `<h2>Connection Accepted!</h2>
     <p>Your connection between <strong>${supporterName}</strong> and <strong>${startupName}</strong> has been accepted.</p>
     <p>You can now chat directly on LaunchPad.</p>`
  );
};

exports.sendConnectionRejectedEmail = (to, startupName, supporterName) => {
  return sendMail(
    to,
    `Connection Update on LaunchPad`,
    `<h2>Connection Update</h2>
     <p>The connection request between <strong>${supporterName}</strong> and <strong>${startupName}</strong> was not accepted at this time.</p>`
  );
};

exports.sendNewMessageEmail = (to, senderName, preview) => {
  return sendMail(
    to,
    `New Message on LaunchPad`,
    `<h2>New Message</h2>
     <p><strong>${senderName}</strong> sent you a message:</p>
     <blockquote>${preview.substring(0, 200)}</blockquote>
     <p>Log in to LaunchPad to reply.</p>`
  );
};

exports.sendPasswordResetEmail = (to, resetUrl) => {
  return sendMail(
    to,
    `Password Reset – LaunchPad`,
    `<h2>Password Reset Request</h2>
     <p>Click the link below to reset your password. This link expires in 1 hour.</p>
     <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
     <p>If you did not request this, please ignore this email.</p>`
  );
};
