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
      name: DataTypes.STRING,
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://placehold.co/540x240",
      },
      description: DataTypes.TEXT,
      type: DataTypes.STRING,
      address: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
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
