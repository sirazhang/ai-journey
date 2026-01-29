import React, { useState, useEffect, useCallback } from 'react'

const dialogues = [
  {
    text: "System reconnecting... Connection established! Signal stable! ly, you're here! Oh, I forgot to introduce myself. Hello there, Human! I'm Glitch. I used to be the fastest Data Sprite in this city!",
    highlights: ['System reconnecting', 'Connection established', 'Signal stable', 'Glitch', 'Data Sprite']
  },
  {
    text: "But ever since the Great Blackout, the entire city has been paralyzed. Everyone is trapped. The big robots are frozen without power, and creatures like me... well, I can only fly for short bursts on my emergency battery reserves.",
    highlights: ['Great Blackout', 'paralyzed', 'trapped', 'frozen without power', 'emergency battery reserves']
  },
  {
    text: "Our world consumes massive amounts of energy, which comes from four outer regions. To save the city, we need to inspect those areas and restart the main 'Energy Core'.",
    highlights: ['massive amounts of energy', 'four outer regions', 'Energy Core']
  },
  {
    text: "Please, will you help us? If we don't act now, our world will fade into permanent darkness. Here are the four regions... I suggest we start by checking the Fungi Jungle.",
    highlights: ['help us', 'permanent darkness', 'four regions', 'Fungi Jungle']
  }
]

const GameInterface = ({ onComplete }) => {
  const [currentDialogue, setCurrentDialogue] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const [showNpc, setShowNpc] = useState(false)

  // Show NPC after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNpc(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Typing effect
  useEffect(() => {
    if (currentDialogue >= dialogues.length || !showNpc) return
    
    const fullText = dialogues[currentDialogue].text
    let charIndex = 0
    setDisplayedText('')
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [currentDialogue, showNpc])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  const handleContinue = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(dialogues[currentDialogue].text)
      setIsTyping(false)
    } else if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    // Skip all dialogues and go directly to map
    onComplete()
  }

  // Highlight keywords in text
  const renderHighlightedText = (text, highlights) => {
    let result = text
    highlights.forEach(highlight => {
      const regex = new RegExp(`(${highlight})`, 'gi')
      result = result.replace(regex, `<span style="color: #FFFFFF; font-weight: 600;">$1</span>`)
    })
    return <span dangerouslySetInnerHTML={{ __html: result }} />
  }

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden',
      background: '#1a1a2e',
    },
    backgroundGif: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
      opacity: 0.8,
    },
    npcContainer: {
      position: 'absolute',
      bottom: '50px',
      left: '50px',
      zIndex: 2,
      opacity: showNpc ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    npcImage: {
      width: '300px',
      height: 'auto',
      filter: 'drop-shadow(0 0 20px rgba(81, 112, 255, 0.5))',
    },
    dialogueContainer: {
      position: 'absolute',
      bottom: '80px',
      left: '380px',
      right: '80px',
      zIndex: 3,
      opacity: showNpc ? 1 : 0,
      transition: 'opacity 0.5s ease-in-out',
    },
    dialogueBox: {
      padding: '30px 40px',
      borderRadius: '25px',
      background: 'rgba(71, 23, 101, 0.7)', // Reduced opacity for better glassmorphism
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '2px solid rgba(205, 165, 247, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(71, 23, 101, 0.5)',
      position: 'relative',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 400,
      color: '#CDA5F7', // Light purple for regular text
      lineHeight: 2.0, // Increased line spacing
      marginBottom: '20px',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    },
    cursor: {
      display: 'inline-block',
      width: '2px',
      height: '20px',
      backgroundColor: '#fff',
      marginLeft: '2px',
      verticalAlign: 'middle',
      opacity: showCursor && isTyping ? 1 : 0,
    },
    buttonContainer: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'flex-end',
    },
    continueButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#fff',
      background: '#CDA5F7', // Light purple background
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(205, 165, 247, 0.8)',
      padding: '10px 30px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 0 15px rgba(205, 165, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    },
    skipButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      padding: '10px 30px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
    },
    progressIndicator: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  }

  return (
    <div style={styles.container}>
      <img 
        src="/background/story.gif" 
        alt="Background" 
        style={styles.backgroundGif}
      />
      
      {showNpc && (
        <div style={styles.npcContainer}>
          <img 
            src="/npc/npc.gif" 
            alt="Glitch NPC" 
            style={styles.npcImage}
          />
        </div>
      )}
      
      {showNpc && (
        <div style={styles.dialogueContainer}>
          <div style={styles.dialogueBox}>
            <span style={styles.progressIndicator}>
              {currentDialogue + 1} / {dialogues.length}
            </span>
            <p style={styles.dialogueText}>
              {renderHighlightedText(displayedText, dialogues[currentDialogue]?.highlights || [])}
              <span style={styles.cursor}></span>
            </p>
            <div style={styles.buttonContainer}>
              <button 
                style={styles.skipButton}
                onClick={handleSkip}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.4)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                Skip
              </button>
              <button 
                style={styles.continueButton}
                onClick={handleContinue}
                onMouseOver={(e) => {
                  e.target.style.background = '#B88FE8' // Darker purple on hover
                  e.target.style.boxShadow = '0 0 20px rgba(205, 165, 247, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#CDA5F7'
                  e.target.style.boxShadow = '0 0 15px rgba(205, 165, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                {currentDialogue < dialogues.length - 1 ? 'Continue' : 'Enter Map'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GameInterface
