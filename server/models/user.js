"use strict";
const { Model } = require("sequelize");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async checkPassword(password) {
      return await comparePassword(password, this.password);
    }

    generateToken(payload) {
      return generateToken(payload);
    }

    static async verifyCredential(credential) {
      return await require("../helpers/google").verifyGoogleToken(credential);
    }

    static associate(models) {
      User.hasMany(models.Business, { foreignKey: "UserId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Email address already in use!" },
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
          notEmpty: {
            msg: "Email cannot be empty",
          },
          notNull: {
            msg: "Email is required",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue: "https://placehold.co/64x64",
      },
      password: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        validate: {
          isValidPhoneNumber(value) {
            if (!value) return;
            const phoneRegex = /^\+[1-9]\d{7,14}$/; // E.164 format
            if (!phoneRegex.test(value)) {
              throw new Error("Phone number is not valid");
            }
          },
        },
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  User.beforeCreate(async (user) => {
    user.password = await hashPassword(user.password);
  });

  User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await hashPassword(user.password);
    }
  });

  return User;
};
