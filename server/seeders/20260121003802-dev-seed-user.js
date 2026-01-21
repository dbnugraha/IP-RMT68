"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "admin@admin.admin",
          password: await hashPassword("password123"),
          firstName: "Admin User",
          lastName: "Admin",
          phoneNumber: "+12345678901",
          address: "123 Admin St, Admin City, Admin Country",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: process.env.DEV_EMAIL || "dimas@dimas.dimas",
          password: "",
          firstName: process.env.DEV_FIRSTNAME || "Dimas",
          lastName: process.env.DEV_LASTNAME || "Pratama",
          phoneNumber: process.env.DEV_PHONENUMBER || "+6281234567890",
          address: process.env.DEV_ADDRESS || "Jl. Example No.123, Jakarta, Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
