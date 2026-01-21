// server/seeders/20260121142000-seed-transaction-items.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "TransactionItems",
      [
        // Transaction 1: TechnoCore Solutions - Income 8,000,000 (Website Development)
        {
          TransactionId: 1,
          ProductId: 1, // Website Development Package - 8,000,000
          quantity: 1,
          price: 8000000,
          createdAt: new Date("2026-01-15"),
          updatedAt: new Date("2026-01-15"),
        },

        // Transaction 2: TechnoCore Solutions - Income 25,000,000 (Mobile App)
        {
          TransactionId: 2,
          ProductId: 2, // Mobile App Development - 25,000,000
          quantity: 1,
          price: 25000000,
          createdAt: new Date("2026-01-18"),
          updatedAt: new Date("2026-01-18"),
        },

        // Transaction 3: TechnoCore Solutions - Expense 5,000,000 (Office equipment - no items)
        // No transaction items for expense transactions

        // Transaction 4: TechnoCore Solutions - Expense 2,000,000 (Software licenses - no items)
        // No transaction items for expense transactions

        // Transaction 5: Warung Nasi - Income 1,500,000 (Lunch sales)
        // 25x Nasi Gudeg (35,000) = 875,000
        // 10x Rendang (50,000) = 500,000
        // 25x Es Teh (5,000) = 125,000
        // Total: 1,500,000
        {
          TransactionId: 5,
          ProductId: 4, // Nasi Gudeg Komplit
          quantity: 25,
          price: 35000,
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },
        {
          TransactionId: 5,
          ProductId: 5, // Rendang Sapi
          quantity: 10,
          price: 50000,
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },
        {
          TransactionId: 5,
          ProductId: 6, // Es Teh Manis
          quantity: 25,
          price: 5000,
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },

        // Transaction 6: Warung Nasi - Income 850,000 (Dinner sales)
        // 15x Ayam Goreng (40,000) = 600,000
        // 5x Nasi Gudeg (35,000) = 175,000
        // 15x Es Teh (5,000) = 75,000
        // Total: 850,000
        {
          TransactionId: 6,
          ProductId: 7, // Ayam Goreng Kremes
          quantity: 15,
          price: 40000,
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },
        {
          TransactionId: 6,
          ProductId: 4, // Nasi Gudeg Komplit
          quantity: 5,
          price: 35000,
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },
        {
          TransactionId: 6,
          ProductId: 6, // Es Teh Manis
          quantity: 15,
          price: 5000,
          createdAt: new Date("2026-01-20"),
          updatedAt: new Date("2026-01-20"),
        },

        // Transaction 7: Warung Nasi - Expense 3,000,000 (Ingredient purchase - no items)
        // No transaction items for expense transactions

        // Transaction 8: Warung Nasi - Expense 500,000 (Equipment repair - no items)
        // No transaction items for expense transactions

        // Transaction 9: Warung Nasi - Income 2,500,000 (Catering order)
        // 30x Rendang (50,000) = 1,500,000
        // 25x Ayam Goreng (40,000) = 1,000,000
        // Total: 2,500,000
        {
          TransactionId: 9,
          ProductId: 5, // Rendang Sapi
          quantity: 30,
          price: 50000,
          createdAt: new Date("2026-01-16"),
          updatedAt: new Date("2026-01-16"),
        },
        {
          TransactionId: 9,
          ProductId: 7, // Ayam Goreng Kremes
          quantity: 25,
          price: 40000,
          createdAt: new Date("2026-01-16"),
          updatedAt: new Date("2026-01-16"),
        },

        // Transaction 10: DigitalBoost - Income 3,500,000 (Social Media Management)
        {
          TransactionId: 10,
          ProductId: 8, // Social Media Management - Basic - 3,500,000
          quantity: 1,
          price: 3500000,
          createdAt: new Date("2026-01-19"),
          updatedAt: new Date("2026-01-19"),
        },

        // Transaction 11: DigitalBoost - Income 5,500,000 (SEO Optimization)
        {
          TransactionId: 11,
          ProductId: 9, // SEO Optimization Package - 5,500,000
          quantity: 1,
          price: 5500000,
          createdAt: new Date("2026-01-14"),
          updatedAt: new Date("2026-01-14"),
        },

        // Transaction 12: DigitalBoost - Expense 1,500,000 (Advertising budget - no items)
        // No transaction items for expense transactions

        // Transaction 13: DigitalBoost - Expense 800,000 (Software subscriptions - no items)
        // No transaction items for expense transactions

        // Transaction 14: Toko Buku - Income 450,000 (Book sales)
        // 3x Buku Novel (85,000) = 255,000
        // 1x Buku Pelajaran (125,000) = 125,000
        // 1x Paket Alat Tulis (120,000) = 70,000 (discounted)
        // Total: 450,000
        {
          TransactionId: 14,
          ProductId: 11, // Buku Novel Laskar Pelangi
          quantity: 3,
          price: 85000,
          createdAt: new Date("2026-01-21"),
          updatedAt: new Date("2026-01-21"),
        },
        {
          TransactionId: 14,
          ProductId: 13, // Buku Pelajaran Matematika SMA
          quantity: 1,
          price: 125000,
          createdAt: new Date("2026-01-21"),
          updatedAt: new Date("2026-01-21"),
        },
        {
          TransactionId: 14,
          ProductId: 12, // Paket Alat Tulis Sekolah (discounted price)
          quantity: 1,
          price: 70000,
          createdAt: new Date("2026-01-21"),
          updatedAt: new Date("2026-01-21"),
        },

        // Transaction 15: Toko Buku - Income 1,200,000 (Bulk stationery)
        // 10x Paket Alat Tulis (120,000) = 1,200,000
        {
          TransactionId: 15,
          ProductId: 12, // Paket Alat Tulis Sekolah
          quantity: 10,
          price: 120000,
          createdAt: new Date("2026-01-17"),
          updatedAt: new Date("2026-01-17"),
        },

        // Transaction 16: Toko Buku - Expense 5,000,000 (Inventory restocking - no items)
        // No transaction items for expense transactions

        // Transaction 17: Toko Buku - Expense 750,000 (Store rent - no items)
        // No transaction items for expense transactions

        // Transaction 18: PT. Sawit - Income 150,000,000 (CPO export)
        // 10x CPO 1 Ton (15,000,000) = 150,000,000
        {
          TransactionId: 18,
          ProductId: 14, // Crude Palm Oil (CPO) - 1 Ton
          quantity: 10,
          price: 15000000,
          createdAt: new Date("2026-01-19"),
          updatedAt: new Date("2026-01-19"),
        },

        // Transaction 19: PT. Sawit - Income 25,000,000 (Refined palm oil)
        // 1000x Refined Palm Oil 1 Liter (25,000) = 25,000,000
        {
          TransactionId: 19,
          ProductId: 15, // Refined Palm Oil - 1 Liter
          quantity: 1000,
          price: 25000,
          createdAt: new Date("2026-01-15"),
          updatedAt: new Date("2026-01-15"),
        },

        // Transaction 20: PT. Sawit - Expense 50,000,000 (Plantation maintenance - no items)
        // No transaction items for expense transactions

        // Transaction 21: PT. Sawit - Expense 15,000,000 (Transportation - no items)
        // No transaction items for expense transactions

        // Transaction 22: PT. Sawit - Expense 8,000,000 (Equipment maintenance - no items)
        // No transaction items for expense transactions
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TransactionItems", null, {});
  },
};
