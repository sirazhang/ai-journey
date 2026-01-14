import React, { useState, useEffect } from 'react'

const FungiJungleIntro = ({ onContinue, onExit }) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  
  const introText = `Welcome to the Fungi Jungle! The guardian here is a green robot named Ranger Moss. He usually keeps everything running smoothly. Let's look for him first!`

  // Typing effect
  useEffect(() => {
    let charIndex = 0
    setDisplayedText('')
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (charIndex < introText.length) {
        setDisplayedText(introText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [])

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '400%',
      height: '400%',
      backgroundImage: 'url(/background/map.gif)',
      backgroundSize: 'cover',
      backgroundPosition: 'bottom left',
      transform: 'translate(0%, -50%)',
      filter: 'grayscale(70%) brightness(0.7)',
      zIndex: 0,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1,
    },
    npcContainer: {
      position: 'absolute',
      bottom: '0px',
      left: '30px',
      zIndex: 3,
      animation: 'fadeIn 0.5s ease-out',
    },
    npcImage: {
      width: '500px',
      height: 'auto',
      filter: 'drop-shadow(0 0 20px rgba(81, 112, 255, 0.5))',
      transform: 'scale(1.2)',
      transformOrigin: 'bottom left',
    },
    dialogueContainer: {
      position: 'absolute',
      top: '50%',
      left: '55%',
      transform: 'translate(-30%, -50%)',
      width: '50%',
      zIndex: 3,
    },
    dialogueBox: {
      padding: '40px 50px',
      paddingBottom: '40px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.85)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      position: 'relative',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 400,
      color: '#333',
      lineHeight: 1.8,
    },
    speakerName: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      color: '#5170FF',
      marginBottom: '15px',
    },
    difficultyContainer: {
      marginTop: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    difficultyLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#666',
    },
    difficultyStars: {
      color: '#FFD700',
      fontSize: '18px',
    },
    difficultyText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#888',
      marginLeft: '5px',
    },
    buttonContainer: {
      marginTop: '30px',
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
    },
    exitButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#fff',
      backgroundColor: '#000',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(#000, #000), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      padding: '15px 60px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
    },
    continueButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#fff',
      backgroundColor: '#000',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(#000, #000), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      padding: '15px 60px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.overlay}></div>
      
      <div style={styles.npcContainer}>
        <img 
          src="/npc/npc_jungle.png" 
          alt="Glitch" 
          style={styles.npcImage}
        />
      </div>
      
      <div style={styles.dialogueContainer}>
        <div style={styles.dialogueBox}>
          <p style={styles.speakerName}>Glitch:</p>
          <p style={styles.dialogueText}>
            {displayedText}
            {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
          </p>
          
          <div style={styles.difficultyContainer}>
            <span style={styles.difficultyLabel}>Difficulty:</span>
            <span style={styles.difficultyStars}>⭐</span>
            <span style={styles.difficultyText}>(Easy / Introductory)</span>
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              style={styles.exitButton}
              onClick={onExit}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              EXIT
            </button>
            <button 
              style={styles.continueButton}
              onClick={onContinue}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FungiJungleIntro
