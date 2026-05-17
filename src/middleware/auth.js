const config = require("../config");
const { AppError } = require("../utils/errors");

function requireApiKey(req, res, next) {
  const providedKey = req.headers["x-api-key"];

  if (!providedKey || providedKey !== config.apiKey) {
    return next(new AppError("Valid X-API-Key header is required for this operation", 401));
  }

  return next();
}

module.exports = {
  requireApiKey
};
