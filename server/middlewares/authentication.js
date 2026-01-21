const authentication = (req, res, next) => {
  let token = req.headers.authorization;
  console.log(token);

  if (!token) {
    throw { name: "UnauthorizedError", message: "Token not provided" };
  }

  token = token.replace("Bearer ", "");

  try {
    const decoded = require("../helpers/jwt").verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    throw { name: "UnauthorizedError", message: "Invalid token" };
  }
};

module.exports = authentication;
