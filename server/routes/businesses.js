const router = require("express").Router();
const BusinessController = require("../controllers/BusinessController");
const businessAuthorization = require("../middlewares/businessAuthorization");

router.post("/", BusinessController.createBusiness);
router.get("/", BusinessController.fetchAllBusinesses);
router.get("/my-businesses", BusinessController.fetchMyBusinesses);

router.use("/:businessId", businessAuthorization);
router.get("/:businessId", BusinessController.fetchBusiness);
router.put("/:businessId", BusinessController.updateBusiness);
router.delete("/:businessId", BusinessController.deleteBusiness);

module.exports = router;
