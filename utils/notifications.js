const twilio = require('twilio');
const nodemailer = require('nodemailer');

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendSMS(to, message) {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
    console.log('SMS sent successfully');
  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
}

async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

module.exports = { sendSMS, sendEmail };
