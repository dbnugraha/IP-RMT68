// server/migrations/20260122000000-create-ai-insight.js
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AIInsights", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      BusinessId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Businesses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      insightType: {
        type: Sequelize.ENUM("daily", "weekly", "monthly", "custom"),
        defaultValue: "daily",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB,
      },
      generatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add index for faster queries
    await queryInterface.addIndex("AIInsights", ["BusinessId", "generatedAt"]);
    await queryInterface.addIndex("AIInsights", ["insightType"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("AIInsights");
  },
};
