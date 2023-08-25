const fs = require("fs");
const pdfParse = require("pdf-parse");
const parseUkrDate = require("./parse-ukr-date");
const months = require("../db/months");

const parsePDF = (tempUploadPDF) => {
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

    const regexNumber = /OУ-\d{8}/;
    const matchNumber = textPDF.match(regexNumber);
    if (matchNumber) {
      const value = matchNumber[0];
      afterParsePDF['numberAct'] = value;
      console.log("numberAct-->", value);
    } else {
      console.log("Не удалось найти значение");
    }

    const regexTotal = /Разом:(\d+\s*\d*,\d+)/;
    const match = textPDF.match(regexTotal);
    if (match) {
      const value = match[1].replace(/\s/g, "");
      const numericTotal = parseFloat(value.replace(",", "."));
      afterParsePDF['price'] = numericTotal;
      console.log("price-->", numericTotal);
    } else {
      console.log("Не удалось найти значение");
    }

    const regexDate = /від (\d+\s+[^\s]+\s+\d{4})/;
    const matchDate = textPDF.match(regexDate);
    if (matchDate) {
      const value = matchDate[1];
      const month= value.split(" ")[1]
      afterParsePDF['date'] = value;
      const updateMonth = months[month]
      afterParsePDF['month'] = updateMonth;
      console.log("date-->", value);
      console.log("month-->", updateMonth);
    } else {
      console.log("Не удалось найти значение");
    }

    console.log("afterParsePDF", afterParsePDF);
    resolve(afterParsePDF)

  })
  .catch(function (error) {
    reject("Error while parsing PDF");
  });
})
})
};

module.exports = parsePDF;
