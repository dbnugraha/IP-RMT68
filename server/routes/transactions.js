// server/routes/transactions.js
const router = require("express").Router({ mergeParams: true });
const TransactionController = require("../controllers/TransactionController");

// routes /businesses/:businessId/transactions

router.get("/", TransactionController.getTransactionsByBusinessId);
router.get("/stats", TransactionController.getTransactionStats);
router.post("/", TransactionController.createTransaction);
router.get("/:id", TransactionController.getTransactionById);
router.put("/:id", TransactionController.updateTransaction);
router.delete("/:id", TransactionController.deleteTransaction);

module.exports = router;
