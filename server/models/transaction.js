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
      BusinessId: DataTypes.INTEGER,
      type: DataTypes.ENUM("income", "expense"),
      totalAmount: DataTypes.FLOAT,
      paymentMethod: DataTypes.ENUM("cash", "credit_card", "e_wallet"),
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Transaction",
    },
  );
  return Transaction;
};
