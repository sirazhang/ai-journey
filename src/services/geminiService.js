// Gemini API Service for NPC Chat
import { getGeminiUrl } from '../config/api'

// Helper function: Call Gemini API with automatic fallback
// Tries gemini-3-flash-preview first, falls back to gemini-2.0-flash-exp
const callGeminiWithFallback = async (requestBody) => {
  // Try gemini-3-flash-preview first
  try {
    console.log('🔄 Attempting API call with gemini-3-flash-preview...')
    const response = await fetch(
      getGeminiUrl('gemini-3-flash-preview'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API call successful with gemini-3-flash-preview')
      return { success: true, data }
    } else {
      console.warn(`⚠️ gemini-3-flash-preview failed with status ${response.status}, trying fallback...`)
    }
  } catch (error) {
    console.warn('⚠️ gemini-3-flash-preview error, trying fallback:', error.message)
  }

  // Fallback to gemini-2.0-flash-exp
  try {
    console.log('🔄 Attempting API call with gemini-2.0-flash-exp (fallback)...')
    const response = await fetch(
      getGeminiUrl('gemini-2.0-flash-exp'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('✅ API call successful with gemini-2.0-flash-exp')
      return { success: true, data }
    } else {
      console.error(`❌ gemini-2.0-flash-exp also failed with status ${response.status}`)
      return { success: false, error: `API failed with status ${response.status}` }
    }
  } catch (error) {
    console.error('❌ Both API calls failed:', error.message)
    return { success: false, error: error.message }
  }
}

export const sendMessageToGemini = async (
  message,
  history,
  systemInstruction = "You are a helpful AI assistant."
) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('Gemini API key not found')
      return "I'm having trouble connecting. Please check the API configuration."
    }

    // Format history for Gemini API
    const contents = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.parts[0].text }]
    }))

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    })

    const requestBody = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    }

    // Use fallback helper
    const result = await callGeminiWithFallback(requestBody)
    
    if (!result.success) {
      return "I'm having trouble connecting right now. Please try again in a moment."
    }

    const data = result.data
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }

    return "I'm sorry, I didn't catch that."
  } catch (error) {
    console.error("Gemini API Error:", error)
    return "I'm having trouble connecting to the network right now."
  }
}


// iPad Co-Creation Functions

// Generate a story starter and random shape
export const generateIdea = async () => {
  const shapes = ['circle', 'heart', 'square', 'triangle', 'star']
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
  
  const themes = [
    "space exploration", "magical forest", "underwater city", 
    "superhero academy", "friendly monsters", "robot helpers", 
    "flying castles", "secret garden", "talking animals", "candy land"
  ]
  const randomTheme = themes[Math.floor(Math.random() * themes.length)]

  const prompt = `Generate a creative story starter (1-2 sentences) for a child's drawing activity. 
  The story should be imaginative and open-ended. 
  The theme is: ${randomTheme}.
  The child sees a simple outline of a ${randomShape} on the screen.
  
  CRITICAL RULES:
  1. It MUST be an incomplete sentence ending with "...".
  2. It MUST be very short (under 10 words).
  3. Do NOT write a full story. Just the start.
  
  Example: "Deep in the ocean, a blue heart..."
  Example: "On top of the hill, a square box..."
  
  Only return the story starter text, nothing else.`

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 1.2,
      maxOutputTokens: 100,
    }
  }

  // Use fallback helper
  const result = await callGeminiWithFallback(requestBody)
  
  if (result.success && result.data.candidates && result.data.candidates[0]?.content?.parts?.[0]?.text) {
    const storyStarter = result.data.candidates[0].content.parts[0].text.trim()
    return { shape: randomShape, storyStarter }
  }

  // Final fallback
  console.warn('⚠️ All API calls failed for generateIdea, using fallback story')
  return {
    shape: randomShape,
    storyStarter: `Once upon a time, there was a magical ${randomShape} that...`
  }
}

// Polish user's story text
export const polishStory = async (userStory) => {
  const prompt = `A child wrote this story fragment: "${userStory}". 
  Complete the sentence and end the story.
  
  CRITICAL RULES:
  1. Keep it extremely short (max 2 sentences total).
  2. Use very simple words for a 5-year-old.
  3. Make it magical or funny.
  
  Only return the polished story, nothing else.`

  const requestBody = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 200,
    }
  }

  // Use fallback helper
  const result = await callGeminiWithFallback(requestBody)
  
  if (result.success && result.data.candidates && result.data.candidates[0]?.content?.parts?.[0]?.text) {
    return result.data.candidates[0].content.parts[0].text.trim()
  }

  // Final fallback - return original story
  console.warn('⚠️ All API calls failed for polishStory, returning original')
  return userStory
}

// Generate enhanced image from canvas drawing
// Tries gemini-3-pro-image-preview first, falls back to gemini-2.5-flash-image
export const generateMagicImage = async (drawingBase64, story, additionalPrompt = '') => {
  try {
    // Remove data URL header if present
    const cleanBase64 = drawingBase64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')

    let promptContext = `The story context is: "${story}".`
    if (additionalPrompt && additionalPrompt.trim()) {
      promptContext += ` The user also explicitly wants to include: "${additionalPrompt}".`
    }

    const prompt = `Color and enhance this child's sketch. 
    
    Instructions:
    1. DO NOT render this as a 3D object, plastic toy, or vector art.
    2. KEEP the original hand-drawn lines, wobbles, and sketchiness.
    3. Style: Soft Watercolor, Colored Pencils, or Crayon art.
    4. Simply fill in the colors within the existing lines and add a gentle artistic background.
    5. It should look like the child finished coloring their own drawing perfectly.
    6. Keep it child-friendly and magical.
    
    ${promptContext}`

    const requestBody = {
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64
            }
          },
          { text: prompt }
        ]
      }],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
      }
    }

    // Try gemini-3-pro-image-preview first (highest quality)
    try {
      console.log('Attempting image generation with gemini-3-pro-image-preview...')
      const response = await fetch(
        getGeminiUrl('gemini-3-pro-image-preview'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        }
      )

      if (response.ok) {
        const data = await response.json()
        
        // Extract image from response
        if (data.candidates && data.candidates[0]?.content?.parts) {
          for (const part of data.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              console.log('✅ Image generated successfully with gemini-3-pro-image-preview')
              return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
            }
          }
        }
      } else {
        console.warn(`⚠️ gemini-3-pro-image-preview failed with status ${response.status}, trying fallback...`)
      }
    } catch (error) {
      console.warn('⚠️ gemini-3-pro-image-preview error, trying fallback:', error.message)
    }

    // Fallback to gemini-2.5-flash-image
    console.log('Attempting image generation with gemini-2.5-flash-image (fallback)...')
    const response = await fetch(
      getGeminiUrl('gemini-2.5-flash-image'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }
    )

    // Check for rate limit error
    if (response.status === 429) {
      console.warn('⚠️ API rate limit exceeded (429). Returning original drawing.')
      return drawingBase64
    }

    if (!response.ok) {
      console.warn(`⚠️ API request failed with status ${response.status}. Returning original drawing.`)
      return drawingBase64
    }

    const data = await response.json()
    
    // Extract image from response
    if (data.candidates && data.candidates[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          console.log('✅ Image generated successfully with gemini-2.5-flash-image')
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
        }
      }
    }

    // If no image generated, return original drawing
    console.warn('⚠️ No image generated by API, returning original drawing')
    return drawingBase64
  } catch (error) {
    console.error('generateMagicImage error:', error)
    // Return original drawing as fallback
    return drawingBase64
  }
}
