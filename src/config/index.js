const path = require("node:path");
require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";

const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:8081,http://localhost:8082")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const config = {
  nodeEnv,
  port: Number(process.env.PORT || 3000),
  apiKey: process.env.API_KEY || "dev-api-key",
  corsOrigins,
  dataFile:
    process.env.DATA_FILE ||
    path.join(process.cwd(), "data", nodeEnv === "test" ? "test-db.json" : "students-db.json"),
  logLevel: process.env.LOG_LEVEL || "info",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120)
};

module.exports = config;