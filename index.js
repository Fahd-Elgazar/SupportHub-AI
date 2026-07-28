require("dotenv").config();

const express = require("express");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const supportHubRoutes = require("./routes/supportHub.routes");

const app = express();

// ===========================
// Middleware
// ===========================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(logger);

// ===========================
// Routes
// ===========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to SupportHub AI API",
  });
});

app.use("/api/supporthub-ai", supportHubRoutes);

// ===========================
// 404 Handler
// ===========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

// ===========================
// Global Error Handler
// ===========================

app.use(errorHandler);

// ===========================
// Start Server
// ===========================

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;