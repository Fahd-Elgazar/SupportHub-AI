 const getEscalationTeam = (priority, category) => {
  if (priority === "P1") {
    return "Critical Incident Team";
  }

  if (priority === "P2") {
    switch (category) {
      case "Technical":
        return "Technical Support Team";

      case "Account":
        return "Account Support Team";

      case "Billing":
        return "Billing Team";

      case "Bug":
        return "Engineering Team";

      default:
        return "Support Team";
    }
  }

  switch (category) {
    case "Technical":
      return "Technical Support Team";

    case "Billing":
      return "Billing Team";

    case "Account":
      return "Account Support Team";

    case "Feature Request":
      return "Product Team";

    case "Bug":
      return "Engineering Team";

    default:
      return "Support Team";
  }
};

module.exports = {
  getEscalationTeam,
};