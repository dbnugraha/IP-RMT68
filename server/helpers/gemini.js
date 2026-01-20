const { GoogleGenAI } = require("@google/genai");
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "As an AI business analyst, hello world! [introduce yourself in 7 words]",
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

module.exports = { test };
