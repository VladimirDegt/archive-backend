// const fs = require("fs");
const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const { addNumberDogovirToDB } = require("../services/servise-archive");
const HttpError = require("./http-error");

// const parseDogovir = async (tempUploadPDF, id) => {

//   await fs.readFile(tempUploadPDF, (err, data) => {
//     if (err) {
//       console.log('error-->', err.message)
//       return
//     }
//     pdfParse(data)
//     .then(function (parseData) {
//       const afterParsePDF = {};
//       const textPDF = parseData.text.trim();

//       const regexNumber = /ДОГОВІР No (\d+)/;
//       const matchNumber = textPDF.match(regexNumber);
//       if (matchNumber) {
//         const value = matchNumber[1];
//         afterParsePDF['numberDogovir'] = Number(value);
//       }  else {
//         afterParsePDF['numberDogovir'] = '';
//       }
      
//       const regexNumberForAct = /\(договір  No (\d+) від/;
//       const matchForAct = textPDF.match(regexNumberForAct);
//       if (matchForAct) {
//         const value = matchForAct[1];
//         afterParsePDF['numberDogovirForAct'] = Number(value);
//       } else {
//         afterParsePDF['numberDogovirForAct'] = ''; 
//       }
//       console.log('Парсінг .pdf файлу успішно завершено')

//       try {
//         addNumberDogovirToDB(afterParsePDF, id)
//       } catch (error) {
//         console.log('Помилка при додаванні номеру договору до БД-->', error.message);
//       }

//     })
//     .catch(error => {
//       console.log('Помилка при парсінгу файлу pdf', error.message);
//     });
// })}

const parseDogovir = async (tempUploadPDF, id) => {
  try {
    const data = await fs.readFile(tempUploadPDF);
    const parseData = await pdfParse(data);
    const afterParsePDF = {};
    const textPDF = parseData.text.trim();

    const regexNumber = /ДОГОВІР No (\d+)/;
    const matchNumber = textPDF.match(regexNumber);
    if (matchNumber) {
      const value = matchNumber[1];
      afterParsePDF['numberDogovir'] = Number(value);
    } else {
      afterParsePDF['numberDogovir'] = '';
    }

    const regexNumberForAct = /\(договір  No (\d+) від/;
    const matchForAct = textPDF.match(regexNumberForAct);
    if (matchForAct) {
      const value = matchForAct[1];
      afterParsePDF['numberDogovirForAct'] = Number(value);
    } else {
      afterParsePDF['numberDogovirForAct'] = '';
    }
    console.log('Парсінг .pdf файлу успішно завершено');

    await addNumberDogovirToDB(afterParsePDF, id);
  } catch (error) {
    console.log('Ошибка:', error.message);
  }
};

module.exports = parseDogovir;