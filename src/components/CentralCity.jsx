import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import useBackgroundMusic from '../hooks/useBackgroundMusic'

const CentralCity = ({ onExit }) => {
  const { t } = useLanguage()

  // Background music
  useBackgroundMusic('/sound/spaceship.mp3')

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    exitButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
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
    },
    npc: {
      position: 'absolute',
      top: '200px',
      left: '150px',
      height: '250px',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      zIndex: 10,
    },
    npcImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    buttonContainer: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      zIndex: 20,
    },
    buttonCard: {
      width: '120px',
      height: '120px',
      borderRadius: '24px',
      background: 'rgba(138, 43, 226, 0.6)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      boxShadow: '0 8px 32px rgba(138, 43, 226, 0.6), 0 0 30px rgba(138, 43, 226, 0.8), inset 0 0 20px rgba(255, 255, 255, 0.15)',
    },
    buttonLabel: {
      color: '#fff',
      fontSize: '14px',
      fontWeight: 700,
      fontFamily: "'Inter', 'Roboto', sans-serif",
      letterSpacing: '1.5px',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(186, 135, 255, 0.6)',
      userSelect: 'none',
    },
    homeButton: {
      bottom: '100px',
      left: '50px',
    },
    companyButton: {
      top: '400px',
      right: '200px',
    },
    buttonIcon: {
      width: '60px',
      height: '60px',
      objectFit: 'contain',
    },
    keyframes: `
      @keyframes cardGlow {
        0%, 100% {
          box-shadow: 0 0 30px rgba(138, 43, 226, 0.8), 0 0 60px rgba(138, 43, 226, 0.4), inset 0 0 20px rgba(138, 43, 226, 0.2);
          border-color: rgba(255, 255, 255, 0.9);
        }
        50% {
          box-shadow: 0 0 50px rgba(138, 43, 226, 1), 0 0 100px rgba(138, 43, 226, 0.6), 0 0 150px rgba(138, 43, 226, 0.3), inset 0 0 30px rgba(138, 43, 226, 0.4);
          border-color: rgba(255, 255, 255, 1);
        }
      }
    `,
  }

  const handleHomeClick = () => {
    console.log('Home button clicked')
    // TODO: Implement home functionality
  }

  const handleCompanyClick = () => {
    console.log('Company button clicked')
    // TODO: Implement company functionality
  }

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      
      {/* Background */}
      <img 
        src="/city/background/city.png"
        alt="Central City" 
        style={styles.backgroundImage}
      />

      {/* Exit Button */}
      <button 
        style={styles.exitButton} 
        onClick={onExit}
        onMouseOver={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.5)'
          e.target.style.transform = 'scale(1.05)'
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.3)'
          e.target.style.transform = 'scale(1)'
        }}
      >
        {t('exit')}
      </button>

      {/* NPC */}
      <div 
        style={styles.npc}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src="/npc/npc_city.png"
          alt="City NPC"
          style={styles.npcImage}
        />
      </div>

      {/* Home Button (Purple Glassmorphism Card with Label) */}
      <div 
        style={{...styles.buttonContainer, ...styles.homeButton}}
        onClick={handleHomeClick}
        onMouseOver={(e) => {
          const card = e.currentTarget.querySelector('[data-card]')
          if (card) card.style.transform = 'scale(1.05)'
        }}
        onMouseOut={(e) => {
          const card = e.currentTarget.querySelector('[data-card]')
          if (card) card.style.transform = 'scale(1)'
        }}
      >
        <div data-card style={styles.buttonCard}>
          <img 
            src="/city/icon/home.png"
            alt="Home"
            style={styles.buttonIcon}
          />
        </div>
        <div style={styles.buttonLabel}>HOME</div>
      </div>

      {/* Company Button (Purple Glassmorphism Card with Label) */}
      <div 
        style={{...styles.buttonContainer, ...styles.companyButton}}
        onClick={handleCompanyClick}
        onMouseOver={(e) => {
          const card = e.currentTarget.querySelector('[data-card]')
          if (card) card.style.transform = 'scale(1.05)'
        }}
        onMouseOut={(e) => {
          const card = e.currentTarget.querySelector('[data-card]')
          if (card) card.style.transform = 'scale(1)'
        }}
      >
        <div data-card style={styles.buttonCard}>
          <img 
            src="/city/icon/company.png"
            alt="Company"
            style={styles.buttonIcon}
          />
        </div>
        <div style={styles.buttonLabel}>COMPANY</div>
      </div>
    </div>
  )
}

export default CentralCity
