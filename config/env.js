require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,

  NODE_ENV: process.env.NODE_ENV || "development",

  GROQ_API_KEY: process.env.GROQ_API_KEY,

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  AI_PROVIDER: process.env.AI_PROVIDER || "groq",

  AI_TIMEOUT: Number(process.env.AI_TIMEOUT) || 30000,

  MAX_INPUT_LENGTH: Number(process.env.MAX_INPUT_LENGTH) || 2000,

  API_VERSION: "1.0.0",

  PROMPT_VERSION: "v1",
};