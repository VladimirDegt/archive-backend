const express = require("express");

const ctrl = require("../../controllers/contacts");
const validateBodyRequest = require("../../middlewares/validate-body");
const { schemaContact, schemaFavorite } = require("../../schemas");
const isValidId = require("../../middlewares/validate-id");
const authenticate = require("../../middlewares/authenticate")

const router = express.Router();

router
  .route("/")
  .get(authenticate, ctrl.getAll)
  .post(authenticate, validateBodyRequest(schemaContact), ctrl.add);

router
  .route("/:contactId")
  .get(authenticate, isValidId, ctrl.getByID)
  .put(authenticate, isValidId, validateBodyRequest(schemaContact), ctrl.updateById)
  .delete(authenticate, isValidId, ctrl.deleteById);

router
  .route("/:contactId/favorite")
  .patch(authenticate, 
    isValidId,
    validateBodyRequest(schemaFavorite),
    ctrl.updateStatusContact
  );

module.exports = router;
