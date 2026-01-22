const authentication = require("../middlewares/authentication");

//express rout
const router = require("express").Router();

// router.use("/samples", require("./samples"));
router.use("/auth", require("./auth"));
router.use(authentication);
router.use("/businesses", require("./businesses"));

module.exports = router;
