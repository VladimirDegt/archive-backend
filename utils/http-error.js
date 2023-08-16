const errorMessageList = {
  400: "Bad Request",
  401: "Not authorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict"
}

const HttpError = (status, message = errorMessageList[status]) => {
  const error = new Error();
  error.status = status;
  error.message = message;

  return error;
};

module.exports = HttpError;
