const calculatePriority = (impact, urgency) => {
  const matrix = {
    high: {
      high: "P1",
      medium: "P2",
      low: "P2",
    },

    medium: {
      high: "P2",
      medium: "P3",
      low: "P3",
    },

    low: {
      high: "P3",
      medium: "P4",
      low: "P4",
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