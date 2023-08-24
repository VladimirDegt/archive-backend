const fs = require("fs/promises");
const path = require("path");
const {v2: cloudinary} = require ('cloudinary');
const {CLOUDINARY_ClOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET} =process.env

cloudinary.config({ 
  cloud_name: CLOUDINARY_ClOUD_NAME, 
  api_key: CLOUDINARY_API_KEY, 
  api_secret: CLOUDINARY_API_SECRET 
});

const renameFile = async (tempUpload, size) => {
  const maxSizeFile = 5 * 1024 * 1024;
  if (size > maxSizeFile) {
    throw HttpError(401, "File size exceeds the maximum limit (5MB).");
  }

  const result = await cloudinary.uploader.upload(
    tempUpload, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
      folder: "dogovir"
    }
  )
  return result.url
  // ======= для зберігання локально ==============

  // const filename = `${owner}_${originalname}`;
  // const resultUpload = path.join(fileDir, filename);

  // try {
  //   await fs.rename(tempUpload, resultUpload);
  // } catch (error) {
  //   await fs.unlink(tempUpload);
  //   throw HttpError(500, "помилка при переносу файлу");
  // }

  // return filename;
};

module.exports = renameFile;