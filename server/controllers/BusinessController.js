const { Business } = require("../models");
module.exports = class BusinessController {
  static async createBusiness(req, res, next) {
    try {
      const { id } = req.user;
      const { name, description } = req.body;
      const newBusiness = await Business.create({ name, description, UserId: id });
      res.status(201).json(newBusiness);
    } catch (error) {
      next(error);
    }
  }

  static async fetchAllBusinesses(req, res, next) {
    try {
      const businesses = await Business.findAll({
        include: ["User"],
      });
      res.status(200).json(businesses);
    } catch (error) {
      next(error);
    }
  }

  static async fetchMyBusinesses(req, res, next) {
    try {
      const { id } = req.user;
      const businesses = await Business.findAll({ where: { UserId: id } });
      res.status(200).json(businesses);
    } catch (error) {
      next(error);
    }
  }

  static async fetchBusiness(req, res, next) {
    try {
      const { businessId } = req.params;
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw { name: "NotFoundError", message: "Business not found" };
      }
      res.status(200).json(business);
    } catch (error) {
      next(error);
    }
  }

  static async updateBusiness(req, res, next) {
    try {
      const { businessId } = req.params;
      const { name, description } = req.body;
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw { name: "NotFoundError", message: "Business not found" };
      }
      business.name = name || business.name;
      business.description = description || business.description;
      await business.save();
      res.status(200).json(business);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBusiness(req, res, next) {
    try {
      const { businessId } = req.params;
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw { name: "NotFoundError", message: "Business not found" };
      }
      await business.destroy();
      res.status(200).json({ message: "Business deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
};
