const Joi = require("joi");

const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;

const registerSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing field password",
    "string.min": "password length must be at least 6 characters long",
  }),
  email: Joi.string().pattern(emailPattern).required().messages({
    "any.required": "missing field email",
    "string.pattern": "email not valid",
  }),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "field subscription  must be one of 'starter', 'pro', 'business'",
  }),
});

const loginSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing field password",
    "string.min": "password length must be at least 6 characters long",
  }),
  email: Joi.string().pattern(emailPattern).required().messages({
    "any.required": "missing field email",
    "string.pattern": "email not valid",
  }),
});

const fieldSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.only":
      "field subscription  must be one of 'starter', 'pro', 'business'",
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
  fieldSubscriptionSchema,
};
