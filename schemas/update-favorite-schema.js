const Joi = require("joi");

const schemaFavorite = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": "missing field favorite",
    'boolean.base': 'field favorite must be a boolean',
  }),
});

module.exports = schemaFavorite;
