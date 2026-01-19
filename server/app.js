const express = require("express");
const app = express();
const cors = require("cors");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the IP-RMT68 Portfolio Server!");
});

test;

// Export the app for use in www.js
module.exports = app;
