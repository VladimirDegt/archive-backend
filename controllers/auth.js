const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const gravatar = require("gravatar");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs/promises");
const User = require("../models/user");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const HttpError = require("../utils/http-error");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;

  const createHashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    avatarURL,
  });
  if (newUser) {
    res.status(201).json({
      user: {
        name: newUser.name,
        email: newUser.email,
        status: newUser.status
      },
    });
    return;
  }
  throw HttpError(404);
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    name: user.name,
    email: user.email,
    status: user.status
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.json({
    avatarURL,
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(401);
  }
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const updateFieldAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originlaname, size } = req.file;
  const maxSizeFile = 5 * 1024 * 1024;
  if (size > maxSizeFile) {
    throw HttpError(401, "File size exceeds the maximum limit (5MB).");
  }

  const filename = `${_id}.jpg`;
  const resultUpload = path.join(avatarsDir, filename);

  try {
    const file = await Jimp.read(tempUpload);
    const avatarNewSize = file.resize(250, 250);
    await avatarNewSize.writeAsync(tempUpload);
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    await fs.unlink(tempUpload);
    throw HttpError(404);
  }

  const avatarURL = path.join("avatars", filename);

  const user = await User.findById(_id);
  if (!user) {
    throw HttpError(401);
  }

  const updateUser = await User.findByIdAndUpdate(_id, { avatarURL });
  if (updateUser) {
    const user = await User.findById(_id);
    res.json(user.avatarURL);
  }
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateFieldAvatar: ctrlWrapper(updateFieldAvatar),
};
