const router = require("express").Router({ mergeParams: true });
const BusinessController = require("../controllers/BusinessController");

router.post("/", BusinessController.createBusiness);
router.get("/", BusinessController.fetchAllBusinesses);
router.get("/my-businesses", BusinessController.fetchMyBusinesses);

router.use("/:businessId", require("../middlewares/businessAuthorization"));
router.get("/:businessId", BusinessController.fetchBusiness);
router.put("/:businessId", BusinessController.updateBusiness);
router.delete("/:businessId", BusinessController.deleteBusiness);

router.use("/:businessId/products", require("./products"));
router.use("/:businessId/transactions", require("./transactions"));

module.exports = router;
