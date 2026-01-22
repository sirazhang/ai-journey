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
      cursor: 'pointer',
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
    // CONTINUE button for returning users
    continueButton: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '32px',
      fontWeight: 700,
      color: '#fff',
      backgroundColor: '#000',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(#000, #000), linear-gradient(90deg, #5170FF, #FF6B9D)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      padding: '25px 120px',
      borderRadius: '15px',
      cursor: 'pointer',
      letterSpacing: '3px',
      transition: 'all 0.3s ease',
      marginBottom: '25px',
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
      cursor: 'pointer',
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
      borderRadius: '20px',
      background: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(10px)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      animation: 'breathe 3s ease-in-out infinite',
    },
    cardTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '72px',
      fontWeight: 800,
      color: '#fff',
      marginBottom: '16px',
      textAlign: 'center',
      letterSpacing: '2px',
    },
    cardSubtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 300,
      color: '#fff',
      marginBottom: '40px',
      textAlign: 'center',
      opacity: 0.9,
    },
    startButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 500,
      color: '#fff',
      backgroundColor: '#000',
      border: 'none',
      padding: '16px 60px',
      borderRadius: '30px',
      cursor: 'pointer',
      textTransform: 'lowercase',
      letterSpacing: '2px',
      transition: 'all 0.3s ease',
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
      @keyframes breathe {
        0%, 100% { transform: scale(1); box-shadow: 0 0 30px rgba(81, 112, 255, 0.3); }
        50% { transform: scale(1.02); box-shadow: 0 0 50px rgba(81, 112, 255, 0.5); }
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
        {username ? `Welcome, ${username}!` : 'Welcome!'}
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
          <h1 style={styles.title}>AI JOURNEY</h1>
          <p style={styles.subtitle}>An Interactive Journey into AI Literacy</p>
          
          <button 
            style={styles.continueButton}
            onClick={handleContinue}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)'
              e.target.style.boxShadow = '0 10px 40px rgba(81, 112, 255, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
              e.target.style.boxShadow = 'none'
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
          <h1 style={styles.cardTitle}>AI Journey</h1>
          <p style={styles.cardSubtitle}>An interactive journey into AI literacy</p>
          <button 
            style={styles.startButton}
            onClick={handleStart}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#333'
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#000'
              e.target.style.transform = 'scale(1)'
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
