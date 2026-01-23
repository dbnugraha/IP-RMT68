// server/controllers/AnalyticsController.js
const analytics = require("../helpers/analytics");

module.exports = class AnalyticsController {
  /**
   * GET /businesses/:businessId/analytics/dashboard
   * Get comprehensive dashboard data
   */
  static async getDashboard(req, res, next) {
    try {
      const { businessId } = req.params;
      const data = await analytics.getDashboardData(businessId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/financial
   * Get financial summary with optional date filters
   */
  static async getFinancialSummary(req, res, next) {
    try {
      const { businessId } = req.params;
      const { startDate, endDate } = req.query;

      const data = await analytics.getFinancialData(businessId, startDate, endDate);
      data.netProfit = data.totalIncome - data.totalExpense;
      data.profitMargin = data.totalIncome > 0 ? ((data.netProfit / data.totalIncome) * 100).toFixed(2) : 0;

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/top-products
   * Get top selling products
   */
  static async getTopProducts(req, res, next) {
    try {
      const { businessId } = req.params;
      const { limit = 10 } = req.query;

      const topProducts = await analytics.getTopProducts(businessId, limit);
      res.status(200).json(topProducts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/inventory
   * Get inventory status with low stock alerts
   */
  static async getInventoryStatus(req, res, next) {
    try {
      const { businessId } = req.params;
      const { threshold = 10 } = req.query;

      const inventory = await analytics.getInventoryData(businessId, threshold);
      res.status(200).json(inventory);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/sales-trends
   * Get sales trends (daily/weekly/monthly)
   */
  static async getSalesTrends(req, res, next) {
    try {
      const { businessId } = req.params;
      const { period = "daily", startDate, endDate } = req.query;

      const trends = await analytics.getSalesTrends(businessId, period, startDate, endDate);
      res.status(200).json(trends);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/profitability
   * Get overall profitability metrics
   */
  static async getProfitability(req, res, next) {
    try {
      const { businessId } = req.params;

      const profitability = await analytics.getProfitabilityData(businessId);
      res.status(200).json(profitability);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/product-profitability
   * Get profitability analysis per product
   */
  static async getProductProfitability(req, res, next) {
    try {
      const { businessId } = req.params;

      const analysis = await analytics.getProductProfitability(businessId);
      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/payment-methods
   * Get transaction statistics by payment method
   */
  static async getPaymentMethodStats(req, res, next) {
    try {
      const { businessId } = req.params;

      const stats = await analytics.getPaymentMethodStats(businessId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/expenses
   * Get expense breakdown
   */
  static async getExpenseBreakdown(req, res, next) {
    try {
      const { businessId } = req.params;

      const expenses = await analytics.getExpenseBreakdown(businessId);
      res.status(200).json(expenses);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/analytics/product-performance
   * Get product performance metrics (top and low performers)
   */
  static async getProductPerformance(req, res, next) {
    try {
      const { businessId } = req.params;

      const performance = await analytics.getProductPerformance(businessId);
      res.status(200).json(performance);
    } catch (error) {
      next(error);
    }
  }
};
