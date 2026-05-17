const studentsService = require("../services/students.service");

function listStudents(req, res) {
  const students = studentsService.listStudents({
    status: req.query.status,
    courseCode: req.query.courseCode,
    search: req.query.search
  });

  res.json({
    count: students.length,
    data: students
  });
}

function getStudent(req, res) {
  const student = studentsService.getStudent(req.params.id);
  res.json(student);
}

function createStudent(req, res) {
  const student = studentsService.createStudent(req.body);
  res.status(201).json(student);
}

function updateStudent(req, res) {
  const student = studentsService.updateStudent(req.params.id, req.body);
  res.json(student);
}

function deleteStudent(req, res) {
  studentsService.deleteStudent(req.params.id);
  res.status(204).send();
}

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
