const HttpError = require("../utils/http-error");

const validateBodyRequest = (schema) => {
  const inner = (req, _, next) => {
    if (Object.keys(req.body).length === 0) {
      next(HttpError(400, "missing fields"));
    }

    const { error } = schema.validate({
      ...req.body,
    });

    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };
  return inner;
};

module.exports = validateBodyRequest;
