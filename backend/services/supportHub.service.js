const provider = require("./providers");

const responseSchema = require("../schemas/supportResponse.schema");

const ticketModel = require("../models/ticket.model");

const taxonomy = require("../config/taxonomy");

const {
  calculatePriority,
  calculateSLA,
} = require("../tools/priorityTool");

const {
  getEscalationTeam,
} = require("../tools/escalationTool");

/*
|--------------------------------------------------------------------------
| Normalize AI Output
|--------------------------------------------------------------------------
*/

function normalizeCategory(category = "") {
  const value = category.toLowerCase();

  if (value.includes("account")) return "account_access";

  if (value.includes("login")) return "account_access";

  if (value.includes("password")) return "account_access";

  if (value.includes("technical")) return "technical_issue";

  if (value.includes("bug")) return "technical_issue";

  if (value.includes("billing")) return "billing";

  if (value.includes("payment")) return "billing";

  if (value.includes("product")) return "product_question";

  if (value.includes("feature")) return "product_question";

  if (value.includes("security")) return "security";

  if (value.includes("hack")) return "security";

  if (value.includes("outage")) return "service_outage";

  return "other";
}

function normalizeLevel(value = "") {
  value = value.toLowerCase();

  if (value.includes("high")) return "high";

  if (value.includes("medium")) return "medium";

  return "low";
}

/*
|--------------------------------------------------------------------------
| Generate Support Response
|--------------------------------------------------------------------------
*/

const generateSupportResponse = async (question) => {
  try {
    const ai = await provider.generate(question);

    const ticketCategory = normalizeCategory(
      ai.ticket_category
    );

    const impact = normalizeLevel(ai.impact);

    const urgency = normalizeLevel(ai.urgency);

    /*
    ------------------------------------------
    Validate taxonomy
    ------------------------------------------
    */

    if (!taxonomy.categories.includes(ticketCategory)) {
      throw new Error("Invalid ticket category");
    }

    if (!taxonomy.impact.includes(impact)) {
      throw new Error("Invalid impact");
    }

    if (!taxonomy.urgency.includes(urgency)) {
      throw new Error("Invalid urgency");
    }

    /*
    ------------------------------------------
    Calculate Priority
    ------------------------------------------
    */

    const priority = calculatePriority(
      impact,
      urgency
    );

    /*
    ------------------------------------------
    Calculate SLA
    ------------------------------------------
    */

    const sla = calculateSLA(priority);

    /*
    ------------------------------------------
    Escalation
    ------------------------------------------
    */

    const escalationTeam =
      getEscalationTeam(
        priority,
        ticketCategory
      );

    /*
    ------------------------------------------
    Final Ticket
    ------------------------------------------
    */

    const ticket = {

      question,

      answer:
        ai.answer ||
        "No answer returned.",

      source:
        ai.source || [
          "Internal Knowledge Base",
        ],

      ticket_category:
        ticketCategory,

      impact,

      urgency,

      priority,

      sla,

      escalation_team:
        escalationTeam,

      suggested_reply:
        ai.suggested_reply ||
        "Thank you for contacting SupportHub.",

      status:
        ai.status || "Open",

    };

    /*
    ------------------------------------------
    Validate Response
    ------------------------------------------
    */

    const { error, value } =
      responseSchema.validate(ticket, {

        abortEarly: false,

        stripUnknown: true,

      });

    if (error) {
      throw new Error(
        error.details
          .map((e) => e.message)
          .join(", ")
      );
    }

    /*
    ------------------------------------------
    Save Ticket
    ------------------------------------------
    */

    const savedTicket =
      await ticketModel.createTicket(value);

    return savedTicket;

  } catch (error) {

    throw new Error(
      `SupportHub Service Error: ${error.message}`
    );

  }
};

/*
|--------------------------------------------------------------------------
| Feedback
|--------------------------------------------------------------------------
*/

const saveFeedback = async (feedback) => {

  return feedback;

};

module.exports = {

  generateSupportResponse,

  saveFeedback,

};