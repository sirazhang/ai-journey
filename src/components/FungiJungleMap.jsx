import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import useTypingSound from '../hooks/useTypingSound'

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
      { text: "System Error... Bzzzt...Ugh... my sensors are spinning... You looking for Ranger Moss? He went... <strong>that way</strong>... ➡️", speaker: 'NPC A' }
    ]
  },
  [POSITIONS.BOTTOM_RIGHT]: {
    npc: 'npc_b',
    image: '/jungle/npc_b.gif',
    name: 'NPC B',
    dialogues: [
      { text: "Welc-come... to... *static noise*...Ranger Moss... is <strong>up there</strong>... ⬆️ He tried to fix the solar array but... (Powers down)", speaker: 'NPC B' }
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
  const { t } = useLanguage()
  const { startTypingSound, stopTypingSound } = useTypingSound('/sound/typing_jungle.wav')
  const [currentPosition, setCurrentPosition] = useState(POSITIONS.BOTTOM_LEFT)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showDialogue, setShowDialogue] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dialogueComplete, setDialogueComplete] = useState({})
  const [showModernDialogue, setShowModernDialogue] = useState(false) // For Ranger Moss modern dialogue
  const [rangerMossMessages, setRangerMossMessages] = useState([]) // Store Ranger Moss dialogue history
  const [currentRangerMossStep, setCurrentRangerMossStep] = useState(0) // Track Ranger Moss dialogue step
  const [waitingForRangerChoice, setWaitingForRangerChoice] = useState(false) // Waiting for user choice
  const [rangerMossDisplayedText, setRangerMossDisplayedText] = useState('') // For typing effect
  const [rangerMossIsTyping, setRangerMossIsTyping] = useState(false) // Typing state
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null) // Track which message is typing

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const fungiProgress = userData.fungiJungleProgress
      if (fungiProgress) {
        setCurrentPosition(fungiProgress.currentPosition || POSITIONS.BOTTOM_LEFT)
        setDialogueComplete(fungiProgress.dialogueComplete || {})
        // Load Ranger Moss mission progress (1-5)
        const rangerMossPhase = userData.rangerMossPhase || 1
        console.log('Loaded Fungi Jungle progress:', fungiProgress, 'Ranger Moss Phase:', rangerMossPhase)
      }
    }
    
    // Cleanup typing sound on unmount
    return () => {
      stopTypingSound()
    }
  }, [])

  // Save progress when position or dialogue completion changes
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.fungiJungleProgress = {
        currentPosition,
        dialogueComplete,
        lastSaved: Date.now()
      }
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Saved Fungi Jungle progress:', userData.fungiJungleProgress)
    }
  }, [currentPosition, dialogueComplete])

  const currentNpcData = npcDialogues[currentPosition]
  const currentDialogue = currentNpcData?.dialogues?.[currentDialogueIndex]

  // Reset dialogue when position changes and auto-show
  useEffect(() => {
    if (!dialogueComplete[currentPosition] && currentNpcData?.dialogues?.length > 0) {
      setCurrentDialogueIndex(0)
      // For Ranger Moss, show modern dialogue
      if (currentPosition === POSITIONS.TOP_RIGHT) {
        setShowModernDialogue(true)
        setShowDialogue(false)
        // Initialize first message
        if (rangerMossMessages.length === 0) {
          startRangerMossDialogue()
        }
      } else {
        setShowDialogue(true) // Auto-show dialogue for NPC A and B
        setShowModernDialogue(false)
      }
    }
  }, [currentPosition])
  
  // Ranger Moss dialogue flow
  const rangerMossDialogueFlow = [
    { type: 'message', text: "Hey! Down here! No, wait—up here! Hello? Can you hear me? I am <strong>Ranger Moss</strong>. As you can see, I am currently... slightly indisposed." },
    { type: 'message', text: "My battery died while I was climbing, and now my magnetic grip won't let go of this tree!" },
    { type: 'choice', text: "Why is everyone down?" },
    { type: 'message', text: "It's a disaster. Recently, strange mutated mushrooms just popped up everywhere. My workers couldn't tell the difference. They ate the toxic mushrooms thinking they were batteries... and now their systems have crashed!" },
    { type: 'choice', text: "How can I help you?" },
    { type: 'message', text: "We need to build an <strong>AI algorithm</strong> to automatically identify the toxic mushrooms. But since I can't move... could you help me? Please go into the jungle and collect <strong>data samples</strong> of the mushrooms." },
    { type: 'message', text: "We need at least <strong>12 samples</strong> to train the model. Good luck, human!" },
    { type: 'action', text: "START MISSION" }
  ]
  
  // Start Ranger Moss dialogue
  const startRangerMossDialogue = () => {
    setRangerMossMessages([])
    setCurrentRangerMossStep(0)
    addRangerMossMessage(0)
  }
  
  // Add Ranger Moss message with typing effect
  const addRangerMossMessage = (stepIndex) => {
    if (stepIndex >= rangerMossDialogueFlow.length) return
    
    const step = rangerMossDialogueFlow[stepIndex]
    
    if (step.type === 'message') {
      const newMessage = { type: 'message', text: step.text }
      setRangerMossMessages(prev => [...prev, newMessage])
      setCurrentTypingMessage(newMessage)
      
      // Start typing effect
      let charIndex = 0
      setRangerMossDisplayedText('')
      setRangerMossIsTyping(true)
      startTypingSound() // Start typing sound
      
      const typingInterval = setInterval(() => {
        if (charIndex < step.text.length) {
          setRangerMossDisplayedText(step.text.substring(0, charIndex + 1))
          charIndex++
        } else {
          setRangerMossIsTyping(false)
          setCurrentTypingMessage(null)
          stopTypingSound() // Stop typing sound
          clearInterval(typingInterval)
          
          // Check if next step is a choice
          if (stepIndex + 1 < rangerMossDialogueFlow.length && 
              rangerMossDialogueFlow[stepIndex + 1].type === 'choice') {
            setWaitingForRangerChoice(true)
            setCurrentRangerMossStep(stepIndex + 1)
          } else if (stepIndex + 1 < rangerMossDialogueFlow.length) {
            // Auto-continue to next message
            setTimeout(() => {
              setCurrentRangerMossStep(stepIndex + 1)
              addRangerMossMessage(stepIndex + 1)
            }, 500)
          } else {
            // End of dialogue
            setCurrentRangerMossStep(stepIndex + 1)
          }
        }
      }, 25)
    }
  }
  
  // Handle Ranger Moss choice
  const handleRangerMossChoice = (choiceText) => {
    // Add user message
    setRangerMossMessages(prev => [...prev, { type: 'user', text: choiceText }])
    setWaitingForRangerChoice(false)
    
    // Move to next step
    const nextStep = currentRangerMossStep + 1
    setCurrentRangerMossStep(nextStep)
    
    // Add next message after delay
    setTimeout(() => {
      addRangerMossMessage(nextStep)
    }, 500)
  }
  
  // Handle start mission
  const handleStartMission = () => {
    stopTypingSound()
    setDialogueComplete(prev => ({ ...prev, [POSITIONS.TOP_RIGHT]: true }))
    setShowModernDialogue(false)
    
    // Save phase 1 as started
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.rangerMossPhase = 1 // Phase 1: Collecting Data
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
    
    // Start data collection
    setTimeout(() => {
      if (onStartDataCollection) {
        onStartDataCollection()
      }
    }, 500)
  }
  
  // Format text with bold keywords
  const formatTextWithBold = (text) => {
    if (!text) return text
    // Replace <strong> tags with styled spans
    const parts = text.split(/(<strong>.*?<\/strong>)/g)
    return parts.map((part, index) => {
      if (part.startsWith('<strong>')) {
        const content = part.replace(/<\/?strong>/g, '')
        return <span key={index} style={{ fontWeight: 700, color: '#8B4513' }}>{content}</span>
      }
      return part
    })
  }
  
  // Get current timestamp
  const getCurrentTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

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
  
  // Format text to make keywords bold and red
  const formatDialogueText = (text) => {
    if (!text) return text
    // Replace <strong> tags with styled spans for keywords
    return text.replace(/<strong>(.*?)<\/strong>/g, '<span style="font-weight: 700; color: #FF0000; font-size: 24px;">$1</span>')
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

  // Render modern dialogue for Ranger Moss
  const renderModernDialogue = () => {
    if (!showModernDialogue) return null
    
    // Get current phase from localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    const userData = savedUser ? JSON.parse(savedUser) : {}
    const currentPhase = userData.rangerMossPhase || 1
    
    const totalSteps = 5
    const progressPercent = (currentPhase / totalSteps) * 100
    
    // Phase titles
    const phaseTitles = {
      1: 'PHASE 1: COLLECTING DATA',
      2: 'PHASE 2: DATA CLEANING',
      3: 'PHASE 3: CORRECT LABELS + FILL MISSING VALUES',
      4: 'PHASE 4: TEST THE MODEL',
      5: 'PHASE 5: REFINE THE MODEL'
    }
    
    return (
      <div style={styles.modernDialogueContainer}>
        {/* Header with Progress */}
        <div style={styles.modernDialogueHeader}>
          <div style={styles.modernProgressContainer}>
            <div style={styles.modernMissionTitle}>
              {phaseTitles[currentPhase]}
            </div>
            <div style={styles.modernStepIndicator}>
              Phase {currentPhase} of {totalSteps}
            </div>
          </div>
          <div style={styles.modernProgressBar}>
            <div style={{
              ...styles.modernProgressFill,
              width: `${progressPercent}%`,
            }} />
          </div>
          
          {/* NPC Info and Close Button Container */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            {/* NPC Info */}
            <div style={styles.modernNpcInfo}>
              <img 
                src="/jungle/npc_c.png" 
                alt="Ranger Moss" 
                style={styles.modernNpcAvatar}
              />
              <div>
                <div style={styles.modernNpcName}>Ranger Moss</div>
                <div style={styles.modernNpcStatus}>Jungle Ranger</div>
              </div>
            </div>
            
            {/* Close Button */}
            <button 
              style={styles.modernCloseButton}
              onClick={() => {
                stopTypingSound()
                setShowModernDialogue(false)
              }}
              onMouseOver={(e) => e.target.style.color = '#333'}
              onMouseOut={(e) => e.target.style.color = '#999'}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Messages Content */}
        <div style={styles.modernDialogueContent}>
          {rangerMossMessages.map((message, index) => {
            const timestamp = getCurrentTimestamp()
            
            if (message.type === 'message') {
              return (
                <div key={index} style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>RANGER MOSS:</div>
                  <p style={styles.modernNpcText}>
                    {currentTypingMessage && currentTypingMessage === message ? (
                      <>
                        {formatTextWithBold(rangerMossDisplayedText)}
                        {rangerMossIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
                      </>
                    ) : (
                      formatTextWithBold(message.text)
                    )}
                  </p>
                  <div style={styles.modernTimestamp}>{timestamp}</div>
                </div>
              )
            }
            
            if (message.type === 'user') {
              return (
                <div key={index} style={styles.modernUserMessage}>
                  <div style={styles.modernUserSpeaker}>YOU:</div>
                  <div style={styles.modernUserBubble}>
                    <p style={styles.modernUserText}>{message.text}</p>
                  </div>
                  <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                </div>
              )
            }
            
            return null
          })}
          
          {/* Choice Button */}
          {waitingForRangerChoice && currentRangerMossStep < rangerMossDialogueFlow.length && 
           rangerMossDialogueFlow[currentRangerMossStep].type === 'choice' && (
            <button 
              style={styles.modernActionButton}
              onClick={() => handleRangerMossChoice(rangerMossDialogueFlow[currentRangerMossStep].text)}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#8B4513'
                e.target.style.transform = 'translateX(5px)'
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#E0E0E0'
                e.target.style.transform = 'translateX(0)'
              }}
            >
              <span style={{fontSize: '16px', color: '#8B4513'}}>→</span>
              {rangerMossDialogueFlow[currentRangerMossStep].text}
            </button>
          )}
          
          {/* Start Mission Button */}
          {!waitingForRangerChoice && currentRangerMossStep < rangerMossDialogueFlow.length && 
           rangerMossDialogueFlow[currentRangerMossStep].type === 'action' && (
            <button 
              style={{
                ...styles.modernActionButton,
                background: '#8B4513',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
                padding: '15px 30px',
                border: 'none',
              }}
              onClick={handleStartMission}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              {rangerMossDialogueFlow[currentRangerMossStep].text}
            </button>
          )}
        </div>
      </div>
    )
  }

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
      width: '120px',
      height: '120px',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniNpcImage: {
      width: '120px',
      height: '120px',
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
    arrowImage: {
      width: '80px',
      height: '80px',
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
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
    // NPC B specific container - left side 1/4, 1/2 height
    npcContainerNpcB: {
      position: 'absolute',
      bottom: '0',
      left: '25%',  // 1/4 from left
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
    // Ranger Moss specific container - 2/3 height, bottom 10%, right 15%
    npcContainerRangerMoss: {
      position: 'absolute',
      bottom: '10%',
      right: '15%',
      zIndex: 5,
      animation: 'fadeIn 0.5s ease-out',
    },
    // Ranger Moss specific image - 2/3 of page height
    npcImageRangerMoss: {
      height: '66.67vh',
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
    // NPC A specific dialogue container - right side, aligned with NPC top
    dialogueContainerNpcA: {
      position: 'absolute',
      top: '33.33%',  // Align with NPC top
      left: '80px',
      width: '45%',
      maxWidth: '500px',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    // NPC B specific dialogue container - right side, aligned with NPC top
    dialogueContainerNpcB: {
      position: 'absolute',
      top: '50%',  // Align with NPC top (1/2 height)
      right: '80px',
      width: '45%',
      maxWidth: '500px',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    // Ranger Moss specific dialogue container - left side, aligned with NPC top
    dialogueContainerRangerMoss: {
      position: 'absolute',
      top: '10%',  // Align with NPC top
      left: '80px',
      width: '45%',
      maxWidth: '500px',
      zIndex: 5,
      animation: 'fadeIn 0.3s ease-out',
    },
    dialogueBox: {
      padding: '25px 30px',
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', // Irregular organic shape
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid #8B4513',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.5)',
      position: 'relative',
      minHeight: '100px',
    },
    speakerName: {
      position: 'absolute',
      top: '-15px',
      right: '20px',
      fontFamily: "'Patrick Hand', cursive",
      fontSize: '20px',
      fontWeight: 700,
      color: '#8B4513',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '5px 15px',
      borderRadius: '15px',
      border: '2px solid #8B4513',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
    },
    dialogueText: {
      fontFamily: "'Patrick Hand', cursive",
      fontSize: '20px',
      fontWeight: 400,
      color: '#333',
      lineHeight: 1.6,
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
      marginTop: '10px',
    },
    continueButton: {
      display: 'none', // Hide continue button
    },
    optionButton: {
      fontFamily: "'Patrick Hand', cursive",
      fontSize: '18px',
      fontWeight: 600,
      color: '#8B4513',
      backgroundColor: 'rgba(255, 235, 205, 0.9)',
      border: '3px solid #8B4513',
      padding: '12px 25px',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '15px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
    },
    // Modern dialogue styles for Ranger Moss
    modernDialogueContainer: {
      position: 'absolute',
      top: '12.5%',
      left: '10%',
      width: '40%',
      height: '70%',
      zIndex: 100,
      background: 'rgba(245, 245, 245, 0.98)',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      border: '3px solid #8B4513',
    },
    modernDialogueHeader: {
      padding: '20px 25px 15px 25px',
      borderBottom: 'none',
    },
    modernProgressContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    modernMissionTitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: '#8B4513',
    },
    modernStepIndicator: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      color: '#999',
    },
    modernProgressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: 'rgba(200,200,200,0.3)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '20px',
    },
    modernProgressFill: {
      height: '100%',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
      background: '#8B4513',
    },
    modernNpcInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
      flex: 1,
    },
    modernNpcAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid white',
      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    },
    modernNpcName: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#333',
    },
    modernNpcStatus: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      color: '#999',
    },
    modernCloseButton: {
      position: 'relative',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#999',
      cursor: 'pointer',
      padding: '5px',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      flexShrink: 0,
    },
    modernDialogueContent: {
      flex: 1,
      padding: '0 25px 25px 25px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    modernNpcMessage: {
      alignSelf: 'flex-start',
      maxWidth: '100%',
    },
    modernNpcSpeaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 700,
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
    },
    modernNpcText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.6,
      margin: 0,
    },
    modernTimestamp: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '11px',
      color: '#999',
      marginTop: '4px',
    },
    modernUserMessage: {
      alignSelf: 'flex-end',
      maxWidth: '85%',
    },
    modernUserBubble: {
      background: '#8B4513',
      padding: '12px 18px',
      borderRadius: '18px',
      boxShadow: '0 2px 6px rgba(139, 69, 19, 0.3)',
    },
    modernUserText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#fff',
      lineHeight: 1.5,
      margin: 0,
    },
    modernUserSpeaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 700,
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '6px',
      textAlign: 'right',
    },
    modernActionButton: {
      alignSelf: 'stretch',
      background: 'white',
      border: '2px solid #E0E0E0',
      borderRadius: '25px',
      padding: '14px 20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#333',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      marginTop: '8px',
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
    
    // Get NPC display name
    const npcDisplayName = isNpcA ? 'NPC 01' : isNpcB ? 'NPC 02' : isRangerMoss ? 'Ranger Moss' : currentDialogue.speaker

    if (currentDialogue.isOption) {
      return (
        <div style={dialogContainerStyle}>
          <div style={styles.dialogueBox}>
            <div style={styles.speakerName}>{npcDisplayName}</div>
            <button
              style={styles.optionButton}
              onClick={handleOptionClick}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 235, 205, 1)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 235, 205, 0.9)'
                e.target.style.transform = 'scale(1)'
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
        <div 
          style={{
            ...styles.dialogueBox,
            cursor: isTyping ? 'pointer' : 'pointer',
          }}
          onClick={handleContinue}
        >
          <div style={styles.speakerName}>{npcDisplayName}</div>
          <p style={styles.dialogueText}>
            <span dangerouslySetInnerHTML={{ __html: formatDialogueText(displayedText) }} />
            {isTyping && <span style={{ opacity: 0.5, animation: 'blink 1s infinite' }}>|</span>}
          </p>
          {hasNextOption && !isTyping && (
            <button
              style={styles.optionButton}
              onClick={(e) => {
                e.stopPropagation()
                handleOptionClick()
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 235, 205, 1)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 235, 205, 0.9)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              {nextDialogue.optionText}
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
        {t('exit')}
      </button>

      {/* Mini Glitch NPC */}
      <div style={styles.miniNpc}>
        <img 
          src="/npc/npc_jungle.png"
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
          <img 
            src="/jungle/icon/up.png" 
            alt="Up" 
            style={styles.arrowImage}
          />
        </button>
      )}
      {availableDirections.down !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.downArrow }}
          onClick={() => handleNavigate('down')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/down.png" 
            alt="Down" 
            style={styles.arrowImage}
          />
        </button>
      )}
      {availableDirections.left !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.leftArrow }}
          onClick={() => handleNavigate('left')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/left.png" 
            alt="Left" 
            style={styles.arrowImage}
          />
        </button>
      )}
      {availableDirections.right !== undefined && (
        <button 
          style={{ ...styles.navArrow, ...styles.rightArrow }}
          onClick={() => handleNavigate('right')}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
        >
          <img 
            src="/jungle/icon/right.png" 
            alt="Right" 
            style={styles.arrowImage}
          />
        </button>
      )}

      {/* NPC Character */}
      {renderNpc()}

      {/* Dialogue Box */}
      {renderDialogue()}
      
      {/* Modern Dialogue for Ranger Moss */}
      {renderModernDialogue()}
    </div>
  )
}

export default FungiJungleMap
