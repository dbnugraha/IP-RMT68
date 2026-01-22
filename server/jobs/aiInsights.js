// server/jobs/aiInsights.js
const cron = require("node-cron");
const aiInsightsHelper = require("../helpers/aiInsights");

/**
 * Schedule daily AI insights generation
 */
const scheduleDailyInsights = () => {
  // Schedule: Every day at 6:00 AM (Asia/Jakarta timezone)
  cron.schedule(
    "0 6 * * *",
    async () => {
      console.log("\n🔔 Daily AI Insights Job Triggered");
      try {
        await aiInsightsHelper.generateInsightsForAllBusinesses("daily");
      } catch (error) {
        console.error("❌ Daily AI insights job failed:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );

  console.log("✅ Daily AI Insights job scheduled (every day at 6:00 AM Asia/Jakarta)");
};

/**
 * Schedule weekly AI insights generation
 */
const scheduleWeeklyInsights = () => {
  // Schedule: Every Monday at 7:00 AM
  cron.schedule(
    "0 7 * * 1",
    async () => {
      console.log("\n🔔 Weekly AI Insights Job Triggered");
      try {
        await aiInsightsHelper.generateInsightsForAllBusinesses("weekly");
      } catch (error) {
        console.error("❌ Weekly AI insights job failed:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );

  console.log("✅ Weekly AI Insights job scheduled (every Monday at 7:00 AM Asia/Jakarta)");
};

/**
 * Schedule monthly AI insights generation
 */
const scheduleMonthlyInsights = () => {
  // Schedule: First day of every month at 8:00 AM
  cron.schedule(
    "0 8 1 * *",
    async () => {
      console.log("\n🔔 Monthly AI Insights Job Triggered");
      try {
        await aiInsightsHelper.generateInsightsForAllBusinesses("monthly");
      } catch (error) {
        console.error("❌ Monthly AI insights job failed:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );

  console.log("✅ Monthly AI Insights job scheduled (1st day of month at 8:00 AM Asia/Jakarta)");
};

/**
 * Schedule cleanup of old insights
 */
const scheduleCleanupJob = () => {
  // Schedule: Every Sunday at 3:00 AM
  cron.schedule(
    "0 3 * * 0",
    async () => {
      console.log("\n🔔 Insights Cleanup Job Triggered");
      try {
        await aiInsightsHelper.cleanupOldInsights(90); // Keep last 90 days
      } catch (error) {
        console.error("❌ Cleanup job failed:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );

  console.log("✅ Cleanup job scheduled (every Sunday at 3:00 AM Asia/Jakarta)");
};

/**
 * Initialize all AI insights cron jobs
 */
const initializeAIInsightsJobs = () => {
  console.log("\n" + "=".repeat(50));
  console.log("🚀 Initializing AI Insights Cron Jobs");
  console.log("=".repeat(50));

  scheduleDailyInsights();
  scheduleWeeklyInsights();
  scheduleMonthlyInsights();
  scheduleCleanupJob();

  console.log("=".repeat(50) + "\n");
};

module.exports = {
  initializeAIInsightsJobs,
  scheduleDailyInsights,
  scheduleWeeklyInsights,
  scheduleMonthlyInsights,
  scheduleCleanupJob,
};
