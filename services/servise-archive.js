const Archive = require("../models/archive");
const HttpError = require("../utils/http-error");

const findIdDocument = async (id) => {
  const find = await Archive.findOne({idDocument: id })
  return find;
}

const getAllFiles = async (sort) => {
  const getFiles = await Archive.find()
    .sort(sort)
    .populate("owner", "name");
  return getFiles;
};

const writeDocumentToArchive = async ({ data }, owner) => {
  const updateArrayDocuments = data.map((document) => {
    const tempFullDocument = {};
    if(!document["Посилання на документ"]){
      return null;
    }
    const parts = document["Посилання на документ"].split("/");
    const documentId = parts[parts.length - 1];
    tempFullDocument.idDocument = documentId;
    tempFullDocument.dateCreate = document["Дата завантаження"];
    tempFullDocument.nameDocument = document["Назва документа"];
    tempFullDocument.typeDocument = document["Тип документа"];
    tempFullDocument.numberDocument = document["Номер документа"];
    tempFullDocument.emailCustomer = document["Email контрагента"];
    tempFullDocument.nameCustomer = document["Назва компанії контрагента"];
    tempFullDocument.codeCustomer = document["ЄДРПОУ/ІПН контрагента"];
    tempFullDocument.fileURLPDF = '';
    tempFullDocument.fileURLZIP = '';
    tempFullDocument.owner = owner;
    return tempFullDocument;
  });
  
  for (const document of updateArrayDocuments) {
    if(!document){
      continue
    }
    const findID = await findIdDocument(document.idDocument);
    if(findID) {
      continue
    }
    try {
      await Archive.create(document);
      console.log(
        `Успішно створено запис для документу з ID ${document.idDocument}`
      );
    } catch (error) {
      console.error(
        `Помилка при створені запису для документу з ID ${document.idDocument}: ${error.message}`
      );
      throw HttpError(400);
    }
  }
};

const addFileURLToDB = async (id, urls) => {
  const updateFileURL = await Archive.findOneAndUpdate(
    {idDocument: id},
    { $set: { fileURLPDF: urls.urlPdf, fileURLZIP: urls.urlZip } },
    { new: true }
  );

  if (!updateFileURL) {
    throw HttpError(400);
  }

  return updateFileURL;
};

module.exports = {
  writeDocumentToArchive,
  getAllFiles,
  addFileURLToDB
};
