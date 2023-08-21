const path = require("path");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const renameFile = require("../utils/renameFile");
const {
  getAllFiles,
  addDogovir,
  addNewAct,
} = require("../services/servise-file");

const fileDir = path.join(__dirname, "../", "public", "files");

const getAll = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const skip = (page - 1) * limit;
  const getFiles = await getAllFiles(skip, limit);

  if (getFiles) {
    res.json(getFiles);
    return;
  }
  throw HttpError(404);
};

const add = async (req, res) => {
  const { id: owner } = req.user;
  const { typeDocument, nameCustomer, numberDocument, nameMonth, idDogovir } =
    req.body;

  const {
    path: tempUploadPDF,
    originalname: originalnamePDF,
    size: sizePDF,
  } = req.files.fileURL[0];
  const {
    path: tempUploadZIP,
    originalname: originalnameZIP,
    size: sizeZIP,
  } = req.files.fileURLZip[0];

  const fileURLPDF = path.join(
    "files",
    await renameFile(fileDir, owner, tempUploadPDF, originalnamePDF, sizePDF)
  );
  const fileURLZIP = path.join(
    "files",
    await renameFile(fileDir, owner, tempUploadZIP, originalnameZIP, sizeZIP)
  );

  const user = await User.findById(owner);
  if (!user) {
    throw HttpError(401);
  }

  if (idDogovir) {
    const newAct = {
      typeDocument,
      nameMonth,
      fileURLPDF,
      fileURLZIP,
    };

    const updateActs = await addNewAct(idDogovir, newAct);
    if (updateActs) {
      res.json(updateActs);
      return;
    }
    throw HttpError(404);
  }

  const addDocument = addDogovir({
    nameCustomer,
    typeDocument,
    numberDocument,
    fileURLPDF,
    fileURLZIP,
    owner,
  });

  if (addDocument) {
    res.status(201).json(addDocument);
  }
};

module.exports = {
  add: ctrlWrapper(add),
  getAll: ctrlWrapper(getAll),
};
