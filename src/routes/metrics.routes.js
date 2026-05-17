const express = require("express");
const metricsController = require("../controllers/metrics.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(metricsController.metrics));

module.exports = router;
