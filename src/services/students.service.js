const studentsRepository = require("../repositories/students.repository");
const coursesRepository = require("../repositories/courses.repository");
const { AppError } = require("../utils/errors");

function listStudents(filters) {
  return studentsRepository.findAll(filters);
}

function getStudent(id) {
  const student = studentsRepository.findById(id);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
}

function createStudent(input) {
  const existingEmail = studentsRepository.findByEmail(input.email);

  if (existingEmail) {
    throw new AppError("Student email already exists", 409);
  }

  const course = coursesRepository.findByCode(input.courseCode);

  if (!course || !course.active) {
    throw new AppError("Course does not exist or is inactive", 400);
  }

  return studentsRepository.create(input);
}

function updateStudent(id, input) {
  const current = studentsRepository.findById(id);

  if (!current) {
    throw new AppError("Student not found", 404);
  }

  if (input.email) {
    const existingEmail = studentsRepository.findByEmail(input.email);
    if (existingEmail && existingEmail.id !== Number(id)) {
      throw new AppError("Student email already exists", 409);
    }
  }

  if (input.courseCode) {
    const course = coursesRepository.findByCode(input.courseCode);
    if (!course || !course.active) {
      throw new AppError("Course does not exist or is inactive", 400);
    }
  }

  return studentsRepository.update(id, input);
}

function deleteStudent(id) {
  const deleted = studentsRepository.remove(id);

  if (!deleted) {
    throw new AppError("Student not found", 404);
  }

  return true;
}

module.exports = {
  listStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};
