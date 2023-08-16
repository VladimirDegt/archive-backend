const HttpError = require("./http-error");

const handleMongooseError = (error, _, next) => {
  const status = (error.name === "MongoServerError" && error.code === 11000) ? 409 : 400;
  next(HttpError(status, error.message));
};

module.exports = handleMongooseError;
