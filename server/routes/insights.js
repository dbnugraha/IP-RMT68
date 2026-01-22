// Updated server/routes/insights.js
// server/routes/insights.js - Add email routes
const router = require("express").Router({ mergeParams: true });
const AIInsightsController = require("../controllers/AIInsightsController");

// Summary endpoints (before :id routes to avoid conflicts)
router.get("/summary", AIInsightsController.getLatestSummary);
router.get("/latest", AIInsightsController.getLatestInsight);
router.get("/stats", AIInsightsController.getInsightStats);

// Get insights
router.get("/", AIInsightsController.getInsights);
router.get("/:id", AIInsightsController.getInsightById);
router.get("/:id/summary", AIInsightsController.getSummaryById);

// Generate/Regenerate insights
router.post("/generate", AIInsightsController.generateInsight);
router.post("/regenerate/:id", AIInsightsController.regenerateInsight);
router.post("/:id/regenerate-summary", AIInsightsController.regenerateSummary);

// Email endpoints
router.post("/:id/send-email", AIInsightsController.sendInsightEmail);
router.post("/send-bulk-email", AIInsightsController.sendBulkEmails);

// Maintenance
router.post("/cleanup", AIInsightsController.cleanupInsights);

// Delete insights
router.delete("/:id", AIInsightsController.deleteInsight);

module.exports = router;
