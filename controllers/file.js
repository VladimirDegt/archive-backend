const path = require("path");
const User = require("../models/user");
const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const renameFile = require("../utils/renameFile");
const {
  getAllFiles,
  addDogovir,
  addNewAct,
  getCountDocument,
  search,
} = require("../services/servise-file");
const parsePDF = require("../utils/parse-pdf");
const parseDogovir = require("../utils/parse-dogovir");
// =============== для локального зберігання ===============================================
// const fileDir = path.join(__dirname, "../", "public", "files");

const getAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const getFiles = await getAllFiles({ numberDocument: 1 }, skip, limit);

  if (getFiles) {
    res.json(getFiles);
    return;
  }
  throw HttpError(404);
};

const getCount = async (req, res) => {
  const result = await getCountDocument();
  if (result) {
    res.json(result);
    return;
  }
  throw HttpError(404);
};

const add = async (req, res) => {
  const { id: owner } = req.user;
  const { typeDocument, idDogovir } = req.body;

  const { path: tempUploadPDF, size: sizePDF } = req.files.fileURL[0];
  const { path: tempUploadZIP, size: sizeZIP } = req.files.fileURLZip[0];

  const fileURLPDF = await renameFile(tempUploadPDF, sizePDF);
  const fileURLZIP = await renameFile(tempUploadZIP, sizeZIP);
  // ========================== для зберігання файлів локально =====================================
  // const fileURLPDF = path.join(
  //   "files",
  //   await renameFile(fileDir, owner, tempUploadPDF, originalnamePDF, sizePDF)
  // );
  // const fileURLZIP = path.join(
  //   "files",
  //   await renameFile(fileDir, owner, tempUploadZIP, originalnameZIP, sizeZIP)
  // );

  const user = await User.findById(owner);
  if (!user) {
    throw HttpError(401);
  }

  if (typeDocument === "Договір") {
    try {
      const afterParseDogovir = await parseDogovir(tempUploadPDF)
      const addDocument = addDogovir({
        ...afterParseDogovir,
        typeDocument,
        fileURLPDF,
        fileURLZIP,
        owner,
      });
    
      if (addDocument) {
        res.status(201).json(addDocument);
        return;
      }
    } catch (error) {
      res.status(400).json({message: "Помилка при обробці договору"})
    }
  }

  if (typeDocument === "Акт наданих послуг") {
    try {
      const afterParsePDF = await parsePDF(tempUploadPDF);
      const newAct = {
        ...afterParsePDF,
        typeDocument,
        fileURLPDF,
        fileURLZIP,
      };
  
      const updateActs = await addNewAct(idDogovir, newAct);
      if (updateActs) {
        res.json(updateActs);
        return;
      }
    } catch (error) {
      res.status(400).json({message: "Помилка при обробці акта"})
    }
  }

};

const searchDocument = async (req, res) => {
  const getField = await search(req.body);
  if (getField) {
    res.json(getField);
  }
  throw HttpError(404);
};

module.exports = {
  add: ctrlWrapper(add),
  getAll: ctrlWrapper(getAll),
  getCount: ctrlWrapper(getCount),
  searchDocument: ctrlWrapper(searchDocument),
};
