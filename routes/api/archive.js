const express = require("express");

const ctrl = require("../../controllers/archive");

const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.route("/").post(authenticate, ctrl.allDocument)

module.exports = router;
