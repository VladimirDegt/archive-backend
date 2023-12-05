const https = require("https");
const fs = require("fs");
const HttpError = require("./http-error");
const parseDogovir = require("./parse-dogovir");
require("dotenv").config();

const getDocumentFromVchasno = async (id, typeDocument, resultUpload) => {
    const fileUrl = `https://edo.vchasno.ua/api/v2/documents/${id}/${typeDocument}`;
    
    const API_KEY = process.env.API_KEY

  const headers = {
    Authorization: API_KEY,
    "Content-Type": "application/json",
  };

  const options = {
    headers: headers,
    method: "GET",
  };

  console.log('Пішов запит на адресу: ', fileUrl);

  await https
    .get(fileUrl, options, (response) => {
      if (response.statusCode !== 200) {
        console.error("Помилка при отраманні файлу: ", response.statusCode);
        throw HttpError(400);
      }
      const fileStream = fs.createWriteStream(resultUpload);

      fileStream.on("finish", () => {
        fileStream.close();
        console.log('Файл успішно завантажено до архіву');

        if(typeDocument === "pdf/print") {
          const normalizedPath = resultUpload.replace(/\\/g, '\\\\');
          parseDogovir(normalizedPath, id);
        }
      });

      response.pipe(fileStream);
      
    })
    .on("error", (err) => {
      console.error("Помилка при запиті на получення файлу:", err);
      throw HttpError(500);
      response.close();
    });
};

module.exports = getDocumentFromVchasno;
