const provider = require("./providers");

const responseSchema = require("../schemas/supportResponse.schema");

const {
  calculatePriority,
  calculateSLA,
} = require("../tools/priorityTool");

const {
  getEscalationTeam,
} = require("../tools/escalationTool");

/**
 * Normalize AI output so it always matches our schema
 */
function normalizeCategory(category = "") {
  const value = category.toLowerCase();

  if (
    value.includes("login") ||
    value.includes("password") ||
    value.includes("account") ||
    value.includes("authentication")
  ) {
    return "Account";
  }

  if (
    value.includes("billing") ||
    value.includes("invoice") ||
    value.includes("payment")
  ) {
    return "Billing";
  }

  if (value.includes("bug")) {
    return "Bug";
  }

  if (value.includes("feature")) {
    return "Feature Request";
  }

  if (
    value.includes("technical") ||
    value.includes("server") ||
    value.includes("database") ||
    value.includes("system")
  ) {
    return "Technical";
  }

  return "General";
}

function normalizeImpact(value = "") {
  value = value.toLowerCase();

  if (value === "high") return "High";
  if (value === "medium") return "Medium";

  return "Low";
}

function normalizeUrgency(value = "") {
  value = value.toLowerCase();

  if (value === "high") return "High";
  if (value === "medium") return "Medium";

  return "Low";
}

async function generateSupportResponse(question) {
  try {
    // ==========================
    // Ask AI Provider
    // ==========================

    const aiResponse = await provider.generate(question);

    console.log("========== AI RESPONSE ==========");
    console.dir(aiResponse, { depth: null });

    // ==========================
    // Normalize AI Output
    // ==========================

    const ticketCategory = normalizeCategory(
      aiResponse.ticket_category
    );

    const impact = normalizeImpact(aiResponse.impact);

    const urgency = normalizeUrgency(aiResponse.urgency);

    // ==========================
    // Business Logic
    // ==========================

    const priority = calculatePriority(
      impact,
      urgency
    );

    const sla = calculateSLA(priority);

    const escalationTeam = getEscalationTeam(
      priority,
      ticketCategory
    );

    // ==========================
    // Final Response
    // ==========================

    const response = {
      question,

      answer:
        aiResponse.answer ||
        "No answer generated.",

      source:
        aiResponse.source || [
          "Internal Knowledge Base",
        ],

      ticket_category: ticketCategory,

      impact,

      urgency,

      priority,

      sla,

      escalation_team: escalationTeam,

      suggested_reply:
        aiResponse.suggested_reply ||
        "Thank you for contacting SupportHub.",

      status:
        aiResponse.status || "Open",
    };

    // ==========================
    // Validate Response
    // ==========================

    const { error, value } =
      responseSchema.validate(response, {
        abortEarly: false,
        stripUnknown: true,
      });

    if (error) {
      throw new Error(
        `Response validation failed: ${error.details
          .map((d) => d.message)
          .join(", ")}`
      );
    }

    return value;
  } catch (error) {
    console.error("SupportHub Service Error:");
    console.error(error);

    throw new Error(
      `SupportHub Service Error: ${error.message}`
    );
  }
}

/**
 * Save feedback
 * Replace with database later
 */
async function saveFeedback(feedback) {
  return {
    id: Date.now().toString(),

    question: feedback.question,

    answer: feedback.answer,

    rating: feedback.rating,

    comment: feedback.comment || "",

    createdAt: new Date().toISOString(),
  };
}

module.exports = {
  generateSupportResponse,
  saveFeedback,
};