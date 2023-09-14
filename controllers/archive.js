const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const { getAllFiles, totalDocument, findDocumentOneCustomer} = require("../services/servise-archive");

const allDocument = async (req, res) => {
  const { page, limit  } = req.query;
  const skip = (page - 1) * limit;
  const getFiles = await getAllFiles({ nameCustomer: 1 }, skip, limit);
  const total = await totalDocument();

  if (getFiles) {
    res.json({getFiles, total});
    return;
  }
  throw HttpError(404);
};

const allDocumentOneCustomer = async (req, res) => {
  const {name } = req.params;
  try {
    const result = await findDocumentOneCustomer(name)
    if (result) {
      res.json(result);
      return;
    }
  } catch (error) {
    throw HttpError(404);
  }
}

module.exports = {
  allDocument: ctrlWrapper(allDocument),
  allDocumentOneCustomer: ctrlWrapper(allDocumentOneCustomer),
};
