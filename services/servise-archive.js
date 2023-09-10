const Archive = require("../models/archive");
const HttpError = require("../utils/http-error");
const uploadFileFromVchasno = require("../utils/write-files-db_archive");

const writeDocumentToArchive = async ({ data }) => {
  const updateArrayDocuments = data.map(async (document) => {
    const tempFullDocument = {};
    const parts = document["Посилання на документ"].split("/");
    const documentId = parts[parts.length - 1];
    const urlFiles = await uploadFileFromVchasno(documentId);
    console.log("urlFiles-->", urlFiles);
    tempFullDocument.idDocument = documentId;
    tempFullDocument.dateCreate = document["Дата завантаження"];
    tempFullDocument.nameDocument = document["Назва документа"];
    tempFullDocument.typeDocument = document["Тип документа"];
    tempFullDocument.numberDocument = document["Номер документа"];
    tempFullDocument.emailCustomer = document["Email контрагента"];
    tempFullDocument.nameCustomer = document["Назва компанії контрагента"];
    tempFullDocument.codeCustomer = document["ЄДРПОУ/ІПН контрагента"];
    tempFullDocument.fileURLPDF = urlFiles.urlPdf;
    tempFullDocument.fileURLZIP = urlFiles.urlZip;
    return tempFullDocument;
  });

  for (const document of updateArrayDocuments) {
    try {
      await Archive.create(document);
      console.log(
        `Запись успешно создана для документа с ID ${document.idDocument}`
      );
    } catch (error) {
      console.error(
        `Ошибка при создании записи для документа с ID ${document.idDocument}: ${error.message}`
      );
      throw HttpError(400);
    }
  }
};

module.exports = writeDocumentToArchive;
