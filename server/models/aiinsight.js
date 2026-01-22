// server/models/aiinsight.js - Update to include summary field
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AIInsight extends Model {
    static associate(models) {
      AIInsight.belongsTo(models.Business, { foreignKey: "BusinessId" });
    }
  }
  AIInsight.init(
    {
      BusinessId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      insightType: {
        type: DataTypes.ENUM("daily", "weekly", "monthly", "custom"),
        defaultValue: "daily",
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      summary: {
        type: DataTypes.JSONB, // Digestible summary for UI
      },
      metadata: {
        type: DataTypes.JSONB,
      },
      generatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AIInsight",
    },
  );
  return AIInsight;
};
