const express = require("express");

const ctrl = require("../../controllers/archive");

const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.route("/").post(authenticate, ctrl.allDocument)

router.route("/customer/:name").post(authenticate, ctrl.allDocumentOneCustomer)

router.route("/customer/dogovir/:number").post(authenticate, ctrl.findDogovir)

router.route("/customer/act/:number").post(authenticate, ctrl.findAct)

router.route("/analytics").post(authenticate, ctrl.getAnalitics)

router.route("/rangeDate").post(authenticate, ctrl.getDocumentByDate)

router.route("/typeDocument").post(authenticate, ctrl.getDocumentByType)

router.route("/nomenclature").post(authenticate, ctrl.getDocumentByNomenclature)

router.route("/dateSigning").post(authenticate, ctrl.getDocumentSigningByDate)

module.exports = router;
