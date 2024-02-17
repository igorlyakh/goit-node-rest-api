const Joi = require('joi');

const userSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required(),
});

const resendVerify = Joi.object({
  email: Joi.string().required(),
});

module.exports = { userSchema, resendVerify };
