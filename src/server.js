const app = require("./app");
const config = require("./config");
const logger = require("./utils/logger");
const { readDb } = require("./data/database");

readDb();

const server = app.listen(config.port, () => {
  logger.info(`SIT753 Student Platform is running on port ${config.port}`);
});

function shutdown(signal) {
  logger.info(`Received ${signal}. Closing HTTP server...`);
  server.close(() => {
    logger.info("HTTP server closed.");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
