const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);

// Export the app for use in www.js
module.exports = app;
