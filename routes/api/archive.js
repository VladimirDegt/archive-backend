const express = require("express");

const ctrl = require("../../controllers/archive");

const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.route("/").post(authenticate, ctrl.allDocument)

router.route("/customer/:name").post(authenticate, ctrl.allDocumentOneCustomer)

router.route("/customer/dogovir/:number").post(authenticate, ctrl.findDogovir)

module.exports = router;
