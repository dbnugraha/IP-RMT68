// server/routes/analytics.js
const router = require("express").Router({ mergeParams: true });
const AnalyticsController = require("../controllers/AnalyticsController");

// routes /businesses/:businessId/analytics

// Dashboard overview
router.get("/dashboard", AnalyticsController.getDashboard);

// Financial analytics
router.get("/financial", AnalyticsController.getFinancialSummary);
router.get("/profitability", AnalyticsController.getProfitability);
router.get("/payment-methods", AnalyticsController.getPaymentMethodStats);
router.get("/expenses", AnalyticsController.getExpenseBreakdown);

// Product analytics
router.get("/top-products", AnalyticsController.getTopProducts);
router.get("/product-profitability", AnalyticsController.getProductProfitability);
router.get("/product-performance", AnalyticsController.getProductPerformance);
router.get("/inventory", AnalyticsController.getInventoryStatus);

// Trends
router.get("/sales-trends", AnalyticsController.getSalesTrends);

module.exports = router;
