"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.Business, { foreignKey: "BusinessId" });
      Product.hasMany(models.TransactionItem, { foreignKey: "ProductId" });
    }
  }
  Product.init(
    {
      BusinessId: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Product name cannot be empty",
          },
          notNull: {
            msg: "Product name is required",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://placehold.co/540x240",
      },
      description: {
        type: DataTypes.TEXT,
      },
      stockKeepingUnit: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Stock Keeping Unit cannot be empty",
          },
          notNull: {
            msg: "Stock Keeping Unit is required",
          },
        },
      },
      basePrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Base price cannot be empty",
          },
          notNull: {
            msg: "Base price is required",
          },
        },
      },
      sellingPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Selling price cannot be empty",
          },
          notNull: {
            msg: "Selling price is required",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Product",
    },
  );
  return Product;
};
