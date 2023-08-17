const express = require("express");

const ctrl = require("../../controllers/file");

const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .post(authenticate, upload.single("fileURL"), ctrl.add)
  .get(authenticate, ctrl.getAll);

  module.exports = router;