const { GoogleGenAI } = require("@google/genai");

const env = require("../../config/env");
const { supportPrompt } = require("../../config/prompts");

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

async function generate(question) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${supportPrompt}\n\nUser Question:\n${question}`,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    let text = response.text;

    // Remove markdown fences if the model returns them
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("========== GEMINI ERROR ==========");

    if (error.status) {
      console.error("Status:", error.status);
    }

    console.error(error.message);

    throw error;
  }
}

module.exports = {
  generate,
};