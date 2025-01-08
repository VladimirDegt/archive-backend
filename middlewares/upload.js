const multer = require("multer");
const path = require("path");
const iconv = require('iconv-lite');

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    // Исправляем кодировку имени файла
    const originalName = iconv.decode(Buffer.from(file.originalname, 'binary'), 'utf8');
    cb(null, originalName);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;