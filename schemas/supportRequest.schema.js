const Joi = require("joi");

module.exports = Joi.object({

  question: Joi.string()
    .trim()
    .min(5)
    .max(2000)
    .required()
    .messages({
      "any.required": "Question is required.",
      "string.empty": "Question cannot be empty.",
      "string.min": "Question must contain at least 5 characters.",
      "string.max": "Question exceeds maximum length.",
    }),

});