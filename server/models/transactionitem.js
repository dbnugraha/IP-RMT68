"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransactionItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TransactionItem.belongsTo(models.Transaction, { foreignKey: "TransactionId" });
      TransactionItem.belongsTo(models.Product, { foreignKey: "ProductId" });
    }
  }
  TransactionItem.init(
    {
      TransactionId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      type: DataTypes.ENUM("sale", "restock"),
    },
    {
      sequelize,
      modelName: "TransactionItem",
    },
  );
  return TransactionItem;
};
