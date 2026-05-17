const logger = require("../utils/logger");
const { AppError } = require("../utils/errors");

function notFoundHandler(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  logger.error("Request failed", {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack
  });

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal server error",
      statusCode,
      requestId: req.id,
      details: err.details || undefined
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
