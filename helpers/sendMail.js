const nodemailer = require('nodemailer');

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

const transportConfig = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
};

const sendMail = async ({ to, subject, html, text = '' }) => {
  const transport = nodemailer.createTransport(transportConfig);
  const email = {
    from: EMAIL_USER,
    to,
    subject,
    html,
    text,
  };
  await transport.sendMail(email);
};

module.exports = sendMail;
