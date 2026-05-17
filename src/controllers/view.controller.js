const studentsService = require("../services/students.service");
const coursesService = require("../services/courses.service");

function dashboard(req, res) {
  const students = studentsService.listStudents({});
  const courses = coursesService.listCourses({});

  const studentRows = students
    .map(
      (student) => `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.email}</td>
          <td>${student.courseCode}</td>
          <td><span class="badge">${student.status}</span></td>
        </tr>
      `
    )
    .join("");

  const courseCards = courses
    .map(
      (course) => `
        <div class="card">
          <h3>${course.code}</h3>
          <p>${course.title}</p>
          <small>${course.level} · ${course.active ? "active" : "inactive"}</small>
        </div>
      `
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SIT753 Student Platform</title>
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f3f4f6;
            color: #111827;
          }

          header {
            background: #111827;
            color: white;
            padding: 28px 48px;
          }

          main {
            padding: 32px 48px;
          }

          .summary {
            display: flex;
            gap: 16px;
            margin-bottom: 24px;
          }

          .metric {
            background: white;
            border-radius: 14px;
            padding: 18px 22px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            min-width: 180px;
          }

          .metric strong {
            display: block;
            font-size: 32px;
            margin-bottom: 4px;
          }

          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }

          .card {
            background: white;
            border-radius: 14px;
            padding: 18px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          }

          th, td {
            padding: 14px 16px;
            border-bottom: 1px solid #e5e7eb;
            text-align: left;
          }

          th {
            background: #1f2937;
            color: white;
          }

          .badge {
            background: #dcfce7;
            color: #166534;
            padding: 5px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: bold;
          }

          a {
            color: #2563eb;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>SIT753 Student Platform</h1>
          <p>Production-like backend demo for Jenkins DevOps pipeline practice</p>
        </header>

        <main>
          <section class="summary">
            <div class="metric">
              <strong>${students.length}</strong>
              Students
            </div>
            <div class="metric">
              <strong>${courses.length}</strong>
              Courses
            </div>
            <div class="metric">
              <strong>UP</strong>
              Health
            </div>
          </section>

          <h2>Courses</h2>
          <section class="grid">
            ${courseCards}
          </section>

          <h2>Students</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${studentRows}</tbody>
          </table>

          <p>
            API: <a href="/api/v1/students">/api/v1/students</a> ·
            Health: <a href="/health/ready">/health/ready</a> ·
            Metrics: <a href="/metrics">/metrics</a>
          </p>
        </main>
      </body>
    </html>
  `);
}

module.exports = {
  dashboard
};
