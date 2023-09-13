const express = require("express");

const ctrl = require("../../controllers/multi-data-store");

const authenticate = require("../../middlewares/authenticate");

const router = express.Router();

router.route("/customer").get(authenticate, ctrl.allNameCustomer)

module.exports = router;
