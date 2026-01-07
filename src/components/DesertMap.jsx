import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'

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
  const { playClickSound, playCameraSound } = useSoundEffects()

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
    if (currentDialogue && currentDialogue.isMission2) {
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
      
      // 如果对话结束，自动关闭对话框并返回沙漠
      if (nextStep >= alphaDialogueFlow.length) {
        setTimeout(() => {
          handleCloseAlphaDialogue()
          setCurrentView('desert')
        }, 2000) // 2秒后自动关闭
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
    
    const result = {
      imageId: currentImage.id,
      userChoice: choice,
      correctAnswer: currentImage.correctAnswer,
      isCorrect: isCorrect
    }
    
    setMission2Results(prev => [...prev, result])
    
    if (!isCorrect) {
      // Show Glitch warning in dialogue
      setCurrentDialogue({
        text: "Look carefully at these confusing photos. They might be plants, or maybe not; they might be rocks, or maybe not. Check again!",
        speaker: 'Glitch',
        isMission2: true,
        step: 'warning'
      })
      setTimeout(() => {
        proceedToNextImageInDialogue()
      }, 3000)
    } else {
      proceedToNextImageInDialogue()
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
    console.log('Proceeding to next mission...')
    alert('Next Mission! (This would transition to the next phase)')
  }



  const getBackgroundImage = () => {
    const image = currentView === 'gate' ? '/desert/background/gate.png' : 
                  currentView === 'castle' ? '/desert/background/castle.png' : 
                  '/desert/background/desert.png'
    return image
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
      left: getBackgroundPosition(),
      width: currentView === 'desert' ? '5200px' : '1980px',
      height: '1080px',
      objectFit: 'none',
      objectPosition: 'top left',
      zIndex: 0,
      transition: 'left 0.5s ease-in-out',
      imageRendering: 'crisp-edges', // 使用crisp-edges而不是pixelated
      transform: 'scale(0.8)', // 直接缩放图片到80%
      transformOrigin: 'top left',
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
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
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
    cursor: {
      display: 'inline-block',
      width: '2px',
      height: '18px',
      backgroundColor: '#333',
      marginLeft: '2px',
      verticalAlign: 'middle',
      opacity: showCursor && isTyping ? 1 : 0,
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
      height: '200px',
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
      width: '400px',
      height: '500px',
      backgroundImage: 'url(/desert/icon/photo.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '60px 40px 80px 40px', // 调整内边距以适应相框
    },
    photoBackground: {
      width: '280px',
      height: '200px',
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20px',
      overflow: 'hidden',
    },
    photoObjectImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    photoDescription: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: '280px',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '10px',
      borderRadius: '5px',
    },
    photoCloseButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'rgba(255, 255, 255, 0.8)',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      fontSize: '16px',
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
    mission2Title: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '28px',
      fontWeight: 700,
      color: 'white',
      marginBottom: '30px',
      textAlign: 'center',
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
      marginTop: '20px',
      padding: '20px',
      background: 'linear-gradient(135deg, #4a5568, #2d3748)', // Dark background
      borderRadius: '10px',
    },
    mission2ImageDisplay: {
      width: '100%',
      maxWidth: '300px',
      height: '200px',
      background: 'transparent', // Remove white background
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      border: 'none', // Remove border
    },
    mission2ImageInDialogue: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      borderRadius: '8px', // Add slight rounding to image itself
    },
    mission2StampInDialogue: {
      position: 'absolute',
      bottom: '10px', // Position at bottom
      left: '10px',   // Position at left
      width: '60px',  // Slightly smaller for corner placement
      height: '60px',
      zIndex: 10,
      animation: 'stampAppear 0.6s ease-out', // Add stamp animation
    },
    mission2ButtonsContainer: {
      display: 'flex',
      gap: '15px',
      justifyContent: 'center',
    },
    mission2ButtonInDialogue: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '15px',
      border: '2px solid rgba(255, 255, 255, 0.2)', // Light border for dark theme
      borderRadius: '8px',
      background: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
      cursor: 'pointer',
      transition: 'all 0.2s',
      minWidth: '100px',
    },
    mission2ButtonIconInDialogue: {
      width: '40px',
      height: '40px',
      marginBottom: '8px',
    },
    mission2ButtonTextInDialogue: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 600,
      color: 'white', // White text for dark theme
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
          Exit
        </button>
      )}

      {/* Glitch NPC (always visible) */}
      <div style={styles.glitchNpc} onClick={handleGlitchClick}>
        <img src="/npc/npc1.png" alt="Glitch" style={styles.glitchImage} />
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

          {/* NPCs based on current segment - only show if mission not started */}
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

          {/* Zoom button - always show in SEGMENT_2 */}
          {currentSegment === SEGMENTS.SEGMENT_2 && (
            <button style={styles.zoomButton} onClick={handleZoomClick}>
              <img src="/desert/icon/zoom.png" alt="Zoom" style={styles.zoomImage} />
            </button>
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

          {/* Mission Objects */}
          {missionStarted && desertObjects[currentSegment]?.map(obj => {
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

      {/* Mission Progress Tracker */}
      {missionStarted && currentView === 'desert' && (
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
            style={styles.alpha}
            onClick={handleAlphaClick}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src="/desert/npc/npc4.png" alt="Alpha" style={styles.npcImage} />
          </div>
        </>
      )}

      {/* Regular NPC Dialogue + Mission 2 Interface */}
      {showDialogue && currentDialogue && (
        <div style={currentDialogue.speaker === 'Glitch' ? styles.glitchDialogueContainer : styles.dialogueContainer}>
          <div style={styles.dialogueBox} onClick={currentDialogue.showMission2Interface || currentDialogue.showQuiz || currentDialogue.showNextButton ? undefined : handleDialogueClick}>
            <div style={styles.speaker}>{currentDialogue.speaker}</div>
            <p style={styles.dialogueText}>
              {displayedText}
              <span style={styles.cursor}></span>
            </p>
            
            {/* Mission 2 Interface */}
            {currentDialogue.showMission2Interface && (
              <div style={styles.mission2InterfaceContainer}>
                <div style={styles.mission2ImageDisplay}>
                  <img 
                    src={mission2Images[currentImageIndex].src} 
                    alt={`Mission Image ${currentImageIndex + 1}`}
                    style={styles.mission2ImageInDialogue}
                  />
                  
                  {/* Show stamp if user made a choice for this image */}
                  {mission2Results.find(r => r.imageId === mission2Images[currentImageIndex].id) && (
                    <img 
                      src={mission2Results.find(r => r.imageId === mission2Images[currentImageIndex].id).userChoice === 'confirmed' 
                        ? '/desert/icon/confirmed.png' 
                        : '/desert/icon/rejected.png'
                      }
                      alt="Stamp"
                      style={styles.mission2StampInDialogue}
                    />
                  )}
                </div>

                <div style={styles.mission2ButtonsContainer}>
                  <button 
                    style={styles.mission2ButtonInDialogue}
                    onClick={() => handleMission2Choice('confirmed')}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                      e.target.style.transform = 'scale(1.05)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    <img src="/desert/icon/correct.png" alt="Confirm" style={styles.mission2ButtonIconInDialogue} />
                    <span style={styles.mission2ButtonTextInDialogue}>Confirmed</span>
                  </button>
                  
                  <button 
                    style={styles.mission2ButtonInDialogue}
                    onClick={() => handleMission2Choice('rejected')}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)'
                      e.target.style.transform = 'scale(1.05)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    <img src="/desert/icon/wrong.png" alt="Reject" style={styles.mission2ButtonIconInDialogue} />
                    <span style={styles.mission2ButtonTextInDialogue}>Rejected</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Quiz Interface */}
            {currentDialogue.showQuiz && (
              <div style={styles.finalQuizContainer}>
                <div style={styles.finalQuizOptions}>
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
                </div>
              </div>
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
                  <div style={styles.alphaDialogueMessage}>
                    <strong>{message.speaker}:</strong> {message.text}
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
              <div style={{...styles.alphaDialogueMessage, background: '#e8f5e8', textAlign: 'center', fontWeight: 'bold'}}>
                Mission briefing complete! You can now start collecting data samples.
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
    </div>
  )
}

export default DesertMap