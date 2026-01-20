const { json } = require("sequelize");

module.exports = (err, req, res, next) => {
  console.error(err);

  const errorResponses = {
    SequelizeValidationError: () => {
      const messages = err.errors.map((e) => e.message);
      return { statusCode: 400, message: messages };
    },
    SequelizeUniqueConstraintError: () => {
      const messages = err.errors.map((e) => e.message);
      return { statusCode: 400, message: messages };
    },
    UnauthorizedError: () => {
      return { statusCode: 401, message: "Unauthorized" };
    },
    jsonwebtokenError: () => {
      return { statusCode: 401, message: "Invalid Token" };
    },
    invalidTokenError: () => {
      return { statusCode: 401, message: "Invalid Token" };
    },
    ForbiddenError: () => {
      return { statusCode: 403, message: "Forbidden" };
    },
    NotFoundError: () => {
      return { statusCode: 404, message: "Resource Not Found" };
    },
    default: () => {
      return { statusCode: 500, message: "Internal Server Error" };
    },
  };

  const errorResponse = (errorResponses[err.name] || errorResponses.default)();

  res.status(errorResponse.statusCode).json({ error: errorResponse.message });
};
