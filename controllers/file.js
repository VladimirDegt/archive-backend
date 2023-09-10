const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Papa = require("papaparse");
const fs = require("fs");
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
const getDocumentFromVchasno = require("../utils/get-document-from-Vchasno");
const relocateLoadFile = require("../utils/relocateLoadFile");
const { writeDocumentToArchive } = require("../services/servise-archive");

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
      const afterParseDogovir = await parseDogovir(tempUploadPDF);
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
      res.status(400).json({ message: "Помилка при обробці договору" });
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
      res.status(400).json({ message: "Помилка при обробці акта" });
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

const uploadFileFromVchasno = async (req, res) => {
  const { id } = req.params;
  const fileName = `${uuidv4()}.pdf`;
  const tempDir = path.join(__dirname, "../", "temp");
  const publicDir = path.join(__dirname, "../", "public", "files");
  const filePath = path.join(tempDir, fileName);
  const resultUpload = path.join(publicDir, fileName);
  const typeDocument = "pdf/print";

  try {
    await getDocumentFromVchasno(id, typeDocument, filePath);
    res.json({ message: "файл збережено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при отриманні файлу з Вчасно" });
  }

  try {
    await relocateLoadFile(filePath, resultUpload);
    console.log("Файл успішно переміщено до папки Public");
  } catch (error) {
    console.log("Помилка при переміщенні файлу: ", error.message);
  }
};

const parseFileCSV = async (req, res) => {
  const { path: tempUpload, size } = req.file;
  const maxSizeFile = 5 * 1024 * 1024;
  if (size > maxSizeFile) {
    throw HttpError(401, "File size exceeds the maximum limit (5MB).");
  }

  fs.readFile(tempUpload, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Помилка читання файлу .csv" });
    }

    try {
      const parse = Papa.parse(data, {
        header: true,
        dynamicTyping: true,
      });

      await writeDocumentToArchive(parse);

      res.json({ message: parse });
    } catch (error) {
      res.status(500).json({ message: "Помилка парсингу файлу .csv" });
    } finally {
      fs.unlink(tempUpload, (err) => {
        if (err) throw err;
        console.log(".csv файл видалено");
      });
    }
  });
};

module.exports = {
  add: ctrlWrapper(add),
  getAll: ctrlWrapper(getAll),
  getCount: ctrlWrapper(getCount),
  searchDocument: ctrlWrapper(searchDocument),
  uploadFileFromVchasno: ctrlWrapper(uploadFileFromVchasno),
  parseFileCSV: ctrlWrapper(parseFileCSV),
};
