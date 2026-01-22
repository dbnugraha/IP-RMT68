// server/jobs/aiInsights.js
const cron = require("node-cron");
const aiInsightsHelper = require("../helpers/aiInsights");
const { sendBulkInsightReports } = require("./reportsJob");
const { Business, AIInsight } = require("../models");

/**
 * Generate insights and optionally send email reports
 * @param {string} insightType - Type of insight
 * @param {boolean} sendEmail - Whether to send email reports
 */
async function generateAndSendInsights(insightType = "daily", sendEmail = false) {
  try {
    console.log(`\n🤖 Starting ${insightType} AI insights generation...`);

    // Generate insights for all businesses
    const result = await aiInsightsHelper.generateInsightsForAllBusinesses(insightType);

    // If email sending is enabled and insights were generated
    if (sendEmail && result.success > 0) {
      console.log("\n📧 Sending email reports...");

      // Get all businesses with their latest insights and user info
      const businesses = await Business.findAll({
        attributes: ["id", "name"],
        include: [
          {
            model: require("../models").User,
            attributes: ["email", "firstName", "lastName"],
          },
        ],
      });

      const reports = [];

      for (const business of businesses) {
        const insight = await aiInsightsHelper.getLatestInsight(business.id, insightType);
        if (insight) {
          reports.push({ business, insight });
        }
      }

      const emailResult = await sendBulkInsightReports(reports);

      console.log("\n📧 Email Reports Summary:");
      console.log(`✅ Sent: ${emailResult.success}`);
      console.log(`❌ Failed: ${emailResult.failed}`);
      console.log(`📊 Total: ${emailResult.total}\n`);
    }

    return result;
  } catch (error) {
    console.error("❌ Error in generate and send insights:", error);
    throw error;
  }
}

/**
 * Schedule daily AI insights generation
 * Skips first day of month and Mondays (when weekly/monthly run)
 */
const scheduleDailyInsights = (skipMonthly = true, skipWeekly = true) => {
  // Schedule: Every day at 7:00 AM (Asia/Jakarta timezone)
  cron.schedule(
    "0 7 * * *",
    async () => {
      const today = new Date();
      const dayOfMonth = today.getDate();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Skip if it's the first day of the month (monthly report runs)
      if (skipMonthly && dayOfMonth === 1) {
        console.log("\n⏭️  Skipping daily insights (first day of month - monthly report runs instead)");
        return;
      }

      // Skip if it's Monday (weekly report runs)
      if (skipWeekly && dayOfWeek === 1) {
        console.log("\n⏭️  Skipping daily insights (Monday - weekly report runs instead)");
        return;
      }

      console.log("\n🔔 Daily AI Insights Job Triggered");
      try {
        await generateAndSendInsights("daily", true);
      } catch (error) {
        console.error("❌ Daily AI insights job failed:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );

  console.log("✅ Daily AI Insights job scheduled (every day at 7:00 AM, except Mondays and 1st of month)");
};

/**
 * Schedule weekly AI insights generation
 * Skips first Monday of the month (when monthly runs)
 */
const scheduleWeeklyInsights = (skipMonthly = true) => {
  // Schedule: Every Monday at 7:00 AM
  cron.schedule(
    "0 7 * * 1",
    async () => {
      const today = new Date();
      const dayOfMonth = today.getDate();

      // Skip if it's the first day of the month (monthly report runs at 7 AM)
      if (skipMonthly && dayOfMonth === 1) {
        console.log("\n⏭️  Skipping weekly insights (first day of month - monthly report runs instead)");
        return;
      }

      console.log("\n🔔 Weekly AI Insights Job Triggered");
      try {
        await generateAndSendInsights("weekly", true);
      } catch (error) {
        console.error("❌ Weekly AI insights job failed:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Jakarta",
    },
  );

  console.log("✅ Weekly AI Insights job scheduled (every Monday at 7:00 AM, except if 1st of month)");
};

/**
 * Schedule monthly AI insights generation
 */
const scheduleMonthlyInsights = () => {
  // Schedule: First day of every month at 7:00 AM
  cron.schedule(
    "0 7 1 * *",
    async () => {
      console.log("\n🔔 Monthly AI Insights Job Triggered");
      try {
        await generateAndSendInsights("monthly", true);
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

const testEmailSending = async () => {
  try {
    console.log("\n📧 Testing email sending for AI Insights...");
    await sendBulkInsightReports([
      {
        business: {
          id: 1,
          name: "Test Business",
          User: { email: "dimasbudin777@gmail.com", firstName: "Dimas", lastName: "Budi Nugraha" },
        },
        insight: {
          id: 1,
          insightType: "daily",
          content: `
            \n# Business Analysis Report: Toko Elektronik Sejahtera\n\nPrepared by: Business Analyst\nDate: October 26, 2023\n\n---\n\n#### 1. Key Performance Insights\n*   **Healthy Operational Margins:** The business maintains a solid gross profit margin of **23.74%**. This indicates that the pricing strategy for your products (smartphones and laptops) is effective and allows for a significant markup over the cost of goods sold (COGS).\n*   **High-Ticket Value Sales:** Revenue is heavily driven by premium products. The **iPhone 14** and **ASUS VivoBook 14** alone contribute to approximately **41% of total revenue**. This suggests your customer base leans toward \"aspirational\" or \"professional\" buyers who value brand and quality.\n*   **Digital-First Payment Preference:** Roughly **79% of transactions** are made via non-cash methods (Credit Card: 47.6%, E-wallet: 31.5%). This confirms a tech-savvy customer demographic that prefers financing options or digital convenience.\n*   **Low Transaction Volume, High Value:** With only **17 income transactions** generating over Rp 161 million, your business model currently relies on a \"boutique\" approach—low volume but high ticket size.\n\n---\n\n#### 2. Areas of Concern\n*   **Net Loss Position:** Despite a healthy gross profit of Rp 38.3M, the business recorded a **Net Profit of -Rp 7.449.000**. This indicates that operating expenses (Rent, Salaries, Marketing, Utilities, etc.) or a large one-time capital expenditure (Rp 169M total expense) are currently exceeding the total income.\n*   **Inventory Fragility:** **46% of your product catalog (7 out of 15 items) is low on stock.** In electronics, \"out of stock\" is a lost sale to a competitor, as customers are rarely willing to wait for gadgets.\n*   **Heavy Expense Concentration:** You have only 4 expense transactions totaling Rp 169M. This suggests large, lump-sum payments which may be causing cash flow strain.\n*   **Dependency on Top 5 Products:** Your top 5 products represent the vast majority of your revenue. If supply chain issues hit these specific models (especially iPhone or ASUS), revenue will collapse.\n\n---\n\n#### 3. Actionable Recommendations\n\n*   **Audit Operating Expenses:** Immediately review the \"4 expense transactions\" that totaled Rp 169M. If these were one-time investments (e.g., renovations or bulk stock purchase), the net loss is temporary. If these are recurring monthly costs, you must increase sales volume by at least **15-20%** just to reach the break-even point.\n*   **Immediate Inventory Restock:** Prioritize restocking the **iPhone 14** and **Xiaomi Redmi Note 12 Pro**. These have the highest turnover rates. Use your gross profit to replenish these before you lose momentum.\n*   **Implement \"Attachment\" Sales (Upselling):** Your current transactions are likely \"unit-only.\" Train staff to bundle every smartphone/laptop sale with high-margin accessories (cases, screen protectors, mice, laptop bags). This increases the average transaction value without significantly increasing COGS.\n*   **Credit Card Promotions:** Since Credit Card is your #1 payment method (47.6%), partner with specific banks to offer \"0% Installment\" programs. This will lower the barrier for customers to buy high-ticket items like the iPhone or VivoBook.\n*   **Automate Low-Stock Alerts:** With 7 items low on stock, implement a reorder point (ROP) system to ensure you never hit zero.\n\n---\n\n#### 4. Growth Opportunities\n*   **B2B Corporate Procurement:** Since you already sell laptops like the ASUS VivoBook and Lenovo IdeaPad, explore selling to local offices or schools. Small businesses often need 5–10 units at once, which would solve your low transaction volume issue.\n*   **Trade-In Programs:** Electronics customers often want the latest model. A \"Trade-In\" program for iPhones or Samsung devices can drive traffic and provide you with used inventory to sell at a different price point (second-hand market).\n*   **Digital Presence & SEO:** Given the reliance on gadgets, ensure your store is visible on Google Maps and local marketplaces (Tokopedia/Shopee). Many customers \"research online, buy offline.\"\n*   **Service/After-Sales Expansion:** Consider offering basic setup services or extended warranties. This is \"pure profit\" service revenue that requires no inventory cost and can help flip your Net Profit from negative to positive.
            `,
          summary: {
            insights: [
              {
                id: "1",
                icon: "trending-down",
                type: "financial",
                trend: "negative",
                value: "Rp -7.4M",
                action: "Audit operational overhead to reduce expenses by 5-10% and reach break-even.",
                message:
                  "Despite a healthy 23.7% gross margin, high operational expenses of Rp 169M are causing a monthly net loss.",
                priority: "high",
              },
              {
                id: "2",
                icon: "package",
                type: "inventory",
                trend: "warning",
                value: "7 Items",
                action:
                  "Immediately restock top-performing iPhone 14 and ASUS VivoBook models to protect core revenue.",
                message:
                  "46% of your product catalog is currently low on stock, creating a high risk of losing high-ticket customers.",
                priority: "high",
              },
              {
                id: "3",
                icon: "dollar-sign",
                type: "product",
                trend: "positive",
                value: "Rp 9.5M",
                action:
                  "Implement an 'Attachment Rate' strategy to bundle high-margin accessories with every premium device sale.",
                message:
                  "Your high average order value of Rp 9.5M confirms a premium customer base that prefers non-cash payments.",
                priority: "medium",
              },
              {
                id: "4",
                icon: "chart-bar",
                type: "growth",
                trend: "neutral",
                value: "79%",
                action:
                  "Partner with banks to offer 0% installment programs to drive higher transaction volume from tech-savvy shoppers.",
                message:
                  "79% of revenue is generated through digital payments, with Credit Cards accounting for nearly half of all sales.",
                priority: "medium",
              },
            ],
          },
        },
      },
    ]);
    console.log("✅ Test email sending completed.");
  } catch (error) {
    console.error("❌ Test email sending failed:", error);
  }
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
  generateAndSendInsights,
  scheduleDailyInsights,
  scheduleWeeklyInsights,
  scheduleMonthlyInsights,
  scheduleCleanupJob,
  testEmailSending,
};
