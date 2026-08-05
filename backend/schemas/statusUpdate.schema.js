const Joi = require("joi");

module.exports = Joi.object({

  status: Joi.string()
    .valid(
      "Open",
      "In Progress",
      "Resolved",
      "Closed"
    )
    .required(),

});
