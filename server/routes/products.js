// server/routes/products.js
const router = require("express").Router({ mergeParams: true });
const ProductController = require("../controllers/ProductController");

// routes /businesses/:businessId/products

router.get("/", ProductController.getProductsByBusinessId);
router.post("/", ProductController.createProduct);
router.get("/:id", ProductController.getProductById);
router.put("/:id", ProductController.updateProduct);
router.patch("/:id/restock", ProductController.restockProduct);
router.patch("/:id/deduct-stock", ProductController.deductProduct);
router.patch("/:id/toggle-status", ProductController.toggleProductStatus);
// router.patch("/:id/soft-delete", ProductController.softDeleteProduct);
router.delete("/:id", ProductController.deleteProduct);

module.exports = router;
