const Groq = require("groq-sdk");

const env = require("../../config/env");
const { supportPrompt } = require("../../config/prompts");

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

async function generate(question) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: supportPrompt,
        },
        {
          role: "user",
          content: question,
        },
      ],

      temperature: 0.2,

      response_format: {
        type: "json_object",
      },
    });

    const content = completion.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("========== GROQ ERROR ==========");

    if (error.status) {
      console.error("Status:", error.status);
    }

    console.error(error);

    throw error;
  }
}

module.exports = {
  generate,
};