import { GoogleGenerativeAI } from "@google/generative-ai";
import { MESSAGE_VALIDATION_INSTRUCTIONS } from "./messageValidation.js";

let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Add it to backend/.env before calling AI validation.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

export const classifyMessageWithAI = async (text, { model: suppliedModel } = {}) => {
  try {
    const model = suppliedModel || getGenAI().getGenerativeModel({
      // Keep validation policy separate from untrusted resident text.
      model: "gemini-2.5-flash",
      systemInstruction: MESSAGE_VALIDATION_INSTRUCTIONS,
      generationConfig: { responseMimeType: "application/json", temperature: 0 },
    });

    const prompt = JSON.stringify({ message: text });

    const result = await model.generateContent(prompt, { timeout: 15000 });
    const responseText = result.response.text();
    const classification = JSON.parse(responseText);
    if (
      !classification ||
      typeof classification.valid !== "boolean" ||
      !["High", "Medium", "Low"].includes(classification.urgency) ||
      !["Emergency", "Dispute", "General"].includes(classification.type)
    ) {
      throw new Error("Gemini returned an invalid classification.");
    }
    return classification;
  } catch (error) {
    console.error("AI Triage failed; message submission blocked.", { status: error.status || null });
    throw error;
  }
};

