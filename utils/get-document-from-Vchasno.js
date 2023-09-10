const https = require("https");
const fs = require("fs");
const HttpError = require("./http-error");

const getDocumentFromVchasno = async (id, typeDocument, filePath) => {
  const fileUrl = `https://edo.vchasno.ua/api/v2/documents/${id}/${typeDocument}`;
  const headers = {
    Authorization: "PAuyukh9lEZ0cKr5b4I8t7DU2QRa2Y5hSm-x",
    "Content-Type": "application/json",
  };

  const options = {
    headers: headers,
    method: "GET",
  };

  await https
    .get(fileUrl, options, (response) => {
      if (response.statusCode !== 200) {
        console.error("Ошибка при получении файла:", response.statusCode);
        throw HttpError(400);
      }

      if (typeDocument === "pdf/print") {
        const fileStream = fs.createWriteStream(filePath);

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          console.log("Файл успішно збережено");
          fileStream.close();
        });

        return filePath;
      }
    })
    .on("error", (err) => {
      console.error("Ошибка при запиті на получення файлу:", err);
      throw HttpError(500);
    });
};

module.exports = getDocumentFromVchasno;
