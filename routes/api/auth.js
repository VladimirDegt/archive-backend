const express = require("express");

const {
  registerSchema,
  loginSchema,
} = require("../../schemas");
const ctrl = require("../../controllers/auth");
const validateBodyRequest = require("../../middlewares/validate-body");
const checkUniqueEmail = require("../../middlewares/check-unique-email");
const authenticate = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post(
  "/register",
  validateBodyRequest(registerSchema),
  checkUniqueEmail,
  ctrl.register
);
router.post("/login", validateBodyRequest(loginSchema), ctrl.login);
router.get("/current", authenticate, ctrl.getCurrent);
router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrl.updateFieldAvatar
);

module.exports = router;
