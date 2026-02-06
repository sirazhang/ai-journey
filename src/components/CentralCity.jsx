import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import useBackgroundMusic from '../hooks/useBackgroundMusic'
import useTypingSound from '../hooks/useTypingSound'
import MacBookInterface from './MacBookInterface'

const CentralCity = ({ onExit }) => {
  const { t } = useLanguage()
  const [showDialogue, setShowDialogue] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showMacBook, setShowMacBook] = useState(false)
  const { startTypingSound, stopTypingSound } = useTypingSound('/sound/island_typing.wav')

  // Background music
  useBackgroundMusic('/sound/spaceship.mp3')

  const dialogueText = "Hey learners! 👋\nWanna peek at what I actually do all day?\nGo ahead—tap 'Company' and take a look at my daily workflow!"

  // Auto-show dialogue on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDialogue(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Typing effect
  useEffect(() => {
    if (!showDialogue) return

    let charIndex = 0
    setDisplayedText('')
    setIsTyping(true)
    startTypingSound()

    const typingInterval = setInterval(() => {
      if (charIndex < dialogueText.length) {
        setDisplayedText(dialogueText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        stopTypingSound()
        clearInterval(typingInterval)
      }
    }, 30)

    return () => {
      clearInterval(typingInterval)
      stopTypingSound()
    }
  }, [showDialogue, startTypingSound, stopTypingSound])

  // Get current time
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

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
    dialogueBox: {
      position: 'absolute',
      top: '200px',
      left: '420px', // Right side of NPC (150px + 250px + 20px margin)
      width: '400px',
      padding: '20px 24px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      border: '1.5px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      zIndex: 15,
      animation: 'fadeIn 0.3s ease-out',
    },
    dialogueHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
    },
    dialogueSpeaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      fontWeight: 700,
      color: '#2c3e50',
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
      letterSpacing: '0.5px',
    },
    signalContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    signalIcon: {
      width: '16px',
      height: '16px',
      objectFit: 'contain',
    },
    signalText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      color: '#2c3e50',
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#2c3e50',
      lineHeight: 1.6,
      margin: 0,
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
      whiteSpace: 'pre-line',
    },
    dialogueFooter: {
      marginTop: '12px',
      display: 'flex',
      justifyContent: 'flex-start',
    },
    timestamp: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '11px',
      color: 'rgba(44, 62, 80, 0.7)',
      textShadow: '0 1px 2px rgba(255, 255, 255, 0.6)',
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
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
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
    setShowMacBook(true)
  }

  const handleCloseMacBook = () => {
    setShowMacBook(false)
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

      {/* Glitch Dialogue Box */}
      {showDialogue && (
        <div style={styles.dialogueBox}>
          {/* Header with speaker name and signal */}
          <div style={styles.dialogueHeader}>
            <div style={styles.dialogueSpeaker}>Glitch</div>
            <div style={styles.signalContainer}>
              <img 
                src="/city/icon/signal.png"
                alt="Signal"
                style={styles.signalIcon}
              />
              <span style={styles.signalText}>100%</span>
            </div>
          </div>

          {/* Dialogue text with typing effect */}
          <p style={styles.dialogueText}>
            {displayedText}
            {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
          </p>

          {/* Footer with timestamp */}
          <div style={styles.dialogueFooter}>
            <span style={styles.timestamp}>{getCurrentTime()}</span>
          </div>
        </div>
      )}

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

      {/* MacBook Interface Overlay */}
      {showMacBook && <MacBookInterface onClose={handleCloseMacBook} />}
    </div>
  )
}

export default CentralCity
