const Joi = require("joi");

module.exports = Joi.object({

  question: Joi.string().required(),

  answer: Joi.string().required(),

  source: Joi.array()
    .items(Joi.string())
    .required(),

  ticket_category: Joi.string()
    .valid(
      "account_access",
      "technical_issue",
      "billing",
      "product_question",
      "security",
      "service_outage",
      "other"
    )
    .required(),

  impact: Joi.string()
    .valid(
      "low",
      "medium",
      "high"
    )
    .required(),

  urgency: Joi.string()
    .valid(
      "low",
      "medium",
      "high"
    )
    .required(),

  priority: Joi.string()
    .valid(
      "P1",
      "P2",
      "P3",
      "P4"
    )
    .required(),

  sla: Joi.string().required(),

  escalation_team: Joi.string().required(),

  suggested_reply: Joi.string().required(),

  status: Joi.string()
    .valid(
      "Open",
      "In Progress",
      "Resolved",
      "Closed"
    )
    .required(),

});