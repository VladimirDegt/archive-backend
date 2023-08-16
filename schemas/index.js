const schemaFavorite = require("./update-favorite-schema");
const schemaContact = require("./validate-contacts-schema");
const  {loginSchema,  registerSchema, fieldSubscriptionSchema} = require("./register-login-subscription-schemas");

module.exports = {
  schemaContact,
  schemaFavorite,
  loginSchema,
  registerSchema,
  fieldSubscriptionSchema
};
