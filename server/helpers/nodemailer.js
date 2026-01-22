const nodemailer = require("nodemailer");

// Create a transporter using your email service configuration

const gmailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_EMAIL,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

const testAcount = async () => {
  const testAccount = await nodemailer.createTestAccount();

  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

module.exports = {
  async sendEmail(to, subject, html) {
    const mailOptions = {
      from: `"No-Reply TataWarung" <${process.env.GOOGLE_EMAIL}>`,
      to,
      subject,
      html,
    };
    try {
      let info;
      info = await gmailTransporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};
