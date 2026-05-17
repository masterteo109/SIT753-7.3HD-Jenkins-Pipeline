const coursesRepository = require("../repositories/courses.repository");
const { AppError } = require("../utils/errors");

function listCourses(filters) {
  return coursesRepository.findAll(filters);
}

function getCourse(code) {
  const course = coursesRepository.findByCode(code);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  return course;
}

function createCourse(input) {
  const existing = coursesRepository.findByCode(input.code);

  if (existing) {
    throw new AppError("Course code already exists", 409);
  }

  return coursesRepository.create(input);
}

function updateCourse(code, input) {
  const updated = coursesRepository.update(code, input);

  if (!updated) {
    throw new AppError("Course not found", 404);
  }

  return updated;
}

module.exports = {
  listCourses,
  getCourse,
  createCourse,
  updateCourse
};
