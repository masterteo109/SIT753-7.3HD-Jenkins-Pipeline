process.env.NODE_ENV = "test";
process.env.API_KEY = "test-api-key";
process.env.DATA_FILE = "./data/test-students-db.json";

const request = require("supertest");
const app = require("../src/app");
const { resetDb } = require("../src/data/database");

beforeEach(() => {
  resetDb();
});

describe("Student API", () => {
  test("GET /api/v1/students should list students", async () => {
    const response = await request(app).get("/api/v1/students");

    expect(response.statusCode).toBe(200);
    expect(response.body.count).toBe(2);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("GET /api/v1/students/1 should return one student", async () => {
    const response = await request(app).get("/api/v1/students/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("quang.nguyen@example.com");
  });

  test("POST /api/v1/students should reject request without API key", async () => {
    const response = await request(app)
      .post("/api/v1/students")
      .send({
        name: "Lan Nguyen",
        email: "lan.nguyen@example.com",
        courseCode: "SIT753"
      });

    expect(response.statusCode).toBe(401);
  });

  test("POST /api/v1/students should validate request body", async () => {
    const response = await request(app)
      .post("/api/v1/students")
      .set("X-API-Key", "test-api-key")
      .send({
        name: "A",
        email: "invalid-email",
        courseCode: "SIT753"
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe("Validation failed");
  });

  test("POST /api/v1/students should create a student with valid API key", async () => {
    const response = await request(app)
      .post("/api/v1/students")
      .set("X-API-Key", "test-api-key")
      .send({
        name: "Lan Nguyen",
        email: "lan.nguyen@example.com",
        courseCode: "SIT753",
        status: "active"
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(3);
    expect(response.body.email).toBe("lan.nguyen@example.com");
  });

  test("PUT /api/v1/students/1 should update a student", async () => {
    const response = await request(app)
      .put("/api/v1/students/1")
      .set("X-API-Key", "test-api-key")
      .send({
        status: "completed"
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("completed");
  });

  test("DELETE /api/v1/students/1 should delete a student", async () => {
    const response = await request(app)
      .delete("/api/v1/students/1")
      .set("X-API-Key", "test-api-key");

    expect(response.statusCode).toBe(204);
  });
});
