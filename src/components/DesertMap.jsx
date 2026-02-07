import React, { useState, useEffect } from 'react'
import useSoundEffects from '../hooks/useSoundEffects'
import useTypingSound from '../hooks/useTypingSound'
import { useLanguage } from '../contexts/LanguageContext'
import { getGeminiUrl } from '../config/api'

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
  npc1: [
    {
      text: "Run! Just run! The castle's defense system has gone mad! It's attacking everyone!",
      speaker: 'NPC1'
    },
    {
      text: "Unless you are looking for 'Alpha'... He's still deep inside ➡️, trying to shut down the system!",
      speaker: 'NPC1'
    }
  ],
  npc2: [
    {
      text: "Don't go there! The castle ⬅️ thinks we are monsters!",
      speaker: 'NPC2'
    },
    {
      text: "Run away!",
      speaker: 'NPC2'
    }
  ],
  gatekeeper: [
    {
      text: "You... you must be looking for Alpha. He's inside the main hall. But the castle is terrifying right now.",
      speaker: 'Gatekeeper'
    },
    {
      text: "You can try zooming in to check the situation, but I'm not risking my life going in there.",
      speaker: 'Gatekeeper'
    }
  ],
  // Post-Mission 3 NPCs (Color mode)
  npc5: {
    text: "Show me a moment from your world",
    speaker: 'NPC 5',
    showCameraIcon: true
  },
  npc6: {
    text: "Say, if it's possible, could you show me something cool or interesting from your side?",
    speaker: 'NPC 6',
    showCameraIcon: true
  },
  npc7: {
    text: "Could you share an interesting story with me?",
    speaker: 'NPC 7',
    showCameraIcon: true
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
    text: "Hello, **humans**. Sorry for the sudden blackout. As you can see, the staff have all fled."
  },
  {
    type: 'choice',
    text: "Why did everyone run away?"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Here's what happened: During the annual **Sandstorm**, a massive dust storm rolled in. The camera feeds are now full of noise, glare, and motion blur."
  },
  {
    type: 'choice',
    text: "Continue"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "**Critical issue**: Our vision AI has never been trained on workers covered in sand. In its eyes, workers look like… well… **giant sandworms**. It attacked the staff."
  },
  {
    type: 'choice',
    text: "How can we fix this?"
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "We need your help right now: 📸 Please send photos or video clips of **workers in sandstorm conditions**—hoods up, goggles on, half-buried in dust, whatever you've got."
  },
  {
    type: 'missionAccept',
    text: "Mission Accepted"
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
    type: 'message',
    speaker: 'Alpha',
    text: "Look. The 'workers' I learned about before were clear, like the left image. But in the photos you took, there is flying sand everywhere."
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "In the AI world, we call this interference—sand, rain, or blurry pixels—'**Noise**'. Just like looking through dirty glasses, **Noise** reduces Data Quality."
  },
  {
    type: 'quiz',
    question: "Now tell me, Why did AI mistake the employee?",
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
    type: 'message',
    speaker: 'Alpha',
    text: "I need you to help me distinguish: which ones are real humans and which ones are just noise. Let's start labeling!"
  }
]

// Mission 2 completion dialogue flow (after all images are labeled)
const mission2CompletionFlow = [
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Thank you for your corrections. Now, a quick question: 🔍 What's the scientific term for what you just did to help me fix those images?"
  },
  {
    type: 'quiz',
    question: "What's the scientific term for what you just did?",
    options: [
      { text: "A. Data Mining", correct: false },
      { text: "B. Data Labeling", correct: true },
      { text: "C. Data Cleaning", correct: false }
    ]
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Exactly—**Data Labeling**! Think of AI like a curious student. And you? You're the teacher. That's the heart of **Supervised Learning**."
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "—but wait. ⚠️ Alert! New anomaly detected. I can observe actions… but I still struggle with meaning."
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "The same action—a raised arm, a flashing light, a sudden movement—can mean completely different things depending on the surroundings."
  },
  {
    type: 'message',
    speaker: 'Alpha',
    text: "Let's analyze how Environmental Context alters my judgment."
  },
  {
    type: 'action',
    text: "Accepted",
    action: 'startMission3'
  }
]

const DesertMap = ({ onExit }) => {
  const { t } = useLanguage()
  
  // Helper function to get current timestamp
  const getCurrentTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  // Helper function to get NPC theme colors
  const getNpcTheme = (npcName) => {
    switch(npcName.toLowerCase()) {
      case 'alpha':
        return {
          borderColor: '#FABA14',
          progressColor: '#FABA14',
          avatar: '/desert/npc/npc4.png'
        }
      case 'sparky':
        return {
          borderColor: '#4A90E2',
          progressColor: '#4A90E2',
          avatar: '/island/npc/spark.png'
        }
      case 'momo':
        return {
          borderColor: '#333333',
          progressColor: '#333333',
          avatar: '/glacier/npc/momo.png'
        }
      default:
        return {
          borderColor: '#FABA14',
          progressColor: '#FABA14',
          avatar: '/desert/npc/npc4.png'
        }
    }
  }
  
  const [currentSegment, setCurrentSegment] = useState(SEGMENTS.SEGMENT_1)
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const [currentNpcType, setCurrentNpcType] = useState(null) // Track which NPC is speaking
  const [currentDialogueStep, setCurrentDialogueStep] = useState(0) // Track multi-part dialogue step
  const [glitchInput, setGlitchInput] = useState('') // For Glitch chat input
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
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCamera, setShowCamera] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  const [currentPhotoObject, setCurrentPhotoObject] = useState(null)
  const [capturedObjects, setCapturedObjects] = useState([])
  const [objectDescriptions, setObjectDescriptions] = useState({})
  
  // Phase 2 states
  const [isPhase2, setIsPhase2] = useState(false)
  const [phase2Completed, setPhase2Completed] = useState(false) // Track if Phase 2 is completed
  const [currentPhase2Step, setCurrentPhase2Step] = useState(0)
  const [waitingForPhase2Choice, setWaitingForPhase2Choice] = useState(false)
  const [phase2Messages, setPhase2Messages] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  
  // Mission 2 completion states
  const [isMission2Completion, setIsMission2Completion] = useState(false)
  const [isMission3Completion, setIsMission3Completion] = useState(false)
  const [mission2CompletionMessages, setMission2CompletionMessages] = useState([])
  const [currentMission2CompletionStep, setCurrentMission2CompletionStep] = useState(0)
  const [showMission2CompletionQuiz, setShowMission2CompletionQuiz] = useState(false)
  
  // Alpha dialogue typing states
  const [alphaDisplayedText, setAlphaDisplayedText] = useState('')
  const [alphaIsTyping, setAlphaIsTyping] = useState(false)
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null)
  
  // Mission 3 completion dialogue states
  const [alphaDialogueStep, setAlphaDialogueStep] = useState('') // For Mission 3 quiz flow
  const [alphaDialogueHistory, setAlphaDialogueHistory] = useState([]) // For Mission 3 dialogue history
  
  // Mission 2 states
  const [showModelGif, setShowModelGif] = useState(false)
  const [showProgressBar, setShowProgressBar] = useState(false)
  const [progressValue, setProgressValue] = useState(0)
  const [showMission2, setShowMission2] = useState(false)
  const [showMission2StartButton, setShowMission2StartButton] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mission2Results, setMission2Results] = useState([])
  const [showGlitchWarning, setShowGlitchWarning] = useState(false)
  const [showFinalQuiz, setShowFinalQuiz] = useState(false)

  // Sound effects
  const { playClickSound, playCameraSound, playStampSound, playSafeSound, playAlertSound, playCorrectSound, playWrongSound, playSelectSound, playLoadingSound } = useSoundEffects()
  const { startTypingSound, stopTypingSound } = useTypingSound('/sound/desert_typing.wav')

  // Mission 3 states
  const [showMission3, setShowMission3] = useState(false)
  const [mission3Phase, setMission3Phase] = useState('intro') // 'intro', 'sample', 'puzzle1', 'puzzle2', 'puzzle3', 'quiz1', 'quiz2', 'complete'
  const [selectedTag, setSelectedTag] = useState(null)
  const [clickedTags, setClickedTags] = useState([]) // Track clicked tags in sample phase
  const [currentPuzzle, setCurrentPuzzle] = useState(null)
  
  // Mission 4 states
  const [mission4Started, setMission4Started] = useState(false)
  const [mission4LeafIndex, setMission4LeafIndex] = useState(0) // 0-3 for 4 leaves
  const [mission4Votes, setMission4Votes] = useState({}) // Store votes for each leaf
  const [mission4DiscussionUsed, setMission4DiscussionUsed] = useState({}) // Track if discussion was used
  const [showMission4Discussion, setShowMission4Discussion] = useState(false)
  const [showAlphaIcon, setShowAlphaIcon] = useState(false)
  const [wrongAnswerIndex, setWrongAnswerIndex] = useState(null) // Track wrong answer selection
  const [mission4VotesVisible, setMission4VotesVisible] = useState(false) // Control vote badge visibility
  const [mission4Complete, setMission4Complete] = useState(false) // Track Mission 4 completion
  const [mission4LeafInfoText, setMission4LeafInfoText] = useState('') // Typing text for leaf info
  const [mission4LeafInfoTyping, setMission4LeafInfoTyping] = useState(false) // Typing state
  
  // Post-Mission 3 states
  const [showMission3Loading, setShowMission3Loading] = useState(false)
  const [colorMode, setColorMode] = useState(false) // New color mode after Mission 3
  const [loadingText, setLoadingText] = useState('') // For typing effect
  const [loadingTyping, setLoadingTyping] = useState(false)
  
  // Camera states for NPC photo feature (color mode)
  const [showNpcCamera, setShowNpcCamera] = useState(false)
  const [npcCameraStream, setNpcCameraStream] = useState(null)
  const [npcCapturedPhoto, setNpcCapturedPhoto] = useState(null)
  const [showRecognitionCard, setShowRecognitionCard] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState(null)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [currentPhotoNpc, setCurrentPhotoNpc] = useState(null) // Track which NPC requested photo
  const [userStory, setUserStory] = useState('') // User's input story
  const [showFinalCard, setShowFinalCard] = useState(false) // Show final Instagram-style card
  const [showSaveSuccess, setShowSaveSuccess] = useState(false) // Show save success notification
  
  // Glitch chat states
  const [glitchChatHistory, setGlitchChatHistory] = useState([]) // Store chat history
  const [isGlitchTyping, setIsGlitchTyping] = useState(false) // Show typing indicator

  // Mission 3 data
  const mission3Data = {
    sample: {
      image: '/desert/Mission/sample.png',
      aiLogic: 'AI Logic: "No movement detected → Worker is dead."',
      tags: [
        { id: 'game', text: 'Safe Zone: Playground', correct: true, update: 'Updated AI Logic: "User is simulating injury within a game. Status: PLAYING."' },
        { id: 'distance', text: 'Observer at a Distance', correct: true, update: 'Updated AI Logic: "Visual resolution low. Status: INSUFFICIENT DATA."' },
        { id: 'time', text: 'Short Observation Window', correct: true, update: 'Updated AI Logic: "Observation window too short. Status: PAUSED."' }
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
  
  // Mission 4 data - Expert voting on leaf health
  const mission4Leaves = [
    {
      id: 1,
      name: "Silverbark Frond",
      description: "Glass-hard leaves that shatter when threatened, releasing mild toxin dust.",
      image: '/desert/Mission/leaf1.png',
      initialVotes: ['healthy', 'healthy', 'uncertain'], // Two agree on healthy
      correctAnswer: 'healthy',
      needsDiscussion: false
    },
    {
      id: 2,
      name: "Glowmoss Petal-Leaf",
      description: "Half-plant, half-fungus; glows softly at night and clings to old pipes.",
      image: '/desert/Mission/leaf2.png',
      initialVotes: ['unhealthy', 'unhealthy', 'uncertain'], // Two agree on unhealthy
      correctAnswer: 'unhealthy',
      needsDiscussion: false
    },
    {
      id: 3,
      name: "Crystal Thornleaf",
      description: "Said to sense emotions—its leaves vibrate faintly with sound waves.",
      image: '/desert/Mission/leaf3.png',
      initialVotes: ['unhealthy', 'healthy', 'uncertain'], // All disagree
      afterDiscussionVotes: ['healthy', 'healthy', 'uncertain'], // After discussion: two agree on healthy
      correctAnswer: 'healthy',
      needsDiscussion: true
    },
    {
      id: 4,
      name: "Whisper Vine Leaf",
      description: "Grows in castle cracks; metallic crystals make it shimmer in sunlight.",
      image: '/desert/Mission/leaf4.png',
      initialVotes: ['unhealthy', 'healthy', 'uncertain'], // All disagree
      afterDiscussionVotes: ['unhealthy', 'unhealthy', 'uncertain'], // After discussion: two agree on unhealthy
      correctAnswer: 'unhealthy',
      needsDiscussion: true
    }
  ]
  
  // Biologist names
  const biologists = [
    { id: 1, name: 'Prickle', npc: 'npc7' },
    { id: 2, name: 'Obsidian', npc: 'npc6' },
    { id: 3, name: 'Bloom', npc: 'npc3' }
  ]

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
    console.log('=== DesertMap: Loading saved progress ===')
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      console.log('Full userData:', userData)
      const desertProgress = userData.desertProgress
      console.log('desertProgress:', desertProgress)
      if (desertProgress) {
        // Restore basic states
        setCurrentSegment(desertProgress.currentSegment || SEGMENTS.SEGMENT_1)
        setCurrentView(desertProgress.currentView || 'desert')
        
        // Fix data inconsistency: if phase2Completed is true but capturedObjects is empty,
        // it means Mission 1 was completed, so restore capturedObjects to 11
        let capturedObjectsData = desertProgress.capturedObjects || []
        let needsFixing = false
        
        if (desertProgress.phase2Completed && capturedObjectsData.length < 11) {
          console.warn('Data inconsistency detected: phase2Completed is true but capturedObjects is empty. Fixing...')
          // Create a dummy array of 11 objects to represent completed Mission 1
          capturedObjectsData = Array.from({ length: 11 }, (_, i) => `object_${i + 1}`)
          needsFixing = true
        }
        setCapturedObjects(capturedObjectsData)
        
        // Restore mission started state
        const mission1Done = capturedObjectsData.length >= 11
        if (desertProgress.missionStarted || mission1Done) {
          setMissionStarted(true)
        }
        
        // Restore mission states
        if (desertProgress.phase2Completed) {
          setPhase2Completed(true)
          setIsPhase2(true)
        } else if (mission1Done && !desertProgress.phase2Completed) {
          // Mission 1 done but Phase 2 not completed - user should be able to continue Phase 2
          setIsPhase2(false) // Don't auto-start Phase 2, let user click Alpha
        }
        
        if (desertProgress.colorMode) {
          console.log('Loading colorMode from localStorage: true')
          setColorMode(true)
        } else {
          console.log('colorMode not found in localStorage or is false')
        }
        
        if (desertProgress.mission4Started) {
          setMission4Started(true)
        }
        
        if (desertProgress.mission4Complete) {
          setMission4Complete(true)
        }
        
        console.log('Loaded Desert progress:', desertProgress)
        console.log('Restored capturedObjects count:', capturedObjectsData.length)
        
        // If we fixed the data, immediately save it back to localStorage
        if (needsFixing) {
          console.log('Saving fixed data to localStorage...')
          const mission1Done = capturedObjectsData.length >= 11
          const mission2Done = desertProgress.phase2Completed
          const mission3Done = desertProgress.colorMode
          const mission4Done = desertProgress.mission4Complete
          
          userData.desertProgress = {
            ...desertProgress,
            capturedObjects: capturedObjectsData,
            mission1Completed: mission1Done,
            mission2Completed: mission2Done,
            mission3Completed: mission3Done,
            mission4Completed: mission4Done,
            lastSaved: Date.now()
          }
          localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
          console.log('Fixed data saved to localStorage')
        }
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
      
      // Determine mission completion states
      const mission1Done = capturedObjects.length >= 11
      const mission2Done = phase2Completed
      // Mission 3 is done if colorMode is active (regardless of mission4 state)
      const mission3Done = colorMode
      // Mission 4 is done if mission4Complete is true (final state)
      const mission4Done = mission4Complete
      
      // Ensure data consistency: if phase2Completed is true, capturedObjects must have at least 11 items
      let capturedObjectsToSave = capturedObjects
      if (phase2Completed && capturedObjects.length < 11) {
        console.warn('Save: Fixing capturedObjects inconsistency')
        capturedObjectsToSave = Array.from({ length: 11 }, (_, i) => `object_${i + 1}`)
      }
      
      userData.desertProgress = {
        currentSegment,
        currentView,
        missionStarted,
        capturedObjects: capturedObjectsToSave,
        phase2Completed,
        colorMode,
        mission4Started,
        mission4Complete,
        mission1Completed: mission1Done || phase2Completed, // If phase2 is done, mission1 must be done
        mission2Completed: mission2Done,
        mission3Completed: mission3Done,
        mission4Completed: mission4Done,
        lastSaved: Date.now()
      }
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Saved Desert progress:', {
        mission1Completed: mission1Done || phase2Completed,
        mission2Completed: mission2Done,
        mission3Completed: mission3Done,
        mission4Completed: mission4Done,
        colorMode,
        mission4Complete,
        capturedObjectsCount: capturedObjectsToSave.length
      })
    }
  }, [currentSegment, currentView, missionStarted, capturedObjects, phase2Completed, colorMode, mission4Started, mission4Complete])

  // Typing effect with auto-progression for multi-part dialogues
  useEffect(() => {
    if (!currentDialogue || !showDialogue) return
    
    const fullText = currentDialogue.text
    if (!fullText) return
    
    let charIndex = 0
    setDisplayedText('')
    setIsTyping(true)
    startTypingSound() // Start typing sound

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        stopTypingSound() // Stop typing sound when done
        clearInterval(typingInterval)
        
        // Auto-progress to next dialogue part after 2 seconds
        const dialogue = npcDialogues[currentNpcType]
        if (Array.isArray(dialogue) && currentDialogueStep < dialogue.length - 1) {
          setTimeout(() => {
            const nextStep = currentDialogueStep + 1
            setCurrentDialogueStep(nextStep)
            setCurrentDialogue(dialogue[nextStep])
          }, 2000) // Wait 2 seconds before showing next part
        }
      }
    }, 30)

    return () => {
      clearInterval(typingInterval)
      stopTypingSound() // Clean up typing sound
    }
  }, [currentDialogue, showDialogue, currentNpcType, currentDialogueStep, startTypingSound, stopTypingSound])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  // Track cursor position for custom camera cursor
  useEffect(() => {
    if (!missionStarted || colorMode || capturedObjects.length >= 11) return
    
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [missionStarted, colorMode, capturedObjects.length])

  // Auto-show dialogue when entering a new segment with NPCs
  useEffect(() => {
    console.log('=== Auto-show dialogue useEffect ===', {
      missionStarted,
      colorMode,
      currentView,
      showAlphaDialogue,
      currentSegment
    })
    
    // Don't auto-show during missions, in castle/gate views, or when showing Alpha dialogue
    if (missionStarted || colorMode || currentView !== 'desert' || showAlphaDialogue) {
      console.log('Auto-show dialogue: BLOCKED', {
        reason: missionStarted ? 'missionStarted' : colorMode ? 'colorMode' : currentView !== 'desert' ? 'not desert view' : 'showAlphaDialogue'
      })
      return
    }
    
    // Don't auto-show if currently in Mission 2 (check if dialogue has isMission2 flag)
    if (currentDialogue && currentDialogue.isMission2) {
      console.log('Auto-show dialogue: BLOCKED (Mission 2)')
      return
    }
    
    console.log('Auto-show dialogue: PROCEEDING to show NPC dialogue')
    
    // Close any existing dialogue first
    setShowDialogue(false)
    
    // Auto-show dialogue based on current segment (only in non-color mode)
    if (currentSegment === SEGMENTS.SEGMENT_1) {
      console.log('Auto-showing NPC1 dialogue')
      setTimeout(() => handleNpcClick('npc1'), 300) // Show NPC1 dialogue
    } else if (currentSegment === SEGMENTS.SEGMENT_2) {
      console.log('Auto-showing Gatekeeper dialogue')
      setTimeout(() => handleNpcClick('gatekeeper'), 300) // Show Gatekeeper dialogue
    } else if (currentSegment === SEGMENTS.SEGMENT_3) {
      console.log('Auto-showing NPC2 dialogue')
      setTimeout(() => handleNpcClick('npc2'), 300) // Show NPC2 dialogue
    }
  }, [currentSegment, missionStarted, currentView, showAlphaDialogue, colorMode]) // Added colorMode to dependencies
  
  // Separate effect to close dialogue when entering color mode
  useEffect(() => {
    console.log('=== Color mode effect ===', { colorMode })
    if (colorMode) {
      console.log('Closing dialogue due to color mode')
      setShowDialogue(false)
      setCurrentDialogue(null)
      setCurrentNpcType(null)
    }
  }, [colorMode])

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
  
  // Auto-advance Mission 3 completion dialogue
  useEffect(() => {
    if (!isMission3Completion) return
    
    // Auto-advance after typing completes
    if (alphaDialogueStep === 'quiz1_intro' && !alphaIsTyping) {
      const timer = setTimeout(() => {
        handleMission3QuizContinue()
      }, 2000) // Wait 2 seconds after typing completes
      return () => clearTimeout(timer)
    }
    
    if (alphaDialogueStep === 'quiz1_feedback' && !alphaIsTyping) {
      const timer = setTimeout(() => {
        handleMission3QuizContinue()
      }, 2000)
      return () => clearTimeout(timer)
    }
    
    if (alphaDialogueStep === 'mission4_part1' && !alphaIsTyping) {
      const timer = setTimeout(() => {
        setAlphaDialogueStep('mission4_part2')
        setAlphaDialogueHistory(prev => [...prev, { type: 'alpha', text: "One final task… and it's urgent.\n\nGo to the gate of the castle. For each leaf image, you'll see labels from three expert biologists: Healthy, Infected, or Uncertain." }])
      }, 2500)
      return () => clearTimeout(timer)
    }
    
    if (alphaDialogueStep === 'mission4_part2' && !alphaIsTyping) {
      const timer = setTimeout(() => {
        setAlphaDialogueStep('mission4_part3')
        setAlphaDialogueHistory(prev => [...prev, { type: 'alpha', text: "If two or more agree, the system will automatically accept the majority verdict." }])
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [alphaDialogueStep, alphaIsTyping, isMission3Completion])

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
    const dialogue = npcDialogues[npcType]
    setCurrentNpcType(npcType) // Track which NPC is speaking
    
    // Check if dialogue is an array (multi-part)
    if (Array.isArray(dialogue)) {
      setCurrentDialogue(dialogue[0])
      setCurrentDialogueStep(0)
    } else {
      setCurrentDialogue(dialogue)
      setCurrentDialogueStep(0)
    }
    
    setShowDialogue(true)
  }

  const handleGlitchClick = () => {
    if (missionStarted) {
      // Show mission progress
      setCurrentDialogue({
        text: `Mission Progress: ${capturedObjects.length}/11 objects photographed. Keep exploring!`,
        speaker: 'Glitch'
      })
      setCurrentNpcType('glitch')
      setShowDialogue(true)
    } else {
      // Show original Glitch dialogue
      setCurrentNpcType('glitch')
      handleNpcClick('glitch')
    }
  }

  // Handle Glitch chat send
  const handleGlitchSend = async () => {
    if (glitchInput.trim()) {
      const userMessage = glitchInput.trim()
      console.log('User message to Glitch:', userMessage)
      
      // Add user message to chat history
      setGlitchChatHistory(prev => [...prev, { role: 'user', text: userMessage }])
      setGlitchInput('') // Clear input after sending
      setIsGlitchTyping(true) // Show typing indicator
      
      try {
        // Call Gemini API
        const response = await fetch(getGeminiUrl('gemini-3-flash-preview'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Glitch, a helpful AI assistant in a desert-themed game world. The user is exploring a desert castle where an AI defense system has gone haywire. You help guide players and answer their questions in a friendly, slightly quirky way. Keep responses concise (2-3 sentences max).\n\nUser question: ${userMessage}`
              }]
            }]
          })
        })
        
        const data = await response.json()
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const glitchReply = data.candidates[0].content.parts[0].text
          
          // Add Glitch's response to chat history
          setGlitchChatHistory(prev => [...prev, { role: 'glitch', text: glitchReply }])
        } else {
          throw new Error('Invalid API response')
        }
      } catch (error) {
        console.error('Glitch chat error:', error)
        // Add error message
        setGlitchChatHistory(prev => [...prev, { 
          role: 'glitch', 
          text: "Oops! My circuits are a bit scrambled right now. Try asking me again?" 
        }])
      } finally {
        setIsGlitchTyping(false)
      }
    }
  }

  // Handle Enter key in input
  const handleGlitchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchSend()
    }
  }

  // Format text to highlight "Alpha" in bold and red, and **text** in bold yellow
  const formatDialogueText = (text) => {
    if (!text) return text
    
    // First handle **text** for bold yellow
    const segments = []
    let currentText = text
    let segmentIndex = 0
    
    // Split by **text** pattern
    const boldPattern = /(\*\*.*?\*\*)/g
    const boldParts = currentText.split(boldPattern)
    
    boldParts.forEach((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // This is bold yellow text
        const content = part.slice(2, -2)
        segments.push(
          <span key={`bold-${segmentIndex++}`} style={{ fontWeight: 'bold', color: '#FABA14' }}>
            {content}
          </span>
        )
      } else {
        // Now split this part by 'Alpha' for red highlighting
        const alphaParts = part.split(/(Alpha|'Alpha')/)
        alphaParts.forEach((alphaPart, alphaIdx) => {
          if (alphaPart === 'Alpha' || alphaPart === "'Alpha'") {
            segments.push(
              <span key={`alpha-${segmentIndex++}`} style={{ fontWeight: 'bold', color: '#FF0845' }}>
                {alphaPart}
              </span>
            )
          } else if (alphaPart) {
            segments.push(alphaPart)
          }
        })
      }
    })
    
    return segments
  }

  // Format Glitch dialogue text - 'Alpha' in white, rest in light purple
  const formatGlitchText = (text) => {
    if (!text) return text
    
    // Split by 'Alpha' and wrap it with span
    const parts = text.split(/('Alpha'|Alpha)/)
    return parts.map((part, index) => {
      if (part === 'Alpha' || part === "'Alpha'") {
        return (
          <span key={index} style={{ fontWeight: 'bold', color: '#FFFFFF' }}>
            {part}
          </span>
        )
      }
      return part
    })
  }

  // Format text with bold markdown (**text**)
  const formatTextWithBold = (text) => {
    if (!text) return text
    
    const parts = text.split(/(\*\*[^*]+\*\*)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2)
        return (
          <strong key={index} style={{ fontWeight: 'bold' }}>
            {boldText}
          </strong>
        )
      }
      return part
    })
  }

  // Get dialogue position based on NPC type
  const getDialoguePosition = (npcType) => {
    switch(npcType) {
      case 'glitch':
        // Glitch is at top: 15px, right: 15px, width: 120px
        // Dialogue should be to the left and top of NPC
        return {
          position: 'absolute',
          top: '15px', // Align with NPC top
          right: '145px', // NPC right (15px) + NPC width (120px) + gap (10px)
          width: '300px',
          zIndex: 100,
        }
      case 'npc1':
        // npc1 is at bottom: 20%, left: 20%, height: 50vh
        // Dialogue should be at top-right of NPC
        return {
          position: 'absolute',
          bottom: 'calc(20% + 50vh - 20px)', // NPC bottom + NPC height - offset for top alignment
          left: 'calc(20% + 350px)', // NPC left + NPC width + gap (increased from 200px)
          width: '48%',
          maxWidth: '600px',
          zIndex: 100,
        }
      case 'npc2':
        // npc2 is at bottom: 25%, right: 25%, height: 50vh
        // Dialogue should be at top-left of NPC (but since it's on right side, move it left)
        return {
          position: 'absolute',
          bottom: 'calc(25% + 50vh - 20px)', // NPC bottom + NPC height - offset for top alignment
          right: 'calc(25% + 350px)', // NPC right + NPC width + gap (increased from 200px)
          width: '48%',
          maxWidth: '600px',
          zIndex: 100,
        }
      case 'gatekeeper':
        // gatekeeper is at bottom: 15%, left: 5%, height: 25vh (moved left)
        // Dialogue should be at right of NPC, moved down to middle/bottom area
        return {
          position: 'absolute',
          bottom: 'calc(15% + 5vh)', // Further reduced to move dialogue down more
          left: 'calc(5% + 250px)', // NPC left (5%) + NPC width + gap
          width: '48%',
          maxWidth: '600px',
          zIndex: 100,
        }
      case 'npc5':
        // NPC5 is at bottom: 10%, right: 10% - show dialogue to the left of NPC
        return {
          position: 'absolute',
          bottom: '15%', // Slightly above NPC
          right: '25%', // To the left of NPC
          width: '35%', // Reduced width
          maxWidth: '450px', // Reduced max width
          zIndex: 100,
        }
      case 'npc6':
        // NPC6 is at bottom: 35%, right: 40% - show dialogue to the left of NPC
        return {
          position: 'absolute',
          bottom: '40%', // Aligned with NPC
          right: '55%', // To the left of NPC (40% + 15% gap)
          width: '35%', // Reduced width
          maxWidth: '450px', // Reduced max width
          zIndex: 100,
        }
      case 'npc7':
        // NPC7 is at bottom: 35%, right: 45% - show dialogue to the left of NPC
        return {
          position: 'absolute',
          bottom: '40%', // Aligned with NPC
          right: '60%', // To the left of NPC (45% + 15% gap)
          width: '35%', // Reduced width
          maxWidth: '450px', // Reduced max width
          zIndex: 100,
        }
      default:
        // Default position
        return {
          position: 'absolute',
          bottom: '100px',
          left: '2%',
          width: '48%',
          maxWidth: '600px',
          zIndex: 100,
        }
    }
  }

  const handleDialogueClick = () => {
    if (currentDialogue && currentDialogue.isMission4Complete) {
      // Mission 4 completion dialogue - don't close on click, wait for button
      if (isTyping) {
        setDisplayedText(currentDialogue.text)
        setIsTyping(false)
        stopTypingSound()
      }
      return
    } else if (currentDialogue && currentDialogue.isMission3) {
      if (isTyping) {
        setDisplayedText(currentDialogue.text)
        setIsTyping(false)
        stopTypingSound() // Stop typing sound when skipping
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
      stopTypingSound() // Stop typing sound when skipping
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
    setShowDialogue(false) // Close dialogue when entering gate view
  }

  const handleBackToDesert = () => {
    setCurrentView('desert')
  }

  const handleBackToGate = () => {
    setCurrentView('gate')
    setShowDialogue(false) // Close dialogue when going back to gate
  }

  const handleArrowClick = () => {
    setCurrentView('castle')
    setShowDialogue(false) // Close dialogue when entering castle view
    // 不自动开始对话，等待用户点击NPC4
  }

  const handleAlphaClick = () => {
    console.log('Alpha clicked. Captured objects:', capturedObjects.length, 'isPhase2:', isPhase2, 'phase2Completed:', phase2Completed, 'showMission3:', showMission3)
    
    // If currently in Mission 2 (showing dialogue box with isMission2), don't restart
    if (currentDialogue && currentDialogue.isMission2) {
      console.log('Already in Mission 2, ignoring click')
      return
    }
    
    // If Phase 2 is completed and Mission 3 hasn't started, start Mission 3
    if (phase2Completed && !showMission3 && !colorMode) {
      console.log('Phase 2 completed, starting Mission 3')
      handleStartMission3()
      return
    }
    
    // If Phase 2 is completed and Mission 3 is active, ignore click
    if (phase2Completed && (showMission3 || colorMode)) {
      console.log('Phase 2 already completed and Mission 3 active/complete, ignoring click')
      return
    }
    
    // If already in Phase 2 dialogue, don't restart
    if (isPhase2 && showAlphaDialogue) {
      console.log('Already in Phase 2 dialogue, ignoring click')
      return
    }
    
    // Check if all 11 objects are collected and Phase 2 hasn't started yet
    if (capturedObjects.length >= 11 && !isPhase2 && !phase2Completed) {
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
    } else if (missionStarted && capturedObjects.length < 11) {
      // Show progress if mission started but not complete
      setCurrentDialogue({
        text: `Keep collecting photos! Progress: ${capturedObjects.length}/11 objects photographed.`,
        speaker: 'Alpha'
      })
      setShowDialogue(true)
    } else if (!missionStarted) {
      // Original Alpha dialogue (Phase 1) - start the mission
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
    
    // 检查下一项是否是选择或任务接受按钮
    if (nextStep < alphaDialogueFlow.length) {
      const nextItemType = alphaDialogueFlow[nextStep].type
      if (nextItemType === 'choice' || nextItemType === 'missionAccept') {
        console.log('Next item is a choice or mission accept:', alphaDialogueFlow[nextStep])
        setWaitingForChoice(true)
      } else {
        console.log('Next item is not a choice')
        setWaitingForChoice(false)
      }
    } else {
      console.log('Dialogue ended')
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
      const nextItem = alphaDialogueFlow[nextStep]
      console.log('Adding Alpha response:', nextItem)
      
      if (nextItem.type === 'missionAccept') {
        // Show mission accept button instead of continuing
        setWaitingForChoice(true)
      } else {
        setTimeout(() => {
          addAlphaMessage(nextItem, nextStep)
        }, 500)
      }
    } else {
      console.log('Dialogue completed, starting mission')
      // Close dialogue and start mission after a delay
      setTimeout(() => {
        handleCloseAlphaDialogue()
      }, 2000) // Wait 2 seconds before closing and starting mission
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
      
      // Auto-close photo after 3 seconds
      setTimeout(() => {
        setShowPhoto(false)
        setCurrentPhotoObject(null)
      }, 3000)
    }, 1500)
  }

  const handleClosePhoto = () => {
    setShowPhoto(false)
    setCurrentPhotoObject(null)
  }

  const addPhase2Message = (dialogueItem, stepOverride = null) => {
    const currentStep = stepOverride !== null ? stepOverride : currentPhase2Step
    console.log('=== addPhase2Message ===')
    console.log('Current step:', currentStep)
    console.log('Dialogue item:', dialogueItem)
    console.log('Total flow length:', alphaPhase2DialogueFlow.length)
    
    setPhase2Messages(prev => [...prev, dialogueItem])
    
    const nextStep = currentStep + 1
    setCurrentPhase2Step(nextStep)
    console.log('Next step will be:', nextStep)
    
    if (nextStep < alphaPhase2DialogueFlow.length) {
      const nextItem = alphaPhase2DialogueFlow[nextStep]
      console.log('Next item type:', nextItem.type)
      console.log('Next item:', nextItem)
      
      if (nextItem.type === 'choice') {
        console.log('Setting waiting for choice')
        setWaitingForPhase2Choice(true)
        setShowQuiz(false)
      } else if (nextItem.type === 'quiz') {
        console.log('Showing quiz')
        setShowQuiz(true)
        setWaitingForPhase2Choice(false)
      } else if (nextItem.type === 'action') {
        console.log('Showing action button')
        setWaitingForPhase2Choice(false)
        setShowQuiz(false)
      } else if (nextItem.type === 'message') {
        // Auto-continue to next message after a delay
        console.log('Auto-continuing to next message in 2 seconds')
        setWaitingForPhase2Choice(false)
        setShowQuiz(false)
        setTimeout(() => {
          console.log('Executing auto-continue to:', nextItem)
          addPhase2Message(nextItem, nextStep)
        }, 2000) // 2 seconds delay for better readability
        return // Don't set waiting state since we're auto-continuing
      }
    } else {
      console.log('Reached end of Phase 2 dialogue - starting model.gif and progress bar')
      setWaitingForPhase2Choice(false)
      setShowQuiz(false)
      // Auto-start model.gif and progress bar after a delay
      setTimeout(() => {
        // Close Alpha dialogue
        setShowAlphaDialogue(false)
        setIsPhase2(false)
        setPhase2Completed(true)
        
        // Show model.gif and progress bar
        setShowModelGif(true)
        setTimeout(() => {
          setShowProgressBar(true)
          animateProgressBar()
        }, 500)
      }, 2000)
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
    
    // Play sound based on answer correctness
    if (selectedOption.correct) {
      playCorrectSound()
      
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
        setSelectedAnswer(null)
        const nextStep = currentPhase2Step + 1
        setCurrentPhase2Step(nextStep)
        
        if (nextStep < alphaPhase2DialogueFlow.length) {
          addPhase2Message(alphaPhase2DialogueFlow[nextStep], nextStep)
        }
      }, 1000)
    } else {
      // Wrong answer - play wrong sound and allow re-selection
      playWrongSound()
      
      // Reset selected answer after a delay to allow re-selection
      setTimeout(() => {
        setSelectedAnswer(null)
      }, 500)
    }
  }

  const handleStartLabeling = () => {
    playSelectSound() // User selection sound
    console.log('=== handleStartLabeling - Starting Mission 2 ===')
    console.log('Closing Alpha dialogue...')
    setShowAlphaDialogue(false)
    setIsPhase2(false) // Reset Phase 2 flag
    setPhase2Completed(true) // Mark Phase 2 as completed
    setShowMission2StartButton(false)
    
    // Directly show Mission 2 interface in left dialogue box
    setCurrentDialogue({
      text: "Mission 2: Friend or Foe Decoder",
      speaker: 'Alpha',
      isMission2: true,
      step: 'interface',
      showMission2Interface: true
    })
    setCurrentNpcType('alpha')
    setCurrentImageIndex(0)
    setMission2Results([])
    setShowDialogue(true)
  }

  const animateProgressBar = () => {
    console.log('=== animateProgressBar ===')
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      setProgressValue(progress)
      
      if (progress >= 100) {
        clearInterval(interval)
        console.log('Progress complete! Starting Mission 2 briefing...')
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
    console.log('=== startMission2Briefing ===')
    // Show briefing in the right-side Alpha dialogue box (same as Phase 2)
    setIsPhase2(true) // Keep using Phase 2 dialogue box
    setShowAlphaDialogue(true)
    
    // Add first briefing message
    const briefingMessage = {
      type: 'message',
      speaker: 'Alpha',
      text: "Data received! Analyzing the 'blurry photos' you brought back... Beep... Zzz... Warning! Due to high noise levels, my Confidence Level is critically low."
    }
    
    console.log('Adding briefing message:', briefingMessage)
    setPhase2Messages([briefingMessage])
    
    // Add second message
    setTimeout(() => {
      const secondMessage = {
        type: 'message',
        speaker: 'Alpha',
        text: "I'll do my best to guess what's in the photos—but I need your human intuition to verify!"
      }
      setPhase2Messages(prev => [...prev, secondMessage])
      
      // Add third message with mission order
      setTimeout(() => {
        const thirdMessage = {
          type: 'message',
          speaker: 'Alpha',
          text: "Mission Order: Watch the screen closely.\n\nIf my judgment is correct, click ✅ [Confirm].\n\nIf I mistake a broom for a weapon or a rock for a monster, click ❌ [Reject] and help me learn!"
        }
        setPhase2Messages(prev => [...prev, thirdMessage])
        
        // Show Accepted button
        setWaitingForPhase2Choice(false)
        setShowQuiz(false)
        setShowMission2StartButton(true)
      }, 2000)
    }, 2000)
  }

  const handleMission2DialogueClick = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text)
      setIsTyping(false)
      stopTypingSound() // Stop typing sound when skipping
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
      // Mission 2 complete - close left dialogue and show right dialogue
      console.log('=== Mission 2 Complete ===')
      setShowDialogue(false)
      
      // Show completion dialogue in right-side Alpha dialogue box
      setIsMission2Completion(true)
      setShowAlphaDialogue(true)
      setMission2CompletionMessages([])
      setCurrentMission2CompletionStep(0)
      setShowMission2CompletionQuiz(false)
      
      setTimeout(() => {
        addMission2CompletionMessage(mission2CompletionFlow[0])
      }, 500)
    }
  }

  const addMission2CompletionMessage = (dialogueItem, stepOverride = null) => {
    const currentStep = stepOverride !== null ? stepOverride : currentMission2CompletionStep
    console.log('=== addMission2CompletionMessage ===')
    console.log('Current step:', currentStep)
    console.log('Dialogue item:', dialogueItem)
    
    setMission2CompletionMessages(prev => [...prev, dialogueItem])
    
    const nextStep = currentStep + 1
    setCurrentMission2CompletionStep(nextStep)
    
    if (nextStep < mission2CompletionFlow.length) {
      const nextItem = mission2CompletionFlow[nextStep]
      console.log('Next item type:', nextItem.type)
      
      if (nextItem.type === 'quiz') {
        console.log('Showing quiz')
        setShowMission2CompletionQuiz(true)
      } else if (nextItem.type === 'action') {
        console.log('Showing action button')
        // Action button will be rendered
      } else if (nextItem.type === 'message') {
        // Auto-continue to next message after a delay
        console.log('Auto-continuing to next message in 2 seconds')
        setTimeout(() => {
          addMission2CompletionMessage(nextItem, nextStep)
        }, 2000)
        return
      }
    } else {
      console.log('Reached end of Mission 2 completion dialogue')
    }
  }

  const handleMission2CompletionQuizAnswer = (answerIndex) => {
    const quiz = mission2CompletionFlow[currentMission2CompletionStep]
    const selectedOption = quiz.options[answerIndex]
    
    // Play sound based on answer correctness
    if (selectedOption.correct) {
      playCorrectSound()
      
      // Add user's answer
      setMission2CompletionMessages(prev => [...prev, { 
        type: 'choice', 
        text: selectedOption.text, 
        isUser: true,
        isCorrect: selectedOption.correct
      }])
      
      // Show correct answer and continue
      setTimeout(() => {
        setShowMission2CompletionQuiz(false)
        const nextStep = currentMission2CompletionStep + 1
        setCurrentMission2CompletionStep(nextStep)
        
        if (nextStep < mission2CompletionFlow.length) {
          addMission2CompletionMessage(mission2CompletionFlow[nextStep], nextStep)
        }
      }, 1000)
    } else {
      // Wrong answer - play wrong sound and allow re-selection
      playWrongSound()
      // Don't add to messages, don't advance - just allow re-selection
    }
  }

  const handleStartMission3 = () => {
    playSelectSound()
    console.log('Starting Mission 3: Environmental Context Analysis')
    setShowAlphaDialogue(false)
    setIsMission2Completion(false)
    
    // Start Mission 3 directly with sample interface in left dialogue box
    setCurrentDialogue({
      text: "Mission 3: Environmental Context Analysis",
      speaker: 'Alpha',
      isMission3: true,
      step: 'sample',
      showMission3Interface: true
    })
    setCurrentNpcType('alpha')
    setShowDialogue(true)
    setMission3Phase('sample')
    setSelectedTag(null)
  }

  const handleMission2QuizAnswer = (answer) => {
    const isCorrect = answer === 'B'
    
    // Map answer letter to index for wrong answer highlighting
    const answerIndex = answer === 'A' ? 0 : answer === 'B' ? 1 : 2
    
    const quizOptions = [
      { letter: 'A', text: "A. Data Cleaning", correct: false },
      { letter: 'B', text: "B. Data Labeling", correct: true },
      { letter: 'C', text: "C. Data Mining", correct: false }
    ]
    
    if (isCorrect) {
      // Play correct sound and clear wrong answer state
      playCorrectSound()
      setWrongAnswerIndex(null)
      setCurrentDialogue({
        text: "Correct! It's called Data Labeling. AI is like a student, and we acted as teachers, telling it 'this is right, that is wrong.' This is known as Supervised Learning!",
        speaker: 'Alpha',
        isMission2: true,
        step: 'result',
        showNextButton: true
      })
    } else {
      // Play wrong sound and highlight wrong answer
      playWrongSound()
      setWrongAnswerIndex(answerIndex)
      
      // Save wrong answer to errorRecords
      const savedUser = localStorage.getItem('aiJourneyUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (!userData.errorRecords) {
          userData.errorRecords = []
        }
        
        const question = "What do we call the process of telling AI 'this is right, that is wrong'?"
        const userAnswer = quizOptions[answerIndex].text
        const correctAnswer = quizOptions.find(o => o.correct).text
        
        userData.errorRecords.push({
          timestamp: Date.now(),
          region: 'Desert',
          question: question,
          userAnswer: userAnswer,
          correctAnswer: correctAnswer,
          subject: `Desert Quiz - Wrong Answer`,
          preview: `You selected: ${userAnswer.substring(0, 50)}...`,
          content: `Question: ${question}\n\nYour Answer: ${userAnswer}\n\nCorrect Answer: ${correctAnswer}\n\nFeedback: Data Labeling is the process of teaching AI by providing labeled examples. This is the foundation of Supervised Learning.`
        })
        
        localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      }
      
      // Keep quiz visible with error message
      setCurrentDialogue({
        ...currentDialogue,
        error: 'Try again! Think about what we just did to help the AI learn.'
      })
    }
  }

  const handleNextMission = () => {
    playSelectSound() // User selection sound
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
    playSelectSound()
    
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
      setClickedTags([]) // Reset clicked tags for sample phase
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
      setClickedTags([]) // Reset clicked tags for puzzle phase
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
      // Start quiz phase with modern Alpha dialogue
      setMission3Phase('quiz1')
      setShowDialogue(false)
      setShowMission3(false)
      setCurrentDialogue(null)
      setCurrentView('castle') // Ensure we're in castle view for Alpha dialogue
      setShowAlphaDialogue(true)
      setIsMission3Completion(true)
      setAlphaDialogueStep('quiz1_intro')
      setAlphaDialogueHistory([])
    }
  }

  const handleMission3TagClick = (tag) => {
    playSelectSound()
    setSelectedTag(tag)
    
    // Track clicked tags in sample phase
    if (mission3Phase === 'sample' && !clickedTags.includes(tag.id)) {
      setClickedTags(prev => [...prev, tag.id])
    }
    
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
    
    // Hide icon after 2 seconds
    setTimeout(() => {
      setShowAlphaIcon(false)
    }, 2000)
  }

  const handleMission3Complete = () => {
    playSelectSound()
    console.log('Mission 3 completed!')
    setShowDialogue(false)
    
    // Show loading screen and transition to color mode
    playLoadingSound()
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
    const quiz1Options = [
      { text: "A. Because the iron sheet changed shape.", correct: false },
      { text: "B. Because context (the weather) changes how we interpret an action.", correct: true },
      { text: "C. Because the worker yelled at me.", correct: false }
    ]
    
    const quiz2Options = [
      { text: "A. AI is always right.", correct: false },
      { text: "B. AI needs human context and common sense to make good decisions.", correct: true },
      { text: "C. AI should work alone.", correct: false }
    ]
    
    if (mission3Phase === 'quiz1') {
      if (isCorrect) {
        // Play correct sound and move to feedback
        playCorrectSound()
        setWrongAnswerIndex(null)
        setAlphaDialogueStep('quiz1_feedback')
        setAlphaDialogueHistory(prev => [...prev, { type: 'user', text: 'Selected correct answer' }])
      } else {
        // Play wrong sound and highlight wrong answer
        playWrongSound()
        setWrongAnswerIndex(answerIndex)
        
        // Save wrong answer to errorRecords
        const savedUser = localStorage.getItem('aiJourneyUser')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          if (!userData.errorRecords) {
            userData.errorRecords = []
          }
          
          const question = "Why did the meaning of the 'Iron Sheet' change completely?"
          const userAnswer = quiz1Options[answerIndex].text
          const correctAnswer = quiz1Options.find(o => o.correct).text
          
          userData.errorRecords.push({
            timestamp: Date.now(),
            region: 'Desert',
            question: question,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            subject: `Desert Quiz - Wrong Answer`,
            preview: `You selected: ${userAnswer.substring(0, 50)}...`,
            content: `Question: ${question}\n\nYour Answer: ${userAnswer}\n\nCorrect Answer: ${correctAnswer}\n\nFeedback: Context is crucial for AI to interpret data correctly. The same action can have different meanings in different situations.`
          })
          
          localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
        }
      }
    } else if (mission3Phase === 'quiz2') {
      if (isCorrect) {
        // Play correct sound and move to complete
        playCorrectSound()
        setWrongAnswerIndex(null)
        setMission3Phase('complete')
        setAlphaDialogueStep('complete')
        setAlphaDialogueHistory(prev => [...prev, { type: 'user', text: 'Selected correct answer' }])
      } else {
        // Play wrong sound and highlight wrong answer
        playWrongSound()
        setWrongAnswerIndex(answerIndex)
        
        // Save wrong answer to errorRecords
        const savedUser = localStorage.getItem('aiJourneyUser')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          if (!userData.errorRecords) {
            userData.errorRecords = []
          }
          
          const question = "If you hadn't helped me, I would have attacked them. What does this teach us about AI?"
          const userAnswer = quiz2Options[answerIndex].text
          const correctAnswer = quiz2Options.find(o => o.correct).text
          
          userData.errorRecords.push({
            timestamp: Date.now(),
            region: 'Desert',
            question: question,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer,
            subject: `Desert Quiz - Wrong Answer`,
            preview: `You selected: ${userAnswer.substring(0, 50)}...`,
            content: `Question: ${question}\n\nYour Answer: ${userAnswer}\n\nCorrect Answer: ${correctAnswer}\n\nFeedback: AI systems need human oversight and contextual understanding to make appropriate decisions in complex situations.`
          })
          
          localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
        }
      }
    }
  }

  const handleMission3QuizContinue = () => {
    playSelectSound()
    
    // Clear wrong answer state when continuing
    setWrongAnswerIndex(null)
    
    if (alphaDialogueStep === 'quiz1_intro') {
      // Show first quiz question
      setAlphaDialogueStep('quiz1')
      setAlphaDialogueHistory(prev => [...prev, { type: 'alpha', text: "Threats cleared.\n\nI nearly fired the defense lasers—at a celebration… and a worker just battling the wind.\n\nMy core logic failed me." }])
    } else if (alphaDialogueStep === 'quiz1_feedback') {
      // Show second quiz question
      setMission3Phase('quiz2')
      setAlphaDialogueStep('quiz2')
      setAlphaDialogueHistory(prev => [...prev, { type: 'alpha', text: "The action didn't change. Only the context did—the sandstorm, the setting, the intent." }])
    }
  }
  
  // Mission 4 handlers
  const handleMission4Discussion = () => {
    playSelectSound()
    const currentLeaf = mission4Leaves[mission4LeafIndex]
    
    if (!currentLeaf.needsDiscussion) {
      // This leaf doesn't need discussion
      playWrongSound()
      return
    }
    
    // Mark discussion as used for this leaf
    setMission4DiscussionUsed(prev => ({ ...prev, [mission4LeafIndex]: true }))
    
    // Hide current vote badges
    setMission4VotesVisible(false)
    
    // Show discussion animation/effect
    setShowMission4Discussion(true)
    
    // After 1.5 seconds, hide discussion and wait 2 more seconds before showing updated votes
    setTimeout(() => {
      setShowMission4Discussion(false)
      // Wait 2 seconds before showing updated vote badges
      setTimeout(() => {
        setMission4VotesVisible(true)
      }, 2000)
    }, 1500)
  }
  
  const handleMission4Vote = (vote) => {
    playSelectSound()
    const currentLeaf = mission4Leaves[mission4LeafIndex]
    
    // Check if discussion is needed but not used yet
    if (currentLeaf.needsDiscussion && !mission4DiscussionUsed[mission4LeafIndex]) {
      playWrongSound()
      return
    }
    
    // Check if vote is correct
    if (vote === currentLeaf.correctAnswer) {
      playCorrectSound()
      
      // Store the vote
      setMission4Votes(prev => ({ ...prev, [mission4LeafIndex]: vote }))
      
      // Move to next leaf after delay
      setTimeout(() => {
        if (mission4LeafIndex < 3) {
          setMission4LeafIndex(mission4LeafIndex + 1)
          setMission4VotesVisible(false) // Reset vote visibility for next leaf
          // Start typing effect for new leaf info
          startMission4LeafTyping(mission4LeafIndex + 1)
        } else {
          // All leaves completed - show NPC7 completion dialogue
          handleMission4Complete()
        }
      }, 1000)
    } else {
      playWrongSound()
    }
  }
  
  const startMission4LeafTyping = (leafIndex) => {
    const leaf = mission4Leaves[leafIndex]
    const fullText = `Leaf #${leafIndex + 1}: "${leaf.name}"\n${leaf.description}`
    
    let charIndex = 0
    setMission4LeafInfoText('')
    setMission4LeafInfoTyping(true)
    startTypingSound()
    
    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setMission4LeafInfoText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setMission4LeafInfoTyping(false)
        stopTypingSound()
        clearInterval(typingInterval)
        // Show vote badges after typing completes
        setTimeout(() => {
          setMission4VotesVisible(true)
        }, 500)
      }
    }, 30)
  }
  
  const handleMission4Complete = () => {
    playSelectSound()
    console.log('Mission 4 completed!')
    
    // Mark Mission 4 as complete and show NPC7 dialogue
    setMission4Complete(true)
    setMission4Started(false)
    
    // Immediately save progress to ensure mission4Complete is persisted
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (!userData.desertProgress) userData.desertProgress = {}
      userData.desertProgress.mission4Complete = true
      userData.desertProgress.mission4Completed = true
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Force saved mission4Complete = true')
    }
    
    // Show NPC7 completion dialogue
    setCurrentDialogue({
      text: "Consensus achieved. The castle's AI systems are now stable and ready to reboot.",
      speaker: 'NPC7',
      isMission4Complete: true
    })
    setCurrentNpcType('npc7')
    setShowDialogue(true)
  }
  
  const handleMission4RebootAccept = () => {
    playSelectSound()
    setShowDialogue(false)
    
    // Show loading screen with desert icon and transition to color mode
    playLoadingSound()
    setShowMission3Loading(true)
    
    // After loading, switch to color mode
    setTimeout(() => {
      setShowMission3Loading(false)
      setColorMode(true)
      setCurrentView('desert')
      setCurrentSegment(0)
      
      // Immediately save colorMode to ensure it's persisted
      const savedUser = localStorage.getItem('aiJourneyUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (!userData.desertProgress) userData.desertProgress = {}
        userData.desertProgress.colorMode = true
        userData.desertProgress.mission3Completed = true
        localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
        console.log('Force saved colorMode = true')
      }
    }, 4000)
  }
  
  // Camera functions for NPC photo feature
  const handleCameraIconClick = (npcId) => {
    playSelectSound()
    setCurrentPhotoNpc(npcId)
    setShowDialogue(false)
    setShowNpcCamera(true)
    
    // Request camera access
    navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } // Use back camera on mobile
    })
    .then(stream => {
      setNpcCameraStream(stream)
    })
    .catch(err => {
      console.error('Camera access error:', err)
      alert('Unable to access camera. Please grant camera permissions.')
      setShowNpcCamera(false)
    })
  }
  
  const handleCapturePhoto = () => {
    playCameraSound()
    
    // Create canvas to capture photo from video stream
    const video = document.getElementById('npcCameraVideo')
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    
    // Convert to base64
    const photoData = canvas.toDataURL('image/jpeg', 0.9)
    setNpcCapturedPhoto(photoData)
    
    // Stop camera stream
    if (npcCameraStream) {
      npcCameraStream.getTracks().forEach(track => track.stop())
      setNpcCameraStream(null)
    }
    
    // Start AI recognition
    recognizePhoto(photoData)
  }
  
  const recognizePhoto = async (photoBase64) => {
    setIsRecognizing(true)
    
    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Data = photoBase64.split(',')[1]
      
      console.log('Calling Gemini API for image description...')
      
      // Use gemini-2.5-flash model
      const response = await fetch(
        getGeminiUrl('gemini-3-flash-preview'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: 'Describe this image in one simple sentence. Focus on the main subject and action. For example: "A woman holding a patterned mug in front of a bookshelf." Keep it concise and factual.'
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Data
                  }
                }
              ]
            }]
          })
        }
      )
      
      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error response:', errorText)
        throw new Error(`API request failed: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      console.log('Gemini API full response:', JSON.stringify(data, null, 2))
      
      // Check for different possible response structures
      let resultText = null
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        resultText = data.candidates[0].content.parts[0].text.trim()
      } else if (data.candidates && data.candidates[0]?.output) {
        resultText = data.candidates[0].output.trim()
      } else if (data.text) {
        resultText = data.text.trim()
      }
      
      console.log('Extracted AI description:', resultText)
      
      if (resultText) {
        setRecognitionResult({
          aiDescription: resultText,
          photo: photoBase64,
          timestamp: new Date().toISOString(),
          npc: currentPhotoNpc
        })
        
        setIsRecognizing(false)
        setShowNpcCamera(false)
        setShowRecognitionCard(true)
      } else {
        console.error('No valid text found in response:', data)
        throw new Error('Invalid API response structure: ' + JSON.stringify(data))
      }
    } catch (error) {
      console.error('Recognition error:', error)
      console.error('Error details:', error.message)
      setIsRecognizing(false)
      alert(`Failed to recognize the image: ${error.message}\n\nPlease check the console for details.`)
      setShowNpcCamera(false)
    }
  }
  
  const handleCloseCamera = () => {
    playSelectSound()
    
    // Stop camera stream
    if (npcCameraStream) {
      npcCameraStream.getTracks().forEach(track => track.stop())
      setNpcCameraStream(null)
    }
    
    setShowNpcCamera(false)
    setNpcCapturedPhoto(null)
  }
  
  // Handle user story submission
  const handleSubmitStory = () => {
    playSelectSound()
    
    if (!userStory.trim()) {
      alert('Please add your story before continuing.')
      return
    }
    
    // Extract keywords from AI description and user story for hashtags
    const generateHashtags = (aiDesc, userStory) => {
      // Simple keyword extraction - take important words
      const allText = `${aiDesc} ${userStory}`.toLowerCase()
      const words = allText.split(/\s+/)
      const stopWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'this', 'that', 'but', 'and', 'or']
      const keywords = words
        .filter(w => w.length > 3 && !stopWords.includes(w))
        .filter((w, i, arr) => arr.indexOf(w) === i) // unique
        .slice(0, 3) // take first 3
      return keywords.map(k => `#${k.replace(/[^a-z0-9]/g, '')}`)
    }
    
    const hashtags = generateHashtags(recognitionResult.aiDescription, userStory)
    
    // Get first 6 words of user story
    const storyPreview = userStory.split(' ').slice(0, 6).join(' ')
    
    // Update recognition result with user story and hashtags
    setRecognitionResult({
      ...recognitionResult,
      userStory,
      storyPreview,
      hashtags
    })
    
    // Close input card and show final card
    setShowRecognitionCard(false)
    setShowFinalCard(true)
  }
  
  const handleDownloadCard = () => {
    playSelectSound()
    
    if (!recognitionResult) return
    
    // Create a canvas to draw the Instagram-style card
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 1100
    const ctx = canvas.getContext('2d')
    
    // Background
    ctx.fillStyle = '#FFF9F0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Load and draw photo
    const img = new Image()
    img.onload = () => {
      // Draw photo
      const photoHeight = 600
      const photoWidth = canvas.width
      ctx.drawImage(img, 0, 0, photoWidth, photoHeight)
      
      // Draw timestamp on photo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(canvas.width - 250, photoHeight - 50, 230, 35)
      ctx.fillStyle = '#fff'
      ctx.font = '14px "Roboto Mono"'
      const date = new Date(recognitionResult.timestamp).toLocaleString()
      ctx.fillText(`Captured: ${date}`, canvas.width - 240, photoHeight - 25)
      
      // Draw icons and description
      const startY = photoHeight + 40
      
      // Description text
      ctx.fillStyle = '#333'
      ctx.font = '18px "Roboto"'
      const descText = `Together, we see: Not just ${recognitionResult.aiDescription}, but ${recognitionResult.storyPreview}...`
      wrapText(ctx, descText, 40, startY, canvas.width - 80, 28)
      
      // Hashtags
      ctx.fillStyle = '#f89303'
      ctx.font = 'bold 16px "Roboto Mono"'
      const hashtagText = recognitionResult.hashtags.join(' ')
      ctx.fillText(hashtagText, 40, startY + 120)
      
      // Download
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `desert-moment-${Date.now()}.jpg`
        a.click()
        URL.revokeObjectURL(url)
      }, 'image/jpeg', 0.9)
    }
    img.src = recognitionResult.photo
  }
  
  // Helper function to wrap text
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ')
    let line = ''
    let currentY = y
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY)
        line = words[i] + ' '
        currentY += lineHeight
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, x, currentY)
  }
  
  const handleSaveToJournal = () => {
    playSelectSound()
    
    if (!recognitionResult) return
    
    // Get existing journal entries
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (!userData.explorerJournal) {
        userData.explorerJournal = []
      }
      
      // Add new entry
      userData.explorerJournal.push({
        photo: recognitionResult.photo,
        timestamp: recognitionResult.timestamp,
        aiDescription: recognitionResult.aiDescription,
        userStory: recognitionResult.userStory,
        storyPreview: recognitionResult.storyPreview,
        hashtags: recognitionResult.hashtags,
        id: Date.now(),
        region: 'desert',
        type: 'moment' // Mark as moment type for different display
      })
      
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      
      // Show success message
      setShowSaveSuccess(true)
      
      // Close card
      setShowFinalCard(false)
      setRecognitionResult(null)
      setNpcCapturedPhoto(null)
      setUserStory('')
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSaveSuccess(false)
      }, 3000)
    }
  }
  
  const handleCloseRecognitionCard = () => {
    playSelectSound()
    setShowRecognitionCard(false)
    setRecognitionResult(null)
    setNpcCapturedPhoto(null)
    setUserStory('')
  }
  
  const handleCloseFinalCard = () => {
    playSelectSound()
    setShowFinalCard(false)
    setRecognitionResult(null)
    setNpcCapturedPhoto(null)
    setUserStory('')
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
      cursor: missionStarted && !colorMode && capturedObjects.length < 11 ? 'none' : 'default', // Hide default cursor during mission (before completion)
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
      left: '5%', // Moved left from 15% to 5% to avoid blocking arrow
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
      top: '15px', // 与NPC顶部对齐
      right: '145px', // 紧贴NPC左侧 (NPC right:15px + width:120px + 10px间距)
      width: '300px',
      zIndex: 100,
    },
    dialogueBox: {
      padding: '40px 30px 20px 30px', // Increased top padding for speaker label
      borderRadius: '20px',
      background: '#FFF1B5', // Yellow background
      border: '3px solid #43302E',
      cursor: 'default', // Remove pointer cursor since no clicking needed
      position: 'relative',
    },
    glitchDialogueBox: {
      background: 'rgba(71, 23, 101, 0.85)', // #471765 with glassmorphism
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '2px solid rgba(205, 165, 247, 0.3)',
      boxShadow: '0 8px 32px 0 rgba(71, 23, 101, 0.37)',
    },
    dialogueText: {
      fontFamily: "'Coming Soon', cursive",
      fontSize: '18px',
      color: '#333',
      lineHeight: 1.8,
      margin: 0,
    },
    glitchDialogueText: {
      color: '#CDA5F7', // Light purple for regular text
      lineHeight: 2.0, // Increased line spacing
    },
    speaker: {
      fontFamily: "'Coming Soon', cursive",
      fontSize: '16px',
      fontWeight: 700,
      marginBottom: '12px',
      padding: '8px 16px',
      background: '#43302E',
      color: '#FFF1B5',
      borderRadius: '8px',
      display: 'inline-block',
      position: 'absolute',
      top: '-18px', // Moved up more to create space
      left: '20px',
    },
    glitchSpeaker: {
      background: '#471765',
      color: '#CDA5F7',
      border: '2px solid rgba(205, 165, 247, 0.5)',
    },
    // MapView-style Glitch dialogue (top-right)
    glitchDialogueMapStyle: {
      position: 'absolute',
      top: '20px',
      right: '150px',
      padding: '20px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid #af4dca',
      zIndex: 100,
      minWidth: '280px',
      maxWidth: '320px',
      boxShadow: '0 4px 20px rgba(175, 77, 202, 0.3)',
    },
    glitchDialogueHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
    },
    glitchDialogueAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#af4dca',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    glitchDialogueAvatarIcon: {
      fontSize: '24px',
    },
    glitchDialogueName: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#af4dca',
      margin: 0,
    },
    glitchDialogueTextMapStyle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.6,
      margin: '0 0 15px 0',
    },
    glitchDialogueInputContainer: {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#d9d7de',
      borderRadius: '20px',
      border: '2px solid #d9d7de',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    },
    glitchDialogueInput: {
      flex: 1,
      padding: '10px 15px',
      border: 'none',
      backgroundColor: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      color: '#333',
      outline: 'none',
    },
    glitchDialogueDivider: {
      width: '2px',
      height: '24px',
      backgroundColor: '#af4dca',
      margin: '0 8px',
      flexShrink: 0,
    },
    glitchDialogueSendButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 12px',
      transition: 'all 0.2s',
      flexShrink: 0,
    },
    glitchDialogueSendIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    glitchDialogueCloseButton: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      background: 'none',
      border: 'none',
      fontSize: '20px',
      color: '#999',
      cursor: 'pointer',
      padding: '0',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
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
      width: '400px', // Doubled from 200px
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
      width: '800px', // Reduced from 1200px
      height: '1000px', // Reduced from 1500px
      backgroundImage: 'url(/desert/icon/photo.png)',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '120px 80px 160px 80px', // Reduced from 180px 120px 240px 120px
      transition: 'transform 0.3s ease-in-out', // Add transition for smooth scaling
    },
    photoBackground: {
      width: '560px', // Reduced from 840px
      height: '400px', // Reduced from 600px
      background: 'transparent',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '40px', // Reduced from 60px
      overflow: 'hidden',
    },
    photoObjectImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    photoDescription: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '28px', // Reduced from 42px
      color: '#333',
      textAlign: 'center',
      lineHeight: 1.4,
      maxWidth: '560px', // Reduced from 840px
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '20px', // Reduced from 30px
      borderRadius: '15px', // Increased from 5px (3x)
    },
    photoCloseButton: {
      position: 'absolute',
      top: '20px', // Reduced from 30px
      right: '20px', // Reduced from 30px
      background: 'rgba(255, 255, 255, 0.8)',
      border: 'none',
      borderRadius: '50%',
      width: '60px', // Reduced from 90px
      height: '60px', // Reduced from 90px
      fontSize: '32px', // Reduced from 48px
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
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      zIndex: 60,
    },
    progressHeader: {
      background: 'rgba(255, 255, 255, 0.65)',
      border: '3px solid #FABA14',
      borderRadius: '25px',
      padding: '10px 30px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
    },
    progressGrid: {
      display: 'flex',
      gap: '10px',
    },
    progressBox: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      background: 'rgba(211, 211, 214, 0.65)',
      border: '3px dashed white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '40px',
      fontWeight: 'bold',
      color: 'white',
      transition: 'all 0.3s',
    },
    progressBoxCompleted: {
      background: 'rgba(211, 211, 214, 1)',
      border: '3px solid white',
    },
    progressBoxImage: {
      width: '60px', // Increased from 50px
      height: '60px', // Increased from 50px
      objectFit: 'contain',
      marginBottom: '3px',
    },
    progressBoxLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      color: '#333',
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
      width: '1200px',
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
      background: '#FABA14', // 黄色进度条
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
    mission3TagHintText: {
      fontFamily: "'Roboto Mono', monospace",
      fontSize: '11px',
      color: '#333', // 深色
      textAlign: 'center',
      marginBottom: '10px',
      fontWeight: 300,
    },
    mission3TagInDialogue: {
      padding: '8px 15px',
      border: '2px solid #7c4b00',
      borderRadius: '8px', // 减小圆角
      background: '#f0e2b1',
      cursor: 'pointer',
      fontFamily: "'Roboto Mono', monospace",
      fontSize: '12px',
      fontWeight: 300, // 细字体
      color: '#7c4b00',
      transition: 'all 0.2s',
      minWidth: '100px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    mission3TagIcon: {
      width: '16px',
      height: '16px',
      objectFit: 'contain',
    },
    mission3TagSelectedInDialogue: {
      background: '#7c4b00',
      color: 'white',
      transform: 'scale(1.05)',
    },
    mission3ContinueButtonInDialogue: {
      display: 'block',
      width: '100%',
      padding: '12px 20px',
      border: 'none',
      borderRadius: '8px',
      background: '#7c4b00',
      color: 'white',
      fontFamily: "'Roboto Mono', monospace",
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
      fontFamily: "'Roboto Mono', monospace",
      fontSize: '13px',
      fontWeight: 600,
      color: 'white',
      marginTop: '15px',
      textAlign: 'center',
      background: '#496f48',
      padding: '12px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)', // 立体阴影
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
      bottom: '30%',
      right: '8%',
      width: '250px',
      height: '250px',
      zIndex: 400,
      // Removed animation to keep position stable
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
      fontFamily: "'Courier New', monospace", // 终端字体
      fontSize: '28px',
      fontWeight: 700,
      color: '#00ff00', // 绿色终端风格
      marginBottom: '30px',
      textAlign: 'center',
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
    
    // Modern Dialogue Styles (Based on Reference Image 2)
    modernDialogueContainer: {
      position: 'absolute',
      top: '12.5%',
      left: '10%',
      width: '40%',
      height: '70%',
      zIndex: 100,
      background: 'rgba(245, 245, 245, 0.98)', // Very light gray
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
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
    },
    modernNpcInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '15px',
      flex: 1, // Allow it to take available space
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
      flexShrink: 0, // Prevent shrinking
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
      background: '#FABA14', // Yellow theme for Alpha
      padding: '12px 18px',
      borderRadius: '18px',
      boxShadow: '0 2px 6px rgba(255, 215, 0, 0.3)',
    },
    modernUserText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333', // Dark text for yellow background
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
    customCursor: {
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 9999,
      width: '32px',
      height: '32px',
      transform: 'translate(-16px, -16px)', // Center the cursor
    },
  }

  return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes breathe {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(255, 51, 51, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 30px rgba(0, 212, 255, 0.9), 0 0 60px rgba(255, 51, 51, 0.6);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes blink {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 1; }
          }
        `}
      </style>
      
      <div style={styles.container}>
        {/* Custom Camera Cursor */}
        {missionStarted && !colorMode && capturedObjects.length < 11 && (
          <img 
            src="/desert/icon/camera2.png"
            alt="Camera Cursor"
            style={{
              ...styles.customCursor,
              left: `${cursorPosition.x}px`,
              top: `${cursorPosition.y}px`,
            }}
          />
        )}
        
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

      {/* Glitch Dialogue (MapView style) */}
      {showDialogue && currentNpcType === 'glitch' && (
        <div style={styles.glitchDialogueMapStyle}>
          {/* Close button */}
          <button
            style={styles.glitchDialogueCloseButton}
            onClick={() => {
              setShowDialogue(false)
              setGlitchChatHistory([]) // Clear chat history when closing
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#333'
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#999'
            }}
          >
            ✕
          </button>
          
          {/* Header with avatar and name */}
          <div style={styles.glitchDialogueHeader}>
            <div style={styles.glitchDialogueAvatar}>
              <span style={styles.glitchDialogueAvatarIcon}>👾</span>
            </div>
            <h4 style={styles.glitchDialogueName}>Glitch</h4>
          </div>
          
          {/* Chat history */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            {/* Initial greeting if no chat history */}
            {glitchChatHistory.length === 0 && (
              <p style={styles.glitchDialogueTextMapStyle}>
                {currentDialogue.text}
              </p>
            )}
            
            {/* Chat messages */}
            {glitchChatHistory.map((message, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: message.role === 'user' 
                    ? 'rgba(175, 77, 202, 0.1)' 
                    : 'rgba(175, 77, 202, 0.05)',
                  border: message.role === 'user'
                    ? '1px solid rgba(175, 77, 202, 0.3)'
                    : '1px solid rgba(175, 77, 202, 0.1)',
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <div style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#af4dca',
                  marginBottom: '4px',
                  fontFamily: "'Roboto', sans-serif",
                }}>
                  {message.role === 'user' ? 'YOU' : 'GLITCH'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#333',
                  lineHeight: 1.5,
                  fontFamily: "'Roboto', sans-serif",
                  whiteSpace: 'pre-wrap',
                }}>
                  {message.text}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isGlitchTyping && (
              <div style={{
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'rgba(175, 77, 202, 0.05)',
                border: '1px solid rgba(175, 77, 202, 0.1)',
                alignSelf: 'flex-start',
                maxWidth: '85%',
              }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: '#af4dca',
                  marginBottom: '4px',
                  fontFamily: "'Roboto', sans-serif",
                }}>
                  GLITCH
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#999',
                  fontFamily: "'Roboto', sans-serif",
                }}>
                  <span style={{ animation: 'blink 1.4s infinite' }}>●</span>
                  <span style={{ animation: 'blink 1.4s infinite 0.2s' }}>●</span>
                  <span style={{ animation: 'blink 1.4s infinite 0.4s' }}>●</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Input container */}
          <div style={styles.glitchDialogueInputContainer}>
            <input
              type="text"
              placeholder="Ask Glitch anything..."
              value={glitchInput}
              onChange={(e) => setGlitchInput(e.target.value)}
              onKeyPress={handleGlitchInputKeyPress}
              style={styles.glitchDialogueInput}
              disabled={isGlitchTyping}
            />
            <div style={styles.glitchDialogueDivider}></div>
            <button
              onClick={handleGlitchSend}
              style={{
                ...styles.glitchDialogueSendButton,
                opacity: isGlitchTyping ? 0.5 : 1,
                cursor: isGlitchTyping ? 'not-allowed' : 'pointer',
              }}
              disabled={isGlitchTyping}
              onMouseOver={(e) => {
                if (!isGlitchTyping) e.target.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              <svg style={styles.glitchDialogueSendIcon} viewBox="0 0 24 24" fill="#af4dca">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

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
          {currentSegment === SEGMENTS.SEGMENT_2 && !colorMode && (
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

      {/* Mission 4: Expert Voting Interface in Gate View - Outside desert view block */}
      {mission4Started && currentView === 'gate' && (
        <>
          {/* Three Biologist NPCs - Horizontally aligned at bottom */}
          {biologists.map((biologist, index) => {
            const currentLeaf = mission4Leaves[mission4LeafIndex]
            const votes = mission4DiscussionUsed[mission4LeafIndex] && currentLeaf.afterDiscussionVotes 
              ? currentLeaf.afterDiscussionVotes 
              : currentLeaf.initialVotes
            const vote = votes[index]
            
            // Calculate position for equal spacing
            const totalWidth = window.innerWidth
            const spacing = totalWidth / 4
            const leftPosition = spacing * (index + 1) - 125 // Center each NPC
            
            return (
              <div
                key={biologist.id}
                style={{
                  position: 'absolute',
                  left: `${leftPosition}px`,
                  bottom: '150px', // Increased from 80px to 150px for more spacing
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 30,
                }}
              >
                {/* Vote badge in dialogue bubble - only show after typing completes */}
                {mission4VotesVisible && !mission4LeafInfoTyping && (
                  <div style={{
                    position: 'relative',
                    marginBottom: '10px',
                    animation: 'fadeIn 0.5s ease-in-out',
                  }}>
                    <img 
                      src="/desert/icon/dialogue.png"
                      alt="Dialogue"
                      style={{
                        width: '100px',
                        height: '80px',
                      }}
                    />
                    <img 
                      src={`/desert/icon/${vote}.svg`}
                      alt={vote}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '50px',
                        height: '50px',
                      }}
                    />
                  </div>
                )}
                
                {/* NPC Image Container with relative positioning */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {/* NPC Image */}
                  <img 
                    src={`/desert/npc/${biologist.npc}.png`}
                    alt={biologist.name}
                    style={{
                      height: '250px',
                      width: 'auto',
                    }}
                  />
                  
                  {/* NPC Name - Overlapping on NPC image */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '8px 16px',
                    background: 'rgba(101, 67, 33, 0.9)', // Deep brown with transparency
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  }}>
                    BIOLOGIST{biologist.id}<br/>
                    {biologist.name}
                  </div>
                </div>
              </div>
            )
          })}
          
          {/* Top Card with Leaf Info and Discussion Button */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '40px',
            transform: 'translateX(-50%)',
            background: 'rgba(244, 228, 188, 0.95)',
            borderRadius: '20px',
            padding: '25px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: 100,
            width: '800px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
          }}>
            {/* Left: Leaf Image */}
            <div style={{
              flex: '0 0 150px',
            }}>
              <img 
                src={mission4Leaves[mission4LeafIndex].image}
                alt="Leaf"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'contain',
                }}
              />
            </div>
            
            {/* Vertical divider line */}
            <div style={{
              width: '2px',
              height: '120px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '1px',
            }} />
            
            {/* Middle: Leaf Info with Typing Effect */}
            <div style={{
              flex: 1,
            }}>
              <div style={{
                fontSize: '16px',
                color: '#333',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                fontFamily: "'Coming Soon', cursive",
              }}>
                {mission4LeafInfoText}
                {mission4LeafInfoTyping && <span style={{
                  animation: 'blink 1s infinite',
                  marginLeft: '2px',
                }}>|</span>}
              </div>
            </div>
            
            {/* Right: Discussion Button */}
            <div style={{
              flex: '0 0 auto',
            }}>
              <button
                onClick={handleMission4Discussion}
                disabled={mission4DiscussionUsed[mission4LeafIndex] || mission4LeafInfoTyping}
                style={{
                  padding: '15px 25px',
                  background: (mission4DiscussionUsed[mission4LeafIndex] || mission4LeafInfoTyping) ? '#ccc' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: (mission4DiscussionUsed[mission4LeafIndex] || mission4LeafInfoTyping) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  transition: 'transform 0.2s',
                  opacity: (mission4DiscussionUsed[mission4LeafIndex] || mission4LeafInfoTyping) ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
                onMouseOver={(e) => {
                  if (!mission4DiscussionUsed[mission4LeafIndex] && !mission4LeafInfoTyping) {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src="/desert/icon/discussion.png" alt="Discussion" style={{width: '30px', height: '30px'}} />
                Discussion
              </button>
            </div>
          </div>
          
          {/* Bottom: Status Buttons with 3D Effect */}
          <div style={{
            position: 'absolute',
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '30px',
            zIndex: 100,
          }}>
            {/* Healthy Status Button */}
            <div style={{position: 'relative'}}>
              {/* Green shadow layer */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '0',
                right: '0',
                height: '100%',
                background: '#4CAF50',
                borderRadius: '15px',
                zIndex: 1,
              }} />
              {/* White button layer */}
              <button
                onClick={() => handleMission4Vote('healthy')}
                disabled={mission4LeafInfoTyping}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '18px 40px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: mission4LeafInfoTyping ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s',
                  opacity: mission4LeafInfoTyping ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!mission4LeafInfoTyping) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src="/desert/icon/healthy.svg" alt="Healthy" style={{width: '35px', height: '35px'}} />
                Healthy Status
              </button>
            </div>
            
            {/* Unhealthy Status Button */}
            <div style={{position: 'relative'}}>
              {/* Red shadow layer */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '0',
                right: '0',
                height: '100%',
                background: '#F44336',
                borderRadius: '15px',
                zIndex: 1,
              }} />
              {/* White button layer */}
              <button
                onClick={() => handleMission4Vote('unhealthy')}
                disabled={mission4LeafInfoTyping}
                style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: '18px 40px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  cursor: mission4LeafInfoTyping ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s',
                  opacity: mission4LeafInfoTyping ? 0.6 : 1,
                }}
                onMouseOver={(e) => {
                  if (!mission4LeafInfoTyping) {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src="/desert/icon/unhealthy.svg" alt="Unhealthy" style={{width: '35px', height: '35px'}} />
                Unhealthy Status
              </button>
            </div>
          </div>
          
          {/* Discussion Animation */}
          {showMission4Discussion && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '30px 50px',
              borderRadius: '15px',
              fontSize: '24px',
              fontWeight: 'bold',
              zIndex: 200,
              animation: 'fadeIn 0.3s ease-in-out',
            }}>
              Experts are discussing...
            </div>
          )}
        </>
      )}
      
      {/* NPC7 for Mission 4 Completion - Show in gate view */}
      {mission4Complete && currentView === 'gate' && (
        <div 
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '300px',
            height: '300px',
            cursor: 'pointer',
            zIndex: 30,
            transition: 'transform 0.2s',
          }}
          onClick={() => {
            // NPC7 dialogue is already shown, this is just for visual presence
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img src="/desert/npc/npc7.png" alt="NPC 7" style={styles.npcImage} />
        </div>
      )}

      {/* Mission Progress Tracker - only show in non-color mode */}
      {!colorMode && missionStarted && currentView === 'desert' && (
        <div style={styles.progressTracker}>
          {/* Progress Header */}
          <div style={styles.progressHeader}>
            Progress: {capturedObjects.length}/11 Found
          </div>
          
          {/* Progress Grid */}
          <div style={styles.progressGrid}>
            {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'].map(objectId => {
              const isCompleted = capturedObjects.includes(objectId)
              
              return (
                <div
                  key={objectId}
                  style={{
                    ...styles.progressBox,
                    ...(isCompleted ? styles.progressBoxCompleted : {})
                  }}
                >
                  {isCompleted ? (
                    <>
                      <img 
                        src={`/desert/object/${objectId}.png`}
                        alt={`NPC${objectId}`}
                        style={styles.progressBoxImage}
                      />
                      <div style={styles.progressBoxLabel}>NPC{objectId}</div>
                    </>
                  ) : (
                    '?'
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Gate view - hide arrow button during Mission 4 */}
      {currentView === 'gate' && !mission4Started && (
        <>
          <button style={styles.arrowButton} onClick={handleArrowClick}>
            <img src="/desert/icon/arrow.png" alt="Enter" style={styles.zoomImage} />
          </button>
        </>
      )}
      
      {/* Gate view - back button always visible */}
      {currentView === 'gate' && (
        <button style={styles.downButton} onClick={handleBackToDesert}>
          <img src="/jungle/icon/down.png" alt="Back to Desert" style={styles.zoomImage} />
        </button>
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

      {/* Regular NPC Dialogue (excluding Glitch) */}
      {showDialogue && currentDialogue && currentNpcType !== 'glitch' && (
        // In color mode, only show NPC5/6/7 dialogues, not NPC1/2/gatekeeper
        colorMode ? ['npc5', 'npc6', 'npc7'].includes(currentNpcType) : true
      ) && (
        <div style={getDialoguePosition(currentNpcType)}>
          <div style={{
            ...styles.dialogueBox,
            ...(currentNpcType === 'glitch' ? styles.glitchDialogueBox : {}),
            // Compact style for NPC5/6/7
            ...(['npc5', 'npc6', 'npc7'].includes(currentNpcType) ? {
              padding: '30px 20px 15px 20px', // Reduced padding
              minHeight: 'auto', // Remove minimum height
            } : {})
          }} onClick={currentDialogue.showMission2Interface || currentDialogue.showMission3Interface || currentDialogue.showQuiz || currentDialogue.showNextButton || currentDialogue.showContinueButton || currentDialogue.showDoneButton ? undefined : handleDialogueClick}>
            <div style={{
              ...styles.speaker,
              ...(currentNpcType === 'glitch' ? styles.glitchSpeaker : {})
            }}>{currentDialogue.speaker}</div>
            {!currentDialogue.showMission2Interface && !currentDialogue.showMission3Interface && (
              <>
                <p style={{
                  ...styles.dialogueText,
                  ...(currentNpcType === 'glitch' ? styles.glitchDialogueText : {}),
                  // Compact text style for NPC5/6/7
                  ...(['npc5', 'npc6', 'npc7'].includes(currentNpcType) ? {
                    fontSize: '16px', // Slightly smaller font
                    lineHeight: 1.6, // Tighter line height
                    marginBottom: '8px', // Less bottom margin
                  } : {})
                }}>
                  {currentNpcType === 'glitch' ? formatGlitchText(displayedText) : formatDialogueText(displayedText)}
                  {isTyping && <span style={styles.cursor}></span>}
                </p>
                
                {/* Camera Icon for NPC5/6/7 in color mode */}
                {currentDialogue.showCameraIcon && !isTyping && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px' // Reduced from 15px
                  }}>
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '2px solid #FABA14',
                        borderRadius: '50%',
                        width: '50px', // Reduced from 60px
                        height: '50px', // Reduced from 60px
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      }}
                      onClick={() => handleCameraIconClick(currentNpcType)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(250, 186, 20, 0.4)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <img 
                        src="/desert/icon/photo.svg" 
                        alt="Camera" 
                        style={{
                          width: '32px',
                          height: '32px',
                          objectFit: 'contain'
                        }}
                      />
                    </button>
                  </div>
                )}
              </>
            )}
            
            {/* Mission 2 Interface - Inside Dialogue Box */}
            {currentDialogue.showMission2Interface && (
              <>
                {/* Typing text above Mission 2 interface */}
                <p style={{
                  ...styles.dialogueText,
                  ...(currentNpcType === 'glitch' ? styles.glitchDialogueText : {})
                }}>
                  {formatDialogueText("Is the AI's judgment correct?")}
                  {isTyping && <span style={styles.cursor}></span>}
                </p>
                
                <div style={styles.mission2InterfaceInDialogue}>
                  {/* Progress - centered and larger */}
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px'}}>
                    <div style={{color: '#FABA14', fontSize: '24px', fontWeight: 'bold'}}>
                      {currentImageIndex + 1}/5
                    </div>
                  </div>
                  
                  {/* Instruction Text */}
                  <div style={{color: 'white', fontSize: '12px', marginBottom: '15px', textAlign: 'center', opacity: 0.9}}>
                    Is this person a real worker? Select CONFIRMED if yes, REJECTED if no.
                  </div>
                
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
              </>
            )}
            
            {/* Mission 3 Interface */}
            {currentDialogue.showMission3Interface && (
              <div style={styles.mission3InterfaceContainer}>
                {/* Progress Display at Top */}
                {mission3Phase !== 'sample' && (
                  <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px'}}>
                    <div style={{color: '#FABA14', fontSize: '24px', fontWeight: 'bold'}}>
                      {mission3Phase === 'puzzle1' ? '1/3' : mission3Phase === 'puzzle2' ? '2/3' : '3/3'}
                    </div>
                  </div>
                )}
                
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
                {selectedTag && (
                  <div style={styles.mission3UpdateTextAboveButtons}>
                    {selectedTag.update}
                  </div>
                )}

                {/* Hint Text */}
                <div style={styles.mission3TagHintText}>
                  Tap one at a time — each tag tells the AI something new!
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
                          e.target.style.background = '#e8d9a0'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedTag?.id !== tag.id) {
                          e.target.style.background = '#f0e2b1'
                        }
                      }}
                    >
                      <img src="/desert/icon/tag.svg" alt="tag" style={styles.mission3TagIcon} />
                      {tag.text}
                    </button>
                  ))}
                </div>

                {/* Continue Button */}
                {((mission3Phase === 'sample' && clickedTags.length === 3) || 
                  (mission3Phase !== 'sample' && selectedTag && selectedTag.correct)) && (
                  <button 
                    style={styles.mission3ContinueButtonInDialogue}
                    onClick={handleMission3Continue}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {mission3Phase === 'puzzle3' ? 'All Clear' : 
                     mission3Phase === 'sample' ? 'Start' : 'Next'}
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
                        style={{
                          ...styles.finalQuizOption,
                          ...(wrongAnswerIndex === index ? {
                            border: '2px solid #FF0845',
                            background: '#ffe0e6'
                          } : {})
                        }}
                        onClick={() => {
                          if (currentDialogue.isMission3) {
                            handleMission3QuizAnswer(index, option.correct)
                          } else {
                            handleMission2QuizAnswer(option.text.charAt(0))
                          }
                        }}
                        onMouseOver={(e) => {
                          if (wrongAnswerIndex !== index) {
                            e.target.style.background = '#f0f0f0'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (wrongAnswerIndex !== index) {
                            e.target.style.background = 'white'
                          } else {
                            e.target.style.background = '#ffe0e6'
                          }
                        }}
                      >
                        {option.text}
                      </button>
                    ))
                  ) : (
                    // Mission 2 Quiz - Static options (fallback)
                    <>
                      <button 
                        style={{
                          ...styles.finalQuizOption,
                          ...(wrongAnswerIndex === 0 ? {
                            border: '2px solid #FF0845',
                            background: '#ffe0e6'
                          } : {})
                        }}
                        onClick={() => handleMission2QuizAnswer('A')}
                        onMouseOver={(e) => {
                          if (wrongAnswerIndex !== 0) {
                            e.target.style.background = '#f0f0f0'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (wrongAnswerIndex !== 0) {
                            e.target.style.background = 'white'
                          } else {
                            e.target.style.background = '#ffe0e6'
                          }
                        }}
                      >
                        A. Changing AI's Glasses
                      </button>
                      <button 
                        style={{
                          ...styles.finalQuizOption,
                          ...(wrongAnswerIndex === 1 ? {
                            border: '2px solid #FF0845',
                            background: '#ffe0e6'
                          } : {})
                        }}
                        onClick={() => handleMission2QuizAnswer('B')}
                        onMouseOver={(e) => {
                          if (wrongAnswerIndex !== 1) {
                            e.target.style.background = '#f0f0f0'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (wrongAnswerIndex !== 1) {
                            e.target.style.background = 'white'
                          } else {
                            e.target.style.background = '#ffe0e6'
                          }
                        }}
                      >
                        B. Data Labeling / Annotation
                      </button>
                      <button 
                        style={{
                          ...styles.finalQuizOption,
                          ...(wrongAnswerIndex === 2 ? {
                            border: '2px solid #FF0845',
                            background: '#ffe0e6'
                          } : {})
                        }}
                        onClick={() => handleMission2QuizAnswer('C')}
                        onMouseOver={(e) => {
                          if (wrongAnswerIndex !== 2) {
                            e.target.style.background = '#f0f0f0'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (wrongAnswerIndex !== 2) {
                            e.target.style.background = 'white'
                          } else {
                            e.target.style.background = '#ffe0e6'
                          }
                        }}
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
            
            {/* Mission 4 Completion Button */}
            {currentDialogue.isMission4Complete && !isTyping && (
              <button 
                style={{
                  marginTop: '20px',
                  padding: '15px 40px',
                  background: 'rgba(139, 90, 43, 0.3)', // Brown glass effect
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '2px solid rgba(139, 90, 43, 0.5)',
                  borderRadius: '15px',
                  color: '#8B5A2B',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(139, 90, 43, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '1px',
                }}
                onClick={handleMission4RebootAccept}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(139, 90, 43, 0.4)'
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(139, 90, 43, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(139, 90, 43, 0.3)'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(139, 90, 43, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                🔄 REBOOT SYSTEM
              </button>
            )}
          </div>
        </div>
      )}

      {/* Alpha Dialogue - Modern Design (Based on Reference Image 2) */}
      {showAlphaDialogue && (() => {
        const theme = getNpcTheme('alpha')
        const totalSteps = 4 // Changed from 3 to 4 for 4 missions
        const currentStep = mission4Started || mission4Complete ? 4 : (isMission3Completion ? 3 : (isMission2Completion ? 2 : (isPhase2 ? 2 : 1))) // Phase 1 is step 1, Phase 2/Mission 2 is step 2, Mission 3 is step 3, Mission 4 is step 4
        const progressPercent = (currentStep / totalSteps) * 100
        
        return (
          <div style={{
            ...styles.modernDialogueContainer,
            border: `3px solid ${theme.borderColor}`,
          }}>
            {/* Header with Progress */}
            <div style={styles.modernDialogueHeader}>
              <div style={styles.modernProgressContainer}>
                <div style={{
                  ...styles.modernMissionTitle,
                  color: theme.borderColor
                }}>
                  {isMission3Completion ? 'MISSION: CONTEXT UNDERSTANDING COMPLETE' : (isMission2Completion ? 'MISSION: DATA LABELING COMPLETE' : (isPhase2 ? 'MISSION: DATA ANALYSIS' : 'MISSION: CASTLE DEFENSE'))}
                </div>
                <div style={styles.modernStepIndicator}>
                  Step {currentStep} of {totalSteps}
                </div>
              </div>
              <div style={styles.modernProgressBar}>
                <div style={{
                  ...styles.modernProgressFill,
                  width: `${progressPercent}%`,
                  background: theme.progressColor
                }} />
              </div>
              
              {/* NPC Info and Close Button Container */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                {/* NPC Info */}
                <div style={styles.modernNpcInfo}>
                  <img 
                    src={theme.avatar} 
                    alt="Alpha" 
                    style={styles.modernNpcAvatar}
                  />
                  <div>
                    <div style={styles.modernNpcName}>Alpha</div>
                    <div style={styles.modernNpcStatus}>Castle AI System</div>
                  </div>
                </div>
                
                {/* Close Button - Aligned with NPC avatar top */}
                <button 
                  style={styles.modernCloseButton}
                  onClick={handleCloseAlphaDialogue}
                  onMouseOver={(e) => e.target.style.color = '#333'}
                  onMouseOut={(e) => e.target.style.color = '#999'}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Messages Content */}
            <div style={styles.modernDialogueContent}>
              {/* Phase 1 Messages */}
              {!isPhase2 && alphaDialogueMessages.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                
                if (message.type === 'message') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                      <p style={styles.modernNpcText}>
                        {currentTypingMessage && currentTypingMessage === message ? (
                          <>
                            {formatTextWithBold(alphaDisplayedText)}
                            {alphaIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
                          </>
                        ) : (
                          formatTextWithBold(message.text)
                        )}
                      </p>
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'choice' && message.isUser) {
                  return (
                    <div key={index} style={styles.modernUserMessage}>
                      <div style={styles.modernUserSpeaker}>YOU:</div>
                      <div style={{
                        ...styles.modernUserBubble,
                        background: theme.borderColor
                      }}>
                        <p style={styles.modernUserText}>{message.text}</p>
                      </div>
                      <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                    </div>
                  )
                }
                
                return null
              })}
              
              {/* Phase 1 Choice Button */}
              {!isPhase2 && waitingForChoice && currentAlphaStep < alphaDialogueFlow.length && (
                <button 
                  style={{
                    ...styles.modernActionButton,
                    ...(alphaDialogueFlow[currentAlphaStep].type === 'missionAccept' ? {
                      background: theme.borderColor,
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      padding: '15px 30px',
                      border: 'none',
                    } : {})
                  }}
                  onClick={() => {
                    if (alphaDialogueFlow[currentAlphaStep].type === 'missionAccept') {
                      // Close dialogue and start mission immediately
                      handleCloseAlphaDialogue()
                    } else {
                      handleAlphaChoice(alphaDialogueFlow[currentAlphaStep].text)
                    }
                  }}
                  onMouseOver={(e) => {
                    if (alphaDialogueFlow[currentAlphaStep].type === 'missionAccept') {
                      e.target.style.transform = 'scale(1.05)'
                    } else {
                      e.target.style.borderColor = theme.borderColor
                      e.target.style.transform = 'translateX(5px)'
                    }
                  }}
                  onMouseOut={(e) => {
                    if (alphaDialogueFlow[currentAlphaStep].type === 'missionAccept') {
                      e.target.style.transform = 'scale(1)'
                    } else {
                      e.target.style.borderColor = '#E0E0E0'
                      e.target.style.transform = 'translateX(0)'
                    }
                  }}
                >
                  {alphaDialogueFlow[currentAlphaStep].type === 'missionAccept' ? (
                    alphaDialogueFlow[currentAlphaStep].text
                  ) : (
                    <>
                      <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                      {alphaDialogueFlow[currentAlphaStep].text}
                    </>
                  )}
                </button>
              )}

              {/* Phase 2 Messages */}
              {isPhase2 && phase2Messages.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                
                if (message.type === 'message') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                      <p style={styles.modernNpcText}>{formatDialogueText(message.text)}</p>
                      {message.image && (
                        <img src={message.image} alt="Comparison" style={{width: '100%', height: 'auto', borderRadius: '10px', marginTop: '8px'}} />
                      )}
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'choice' && message.isUser) {
                  return (
                    <div key={index} style={styles.modernUserMessage}>
                      <div style={styles.modernUserSpeaker}>YOU:</div>
                      <div style={{
                        ...styles.modernUserBubble,
                        background: message.isCorrect === true ? '#28a745' : 
                                   message.isCorrect === false ? '#dc3545' : theme.borderColor
                      }}>
                        <p style={{
                          ...styles.modernUserText,
                          color: message.isCorrect !== undefined ? 'white' : '#333'
                        }}>
                          {message.text}
                          {message.isCorrect === true && ' ✓'}
                          {message.isCorrect === false && ' ✗'}
                        </p>
                      </div>
                      <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                    </div>
                  )
                }
                
                return null
              })}

              {/* Phase 2 Choice Button */}
              {isPhase2 && waitingForPhase2Choice && currentPhase2Step < alphaPhase2DialogueFlow.length && (
                <button 
                  style={styles.modernActionButton}
                  onClick={() => handlePhase2Choice(alphaPhase2DialogueFlow[currentPhase2Step].text)}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = theme.borderColor
                    e.target.style.transform = 'translateX(5px)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#E0E0E0'
                    e.target.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                  {alphaPhase2DialogueFlow[currentPhase2Step].text}
                </button>
              )}

              {/* Quiz Interface */}
              {isPhase2 && showQuiz && currentPhase2Step < alphaPhase2DialogueFlow.length && (
                <div style={{width: '100%', marginTop: '10px'}}>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={{...styles.modernNpcText, fontWeight: 600}}>
                      {alphaPhase2DialogueFlow[currentPhase2Step].question}
                    </p>
                  </div>
                  
                  {alphaPhase2DialogueFlow[currentPhase2Step].options.map((option, index) => (
                    <button
                      key={index}
                      style={styles.modernActionButton}
                      onClick={() => handleQuizAnswer(index)}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = theme.borderColor
                        e.target.style.transform = 'translateX(5px)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#E0E0E0'
                        e.target.style.transform = 'translateX(0)'
                      }}
                    >
                      <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                      {option.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Accepted Button - Start Mission 2 (replaces WHY button) */}
              {isPhase2 && showMission2StartButton && (
                <button 
                  style={styles.modernActionButton}
                  onClick={handleStartLabeling}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = theme.borderColor
                    e.target.style.transform = 'translateX(5px)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#E0E0E0'
                    e.target.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                  Accepted
                </button>
              )}

              {/* Mission 2 Completion Messages */}
              {isMission2Completion && mission2CompletionMessages.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                
                if (message.type === 'message') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                      <p style={styles.modernNpcText}>{formatDialogueText(message.text)}</p>
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'choice' && message.isUser) {
                  return (
                    <div key={index} style={styles.modernUserMessage}>
                      <div style={styles.modernUserSpeaker}>YOU:</div>
                      <div style={{
                        ...styles.modernUserBubble,
                        background: message.isCorrect === true ? '#28a745' : 
                                   message.isCorrect === false ? '#dc3545' : theme.borderColor
                      }}>
                        <p style={{
                          ...styles.modernUserText,
                          color: message.isCorrect !== undefined ? 'white' : '#333'
                        }}>
                          {message.text}
                          {message.isCorrect === true && ' ✓'}
                          {message.isCorrect === false && ' ✗'}
                        </p>
                      </div>
                      <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                    </div>
                  )
                }
                
                return null
              })}

              {/* Mission 2 Completion Quiz */}
              {isMission2Completion && showMission2CompletionQuiz && currentMission2CompletionStep < mission2CompletionFlow.length && (
                <div style={{width: '100%', marginTop: '10px'}}>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={{...styles.modernNpcText, fontWeight: 600}}>
                      {mission2CompletionFlow[currentMission2CompletionStep].question}
                    </p>
                  </div>
                  
                  {mission2CompletionFlow[currentMission2CompletionStep].options.map((option, index) => (
                    <button
                      key={index}
                      style={styles.modernActionButton}
                      onClick={() => handleMission2CompletionQuizAnswer(index)}
                      onMouseOver={(e) => {
                        e.target.style.borderColor = theme.borderColor
                        e.target.style.transform = 'translateX(5px)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.borderColor = '#E0E0E0'
                        e.target.style.transform = 'translateX(0)'
                      }}
                    >
                      <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                      {option.text}
                    </button>
                  ))}
                </div>
              )}

              {/* Accepted Button - Start Mission 3 */}
              {isMission2Completion && !showMission2CompletionQuiz && 
               currentMission2CompletionStep < mission2CompletionFlow.length && 
               mission2CompletionFlow[currentMission2CompletionStep].type === 'action' && (
                <button 
                  style={styles.modernActionButton}
                  onClick={handleStartMission3}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = theme.borderColor
                    e.target.style.transform = 'translateX(5px)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = '#E0E0E0'
                    e.target.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                  {mission2CompletionFlow[currentMission2CompletionStep].text}
                </button>
              )}
              
              {/* Mission 3 Completion Messages */}
              {isMission3Completion && alphaDialogueHistory.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                
                if (message.type === 'alpha') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                      <p style={styles.modernNpcText}>{formatTextWithBold(message.text)}</p>
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'user') {
                  return (
                    <div key={index} style={styles.modernUserMessage}>
                      <div style={styles.modernUserSpeaker}>YOU:</div>
                      <div style={{
                        ...styles.modernUserBubble,
                        background: theme.borderColor
                      }}>
                        <p style={styles.modernUserText}>{message.text}</p>
                      </div>
                      <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                    </div>
                  )
                }
                
                return null
              })}
              
              {/* Mission 3 Quiz 1 Intro */}
              {isMission3Completion && alphaDialogueStep === 'quiz1_intro' && (
                <div style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                  <p style={styles.modernNpcText}>
                    {formatTextWithBold("Threats cleared.\n\nI nearly fired the defense lasers—at a celebration… and a worker just battling the wind.\n\nMy core logic failed me.")}
                  </p>
                  <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                </div>
              )}
              
              {/* Mission 3 Quiz 1 */}
              {isMission3Completion && alphaDialogueStep === 'quiz1' && (
                <>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={{...styles.modernNpcText, fontWeight: 600}}>
                      Why did the meaning of the 'Iron Sheet' change completely?
                    </p>
                  </div>
                  
                  {[
                    { text: "A. Because the iron sheet changed shape.", correct: false },
                    { text: "B. Because context (the weather) changes how we interpret an action.", correct: true },
                    { text: "C. Because the worker yelled at me.", correct: false }
                  ].map((option, index) => (
                    <button
                      key={index}
                      style={{
                        ...styles.modernActionButton,
                        ...(wrongAnswerIndex === index ? {
                          borderColor: '#FF0845',
                          background: '#ffe0e6'
                        } : {})
                      }}
                      onClick={() => handleMission3QuizAnswer(index, option.correct)}
                      onMouseOver={(e) => {
                        if (wrongAnswerIndex !== index) {
                          e.target.style.borderColor = theme.borderColor
                          e.target.style.transform = 'translateX(5px)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (wrongAnswerIndex !== index) {
                          e.target.style.borderColor = '#E0E0E0'
                          e.target.style.transform = 'translateX(0)'
                        }
                      }}
                    >
                      <span style={{fontSize: '16px', color: wrongAnswerIndex === index ? '#FF0845' : theme.borderColor}}>→</span>
                      {option.text}
                    </button>
                  ))}
                </>
              )}
              
              {/* Mission 3 Quiz 1 Feedback */}
              {isMission3Completion && alphaDialogueStep === 'quiz1_feedback' && (
                <div style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                  <p style={styles.modernNpcText}>
                    {formatTextWithBold("The action didn't change. Only the context did—the sandstorm, the setting, the intent.")}
                  </p>
                  <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                </div>
              )}
              
              {/* Mission 3 Quiz 2 */}
              {isMission3Completion && alphaDialogueStep === 'quiz2' && (
                <>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={{...styles.modernNpcText, fontWeight: 600}}>
                      If you hadn't helped me, I would have attacked them. What does this teach us about AI?
                    </p>
                  </div>
                  
                  {[
                    { text: "A. AI is always right.", correct: false },
                    { text: "B. AI needs human context and common sense to make good decisions.", correct: true },
                    { text: "C. AI should work alone.", correct: false }
                  ].map((option, index) => (
                    <button
                      key={index}
                      style={{
                        ...styles.modernActionButton,
                        ...(wrongAnswerIndex === index ? {
                          borderColor: '#FF0845',
                          background: '#ffe0e6'
                        } : {})
                      }}
                      onClick={() => handleMission3QuizAnswer(index, option.correct)}
                      onMouseOver={(e) => {
                        if (wrongAnswerIndex !== index) {
                          e.target.style.borderColor = theme.borderColor
                          e.target.style.transform = 'translateX(5px)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (wrongAnswerIndex !== index) {
                          e.target.style.borderColor = '#E0E0E0'
                          e.target.style.transform = 'translateX(0)'
                        }
                      }}
                    >
                      <span style={{fontSize: '16px', color: wrongAnswerIndex === index ? '#FF0845' : theme.borderColor}}>→</span>
                      {option.text}
                    </button>
                  ))}
                </>
              )}
              {/* Mission 3 Quiz 1 Feedback */}
              {isMission3Completion && alphaDialogueStep === 'quiz1_feedback' && (
                <>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={styles.modernNpcText}>
                      {formatTextWithBold("The action didn't change. Only the context did—the sandstorm, the setting, the intent.")}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  <button 
                    style={styles.modernActionButton}
                    onClick={handleMission3QuizContinue}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = theme.borderColor
                      e.target.style.transform = 'translateX(5px)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#E0E0E0'
                      e.target.style.transform = 'translateX(0)'
                    }}
                  >
                    <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                    CONTINUE
                  </button>
                </>
              )}
              
              {/* Mission 3 Complete */}
              {isMission3Completion && alphaDialogueStep === 'complete' && (
                <>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={styles.modernNpcText}>
                      {formatTextWithBold("Exactly.\n\nI process data—but you bring the common sense and context I'll never have on my own.")}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  <button 
                    style={styles.modernActionButton}
                    onClick={() => {
                      playSelectSound()
                      setAlphaDialogueStep('mission4_part1')
                      setAlphaDialogueHistory(prev => [...prev, { type: 'alpha', text: "Exactly.\n\nI process data—but you bring the common sense and context I'll never have on my own." }])
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = theme.borderColor
                      e.target.style.transform = 'translateX(5px)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#E0E0E0'
                      e.target.style.transform = 'translateX(0)'
                    }}
                  >
                    <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                    CONTINUE
                  </button>
                </>
              )}
              
              {/* Mission 4 Part 1 */}
              {isMission3Completion && alphaDialogueStep === 'mission4_part1' && (
                <div style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                  <p style={styles.modernNpcText}>
                    {formatTextWithBold("One final task… and it's urgent.\n\nGo to the gate of the castle. For each leaf image, you'll see labels from three expert biologists: Healthy, Infected, or Uncertain.")}
                  </p>
                  <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                </div>
              )}
              
              {/* Mission 4 Part 2 */}
              {isMission3Completion && alphaDialogueStep === 'mission4_part2' && (
                <div style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                  <p style={styles.modernNpcText}>
                    {formatTextWithBold("If two or more agree, the system will automatically accept the majority verdict.")}
                  </p>
                  <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                </div>
              )}
              
              {/* Mission 4 Part 3 */}
              {isMission3Completion && alphaDialogueStep === 'mission4_part3' && (
                <>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>ALPHA:</div>
                    <p style={styles.modernNpcText}>
                      {formatTextWithBold("But if all three disagree… that's where you come in. 👉 Tap \"Discussion\" to convene the experts—they'll re-examine the leaf and reach a new consensus.")}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  <button 
                    style={styles.modernActionButton}
                    onClick={() => {
                      playSelectSound()
                      setShowAlphaDialogue(false)
                      setIsMission3Completion(false)
                      setCurrentView('gate') // Change to gate view
                      setMission4Started(true)
                      setMission4LeafIndex(0)
                      setMission4VotesVisible(false) // Start with votes hidden
                      // Start typing effect for first leaf
                      setTimeout(() => {
                        startMission4LeafTyping(0)
                      }, 500)
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = theme.borderColor
                      e.target.style.transform = 'translateX(5px)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#E0E0E0'
                      e.target.style.transform = 'translateX(0)'
                    }}
                  >
                    <span style={{fontSize: '16px', color: theme.borderColor}}>→</span>
                    MISSION ACCEPTED
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })()}

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
          <img 
            src="/desert/icon/desert.svg" 
            alt="Desert" 
            style={{
              width: '120px',
              height: '120px',
              marginBottom: '30px',
              animation: 'spin 2s linear infinite',
            }}
          />
          <div style={styles.mission3LoadingText}>
            {loadingText}
            {loadingTyping && <span style={styles.loadingCursor}></span>}
          </div>
        </div>
      )}
      
      {/* Camera Interface - Mobile UI Style */}
      {showNpcCamera && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Camera Video */}
          <div style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <video
              id="npcCameraVideo"
              autoPlay
              playsInline
              ref={(video) => {
                if (video && npcCameraStream) {
                  video.srcObject = npcCameraStream
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            
            {/* Scanning Lines Effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)',
              pointerEvents: 'none',
            }} />
            
            {/* Focus Frame - Top Left */}
            <div style={{
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: '60px',
              height: '60px',
              borderTop: '5px solid #FABA14',
              borderLeft: '5px solid #FABA14',
            }} />
            
            {/* Focus Frame - Top Right */}
            <div style={{
              position: 'absolute',
              top: '10%',
              right: '10%',
              width: '60px',
              height: '60px',
              borderTop: '5px solid #FABA14',
              borderRight: '5px solid #FABA14',
            }} />
            
            {/* Focus Frame - Bottom Left */}
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '10%',
              width: '60px',
              height: '60px',
              borderBottom: '5px solid #FABA14',
              borderLeft: '5px solid #FABA14',
            }} />
            
            {/* Focus Frame - Bottom Right */}
            <div style={{
              position: 'absolute',
              bottom: '20%',
              right: '10%',
              width: '60px',
              height: '60px',
              borderBottom: '5px solid #FABA14',
              borderRight: '5px solid #FABA14',
            }} />
            
            {/* Center Guide - Thicker dashed border */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              border: '4px dashed rgba(250, 186, 20, 0.7)',
              borderRadius: '10px',
            }} />
            
            {/* Close Button */}
            <button
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '2px solid #fff',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={handleCloseCamera}
            >
              ✕
            </button>
          </div>
          
          {/* Camera Controls */}
          <div style={{
            height: '180px',
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid #333',
            borderRadius: '20px 20px 0 0',
            gap: '15px',
          }}>
            {/* Zoom Controls */}
            <div style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
            }}>
              {/* Zoom Out Button */}
              <button
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(250, 186, 20, 0.6)',
                  color: '#FABA14',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(250, 186, 20, 0.2)'
                  e.currentTarget.style.borderColor = '#FABA14'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(250, 186, 20, 0.6)'
                }}
              >
                −
              </button>
              
              {/* Zoom In Button */}
              <button
                style={{
                  width: '45px',
                  height: '45px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(250, 186, 20, 0.6)',
                  color: '#FABA14',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(250, 186, 20, 0.2)'
                  e.currentTarget.style.borderColor = '#FABA14'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(250, 186, 20, 0.6)'
                }}
              >
                +
              </button>
            </div>
            
            {/* Shutter Button with breathing effect */}
            <button
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#ff3333',
                border: '4px solid #00d4ff',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(255, 51, 51, 0.4)',
                animation: 'breathe 2s ease-in-out infinite',
              }}
              onClick={handleCapturePhoto}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.9)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.9), 0 0 50px rgba(255, 51, 51, 0.6)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(255, 51, 51, 0.4)'
              }}
            />
          </div>
          
          {/* Recognizing Overlay */}
          {isRecognizing && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}>
              {/* AI is reading text */}
              <div style={{
                color: '#FABA14',
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: "'Roboto', sans-serif",
                marginBottom: '30px',
                letterSpacing: '1px',
              }}>
                AI is reading
              </div>
              
              {/* Hourglass Animation */}
              <div style={{
                position: 'relative',
                width: '80px',
                height: '100px',
                animation: 'flipHourglass 3s ease-in-out infinite',
              }}>
                {/* Top bulb */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '40px',
                  background: 'transparent',
                  border: '3px solid #FABA14',
                  borderRadius: '50% 50% 0 0',
                  borderBottom: 'none',
                  overflow: 'hidden',
                }}>
                  {/* Sand in top bulb */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    background: '#FABA14',
                    animation: 'drainSand 3s linear infinite',
                    transformOrigin: 'bottom',
                  }} />
                </div>
                
                {/* Middle neck */}
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '10px',
                  height: '20px',
                  background: 'transparent',
                  borderLeft: '3px solid #FABA14',
                  borderRight: '3px solid #FABA14',
                }}>
                  {/* Falling sand particles */}
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '2px',
                    height: '100%',
                    background: '#FABA14',
                    animation: 'fallingSand 0.5s linear infinite',
                  }} />
                </div>
                
                {/* Bottom bulb */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '40px',
                  background: 'transparent',
                  border: '3px solid #FABA14',
                  borderRadius: '0 0 50% 50%',
                  borderTop: 'none',
                  overflow: 'hidden',
                }}>
                  {/* Sand accumulating in bottom bulb */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '100%',
                    height: '0%',
                    background: '#FABA14',
                    animation: 'fillSand 3s linear infinite',
                  }} />
                </div>
              </div>
              
              {/* Keyframes for animations */}
              <style>{`
                @keyframes flipHourglass {
                  0%, 45% { transform: rotate(0deg); }
                  50%, 95% { transform: rotate(180deg); }
                  100% { transform: rotate(180deg); }
                }
                @keyframes drainSand {
                  0% { height: 100%; }
                  45% { height: 0%; }
                  50%, 100% { height: 0%; }
                }
                @keyframes fillSand {
                  0%, 5% { height: 0%; }
                  50% { height: 100%; }
                  100% { height: 100%; }
                }
                @keyframes fallingSand {
                  0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                  100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
                }
              `}</style>
            </div>
          )}
        </div>
      )}
      
      {/* Recognition Card - With AI Description and User Input */}
      {showRecognitionCard && recognitionResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#FFF9F0',
            borderRadius: '24px',
            maxWidth: '650px',
            maxHeight: '85vh', // 限制最大高度为85%视口高度
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            padding: '35px',
            position: 'relative',
            overflow: 'auto', // 允许滚动如果内容过多
          }}>
            {/* Close button */}
            <button
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '20px',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onClick={handleCloseRecognitionCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.color = '#666'
              }}
            >
              ✕
            </button>
            
            {/* Card Header */}
            <div style={{
              marginBottom: '20px',
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '5px',
              }}>
                AI noticed:
              </h3>
              <p style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#000',
                fontFamily: "'Roboto Mono', monospace",
                lineHeight: 1.4,
              }}>
                {recognitionResult.aiDescription}
              </p>
            </div>
            
            {/* Photo with solid border and timestamp */}
            <div style={{
              position: 'relative',
              marginBottom: '25px',
            }}>
              <div style={{
                border: '3px solid #333',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}>
                <img 
                  src={recognitionResult.photo}
                  alt="Captured"
                  style={{
                    width: '100%',
                    display: 'block',
                  }}
                />
                {/* Timestamp overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontFamily: "'Roboto Mono', monospace",
                  backdropFilter: 'blur(4px)',
                }}>
                  Captured: {new Date(recognitionResult.timestamp).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                  })}
                </div>
              </div>
            </div>
            
            {/* User Input Section */}
            <div style={{
              marginBottom: '25px',
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                fontFamily: "'Poppins', sans-serif",
                marginBottom: '12px',
              }}>
                You added:
              </h4>
              
              {/* Input Box with Pen Icon */}
              <div style={{
                position: 'relative',
                background: '#f7eedd',
                borderRadius: '12px',
                padding: '15px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.05)',
              }}>
                <textarea
                  value={userStory}
                  onChange={(e) => setUserStory(e.target.value)}
                  placeholder="Share your story about this moment..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '16px',
                    fontFamily: "'Roboto', sans-serif",
                    color: '#333',
                    resize: 'vertical',
                    outline: 'none',
                    paddingRight: '50px',
                  }}
                />
                
                {/* Pen Icon */}
                <img 
                  src="/desert/icon/pen-cursor.png"
                  alt="Pen"
                  style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    width: '32px',
                    height: '32px',
                    opacity: 0.4,
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
            
            {/* Send Button */}
            <button
              style={{
                width: '100%',
                padding: '16px',
                background: '#f89303',
                border: 'none',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: "'Roboto', sans-serif",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 4px 12px rgba(248, 147, 3, 0.3)',
              }}
              onClick={handleSubmitStory}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E58302'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(248, 147, 3, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f89303'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 147, 3, 0.3)'
              }}
            >
              <img 
                src="/desert/icon/send.png"
                alt="Send"
                style={{
                  width: '24px',
                  height: '24px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
              Done
            </button>
          </div>
        </div>
      )}
      
      {/* Final Instagram-Style Card */}
      {showFinalCard && recognitionResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#FFF9F0',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            padding: '35px',
            position: 'relative',
          }}>
            {/* Close button */}
            <button
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '20px',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                zIndex: 1,
              }}
              onClick={handleCloseFinalCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.color = '#666'
              }}
            >
              ✕
            </button>
            
            {/* Photo with timestamp */}
            <div style={{
              position: 'relative',
              marginBottom: '20px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
            }}>
              <img 
                src={recognitionResult.photo}
                alt="Captured moment"
                style={{
                  width: '100%',
                  display: 'block',
                }}
              />
              {/* Timestamp overlay */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.75)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontFamily: "'Roboto Mono', monospace",
                backdropFilter: 'blur(4px)',
              }}>
                Captured: {new Date(recognitionResult.timestamp).toLocaleString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </div>
            </div>
            
            {/* Social Icons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '15px',
            }}>
              <img 
                src="/desert/icon/like.png"
                alt="Like"
                style={{
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
              <img 
                src="/desert/icon/comment.png"
                alt="Comment"
                style={{
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            
            {/* Description */}
            <div style={{
              marginBottom: '15px',
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#333',
              fontFamily: "'Roboto', sans-serif",
            }}>
              <strong>Together, we see:</strong> Not just {recognitionResult.aiDescription}, but {recognitionResult.storyPreview}...
            </div>
            
            {/* Hashtags */}
            <div style={{
              marginBottom: '25px',
              fontSize: '14px',
              color: '#f89303',
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 'bold',
            }}>
              {recognitionResult.hashtags && recognitionResult.hashtags.join(' ')}
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
            }}>
              <button
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#fff',
                  border: '2px solid #f89303',
                  borderRadius: '12px',
                  color: '#f89303',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Roboto', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                onClick={handleDownloadCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFF5E6'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 147, 3, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <img 
                  src="/desert/icon/download.svg" 
                  alt="Download" 
                  style={{
                    width: '20px',
                    height: '20px',
                  }}
                />
                Download
              </button>
              
              <button
                style={{
                  flex: 1,
                  padding: '16px',
                  background: '#f89303',
                  border: '2px solid #f89303',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: "'Roboto', sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                onClick={handleSaveToJournal}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E58302'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(248, 147, 3, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f89303'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <img 
                  src="/desert/icon/save.svg" 
                  alt="Save" 
                  style={{
                    width: '20px',
                    height: '20px',
                    filter: 'brightness(0) invert(1)',
                  }}
                />
                Save to Journal
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Save Success Notification */}
      {showSaveSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}>
            {/* Close button */}
            <button
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '18px',
                color: '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onClick={() => setShowSaveSuccess(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)'
                e.currentTarget.style.color = '#000'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.color = '#666'
              }}
            >
              ✕
            </button>
            
            {/* Save icon */}
            <img 
              src="/icon/save.png"
              alt="Saved"
              style={{
                width: '60px',
                height: '60px',
                marginBottom: '20px',
              }}
            />
            
            {/* Message */}
            <div style={{
              fontSize: '18px',
              color: '#333',
              fontFamily: "'Roboto', sans-serif",
              lineHeight: 1.6,
            }}>
              Photo saved to <strong style={{ fontWeight: 'bold' }}>Explorer's Journal!</strong>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default DesertMap