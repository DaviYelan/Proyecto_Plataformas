import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getTravelAdvice = async (query: string): Promise<{ text: string; chartData?: any[] }> => {
  if (!apiKey) {
    return { text: "API Key not configured. Please check environment variables." };
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // We ask for JSON to potentially get chart data along with the advice
    const response = await ai.models.generateContent({
      model: model,
      contents: `You are a travel expert for Ecuador (BusGo). 
      The user asks: "${query}".
      
      Provide a helpful response. If the user asks about a specific place or "best time to visit", 
      also provide a hypothetical "monthly visitor score" (0-100) for that place in the 'chartData' field. 
      Otherwise 'chartData' should be empty.
      
      Return JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING, description: "The text response to the user." },
            chartData: {
              type: Type.ARRAY,
              description: "Optional array for visualization",
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  visitors: { type: Type.INTEGER }
                }
              }
            }
          }
        }
      }
    });

    const jsonResponse = JSON.parse(response.text || '{}');
    return {
      text: jsonResponse.advice || "Lo siento, no pude generar una respuesta.",
      chartData: jsonResponse.chartData
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Lo siento, hubo un error al consultar al asistente de viaje." };
  }
};