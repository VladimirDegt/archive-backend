const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");
const { getNameCustomerToDB } = require("../services/servise-multi-data-store");

const allNameCustomer = async (req, res) => {
  const getNamesCustomer = await getNameCustomerToDB();

  if (getNamesCustomer) {
    res.json(getNamesCustomer);
    return;
  }
  throw HttpError(404);
};

module.exports = {
  allNameCustomer: ctrlWrapper(allNameCustomer),

};
