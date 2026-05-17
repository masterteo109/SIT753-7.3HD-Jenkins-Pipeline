const { readDb, writeDb } = require("../data/database");

function findAll({ active } = {}) {
  const db = readDb();
  let courses = db.courses;

  if (active !== undefined) {
    courses = courses.filter((course) => course.active === active);
  }

  return courses;
}

function findByCode(code) {
  const db = readDb();
  return db.courses.find((course) => course.code === String(code).toUpperCase()) || null;
}

function create(courseInput) {
  const db = readDb();
  const now = new Date().toISOString();

  const course = {
    code: String(courseInput.code).toUpperCase(),
    title: courseInput.title,
    level: courseInput.level,
    active: courseInput.active !== undefined ? courseInput.active : true,
    createdAt: now,
    updatedAt: now
  };

  db.courses.push(course);
  writeDb(db);

  return course;
}

function update(code, updateInput) {
  const db = readDb();
  const course = db.courses.find((item) => item.code === String(code).toUpperCase());

  if (!course) {
    return null;
  }

  course.title = updateInput.title || course.title;
  course.level = updateInput.level || course.level;
  if (updateInput.active !== undefined) {
    course.active = updateInput.active;
  }
  course.updatedAt = new Date().toISOString();

  writeDb(db);
  return course;
}

module.exports = {
  findAll,
  findByCode,
  create,
  update
};
