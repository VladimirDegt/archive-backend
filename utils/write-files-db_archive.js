// const { v4: uuidv4 } = require("uuid");
// const path = require("path");
// const getDocumentFromVchasno = require("./get-document-from-Vchasno");
// const HttpError = require("./http-error");

// const uploadFileFromVchasno = async (id) => {
//   const publicDir = path.join(__dirname, "../", "public", "files");
//   const urlFiles = {};

//   let typeDocument = "pdf/print";
//   let fileName = `${uuidv4()}.pdf`;
//   let resultUpload = path.join(publicDir, fileName);
//   try {
//     await getDocumentFromVchasno(id, typeDocument, resultUpload);
//     urlFiles.urlPdf = resultUpload;
//   } catch (error) {
//     console.log("Помилка при завантажені .pdf", error.message);
//     throw HttpError(500);
//   }

//   typeDocument = "archive";
//   fileName = `${uuidv4()}.zip`;
//   resultUpload = path.join(publicDir, fileName);
//   try {
//     await getDocumentFromVchasno(id, typeDocument, resultUpload);
//     urlFiles.urlZip = resultUpload;
//   } catch (error) {
//     console.log("Помилка при завантажені .zip", error.message);
//     throw HttpError(500);
//   }

//   return urlFiles;
// };

// module.exports = uploadFileFromVchasno;
