// server/helpers/aiInsights.js - Add summary generation
const { Business, AIInsight } = require("../models");
const analytics = require("./analytics");
const { analyzeBusinessData, generateDigestibleSummary } = require("./gemini");
const { Op } = require("sequelize");

module.exports = {
  /**
   * Generate AI insights for a specific business
   * @param {Object} business - Business instance
   * @param {string} insightType - Type of insight (daily/weekly/monthly/custom)
   * @returns {Promise<Object>} Created AIInsight instance
   */
  async generateInsightForBusiness(business, insightType = "daily") {
    try {
      console.log(`📊 Generating ${insightType} insights for: ${business.name}`);

      // Gather all analytics data using helpers
      const [financialData, topProducts, inventoryStatus, profitability] = await Promise.all([
        analytics.getFinancialData(business.id),
        analytics.getTopProducts(business.id, 5),
        analytics.getInventoryData(business.id),
        analytics.getProfitabilityData(business.id),
      ]);

      // Prepare context for AI
      const aiContext = {
        business: {
          id: business.id,
          name: business.name,
          type: business.type,
          description: business.description,
        },
        financial: financialData,
        topProducts: topProducts.map((p) => ({
          name: p.Product.name,
          totalQuantitySold: p.dataValues.totalQuantitySold,
          totalRevenue: p.dataValues.totalRevenue,
        })),
        inventory: inventoryStatus,
        profitability: profitability,
      };

      // Generate full AI insights
      const fullInsights = await analyzeBusinessData(
        aiContext,
        `Provide ${insightType} business insights, identify trends, and suggest actionable recommendations.`,
      );

      // Generate digestible summary
      console.log(`🔄 Generating digestible summary for: ${business.name}`);
      const digestibleSummary = await generateDigestibleSummary(fullInsights, aiContext);

      console.log(digestibleSummary);

      // Store in database
      const insight = await AIInsight.create({
        BusinessId: business.id,
        insightType: insightType,
        content: fullInsights,
        summary: digestibleSummary, // Store the JSON summary
        metadata: aiContext, // Store the data used for generation
        generatedAt: new Date(),
      });

      console.log(`✅ Successfully generated insight for: ${business.name} (ID: ${insight.id})`);
      return insight;
    } catch (error) {
      console.error(`❌ Failed to generate insight for ${business.name}:`, error.message);
      throw error;
    }
  },

  /**
   * Regenerate summary for existing insight
   * @param {number} insightId - AIInsight ID
   * @returns {Promise<Object>} Updated insight with new summary
   */
  async regenerateSummary(insightId) {
    try {
      const insight = await AIInsight.findByPk(insightId);

      if (!insight) {
        throw new Error("Insight not found");
      }

      console.log(`🔄 Regenerating summary for insight ID: ${insightId}`);

      // Generate new summary from existing content and metadata
      const digestibleSummary = await generateDigestibleSummary(insight.content, insight.metadata);

      // Update insight with new summary
      await insight.update({ summary: digestibleSummary });

      console.log(`✅ Successfully regenerated summary for insight ID: ${insightId}`);
      return insight;
    } catch (error) {
      console.error(`❌ Failed to regenerate summary:`, error.message);
      throw error;
    }
  },

  /**
   * Check if insight already exists for today
   * @param {number} businessId - Business ID
   * @param {string} insightType - Type of insight
   * @returns {Promise<boolean>} True if insight exists
   */
  async insightExistsToday(businessId, insightType = "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingInsight = await AIInsight.findOne({
      where: {
        BusinessId: businessId,
        insightType: insightType,
        generatedAt: { [Op.gte]: today },
      },
    });

    return !!existingInsight;
  },

  /**
   * Generate AI insights for all active businesses
   * @param {string} insightType - Type of insight to generate
   * @returns {Promise<Object>} Generation summary
   */
  async generateInsightsForAllBusinesses(insightType = "daily") {
    try {
      console.log(`\n🤖 Starting ${insightType} AI insights generation...`);
      console.log(`⏰ Started at: ${new Date().toLocaleString("id-ID")}\n`);

      // Get all businesses
      const businesses = await Business.findAll({
        attributes: ["id", "name", "type", "description"],
      });

      if (businesses.length === 0) {
        console.log("⚠️  No businesses found");
        return { success: 0, failed: 0, skipped: 0, total: 0 };
      }

      console.log(`📋 Found ${businesses.length} business(es) to process\n`);

      let successCount = 0;
      let failCount = 0;
      let skippedCount = 0;

      for (const business of businesses) {
        try {
          // Check if insight already generated today (for daily insights)
          if (insightType === "daily") {
            const exists = await this.insightExistsToday(business.id, insightType);
            if (exists) {
              console.log(`⏭️  Skipping ${business.name}: Insight already generated today`);
              skippedCount++;
              continue;
            }
          }

          await this.generateInsightForBusiness(business, insightType);
          successCount++;

          // Add delay to avoid rate limiting (3 seconds for 2 AI calls)
          if (businesses.indexOf(business) < businesses.length - 1) {
            console.log("⏳ Waiting 3 seconds before next request...\n");
            await new Promise((resolve) => setTimeout(resolve, 3000));
          }
        } catch (error) {
          failCount++;
          console.error(`❌ Error processing ${business.name}:`, error.message);
        }
      }

      console.log("\n" + "=".repeat(50));
      console.log(`✨ AI Insights Generation Complete`);
      console.log(`✅ Successful: ${successCount}`);
      console.log(`⏭️  Skipped: ${skippedCount}`);
      console.log(`❌ Failed: ${failCount}`);
      console.log(`📊 Total: ${businesses.length}`);
      console.log(`⏰ Finished at: ${new Date().toLocaleString("id-ID")}`);
      console.log("=".repeat(50) + "\n");

      return {
        success: successCount,
        failed: failCount,
        skipped: skippedCount,
        total: businesses.length,
      };
    } catch (error) {
      console.error("❌ Critical error in AI insights generation:", error);
      throw error;
    }
  },

  /**
   * Get latest insight for a business
   * @param {number} businessId - Business ID
   * @param {string} insightType - Type of insight
   * @returns {Promise<Object|null>} Latest insight or null
   */
  async getLatestInsight(businessId, insightType = "daily") {
    return await AIInsight.findOne({
      where: {
        BusinessId: businessId,
        insightType: insightType,
      },
      order: [["generatedAt", "DESC"]],
      attributes: ["id", "insightType", "content", "summary", "generatedAt", "metadata"],
    });
  },

  /**
   * Get insights for a business with filters
   * @param {number} businessId - Business ID
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} Array of insights
   */
  async getInsights(businessId, options = {}) {
    const { limit = 10, type, startDate, endDate } = options;

    const whereClause = { BusinessId: businessId };

    if (type) {
      whereClause.insightType = type;
    }

    if (startDate && endDate) {
      whereClause.generatedAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    return await AIInsight.findAll({
      where: whereClause,
      order: [["generatedAt", "DESC"]],
      limit: parseInt(limit),
      attributes: ["id", "insightType", "content", "summary", "generatedAt", "createdAt"],
    });
  },

  /**
   * Delete old insights (cleanup)
   * @param {number} daysToKeep - Number of days to keep insights
   * @returns {Promise<number>} Number of deleted insights
   */
  async cleanupOldInsights(daysToKeep = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await AIInsight.destroy({
      where: {
        generatedAt: {
          [Op.lt]: cutoffDate,
        },
      },
    });

    console.log(`🧹 Cleaned up ${result} insights older than ${daysToKeep} days`);
    return result;
  },
};
