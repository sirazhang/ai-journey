import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the client. The API key is injected from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  systemInstruction: string = "You are a helpful AI assistant."
): Promise<string> => {
  try {
    // Create a chat session with history
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    const response: GenerateContentResponse = await chat.sendMessage({
        message: message
    });

    return response.text || "I'm sorry, I didn't catch that.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the network right now.";
  }
};