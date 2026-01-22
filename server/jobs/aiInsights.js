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
          User: { email: "test@example.com", firstName: "Test", lastName: "User" },
        },
        insight: {
          id: 1,
          insightType: "daily",
          content: `
            ### Business Analysis Report: Toko Elektronik Sejahtera\n\nPrepared by: **Expert Business Analyst AI**  \nSubject: **Performance Review & Strategic Growth Plan**\n\n---\n\n### 1. Key Performance Insights\n*   **Strong Product Profitability:** Your core product sales are healthy with a **23.74% profit margin**. In the electronics retail sector, where margins are often thin (5-15%), a margin above 20% indicates excellent pricing strategy and high-value inventory.\n*   **High Average Order Value (AOV):** With 17 transactions generating Rp 161.5M in income, your average transaction value is approximately **Rp 9.5 million**. This confirms that the business successfully attracts "high-ticket" customers looking for premium items (iPhones and Laptops).\n*   **Modern Payment Preferences:** Cash is no longer king for your store. **79% of your revenue** comes from non-cash methods (47.6% Credit Card, 31.5% E-Wallet). This suggests a tech-savvy or middle-to-upper-class customer base that values convenience and potentially financing options.\n*   **Lean but Effective Catalog:** You are generating significant revenue with only 15 total product types. The "Pareto Principle" is in effect here: your top 5 products are likely driving the vast majority of your total income.\n\n---\n\n### 2. Areas of Concern\n*   **Net Loss Despite High Sales:** This is the most critical issue. While your product profit is Rp 38.3M, your **Net Profit is -Rp 7.4M**. This indicates that your operational expenses (rent, salaries, marketing, or utilities) totaling Rp 169M are currently higher than your gross profit can sustain.\n*   **Inventory Fragility:** **46% of your catalog (7 out of 15 items) is low on stock.** In the electronics business, if a customer sees "out of stock" for a specific model (like an iPhone or ASUS laptop), they will immediately go to a competitor. You are at high risk of losing potential revenue in the next cycle.\n*   **Transaction Volume:** 17 transactions is a relatively low volume for a retail store. While the value per sale is high, the business is highly dependent on a few "big" sales. A single week without a laptop or iPhone sale could lead to a severe cash flow crisis.\n\n---\n\n### 3. Actionable Recommendations\n1.  **Conduct an Expense Audit:** You need to bridge the **Rp 7.5M gap** to reach break-even. Review the Rp 169M expense. Is there a one-time cost (e.g., security deposit, bulk stock purchase) or are recurring costs too high? Aim to reduce operational overhead by 5-10%.\n2.  **Prioritize Top-Seller Restocking:** Immediately reinvest available cash into the **iPhone 14** and **ASUS VivoBook**. These two items alone generated ~Rp 66M. Ensure these are never out of stock, as they are your primary "anchor" products.\n3.  **Implement an "Attachment Rate" Strategy:** Since your transaction count is low (17), maximize every sale. For every laptop or smartphone sold, the staff must bundle/up-sell high-margin accessories (cases, screen protectors, mice, or laptop bags). This increases profit without significantly increasing operational costs.\n4.  **Credit Card Promotions:** Since 47% of your customers use Credit Cards, partner with specific banks to offer "0% Installment" programs or "Cashback" promos. This will attract more high-ticket buyers who prefer to pay in installments.\n\n---\n\n### 4. Growth Opportunities\n*   **Cross-Selling with Service:** Consider offering "Extended Warranty" or "Initial Setup/Software Installation" services for laptops. Service-based revenue has 0% COGS (Cost of Goods Sold) and will directly boost your Net Profit.\n*   **B2B Small Office Supply:** With your current stock (Lenovo/ASUS laptops), there is an opportunity to approach local small businesses or coworking spaces to provide "Office Starter Bundles" (Laptop + Mouse + Basic Electronics).\n*   **Digital Presence for Low-Stock items:** Use your e-wallet data to target customers for "Trade-in" programs. If someone bought a Redmi Note 12, they might be interested in an upgrade in 12 months.\n*   **Expand Mid-Range Inventory:** The Xiaomi and Samsung models are selling well. Expanding your "Mid-Range" category (Rp 3M - Rp 5M) could increase your transaction frequency, providing a more stable daily cash flow compared to relying solely on high-end iPhones.\n\n---\n\n**Summary Conclusion:**\nToko Elektronik Sejahtera has a **healthy sales engine** but a **heavy expense structure**. By optimizing stock for top-performing items and tightening operational spending, the business can easily pivot from a Rp 7M loss to a Rp 20M+ monthly profit
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
