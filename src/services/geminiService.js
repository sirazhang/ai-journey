// Gemini API Service for NPC Chat
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        })
      }
    )

    const data = await response.json()
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text
    }

    return "I'm sorry, I didn't catch that."
  } catch (error) {
    console.error("Gemini API Error:", error)
    return "I'm having trouble connecting to the network right now."
  }
}
