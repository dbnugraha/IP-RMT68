const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./helpers/errorHandler");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);
app.use(errorHandler);

// Export the app for use in www.js
module.exports = app;
