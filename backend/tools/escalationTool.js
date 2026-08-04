const getEscalationTeam = (priority, category) => {
  if (priority === "P1") {
    return "Critical Incident Team";
  }

  if (priority === "P2") {
    switch (category) {
      case "technical_issue":
        return "Technical Support Team";

      case "account_access":
        return "Account Support Team";

      case "billing":
        return "Billing Team";

      default:
        return "Support Team";
    }
  }

  switch (category) {
    case "technical_issue":
      return "Technical Support Team";

    case "billing":
      return "Billing Team";

    case "account_access":
      return "Account Support Team";

    case "product_question":
      return "Product Team";

    default:
      return "Support Team";
  }
};

module.exports = {
  getEscalationTeam,
};