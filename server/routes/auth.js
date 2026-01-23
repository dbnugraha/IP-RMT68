const router = require("express").Router();
const AuthController = require("../controllers/AuthController");

//? auth routes
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/google-login", AuthController.loginGoogle);

module.exports = router;
