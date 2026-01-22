const cron = require("node-cron");
const {
  generateAndSendInsights,
  testEmailSending,
  scheduleDailyInsights,
  scheduleCleanupJob,
} = require("./aiInsights");

module.exports = async () => {
  console.log("Jobs initialized");

  //run every 30 seconds
  //   let counter = 0;
  //   cron.schedule("*/30 * * * * *", async () => {
  //     console.log(`Cron job executed ${counter} times`);
  //     counter++;
  //   });

  scheduleDailyInsights(false, false); // Do not skip any days
  scheduleCleanupJob();

  // await testEmailSending();
};
