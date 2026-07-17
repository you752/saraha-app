import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().required(),
  unique_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$",
      ),
    ),
  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .optional(),
  age: Joi.number().min(0).optional(),
  gender: Joi.string().valid("male", "female").optional(),
  profile_image: Joi.string().uri().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
