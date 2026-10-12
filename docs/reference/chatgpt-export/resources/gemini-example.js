// Illustrative snippet from the conversation; not a complete backend.
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION || "global"
});

export async function analyzeCall(context) {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: [{
      role: "user",
      parts: [{
        text: JSON.stringify({
          task: "Analyze this bank support call",
          context
        })
      }]
    }],
    config: {
      systemInstruction: `
You assist a human bank support agent.

Use only the supplied customer facts and policy excerpts.
Do not invent transactions, policies, or case outcomes.
Distinguish observations from recommendations.
If evidence is insufficient, request clarification.
Never claim an action was completed.
All account-changing actions require server-side
validation, role authorization and agent approval.
      `
    }
  });

  return response.text;
}
