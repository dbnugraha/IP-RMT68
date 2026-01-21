// server/controllers/ProductController.js
const { Product, Business } = require("../models");

module.exports = class ProductController {
  // GET products by Business ID
  static async getProductsByBusinessId(req, res, next) {
    try {
      const { businessId } = req.params;
      const products = await Product.findAll({
        where: { BusinessId: businessId },
        include: [
          {
            model: Business,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  // GET product by ID
  static async getProductById(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId, // Ensure product belongs to the business
        },
        include: [
          {
            model: Business,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  // POST create new product
  static async createProduct(req, res, next) {
    try {
      const { businessId } = req.params;
      const { name, imageUrl, description, stockKeepingUnit, basePrice, sellingPrice, stock, isActive } = req.body;

      const newProduct = await Product.create({
        BusinessId: businessId, // Use businessId from route params
        name,
        imageUrl,
        description,
        stockKeepingUnit,
        basePrice,
        sellingPrice,
        stock,
        isActive,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  // PUT/PATCH update product
  static async updateProduct(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const { name, imageUrl, description, stockKeepingUnit, basePrice, sellingPrice, stock, isActive } = req.body;

      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId, // Ensure product belongs to the business
        },
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      await product.update({
        name,
        imageUrl,
        description,
        stockKeepingUnit,
        basePrice,
        sellingPrice,
        stock,
        isActive,
      });

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  // PATCH update product stock
  static async updateProductStock(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const { stock } = req.body;

      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId,
        },
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      await product.update({ stock });

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  // PATCH toggle product active status
  static async toggleProductStatus(req, res, next) {
    try {
      const { businessId, id } = req.params;

      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId,
        },
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      await product.update({ isActive: !product.isActive });

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  // DELETE product
  static async deleteProduct(req, res, next) {
    try {
      const { businessId, id } = req.params;

      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId,
        },
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      await product.destroy();

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
};
