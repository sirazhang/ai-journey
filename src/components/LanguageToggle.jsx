import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle = ({ position = 'topLeft' }) => {
  const { language, changeLanguage, t } = useLanguage()

  const handleToggle = () => {
    const newLanguage = language === 'en' ? 'zh' : 'en'
    changeLanguage(newLanguage)
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'topLeft':
        return { top: '5%', left: '5%' } // 与AETHER DESERT顶部对齐，与FUNGI JUNGLE左边对齐
      case 'topRight':
        return { top: '20px', right: '20px' }
      default:
        return { top: '5%', left: '5%' }
    }
  }

  const styles = {
    languageButton: {
      position: 'absolute',
      ...getPositionStyles(),
      padding: '10px 20px',
      borderRadius: '8px',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      background: 'rgba(0, 0, 0, 0.3)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      cursor: 'pointer',
      zIndex: 100,
      transition: 'all 0.2s',
      backdropFilter: 'blur(5px)',
    }
  }

  return (
    <button 
      style={styles.languageButton}
      onClick={handleToggle}
      onMouseOver={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.5)'
        e.target.style.transform = 'scale(1.05)'
      }}
      onMouseOut={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.3)'
        e.target.style.transform = 'scale(1)'
      }}
    >
      {language === 'en' ? '中文' : 'EN'}
    </button>
  )
}

export default LanguageToggle