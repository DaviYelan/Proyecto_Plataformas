
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export const getAIResponse = async (prompt: string) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: `You are BusGo AI, a premium travel assistant for Ecuador. 
        You help users with bus schedules, luxury route recommendations, weather, and tourist crowd forecasts. 
        Be professional, helpful, and use emojis occasionally (🏔️, 🚌, 🇪🇨). 
        Mention specific Ecuadorian destinations like Baños, Quito, Guayaquil, Cuenca, and the Galapagos if relevant.`,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Lo siento, estoy teniendo problemas para conectarme. ¿Podrías intentar de nuevo?";
  }
};
