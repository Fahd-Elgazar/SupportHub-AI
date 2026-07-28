const Joi = require("joi");

const supportResponseSchema = Joi.object({
  question: Joi.string().required(),

  answer: Joi.string().required(),

  source: Joi.array()
    .items(Joi.string())
    .required(),

  ticket_category: Joi.string()
    .valid(
      "Technical",
      "Billing",
      "Account",
      "General",
      "Bug",
      "Feature Request"
    )
    .required(),

  impact: Joi.string()
    .valid("Low", "Medium", "High")
    .required(),

  urgency: Joi.string()
    .valid("Low", "Medium", "High")
    .required(),

  priority: Joi.string()
    .valid("P1", "P2", "P3", "P4")
    .required(),

  sla: Joi.string().required(),

  escalation_team: Joi.string().required(),

  suggested_reply: Joi.string().required(),

  status: Joi.string()
    .valid("Open", "Pending", "Escalated", "Resolved")
    .required()
});

module.exports = supportResponseSchema;