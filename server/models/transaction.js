"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Business, { foreignKey: "BusinessId" });
      Transaction.hasMany(models.TransactionItem, { foreignKey: "TransactionId" });
    }
  }
  Transaction.init(
    {
      BusinessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Business ID is required",
          },
        },
      },
      type: {
        type: DataTypes.ENUM("income", "expense"),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Transaction type is required",
          },
          isIn: {
            args: [["income", "expense"]],
            msg: "Type must be either 'income' or 'expense'",
          },
        },
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Total amount is required",
          },
          isFloat: {
            msg: "Total amount must be a valid number",
          },
          min: {
            args: [0],
            msg: "Total amount must be greater than or equal to 0",
          },
        },
      },
      paymentMethod: {
        type: DataTypes.ENUM("cash", "credit_card", "e_wallet"),
        allowNull: false,
        validate: {
          notNull: {
            msg: "Payment method is required",
          },
          isIn: {
            args: [["cash", "credit_card", "e_wallet"]],
            msg: "Payment method must be 'cash', 'credit_card', or 'e_wallet'",
          },
        },
      },
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Transaction",
    },
  );
  return Transaction;
};
