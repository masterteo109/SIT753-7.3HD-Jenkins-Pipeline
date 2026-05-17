const express = require("express");
const studentsRoutes = require("./students.routes");
const coursesRoutes = require("./courses.routes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    service: "sit753-student-platform",
    version: "2.0.0",
    endpoints: {
      dashboard: "/view",
      healthLive: "/health/live",
      healthReady: "/health/ready",
      metrics: "/metrics",
      students: "/api/v1/students",
      courses: "/api/v1/courses"
    }
  });
});

router.use("/students", studentsRoutes);
router.use("/courses", coursesRoutes);

module.exports = router;
