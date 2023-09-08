// const axios = require("axios");

// const getDocument = async () => {
//   try {
//     const response = await axios.get(
//       `https://edo.vchasno.ua/api/v2/documents/186af131-148d-4b8b-a76b-b6b08a5325de/original`,
//       {
//         headers: {
//           Authorization: "PAuyukh9lEZ0cKr5b4I8t7DU2QRa2Y5hSm-x",
//           "content-type": "application/json",
//         },
//       }
//     );
//     return response.data;
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// module.exports = getDocument;

const https = require("https");
const fs = require("fs");
const path = require("path");

const getDocument = async () => {
  const fileUrl =
    "https://edo.vchasno.ua/api/v2/documents/186af131-148d-4b8b-a76b-b6b08a5325de/archive";
  const tempDir = path.join(__dirname, "../", "temp");
  const headers = {
    Authorization: "PAuyukh9lEZ0cKr5b4I8t7DU2QRa2Y5hSm-x",
    "Content-Type": "application/json",
  };

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const options = {
    headers: headers,
    method: "GET",
  };

  await https
    .get(fileUrl, options, (response) => {
      if (response.statusCode !== 200) {
        console.error("Ошибка при получении файла:", response.statusCode);
        return;
      }

      const fileName = "my_pdf_file.zip"; // Укажите желаемое имя файла
      const filePath = path.join(tempDir, fileName);
      const fileStream = fs.createWriteStream(filePath);

      response.pipe(fileStream);

      fileStream.on("finish", () => {
        console.log("Файл успешно сохранен:", fileName);
        fileStream.close();
      });

      return filePath;
    })
    .on("error", (err) => {
      console.error("Ошибка при запросе файла:", err);
    });
};

module.exports = getDocument;
