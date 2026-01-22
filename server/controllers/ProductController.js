// server/controllers/ProductController.js
const { Product, Business, TransactionItem, Transaction } = require("../models");

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

  // PATCH restock product
  static async restockProduct(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const { additionalStock, generateTransaction = false, paymentMethod = "cash" } = req.body;
      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId,
        },
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }
      const newStock = product.stock + additionalStock;
      await product.update({ stock: newStock });

      // create Transaction after user restocks product
      if (generateTransaction) {
        const transaction = await Transaction.create({
          BusinessId: businessId,
          type: "expense",
          paymentMethod: paymentMethod,
          totalAmount: additionalStock * product.sellingPrice,
          notes: `Restocked ${additionalStock} units of ${product.name}`,
        });

        await TransactionItem.create({
          ProductId: product.id,
          quantity: additionalStock,
          type: "restock",
          price: product.sellingPrice,
          TransactionId: transaction.id,
        });
      }

      res.status(200).json({ product, transactionGenerated: generateTransaction });
    } catch (error) {
      next(error);
    }
  }

  static async deductProduct(req, res, next) {
    try {
      const { businessId, id } = req.params;
      const { quantity, generateTransaction = false, paymentMethod = "cash" } = req.body;
      const product = await Product.findOne({
        where: {
          id: id,
          BusinessId: businessId,
        },
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }
      if (product.stock < quantity) {
        throw { name: "InsufficientStockError", message: "Not enough stock to deduct the requested quantity" };
      }
      const newStock = product.stock - quantity;
      await product.update({ stock: newStock });

      // create Transaction after user deducts stock
      if (generateTransaction) {
        const transaction = await Transaction.create({
          BusinessId: businessId,
          type: "income",
          paymentMethod: paymentMethod,
          totalAmount: quantity * product.sellingPrice,
          notes: `Sold ${quantity} units of ${product.name}`,
        });

        await TransactionItem.create({
          ProductId: product.id,
          quantity: quantity,
          type: "sale",
          price: product.sellingPrice,
          TransactionId: transaction.id,
        });
      }

      res.status(200).json({ product, transactionGenerated: generateTransaction });
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

      if (product.stock > 0) {
        throw { name: "ForbiddenError", message: "Cannot delete product with remaining stock" };
      }

      if (product.isActive) {
        throw { name: "ForbiddenError", message: "Cannot delete an active product" };
      }

      await product.destroy();

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async softDeleteProduct(req, res, next) {
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
      await product.update({ isDeleted: true });
      res.status(200).json({ message: "Product soft deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
};
