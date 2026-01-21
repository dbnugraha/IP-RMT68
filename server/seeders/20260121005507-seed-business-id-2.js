"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Businesses",
      [
        {
          name: "TechnoCore Solutions",
          imageUrl:
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
          description:
            "A comprehensive technology solutions provider specializing in web development, mobile applications, and digital transformation services for small to medium enterprises.",
          type: "Technology Services",
          address: "Jl. Sudirman No. 45, Jakarta Selatan, DKI Jakarta, Indonesia",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Warung Nasi Tradisional",
          imageUrl:
            "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
          description:
            "Traditional Indonesian restaurant serving authentic local dishes with modern presentation. Specializing in Nasi Gudeg, Rendang, and other traditional Indonesian cuisines.",
          type: "Food & Beverage",
          address: "Jl. Malioboro No. 123, Yogyakarta, DIY, Indonesia",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "DigitalBoost Marketing",
          imageUrl:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
          description:
            "Full-service digital marketing agency offering social media management, content creation, SEO optimization, and online advertising campaigns for businesses of all sizes.",
          type: "Marketing & Advertising",
          address: "Jl. Gatot Subroto Kav. 18, Jakarta Selatan, DKI Jakarta, Indonesia",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Toko Buku Nusantara",
          imageUrl:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2028&q=80",
          description:
            "Independent bookstore featuring a curated selection of Indonesian literature, international bestsellers, educational materials, and stationery supplies for students and professionals.",
          type: "Retail - Books & Education",
          address: "Jl. Cihampelas No. 67, Bandung, Jawa Barat, Indonesia",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "PT. Sawit Nusantara Jaya",
          imageUrl:
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          description:
            "Leading palm oil producer and distributor specializing in high-quality crude palm oil (CPO) and refined palm oil products. Serving both domestic and international markets with sustainable palm oil production practices.",
          type: "Agriculture & Commodities",
          address: "Jl. Industri Raya Blok C No. 15, Medan, Sumatera Utara, Indonesia",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Businesses", null, {});
  },
};
