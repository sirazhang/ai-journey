// API Configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const GEMINI_API_ENDPOINTS = {
  'gemini-2.0-flash-exp': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  'gemini-2.5-flash': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
}

export const getGeminiUrl = (model = 'gemini-2.0-flash-exp') => {
  return `${GEMINI_API_ENDPOINTS[model]}?key=${GEMINI_API_KEY}`
}
