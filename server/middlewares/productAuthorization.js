// server/middlewares/productAuthorization.js
const { Product, Business } = require("../models");

const productAuthorization = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: productId, businessId } = req.params;
    const { BusinessId } = req.body;

    // Determine which business ID to check
    let businessIdToCheck = businessId || BusinessId;

    // If we have a product ID, fetch the product and get its BusinessId
    if (productId) {
      const product = await Product.findByPk(productId, {
        include: [{ model: Business }],
      });

      if (!product) {
        throw { name: "NotFoundError", message: "Product not found" };
      }

      businessIdToCheck = product.BusinessId;
    }

    // Verify the business belongs to the user
    if (businessIdToCheck) {
      const business = await Business.findByPk(businessIdToCheck);

      if (!business) {
        throw { name: "NotFoundError", message: "Business not found" };
      }

      if (business.UserId !== userId) {
        throw { name: "ForbiddenError", message: "You do not have access to this product" };
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = productAuthorization;
