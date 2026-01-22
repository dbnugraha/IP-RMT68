// server/jobs/reportsJob.js
const { sendEmail } = require("../helpers/nodemailer");
const { marked } = require("marked");
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

/**
 * Send AI insight report via email
 * @param {Object} business - Business object
 * @param {Object} insight - AIInsight object with content and summary
 * @returns {Promise<void>}
 */
async function sendInsightReport(business, insight) {
  try {
    // Sanitize and convert markdown content to HTML
    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    insight.content = purify.sanitize(marked(insight.content || ""));

    // Extract summary cards for easier email formatting
    const summaryCards = insight.summary?.insights || [];

    // Generate HTML content for email
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 20px 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 28px 24px; margin-bottom: 20px;">
              <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #ffffff; line-height: 1.3;">
                📊 ${business.name} - ${insight.insightType.charAt(0).toUpperCase() + insight.insightType.slice(1)} Insights
              </h1>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                Generated on ${new Date(insight.generatedAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
              </p>
            </td>
          </tr>
          
          <tr><td style="height: 24px;"></td></tr>
          
          <!-- Key Insights Title -->
          <tr>
            <td>
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #333333;">🔍 Key Insights</h2>
            </td>
          </tr>
          
          <!-- Insight Cards -->
          ${summaryCards
            .map((card) => {
              const borderColor =
                card.priority === "high" ? "#dc3545" : card.priority === "medium" ? "#ff9800" : "#28a745";

              const trendEmoji =
                card.trend === "positive"
                  ? "📈"
                  : card.trend === "negative"
                    ? "📉"
                    : card.trend === "warning"
                      ? "⚠️"
                      : "➡️";

              const trendColor =
                card.trend === "positive"
                  ? "#28a745"
                  : card.trend === "negative"
                    ? "#dc3545"
                    : card.trend === "warning"
                      ? "#ff9800"
                      : "#6c757d";

              const typeColor =
                card.type === "financial"
                  ? "#1976d2"
                  : card.type === "inventory"
                    ? "#ff9800"
                    : card.type === "product"
                      ? "#9c27b0"
                      : card.type === "operations"
                        ? "#28a745"
                        : card.type === "growth"
                          ? "#e91e63"
                          : card.type === "alert"
                            ? "#dc3545"
                            : "#6c757d";

              return `
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #e0e0e0; border-left: 4px solid ${borderColor}; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td>
                          <span style="display: inline-block; font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; padding: 5px 12px; border-radius: 12px; background-color: ${typeColor}; color: #ffffff;">
                            ${card.type}
                          </span>
                        </td>
                        <td align="right">
                          <span style="display: inline-block; font-size: 12px; font-weight: 500; padding: 5px 10px; border-radius: 12px; background-color: #f8f9fa; border: 1px solid #e0e0e0; color: ${trendColor};">
                            ${trendEmoji} ${card.trend}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${
                  card.value
                    ? `
                <tr>
                  <td style="padding-top: 12px;">
                    <div style="font-size: 32px; font-weight: 600; color: #1976d2; margin: 8px 0;">
                      ${card.value}
                    </div>
                  </td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td style="padding-top: 8px;">
                    <div style="font-size: 15px; color: #333333; margin-bottom: 12px; line-height: 1.6;">
                      ${card.message}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 12px 14px; font-size: 14px; color: #495057;">
                      <strong style="color: #667eea; font-weight: 600;">💡 Action:</strong> ${card.action}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height: 16px;"></td></tr>
                `;
            })
            .join("")}
          
          <!-- Full Report -->
          <tr>
            <td style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
              <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #1976d2;">📋 Detailed Analysis</h2>
              <div style="font-size: 15px; color: #333333; line-height: 1.7;">
                ${insight.content.replace(/\n/g, "<br>")}
              </div>
            </td>
          </tr>
          
          <tr><td style="height: 40px;"></td></tr>
          
          <!-- Footer -->
          <tr>
            <td style="border-top: 2px solid #e0e0e0; padding-top: 20px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6c757d;">
                This is an automated report generated by your Business Intelligence System.
              </p>
              <p style="margin: 0; font-size: 13px; color: #6c757d;">
                To view more details, please log in to your dashboard.
              </p>
            </td>
          </tr>
          
          <tr><td style="height: 20px;"></td></tr>
          
        </table>
      </td>
    </tr>
  </table>
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
