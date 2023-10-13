const Archive = require("../models/archive");
const HttpError = require("../utils/http-error");
const ukLocale = require("date-fns/locale/uk");
const { utcToZonedTime } = require("date-fns-tz");
const {
  addNameCustomerToDB,
  addNumberToDB,
} = require("./servise-multi-data-store");

const findIdDocument = async (id) => {
  const find = await Archive.findOne({ idDocument: id });
  return find;
};

const findDocumentOneCustomer = async (name) => {
  const find = await Archive.find({ nameCustomer: name });
  return find;
};

const findDogovirByNumber = async (number) => {
  const find = await Archive.find({
    $and: [{ typeDocument: "Договір" }, { numberDogovir: Number(number) }],
  });
  return find;
};
const findActByNumber = async (number) => {
  const find = await Archive.find({
    $and: [
      { typeDocument: "Акт наданих послуг" },
      { numberDogovir: Number(number) },
    ],
  });
  return find;
};

const getAllFiles = async (sort, skip, limit) => {
  const getFiles = await Archive.find()
    .select('-createdAt -updatedAt -dateCreate -numberDocument -emailCustomer -codeCustomer')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate("owner", "name");
  return getFiles;
};

const writeDocumentToArchive = async ({ data }, owner) => {
  const nameCustomer = [];
  const updateArrayDocuments = data.map((document) => {
    const tempFullDocument = { numberDogovir: "" };
    if (!document["Посилання на документ"]) {
      return null;
    }
    if (document["Статус підписання"] !== "Підписаний всіма") {
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
    tempFullDocument.fileURLPDF = "";
    tempFullDocument.fileURLZIP = "";
    tempFullDocument.inventarNumber = "10.1-01";
    tempFullDocument.owner = owner;
    return tempFullDocument;
  });

  for (const document of updateArrayDocuments) {
    if (!document) {
      continue;
    }
    const findID = await findIdDocument(document.idDocument);
    if (findID) {
      continue;
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
    { idDocument: id },
    { $set: { fileURLPDF: urls.urlPdf, fileURLZIP: urls.urlZip } },
    { new: true }
  );

  if (!updateFileURL) {
    throw HttpError(400);
  }

  return updateFileURL;
};

const addNumberDogovirToDB = async (
  { numberDogovir, numberDogovirForAct, dateDogovir, dateAct, numberRachunok, dateSigning },
  id
) => {
  if (numberDogovir) {
    const addNumbers = await Archive.findOneAndUpdate(
      { idDocument: id },
      { numberDogovir, contractStartDate: dateDogovir }
    );

    await addNumberToDB(numberDogovir);

    if (!addNumbers) {
      throw HttpError(400);
    }
  }

  if (numberDogovirForAct) {
    const addNumbers = await Archive.findOneAndUpdate(
      { idDocument: id },
      { numberDogovir: numberDogovirForAct, contractStartDate: dateAct }
    );

    await addNumberToDB(numberDogovirForAct);

    if (!addNumbers) {
      throw HttpError(400);
    }
  }

  if (!numberDogovirForAct && !numberDogovir && dateAct) {
    const addDate = await Archive.findOneAndUpdate(
      { idDocument: id },
      { contractStartDate: dateAct }
    );

    if (!addDate) {
      throw HttpError(400);
    }
  }

  if (numberRachunok) {
    const addNumber = await Archive.findOneAndUpdate(
      { idDocument: id },
      { numberRachunok }
    );

    if (!addNumber) {
      throw HttpError(400);
    }
  }

  if (numberRachunok === '') {
    const addNumber = await Archive.findOneAndUpdate(
      { idDocument: id },
      { numberRachunok: '' }
    );

    if (!addNumber) {
      throw HttpError(400);
    }
  }

  if (dateSigning) {
    const addDateSigning = await Archive.findOneAndUpdate(
      { idDocument: id },
      { dateSigning }
    );

    if (!addDateSigning) {
      throw HttpError(400);
    }
  }


};

const totalDocument = async () => {
  const total = await Archive.find();
  return total.length;
};

const countDocumentByType = async () => {
  const result = await Archive.aggregate([
    {
      $group: {
        _id: "$typeDocument",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);
  return result;
};

const documentsByRangeDate = async (startDate, endDate) => {

  start = new Date(startDate);
  end = new Date(endDate);

  const targetTimeZone = "Europe/Kiev";

  const zonedStartDate = utcToZonedTime(start, targetTimeZone, {
    locale: ukLocale,
  });
  zonedStartDate.setMinutes(
    zonedStartDate.getMinutes() - zonedStartDate.getTimezoneOffset()
  );

  const zonedEndDate = utcToZonedTime(end, targetTimeZone, {
    locale: ukLocale,
  });
  zonedEndDate.setMinutes(
    zonedEndDate.getMinutes() - zonedEndDate.getTimezoneOffset()
  );

  const result = await Archive.find({
    contractStartDate: {
      $gte: zonedStartDate,
      $lte: zonedEndDate
    }
  })
  return result;
}

const documentsByType = async (typeDocument) => {
  if(typeDocument === "Тип документа не вказано") {
    const result = await Archive.find({ typeDocument: null })
    .select(
      "-createdAt -updatedAt -dateCreate -numberDocument -emailCustomer -codeCustomer"
    )
    .sort('dateSigning')

    if (!result) {
      throw HttpError(400);
    }
  
    return result;
  }
  
  const result = await Archive.find({ typeDocument })
    .select(
      "-createdAt -updatedAt -dateCreate -numberDocument -emailCustomer -codeCustomer"
    )
    .sort('dateSigning')

  if (!result) {
    throw HttpError(400);
  }

  return result;
};

module.exports = {
  writeDocumentToArchive,
  getAllFiles,
  addFileURLToDB,
  totalDocument,
  findDocumentOneCustomer,
  addNumberDogovirToDB,
  findDogovirByNumber,
  findActByNumber,
  countDocumentByType,
  documentsByRangeDate,
  documentsByType,
};
