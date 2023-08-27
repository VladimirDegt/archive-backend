const File = require("../models/file");

const getAllFiles = async (sort, skip, limit) => {
  const getFiles = await File.find()
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("owner", "name");
  return getFiles;
};

const getCountDocument = async () => {
  const result = await File.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        numberDocumentValues: {
          $addToSet: { id: "$_id", numberDocument: "$numberDocument" },
        },
      },
    },
  ]);
  return result[0];
};

const addDogovir = async (item) => {
  const add = await File.create(item);
  return add;
};

const addNewAct = async (id, newAct) => {
  const updateActs = await File.findByIdAndUpdate(
    id,
    { $push: { acts: newAct } },
    { new: true }
  );
  return updateActs;
};

const search = async ({ nameCustomer, numberDocument }) => {
  if (nameCustomer) {
    const getName = await File.findOne({ nameCustomer }, "-updatedAt").populate(
      "owner",
      "name"
    );
    return getName;
  }
  if (numberDocument) {
    const getNumber = await File.findOne(
      { numberDocument },
      "-updatedAt"
    ).populate("owner", "name");
    return getNumber;
  }
};

module.exports = {
  getAllFiles,
  addDogovir,
  addNewAct,
  getCountDocument,
  search,
};
