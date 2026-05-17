const path = require("path");
require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "development";

const config = {
  nodeEnv,
  port: Number(process.env.PORT || 3000),
  apiKey: process.env.API_KEY || "dev-api-key",
  dataFile:
    process.env.DATA_FILE ||
    path.join(process.cwd(), "data", nodeEnv === "test" ? "test-db.json" : "students-db.json"),
  logLevel: process.env.LOG_LEVEL || "info",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 120)
};

module.exports = config;
