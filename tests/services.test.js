process.env.NODE_ENV = "test";
process.env.API_KEY = "test-api-key";
process.env.DATA_FILE = "./data/test-services-db.json";

const studentsService = require("../src/services/students.service");
const coursesService = require("../src/services/courses.service");
const { resetDb } = require("../src/data/database");

beforeEach(() => {
  resetDb();
});

describe("Unit Tests - Service Logic", () => {
  test("should return a list of courses", () => {
    const courses = coursesService.listCourses({});

    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
  });

  test("should reject duplicate course code", () => {
    expect(() => {
      coursesService.createCourse({
        code: "SIT753",
        title: "Duplicate Course",
        level: "postgraduate"
      });
    }).toThrow("Course code already exists");
  });

  test("should create a student when course exists", () => {
    const student = studentsService.createStudent({
      name: "Lan Nguyen",
      email: "lan.nguyen@example.com",
      courseCode: "SIT753",
      status: "active"
    });

    expect(student.name).toBe("Lan Nguyen");
    expect(student.email).toBe("lan.nguyen@example.com");
    expect(student.courseCode).toBe("SIT753");
  });

  test("should reject student when course does not exist", () => {
    expect(() => {
      studentsService.createStudent({
        name: "Invalid Student",
        email: "invalid@example.com",
        courseCode: "FAKE999",
        status: "active"
      });
    }).toThrow("Course does not exist or is inactive");
  });
});