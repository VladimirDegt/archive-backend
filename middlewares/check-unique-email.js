const User = require("../models/user");
const HttpError = require("../utils/http-error");

const checkUniqueEmail = async (req, _, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    next(HttpError(409, "Email in use"));
  }
  next();
};

module.exports = checkUniqueEmail;
