const File = require("../models/file");
const User = require("../models/user");

const getAllFiles = async (skip, limit) => {
  const getFiles = await File.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "name");
  return getFiles;
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

module.exports = {
  getAllFiles,
  addDogovir,
  addNewAct,
};
