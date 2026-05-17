const { readDb, writeDb } = require("../data/database");

function findAll({ status, courseCode, search } = {}) {
  const db = readDb();
  let students = db.students;

  if (status) {
    students = students.filter((student) => student.status === status);
  }

  if (courseCode) {
    students = students.filter((student) => student.courseCode === String(courseCode).toUpperCase());
  }

  if (search) {
    const lowered = String(search).toLowerCase();
    students = students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowered) ||
        student.email.toLowerCase().includes(lowered)
    );
  }

  return students;
}

function findById(id) {
  const db = readDb();
  return db.students.find((student) => student.id === Number(id)) || null;
}

function findByEmail(email) {
  const db = readDb();
  return db.students.find((student) => student.email.toLowerCase() === String(email).toLowerCase()) || null;
}

function create(studentInput) {
  const db = readDb();
  const now = new Date().toISOString();

  const student = {
    id: db.counters.studentId,
    name: studentInput.name,
    email: studentInput.email.toLowerCase(),
    courseCode: String(studentInput.courseCode).toUpperCase(),
    status: studentInput.status || "active",
    createdAt: now,
    updatedAt: now
  };

  db.counters.studentId += 1;
  db.students.push(student);
  writeDb(db);

  return student;
}

function update(id, updateInput) {
  const db = readDb();
  const student = db.students.find((item) => item.id === Number(id));

  if (!student) {
    return null;
  }

  student.name = updateInput.name || student.name;
  student.email = updateInput.email ? updateInput.email.toLowerCase() : student.email;
  student.courseCode = updateInput.courseCode ? String(updateInput.courseCode).toUpperCase() : student.courseCode;
  student.status = updateInput.status || student.status;
  student.updatedAt = new Date().toISOString();

  writeDb(db);
  return student;
}

function remove(id) {
  const db = readDb();
  const originalLength = db.students.length;
  db.students = db.students.filter((student) => student.id !== Number(id));

  if (db.students.length === originalLength) {
    return false;
  }

  writeDb(db);
  return true;
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove
};
