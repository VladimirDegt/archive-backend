const https = require("https");
const fs = require("fs");
const HttpError = require("./http-error");
const parseDogovir = require("./parse-dogovir");

const getDocumentFromVchasno = async (id, typeDocument, resultUpload) => {
  const fileUrl = `https://edo.vchasno.ua/api/v2/documents/${id}/${typeDocument}`;

  const headers = {
    Authorization: "PAuyukh9lEZ0cKr5b4I8t7DU2QRa2Y5hSm-x",
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
