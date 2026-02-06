import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FactStatement, MapSearchResponse, MapResult, VerificationCategory, RouteInfo } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Gemini 3 for complex reasoning and search
const searchModelName = 'gemini-3-pro-preview';
// Gemini 2.5 for Maps Grounding (Mandatory per API specs)
const mapsModelName = 'gemini-2.5-flash';

export const generateFactStatement = async (category: VerificationCategory): Promise<FactStatement> => {
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      statement: { type: Type.STRING, description: "The fact or myth for the student to check." },
      isTrue: { type: Type.BOOLEAN, description: "Whether the statement is true or false." },
      explanation: { type: Type.STRING, description: "A simple explanation of the truth." },
      searchHint: { type: Type.STRING, description: "A suggested search query to find the answer." }
    },
    required: ["statement", "isTrue", "explanation", "searchHint"]
  };

  let specificPrompt = "";
  switch (category) {
    case 'COMMON_SENSE':
      specificPrompt = "Generate a statement about general knowledge, science, or daily life. It should be a common fact OR a common misconception/myth.";
      break;
    case 'NEWS_CREDIBILITY':
      specificPrompt = "Generate a short news headline or public claim. It should be either a real recent event or a plausible-sounding but fake news item/rumor.";
      break;
    case 'PLACE_EXISTENCE':
      specificPrompt = "Generate a statement claiming a specific building, landmark, or island exists. It could be a real obscure place or a fictional/mythical place presented as real (e.g. Atlantis, a fake island).";
      break;
    case 'LOCATION_ACCURACY':
      specificPrompt = "Generate a statement about the geographical location of a place (e.g., 'X is located in Y', 'X is the capital of Y'). It can be geographically correct or subtly incorrect.";
      break;
    case 'DISTANCE_REACHABILITY':
      specificPrompt = "Generate a statement about the distance between two places or the feasibility of traveling between them (e.g. 'You can walk from A to B in 1 hour', 'A is 500 miles from B').";
      break;
  }

  const fullPrompt = `${specificPrompt} 
  Randomly decide if the statement is True or False (aim for 50/50). 
  Ensure false statements are tricky but clearly factually wrong upon checking.
  Return JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: searchModelName,
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.9,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as FactStatement;
  } catch (error) {
    console.error("Failed to generate fact:", error);
    // Fallback
    return {
      statement: "The Great Wall of China is visible from the Moon with the naked eye.",
      isTrue: false,
      explanation: "This is a common myth. Astronauts have confirmed you cannot see it without aid.",
      searchHint: "Can you see Great Wall from moon"
    };
  }
};

export const performWebSearch = async (query: string): Promise<string> => {
  try {
    console.log(`Searching for: ${query}`);
    const response = await ai.models.generateContent({
      model: searchModelName,
      contents: `User Query: "${query}". 
      You are a smart web browser assistant. Provide a direct, comprehensive, and easy-to-read answer to the user's query. 
      Do not simply list links. Summarize the information found on the web to answer the question directly.`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    if (response.text) {
        return response.text;
    }
    
    return "I couldn't find a direct answer, but you can try rephrasing your search.";
  } catch (error) {
    console.error("Search failed:", error);
    return "Unable to connect to the internet. Please check your connection.";
  }
};

export const performMapSearch = async (query: string): Promise<MapSearchResponse> => {
  try {
    // Agentic prompt: We ask the model to act as a Maps agent.
    // We inject a special instruction to detect Routes/Distance requests.
    const response = await ai.models.generateContent({
      model: mapsModelName,
      contents: `You are a helpful Google Maps Agent. The user asks: "${query}". 
      Use the googleMaps tool to find real-time information.

      1. IF the user asks for a ROUTE, DISTANCE, or directions (e.g. "from A to B", "distance between X and Y"):
         - Calculate the distance and duration.
         - Provide a helpful text summary including the miles/km and time.
         - CRITICAL: At the very end of your response, append a hidden tag exactly like this:
           <<<ROUTE:{"origin": "Exact Origin Name", "destination": "Exact Destination Name"}>>>
      
      2. IF the user asks for PLACES (e.g. "coffee shops"):
         - Find several top-rated options.
         - Always try to provide the address, rating, and business type for places found.
      
      Keep the answer natural and helpful.`,
      config: {
        tools: [{googleMaps: {}}],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const places: MapResult[] = [];
    let fullText = response.text || "I found some information for you.";
    let routeInfo: RouteInfo | undefined;

    // Check for the special ROUTE tag
    const routeMatch = fullText.match(/<<<ROUTE:(.*?)>>>/);
    if (routeMatch && routeMatch[1]) {
        try {
            const parsedRoute = JSON.parse(routeMatch[1]);
            routeInfo = {
                origin: parsedRoute.origin,
                destination: parsedRoute.destination
            };
            // Clean the tag from the displayed text
            fullText = fullText.replace(routeMatch[0], '').trim();
        } catch (e) {
            console.error("Failed to parse route JSON", e);
        }
    }

    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.maps) {
                 const title = chunk.maps.title;
                 const address = chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.text || "Address details on map";
                 
                 if (!places.find(p => p.name === title)) {
                     places.push({
                        name: title,
                        address: address,
                        websiteUri: chunk.maps.uri,
                        rating: "4.5", 
                        reviews: "100+",
                        category: "Point of Interest",
                        description: `Location found via Google Maps.`,
                        openStatus: "See map",
                     });
                 }
            } else if (chunk.web && chunk.web.uri && chunk.web.uri.includes('google.com/maps')) {
                 if (!places.find(p => p.name === chunk.web.title)) {
                    places.push({
                        name: chunk.web.title,
                        address: "Location via Google Maps",
                        websiteUri: chunk.web.uri,
                        rating: "4.5",
                        reviews: "50+",
                        category: "Place",
                        description: "Web result from Google Maps.",
                    });
                 }
            }
        });
    }

    return {
        places,
        answer: fullText,
        route: routeInfo
    };

  } catch (error) {
    console.error("Map search failed:", error);
    return {
        places: [],
        answer: "I'm having trouble connecting to Google Maps right now. Please try again."
    };
  }
};