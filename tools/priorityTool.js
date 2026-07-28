const calculatePriority = (impact, urgency) => {
  const matrix = {
    High: {
      High: "P1",
      Medium: "P2",
      Low: "P2",
    },

    Medium: {
      High: "P2",
      Medium: "P3",
      Low: "P3",
    },

    Low: {
      High: "P3",
      Medium: "P4",
      Low: "P4",
    },
  };

  return matrix[impact]?.[urgency] || "P4";
};

const calculateSLA = (priority) => {
  const slaMap = {
    P1: "4 Hours",
    P2: "8 Hours",
    P3: "24 Hours",
    P4: "48 Hours",
  };

  return slaMap[priority] || "48 Hours";
};

module.exports = {
  calculatePriority,
  calculateSLA,
};