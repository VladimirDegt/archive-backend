const express = require("express");

const ctrl = require("../../controllers/file");

const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router
  .route("/")
  .post(
    authenticate,
    upload.fields([{ name: "fileURL" }, { name: "fileURLZip" }]),
    ctrl.add
  )
  .get(authenticate, ctrl.getAll);

router.route("/document").get(authenticate, ctrl.getCount);

router.route("/search").post(authenticate, ctrl.searchDocument);

router.route("/:id").get(authenticate, ctrl.vchasno);

module.exports = router;
