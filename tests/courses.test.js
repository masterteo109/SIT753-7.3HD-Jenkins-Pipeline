process.env.NODE_ENV = "test";
process.env.API_KEY = "test-api-key";
process.env.DATA_FILE = "./data/test-courses-db.json";

const request = require("supertest");
const app = require("../src/app");
const { resetDb } = require("../src/data/database");

beforeEach(() => {
  resetDb();
});

describe("Course API", () => {
  test("GET /api/v1/courses should list courses", async () => {
    const response = await request(app).get("/api/v1/courses");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBeGreaterThanOrEqual(3);
  });

  test("POST /api/v1/courses should create a course", async () => {
    const response = await request(app)
      .post("/api/v1/courses")
      .set("X-API-Key", "test-api-key")
      .send({
        code: "SIT999",
        title: "Advanced DevOps Practice",
        level: "postgraduate",
        active: true
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.code).toBe("SIT999");
  });

  test("POST /api/v1/courses should reject duplicate course code", async () => {
    const response = await request(app)
      .post("/api/v1/courses")
      .set("X-API-Key", "test-api-key")
      .send({
        code: "SIT753",
        title: "Duplicate Course",
        level: "postgraduate"
      });

    expect(response.statusCode).toBe(409);
  });
});
