const fs = require("fs");
const config = require("../config");
const { readDb } = require("../data/database");

function live(req, res) {
  res.json({
    status: "UP",
    service: "sit753-student-platform",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime())
  });
}

function ready(req, res) {
  const db = readDb();
  const dataFileExists = fs.existsSync(config.dataFile);

  res.json({
    status: dataFileExists ? "READY" : "NOT_READY",
    service: "sit753-student-platform",
    checks: {
      dataFile: dataFileExists,
      courses: db.courses.length,
      students: db.students.length
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  live,
  ready
};
