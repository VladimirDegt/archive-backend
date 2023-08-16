const Joi = require("joi");

const schemaContact = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "any.required": "missing field name",
    'string.min': 'name length must be at least 3 characters long',
    'string.max': 'name length must be less than 30 characters',
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required().messages({
      "any.required": "missing field email",
      'string.email': 'email must contain .com or .net',
    }),
  phone: Joi.string().required().messages({
    "any.required": "missing field phone",
  }),
  favorite: Joi.boolean().messages({
    'boolean.base': 'field favorite must be a boolean',
  }),
});

module.exports = schemaContact;
