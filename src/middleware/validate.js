const { validationResult } = require("express-validator");
const { AppError } = require("../utils/errors");

function validate(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const details = result.array().map((item) => ({
    field: item.path,
    message: item.msg
  }));

  return next(new AppError("Validation failed", 400, details));
}

module.exports = validate;
