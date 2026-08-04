require("dotenv").config();

module.exports = {

  PORT: process.env.PORT || 3000,

  NODE_ENV: process.env.NODE_ENV || "development",

  API_VERSION:
    process.env.API_VERSION || "1.0.0",

  PROMPT_VERSION:
    process.env.PROMPT_VERSION || "v1",

  AI_PROVIDER:
    process.env.AI_PROVIDER || "groq",

  AI_TIMEOUT:
    Number(process.env.AI_TIMEOUT) || 30000,

  MAX_INPUT_LENGTH:
    Number(process.env.MAX_INPUT_LENGTH) || 2000,

  CORS_ORIGIN:
    process.env.CORS_ORIGIN || "http://localhost:5173",

  GROQ_API_KEY:
    process.env.GROQ_API_KEY,

  GEMINI_API_KEY:
    process.env.GEMINI_API_KEY,

  DB_HOST:
    process.env.DB_HOST || "localhost",

  DB_PORT:
    Number(process.env.DB_PORT) || 5432,

  DB_USER:
    process.env.DB_USER || "postgres",

  DB_PASSWORD:
    process.env.DB_PASSWORD || "",

  DB_NAME:
    process.env.DB_NAME || "supporthub",

};