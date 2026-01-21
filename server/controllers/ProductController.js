const { Product, Business } = require("../models");

module.exports = class ProductController {
  // GET all products
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll({
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
      const { id } = req.params;
      const product = await Product.findByPk(id, {
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

  // POST create new product
  static async createProduct(req, res, next) {
    try {
      const { BusinessId, name, imageUrl, description, stockKeepingUnit, basePrice, sellingPrice, stock, isActive } =
        req.body;

      const newProduct = await Product.create({
        BusinessId,
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
      const { id } = req.params;
      const { BusinessId, name, imageUrl, description, stockKeepingUnit, basePrice, sellingPrice, stock, isActive } =
        req.body;

      const product = await Product.findByPk(id);

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      await product.update({
        BusinessId,
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
      const { id } = req.params;
      const { stock } = req.body;

      const product = await Product.findByPk(id);

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
      const { id } = req.params;

      const product = await Product.findByPk(id);

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
      const { id } = req.params;

      const product = await Product.findByPk(id);

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
