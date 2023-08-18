const fs = require("fs/promises");
const path = require("path");

const renameFile = async (fileDir, owner, tempUpload, originalname, size) => {
  const maxSizeFile = 5 * 1024 * 1024;
  if (size > maxSizeFile) {
    throw HttpError(401, "File size exceeds the maximum limit (5MB).");
  }
  const filename = `${owner}_${originalname}`;
  const resultUpload = path.join(fileDir, filename);

  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (error) {
    await fs.unlink(tempUpload);
    throw HttpError(500, "помилка при переносу файлу");
  }

  return filename;
};

module.exports = renameFile;