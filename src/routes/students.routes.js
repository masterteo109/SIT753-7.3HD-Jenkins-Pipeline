const express = require("express");
const { body, param, query } = require("express-validator");
const studentsController = require("../controllers/students.controller");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middleware/validate");
const { requireApiKey } = require("../middleware/auth");

const router = express.Router();

const idValidator = param("id").isInt({ min: 1 }).withMessage("Student id must be a positive integer");

const listValidators = [
  query("status")
    .optional()
    .isIn(["active", "inactive", "completed"])
    .withMessage("Status must be active, inactive, or completed"),
  query("courseCode").optional().trim().isLength({ min: 3 }).withMessage("Course code is too short"),
  query("search").optional().trim().isLength({ min: 1 }).withMessage("Search cannot be empty")
];

const createStudentValidators = [
  body("name").trim().isLength({ min: 2 }).withMessage("Student name must be at least 2 characters"),
  body("email").isEmail().withMessage("A valid email address is required"),
  body("courseCode").trim().isLength({ min: 3 }).withMessage("Course code is required"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "completed"])
    .withMessage("Status must be active, inactive, or completed")
];

const updateStudentValidators = [
  body("name").optional().trim().isLength({ min: 2 }).withMessage("Student name is too short"),
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("courseCode").optional().trim().isLength({ min: 3 }).withMessage("Course code is required"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "completed"])
    .withMessage("Status must be active, inactive, or completed")
];

router.get("/", listValidators, validate, asyncHandler(studentsController.listStudents));
router.get("/:id", idValidator, validate, asyncHandler(studentsController.getStudent));

router.post(
  "/",
  requireApiKey,
  createStudentValidators,
  validate,
  asyncHandler(studentsController.createStudent)
);

router.put(
  "/:id",
  requireApiKey,
  idValidator,
  updateStudentValidators,
  validate,
  asyncHandler(studentsController.updateStudent)
);

router.delete(
  "/:id",
  requireApiKey,
  idValidator,
  validate,
  asyncHandler(studentsController.deleteStudent)
);

module.exports = router;
