"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      BusinessId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Businesses",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      stockKeepingUnit: {
        type: Sequelize.STRING,
      },
      basePrice: {
        type: Sequelize.FLOAT,
      },
      sellingPrice: {
        type: Sequelize.FLOAT,
      },
      stock: {
        type: Sequelize.INTEGER,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
