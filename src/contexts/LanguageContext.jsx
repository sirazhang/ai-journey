import React, { createContext, useContext, useState, useEffect } from 'react'
import { getTranslation } from '../locales'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('aiJourneyLanguage')
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'zh')) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem('aiJourneyLanguage', newLanguage)
  }

  const t = (key) => getTranslation(language, key)

  const value = {
    language,
    changeLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}