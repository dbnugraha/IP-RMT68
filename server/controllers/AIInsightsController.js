// server/controllers/AIInsightsController.js
const { Business, AIInsight } = require("../models");
const aiInsightsHelper = require("../helpers/aiInsights");

module.exports = class AIInsightsController {
  /**
   * GET /businesses/:businessId/insights
   * Get stored insights for a business with optional filters
   */
  static async getInsights(req, res, next) {
    try {
      const { businessId } = req.params;
      const { limit = 10, type, startDate, endDate } = req.query;

      const insights = await aiInsightsHelper.getInsights(businessId, {
        limit: parseInt(limit),
        type,
        startDate,
        endDate,
      });

      res.status(200).json({
        count: insights.length,
        data: insights,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/insights/latest
   * Get the latest insight for a business
   */
  static async getLatestInsight(req, res, next) {
    try {
      const { businessId } = req.params;
      const { type = "daily" } = req.query;

      const insight = await aiInsightsHelper.getLatestInsight(businessId, type);

      if (!insight) {
        throw { name: "NotFoundError", message: `No ${type} insights available yet` };
      }

      res.status(200).json(insight);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/insights/:id
   * Get a specific insight by ID
   */
  static async getInsightById(req, res, next) {
    try {
      const { businessId, id } = req.params;

      const insight = await AIInsight.findOne({
        where: {
          id: parseInt(id),
          BusinessId: parseInt(businessId),
        },
        attributes: ["id", "insightType", "content", "generatedAt", "metadata", "createdAt"],
      });

      if (!insight) {
        throw { name: "NotFoundError", message: "Insight not found" };
      }

      res.status(200).json(insight);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /businesses/:businessId/insights/generate
   * Manually trigger insight generation for a specific business
   */
  static async generateInsight(req, res, next) {
    try {
      const { businessId } = req.params;
      const { type = "custom" } = req.body;

      // Validate insight type
      const validTypes = ["daily", "weekly", "monthly", "custom"];
      if (!validTypes.includes(type)) {
        throw { name: "ValidationError", message: "Invalid insight type" };
      }

      // Check if already generated today (for daily type)
      if (type === "daily") {
        const exists = await aiInsightsHelper.insightExistsToday(businessId, "daily");
        if (exists) {
          const insight = await aiInsightsHelper.getLatestInsight(businessId, "daily");
          return res.status(200).json({
            message: "Daily insight already generated today",
            insight: insight,
          });
        }
      }

      // Get business
      const business = await Business.findByPk(businessId, {
        attributes: ["id", "name", "type", "description"],
      });

      if (!business) {
        throw { name: "NotFoundError", message: "Business not found" };
      }

      // Generate new insight
      const insight = await aiInsightsHelper.generateInsightForBusiness(business, type);

      res.status(201).json({
        message: "Insight generated successfully",
        insight: {
          id: insight.id,
          insightType: insight.insightType,
          content: insight.content,
          generatedAt: insight.generatedAt,
          metadata: insight.metadata,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /businesses/:businessId/insights/regenerate/:id
   * Regenerate a specific insight (useful if AI response was poor)
   */
  static async regenerateInsight(req, res, next) {
    try {
      const { businessId, id } = req.params;

      // Get the old insight
      const oldInsight = await AIInsight.findOne({
        where: {
          id: parseInt(id),
          BusinessId: parseInt(businessId),
        },
      });

      if (!oldInsight) {
        throw { name: "NotFoundError", message: "Insight not found" };
      }

      // Get business
      const business = await Business.findByPk(businessId, {
        attributes: ["id", "name", "type", "description"],
      });

      // Delete old insight
      await oldInsight.destroy();

      // Generate new one with same type
      const newInsight = await aiInsightsHelper.generateInsightForBusiness(business, oldInsight.insightType);

      res.status(200).json({
        message: "Insight regenerated successfully",
        insight: {
          id: newInsight.id,
          insightType: newInsight.insightType,
          content: newInsight.content,
          generatedAt: newInsight.generatedAt,
          metadata: newInsight.metadata,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /businesses/:businessId/insights/:id
   * Delete a specific insight
   */
  static async deleteInsight(req, res, next) {
    try {
      const { businessId, id } = req.params;

      const insight = await AIInsight.findOne({
        where: {
          id: parseInt(id),
          BusinessId: parseInt(businessId),
        },
      });

      if (!insight) {
        throw { name: "NotFoundError", message: "Insight not found" };
      }

      await insight.destroy();

      res.status(200).json({
        message: "Insight deleted successfully",
        deletedId: parseInt(id),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/insights/summary
   * Get digestible summary of latest insight
   */
  static async getLatestSummary(req, res, next) {
    try {
      const { businessId } = req.params;
      const { type = "daily" } = req.query;

      const insight = await aiInsightsHelper.getLatestInsight(businessId, type);

      if (!insight) {
        throw { name: "NotFoundError", message: `No ${type} insights available yet.` };
      }

      if (!insight.summary) {
        throw { name: "NotFoundError", message: "Summary not available for this insight" };
      }

      res.status(200).json({
        insightId: insight.id,
        type: insight.insightType,
        generatedAt: insight.generatedAt,
        summary: insight.summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/insights/:id/summary
   * Get digestible summary of specific insight
   */
  static async getSummaryById(req, res, next) {
    try {
      const { businessId, id } = req.params;

      const insight = await AIInsight.findOne({
        where: {
          id: parseInt(id),
          BusinessId: parseInt(businessId),
        },
        attributes: ["id", "insightType", "summary", "generatedAt"],
      });

      if (!insight) {
        throw { name: "NotFoundError", message: "Insight not found" };
      }

      if (!insight.summary) {
        throw { name: "NotFoundError", message: "Summary not available for this insight" };
      }

      res.status(200).json({
        insightId: insight.id,
        type: insight.insightType,
        generatedAt: insight.generatedAt,
        summary: insight.summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /businesses/:businessId/insights/:id/regenerate-summary
   * Regenerate summary for existing insight
   */
  static async regenerateSummary(req, res, next) {
    try {
      const { businessId, id } = req.params;

      // Verify insight belongs to business
      const insight = await AIInsight.findOne({
        where: {
          id: parseInt(id),
          BusinessId: parseInt(businessId),
        },
      });

      if (!insight) {
        throw { name: "NotFoundError", message: "Insight not found" };
      }

      // Regenerate summary
      const updated = await aiInsightsHelper.regenerateSummary(parseInt(id));

      res.status(200).json({
        message: "Summary regenerated successfully",
        insightId: updated.id,
        summary: updated.summary,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /businesses/:businessId/insights/stats
   * Get statistics about insights for a business
   */
  static async getInsightStats(req, res, next) {
    try {
      const { businessId } = req.params;

      const [totalInsights, dailyCount, weeklyCount, monthlyCount, latestInsight] = await Promise.all([
        AIInsight.count({ where: { BusinessId: businessId } }),
        AIInsight.count({ where: { BusinessId: businessId, insightType: "daily" } }),
        AIInsight.count({ where: { BusinessId: businessId, insightType: "weekly" } }),
        AIInsight.count({ where: { BusinessId: businessId, insightType: "monthly" } }),
        aiInsightsHelper.getLatestInsight(businessId),
      ]);

      res.status(200).json({
        total: totalInsights,
        byType: {
          daily: dailyCount,
          weekly: weeklyCount,
          monthly: monthlyCount,
          custom: totalInsights - dailyCount - weeklyCount - monthlyCount,
        },
        latest: latestInsight
          ? {
              id: latestInsight.id,
              type: latestInsight.insightType,
              generatedAt: latestInsight.generatedAt,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /businesses/:businessId/insights/cleanup
   * Manually trigger cleanup of old insights (admin feature)
   */
  static async cleanupInsights(req, res, next) {
    try {
      const { businessId } = req.params;
      const { daysToKeep = 90 } = req.body;

      // Validate daysToKeep
      if (daysToKeep < 30) {
        throw { name: "ValidationError", message: "Cannot delete insights newer than 30 days" };
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const deletedCount = await AIInsight.destroy({
        where: {
          BusinessId: businessId,
          generatedAt: {
            [require("sequelize").Op.lt]: cutoffDate,
          },
        },
      });

      res.status(200).json({
        message: `Cleaned up insights older than ${daysToKeep} days`,
        deletedCount: deletedCount,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /businesses/:businessId/insights/:id/send-email
   * Manually send email for a specific insight
   */
  static async sendInsightEmail(req, res, next) {
    try {
      const { businessId, id } = req.params;

      // Verify insight belongs to business
      const insight = await AIInsight.findOne({
        where: {
          id: parseInt(id),
          BusinessId: parseInt(businessId),
        },
      });

      if (!insight) {
        throw { name: "NotFoundError", message: "Insight not found" };
      }

      const result = await aiInsightsHelper.sendInsightEmail(parseInt(id));

      res.status(200).json({
        message: "Email sent successfully",
        email: result.email,
        businessName: result.businessName,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /businesses/:businessId/insights/send-bulk-email
   * Send email for latest insight to one or multiple businesses
   */
  static async sendBulkEmails(req, res, next) {
    try {
      const { businessId } = req.params;
      const { type = "daily", businessIds } = req.body;

      // If businessIds provided, use them; otherwise send to current business only
      const targetBusinessIds = businessIds || [parseInt(businessId)];

      const result = await aiInsightsHelper.sendBulkEmails(targetBusinessIds, type);

      res.status(200).json({
        message: "Bulk email sending completed",
        sent: result.success,
        failed: result.failed,
        total: result.total,
        errors: result.errors,
      });
    } catch (error) {
      next(error);
    }
  }
};
