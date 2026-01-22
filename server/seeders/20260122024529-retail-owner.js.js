"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Create the retail owner user
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          id: 100,
          email: "retailowner@store.com",
          password: await hashPassword("retailpass123"),
          firstName: "Budi",
          lastName: "Santoso",
          phoneNumber: "+628123456789",
          address: "Jl. Raya Veteran No. 88, Surabaya, Jawa Timur, Indonesia",
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2025-12-20"),
        },
      ],
      {},
    );

    // 2. Create the retail business
    await queryInterface.bulkInsert(
      "Businesses",
      [
        {
          id: 100,
          name: "Toko Elektronik Sejahtera",
          imageUrl: "https://images.unsplash.com/photo-1601524909162-ae8725290836?w=540&h=240&fit=crop",
          description:
            "Toko elektronik dan gadget lengkap dengan harga terjangkau. Menjual smartphone, laptop, aksesoris, dan perlengkapan elektronik lainnya.",
          type: "Retail - Electronics",
          address: "Jl. Raya Veteran No. 88, Surabaya, Jawa Timur, Indonesia",
          UserId: 100,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2025-12-20"),
        },
      ],
      {},
    );

    // 3. Create 15 products
    await queryInterface.bulkInsert(
      "Products",
      [
        {
          id: 100,
          BusinessId: 100,
          name: "Samsung Galaxy A54 5G",
          imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=540&h=240&fit=crop",
          description: "Smartphone Samsung Galaxy A54 5G dengan kamera 50MP, RAM 8GB, Storage 256GB",
          stockKeepingUnit: "PHONE-SAM-A54-001",
          basePrice: 4500000,
          sellingPrice: 5499000,
          stock: 8,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 101,
          BusinessId: 100,
          name: "iPhone 14 128GB",
          imageUrl: "https://images.unsplash.com/photo-1592286927505-4fb856d7eb3c?w=540&h=240&fit=crop",
          description: "Apple iPhone 14 128GB, layar Super Retina XDR 6.1 inch",
          stockKeepingUnit: "PHONE-IPH-14-001",
          basePrice: 11000000,
          sellingPrice: 13999000,
          stock: 3,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 102,
          BusinessId: 100,
          name: "Xiaomi Redmi Note 12 Pro",
          imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=540&h=240&fit=crop",
          description: "Xiaomi Redmi Note 12 Pro, Snapdragon 732G, 8GB/256GB",
          stockKeepingUnit: "PHONE-XIA-N12P-001",
          basePrice: 2800000,
          sellingPrice: 3599000,
          stock: 12,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 103,
          BusinessId: 100,
          name: "ASUS VivoBook 14",
          imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=540&h=240&fit=crop",
          description: "Laptop ASUS VivoBook 14, Intel Core i5-1135G7, RAM 8GB, SSD 512GB",
          stockKeepingUnit: "LAPTOP-ASUS-VB14-001",
          basePrice: 6500000,
          sellingPrice: 8299000,
          stock: 5,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 104,
          BusinessId: 100,
          name: "Lenovo IdeaPad Slim 3",
          imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=540&h=240&fit=crop",
          description: "Lenovo IdeaPad Slim 3, AMD Ryzen 5 5500U, 8GB RAM, 512GB SSD",
          stockKeepingUnit: "LAPTOP-LEN-IP3-001",
          basePrice: 5800000,
          sellingPrice: 7499000,
          stock: 6,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 105,
          BusinessId: 100,
          name: "Apple AirPods Pro 2",
          imageUrl: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=540&h=240&fit=crop",
          description: "Apple AirPods Pro generasi 2 dengan Active Noise Cancellation",
          stockKeepingUnit: "AUDIO-APP-AP2-001",
          basePrice: 2800000,
          sellingPrice: 3699000,
          stock: 15,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 106,
          BusinessId: 100,
          name: "Samsung Galaxy Buds2 Pro",
          imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=540&h=240&fit=crop",
          description: "Samsung Galaxy Buds2 Pro dengan 360 Audio dan ANC",
          stockKeepingUnit: "AUDIO-SAM-GB2P-001",
          basePrice: 1800000,
          sellingPrice: 2499000,
          stock: 20,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 107,
          BusinessId: 100,
          name: "Logitech MX Master 3S",
          imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=540&h=240&fit=crop",
          description: "Mouse wireless premium Logitech MX Master 3S",
          stockKeepingUnit: "ACC-LOG-MXM3S-001",
          basePrice: 1100000,
          sellingPrice: 1499000,
          stock: 18,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 108,
          BusinessId: 100,
          name: "Keychron K2 Mechanical Keyboard",
          imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=540&h=240&fit=crop",
          description: "Mechanical keyboard Keychron K2 wireless dengan gateron switch",
          stockKeepingUnit: "ACC-KEY-K2-001",
          basePrice: 900000,
          sellingPrice: 1299000,
          stock: 10,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 109,
          BusinessId: 100,
          name: "SanDisk Extreme Pro 1TB SSD",
          imageUrl: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=540&h=240&fit=crop",
          description: "SSD Eksternal SanDisk Extreme Pro 1TB dengan kecepatan baca 1050MB/s",
          stockKeepingUnit: "STORAGE-SAN-EP1TB-001",
          basePrice: 1800000,
          sellingPrice: 2399000,
          stock: 14,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 110,
          BusinessId: 100,
          name: "Anker PowerCore 20000mAh",
          imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=540&h=240&fit=crop",
          description: "Power bank Anker PowerCore 20000mAh dengan fast charging",
          stockKeepingUnit: "ACC-ANK-PC20K-001",
          basePrice: 350000,
          sellingPrice: 499000,
          stock: 25,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 111,
          BusinessId: 100,
          name: "Spigen Tough Armor Case",
          imageUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=540&h=240&fit=crop",
          description: "Case smartphone Spigen Tough Armor dengan proteksi maksimal",
          stockKeepingUnit: "ACC-SPI-TA-001",
          basePrice: 180000,
          sellingPrice: 299000,
          stock: 40,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 112,
          BusinessId: 100,
          name: "USB-C Hub 7-in-1",
          imageUrl: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=540&h=240&fit=crop",
          description: "USB-C Hub multifungsi 7-in-1 dengan HDMI, USB 3.0, SD Card Reader",
          stockKeepingUnit: "ACC-HUB-7IN1-001",
          basePrice: 250000,
          sellingPrice: 399000,
          stock: 22,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 113,
          BusinessId: 100,
          name: "Logitech C920 Webcam",
          imageUrl: "https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?w=540&h=240&fit=crop",
          description: "Webcam Logitech C920 Full HD 1080p untuk video call dan streaming",
          stockKeepingUnit: "ACC-LOG-C920-001",
          basePrice: 900000,
          sellingPrice: 1299000,
          stock: 8,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
        {
          id: 114,
          BusinessId: 100,
          name: "TP-Link Archer AX55 Router",
          imageUrl: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=540&h=240&fit=crop",
          description: "Router WiFi 6 TP-Link Archer AX55 dual-band dengan kecepatan hingga 3000Mbps",
          stockKeepingUnit: "NET-TPL-AX55-001",
          basePrice: 900000,
          sellingPrice: 1299000,
          stock: 7,
          isActive: true,
          createdAt: new Date("2025-12-20"),
          updatedAt: new Date("2026-01-22"),
        },
      ],
      {},
    );

    // 4. Create transactions (sales and restocks) over 1 month period
    // Starting from Dec 22, 2025 to Jan 22, 2026
    const transactions = [];
    const transactionItems = [];
    let transactionId = 100;
    let transactionItemId = 100;

    // Week 1: Dec 22-28, 2025
    // Dec 22 - Restock transaction
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "expense",
      totalAmount: 87500000,
      paymentMethod: "credit_card",
      notes: "Initial product restock - supplier payment",
      createdAt: new Date("2025-12-22T09:00:00"),
      updatedAt: new Date("2025-12-22T09:00:00"),
    });
    transactionId++;

    // Dec 23 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 3599000,
      paymentMethod: "e_wallet",
      notes: "Walk-in customer - Xiaomi phone purchase",
      createdAt: new Date("2025-12-23T11:30:00"),
      updatedAt: new Date("2025-12-23T11:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 102,
      quantity: 1,
      price: 3599000,
      createdAt: new Date("2025-12-23T11:30:00"),
      updatedAt: new Date("2025-12-23T11:30:00"),
    });
    transactionId++;

    // Dec 24 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 1798000,
      paymentMethod: "cash",
      notes: "Customer bought accessories bundle",
      createdAt: new Date("2025-12-24T14:15:00"),
      updatedAt: new Date("2025-12-24T14:15:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 107,
      quantity: 1,
      price: 1499000,
      createdAt: new Date("2025-12-24T14:15:00"),
      updatedAt: new Date("2025-12-24T14:15:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 110,
      quantity: 1,
      price: 299000,
      createdAt: new Date("2025-12-24T14:15:00"),
      updatedAt: new Date("2025-12-24T14:15:00"),
    });
    transactionId++;

    // Dec 26 - Sales (big sale)
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 13999000,
      paymentMethod: "credit_card",
      notes: "Premium customer - iPhone purchase",
      createdAt: new Date("2025-12-26T10:00:00"),
      updatedAt: new Date("2025-12-26T10:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 101,
      quantity: 1,
      price: 13999000,
      createdAt: new Date("2025-12-26T10:00:00"),
      updatedAt: new Date("2025-12-26T10:00:00"),
    });
    transactionId++;

    // Dec 27 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 7796000,
      paymentMethod: "e_wallet",
      notes: "Corporate order - accessories for office",
      createdAt: new Date("2025-12-27T15:45:00"),
      updatedAt: new Date("2025-12-27T15:45:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 107,
      quantity: 3,
      price: 1499000,
      createdAt: new Date("2025-12-27T15:45:00"),
      updatedAt: new Date("2025-12-27T15:45:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 108,
      quantity: 2,
      price: 1299000,
      createdAt: new Date("2025-12-27T15:45:00"),
      updatedAt: new Date("2025-12-27T15:45:00"),
    });
    transactionId++;

    // Week 2: Dec 29 - Jan 4
    // Dec 29 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 8299000,
      paymentMethod: "credit_card",
      notes: "Student laptop purchase",
      createdAt: new Date("2025-12-29T11:20:00"),
      updatedAt: new Date("2025-12-29T11:20:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 103,
      quantity: 1,
      price: 8299000,
      createdAt: new Date("2025-12-29T11:20:00"),
      updatedAt: new Date("2025-12-29T11:20:00"),
    });
    transactionId++;

    // Dec 30 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 11997000,
      paymentMethod: "cash",
      notes: "Bulk phone accessories sale",
      createdAt: new Date("2025-12-30T16:30:00"),
      updatedAt: new Date("2025-12-30T16:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 106,
      quantity: 3,
      price: 2499000,
      createdAt: new Date("2025-12-30T16:30:00"),
      updatedAt: new Date("2025-12-30T16:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 110,
      quantity: 10,
      price: 499000,
      createdAt: new Date("2025-12-30T16:30:00"),
      updatedAt: new Date("2025-12-30T16:30:00"),
    });
    transactionId++;

    // Jan 2 - Restock
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "expense",
      totalAmount: 28000000,
      paymentMethod: "credit_card",
      notes: "Restock popular items - Samsung phones and accessories",
      createdAt: new Date("2026-01-02T09:00:00"),
      updatedAt: new Date("2026-01-02T09:00:00"),
    });
    transactionId++;

    // Jan 3 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 10998000,
      paymentMethod: "e_wallet",
      notes: "Double Samsung phone purchase",
      createdAt: new Date("2026-01-03T12:00:00"),
      updatedAt: new Date("2026-01-03T12:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 100,
      quantity: 2,
      price: 5499000,
      createdAt: new Date("2026-01-03T12:00:00"),
      updatedAt: new Date("2026-01-03T12:00:00"),
    });
    transactionId++;

    // Week 3: Jan 5-11
    // Jan 6 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 15798000,
      paymentMethod: "credit_card",
      notes: "Freelancer office setup - laptop and accessories",
      createdAt: new Date("2026-01-06T14:30:00"),
      updatedAt: new Date("2026-01-06T14:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 104,
      quantity: 2,
      price: 7499000,
      createdAt: new Date("2026-01-06T14:30:00"),
      updatedAt: new Date("2026-01-06T14:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 112,
      quantity: 2,
      price: 399000,
      createdAt: new Date("2026-01-06T14:30:00"),
      updatedAt: new Date("2026-01-06T14:30:00"),
    });
    transactionId++;

    // Jan 8 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 7395000,
      paymentMethod: "cash",
      notes: "Audio accessories bundle purchase",
      createdAt: new Date("2026-01-08T10:15:00"),
      updatedAt: new Date("2026-01-08T10:15:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 105,
      quantity: 2,
      price: 3699000,
      createdAt: new Date("2026-01-08T10:15:00"),
      updatedAt: new Date("2026-01-08T10:15:00"),
    });
    transactionId++;

    // Jan 10 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 4797000,
      paymentMethod: "e_wallet",
      notes: "Storage solutions purchase",
      createdAt: new Date("2026-01-10T13:45:00"),
      updatedAt: new Date("2026-01-10T13:45:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 109,
      quantity: 2,
      price: 2399000,
      createdAt: new Date("2026-01-10T13:45:00"),
      updatedAt: new Date("2026-01-10T13:45:00"),
    });
    transactionId++;

    // Jan 11 - Restock
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "expense",
      totalAmount: 35000000,
      paymentMethod: "credit_card",
      notes: "Restock laptops and premium phones",
      createdAt: new Date("2026-01-11T09:30:00"),
      updatedAt: new Date("2026-01-11T09:30:00"),
    });
    transactionId++;

    // Week 4: Jan 13-19
    // Jan 13 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 3896000,
      paymentMethod: "cash",
      notes: "Gaming setup peripherals",
      createdAt: new Date("2026-01-13T15:00:00"),
      updatedAt: new Date("2026-01-13T15:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 108,
      quantity: 2,
      price: 1299000,
      createdAt: new Date("2026-01-13T15:00:00"),
      updatedAt: new Date("2026-01-13T15:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 107,
      quantity: 1,
      price: 1299000,
      createdAt: new Date("2026-01-13T15:00:00"),
      updatedAt: new Date("2026-01-13T15:00:00"),
    });
    transactionId++;

    // Jan 15 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 27996000,
      paymentMethod: "credit_card",
      notes: "Premium phone purchase - 2 iPhones",
      createdAt: new Date("2026-01-15T11:00:00"),
      updatedAt: new Date("2026-01-15T11:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 101,
      quantity: 2,
      price: 13999000,
      createdAt: new Date("2026-01-15T11:00:00"),
      updatedAt: new Date("2026-01-15T11:00:00"),
    });
    transactionId++;

    // Jan 16 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 7196000,
      paymentMethod: "e_wallet",
      notes: "Small accessories bulk order",
      createdAt: new Date("2026-01-16T14:20:00"),
      updatedAt: new Date("2026-01-16T14:20:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 111,
      quantity: 15,
      price: 299000,
      createdAt: new Date("2026-01-16T14:20:00"),
      updatedAt: new Date("2026-01-16T14:20:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 110,
      quantity: 5,
      price: 499000,
      createdAt: new Date("2026-01-16T14:20:00"),
      updatedAt: new Date("2026-01-16T14:20:00"),
    });
    transactionId++;

    // Jan 17 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 2598000,
      paymentMethod: "cash",
      notes: "Networking equipment purchase",
      createdAt: new Date("2026-01-17T16:30:00"),
      updatedAt: new Date("2026-01-17T16:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 114,
      quantity: 2,
      price: 1299000,
      createdAt: new Date("2026-01-17T16:30:00"),
      updatedAt: new Date("2026-01-17T16:30:00"),
    });
    transactionId++;

    // Jan 18 - Restock
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "expense",
      totalAmount: 18500000,
      paymentMethod: "credit_card",
      notes: "Restock audio products and small accessories",
      createdAt: new Date("2026-01-18T10:00:00"),
      updatedAt: new Date("2026-01-18T10:00:00"),
    });
    transactionId++;

    // Week 5: Jan 20-22
    // Jan 20 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 10797000,
      paymentMethod: "credit_card",
      notes: "Student bundle - Xiaomi phones for siblings",
      createdAt: new Date("2026-01-20T12:30:00"),
      updatedAt: new Date("2026-01-20T12:30:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 102,
      quantity: 3,
      price: 3599000,
      createdAt: new Date("2026-01-20T12:30:00"),
      updatedAt: new Date("2026-01-20T12:30:00"),
    });
    transactionId++;

    // Jan 21 - Sales
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 16597000,
      paymentMethod: "e_wallet",
      notes: "Work from home complete setup",
      createdAt: new Date("2026-01-21T13:45:00"),
      updatedAt: new Date("2026-01-21T13:45:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 103,
      quantity: 2,
      price: 8299000,
      createdAt: new Date("2026-01-21T13:45:00"),
      updatedAt: new Date("2026-01-21T13:45:00"),
    });
    transactionId++;

    // Jan 22 - Sales (today)
    transactions.push({
      id: transactionId,
      BusinessId: 100,
      type: "income",
      totalAmount: 5995000,
      paymentMethod: "cash",
      notes: "Webcam and accessories for content creator",
      createdAt: new Date("2026-01-22T11:00:00"),
      updatedAt: new Date("2026-01-22T11:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 113,
      quantity: 3,
      price: 1299000,
      createdAt: new Date("2026-01-22T11:00:00"),
      updatedAt: new Date("2026-01-22T11:00:00"),
    });
    transactionItems.push({
      id: transactionItemId++,
      TransactionId: transactionId,
      ProductId: 109,
      quantity: 1,
      price: 2399000,
      createdAt: new Date("2026-01-22T11:00:00"),
      updatedAt: new Date("2026-01-22T11:00:00"),
    });

    await queryInterface.bulkInsert("Transactions", transactions, {});
    await queryInterface.bulkInsert("TransactionItems", transactionItems, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TransactionItems", { TransactionId: { [Sequelize.Op.gte]: 100 } }, {});
    await queryInterface.bulkDelete("Transactions", { BusinessId: 100 }, {});
    await queryInterface.bulkDelete("Products", { BusinessId: 100 }, {});
    await queryInterface.bulkDelete("Businesses", { id: 100 }, {});
    await queryInterface.bulkDelete("Users", { id: 100 }, {});
  },
};
