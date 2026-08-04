const Joi = require("joi");

module.exports = Joi.object({

  ticket_id: Joi.number()
    .integer()
    .positive()
    .required(),

  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),

  comment: Joi.string()
    .allow("")
    .max(1000),

});