const { User } = require("../models");

module.exports = class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!password) {
        throw { name: "ValidationError", errors: [{ field: "password", message: "Password is required" }] };
      }

      await User.create({ email, password });
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const errors = [];
      if (!email) {
        errors.push({ field: "email", message: "Email is required" });
      }
      if (!password) {
        errors.push({ field: "password", message: "Password is required" });
      }
      if (errors.length) {
        throw { name: "ValidationError", errors };
      }

      const user = await User.findOne({ where: { email } });
      if (!user || !(await user.checkPassword(password))) {
        throw { name: "UnauthorizedError", message: "Invalid email or password" };
      }

      const token = user.generateToken({ id: user.id, email: user.email });

      res.status(200).json({ message: "Login successful", access_token: token });
    } catch (error) {
      next(error);
    }
  }

  static async loginGoogle(req, res, next) {
    try {
      const { credential } = req.body;

      if (!credential) {
        throw { name: "ValidationError", errors: [{ field: "credential", message: "Credential is required" }] };
      }

      const payload = await User.verifyCredential(credential);
      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          password: Math.random().toString(36).slice(-8),
          firstName: payload.given_name,
          lastName: payload.family_name,
          imageUrl: payload.picture,
        },
      });

      const token = user.generateToken({ id: user.id, email: user.email });

      res.status(200).json({ message: "Login successful", access_token: token });
    } catch (error) {
      next(error);
    }
  }
};
