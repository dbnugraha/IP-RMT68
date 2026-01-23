// server/helpers/analytics.js
const { Business, Product, Transaction, TransactionItem, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../models").sequelize;

module.exports = {
  /**
   * Get financial data for a business
   * @param {number} businessId - Business ID
   * @param {string|null} startDate - Optional start date filter
   * @param {string|null} endDate - Optional end date filter
   * @returns {Promise<Object>} Financial summary
   */
  async getFinancialData(businessId, startDate = null, endDate = null) {
    const whereClause = { BusinessId: businessId };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      attributes: ["type", "totalAmount", "paymentMethod", "createdAt"],
    });

    return transactions.reduce(
      (acc, t) => {
        if (t.type === "income") {
          acc.totalIncome += parseFloat(t.totalAmount);
          acc.incomeCount += 1;
          const method = t.paymentMethod;
          acc.paymentMethods[method] = (acc.paymentMethods[method] || 0) + parseFloat(t.totalAmount);
        } else {
          acc.totalExpense += parseFloat(t.totalAmount);
          acc.expenseCount += 1;
        }
        return acc;
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        incomeCount: 0,
        expenseCount: 0,
        paymentMethods: {},
      },
    );
  },

  /**
   * Get top selling products for a business
   * @param {number} businessId - Business ID
   * @param {number} limit - Number of products to return
   * @returns {Promise<Array>} Top products with sales data
   */
  async getTopProducts(businessId, limit = 5) {
    return await TransactionItem.findAll({
      attributes: [
        "ProductId",
        [sequelize.fn("SUM", sequelize.col("TransactionItem.quantity")), "totalQuantitySold"],
        [
          sequelize.fn("SUM", sequelize.literal('"TransactionItem"."quantity" * "TransactionItem"."price"')),
          "totalRevenue",
        ],
      ],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "stockKeepingUnit", "imageUrl", "sellingPrice"],
          where: { BusinessId: businessId, isDeleted: false },
          required: true,
        },
        {
          model: Transaction,
          attributes: [],
          where: { type: "income" },
          required: true,
        },
      ],
      group: ['"TransactionItem"."ProductId"', '"Product"."id"'],
      order: [[sequelize.literal('"totalRevenue"'), "DESC"]],
      limit: parseInt(limit),
      raw: false,
    });
  },

  /**
   * Get inventory status for a business
   * @param {number} businessId - Business ID
   * @param {number} threshold - Low stock threshold
   * @returns {Promise<Object>} Inventory summary
   */
  async getInventoryData(businessId, threshold = 10) {
    const products = await Product.findAll({
      where: {
        BusinessId: businessId,
        isActive: true,
        isDeleted: false,
      },
      attributes: ["id", "name", "stock", "stockKeepingUnit", "imageUrl"],
    });

    return {
      lowStock: products.filter((p) => p.stock <= threshold && p.stock > 0),
      outOfStock: products.filter((p) => p.stock === 0),
      inStock: products.filter((p) => p.stock > threshold),
      totalProducts: products.length,
      lowStockCount: products.filter((p) => p.stock <= threshold && p.stock > 0).length,
      outOfStockCount: products.filter((p) => p.stock === 0).length,
    };
  },

  /**
   * Get overall profitability data for a business
   * @param {number} businessId - Business ID
   * @returns {Promise<Object>} Profitability summary
   */
  async getProfitabilityData(businessId) {
    const result = await TransactionItem.findOne({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.literal('"TransactionItem"."quantity" * "TransactionItem"."price"')),
          "totalRevenue",
        ],
        [sequelize.fn("SUM", sequelize.literal('"TransactionItem"."quantity" * "Product"."basePrice"')), "totalCost"],
      ],
      include: [
        {
          model: Product,
          attributes: [],
          where: { BusinessId: businessId },
          required: true,
        },
        {
          model: Transaction,
          attributes: [],
          where: { type: "income" },
          required: true,
        },
      ],
      raw: true,
    });

    const revenue = parseFloat(result?.totalRevenue || 0);
    const cost = parseFloat(result?.totalCost || 0);
    const profit = revenue - cost;

    return {
      totalRevenue: revenue,
      totalCost: cost,
      totalProfit: profit,
      profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0,
    };
  },

  /**
   * Get sales trends over time
   * @param {number} businessId - Business ID
   * @param {string} period - 'daily', 'weekly', or 'monthly'
   * @param {string|null} startDate - Optional start date
   * @param {string|null} endDate - Optional end date
   * @returns {Promise<Array>} Sales trends data
   */
  async getSalesTrends(businessId, period = "daily", startDate = null, endDate = null) {
    let dateFormat;
    switch (period) {
      case "monthly":
        dateFormat = "YYYY-MM";
        break;
      case "weekly":
        dateFormat = "IYYY-IW"; // ISO week format
        break;
      default:
        dateFormat = "YYYY-MM-DD";
    }

    const whereClause = {
      BusinessId: businessId,
      type: "income",
    };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    return await Transaction.findAll({
      where: whereClause,
      attributes: [
        [sequelize.fn("TO_CHAR", sequelize.col("createdAt"), dateFormat), "period"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalSales"],
        [sequelize.fn("COUNT", sequelize.col("id")), "transactionCount"],
        [sequelize.fn("AVG", sequelize.col("totalAmount")), "averageTransaction"],
      ],
      group: [sequelize.literal("1")], // Group by first column (period)
      order: [[sequelize.literal("1"), "ASC"]],
      raw: true,
    });
  },

  /**
   * Get profitability analysis per product
   * @param {number} businessId - Business ID
   * @returns {Promise<Array>} Product profitability data
   */
  async getProductProfitability(businessId) {
    const profitability = await TransactionItem.findAll({
      attributes: [
        "ProductId",
        [sequelize.fn("SUM", sequelize.col("TransactionItem.quantity")), "totalSold"],
        [
          sequelize.fn("SUM", sequelize.literal('"TransactionItem"."quantity" * "TransactionItem"."price"')),
          "totalRevenue",
        ],
        [sequelize.fn("SUM", sequelize.literal('"TransactionItem"."quantity" * "Product"."basePrice"')), "totalCost"],
      ],
      include: [
        {
          model: Product,
          attributes: ["id", "name", "basePrice", "sellingPrice", "stockKeepingUnit"],
          where: { BusinessId: businessId, isDeleted: false },
          required: true,
        },
        {
          model: Transaction,
          attributes: [],
          where: { type: "income" },
          required: true,
        },
      ],
      group: ['"TransactionItem"."ProductId"', '"Product"."id"'],
      raw: false,
    });

    return profitability.map((item) => {
      const revenue = parseFloat(item.dataValues.totalRevenue || 0);
      const cost = parseFloat(item.dataValues.totalCost || 0);
      const profit = revenue - cost;
      const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0;

      return {
        product: {
          id: item.Product.id,
          name: item.Product.name,
          sku: item.Product.stockKeepingUnit,
          basePrice: parseFloat(item.Product.basePrice),
          sellingPrice: parseFloat(item.Product.sellingPrice),
        },
        totalSold: parseInt(item.dataValues.totalSold),
        totalRevenue: revenue,
        totalCost: cost,
        totalProfit: profit,
        profitMargin: parseFloat(margin),
      };
    });
  },

  /**
   * Get comprehensive dashboard data
   * @param {number} businessId - Business ID
   * @returns {Promise<Object>} Dashboard overview
   */
  async getDashboardData(businessId) {
    const [business, productStats, transactionStats, financialData, topProducts, inventoryData, recentTransactions] =
      await Promise.all([
        Business.findByPk(businessId, {
          attributes: ["id", "name", "type", "description", "imageUrl", "address"],
          include: [
            {
              model: User,
              attributes: ["id", "email", "firstName", "lastName"],
            },
          ],
        }),
        Product.count({ where: { BusinessId: businessId, isDeleted: false } }),
        Transaction.count({ where: { BusinessId: businessId } }),
        this.getFinancialData(businessId),
        this.getTopProducts(businessId, 5),
        this.getInventoryData(businessId),
        Transaction.findAll({
          where: { BusinessId: businessId },
          order: [["createdAt", "DESC"]],
          limit: 10,
          attributes: ["id", "type", "totalAmount", "paymentMethod", "notes", "createdAt"],
        }),
      ]);

    return {
      business,
      summary: {
        totalProducts: productStats,
        totalTransactions: transactionStats,
        ...financialData,
        netProfit: financialData.totalIncome - financialData.totalExpense,
      },
      topProducts,
      inventory: inventoryData,
      recentTransactions,
    };
  },

  /**
   * Get transaction statistics by payment method
   * @param {number} businessId - Business ID
   * @returns {Promise<Array>} Payment method breakdown
   */
  async getPaymentMethodStats(businessId) {
    return await Transaction.findAll({
      where: { BusinessId: businessId, type: "income" },
      attributes: [
        "paymentMethod",
        [sequelize.fn("COUNT", sequelize.col("id")), "transactionCount"],
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalAmount"],
        [sequelize.fn("AVG", sequelize.col("totalAmount")), "averageAmount"],
      ],
      group: ["paymentMethod"],
      raw: true,
    });
  },

  /**
   * Get expense breakdown by category (from notes analysis)
   * @param {number} businessId - Business ID
   * @returns {Promise<Array>} Expense transactions
   */
  async getExpenseBreakdown(businessId) {
    return await Transaction.findAll({
      where: { BusinessId: businessId, type: "expense" },
      attributes: ["id", "totalAmount", "paymentMethod", "notes", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
  },

  /**
   * Get product performance metrics
   * @param {number} businessId - Business ID
   * @returns {Promise<Object>} Product performance data
   */
  async getProductPerformance(businessId) {
    const [topProducts, lowPerformers] = await Promise.all([
      this.getTopProducts(businessId, 5),
      TransactionItem.findAll({
        attributes: [
          "ProductId",
          [sequelize.fn("SUM", sequelize.col("TransactionItem.quantity")), "totalQuantitySold"],
        ],
        include: [
          {
            model: Product,
            attributes: ["id", "name", "stock", "isActive"],
            where: { BusinessId: businessId, isDeleted: false },
            required: true,
          },
          {
            model: Transaction,
            attributes: [],
            where: { type: "income" },
            required: true,
          },
        ],
        group: ['"TransactionItem"."ProductId"', '"Product"."id"'],
        order: [[sequelize.literal('"totalQuantitySold"'), "ASC"]],
        limit: 5,
        raw: false,
      }),
    ]);

    return {
      topPerformers: topProducts,
      lowPerformers: lowPerformers,
    };
  },
};
