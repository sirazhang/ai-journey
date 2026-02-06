import { getGeminiUrl } from '../config/api'

// Generate a fact statement for verification
export const generateFactStatement = async (category) => {
  try {
    let specificPrompt = ""
    
    switch (category) {
      case 'COMMON_SENSE':
        specificPrompt = "Generate a statement about general knowledge, science, or daily life. It should be a common fact OR a common misconception/myth."
        break
      case 'NEWS_CREDIBILITY':
        specificPrompt = "Generate a short news headline or public claim. It should be either a real recent event or a plausible-sounding but fake news item/rumor."
        break
      case 'PLACE_EXISTENCE':
        specificPrompt = "Generate a statement claiming a specific building, landmark, or island exists. It could be a real obscure place or a fictional/mythical place presented as real (e.g. Atlantis, a fake island)."
        break
      case 'LOCATION_ACCURACY':
        specificPrompt = "Generate a statement about the geographical location of a place (e.g., 'X is located in Y', 'X is the capital of Y'). It can be geographically correct or subtly incorrect."
        break
      case 'DISTANCE_REACHABILITY':
        specificPrompt = "Generate a statement about the distance between two places or the feasibility of traveling between them (e.g. 'You can walk from A to B in 1 hour', 'A is 500 miles from B')."
        break
      default:
        specificPrompt = "Generate a general fact or myth statement."
    }

    const fullPrompt = `${specificPrompt}

Randomly decide if the statement is True or False (aim for 50/50). 
Ensure false statements are tricky but clearly factually wrong upon checking.

Return a JSON object with this exact structure:
{
  "statement": "The fact or myth for the student to check",
  "isTrue": true or false,
  "explanation": "A simple explanation of the truth",
  "searchHint": "A suggested search query to find the answer"
}

Only return the JSON, nothing else.`

    const response = await fetch(getGeminiUrl('gemini-3-pro-preview'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          responseMimeType: "application/json"
        }
      })
    })

    if (response.status === 429) {
      console.warn('API rate limit exceeded. Using fallback.')
      return getFallbackStatement(category)
    }

    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}. Using fallback.`)
      return getFallbackStatement(category)
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const text = data.candidates[0].content.parts[0].text
      return JSON.parse(text)
    }

    return getFallbackStatement(category)
  } catch (error) {
    console.error('generateFactStatement error:', error)
    return getFallbackStatement(category)
  }
}

// Perform web search using Gemini with Google Search
export const performWebSearch = async (query) => {
  try {
    const response = await fetch(getGeminiUrl('gemini-3-pro-preview'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `User Query: "${query}". 
You are a smart web browser assistant. Provide a direct, comprehensive, and easy-to-read answer to the user's query. 
Do not simply list links. Summarize the information found on the web to answer the question directly.
Keep the answer concise (2-3 paragraphs max).` 
          }]
        }],
        tools: [{
          googleSearch: {}
        }]
      })
    })

    if (response.status === 429) {
      return "API rate limit exceeded. Please try again in a moment."
    }

    if (!response.ok) {
      return "Unable to perform search. Please try again."
    }

    const data = await response.json()
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }

    return "I couldn't find a direct answer, but you can try rephrasing your search."
  } catch (error) {
    console.error('performWebSearch error:', error)
    return "Unable to connect to the internet. Please check your connection."
  }
}

// Perform map search using Gemini with Google Maps
export const performMapSearch = async (query) => {
  try {
    const response = await fetch(getGeminiUrl('gemini-2.5-flash'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `You are a helpful Google Maps Agent. The user asks: "${query}". 
Use the googleMaps tool to find real-time information.

1. IF the user asks for a ROUTE, DISTANCE, or directions (e.g. "from A to B", "distance between X and Y"):
   - Calculate the distance and duration.
   - Provide a helpful text summary including the miles/km and time.
   - Format: "Distance: X km/miles, Driving time: Y hours, Walking time: Z hours"

2. IF the user asks for PLACES (e.g. "coffee shops", "restaurants"):
   - Find several top-rated options.
   - Provide name, address, and rating for each place.

3. IF the user asks about a LOCATION (e.g. "Where is California"):
   - Provide the location information, coordinates if available.
   - Confirm if the place exists.

Keep the answer natural and helpful.` 
          }]
        }],
        tools: [{
          googleMaps: {}
        }]
      })
    })

    if (response.status === 429) {
      return {
        answer: "API rate limit exceeded. Please try again in a moment.",
        places: []
      }
    }

    if (!response.ok) {
      return {
        answer: "Unable to perform map search. Please try again.",
        places: []
      }
    }

    const data = await response.json()
    
    let answer = "I found some information for you."
    const places = []

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      answer = data.candidates[0].content.parts[0].text
    }

    // Extract places from grounding metadata if available
    const chunks = data.candidates?.[0]?.groundingMetadata?.groundingChunks
    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.maps) {
          const title = chunk.maps.title
          const address = chunk.maps.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.text || "See map for details"
          
          if (!places.find(p => p.name === title)) {
            places.push({
              name: title,
              address: address,
              rating: "4.5",
              category: "Point of Interest"
            })
          }
        }
      })
    }

    return { answer, places }
  } catch (error) {
    console.error('performMapSearch error:', error)
    return {
      answer: "I'm having trouble connecting to Google Maps right now. Please try again.",
      places: []
    }
  }
}

// Fallback statements for each category
const getFallbackStatement = (category) => {
  const fallbacks = {
    'COMMON_SENSE': {
      statement: "The Great Wall of China is visible from the Moon with the naked eye.",
      isTrue: false,
      explanation: "This is a common myth. Astronauts have confirmed you cannot see it without aid.",
      searchHint: "Can you see Great Wall from moon"
    },
    'NEWS_CREDIBILITY': {
      statement: "A major tech company announced they will release flying cars next year.",
      isTrue: false,
      explanation: "This is likely fake news. No major tech company has made such an announcement.",
      searchHint: "flying cars announcement 2026"
    },
    'PLACE_EXISTENCE': {
      statement: "The lost city of Atlantis has been discovered in the Atlantic Ocean.",
      isTrue: false,
      explanation: "Atlantis is a mythical place from Plato's writings. It has never been found.",
      searchHint: "Atlantis real or myth"
    },
    'LOCATION_ACCURACY': {
      statement: "California is located on the west coast of the United States.",
      isTrue: true,
      explanation: "This is correct. California is indeed on the west coast of the USA.",
      searchHint: "where is California located"
    },
    'DISTANCE_REACHABILITY': {
      statement: "You can walk from New York to Los Angeles in 2 days.",
      isTrue: false,
      explanation: "This is impossible. The distance is about 2,800 miles and would take months to walk.",
      searchHint: "distance New York to Los Angeles walking"
    }
  }

  return fallbacks[category] || fallbacks['COMMON_SENSE']
}
