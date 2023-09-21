// const fs = require("fs");
// const pdfParse = require("pdf-parse");
// const months = require("../db/months");

// const parsePDF = (tempUploadPDF) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(tempUploadPDF, async (err, data) => {
//       if (err) {
//         res.status(500).json("Error while reading file");
//         return;
//       }

//   pdfParse(data)
//   .then(function (parseData) {

//     const afterParsePDF = {};
//     const textPDF = parseData.text.trim();

//     const regexNumber = /OУ-\d{8}/;
//     const matchNumber = textPDF.match(regexNumber);
//     if (matchNumber) {
//       const value = matchNumber[0];
//       afterParsePDF['numberAct'] = value;
//       console.log("numberAct-->", value);
//     } else {
//       throw HttpError(400);
//     }

//     const regexTotal = /Разом:(\d+\s*\d*,\d+)/;
//     const match = textPDF.match(regexTotal);
//     if (match) {
//       const value = match[1].replace(/\s/g, "");
//       const numericTotal = parseFloat(value.replace(",", "."));
//       afterParsePDF['price'] = numericTotal;
//       console.log("price-->", numericTotal);
//     } else {
//       throw HttpError(400);
//     }

//     const regexDate = /від (\d+\s+[^\s]+\s+\d{4})/;
//     const matchDate = textPDF.match(regexDate);
//     if (matchDate) {
//       const value = matchDate[1];
//       const month= value.split(" ")[1]
//       afterParsePDF['date'] = value;
//       const updateMonth = months[month]
//       afterParsePDF['month'] = updateMonth;
//     } else {
//       throw HttpError(400);
//     }

//     resolve(afterParsePDF)

//   })
//   .catch(function (error) {
//     reject("Error while parsing PDF");
//   });
// })
// })
// };

// module.exports = parsePDF;
