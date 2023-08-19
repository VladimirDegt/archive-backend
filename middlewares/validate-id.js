const { isValidObjectId } = require("mongoose");
const HttpError = require("../utils/http-error");

const isValidId = (req, _, next) => {
  const id = req.params.dogovirId;
  if (!isValidObjectId(id)) {
    next(HttpError(400, `${id} is not valid id`));
  }
  next();
};

module.exports = isValidId;
