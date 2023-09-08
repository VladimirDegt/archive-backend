const fs = require("fs");
const pdfParse = require("pdf-parse");
const HttpError = require("./http-error");

const parseDogovir = (tempUploadPDF) => {
  return new Promise((resolve, reject) => {
    fs.readFile(tempUploadPDF, async (err, data) => {
      if (err) {
        res.status(500).json("Error while reading file");
        return;
      }

  pdfParse(data)
  .then(function (parseData) {

    const afterParsePDF = {};
    const textPDF = parseData.text.trim();

    const regexNumber = /ДОГОВІР No (\d+)/;
    const matchNumber = textPDF.match(regexNumber);
    if (matchNumber) {
      const value = matchNumber[1];
      afterParsePDF['numberDocument'] = value;
    } else {
      throw HttpError(400);
    }

    const regexCustomer = /Отримувач документу[\s\S]*Власник ключа: ([^\n]+)/m;
    const matchCustomer = textPDF.match(regexCustomer);
    if (matchCustomer) {
      const value = matchCustomer[1];
      afterParsePDF['nameCustomer'] = value;
    } else {
      throw HttpError(400);
    }

    resolve(afterParsePDF)

  })
  .catch(function (error) {
    reject("Error while parsing PDF");
  });
})
})
};

module.exports = parseDogovir;