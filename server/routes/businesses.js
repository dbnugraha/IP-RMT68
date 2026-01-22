const router = require("express").Router({ mergeParams: true });
const BusinessController = require("../controllers/BusinessController");

router.post("/", BusinessController.createBusiness);
// router.get("/", BusinessController.fetchAllBusinesses);
router.get("/my", BusinessController.fetchMyBusinesses);

router.use("/:businessId", require("../middlewares/businessAuthorization"));
router.get("/:businessId", BusinessController.fetchBusiness);
router.put("/:businessId", BusinessController.updateBusiness);
router.delete("/:businessId", BusinessController.deleteBusiness);

router.use("/:businessId/products", require("./products"));
router.use("/:businessId/transactions", require("./transactions"));
router.use("/:businessId/analytics", require("./analytics"));
router.use("/:businessId/insights", require("./insights"));

module.exports = router;
