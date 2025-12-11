import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DERMATOLOGIST_SYSTEM_INSTRUCTION, CHEMIST_SYSTEM_INSTRUCTION } from '../constants';
import { UserSkinProfile, ProductAnalysisResult, SkinMetric, SkinConcernType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robustly sanitizes the AI output by extracting text between the first '{' and last '}'
 */
const cleanJson = (text: string): string => {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) return match[0];
  return text.trim();
};

const skinAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          concern: { type: Type.STRING, enum: Object.values(SkinConcernType) },
          severity: { type: Type.NUMBER },
          location: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ["concern", "severity", "notes"],
      },
    },
    followUpQuestion: { type: Type.STRING },
  },
  required: ["metrics", "followUpQuestion"],
};

const productAnalysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    brandName: { type: Type.STRING },
    matchScore: { type: Type.NUMBER },
    verdict: { type: Type.STRING, enum: ["YOU NEED THIS", "NEUTRAL", "YOU DON'T NEED THIS"] },
    summary: { type: Type.STRING },
    keyBenefits: { type: Type.ARRAY, items: { type: Type.STRING } },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["SAFE", "CAUTION", "AVOID", "BENEFICIAL"] },
          function: { type: Type.STRING },
          reason: { type: Type.STRING },
        },
        required: ["name", "status", "function", "reason"],
      },
    },
  },
  required: ["productName", "verdict", "ingredients", "matchScore"],
};

export const analyzeSkinImage = async (base64Image: string): Promise<{ metrics: SkinMetric[], followUpQuestion: string }> => {
  const model = "gemini-3-pro-preview"; 
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: "Analyze the skin condition. Strictly return JSON only." }
      ]
    },
    config: {
      systemInstruction: DERMATOLOGIST_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: skinAnalysisSchema,
    }
  });

  if (response.text) return JSON.parse(cleanJson(response.text));
  throw new Error("Empty analysis result");
};

export const analyzeProductImage = async (base64Image: string, userProfile: UserSkinProfile): Promise<ProductAnalysisResult> => {
  const model = "gemini-3-pro-preview"; 
  const userContext = `User Profile: ${userProfile.skinType}, Concerns: ${userProfile.primaryConcerns.join(", ")}, Strict Avoid: ${userProfile.avoid_list.join(", ")}.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image } },
        { text: `Analyze ingredients against this profile: ${userContext}. Strictly return JSON only.` }
      ]
    },
    config: {
      systemInstruction: CHEMIST_SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: productAnalysisSchema,
    }
  });

  if (response.text) return JSON.parse(cleanJson(response.text));
  throw new Error("Analysis failed");
};
