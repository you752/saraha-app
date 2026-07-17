import Joi from "joi";

export const newMessage = Joi.object({
  receiver: Joi.string().required(),
  content: Joi.string(),
});

export const replySchema = Joi.object({
  receiver: Joi.string().required(),
  content: Joi.string().required(),
  replyTo: Joi.string().required(),
});
