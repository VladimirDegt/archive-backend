const path = require("path");
const pdfParse = require("pdf-parse");
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
} = require("../services/servise-file");
const parseUkrDate = require("../utils/parse-ukr-date");

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

const parsePDF = async (req, res) => {
  if (!req.file) {
    res.status(400).json("File not found");
  }

  await fs.readFile(req.file.path, async (err, data) => {
    if (err) {
      res.status(500).json("Error while reading file");
      return;
    }

    pdfParse(data)
      .then(function (parseData) {
        const textPDF = parseData.text.trim();

        const regexNumber = /OУ-\d{8}/;
        const matchNumber = textPDF.match(regexNumber);
        if (matchNumber) {
          const value = matchNumber[0];
          console.log("numberAct-->", value);
        } else {
          console.log("Не удалось найти значение");
        }

        const regexTotal = /Разом:(\d+\s*\d*,\d+)/;
        const match = textPDF.match(regexTotal);
        if (match) {
          const value = match[1].replace(/\s/g, "");
          const numericTotal = parseFloat(value.replace(",", "."));
          console.log("price-->", numericTotal);
        } else {
          console.log("Не удалось найти значение");
        }

        const regexDate = /\d+\s+[^\s]+\s+\d{4}/;
        const matchDate = textPDF.match(regexDate);
        if (matchDate) {
          const value = matchDate[0];
          const date = parseUkrDate(value);
          console.log("date-->", date);
          console.log("month-->", matchDate[0].split(" ")[1]);
        } else {
          console.log("Не удалось найти значение");
        }

        res.json("Parsing success");
      })
      .catch(function (error) {
        res.status(500).json("Error while parsing PDF");
      });
  });
};

module.exports = {
  add: ctrlWrapper(add),
  getAll: ctrlWrapper(getAll),
  getCount: ctrlWrapper(getCount),
  parsePDF: ctrlWrapper(parsePDF),
};
