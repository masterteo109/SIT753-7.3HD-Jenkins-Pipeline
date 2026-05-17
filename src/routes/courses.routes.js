const express = require("express");
const { body, param } = require("express-validator");
const coursesController = require("../controllers/courses.controller");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { requireApiKey } = require("../middleware/auth");

const router = express.Router();

const courseCodeValidator = param("code")
  .trim()
  .isLength({ min: 3, max: 12 })
  .withMessage("Course code must be between 3 and 12 characters");

const createCourseValidators = [
  body("code").trim().isLength({ min: 3, max: 12 }).withMessage("Course code is required"),
  body("title").trim().isLength({ min: 3 }).withMessage("Course title is required"),
  body("level")
    .isIn(["undergraduate", "postgraduate"])
    .withMessage("Level must be undergraduate or postgraduate"),
  body("active").optional().isBoolean().withMessage("Active must be a boolean")
];

const updateCourseValidators = [
  body("title").optional().trim().isLength({ min: 3 }).withMessage("Course title is too short"),
  body("level")
    .optional()
    .isIn(["undergraduate", "postgraduate"])
    .withMessage("Level must be undergraduate or postgraduate"),
  body("active").optional().isBoolean().withMessage("Active must be a boolean")
];

router.get("/", asyncHandler(coursesController.listCourses));
router.get("/:code", courseCodeValidator, validate, asyncHandler(coursesController.getCourse));

router.post(
  "/",
  requireApiKey,
  createCourseValidators,
  validate,
  asyncHandler(coursesController.createCourse)
);

router.put(
  "/:code",
  requireApiKey,
  courseCodeValidator,
  updateCourseValidators,
  validate,
  asyncHandler(coursesController.updateCourse)
);

module.exports = router;
