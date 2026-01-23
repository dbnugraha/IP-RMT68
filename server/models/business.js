"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Business.belongsTo(models.User, { foreignKey: "UserId" });
      Business.hasMany(models.Transaction, { foreignKey: "BusinessId" });
    }
  }
  Business.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name cannot be empty",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://placehold.co/540x240",
        validate: {
          isUrl: {
            msg: "Image URL must be a valid URL",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description is required",
          },
          notEmpty: {
            msg: "Description cannot be empty",
          },
        },
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Business type is required",
          },
          notEmpty: {
            msg: "Business type cannot be empty",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Address is required",
          },
          notEmpty: {
            msg: "Address cannot be empty",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User ID is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Business",
    },
  );

  Business.beforeCreate(async (business, options) => {
    const count = await Business.count({ where: { UserId: business.UserId } });
    if (count >= 3) {
      throw { name: "BusinessLimitError", message: "User has reached the maximum number of businesses allowed." };
    }
  });
  return Business;
};
