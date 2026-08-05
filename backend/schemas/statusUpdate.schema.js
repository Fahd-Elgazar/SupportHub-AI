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

  /** Optional: set alongside status when an agent sends their edited reply. */
  reply: Joi.string()
    .trim()
    .min(1)
    .max(5000),

});
