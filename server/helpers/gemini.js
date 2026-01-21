const { GoogleGenAI } = require("@google/genai");
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function test() {
  try {
    return await main(
      "gemini-3-flash-preview",
      "As an AI business analyst, hello world! [introduce yourself in 7 words]",
    );
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

async function main(model, prompt) {
  const allowedModels = ["gemini-3-flash-preview", "gemini-3-pro", "gemini-3-pro-preview"];
  if (!allowedModels.includes(model)) {
    throw new Error(`Invalid model name: ${model}`);
  }
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    // Return only the relevant content from the response
    return response?.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

module.exports = { test, main };
