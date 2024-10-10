const nodemailer = require('nodemailer');
require('dotenv').config();  // Load environment variables

const sendEmail = async (fromEmail, smtpUser, smtpPass, to, subject, text, attachments = []) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.ap-south-1.amazonaws.com',
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,  // SMTP user from .env file
        pass: smtpPass,  // SMTP password from .env file
      },
    });

    await transporter.sendMail({
      from: fromEmail,  // Sender email address
      to,               // Receiver email address
      subject,          // Email subject
      text,   
      attachments       // Attachments (optional)
      // Email body
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.log('Error sending email:', error);
  }
};

module.exports = sendEmail;
