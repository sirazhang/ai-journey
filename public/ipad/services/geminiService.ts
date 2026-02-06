
import { GoogleGenAI, Type } from "@google/genai";
import { IdeaPrompt, ShapeType } from "../types";

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIdea = async (): Promise<IdeaPrompt> => {
  const ai = getClient();
  const model = "gemini-3-flash-preview";
  
  // List of themes to ensure variety in every request
  const themes = [
    "space exploration", "magical forest", "underwater city", 
    "superhero academy", "friendly monsters", "robot helpers", 
    "flying castles", "secret garden", "talking animals", "candy land"
  ];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];

  // Explicitly pick a shape on the client side to guarantee variety
  const shapes: ShapeType[] = ['circle', 'heart', 'square', 'triangle', 'star'];
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

  const response = await ai.models.generateContent({
    model,
    contents: `Generate a very short, incomplete sentence fragment (a story starter) for a 5-year-old child.
    The child sees a simple outline of a ${randomShape} on the screen and needs to draw on top of it.
    The theme is: ${randomTheme}.
    
    CRITICAL RULES:
    1. It MUST be an incomplete sentence ending with "...".
    2. It MUST be very short (under 10 words).
    3. Do NOT write a full story. Just the start.
    
    Example: "Deep in the ocean, a blue heart..."
    Example: "On top of the hill, a square box..."
    
    Output JSON only.`,
    config: {
      temperature: 1.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          storyStarter: {
            type: Type.STRING,
            description: "A short, incomplete sentence ending in '...'"
          }
        },
        required: ["storyStarter"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  const json = JSON.parse(text);
  
  // Return the client-selected shape combined with the AI-generated story
  return {
    shape: randomShape,
    storyStarter: json.storyStarter
  };
};

export const polishStory = async (inputStory: string): Promise<string> => {
  const ai = getClient();
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `A child wrote this story fragment: "${inputStory}". 
    Complete the sentence and end the story.
    
    CRITICAL RULES:
    1. Keep it extremely short (max 2 sentences total).
    2. Use very simple words for a 5-year-old.
    3. Make it magical or funny.`,
  });

  return response.text || inputStory;
};

export const generateMagicImage = async (drawingBase64: string, story: string, additionalPrompt?: string): Promise<string> => {
  const ai = getClient();
  // Using the "nano banana" equivalent for high quality/fast image generation if available, 
  // but for initial generation from scratch + text, flash-image is the standard choice.
  // Prompt mapped to: 'gemini-2.5-flash-image'
  const model = "gemini-2.5-flash-image"; 

  // Remove data URL header if present
  const cleanBase64 = drawingBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  let promptContext = `The story context is: "${story}".`;
  if (additionalPrompt && additionalPrompt.trim()) {
    promptContext += ` The user also explicitly wants to include: "${additionalPrompt}".`;
  }

  // Revised prompt to strict adhere to the hand-drawn style to avoid over-rendering.
  const prompt = `Color this child's sketch. 
  
  Instructions:
  1. DO NOT render this as a 3D object, plastic toy, or vector art.
  2. KEEP the original hand-drawn lines, wobbles, and sketchiness.
  3. Style: Soft Watercolor, Colored Pencils, or Crayon art.
  4. Simply fill in the colors within the existing lines and add a gentle artistic background.
  5. It should look like the child finished coloring their own drawing perfectly.
  
  ${promptContext}`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/png",
            data: cleanBase64
          }
        },
        { text: prompt }
      ]
    }
  });

  // Extract image from response
  // The SDK might return it in parts with inlineData
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated.");
};

export const editGeneratedImage = async (currentImageBase64: string, editInstruction: string): Promise<string> => {
  const ai = getClient();
  // Using 'gemini-2.5-flash-image' (Nano Banana) for editing as requested
  const model = "gemini-2.5-flash-image";

  const cleanBase64 = currentImageBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/png",
            data: cleanBase64
          }
        },
        { text: `Edit this image. Instruction: ${editInstruction}. Maintain the watercolor/hand-drawn style.` }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No edited image generated.");
};
