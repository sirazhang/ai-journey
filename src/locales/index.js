import { en } from './en.js'
import { zh } from './zh.js'

export const translations = {
  en,
  zh
}

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key
}