const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const {
  getAllFiles,
  totalDocument,
  findDocumentOneCustomer,
  findDogovirByNumber,
  findActByNumber,
  countDocumentByType,
  documentsByRangeDate,
  documentsByType,
} = require("../services/servise-archive");

const allDocument = async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;
  const getFiles = await getAllFiles({ fileURLPDF: 1 }, skip, limit);
  const total = await totalDocument();

  if (getFiles) {
    res.json({ getFiles, total });
    return;
  }
  throw HttpError(404);
};

const allDocumentOneCustomer = async (req, res) => {
  const { name } = req.params;
  try {
    const result = await findDocumentOneCustomer(name);
    if (result) {
      res.json(result);
      return;
    }
  } catch (error) {
    throw HttpError(404);
  }
};

const findDogovir = async (req, res) => {
  const { number } = req.params;
  const result = await findDogovirByNumber(number);
  if (result) {
    res.json(result);
    return;
  }
  HttpError(404);
};

const findAct = async (req, res) => {
  const { number } = req.params;
  const result = await findActByNumber(number);
  if (result) {
    res.json(result);
    return;
  }
  HttpError(404);
};

const getAnalitics = async (req, res) => {
  const result = await countDocumentByType();
  if (result) {
    res.json(result);
    return;
  }
  HttpError(404);
};

const getDocumentByDate = async (req, res) => {
  const { startDate, endDate } = req.body;
  const result = await documentsByRangeDate(startDate, endDate);
  if (result) {
    res.json(result);
    return;
  }
  HttpError(404);
};

const getDocumentByType = async (req, res) => {
  const { typeDocument } = req.body;
  const result = await documentsByType(typeDocument);
  if (result) {
    res.json(result);
    return;
  }
  HttpError(404);
};

module.exports = {
  allDocument: ctrlWrapper(allDocument),
  allDocumentOneCustomer: ctrlWrapper(allDocumentOneCustomer),
  findDogovir: ctrlWrapper(findDogovir),
  findAct: ctrlWrapper(findAct),
  getAnalitics: ctrlWrapper(getAnalitics),
  getDocumentByDate: ctrlWrapper(getDocumentByDate),
  getDocumentByType: ctrlWrapper(getDocumentByType),
};
