process.env.NODE_ENV = "test";
process.env.API_KEY = "test-api-key";
process.env.DATA_FILE = "./data/test-metrics-db.json";

const request = require("supertest");
const app = require("../src/app");
const { resetDb } = require("../src/data/database");

beforeEach(() => {
  resetDb();
});

describe("Metrics endpoint", () => {
  test("GET /metrics should expose Prometheus metrics", async () => {
    await request(app).get("/health/live");

    const response = await request(app).get("/metrics");

    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("student_platform_http_requests_total");
    expect(response.text).toContain("student_platform_process_cpu_user_seconds_total");
  });
});
