const { json } = require("sequelize");

module.exports = (err, req, res, next) => {
  console.error(err.name, err?.errors, err.message);

  let errorResponse = {
    statusCode: 500,
    message: "Internal Server Error",
    details: [],
  };

  switch (err.name) {
    //400 Errors
    case "SequelizeValidationError":
      err.message = "Validation Error";
      err.errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    case "ValidationError":
      errorResponse.statusCode = 400;
      errorResponse.message = err.message || "Validation Error";
      errorResponse.details = err.errors || [];
      break;
    //401 Errors
    case "jsonWebTokenError":
      err.message = "Invalid Token";
    case "UnauthorizedError":
      errorResponse.statusCode = 401;
      errorResponse.message = err.message || "Unauthorized";
      break;
    //403 Errors
    case "ForbiddenError":
      errorResponse.statusCode = 403;
      errorResponse.message = err.message || "Forbidden";
      break;
    //404 Errors
    case "NotFoundError":
      errorResponse.statusCode = 404;
      errorResponse.message = err.message || "Resource Not Found";
      break;
    //409 Errors
    case "SequelizeUniqueConstraintError":
      err.errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
    case "EmailAlreadyExists":
      errorResponse.statusCode = 409;
      errorResponse.message = err.message || "Conflict";
      errorResponse.details = err.errors || [];
      break;
  }

  return res.status(errorResponse.statusCode).json({ message: errorResponse.message, details: errorResponse.details });
};
