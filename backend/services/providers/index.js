const groq = require("./groq.provider");
const gemini = require("./gemini.provider");

const providers = [
  {
    name: "Groq",
    service: groq,
  },
  {
    name: "Gemini",
    service: gemini,
  },
];

async function generate(question) {
  let lastError = null;

  for (const provider of providers) {
    try {
      console.log(`Using ${provider.name} Provider...`);

      const result = await provider.service.generate(question);

      console.log(`${provider.name} succeeded.`);

      return result;
    } catch (error) {
      lastError = error;

      console.error(`${provider.name} failed.`);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error(error.response.data);
      } else {
        console.error(error.message);
      }
    }
  }

  throw lastError || new Error("No AI provider available.");
}

module.exports = {
  generate,
};