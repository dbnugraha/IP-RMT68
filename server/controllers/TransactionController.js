// server/controllers/TransactionController.js
const { Transaction, Business } = require("../models");

module.exports = class TransactionController {
  // GET transactions by Business ID
  static async getTransactionsByBusinessId(req, res, next) {
    try {
      const { businessId } = req.params;
      const transactions = await Transaction.findAll({
        where: { BusinessId: businessId },
        include: [
          {
            model: Business,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(transactions);
    } catch (error) {
      next(error);
    }
  }

  // GET transaction by ID
  static async getTransactionById(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const transaction = await Transaction.findOne({
        where: {
          id: id,
          BusinessId: businessId, // Ensure transaction belongs to the business
        },
        include: [
          {
            model: Business,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!transaction) {
        throw { name: "NotFoundError", message: "Transaction not found" };
      }

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // POST create new transaction
  static async createTransaction(req, res, next) {
    try {
      const { businessId } = req.params;
      const { type, totalAmount, paymentMethod, notes } = req.body;

      const newTransaction = await Transaction.create({
        BusinessId: businessId, // Use businessId from route params
        type,
        totalAmount,
        paymentMethod,
        notes,
      });

      res.status(201).json(newTransaction);
    } catch (error) {
      next(error);
    }
  }

  // PUT update transaction
  static async updateTransaction(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const { type, totalAmount, paymentMethod, notes } = req.body;

      const transaction = await Transaction.findOne({
        where: {
          id: id,
          BusinessId: businessId, // Ensure transaction belongs to the business
        },
      });

      if (!transaction) {
        throw { name: "NotFoundError", message: "Transaction not found" };
      }

      await transaction.update({
        type,
        totalAmount,
        paymentMethod,
        notes,
      });

      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // DELETE transaction
  static async deleteTransaction(req, res, next) {
    try {
      const { businessId, id } = req.params;

      const transaction = await Transaction.findOne({
        where: {
          id: id,
          BusinessId: businessId,
        },
      });

      if (!transaction) {
        throw { name: "NotFoundError", message: "Transaction not found" };
      }

      await transaction.destroy();

      res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  // GET transaction statistics (income vs expense)
  static async getTransactionStats(req, res, next) {
    try {
      const { businessId } = req.params;

      const transactions = await Transaction.findAll({
        where: { BusinessId: businessId },
        attributes: ["type", "totalAmount"],
      });

      const stats = transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "income") {
            acc.totalIncome += transaction.totalAmount;
            acc.incomeCount += 1;
          } else {
            acc.totalExpense += transaction.totalAmount;
            acc.expenseCount += 1;
          }
          return acc;
        },
        { totalIncome: 0, totalExpense: 0, incomeCount: 0, expenseCount: 0 },
      );

      stats.netProfit = stats.totalIncome - stats.totalExpense;

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
};
