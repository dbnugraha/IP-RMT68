const router = require("express").Router();

//sample route
router.get("/", (req, res) => {
  res.send("Welcome to the IP-RMT68 Portfolio Server!");
});

router.get("/test-gemini", async (req, res) => {
  const { test } = require("../helpers/gemini");
  try {
    const response = await test();
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: "Failed to get response from Gemini API" });
  }
});
module.exports = router;
