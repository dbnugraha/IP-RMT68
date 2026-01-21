const { sendEmail } = require("../helpers/nodemailer");

module.exports = async () => {
  try {
    await sendEmail(
      "test@example.com",
      "Reports Job Initialized",
      "<h1>The reports job has been initialized successfully.</h1>",
    );
    return;
  } catch (error) {
    console.error("Error initializing reports job:", error);
  }
};
