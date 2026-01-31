
import { GoogleGenAI, Type } from "@google/genai";
import { BodyMeasurements } from "../types";

export const analyzeBodyMeasurements = async (base64Image: string): Promise<BodyMeasurements> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
        {
          text: `Analyze this full-body photo and extract precise professional body measurements for high-end fashion tailoring. 
          Analyze the entire silhouette from head to toe. 
          Return the estimates in JSON format. 
          Focus on providing a complete whole-body profile: 
          Height, Neck (circumference), Shoulders (width), Chest/Bust (circumference), Waist (circumference), Hips (circumference), Arm Length (shoulder to wrist), Inseam (crotch to floor), Thigh (circumference), Calve (circumference), Wrist (circumference), and Ankle (circumference).
          Assume the subject is standing straight in a neutral pose.
          The unit must be 'cm'.`
        }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          height: { type: Type.NUMBER },
          neck: { type: Type.NUMBER },
          shoulders: { type: Type.NUMBER },
          chest: { type: Type.NUMBER },
          waist: { type: Type.NUMBER },
          hips: { type: Type.NUMBER },
          armLength: { type: Type.NUMBER },
          inseam: { type: Type.NUMBER },
          thigh: { type: Type.NUMBER },
          calve: { type: Type.NUMBER },
          wrist: { type: Type.NUMBER },
          ankle: { type: Type.NUMBER },
          unit: { type: Type.STRING }
        },
        required: ['height', 'chest', 'waist', 'hips', 'unit']
      }
    }
  });

  return JSON.parse(response.text || '{}') as BodyMeasurements;
};

export const virtualTryOn = async (userImageBase64: string, garmentDescription: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: userImageBase64,
          },
        },
        {
          text: `Perform a professional virtual try-on. Overlay the following garment onto the person in the photo: ${garmentDescription}. 
          The fit should be realistic, respecting the person's body shape, pose, and original lighting. 
          The output must be a single image part showing the result. 
          Keep the person's head and the background as they are.`
        }
      ]
    }
  });

  let imageUrl = '';
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }
  
  if (!imageUrl) throw new Error("Could not generate try-on image");
  return imageUrl;
};
