const fs = require("fs/promises");
const path = require("path");
const File = require("../models/file");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");

const fileDir = path.join(__dirname, "../", "public", "files");

const add = async (req, res) => {
  const { id: owner } = req.user;
  console.log('req.body', req.body);
  const { path: tempUpload, originalname, size } = req.file;

  const maxSizeFile = 5 * 1024 * 1024;
  if (size > maxSizeFile) {
    throw HttpError(401, "File size exceeds the maximum limit (5MB).");
  }

  const filename = `${owner}_${originalname}`;
  const resultUpload = path.join(fileDir, filename);

  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    await fs.unlink(tempUpload);
    throw HttpError(500, "помилка при переносу файлу");
  }

  const fileURL = path.join("files", filename);

  const user = await User.findById(owner);
  if (!user) {
    throw HttpError(401);
  }

  const addFile = await File.create({file: fileURL, owner });
  if (addFile) {
    res.status(201).json(addFile);
    return;
  }
  
};

module.exports = {
  add: ctrlWrapper(add),
};