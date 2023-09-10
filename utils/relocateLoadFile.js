const fs = require("fs/promises");

const relocateLoadFile = async (filePath, resultUpload) => {
  console.log("filePath-->", filePath);
  console.log("resultUpload-->", resultUpload);

  await fs.rename(filePath, resultUpload, (err) => {
    if (err) {
      console.error("Помилка при перенайменуванні файлу:", err);
      // fs.unlink(filePath);
      return;
    }
    console.log("Файл успішно перенесено до папки public");
    // fs.unlink(filePath);
  });
};

module.exports = relocateLoadFile;
