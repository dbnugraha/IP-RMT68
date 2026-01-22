// server/jobs/reportsJob.js
const { sendEmail } = require("../helpers/nodemailer");

/**
 * Send AI insight report via email
 * @param {Object} business - Business object
 * @param {Object} insight - AIInsight object with content and summary
 * @returns {Promise<void>}
 */
async function sendInsightReport(business, insight) {
  try {
    // Extract summary cards for easier email formatting
    const summaryCards = insight.summary?.insights || [];

    // Generate HTML content for email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
        /* Material UI Dark Palette */
        --mui-bg-default: #121212;
        --mui-bg-paper: #1e1e1e;
        --mui-bg-elevated: #232323;

        --mui-divider: rgba(255, 255, 255, 0.12);

        --mui-text-primary: rgba(255, 255, 255, 0.87);
        --mui-text-secondary: rgba(255, 255, 255, 0.6);
        --mui-text-disabled: rgba(255, 255, 255, 0.38);

        --mui-primary: #90caf9;
        --mui-primary-main: #1976d2;
        --mui-success: #66bb6a;
        --mui-warning: #ffa726;
        --mui-error: #f44336;
        --mui-info: #29b6f6;
    }

    body {
        font-family: Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Helvetica, Arial, sans-serif;
        background-color: var(--mui-bg-default);
        color: var(--mui-text-primary);
        max-width: 900px;
        margin: 0 auto;
        padding: 32px 20px;
        line-height: 1.5;
    }

    /* Header */
    .header {
        background: var(--mui-bg-paper);
        border: 1px solid var(--mui-divider);
        border-radius: 8px;
        padding: 24px;
        margin-bottom: 32px;
    }

    .header h1 {
        font-size: 1.75rem;
        font-weight: 500;
        margin: 0 0 8px;
    }

    .header p {
        margin: 0;
        color: var(--mui-text-secondary);
        font-size: 0.95rem;
    }

    /* Insight Cards (Paper) */
    .insight-card {
        background: var(--mui-bg-paper);
        border: 1px solid var(--mui-divider);
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 16px;
    }

    .insight-card.high {
        border-left: 4px solid var(--mui-error);
    }

    .insight-card.medium {
        border-left: 4px solid var(--mui-warning);
    }

    .insight-card.low {
        border-left: 4px solid var(--mui-success);
    }

    .insight-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    /* Chip */
    .insight-type {
        font-size: 0.6875rem;
        font-weight: 500;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--mui-text-secondary);
    }

    .type-financial { color: var(--mui-primary); }
    .type-inventory { color: var(--mui-warning); }
    .type-product { color: #ce93d8; }
    .type-operations { color: var(--mui-success); }
    .type-growth { color: #f48fb1; }
    .type-alert { color: var(--mui-error); }

    /* Values */
    .insight-value {
        font-size: 1.75rem;
        font-weight: 500;
        color: var(--mui-primary);
        margin: 8px 0;
    }

    .insight-message {
        font-size: 0.95rem;
        color: var(--mui-text-primary);
        margin-bottom: 12px;
    }

    /* Action Box */
    .insight-action {
        background: var(--mui-bg-elevated);
        border: 1px solid var(--mui-divider);
        border-radius: 6px;
        padding: 12px 14px;
        font-size: 0.875rem;
        color: var(--mui-text-secondary);
    }

    .insight-action strong {
        color: var(--mui-primary);
        font-weight: 500;
    }

    /* Full Report */
    .full-report {
        background: var(--mui-bg-paper);
        border: 1px solid var(--mui-divider);
        border-radius: 8px;
        padding: 24px;
        margin-top: 32px;
    }

    .full-report h2 {
        font-size: 1.25rem;
        font-weight: 500;
        margin-top: 0;
        color: var(--mui-primary);
    }

    /* Trend Chips */
    .trend-indicator {
        font-size: 0.75rem;
        font-weight: 500;
        padding: 4px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid var(--mui-divider);
    }

    .trend-positive {
        color: var(--mui-success);
    }

    .trend-negative {
        color: var(--mui-error);
    }

    .trend-warning {
        color: var(--mui-warning);
    }

    .trend-neutral {
        color: var(--mui-text-disabled);
    }

    /* Footer */
    .footer {
        margin-top: 40px;
        padding-top: 16px;
        border-top: 1px solid var(--mui-divider);
        text-align: center;
        font-size: 0.75rem;
        color: var(--mui-text-secondary);
    }
    </style>
</head>
<body>
  <div class="header">
    <h1>📊 ${business.name} - ${insight.insightType.charAt(0).toUpperCase() + insight.insightType.slice(1)} Insights</h1>
    <p>Generated on ${new Date(insight.generatedAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</p>
  </div>

  <h2 style="color: #667eea;">🔍 Key Insights</h2>
  
  ${summaryCards
    .map(
      (card) => `
    <div class="insight-card ${card.priority}">
      <div class="insight-header">
        <span class="insight-type type-${card.type}">${card.type}</span>
        <span class="trend-indicator trend-${card.trend}">
          ${card.trend === "positive" ? "📈" : card.trend === "negative" ? "📉" : card.trend === "warning" ? "⚠️" : "➡️"} 
          ${card.trend}
        </span>
      </div>
      
      ${card.value ? `<div class="insight-value">${card.value}</div>` : ""}
      
      <div class="insight-message">${card.message}</div>
      
      <div class="insight-action">
        <strong>💡 Action:</strong> ${card.action}
      </div>
    </div>
  `,
    )
    .join("")}

  <div class="full-report">
    <h2>📋 Detailed Analysis</h2>
    ${insight.content.replace(/\n/g, "<br>")}
  </div>

  <div class="footer">
    <p>This is an automated report generated by your Business Intelligence System.</p>
    <p>To view more details, please log in to your dashboard.</p>
  </div>
</body>
</html>
    `;

    // Send email
    await sendEmail(
      business.User?.email || "admin@example.com",
      `${business.name} - ${insight.insightType.charAt(0).toUpperCase() + insight.insightType.slice(1)} Business Insights`,
      htmlContent,
    );

    console.log(
      `✅ Insight report sent to ${business.User?.email || "admin@example.com"} for business: ${business.name}`,
    );
  } catch (error) {
    console.error(`❌ Error sending insight report for ${business.name}:`, error.message);
    throw error;
  }
}

/**
 * Send multiple insight reports
 * @param {Array<Object>} reports - Array of {business, insight} objects
 * @returns {Promise<Object>} Summary of sent emails
 */
async function sendBulkInsightReports(reports) {
  let successCount = 0;
  let failCount = 0;

  for (const report of reports) {
    try {
      await sendInsightReport(report.business, report.insight);
      successCount++;

      // Add delay to avoid email rate limiting
      if (reports.indexOf(report) < reports.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failCount++;
      console.error(`Failed to send report for ${report.business.name}:`, error.message);
    }
  }

  return {
    success: successCount,
    failed: failCount,
    total: reports.length,
  };
}

module.exports = {
  sendInsightReport,
  sendBulkInsightReports,
};
