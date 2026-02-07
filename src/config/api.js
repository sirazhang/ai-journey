// API Configuration
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const GEMINI_API_ENDPOINTS = {
  'gemini-3-flash-preview': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',
  'gemini-2.0-flash-exp': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
  'gemini-3-pro-image-preview': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent',
  'gemini-2.5-flash-image': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
  'gemini-3-pro-preview': 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent'
}

export const getGeminiUrl = (model = 'gemini-3-flash-preview') => {
  return `${GEMINI_API_ENDPOINTS[model]}?key=${GEMINI_API_KEY}`
}

// Backend API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
