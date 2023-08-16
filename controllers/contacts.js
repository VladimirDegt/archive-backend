const Contact = require("../models/contact");
const HttpError = require("../utils/http-error");
const ctrlWrapper = require("../utils/ctrl-wrapper");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  const getContacts = await Contact.find({ owner, ...(favorite === 'true' ? { favorite: true } : {}) }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  if (getContacts) {
    res.json(getContacts);
  }
  throw HttpError(404);
};

const getByID = async (req, res) => {
  const oneContact = await Contact.findById(req.params.contactId);
  if (oneContact) {
    res.json(oneContact);
    return;
  }
  throw HttpError(404);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const addContact = await Contact.create({ ...req.body, owner });
  if (addContact) {
    res.status(201).json(addContact);
    return;
  }
  throw HttpError(404);
};

const updateById = async (req, res) => {
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  if (updateContact) {
    res.json(updateContact);
    return;
  }
  throw HttpError(404);
};

const updateStatusContact = async (req, res) => {
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.contactId,
    req.body,
    { new: true }
  );
  if (updateContact) {
    res.json(updateContact);
    return;
  }
  throw HttpError(404);
};

const deleteById = async (req, res) => {
  const deleteContact = await Contact.findByIdAndRemove(req.params.contactId);
  if (deleteContact) {
    res.json({ message: "contact deleted" });
    return;
  }
  throw HttpError(404);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getByID: ctrlWrapper(getByID),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteById: ctrlWrapper(deleteById),
};
