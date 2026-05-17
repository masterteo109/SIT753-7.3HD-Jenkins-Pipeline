const coursesService = require("../services/courses.service");

function listCourses(req, res) {
  const active =
    req.query.active === undefined ? undefined : String(req.query.active).toLowerCase() === "true";

  const courses = coursesService.listCourses({ active });

  res.json({
    count: courses.length,
    data: courses
  });
}

function getCourse(req, res) {
  const course = coursesService.getCourse(req.params.code);
  res.json(course);
}

function createCourse(req, res) {
  const course = coursesService.createCourse(req.body);
  res.status(201).json(course);
}

function updateCourse(req, res) {
  const course = coursesService.updateCourse(req.params.code, req.body);
  res.json(course);
}

module.exports = {
  listCourses,
  getCourse,
  createCourse,
  updateCourse
};
