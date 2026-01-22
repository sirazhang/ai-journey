import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'
import { useLanguage } from '../contexts/LanguageContext'

// Add CSS animations
const missionStyles = `
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translate(-50%, -50%) translateY(0);
    }
    40% {
      transform: translate(-50%, -50%) translateY(-30px);
    }
    60% {
      transform: translate(-50%, -50%) translateY(-15px);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes stampAppear {
    0% {
      opacity: 0;
      transform: scale(0) rotate(-10deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.2) rotate(-5deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(-10deg);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.type = 'text/css'
  styleSheet.innerText = missionStyles
  document.head.appendChild(styleSheet)
}

// Desert segments (3 segments that loop)
const SEGMENTS = {
  SEGMENT_1: 0,
  SEGMENT_2: 1,
  SEGMENT_3: 2,
}

// NPC dialogues for different encounters
const npcDialogues = {
  glitch: {
    text: "Warning! This desert is dangerous. We need to find that yellow robot, 'Alpha,' immediately! He should be in the castle ahead.",
    speaker: 'Glitch'
  },
  npc1: {
    text: "Run! Just run! The castle's defense system has gone mad! It's attacking everyone! Unless you are looking for 'Alpha'... He's still deep inside ➡️, trying to shut down the system!",
    speaker: 'NPC 1'
  },
  npc2: {
    text: "Don't go there! The castle ⬅️ thinks we are monsters! Run away!",
    speaker: 'NPC 2'
  },
  gatekeeper: {
    text: "You... you must be looking for Alpha. He's inside the main hall. But the castle is terrifying right now. You can try zooming in to check the situation, but I'm not risking my life going in there.",
    speaker: 'Gatekeeper'
  },
  // Post-Mission 3 NPCs (Color mode)
  npc5: {
    text: "Enjoy the colors, human. I will keep watch—quietly this time.",
    speaker: 'NPC 5'
  },
  npc6: {
    text: "Alert... just kidding. No alerts today.",
    speaker: 'NPC 6'
  },
  npc7: {
    text: "Happiness, Safety, and... Acupuncture?",
    speaker: 'NPC 7'
  },
  alphaFinal: {
    text: "System Status: Normal. Defense protocols deactivated. The castle is safe. Thank you, Engineer. I am now processing data with context.",
    speaker: 'Alpha'
  }
}

// Alpha's complete dialogue flow
const alphaDialogueFlow = [
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Zzz... zzz... Hello, humans. Apologies for the blackout. As you can see, the staff have all fled. There is no one left to run the power generators."
  },
  {
    type: 'choice',
    text: "Why did everyone run away?"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "It's a long story. It started with the Sandstorm Festival... The sandstorm has obscured the sensors. The AI's vision is blurry and full of noise."
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Critically, the system cannot distinguish between 'employees covered in sand' and 'Giant Sandworms'. It thinks my colleagues are monsters, so it attacked them!"
  },
  {
    type: 'choice',
    text: "How can we fix this?"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "We need to retrain the algorithm immediately. The current system has never seen workers in a sandstorm before. Please help me collect photos of workers covered in sand. The more, the better!"
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "We need to teach the AI that these 'fuzzy shapes' are actually friends, not sandworms."
  }
]

// Alpha's second phase dialogue (after collecting all photos)
const alphaPhase2DialogueFlow = [
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Data received! Wow... these photos are completely different from my database."
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "(Shows comparison: Clear vs. Blurry)",
    image: '/desert/sample.png'
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Look. The 'workers' I learned about before were clear, like the left image. But in the photos you took, there is flying sand everywhere."
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "In the AI world, we call this interference—sand, rain, or blurry pixels—'Noise'. Just like looking through dirty glasses, Noise reduces Data Quality."
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Before we start retraining, why did AI mistake the employee holding a broom for a 'Sandworm'?"
  },
  {
    type: 'quiz',
    question: "Why did AI mistake the employee for a Sandworm?",
    options: [
      { text: "Because I am stupid and my chip is broken.", correct: false },
      { text: "Because 'Noise' (sand) lowered the data quality and hid the features.", correct: true },
      { text: "Because that employee actually looks like a worm.", correct: false }
    ]
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Exactly! High-quality Data is crucial for AI. Since we have to use these 'noisy' photos now..."
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "I need you to help me distinguish: which ones are real humans and which ones are just noise. Let's start labeling!"
  },
  {
    type: 'action',
    text: "GO",
    action: 'startLabeling'
  }
]

const DesertMap = ({ onExit }) => {
  const { t } = useLanguage()
  const [currentSegment, setCurrentSegment] = useState(SEGMENTS.SEGMENT_1)
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [currentView, setCurrentView] = useState('desert') // 'desert', 'gate', 'castle'
  const [showAlphaDialogue, setShowAlphaDialogue] = useState(false)
  const [alphaDialogueMessages, setAlphaDialogueMessages] = useState([])
  const [currentAlphaStep, setCurrentAlphaStep] = useState(0)
  const [waitingForChoice, setWaitingForChoice] = useState(false)
  
  // Mission 1 states
  const [missionStarted, setMissionStarted] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  const [currentPhotoObject, setCurrentPhotoObject] = useState(null)
  const [capturedObjects, setCapturedObjects] = useState([])
  const [objectDescriptions, setObjectDescriptions] = useState({})
  
  // Phase 2 states
  const [isPhase2, setIsPhase2] = useState(false)
  const [currentPhase2Step, setCurrentPhase2Step] = useState(0)
  const [waitingForPhase2Choice, setWaitingForPhase2Choice] = useState(false)
  const [phase2Messages, setPhase2Messages] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  
  // Alpha dialogue typing states
  const [alphaDisplayedText, setAlphaDisplayedText] = useState('')
  const [alphaIsTyping, setAlphaIsTyping] = useState(false)
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null)
  
  // Mission 2 states
  const [showModelGif, setShowModelGif] = useState(false)
  const [showProgressBar, setShowProgressBar] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [showMission2, setShowMission2] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mission2Results, setMission2Results] = useState([])
  const [showGlitchWarning, setShowGlitchWarning] = useState(false)
  const [showFinalQuiz, setShowFinalQuiz] = useState(false)

  // Sound effects
  const { playClickSound, playCameraSound, playStampSound, playSafeSound, playAlertSound } = useSoundEffects()

  // Mission 3 states
  const [showMission3, setShowMission3] = useState(false)
  const [mission3Phase, setMission3Phase] = useState('intro') // 'intro', 'sample', 'puzzle1', 'puzzle2', 'puzzle3', 'quiz1', 'quiz2', 'complete'
  const [selectedTag, setSelectedTag] = useState(null)
  const [showAlphaIcon, setShowAlphaIcon] = useState(false)
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  
  // Post-Mission 3 states
  const [showMission3Loading, setShowMission3Loading] = useState(false)
  const [colorMode, setColorMode] = useState(false) // New color mode after Mission 3
  const [loadingText, setLoadingText] = useState('') // For typing effect
  const [loadingTyping, setLoadingTyping] = useState(false)

  // Mission 3 data
  const mission3Data = {
    sample: {
      image: '/desert/Mission/sample.png',
      aiLogic: 'AI Logic: "No movement detected → Worker is dead."',
      tags: [
        { id: 'game', text: 'Game Area', correct: true, update: 'Updated AI Logic: "User is simulating injury within a game. Status: PLAYING."' },
        { id: 'distance', text: 'Distance: Far away', correct: true, update: 'Updated AI Logic: "Visual resolution low. Status: INSUFFICIENT DATA."' },
        { id: 'time', text: 'Time observed: 1 second', correct: true, update: 'Updated AI Logic: "Observation window too short. Status: PAUSED."' }
      ]
    },
    puzzles: [
      {
        id: 'puzzle1',
        image: '/desert/Mission/puzzle01.png',
        aiLogic: 'AI Logic: "Object detected: Explosive Device. Action: ATTACKING. Threat Level: HIGH."',
        tags: [
          { id: 'location', text: 'Location: Fuel Depot', correct: false },
          { id: 'calendar', text: 'Calendar: Lunar New Year', correct: true, update: 'Update: The worker is celebrating, not attacking. Threat Level: CLEARED.' },
          { id: 'state', text: 'State: Fuse Ignited', correct: false }
        ]
      },
      {
        id: 'puzzle2',
        image: '/desert/Mission/puzzle02.png',
        aiLogic: 'AI Logic: "Object: Iron Sheet. Posture: Charging. Intent: Shield Bash / Riot. Status: THREAT."',
        tags: [
          { id: 'audio', text: 'Audio: High Decibel Screaming', correct: false },
          { id: 'database', text: 'Database Match: Police Riot Shield', correct: false },
          { id: 'weather', text: 'Weather: Sandstorm Warning', correct: true, update: 'Update: The iron sheet is a shield against the sand. Threat Level: CLEARED.' }
        ]
      },
      {
        id: 'puzzle3',
        image: '/desert/Mission/puzzle03.png',
        aiLogic: 'AI Logic: "Object: Spike. Posture: Attacking. Intent: Weapon Strike. Status: THREAT."',
        tags: [
          { id: 'audio', text: 'Audio: Low Groaning', correct: false },
          { id: 'sign', text: 'Sign: "Wellness Spa"', correct: true, update: 'Revised Logic: The spike is a medical tool. The cactus is a doctor. Status: ACUPUNCTURE THERAPY (HEALING).' },
          { id: 'weapon', text: 'Weapon: Poisoned Dart', correct: false }
        ]
      }
    ]
  }

  // Mission 2 data - correct answers: image 1 and 5 should be "confirmed", others "rejected"
  const mission2Images = [
    { id: 1, src: '/desert/Mission/01.png', correctAnswer: 'confirmed' },
    { id: 2, src: '/desert/Mission/02.png', correctAnswer: 'rejected' },
    { id: 3, src: '/desert/Mission/03.png', correctAnswer: 'rejected' },
    { id: 4, src: '/desert/Mission/04.png', correctAnswer: 'rejected' },
    { id: 5, src: '/desert/Mission/05.png', correctAnswer: 'confirmed' }
  ]
  const desertObjects = {
    [SEGMENTS.SEGMENT_1]: [
      { id: '01', size: 250, left: '40%', bottom: '10%' },
      { id: '02', size: 150, left: '10%', bottom: '15%' },
      { id: '06', size: 120, left: '20%', top: '40%' },
      { id: '07', size: 120, right: '10%', top: '30%' }
    ],
    [SEGMENTS.SEGMENT_2]: [
      { id: '05', size: 180, left: '0%', bottom: '10%' },
      { id: '11', size: 150, right: '0%', bottom: '10%' },
      { id: '09', size: 100, left: '25%', bottom: '15%' },
      { id: '10', size: 180, right: '25%', bottom: '20%' }
    ],
    [SEGMENTS.SEGMENT_3]: [
      { id: '03', size: 220, right: '10%', bottom: '10%' },
      { id: '04', size: 100, left: '40%', bottom: '25%' },
      { id: '08', size: 120, left: '15%', top: '40%' }
    ]
  }

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const desertProgress = userData.desertProgress
      if (desertProgress) {
        setCurrentSegment(desertProgress.currentSegment || SEGMENTS.SEGMENT_1)
        setCurrentView(desertProgress.currentView || 'desert')
        setMissionStarted(desertProgress.missionStarted || false)
        setCapturedObjects(desertProgress.capturedObjects || [])
        console.log('Loaded Desert progress:', desertProgress)
      }
    }
    
    // Load object descriptions
    fetch('/desert/object/description.json')
      .then(response => response.json())
      .then(data => setObjectDescriptions(data.objects))
      .catch(error => console.error('Failed to load object descriptions:', error))
  }, [])

  // Save progress when segment, view, or mission state changes
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.desertProgress = {
        currentSegment,
        currentView,
        missionStarted,
        capturedObjects,
        lastSaved: Date.now()
      }
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Saved Desert progress:', userData.desertProgress)
    }
  }, [currentSegment, currentView, missionStarted, capturedObjects])

  // Typing effect
  useEffect(() => {
    if (!currentDialogue || !showDialogue) return
    
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
    }, 30)

    return () => clearInterval(typingInterval)
  }, [currentDialogue, showDialogue])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Loading text typing effect
  useEffect(() => {
    if (!showMission3Loading) return
    
    const fullText = "SYSTEM REBOOT INITIATED"
    let charIndex = 0
    setLoadingText('')
    setLoadingTyping(true)

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setLoadingText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setLoadingTyping(false)
        clearInterval(typingInterval)
      }
    }, 100) // Slower typing for dramatic effect

    return () => clearInterval(typingInterval)
  }, [showMission3Loading])

  // Alpha dialogue typing effect
  useEffect(() => {
    if (!currentTypingMessage) return
    
    const fullText = currentTypingMessage.text
    if (!fullText) return
    
    let charIndex = 0
    setAlphaDisplayedText('')
    setAlphaIsTyping(true)

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setAlphaDisplayedText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setAlphaIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 30) // Same speed as regular dialogue

    return () => clearInterval(typingInterval)
  }, [currentTypingMessage])

  const handleNavigate = (direction) => {
    console.log('Navigate:', direction, 'Current segment:', currentSegment)
    if (direction === 'left') {
      setCurrentSegment(prev => {
        // Left: 0 -> 2, 1 -> 0, 2 -> 1
        const newSegment = prev === SEGMENTS.SEGMENT_1 ? SEGMENTS.SEGMENT_3 : prev - 1
        console.log('Left navigation: from', prev, 'to', newSegment)
        return newSegment
      })
    } else if (direction === 'right') {
      setCurrentSegment(prev => {
        // Right: 0 -> 1, 1 -> 2, 2 -> 0
        const newSegment = prev === SEGMENTS.SEGMENT_3 ? SEGMENTS.SEGMENT_1 : prev + 1
        console.log('Right navigation: from', prev, 'to', newSegment)
        return newSegment
      })
    }
  }

  const handleNpcClick = (npcType) => {
    setCurrentDialogue(npcDialogues[npcType])
    setShowDialogue(true)
  }

  const handleGlitchClick = () => {
    if (missionStarted) {
      // Show mission progress
      setCurrentDialogue({
        text: `Mission Progress: ${capturedObjects.length}/11 objects photographed. Keep exploring!`,
        speaker: 'Glitch'
      })
      setShowDialogue(true)
    } else {
      // Show original Glitch dialogue
      handleNpcClick('glitch')
    }
  }

  const handleDialogueClick = () => {
    if (currentDialogue && currentDialogue.isMission3) {
      if (isTyping) {
        setDisplayedText(currentDialogue.text)
        setIsTyping(false)
      } else if (currentDialogue.step === 'intro' || currentDialogue.step === 'briefing') {
        handleMission3Continue()
      } else if (currentDialogue.showMission3Interface) {
        // Mission 3 interface is shown, don't close dialogue on click
        return
      } else if (currentDialogue.showQuiz) {
        // Quiz is handled by separate buttons, don't close dialogue
        return
      } else if (currentDialogue.showDoneButton) {
        // Done button is handled separately, don't close dialogue
        return
      } else {
        // For other Mission 3 dialogues, just close
        setShowDialogue(false)
      }
    } else if (currentDialogue && currentDialogue.isMission2) {
      handleMission2DialogueClick()
    } else if (isTyping) {
      // Skip typing animation
      setDisplayedText(currentDialogue.text)
      setIsTyping(false)
    } else {
      if (currentDialogue.isSpecial && currentDialogue.nextAction) {
        // Handle special Mission 2 dialogues
        if (currentDialogue.nextAction === 'mission2Continue1' || currentDialogue.nextAction === 'startMission2') {
          handleMission2Continue(currentDialogue.nextAction)
        } else if (currentDialogue.nextAction === 'nextMission') {
          handleNextMission()
        }
      } else {
        setShowDialogue(false)
      }
    }
  }

  const handleZoomClick = () => {
    setCurrentView('gate')
  }

  const handleBackToDesert = () => {
    setCurrentView('desert')
  }

  const handleBackToGate = () => {
    setCurrentView('gate')
  }

  const handleArrowClick = () => {
    setCurrentView('castle')
    // 不自动开始对话，等待用户点击NPC4
  }

  const handleAlphaClick = () => {
    console.log('Alpha clicked. Captured objects:', capturedObjects.length)
    // Check if all 11 objects are collected
    if (capturedObjects.length === 11) {
      console.log('Starting Phase 2 dialogue')
      // Start Phase 2 dialogue
      setIsPhase2(true)
      setShowAlphaDialogue(true)
      setPhase2Messages([])
      setCurrentPhase2Step(0)
      setWaitingForPhase2Choice(false)
      setShowQuiz(false)
      setTimeout(() => {
        addPhase2Message(alphaPhase2DialogueFlow[0])
      }, 100)
    } else if (missionStarted) {
      // Show progress if mission started but not complete
      setCurrentDialogue({
        text: `Keep collecting photos! Progress: ${capturedObjects.length}/11 objects photographed.`,
        speaker: 'Alpha'
      })
      setShowDialogue(true)
    } else {
      // Original Alpha dialogue (Phase 1)
      setShowAlphaDialogue(true)
      setAlphaDialogueMessages([])
      setCurrentAlphaStep(0)
      setWaitingForChoice(false)
      setTimeout(() => {
        addAlphaMessage(alphaDialogueFlow[0])
      }, 100)
    }
  }

  const addAlphaMessage = (dialogueItem, stepOverride = null) => {
    const currentStep = stepOverride !== null ? stepOverride : currentAlphaStep
    console.log('Adding Alpha message:', dialogueItem, 'Current step:', currentStep)
    
    // Set typing message for new dialogue
    if (dialogueItem.type === 'message') {
      setCurrentTypingMessage(dialogueItem)
    }
    
    setAlphaDialogueMessages(prev => [...prev, dialogueItem])
    
    // 移动到下一步
    const nextStep = currentStep + 1
    setCurrentAlphaStep(nextStep)
    console.log('Next step will be:', nextStep)
    
    // 检查下一项是否是选择
    if (nextStep < alphaDialogueFlow.length && alphaDialogueFlow[nextStep].type === 'choice') {
      console.log('Next item is a choice:', alphaDialogueFlow[nextStep])
      setWaitingForChoice(true)
    } else {
      console.log('Next item is not a choice or dialogue ended')
      setWaitingForChoice(false)
    }
  }

  const handleAlphaContinue = () => {
    if (alphaIsTyping && currentTypingMessage) {
      // Skip typing animation
      setAlphaDisplayedText(currentTypingMessage.text)
      setAlphaIsTyping(false)
    } else if (!waitingForChoice) {
      // Continue to next message if available
      const nextStep = currentAlphaStep
      if (nextStep < alphaDialogueFlow.length) {
        const nextItem = alphaDialogueFlow[nextStep]
        if (nextItem.type === 'message') {
          addAlphaMessage(nextItem, nextStep)
        } else if (nextItem.type === 'choice') {
          setWaitingForChoice(true)
        }
      } else {
        // Dialogue completed, close and start mission
        handleCloseAlphaDialogue()
        setCurrentView('desert')
      }
    }
  }

  const handleAlphaChoice = (choiceText) => {
    console.log('User chose:', choiceText, 'Current step:', currentAlphaStep)
    // 添加用户选择到对话历史
    setAlphaDialogueMessages(prev => [...prev, { type: 'choice', text: choiceText, isUser: true }])
    setWaitingForChoice(false)
    
    // 移动到下一步（跳过当前的choice项）
    const nextStep = currentAlphaStep + 1
    setCurrentAlphaStep(nextStep)
    console.log('After choice, moving to step:', nextStep)
    
    // 添加Alpha的回应
    if (nextStep < alphaDialogueFlow.length) {
      console.log('Adding Alpha response:', alphaDialogueFlow[nextStep])
      setTimeout(() => {
        addAlphaMessage(alphaDialogueFlow[nextStep], nextStep)
      }, 500)
    } else {
      console.log('Dialogue completed')
    }
  }

  const handleCloseAlphaDialogue = () => {
    setShowAlphaDialogue(false)
    setAlphaDialogueMessages([])
    setCurrentAlphaStep(0)
    setWaitingForChoice(false)
    
    // Mark Alpha dialogue as completed and start mission
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (!userData.desertProgress) userData.desertProgress = {}
      userData.desertProgress.alphaCompleted = true
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
    
    // Auto-start mission when dialogue completes
    setMissionStarted(true)
    console.log('Mission started automatically after Alpha dialogue')
  }

  const handleObjectClick = (objectId) => {
    if (!missionStarted || capturedObjects.includes(objectId)) return
    
    playCameraSound() // Add camera sound effect
    setCurrentPhotoObject(objectId)
    setShowCamera(true)
    
    // Auto-capture after camera animation
    setTimeout(() => {
      setShowCamera(false)
      setShowPhoto(true)
      setCapturedObjects(prev => [...prev, objectId])
    }, 1500)
  }

  const handleClosePhoto = () => {
    setShowPhoto(false)
    setCurrentPhotoObject(null)
  }

  const addPhase2Message = (dialogueItem, stepOverride = null) => {
    const currentStep = stepOverride !== null ? stepOverride : currentPhase2Step
    console.log('Adding Phase 2 message:', dialogueItem, 'Current step:', currentStep)
    setPhase2Messages(prev => [...prev, dialogueItem])
    
    const nextStep = currentStep + 1
    setCurrentPhase2Step(nextStep)
    
    if (nextStep < alphaPhase2DialogueFlow.length) {
      const nextItem = alphaPhase2DialogueFlow[nextStep]
      console.log('Next Phase 2 item:', nextItem)
      
      if (nextItem.type === 'choice') {
        setWaitingForPhase2Choice(true)
        setShowQuiz(false)
      } else if (nextItem.type === 'quiz') {
        setShowQuiz(true)
        setWaitingForPhase2Choice(false)
      } else if (nextItem.type === 'action') {
        setWaitingForPhase2Choice(false)
        setShowQuiz(false)
      } else if (nextItem.type === 'message') {
        // Auto-continue to next message after a delay
        setWaitingForPhase2Choice(false)
        setShowQuiz(false)
        setTimeout(() => {
          addPhase2Message(nextItem, nextStep)
        }, 1000)
        return // Don't set waiting state since we're auto-continuing
      }
    } else {
      setWaitingForPhase2Choice(false)
      setShowQuiz(false)
    }
  }

  const handlePhase2Choice = (choiceText) => {
    console.log('Phase 2 user chose:', choiceText)
    setPhase2Messages(prev => [...prev, { type: 'choice', text: choiceText, isUser: true }])
    setWaitingForPhase2Choice(false)
    
    const nextStep = currentPhase2Step + 1
    setCurrentPhase2Step(nextStep)
    
    if (nextStep < alphaPhase2DialogueFlow.length) {
      setTimeout(() => {
        addPhase2Message(alphaPhase2DialogueFlow[nextStep], nextStep)
      }, 500)
    }
  }

  const handleQuizAnswer = (answerIndex) => {
    const quiz = alphaPhase2DialogueFlow[currentPhase2Step]
    const selectedOption = quiz.options[answerIndex]
    setSelectedAnswer(answerIndex)
    
    // Add user's answer
    setPhase2Messages(prev => [...prev, { 
      type: 'choice', 
      text: selectedOption.text, 
      isUser: true,
      isCorrect: selectedOption.correct
    }])
    
    // Show correct answer and continue
    setTimeout(() => {
      setShowQuiz(false)
      const nextStep = currentPhase2Step + 1
      setCurrentPhase2Step(nextStep)
      
      if (nextStep < alphaPhase2DialogueFlow.length) {
        addPhase2Message(alphaPhase2DialogueFlow[nextStep], nextStep)
      }
    }, 1000)
  }

  const handleStartLabeling = () => {
    playClickSound() // Add click sound effect
    console.log('Starting labeling phase...')
    setShowAlphaDialogue(false)
    
    // Show model.gif
    setShowModelGif(true)
    
    // Start progress bar after a short delay
    setTimeout(() => {
      setShowProgressBar(true)
      animateProgressBar()
    }, 500)
  }

  const animateProgressBar = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      setProgressValue(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        // Hide model.gif and progress bar, show Alpha dialogue for Mission 2 briefing
        setTimeout(() => {
          setShowModelGif(false)
          setShowProgressBar(false)
          startMission2Briefing()
        }, 500)
      }
    }, 50) // 50ms * 50 steps = 2.5 seconds total
  }

  const startMission2Briefing = () => {
    // Use the left dialogue box for Mission 2 briefing
    setCurrentDialogue({
      text: "Data received! Analyzing the 'blurry photos' you brought back... Beep... Zzz... Warning! Due to high noise levels, my Confidence Level is critically low.",
      speaker: 'Alpha',
      isMission2: true,
      step: 'briefing1'
    })
    setShowDialogue(true)
  }

  const handleMission2DialogueClick = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text)
      setIsTyping(false)
      return
    }

    if (currentDialogue.isMission2) {
      if (currentDialogue.step === 'briefing1') {
        setCurrentDialogue({
          text: "I will try to guess what is in the photos, but I need human intuition to verify. Mission Order: Please watch the screen. If my judgment is correct, click ✅ [Confirm]. If I mistake a broom for a weapon, or a rock for a monster, click ❌ [Reject] and correct me!",
          speaker: 'Alpha',
          isMission2: true,
          step: 'briefing2'
        })
      } else if (currentDialogue.step === 'briefing2') {
        // Start Mission 2 interface in the dialogue box
        setCurrentDialogue({
          text: "Mission 2: Friend or Foe Decoder",
          speaker: 'Alpha',
          isMission2: true,
          step: 'interface',
          showMission2Interface: true
        })
        setCurrentImageIndex(0)
        setMission2Results([])
      } else if (currentDialogue.step === 'complete') {
        setCurrentDialogue({
          text: "Calibration complete! Thank you for the corrections. What is the scientific term for the process you just did to help me fix the images?",
          speaker: 'Alpha',
          isMission2: true,
          step: 'quiz',
          showQuiz: true
        })
      }
    } else {
      setShowDialogue(false)
    }
  }

  const handleMission2Choice = (choice) => {
    const currentImage = mission2Images[currentImageIndex]
    const isCorrect = choice === currentImage.correctAnswer
    
    playStampSound() // Play stamp sound effect
    
    const result = {
      imageId: currentImage.id,
      userChoice: choice,
      correctAnswer: currentImage.correctAnswer,
      isCorrect: isCorrect
    }
    
    // Always add the result to show the stamp
    setMission2Results(prev => {
      const newResults = prev.filter(r => r.imageId !== currentImage.id) // Remove any previous attempt
      return [...newResults, result]
    })
    
    if (!isCorrect) {
      // Show Glitch warning and keep the interface visible
      setShowGlitchWarning(true)
      setTimeout(() => {
        setShowGlitchWarning(false)
        // Remove the incorrect result so they can try again, but keep the interface
        setMission2Results(prev => prev.filter(r => r.imageId !== currentImage.id))
      }, 3000)
    } else {
      // Correct answer - proceed to next image after showing stamp
      setTimeout(() => {
        proceedToNextImageInDialogue()
      }, 1500) // Wait for stamp animation
    }
  }

  const proceedToNextImageInDialogue = () => {
    if (currentImageIndex < mission2Images.length - 1) {
      setCurrentImageIndex(prev => prev + 1)
      // Update dialogue to show next image
      setCurrentDialogue({
        text: "Mission 2: Friend or Foe Decoder",
        speaker: 'Alpha',
        isMission2: true,
        step: 'interface',
        showMission2Interface: true
      })
    } else {
      // Mission 2 complete
      setCurrentDialogue({
        text: "Calibration complete! Thank you for the corrections.",
        speaker: 'Alpha',
        isMission2: true,
        step: 'complete'
      })
    }
  }

  const handleMission2QuizAnswer = (answer) => {
    const isCorrect = answer === 'B'
    
    if (isCorrect) {
      setCurrentDialogue({
        text: "Correct! It's called Data Labeling. AI is like a student, and we acted as teachers, telling it 'this is right, that is wrong.' This is known as Supervised Learning!",
        speaker: 'Alpha',
        isMission2: true,
        step: 'result',
        showNextButton: true
      })
    } else {
      setCurrentDialogue({
        text: "Haha, sounds close, but the professional term is B. Data Labeling. We need to put the correct 'labels' on data so the AI can learn.",
        speaker: 'Alpha',
        isMission2: true,
        step: 'result',
        showNextButton: true
      })
    }
  }

  const handleNextMission = () => {
    playClickSound() // Add click sound effect
    console.log('Starting Mission 3: Environmental Context Analysis')
    setShowAlphaDialogue(false)
    setShowDialogue(false) // Close any existing dialogue first
    
    // Start Mission 3 with intro dialogue
    setCurrentDialogue({
      text: "Alert. Alert. Incoming data anomaly detected. I analyze actions… but my conclusions are sometimes wrong. I need your help, Again. In this mission, you will teach me something critical: context.",
      speaker: 'Alpha',
      isMission3: true,
      step: 'intro'
    })
    setShowDialogue(true)
    setMission3Phase('intro')
  }

  const handleMission3Continue = () => {
    playClickSound()
    
    if (mission3Phase === 'intro') {
      setCurrentDialogue({
        text: "The same action can mean completely different things depending on the environment. Let's analyze how Environmental Context alters my judgment.",
        speaker: 'Alpha',
        isMission3: true,
        step: 'briefing'
      })
      setMission3Phase('briefing')
    } else if (mission3Phase === 'briefing') {
      // Show Mission 3 sample interface in dialogue
      setCurrentDialogue({
        text: "Mission 3: Environmental Context Analysis",
        speaker: 'Alpha',
        isMission3: true,
        step: 'sample',
        showMission3Interface: true
      })
      setMission3Phase('sample')
      setSelectedTag(null)
    } else if (mission3Phase === 'sample') {
      // Start first puzzle in dialogue
      setCurrentDialogue({
        text: "Mission 3: Environmental Context Analysis",
        speaker: 'Alpha',
        isMission3: true,
        step: 'puzzle1',
        showMission3Interface: true
      })
      setMission3Phase('puzzle1')
      setCurrentPuzzle(mission3Data.puzzles[0])
      setSelectedTag(null)
    } else if (mission3Phase === 'puzzle1') {
      setCurrentDialogue({
        text: "Mission 3: Environmental Context Analysis",
        speaker: 'Alpha',
        isMission3: true,
        step: 'puzzle2',
        showMission3Interface: true
      })
      setMission3Phase('puzzle2')
      setCurrentPuzzle(mission3Data.puzzles[1])
      setSelectedTag(null)
    } else if (mission3Phase === 'puzzle2') {
      setCurrentDialogue({
        text: "Mission 3: Environmental Context Analysis",
        speaker: 'Alpha',
        isMission3: true,
        step: 'puzzle3',
        showMission3Interface: true
      })
      setMission3Phase('puzzle3')
      setCurrentPuzzle(mission3Data.puzzles[2])
      setSelectedTag(null)
    } else if (mission3Phase === 'puzzle3') {
      // Start quiz phase with first question
      setMission3Phase('quiz1')
      setCurrentDialogue({
        text: "Threats cleared. I almost activated the defense lasers against a celebration and a worker fighting the wind. I need to update my core logic. Why did the meaning of the 'Iron Sheet' change completely?",
        speaker: 'Alpha',
        isMission3: true,
        step: 'quiz1',
        showQuiz: true,
        quizOptions: [
          { text: "A. Because the iron sheet changed shape.", correct: false },
          { text: "B. Because context (the weather) changes how we interpret an action.", correct: true },
          { text: "C. Because the worker yelled at me.", correct: false }
        ]
      })
    }
  }

  const handleMission3TagClick = (tag) => {
    playClickSound()
    setSelectedTag(tag)
    
    // For sample phase, all tags are correct and show safe icon
    if (mission3Phase === 'sample') {
      playSafeSound()
      setShowAlphaIcon('safe')
    } else {
      // For puzzle phases, check if tag is correct
      if (tag.correct) {
        playSafeSound()
        setShowAlphaIcon('safe')
      } else {
        playAlertSound()
        setShowAlphaIcon('alert')
      }
    }
    
    // Hide icon after 2 seconds and show update text
    setTimeout(() => {
      setShowAlphaIcon(false)
    }, 2000)
  }

  const handleMission3Complete = () => {
    playClickSound()
    console.log('Mission 3 completed!')
    setShowDialogue(false)
    
    // Show loading screen and transition to color mode
    setShowMission3Loading(true)
    
    // After loading, switch to color mode
    setTimeout(() => {
      setShowMission3Loading(false)
      setColorMode(true) // New state for color mode
      setCurrentView('desert') // Return to desert view
      setCurrentSegment(0) // Start from segment 1
    }, 4000) // 4 second loading to accommodate typing effect
  }

  // Mission 3 Quiz handling
  const handleMission3QuizAnswer = (answerIndex, isCorrect) => {
    playClickSound()
    
    if (mission3Phase === 'quiz1') {
      if (isCorrect) {
        // Show correct feedback and continue button
        setCurrentDialogue({
          text: "Affirmative. The action (holding the sheet) stayed the same, but the context (sandstorm) changed the meaning. If you hadn't helped me, I would have attacked them. What does this teach us about AI?",
          speaker: 'Alpha',
          isMission3: true,
          step: 'quiz1_feedback',
          showContinueButton: true
        })
      } else {
        // Show incorrect feedback and let them try again
        setCurrentDialogue({
          ...currentDialogue,
          error: 'Try again! Think about what changed between the scenarios.'
        })
      }
    } else if (mission3Phase === 'quiz2') {
      if (isCorrect) {
        // Show final feedback and done button
        setCurrentDialogue({
          text: "Exactly. I process data, but you provide the 'Common Sense' and context that I lack. System Reboot: Successful. Defense Mode: Deactivated. Thank you, Young Engineers! You collected data I didn't recognize. You corrected my wrong judgments.",
          speaker: 'Alpha',
          isMission3: true,
          step: 'complete',
          showDoneButton: true
        })
        setMission3Phase('complete')
      } else {
        setCurrentDialogue({
          ...currentDialogue,
          error: 'Think about what AI might be missing that humans naturally understand.'
        })
      }
    }
  }

  const handleMission3QuizContinue = () => {
    playClickSound()
    // Move to second quiz question
    setMission3Phase('quiz2')
    setCurrentDialogue({
      text: "If you hadn't helped me, I would have attacked them. What does this teach us about AI?",
      speaker: 'Alpha',
      isMission3: true,
      step: 'quiz2',
      showQuiz: true,
      quizOptions: [
        { text: "A. AI is always right and doesn't need humans.", correct: false },
        { text: "B. AI can sometimes lack 'Common Sense' without human context.", correct: true },
        { text: "C. AI hates holidays.", correct: false }
      ]
    })
  }



  const getBackgroundImage = () => {
    const suffix = colorMode ? '_color.png' : '.png'
    
    if (currentView === 'gate') {
      return `/desert/background/gate${suffix}`
    } else if (currentView === 'castle') {
      return `/desert/background/castle${suffix}`
    } else {
      return `/desert/background/desert${suffix}`
    }
  }

  const getBackgroundPosition = () => {
    if (currentView !== 'desert') return '0px'
    // 由于图片被缩放到80%，位置也需要相应调整
    const positions = {
      [SEGMENTS.SEGMENT_1]: '0px',
      [SEGMENTS.SEGMENT_2]: '-1360px', // -1700 * 0.8 = -1360
      [SEGMENTS.SEGMENT_3]: '-2576px'  // -3220 * 0.8 = -2576
    }
    const position = positions[currentSegment] || '0px'
    return position
  }

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: '#f4e4bc',
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: currentView === 'desert' ? getBackgroundPosition() : 0, // Only apply positioning for desert view
      width: currentView === 'desert' ? '5200px' : '100vw', // Full width for castle/gate views
      height: currentView === 'desert' ? '1080px' : '100vh', // Full height for castle/gate views
      objectFit: currentView === 'desert' ? 'none' : 'cover', // Cover for castle/gate views
      objectPosition: currentView === 'desert' ? 'top left' : 'center',
      zIndex: 0,
      transition: 'left 0.5s ease-in-out',
      imageRendering: 'crisp-edges',
      transform: currentView === 'desert' ? 'scale(0.8)' : 'scale(1)', // No scaling for castle/gate views
      transformOrigin: currentView === 'desert' ? 'top left' : 'center',
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
    glitchNpc: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      width: '120px',
      height: '120px',
      zIndex: 100,
      cursor: 'pointer',
    },
    glitchImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    navArrow: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
      background: 'none',
      border: 'none',
    },
    leftArrow: {
      left: '30px',
    },
    rightArrow: {
      right: '30px',
    },
    arrowImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
    },
    npc: {
      position: 'absolute',
      cursor: 'pointer',
      zIndex: 30,
      transition: 'transform 0.2s',
    },
    npc1: {
      bottom: '20%',
      left: '20%',
      width: 'auto',
      height: '50vh',
      maxHeight: '50vh',
    },
    npc2: {
      bottom: '25%',
      right: '25%',
      width: 'auto',
      height: '50vh',
      maxHeight: '50vh',
    },
    gatekeeper: {
      bottom: '15%',
      left: '15%',
      width: 'auto',
      height: '25vh',
      maxHeight: '25vh',
    },
    npcImage: {
      width: 'auto',
      height: '100%',
      objectFit: 'contain',
    },
    zoomButton: {
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '400px',
      cursor: 'pointer',
      zIndex: 50,
      background: 'none',
      border: 'none',
    },
    zoomImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    arrowButton: {
      position: 'absolute',
      bottom: '30%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '300px',
      height: '300px',
      cursor: 'pointer',
      zIndex: 50,
      background: 'none',
      border: 'none',
    },
    downButton: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      zIndex: 50,
      background: 'none',
      border: 'none',
    },
    leftButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      zIndex: 50,
      background: 'none',
      border: 'none',
    },
    alpha: {
      position: 'absolute',
      bottom: '0%', // 底部0%
      right: '10%', // 距右边10%
      width: 'auto',
      height: '250px',
      zIndex: 30,
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    alphaDialogueContainer: {
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '50%', // 固定1/2宽度在左侧
      height: '80%',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
    },
    alphaDialogueHeader: {
      padding: '15px 20px',
      borderBottom: '2px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    alphaDialogueTitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#5170FF',
      margin: 0,
    },
    alphaDialogueContent: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    alphaDialogueMessage: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.6,
      margin: 0,
      padding: '10px 15px',
      borderRadius: '10px',
      background: '#f8f9fa',
    },
    alphaUserChoice: {
      display: 'block',
      width: '100%',
      padding: '12px 20px',
      margin: '5px 0',
      borderRadius: '8px',
      border: '2px solid #5170FF',
      background: 'rgba(81, 112, 255, 0.1)',
      color: '#5170FF',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
    },
    alphaCloseButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#666',
      padding: '5px',
    },
    dialogueContainer: {
      position: 'absolute',
      bottom: '100px',
      left: '2%', // 移动到更左边
      width: '48%', // 稍微调整宽度
      maxWidth: '600px',
      zIndex: 100,
    },
    glitchDialogueContainer: {
      position: 'absolute',
      top: '20px',
      right: '150px', // 在Glitch NPC左侧
      width: '300px',
      zIndex: 100,
    },
    dialogueBox: {
      padding: '20px 30px',
      borderRadius: '15px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      cursor: 'pointer',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.6,
      margin: 0,
    },
    continueButton: {
      position: 'absolute',
      bottom: '15px',
      right: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#333', // 黑字
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    speaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 600,
      color: '#5170FF',
      marginBottom: '8px',
    },
    optionButton: {
      display: 'block',
      width: '100%',
      padding: '12px 20px',
      margin: '10px 0',
      borderRadius: '8px',
      border: '2px solid #5170FF',
      background: 'rgba(81, 112, 255, 0.1)',
      color: '#5170FF',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Mission objects
    desertObject: {
      position: 'absolute',
      cursor: 'pointer',
      zIndex: 25,
      transition: 'transform 0.2s',
      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
    },
    objectImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    capturedObject: {
      opacity: 0.5,
      filter: 'grayscale(100%) drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
    },
    // Camera interface
    cameraOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraIcon: {
      width: '200px',
      height: 'auto', // 自动高度以保持原始比例
      animation: 'pulse 1.5s ease-in-out',
    },
    // Photo display
    photoOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.9)',
      zIndex: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    photoFrame: {
      position: 'relative',
      width: '1200px', // Increased from 400px (3x)
      height: '1500px', // Increased from 500px (3x)
      backgroundImage: 'url(/desert/icon/photo.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '180px 120px 240px 120px', // Increased from 60px 40px 80px 40px (3x)
    },
    photoBackground: {
      width: '840px', // Increased from 280px (3x)
      height: '600px', // Increased from 200px (3x)
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '60px', // Increased from 20px (3x)
      overflow: 'hidden',
    },
    photoObjectImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    photoDescription: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '42px', // Increased from 14px (3x)
      color: '#333',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: '840px', // Increased from 280px (3x)
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '30px', // Increased from 10px (3x)
      borderRadius: '15px', // Increased from 5px (3x)
    },
    photoCloseButton: {
      position: 'absolute',
      top: '30px', // Increased from 10px (3x)
      right: '30px', // Increased from 10px (3x)
      background: 'rgba(255, 255, 255, 0.8)',
      border: 'none',
      borderRadius: '50%',
      width: '90px', // Increased from 30px (3x)
      height: '90px', // Increased from 30px (3x)
      fontSize: '48px', // Increased from 16px (3x)
      cursor: 'pointer',
      color: '#333',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    // Progress tracker
    progressTracker: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      zIndex: 60,
    },
    progressCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.8)',
      border: '2px solid #ccc',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#666',
    },
    progressCircleCompleted: {
      background: 'rgba(81, 112, 255, 0.9)',
      border: '2px solid #5170FF',
      color: 'white',
    },
    // Phase 2 specific styles
    comparisonImage: {
      width: '100%',
      maxWidth: '400px',
      height: 'auto',
      margin: '15px 0',
      borderRadius: '8px',
      border: '2px solid #ddd',
    },
    quizContainer: {
      background: '#f8f9fa',
      padding: '20px',
      borderRadius: '10px',
      margin: '15px 0',
    },
    quizQuestion: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '15px',
    },
    quizOption: {
      display: 'block',
      width: '100%',
      padding: '12px 15px',
      margin: '8px 0',
      borderRadius: '8px',
      border: '2px solid #ddd',
      background: 'white',
      color: '#333',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
    },
    quizOptionCorrect: {
      border: '2px solid #28a745',
      background: '#d4edda',
      color: '#155724',
    },
    quizOptionIncorrect: {
      border: '2px solid #dc3545',
      background: '#f8d7da',
      color: '#721c24',
    },
    actionButton: {
      display: 'block',
      width: '100%',
      padding: '15px 20px',
      margin: '15px 0',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      color: 'white',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Model.gif and progress bar
    modelGifOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.9)',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modelGif: {
      width: '400px',
      height: 'auto',
      marginBottom: '30px',
    },
    progressBarContainer: {
      width: '60%',
      maxWidth: '500px',
      height: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      borderRadius: '10px',
      transition: 'width 0.1s ease',
    },
    // Mission 2 interface
    mission2Overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, rgba(81, 112, 255, 0.9), rgba(255, 187, 196, 0.9))',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    mission2ImageContainer: {
      width: '400px',
      height: '300px',
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    mission2Image: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    stampOverlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '150px',
      height: '150px',
      zIndex: 10,
    },
    mission2ButtonContainer: {
      display: 'flex',
      gap: '40px',
    },
    mission2Button: {
      width: '120px',
      height: '120px',
      border: 'none',
      borderRadius: '15px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    },
    mission2ButtonIcon: {
      width: '60px',
      height: '60px',
      marginBottom: '10px',
    },
    mission2ButtonText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
    },
    // Glitch warning
    glitchWarningOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      zIndex: 400,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    glitchWarningBox: {
      background: 'white',
      padding: '30px',
      borderRadius: '15px',
      maxWidth: '500px',
      textAlign: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
    glitchWarningText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      color: '#333',
      lineHeight: 1.6,
    },
    // Final quiz
    finalQuizContainer: {
      background: '#f8f9fa',
      padding: '25px',
      borderRadius: '15px',
      margin: '20px 0',
      maxWidth: '500px',
    },
    finalQuizOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '20px',
    },
    finalQuizOption: {
      padding: '15px 20px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      transition: 'all 0.2s',
    },
    // Mission 2 interface within dialogue
    mission2InterfaceContainer: {
      marginTop: '10%', // 距离顶部10%
      padding: '40px',
      background: 'linear-gradient(135deg, #2d3748, #4a5568)', // Dark gradient background like image 1
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
    },
    mission2ImageDisplay: {
      width: '100%',
      maxWidth: '500px', // Large prominent display
      height: '350px', // Tall for prominence
      background: 'white',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      border: 'none', // Remove border for cleaner look
      margin: '0 auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    },
    mission2ImageInDialogue: {
      maxWidth: '100%',
      maxHeight: '280px', // Larger image to fill space
      objectFit: 'contain',
      borderRadius: '8px',
    },
    mission2ImageLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 800,
      color: '#2d3748',
      marginTop: '15px',
      textAlign: 'center',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    mission2StampInDialogue: {
      position: 'absolute',
      bottom: '20px', // Bottom-left corner positioning
      left: '20px',   
      width: '100px', // 放大到100px
      height: '100px', // 放大到100px
      zIndex: 10,
      animation: 'stampAppear 0.6s ease-out',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
    },
    mission2ButtonsContainer: {
      display: 'flex',
      gap: '40px', // Wider spacing
      justifyContent: 'center',
    },
    mission2ButtonInDialogue: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '30px 35px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '25px', // More rounded corners
      background: 'rgba(255, 255, 255, 0.1)', // Subtle glass background
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minWidth: '160px', // Wider buttons
      minHeight: '160px', // Taller buttons
      justifyContent: 'center',
      backdropFilter: 'blur(20px)', // Strong glass effect
      boxShadow: '0 10px 25px rgba(0,0,0,0.4)', // Prominent shadow
      position: 'relative',
      overflow: 'hidden',
    },
    mission2ButtonIconInDialogue: {
      width: '70px', // Larger icons
      height: '70px',
      marginBottom: '15px',
      // 移除卡片底色，让icon直接显示
    },
    mission2ButtonTextInDialogue: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px', // Larger text
      fontWeight: 800,
      color: 'white',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    // Mission 2 styles for dialogue box (based on design requirements)
    mission2InterfaceInDialogue: {
      marginTop: '20px',
      padding: '30px',
      background: 'rgba(30, 30, 50, 0.95)', // Dark background like design
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(30, 30, 50, 0.95), rgba(30, 30, 50, 0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    mission2TitleInDialogue: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '24px',
      fontWeight: 400,
      color: 'white',
      textAlign: 'center',
      marginBottom: '30px',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    mission2ImageDisplayInDialogue: {
      position: 'relative',
      marginBottom: '40px',
    },
    mission2ImageInDialogueNew: {
      maxWidth: '400px',
      maxHeight: '300px',
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
    mission2StampInDialogueNew: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '250px',
      height: '250px',
      zIndex: 10,
      pointerEvents: 'none',
    },
    mission2ButtonsInDialogue: {
      display: 'flex',
      gap: '60px',
      alignItems: 'center',
    },
    mission2ButtonInDialogueNew: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    mission2ButtonIconInDialogueNew: {
      width: '100px', // 设置宽度
      height: 'auto', // 自动高度以保持原始比例
      marginBottom: '15px',
    },
    mission2ButtonTextInDialogueNew: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 700,
      color: 'white',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    nextMissionButton: {
      display: 'block',
      width: '100%',
      padding: '15px 20px',
      margin: '15px 0',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      color: 'white',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Mission 3 interface within dialogue
    mission3InterfaceContainer: {
      marginTop: '20px',
      padding: '25px',
      background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
      borderRadius: '15px',
      border: '2px solid #dee2e6',
    },
    mission3LogicTextAboveImage: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '15px',
      textAlign: 'center',
      fontStyle: 'italic',
    },
    mission3ImageDisplay: {
      width: '100%',
      height: '250px', // 增加高度
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    mission3ImageInDialogue: {
      maxWidth: '100%',
      maxHeight: '100%', // 使用全部高度
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // 添加阴影使图片更突出
    },
    mission3UpdateTextAboveButtons: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      marginBottom: '15px',
      textAlign: 'center',
      background: '#d4edda',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #c3e6cb',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mission3TagsInDialogue: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: '15px',
    },
    mission3TagInDialogue: {
      padding: '10px 18px', // 稍微增加padding
      border: '2px solid #5170FF',
      borderRadius: '25px',
      background: 'white',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      fontWeight: 500,
      color: '#5170FF',
      transition: 'all 0.2s',
      minWidth: '100px',
      textAlign: 'center',
    },
    mission3TagSelectedInDialogue: {
      background: '#5170FF',
      color: 'white',
      transform: 'scale(1.05)',
    },
    mission3ContinueButtonInDialogue: {
      display: 'block',
      width: '100%',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '25px',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      color: 'white',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Mission 3 styles
    mission3Overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, rgba(81, 112, 255, 0.9), rgba(255, 187, 196, 0.9))',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    mission3Container: {
      width: '90%',
      maxWidth: '800px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
    },
    mission3Title: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '24px',
      fontWeight: 700,
      color: '#5170FF',
      marginBottom: '20px',
      textAlign: 'center',
    },
    mission3ImageContainer: {
      width: '100%',
      maxWidth: '500px',
      height: '300px',
      background: '#f8f9fa',
      borderRadius: '15px',
      padding: '20px',
      marginBottom: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      border: '2px solid #ddd',
    },
    mission3Image: {
      maxWidth: '100%',
      maxHeight: '200px',
      objectFit: 'contain',
      borderRadius: '8px',
    },
    mission3LogicText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#dc3545',
      marginTop: '15px',
      textAlign: 'center',
      background: '#f8d7da',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #f5c6cb',
    },
    mission3TagsContainer: {
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: '20px',
    },
    mission3Tag: {
      padding: '12px 20px',
      border: '2px solid #5170FF',
      borderRadius: '25px',
      background: 'white',
      cursor: 'pointer',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#5170FF',
      transition: 'all 0.2s',
      minWidth: '120px',
      textAlign: 'center',
    },
    mission3TagSelected: {
      background: '#5170FF',
      color: 'white',
      transform: 'scale(1.05)',
    },
    mission3UpdateText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#28a745',
      marginTop: '15px',
      textAlign: 'center',
      background: '#d4edda',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #c3e6cb',
      minHeight: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mission3ContinueButton: {
      padding: '15px 30px',
      border: 'none',
      borderRadius: '25px',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      color: 'white',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '20px',
    },
    alphaIconOverlay: {
      position: 'fixed',
      bottom: '30%', // 距底部30%
      right: '5%',   // 距右边5%
      width: '100px',
      height: '100px',
      zIndex: 400,
      animation: 'bounce 0.6s ease-out',
    },
    alphaIcon: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    // Mission 3 Loading Screen
    mission3LoadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.9)',
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    mission3LoadingText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '28px',
      fontWeight: 700,
      color: '#00ff00', // 绿色终端风格
      marginBottom: '30px',
      textAlign: 'center',
      fontFamily: "'Courier New', monospace", // 终端字体
      letterSpacing: '2px',
    },
    loadingCursor: {
      display: 'inline-block',
      width: '3px',
      height: '28px',
      backgroundColor: '#00ff00',
      marginLeft: '5px',
      verticalAlign: 'middle',
      animation: 'blink 1s infinite',
    },
    mission3LoadingSpinner: {
      width: '60px',
      height: '60px',
      border: '4px solid rgba(255, 255, 255, 0.3)',
      borderTop: '4px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  }

  return (
    <div style={styles.container}>
      <img 
        src={getBackgroundImage()}
        alt="Desert Background" 
        style={styles.backgroundImage}
      />
      
      {/* Exit button - only show in desert view */}
      {currentView === 'desert' && (
        <button style={styles.exitButton} onClick={onExit}>
          {t('exit')}
        </button>
      )}

      {/* Glitch NPC (always visible) */}
      <div style={styles.glitchNpc} onClick={handleGlitchClick}>
        <img src="/npc/npc_desert.png" alt="Glitch" style={styles.glitchImage} />
      </div>

      {/* Desert view navigation and NPCs */}
      {currentView === 'desert' && (
        <>
          {console.log('Desert view - Mission started:', missionStarted, 'Current segment:', currentSegment, 'Objects for segment:', desertObjects[currentSegment])}
          {/* Navigation arrows */}
          <button 
            style={{...styles.navArrow, ...styles.leftArrow}}
            onClick={() => handleNavigate('left')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >
            <img src="/jungle/icon/left.png" alt="Left" style={styles.arrowImage} />
          </button>
          
          <button 
            style={{...styles.navArrow, ...styles.rightArrow}}
            onClick={() => handleNavigate('right')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
          >
            <img src="/jungle/icon/right.png" alt="Right" style={styles.arrowImage} />
          </button>

          {/* NPCs based on current segment - different NPCs for color mode */}
          {colorMode ? (
            // Post-Mission 3 NPCs (Color mode)
            <>
              {currentSegment === SEGMENTS.SEGMENT_1 && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '35%',
                    right: '40%',
                    width: '450px',
                    height: '450px',
                    cursor: 'pointer',
                    zIndex: 30,
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => handleNpcClick('npc6')}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/desert/npc/npc6.png" alt="NPC 6" style={styles.npcImage} />
                </div>
              )}

              {currentSegment === SEGMENTS.SEGMENT_2 && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: '200px',
                    height: '200px',
                    cursor: 'pointer',
                    zIndex: 30,
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => handleNpcClick('npc5')}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/desert/npc/npc5.png" alt="NPC 5" style={styles.npcImage} />
                </div>
              )}

              {currentSegment === SEGMENTS.SEGMENT_3 && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '35%',
                    right: '45%',
                    width: '500px',
                    height: '500px',
                    cursor: 'pointer',
                    zIndex: 30,
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => handleNpcClick('npc7')}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/desert/npc/npc7.png" alt="NPC 7" style={styles.npcImage} />
                </div>
              )}
            </>
          ) : (
            // Original NPCs (Pre-Mission 3)
            <>
              {!missionStarted && currentSegment === SEGMENTS.SEGMENT_1 && (
                <div 
                  style={{...styles.npc, ...styles.npc1}}
                  onClick={() => handleNpcClick('npc1')}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/desert/npc/npc1.gif" alt="Running NPC 1" style={styles.npcImage} />
                </div>
              )}

              {!missionStarted && currentSegment === SEGMENTS.SEGMENT_2 && (
                <div 
                  style={{...styles.npc, ...styles.gatekeeper}}
                  onClick={() => handleNpcClick('gatekeeper')}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/desert/npc/npc3.png" alt="Gatekeeper" style={styles.npcImage} />
                </div>
              )}

              {!missionStarted && currentSegment === SEGMENTS.SEGMENT_3 && (
                <div 
                  style={{...styles.npc, ...styles.npc2}}
                  onClick={() => handleNpcClick('npc2')}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img src="/desert/npc/npc2.png" alt="Running NPC 2" style={styles.npcImage} />
                </div>
              )}
            </>
          )}

          {/* Zoom button - always show in SEGMENT_2 */}
          {currentSegment === SEGMENTS.SEGMENT_2 && (
            <button style={styles.zoomButton} onClick={handleZoomClick}>
              <img src="/desert/icon/zoom.png" alt="Zoom" style={styles.zoomImage} />
            </button>
          )}

          {/* Mission Objects - only show in non-color mode */}
          {!colorMode && missionStarted && desertObjects[currentSegment]?.map(obj => {
            console.log('Rendering object:', obj.id, 'in segment:', currentSegment)
            return (
              <div
                key={obj.id}
                style={{
                  ...styles.desertObject,
                  width: `${obj.size}px`,
                  height: `${obj.size}px`,
                  left: obj.left,
                  right: obj.right,
                  top: obj.top,
                  bottom: obj.bottom,
                  ...(capturedObjects.includes(obj.id) ? styles.capturedObject : {})
                }}
                onClick={() => handleObjectClick(obj.id)}
                onMouseOver={(e) => {
                  if (!capturedObjects.includes(obj.id)) {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                <img 
                  src={`/desert/object/${obj.id}.png`} 
                  alt={`Object ${obj.id}`} 
                  style={styles.objectImage}
                />
              </div>
            )
          })}
        </>
      )}

      {/* Mission Progress Tracker - only show in non-color mode */}
      {!colorMode && missionStarted && currentView === 'desert' && (
        <div style={styles.progressTracker}>
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map(objectId => {
            const isCompleted = capturedObjects.includes(objectId)
            return (
              <div
                key={objectId}
                style={{
                  ...styles.progressCircle,
                  ...(isCompleted ? styles.progressCircleCompleted : {})
                }}
              >
                {isCompleted ? objectId : '?'}
              </div>
            )
          })}
        </div>
      )}

      {/* Gate view */}
      {currentView === 'gate' && (
        <>
          <button style={styles.arrowButton} onClick={handleArrowClick}>
            <img src="/desert/icon/arrow.png" alt="Enter" style={styles.zoomImage} />
          </button>
          
          <button style={styles.downButton} onClick={handleBackToDesert}>
            <img src="/jungle/icon/down.png" alt="Back to Desert" style={styles.zoomImage} />
          </button>
        </>
      )}

      {/* Castle view */}
      {currentView === 'castle' && (
        <>
          <button style={styles.leftButton} onClick={handleBackToGate}>
            <img src="/jungle/icon/left.png" alt="Back to Gate" style={styles.zoomImage} />
          </button>
          
          <div 
            style={{
              position: 'absolute',
              bottom: colorMode ? '15%' : '0%', // 彩色模式下调整位置
              right: colorMode ? '25%' : '10%', // 彩色模式下调整位置
              width: 'auto',
              height: colorMode ? '300px' : '250px', // 彩色模式下调整大小
              zIndex: 30,
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onClick={colorMode ? () => handleNpcClick('alphaFinal') : handleAlphaClick}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/desert/npc/npc4.png" alt="Alpha" style={styles.npcImage} />
          </div>
        </>
      )}

      {/* Regular NPC Dialogue */}
      {showDialogue && currentDialogue && (
        <div style={currentDialogue.speaker === 'Glitch' ? styles.glitchDialogueContainer : styles.dialogueContainer}>
          <div style={styles.dialogueBox} onClick={currentDialogue.showMission2Interface || currentDialogue.showMission3Interface || currentDialogue.showQuiz || currentDialogue.showNextButton || currentDialogue.showContinueButton || currentDialogue.showDoneButton ? undefined : handleDialogueClick}>
            <div style={styles.speaker}>{currentDialogue.speaker}</div>
            <p style={styles.dialogueText}>
              {displayedText}
              <span style={styles.cursor}></span>
            </p>
            
            {/* Mission 2 Interface - Inside Dialogue Box */}
            {currentDialogue.showMission2Interface && (
              <div style={styles.mission2InterfaceInDialogue}>
                <div style={styles.mission2TitleInDialogue}>Mission 2: The Identity Filter</div>
                
                <div style={styles.mission2ImageDisplayInDialogue}>
                  <img 
                    src={mission2Images[currentImageIndex].src} 
                    alt={`Mission Image ${currentImageIndex + 1}`}
                    style={styles.mission2ImageInDialogueNew}
                  />
                  
                  {/* Show stamp if user made a choice for this image */}
                  {mission2Results.find(r => r.imageId === mission2Images[currentImageIndex].id) && (
                    <img 
                      src={mission2Results.find(r => r.imageId === mission2Images[currentImageIndex].id).userChoice === 'confirmed' 
                        ? '/desert/icon/confirmed.png' 
                        : '/desert/icon/rejected.png'
                      }
                      alt="Stamp"
                      style={styles.mission2StampInDialogueNew}
                    />
                  )}
                </div>

                <div style={styles.mission2ButtonsInDialogue}>
                  <button 
                    style={styles.mission2ButtonInDialogueNew}
                    onClick={() => handleMission2Choice('confirmed')}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    <img src="/desert/icon/correct.png" alt="Confirm" style={styles.mission2ButtonIconInDialogueNew} />
                    <span style={styles.mission2ButtonTextInDialogueNew}>Confirmed</span>
                  </button>
                  
                  <button 
                    style={styles.mission2ButtonInDialogueNew}
                    onClick={() => handleMission2Choice('rejected')}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    <img src="/desert/icon/wrong.png" alt="Reject" style={styles.mission2ButtonIconInDialogueNew} />
                    <span style={styles.mission2ButtonTextInDialogueNew}>Rejected</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Mission 3 Interface */}
            {currentDialogue.showMission3Interface && (
              <div style={styles.mission3InterfaceContainer}>
                {/* AI Logic Text Above Image */}
                <div style={styles.mission3LogicTextAboveImage}>
                  {mission3Phase === 'sample' ? mission3Data.sample.aiLogic : currentPuzzle?.aiLogic}
                </div>

                {/* Image Display - Larger and without card background */}
                <div style={styles.mission3ImageDisplay}>
                  {mission3Phase === 'sample' ? (
                    <img 
                      src={mission3Data.sample.image} 
                      alt="Sample Analysis"
                      style={styles.mission3ImageInDialogue}
                    />
                  ) : currentPuzzle && (
                    <img 
                      src={currentPuzzle.image} 
                      alt={`Puzzle ${currentPuzzle.id}`}
                      style={styles.mission3ImageInDialogue}
                    />
                  )}
                </div>

                {/* Updated AI Logic Text */}
                <div style={styles.mission3UpdateTextAboveButtons}>
                  {selectedTag ? selectedTag.update : 'Select a context tag to update AI logic'}
                </div>

                {/* Context Tags */}
                <div style={styles.mission3TagsInDialogue}>
                  {(mission3Phase === 'sample' ? mission3Data.sample.tags : currentPuzzle?.tags || []).map(tag => (
                    <button
                      key={tag.id}
                      style={{
                        ...styles.mission3TagInDialogue,
                        ...(selectedTag?.id === tag.id ? styles.mission3TagSelectedInDialogue : {})
                      }}
                      onClick={() => handleMission3TagClick(tag)}
                      onMouseOver={(e) => {
                        if (selectedTag?.id !== tag.id) {
                          e.target.style.background = '#f0f0f0'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedTag?.id !== tag.id) {
                          e.target.style.background = 'white'
                        }
                      }}
                    >
                      {tag.text}
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                {selectedTag && (mission3Phase === 'sample' || selectedTag.correct) && (
                  <button 
                    style={styles.mission3ContinueButtonInDialogue}
                    onClick={handleMission3Continue}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {mission3Phase === 'puzzle3' ? 'Complete Analysis' : 
                     mission3Phase === 'sample' ? 'Continue to Puzzles' : 'Next Puzzle'}
                  </button>
                )}
              </div>
            )}
            
            {/* Quiz Interface */}
            {currentDialogue.showQuiz && (
              <div style={styles.finalQuizContainer}>
                <div style={styles.finalQuizOptions}>
                  {currentDialogue.quizOptions ? (
                    // Mission 3 Quiz - Dynamic options
                    currentDialogue.quizOptions.map((option, index) => (
                      <button 
                        key={index}
                        style={styles.finalQuizOption}
                        onClick={() => currentDialogue.isMission3 ? 
                          handleMission3QuizAnswer(index, option.correct) : 
                          handleMission2QuizAnswer(option.text.charAt(0))
                        }
                        onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.background = 'white'}
                      >
                        {option.text}
                      </button>
                    ))
                  ) : (
                    // Mission 2 Quiz - Static options (fallback)
                    <>
                      <button 
                        style={styles.finalQuizOption}
                        onClick={() => handleMission2QuizAnswer('A')}
                        onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.background = 'white'}
                      >
                        A. Changing AI's Glasses
                      </button>
                      <button 
                        style={styles.finalQuizOption}
                        onClick={() => handleMission2QuizAnswer('B')}
                        onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.background = 'white'}
                      >
                        B. Data Labeling / Annotation
                      </button>
                      <button 
                        style={styles.finalQuizOption}
                        onClick={() => handleMission2QuizAnswer('C')}
                        onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
                        onMouseOut={(e) => e.target.style.background = 'white'}
                      >
                        C. Magic Reshuffling
                      </button>
                    </>
                  )}
                </div>
                {currentDialogue.error && (
                  <div style={{
                    color: '#dc3545',
                    fontSize: '14px',
                    marginTop: '10px',
                    textAlign: 'center'
                  }}>
                    {currentDialogue.error}
                  </div>
                )}
              </div>
            )}

            {/* Mission 3 Continue Button */}
            {currentDialogue.showContinueButton && (
              <button 
                style={styles.nextMissionButton}
                onClick={handleMission3QuizContinue}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                CONTINUE
              </button>
            )}

            {/* Next Mission Button */}
            {currentDialogue.showNextButton && (
              <button 
                style={styles.nextMissionButton}
                onClick={handleNextMission}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                NEXT MISSION
              </button>
            )}

            {/* Mission 3 Done Button */}
            {currentDialogue.showDoneButton && (
              <button 
                style={styles.nextMissionButton}
                onClick={handleMission3Complete}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                MISSION COMPLETE
              </button>
            )}

            {/* Regular Continue Button - Only show when no special interfaces are active */}
            {!currentDialogue.showMission2Interface && 
             !currentDialogue.showMission3Interface && 
             !currentDialogue.showQuiz && 
             !currentDialogue.showNextButton && 
             !currentDialogue.showContinueButton && 
             !currentDialogue.showDoneButton && (
              <button
                style={styles.continueButton}
                onClick={handleDialogueClick}
              >
                {isTyping ? 'Skip' : 'CONTINUE'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Alpha Dialogue - Both Phase 1 and Phase 2 */}
      {showAlphaDialogue && (
        <div style={styles.alphaDialogueContainer}>
          <div style={styles.alphaDialogueHeader}>
            <h3 style={styles.alphaDialogueTitle}>
              {isPhase2 ? 'Alpha - Data Analysis Phase' : 'Alpha - Castle AI System'}
            </h3>
            <button style={styles.alphaCloseButton} onClick={handleCloseAlphaDialogue}>
              ✕
            </button>
          </div>
          
          <div style={styles.alphaDialogueContent}>
            {/* Phase 1 Messages */}
            {!isPhase2 && alphaDialogueMessages.map((message, index) => (
              <div key={index}>
                {message.type === 'message' && (
                  <div style={{...styles.alphaDialogueMessage, position: 'relative'}}>
                    <strong>{message.speaker}:</strong> 
                    {currentTypingMessage && currentTypingMessage === message ? (
                      <>
                        {alphaDisplayedText}
                        {alphaIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
                      </>
                    ) : (
                      message.text
                    )}
                    {/* Continue/Skip button for the latest message */}
                    {index === alphaDialogueMessages.length - 1 && 
                     message.type === 'message' && 
                     !waitingForChoice && 
                     currentAlphaStep < alphaDialogueFlow.length && (
                      <button
                        style={styles.continueButton}
                        onClick={handleAlphaContinue}
                      >
                        {alphaIsTyping ? 'Skip' : 'CONTINUE'}
                      </button>
                    )}
                  </div>
                )}
                {message.type === 'choice' && message.isUser && (
                  <div style={{...styles.alphaDialogueMessage, background: '#e3f2fd', textAlign: 'right'}}>
                    <strong>You:</strong> {message.text}
                  </div>
                )}
              </div>
            ))}
            
            {/* Phase 1 Choice Button */}
            {!isPhase2 && waitingForChoice && currentAlphaStep < alphaDialogueFlow.length && (
              <button 
                style={styles.alphaUserChoice}
                onClick={() => handleAlphaChoice(alphaDialogueFlow[currentAlphaStep].text)}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(81, 112, 255, 0.2)'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(81, 112, 255, 0.1)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                👉 {alphaDialogueFlow[currentAlphaStep].text}
              </button>
            )}

            {/* Phase 2 Messages */}
            {isPhase2 && phase2Messages.map((message, index) => (
              <div key={index}>
                {message.type === 'message' && (
                  <div style={styles.alphaDialogueMessage}>
                    <strong>{message.speaker}:</strong> {message.text}
                    {message.image && (
                      <div style={{marginTop: '15px'}}>
                        <img src={message.image} alt="Comparison" style={styles.comparisonImage} />
                      </div>
                    )}
                  </div>
                )}
                {message.type === 'choice' && message.isUser && (
                  <div style={{
                    ...styles.alphaDialogueMessage, 
                    background: message.isCorrect === true ? '#d4edda' : 
                               message.isCorrect === false ? '#f8d7da' : '#e3f2fd', 
                    textAlign: 'right'
                  }}>
                    <strong>You:</strong> {message.text}
                    {message.isCorrect === true && <span style={{color: '#28a745'}}> ✓ Correct!</span>}
                    {message.isCorrect === false && <span style={{color: '#dc3545'}}> ✗ Incorrect</span>}
                  </div>
                )}
              </div>
            ))}

            {/* Phase 2 Choice Button */}
            {isPhase2 && waitingForPhase2Choice && currentPhase2Step < alphaPhase2DialogueFlow.length && (
              <button 
                style={styles.alphaUserChoice}
                onClick={() => handlePhase2Choice(alphaPhase2DialogueFlow[currentPhase2Step].text)}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(81, 112, 255, 0.2)'
                  e.target.style.transform = 'scale(1.02)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(81, 112, 255, 0.1)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                👉 {alphaPhase2DialogueFlow[currentPhase2Step].text}
              </button>
            )}

            {/* Quiz Interface */}
            {isPhase2 && showQuiz && currentPhase2Step < alphaPhase2DialogueFlow.length && (
              <div style={styles.quizContainer}>
                <div style={styles.quizQuestion}>
                  {alphaPhase2DialogueFlow[currentPhase2Step].question}
                </div>
                {alphaPhase2DialogueFlow[currentPhase2Step].options.map((option, index) => (
                  <button
                    key={index}
                    style={styles.quizOption}
                    onClick={() => handleQuizAnswer(index)}
                    onMouseOver={(e) => {
                      e.target.style.background = '#f0f0f0'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'white'
                    }}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}

            {/* Action Button (GO) */}
            {isPhase2 && !waitingForPhase2Choice && !showQuiz && 
             currentPhase2Step < alphaPhase2DialogueFlow.length && 
             alphaPhase2DialogueFlow[currentPhase2Step].type === 'action' && (
              <button 
                style={styles.actionButton}
                onClick={handleStartLabeling}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)'
                }}
              >
                {alphaPhase2DialogueFlow[currentPhase2Step].text}
              </button>
            )}
            
            {/* Phase 1 completion message */}
            {!isPhase2 && !waitingForChoice && currentAlphaStep >= alphaDialogueFlow.length && (
              <div style={{...styles.alphaDialogueMessage, background: '#e8f5e8', textAlign: 'center', fontWeight: 'bold', position: 'relative'}}>
                Mission briefing complete! You can now start collecting data samples.
                <button
                  style={styles.continueButton}
                  onClick={handleCloseAlphaDialogue}
                >
                  CONTINUE
                </button>
              </div>
            )}

            {/* Phase 2 completion message with Continue button */}
            {isPhase2 && !waitingForPhase2Choice && !showQuiz && 
             currentPhase2Step >= alphaPhase2DialogueFlow.length && (
              <div style={{...styles.alphaDialogueMessage, background: '#e8f5e8', textAlign: 'center', fontWeight: 'bold', position: 'relative'}}>
                Data analysis complete! Ready for next phase.
                <button
                  style={styles.continueButton}
                  onClick={handleCloseAlphaDialogue}
                >
                  CONTINUE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Camera Interface */}
      {showCamera && (
        <div style={styles.cameraOverlay}>
          <img src="/desert/icon/camera.png" alt="Camera" style={styles.cameraIcon} />
        </div>
      )}

      {/* Photo Display */}
      {showPhoto && currentPhotoObject && (
        <div style={styles.photoOverlay} onClick={handleClosePhoto}>
          <div style={styles.photoFrame} onClick={(e) => e.stopPropagation()}>
            <button style={styles.photoCloseButton} onClick={handleClosePhoto}>
              ✕
            </button>
            
            <div style={styles.photoBackground}>
              <img 
                src={`/desert/object/${currentPhotoObject}.png`}
                alt={`Object ${currentPhotoObject}`}
                style={styles.photoObjectImage}
              />
            </div>
            
            <div style={styles.photoDescription}>
              {objectDescriptions[currentPhotoObject] || `Object ${currentPhotoObject}`}
            </div>
          </div>
        </div>
      )}

      {/* Model.gif Loading Screen */}
      {showModelGif && (
        <div style={styles.modelGifOverlay}>
          <img src="/desert/model.gif" alt="AI Model Loading" style={styles.modelGif} />
          {showProgressBar && (
            <div style={styles.progressBarContainer}>
              <div style={{...styles.progressBar, width: `${progressValue}%`}}></div>
            </div>
          )}
        </div>
      )}

      {/* Glitch Warning for Wrong Choices */}
      {showGlitchWarning && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '150px', // Position near Glitch NPC
          width: '350px',
          zIndex: 400,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '3px solid transparent',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          borderRadius: '15px',
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#5170FF',
            marginBottom: '8px'
          }}>
            Glitch
          </div>
          <div style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '16px',
            color: '#333',
            lineHeight: 1.6
          }}>
            Look it careful！！
          </div>
        </div>
      )}

      {/* Mission 3: Environmental Context Analysis Interface - REMOVED, now in dialogue */}

      {/* Alpha Icon Feedback */}
      {showAlphaIcon && (
        <div style={styles.alphaIconOverlay}>
          <img 
            src={showAlphaIcon === 'safe' ? '/desert/icon/safe.png' : '/desert/icon/alert.png'}
            alt={showAlphaIcon === 'safe' ? 'Safe' : 'Alert'}
            style={styles.alphaIcon}
          />
        </div>
      )}

      {/* Mission 3 Loading Screen */}
      {showMission3Loading && (
        <div style={styles.mission3LoadingOverlay}>
          <div style={styles.mission3LoadingText}>
            {loadingText}
            {loadingTyping && <span style={styles.loadingCursor}></span>}
          </div>
          <div style={styles.mission3LoadingSpinner}></div>
        </div>
      )}
    </div>
  )
}

export default DesertMap