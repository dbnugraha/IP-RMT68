const cron = require("node-cron");
const reportsJob = require("./reportsJob");

module.exports = async () => {
  console.log("Jobs initialized");

  //run every 30 seconds
  let counter = 0;
  cron.schedule("*/30 * * * * *", async () => {
    console.log(`Cron job executed ${counter} times`);
    counter++;
  });

  await reportsJob();
};
