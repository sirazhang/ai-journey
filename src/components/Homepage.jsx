import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'
import { useLanguage } from '../contexts/LanguageContext'

const Homepage = ({ onStart, onContinue, onSignIn, onStartOver }) => {
  const { t } = useLanguage()
  const [hasProgress, setHasProgress] = useState(false)
  const [username, setUsername] = useState('')
  const { playClickSound } = useSoundEffects()

  useEffect(() => {
    // Check if user has previous progress
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUsername(userData.username || '')
      setHasProgress(userData.hasStarted === true)
    }
  }, [])

  const handleStartOver = () => {
    playClickSound() // Add click sound
    // Reset progress but keep user info
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.hasStarted = false
      userData.currentProgress = null
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
    if (onStartOver) {
      onStartOver()
    } else {
      onStart()
    }
  }

  const handleStart = () => {
    playClickSound() // Add click sound
    onStart()
  }

  const handleContinue = () => {
    playClickSound() // Add click sound
    if (onContinue) {
      onContinue()
    } else {
      onStart()
    }
  }

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    },
    backgroundGif: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
    },
    welcome: {
      position: 'absolute',
      top: '30px',
      left: '40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 400,
      color: '#fff',
      zIndex: 3,
    },
    signInButton: {
      position: 'absolute',
      top: '25px',
      right: '40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      color: '#fff',
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '8px',
      padding: '10px 25px',
      zIndex: 3,
      transition: 'all 0.3s ease',
    },
    content: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '90px',
      fontWeight: 800,
      color: '#fff',
      marginBottom: '10px',
      textAlign: 'center',
      letterSpacing: '8px',
      textShadow: '0 4px 20px rgba(0,0,0,0.5)',
    },
    subtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '22px',
      fontWeight: 300,
      color: '#fff',
      marginBottom: '50px',
      textAlign: 'center',
      opacity: 0.9,
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    // CONTINUE button for returning users - glassmorphism style with gradient border
    continueButton: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '32px',
      fontWeight: 700,
      color: '#fff',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), linear-gradient(90deg, #5170FF, #8B5CF6, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      padding: '25px 120px',
      borderRadius: '15px',
      letterSpacing: '3px',
      transition: 'all 0.3s ease',
      marginBottom: '25px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    },
    // START OVER text button
    startOverButton: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '22px',
      fontWeight: 600,
      color: '#fff',
      background: 'transparent',
      border: 'none',
      padding: '10px 30px',
      letterSpacing: '2px',
      opacity: 0.9,
      transition: 'opacity 0.3s ease',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    // START button for first-time users (in card)
    cardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 80px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'floatCard 3s ease-in-out infinite',
    },
    cardGradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.2), rgba(75, 0, 130, 0.15))',
      borderRadius: '25px',
      zIndex: 0,
      pointerEvents: 'none',
    },
    cardTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '72px',
      fontWeight: 800,
      color: '#fff',
      marginBottom: '16px',
      textAlign: 'center',
      letterSpacing: '2px',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 1,
    },
    cardSubtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 300,
      color: '#fff',
      marginBottom: '40px',
      textAlign: 'center',
      opacity: 0.95,
      textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
      position: 'relative',
      zIndex: 1,
    },
    startButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 500,
      color: '#fff',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '16px 60px',
      borderRadius: '30px',
      textTransform: 'lowercase',
      letterSpacing: '2px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      zIndex: 1,
    },
    footer: {
      position: 'absolute',
      bottom: '20px',
      right: '30px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 300,
      color: '#fff',
      opacity: 0.7,
      zIndex: 3,
      textAlign: 'right',
    },
    keyframes: `
      @keyframes floatCard {
        0%, 100% { 
          transform: translateY(0px); 
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        50% { 
          transform: translateY(-8px); 
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(100, 149, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }
      }
    `,
  }

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      <img 
        src="/background/home.gif" 
        alt="Background" 
        style={styles.backgroundGif}
      />
      
      <span style={styles.welcome}>
        {username ? `${t('welcome').replace('!', '')}, ${username}!` : t('welcome')}
      </span>
      
      <button 
        style={styles.signInButton} 
        onClick={onSignIn}
        onMouseOver={(e) => {
          e.target.style.borderColor = '#fff'
          e.target.style.background = 'rgba(255,255,255,0.1)'
        }}
        onMouseOut={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
          e.target.style.background = 'transparent'
        }}
      >
        {t('signIn')}
      </button>
      
      {hasProgress ? (
        // Returning user view - CONTINUE / START OVER
        <div style={styles.content}>
          <h1 style={styles.title}>{t('aiJourneyTitle')}</h1>
          <p style={styles.subtitle}>{t('aiJourneySubtitle')}</p>
          
          <button 
            style={styles.continueButton}
            onClick={handleContinue}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.95)), linear-gradient(90deg, #5170FF, #8B5CF6, #FF6B9D)'
              e.target.style.boxShadow = '0 12px 40px rgba(81, 112, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), linear-gradient(90deg, #5170FF, #8B5CF6, #FF6B9D)'
              e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            {t('continueGame')}
          </button>
          
          <button 
            style={styles.startOverButton}
            onClick={handleStartOver}
            onMouseOver={(e) => e.target.style.opacity = '0.6'}
            onMouseOut={(e) => e.target.style.opacity = '0.9'}
          >
            {t('startOver')}
          </button>
        </div>
      ) : (
        // First-time user view - Card with START
        <div style={styles.cardWrapper}>
          <div style={styles.cardGradientOverlay}></div>
          <h1 style={styles.cardTitle}>{t('aiJourneyTitle')}</h1>
          <p style={styles.cardSubtitle}>{t('aiJourneySubtitle')}</p>
          <button 
            style={styles.startButton}
            onClick={handleStart}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.8)'
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.6)'
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            {t('start')}
          </button>
        </div>
      )}
      
      <div style={styles.footer}>
        <div>Ver 0.8.0 Beta</div>
        <div>© 2026 Zhihui ZHANG All Rights Reserved.</div>
      </div>
    </div>
  )
}

export default Homepage
