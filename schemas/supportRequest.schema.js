const Joi = require("joi");

const supportRequestSchema = Joi.object({
  question: Joi.string()
    .trim()
    .min(5)
    .max(2000)
    .required()
    .messages({
      "string.empty": "Question is required.",
      "string.min": "Question must contain at least 5 characters.",
      "string.max": "Question must not exceed 2000 characters.",
      "any.required": "Question is required."
    })
});

const feedbackSchema = Joi.object({
  question: Joi.string().trim().required(),

  answer: Joi.string().trim().required(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string()
    .allow("")
    .max(1000)
});

module.exports = {
  supportRequestSchema,
  feedbackSchema
};