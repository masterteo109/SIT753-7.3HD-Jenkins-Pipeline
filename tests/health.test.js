process.env.NODE_ENV = "test";
process.env.API_KEY = "test-api-key";
process.env.DATA_FILE = "./data/test-health-db.json";

const request = require("supertest");
const app = require("../src/app");
const { resetDb } = require("../src/data/database");

beforeEach(() => {
  resetDb();
});

describe("Health endpoints", () => {
  test("GET /health/live should return UP", async () => {
    const response = await request(app).get("/health/live");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
  });

  test("GET /health/ready should return READY and dependency checks", async () => {
    const response = await request(app).get("/health/ready");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("READY");
    expect(response.body.checks.students).toBeGreaterThanOrEqual(2);
  });
});
