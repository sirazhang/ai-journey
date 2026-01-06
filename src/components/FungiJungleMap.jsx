import React, { useState, useEffect } from 'react'

// Map positions: bottom-left (0), bottom-right (1), top-left (2), top-right (3)
const POSITIONS = {
  BOTTOM_LEFT: 0,
  BOTTOM_RIGHT: 1,
  TOP_LEFT: 2,
  TOP_RIGHT: 3,
}

// NPC dialogues for each position
const npcDialogues = {
  [POSITIONS.BOTTOM_LEFT]: {
    npc: 'npc_a',
    image: '/jungle/npc_a.png',
    name: 'NPC A',
    dialogues: [
      { text: "System Error... Bzzzt...Ugh... my sensors are spinning... You looking for Ranger Moss? He went... that way...", speaker: 'NPC A' }
    ]
  },
  [POSITIONS.BOTTOM_RIGHT]: {
    npc: 'npc_b',
    image: '/jungle/npc_b.gif',
    name: 'NPC B',
    dialogues: [
      { text: "Welc-come... to... *static noise*...Ranger Moss... is up there...He tried to fix the solar array but... (Powers down)", speaker: 'NPC B' }
    ]
  },
  [POSITIONS.TOP_LEFT]: {
    npc: null,
    dialogues: []
  },
  [POSITIONS.TOP_RIGHT]: {
    npc: 'ranger_moss',
    image: '/jungle/npc_c.png',
    name: 'Ranger Moss',
    dialogues: [
      { text: "Hey! Down here! No, wait—up here! Hello? Can you hear me? I am Ranger Moss. As you can see, I am currently... slightly indisposed.", speaker: 'Ranger Moss' },
      { text: "My battery died while I was climbing, and now my magnetic grip won't let go of this tree!", speaker: 'Ranger Moss' },
      { text: "", speaker: '', isOption: true, optionText: "Why is everyone down?" },
      { text: "It's a disaster. Recently, strange mutated mushrooms just popped up everywhere. My workers couldn't tell the difference. They ate the toxic mushrooms thinking they were batteries... and now their systems have crashed!", speaker: 'Ranger Moss' },
      { text: "", speaker: '', isOption: true, optionText: "How can I help you?" },
      { text: "We need to build an AI algorithm to automatically identify the toxic mushrooms. But since I can't move... could you help me? Please go into the jungle and collect data samples of the mushrooms.", speaker: 'Ranger Moss' },
      { text: "We need at least 12 samples to train the model. Good luck, human!", speaker: 'Ranger Moss' },
    ]
  }
}

// Navigation directions available from each position
const navigationMap = {
  [POSITIONS.BOTTOM_LEFT]: { up: POSITIONS.TOP_LEFT, right: POSITIONS.BOTTOM_RIGHT },
  [POSITIONS.BOTTOM_RIGHT]: { up: POSITIONS.TOP_RIGHT, left: POSITIONS.BOTTOM_LEFT },
  [POSITIONS.TOP_LEFT]: { down: POSITIONS.BOTTOM_LEFT, right: POSITIONS.TOP_RIGHT },
  [POSITIONS.TOP_RIGHT]: { down: POSITIONS.BOTTOM_RIGHT, left: POSITIONS.TOP_LEFT },
}

// CSS transform values for each position
const positionTransforms = {
  [POSITIONS.BOTTOM_LEFT]: 'translate(0%, -50%)',
  [POSITIONS.BOTTOM_RIGHT]: 'translate(-50%, -50%)',
  [POSITIONS.TOP_LEFT]: 'translate(0%, 0%)',
  [POSITIONS.TOP_RIGHT]: 'translate(-50%, 0%)',
}

const FungiJungleMap = ({ onExit, onStartDataCollection }) => {
  const [currentPosition, setCurrentPosition] = useState(POSITIONS.BOTTOM_LEFT)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showDialogue, setShowDialogue] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dialogueComplete, setDialogueComplete] = useState({})

  const currentNpcData = npcDialogues[currentPosition]
  const currentDialogue = currentNpcData?.dialogues?.[currentDialogueIndex]

  // Reset dialogue when position changes
  useEffect(() => {
    if (!dialogueComplete[currentPosition] && currentNpcData?.dialogues?.length > 0) {
      setCurrentDialogueIndex(0)
      setShowDialogue(true)
    }
  }, [currentPosition])

  // Typing effect
  useEffect(() => {
    if (!currentDialogue || currentDialogue.isOption) return
    
    const fullText = currentDialogue.text
    if (!fullText) return
    
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
    }, 25)

    return () => clearInterval(typingInterval)
  }, [currentDialogueIndex, currentPosition])

  const handleNavigate = (direction) => {
    const nextPosition = navigationMap[currentPosition]?.[direction]
    if (nextPosition !== undefined && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentPosition(nextPosition)
        setIsTransitioning(false)
      }, 500)
    }
  }

  const handleContinue = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text)
      setIsTyping(false)
      return
    }

    const dialogues = currentNpcData?.dialogues || []
    if (currentDialogueIndex < dialogues.length - 1) {
      setCurrentDialogueIndex(prev => prev + 1)
    } else {
      setDialogueComplete(prev => ({ ...prev, [currentPosition]: true }))
      setShowDialogue(false)
      
      // Check if this is the final dialogue from Ranger Moss
      if (currentPosition === POSITIONS.TOP_RIGHT && currentDialogueIndex === dialogues.length - 1) {
        // Ready for data collection
        setTimeout(() => {
          if (onStartDataCollection) {
            onStartDataCollection()
          }
        }, 1000)
      }
    }
  }

  const handleOptionClick = () => {
    // Skip to the dialogue after the option (skip 2 indices: current + option)
    const dialogues = currentNpcData?.dialogues || []
    const nextDialogue = dialogues[currentDialogueIndex + 1]
    if (nextDialogue?.isOption) {
      // Option was shown inline, skip past it
      setCurrentDialogueIndex(prev => prev + 2)
    } else {
      // Regular option click (option shown separately)
      setCurrentDialogueIndex(prev => prev + 1)
    }
  }

  const availableDirections = navigationMap[currentPosition] || {}

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    mapContainer: {
      width: '200%',
      height: '200%',
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'transform 0.5s ease-in-out',
      transform: positionTransforms[currentPosition],
    },
    mapImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.1)',
      zIndex: 1,
    },
    exitButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#333',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid rgba(81, 112, 255, 0.5)',
      padding: '10px 25px',
      borderRadius: '8px',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'all 0.2s',
    },
    miniNpc: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(30,30,40,1), rgba(30,30,40,1)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniNpcImage: {
      width: '60px',
      height: '60px',
      objectFit: 'contain',
    },
    navArrow: {
      position: 'absolute',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'transform 0.2s',
      background: 'none',
      border: 'none',
    },
    arrowIcon: {
      fontSize: '40px',
      color: '#fff',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
      fontWeight: 'bold',
    },
    upArrow: {
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    downArrow: {
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    leftArrow: {
      left: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    rightArrow: {
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
    },
    npcContainer: {
      position: 'absolute',
      bottom: '50px',
      zIndex: 5,
      animation: 'fadeIn 0.5s ease-out',
    },
    npcContainerLeft: {
      left: '50px',
    },
    npcContainerRight: {
      right: '50px',
    },
    // NPC A specific container - right side, 2/3 height
    npcContainerNpcA: {
      position: 'absolute',
      bottom: '0',
      right: '50px',
      height: '66.67vh',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 5,
      animation: 'fadeIn 0.5s ease-out',
    },
    npcImage: {
      width: '250px',
      height: 'auto',
      filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.3))',
    },
    // NPC A specific image - 2/3 of page height
    npcImageNpcA: {
      height: '66.67vh',
      width: 'auto',
      filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.3))',
    },
    // NPC B specific container - left side, 1/2 height
    npcContainerNpcB: {
      position: 'absolute',
      bottom: '0',
      left: '50px',
      height: '50vh',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 5,
      animation: 'fadeIn 0.5s ease-out',
    },
    // NPC B specific image - 1/2 of page height
    npcImageNpcB: {
      height: '50vh',
      width: 'auto',
      filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.3))',
    },
    // Ranger Moss specific container - bottom 1/5, right 1/4, 1/3 height
    npcContainerRangerMoss: {
      position: 'absolute',
      bottom: '20%',
      right: '25%',
      zIndex: 5,
      animation: 'fadeIn 0.5s ease-out',
    },
    // Ranger Moss specific image - 1/3 of page height
    npcImageRangerMoss: {
      height: '33.33vh',
      width: 'auto',
      filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.3))',
    },
    dialogueContainer: {
      position: 'absolute',
      top: '80px',
      left: '80px',
      right: '150px',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    // NPC A specific dialogue container - left side, 1/2 width
    dialogueContainerNpcA: {
      position: 'absolute',
      top: '80px',
      left: '80px',
      width: '50%',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    // NPC B specific dialogue container - right side, 1/2 width
    dialogueContainerNpcB: {
      position: 'absolute',
      top: '80px',
      right: '80px',
      width: '50%',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    // Ranger Moss specific dialogue container - left side, 1/2 width
    dialogueContainerRangerMoss: {
      position: 'absolute',
      top: '80px',
      left: '80px',
      width: '50%',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    dialogueBox: {
      padding: '30px 40px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      position: 'relative',
      minHeight: '120px',
    },
    speakerName: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#5170FF',
      marginBottom: '10px',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      color: '#333',
      lineHeight: 1.7,
    },
    continueButton: {
      position: 'absolute',
      bottom: '15px',
      right: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    optionButton: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      fontWeight: 500,
      color: '#5170FF',
      backgroundColor: 'rgba(81, 112, 255, 0.1)',
      border: '2px solid #5170FF',
      padding: '12px 25px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '15px',
    },
  }

  const renderDialogue = () => {
    if (!showDialogue || !currentNpcData?.npc || dialogueComplete[currentPosition]) return null
    if (!currentDialogue) return null

    // Check if current NPC is NPC A, NPC B, or Ranger Moss
    const isNpcA = currentPosition === POSITIONS.BOTTOM_LEFT
    const isNpcB = currentPosition === POSITIONS.BOTTOM_RIGHT
    const isRangerMoss = currentPosition === POSITIONS.TOP_RIGHT
    const dialogContainerStyle = isNpcA ? styles.dialogueContainerNpcA : 
                                  isNpcB ? styles.dialogueContainerNpcB :
                                  isRangerMoss ? styles.dialogueContainerRangerMoss :
                                  styles.dialogueContainer

    // Check if the NEXT dialogue is an option (for inline option buttons)
    const dialogues = currentNpcData?.dialogues || []
    const nextDialogue = dialogues[currentDialogueIndex + 1]
    const hasNextOption = nextDialogue?.isOption

    if (currentDialogue.isOption) {
      return (
        <div style={dialogContainerStyle}>
          <div style={styles.dialogueBox}>
            <button
              style={styles.optionButton}
              onClick={handleOptionClick}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(81, 112, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(81, 112, 255, 0.1)'
              }}
            >
              {currentDialogue.optionText}
            </button>
          </div>
        </div>
      )
    }

    return (
      <div style={dialogContainerStyle}>
        <div style={styles.dialogueBox}>
          {!isNpcA && !isNpcB && <p style={styles.speakerName}>{currentDialogue.speaker}:</p>}
          <p style={styles.dialogueText}>
            {displayedText}
            {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
          </p>
          {hasNextOption && !isTyping ? (
            <button
              style={styles.optionButton}
              onClick={handleOptionClick}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(81, 112, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(81, 112, 255, 0.1)'
              }}
            >
              {nextDialogue.optionText}
            </button>
          ) : (
            <button
              style={styles.continueButton}
              onClick={handleContinue}
            >
              {isTyping ? 'Skip' : 'CONTINUE'}
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderNpc = () => {
    if (!currentNpcData?.npc) return null

    const isNpcA = currentPosition === POSITIONS.BOTTOM_LEFT
    const isNpcB = currentPosition === POSITIONS.BOTTOM_RIGHT
    const isRangerMoss = currentPosition === POSITIONS.TOP_RIGHT
    
    // NPC A: large on right side, 2/3 height
    if (isNpcA) {
      return (
        <div style={styles.npcContainerNpcA}>
          <img 
            src={currentNpcData.image}
            alt={currentNpcData.name}
            style={styles.npcImageNpcA}
          />
        </div>
      )
    }
    
    // NPC B: large on left side, 1/2 height
    if (isNpcB) {
      return (
        <div style={styles.npcContainerNpcB}>
          <img 
            src={currentNpcData.image}
            alt={currentNpcData.name}
            style={styles.npcImageNpcB}
          />
        </div>
      )
    }
    
    // Ranger Moss: bottom 1/5, right 1/4, 1/3 height
    if (isRangerMoss) {
      return (
        <div style={styles.npcContainerRangerMoss}>
          <img 
            src={currentNpcData.image}
            alt={currentNpcData.name}
            style={styles.npcImageRangerMoss}
          />
        </div>
      )
    }
    
    return (
      <div style={{
        ...styles.npcContainer,
        ...(isRightSide ? styles.npcContainerRight : styles.npcContainerLeft)
      }}>
        <img 
          src={currentNpcData.image}
          alt={currentNpcData.name}
          style={styles.npcImage}
        />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.mapContainer}>
        <img 
          src="/jungle/map_full.png"
          alt="Fungi Jungle Map"
          style={styles.mapImage}
        />
      </div>
      <div style={styles.overlay}></div>

      {/* Exit Button */}
      <button 
        style={styles.exitButton}
        onClick={onExit}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)'
          e.target.style.borderColor = '#5170FF'
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'
          e.target.style.borderColor = 'rgba(81, 112, 255, 0.5)'
        }}
      >
        Exit
      </button>

      {/* Mini Glitch NPC */}
      <div style={styles.miniNpc}>
        <img 
          src="/npc/npc1.png"
          alt="Glitch"
          style={styles.miniNpcImage}
        />
      </div>

      {/* Navigation Arrows */}
      {availableDirections.up !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.upArrow }}
          onClick={() => handleNavigate('up')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>︿</span>
        </button>
      )}
      {availableDirections.down !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.downArrow }}
          onClick={() => handleNavigate('down')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>﹀</span>
        </button>
      )}
      {availableDirections.left !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.leftArrow }}
          onClick={() => handleNavigate('left')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>〈</span>
        </button>
      )}
      {availableDirections.right !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.rightArrow }}
          onClick={() => handleNavigate('right')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <span style={styles.arrowIcon}>〉</span>
        </button>
      )}

      {/* NPC Character */}
      {renderNpc()}

      {/* Dialogue Box */}
      {renderDialogue()}
    </div>
  )
}

export default FungiJungleMap
