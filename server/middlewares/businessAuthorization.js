const { Business } = require("../models");

const businessAuthorization = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { businessId } = req.params;
    const business = await Business.findByPk(businessId);
    if (!business) {
      throw { name: "NotFoundError", message: "Business not found" };
    }
    if (business.UserId !== id) {
      throw { name: "ForbiddenError", message: "You do not have access to this business" };
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = businessAuthorization;
