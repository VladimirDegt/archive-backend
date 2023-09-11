const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const { getAllFiles} = require("../services/servise-archive");


const allDocument = async (req, res) => {

  const getFiles = await getAllFiles({ nameCustomer: 1 });

  if (getFiles) {
    res.json(getFiles);
    return;
  }
  throw HttpError(404);
};

module.exports = {
  allDocument: ctrlWrapper(allDocument),

};
