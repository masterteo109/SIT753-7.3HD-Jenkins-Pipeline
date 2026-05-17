const express = require("express");
const viewController = require("../controllers/view.controller");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(viewController.dashboard));

module.exports = router;
