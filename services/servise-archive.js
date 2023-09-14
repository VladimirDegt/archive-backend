const Archive = require("../models/archive");
const HttpError = require("../utils/http-error");
const { addNameCustomerToDB, addNumberToDB } = require("./servise-multi-data-store");

const findIdDocument = async (id) => {
  const find = await Archive.findOne({idDocument: id })
  return find;
}

const findDocumentOneCustomer = async (name) => {
  const find = await Archive.find({nameCustomer: name})
  return find;
}

const findDogovirByNumber= async (number) => {
  const find = await Archive.find({
    $and: [
    { typeDocument: 'Договір' },
    { numberDogovir: Number(number) }
  ]})
  return find;
}

const getAllFiles = async (sort, skip, limit) => {
  const getFiles = await Archive.find()
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("owner", "name");
  return getFiles;
};

const writeDocumentToArchive = async ({ data }, owner) => {
  const nameCustomer = []
  const updateArrayDocuments = data.map((document) => {
    const tempFullDocument = {numberDogovir: ''};
    if(!document["Посилання на документ"]){
      return null;
    }
    if(document["Статус підписання"] !== 'Підписаний всіма'){
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
    nameCustomer.push(document["Назва компанії контрагента"]);
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
  addNameCustomerToDB(nameCustomer);

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

const addNumberDogovirToDB = async ({numberDogovir, numberDogovirForAct}, id) => {
  if(numberDogovir) {
    const addNumbers = await Archive.findOneAndUpdate(
      {idDocument: id},
      { numberDogovir }
    );

    await addNumberToDB(numberDogovir)
  
    if (!addNumbers) {
      throw HttpError(400);
    }
  }

  if(numberDogovirForAct) {
    const addNumbers = await Archive.findOneAndUpdate(
      {idDocument: id},
      { numberDogovir: numberDogovirForAct },
    );

    await addNumberToDB(numberDogovirForAct)
  
    if (!addNumbers) {
      throw HttpError(400);
    }
  }
};


const totalDocument = async() => {
  const total = await Archive.find()
  return total.length
}

module.exports = {
  writeDocumentToArchive,
  getAllFiles,
  addFileURLToDB,
  totalDocument,
  findDocumentOneCustomer,
  addNumberDogovirToDB,
  findDogovirByNumber,
};
