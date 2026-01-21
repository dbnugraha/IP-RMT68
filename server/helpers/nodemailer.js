const nodemailer = require("nodemailer");

// Create a transporter using your email service configuration
const gmailTransporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
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
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };
    try {
      let info;
      const testTransporter = await testAcount();
      if (process.env.NODE_ENV === "production") {
        info = await gmailTransporter.sendMail(mailOptions);
      } else {
        info = await testTransporter.sendMail(mailOptions);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      }
      return info;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },
};
