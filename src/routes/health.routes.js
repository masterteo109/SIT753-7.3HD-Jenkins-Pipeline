const express = require("express");
const healthController = require("../controllers/health.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/live", asyncHandler(healthController.live));
router.get("/ready", asyncHandler(healthController.ready));

module.exports = router;
