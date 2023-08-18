const path = require("path");
const File = require("../models/file");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const renameFile = require("../utils/renameFile")

const fileDir = path.join(__dirname, "../", "public", "files");

const getAll = async (req, res) => {
  const { page = 1, limit = 10, } = req.query;
  const skip = (page - 1) * limit;
  const getFiles = await File.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name");
  if (getFiles) {
    res.json(getFiles);
  }
  throw HttpError(404);
};

const add = async (req, res) => {
  const { id: owner } = req.user;
  const {typeDocument, nameCustomer, numberDocument} = req.body;

  const { path: tempUploadPDF, originalname: originalnamePDF, size: sizePDF } = req.files.fileURL[0];
  const { path: tempUploadZIP, originalname: originalnameZIP, size: sizeZIP } = req.files.fileURLZip[0];

  const fileURLPDF = path.join("files", await renameFile(fileDir, owner, tempUploadPDF, originalnamePDF, sizePDF));
  const fileURLZIP = path.join("files", await renameFile(fileDir, owner, tempUploadZIP, originalnameZIP, sizeZIP));

  const user = await User.findById(owner);
  if (!user) {
    throw HttpError(401);
  }

  const addFile = await File.create({nameCustomer, typeDocument, numberDocument, fileURLPDF, fileURLZIP, owner });
  if (addFile) {
    res.status(201).json(addFile);
    return;
  }
  
};

module.exports = {
  add: ctrlWrapper(add),
  getAll: ctrlWrapper(getAll),
};