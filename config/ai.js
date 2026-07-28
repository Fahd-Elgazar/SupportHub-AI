const env = require("./env");

module.exports = {
  provider: env.AI_PROVIDER,

  timeout: env.AI_TIMEOUT,

  providers: {
    groq: {
      apiKey: env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      baseURL: "https://api.groq.com/openai/v1",
    },

    gemini: {
      apiKey: env.GEMINI_API_KEY,
      model: "gemini-2.5-flash",
      baseURL:
        "https://generativelanguage.googleapis.com/v1beta",
    },
  },
};