const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
});

const loginSchema = Joi.object({
  emailorUsername: Joi.string().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
    first_name: Joi.string().optional(),
    last_name: Joi.string().optional(),
    bio: Joi.string().optional(),
    profile: Joi.optional(), 
  });
module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema
};
