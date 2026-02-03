import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

// Noise items that aren't mushrooms
const NOISE_ITEMS = ['03', '05', '07']

// All collected items (will be shown in 3 batches of 4)
const ALL_ITEMS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

// Batch groupings for noise removal display - 6 items per batch
const NOISE_BATCHES = [
  ['01', '02', '03', '04', '05', '06'],
  ['07', '08', '09', '10', '11', '12'],
]

// Dirty data for label correction
const DIRTY_DATA = {
  1: [
    { id: '01', name: 'Candy Blob', color: 'TRUE', texture: 'Smooth', spikes: 'No', toxic: 'NO' },
    { id: '02', name: 'img_file_002.png', color: 'Red', texture: 'Wavy', spikes: 'Yes', toxic: 'YES' },
    { id: '03', name: 'Velvet Star', color: 'Blue', texture: '404 Error', spikes: 'Yes', toxic: 'NO' },
    { id: '04', name: 'Polka Cluster', color: 'Green', texture: 'Smooth', spikes: 'Zero', toxic: 'NO' },
  ],
  2: [
    { id: '05', name: 'Speckled Bell', color: '#800080', texture: 'Matte', spikes: 'No', toxic: 'NO' },
    { id: '06', name: 'Glowing Shroom', color: 'Blue', texture: 'Glowing', spikes: '1', toxic: 'Safe' },
    { id: '07', name: 'Striped Chime', color: 'Orange', texture: 'Looks very nice', spikes: 'No', toxic: 'NO' },
    { id: '08', name: 'NULL', color: 'Yellow', texture: 'Glossy', spikes: 'No', toxic: 'NO' },
  ],
  3: [
    { id: '09', name: 'Frostfire Cap', color: 'Pink', texture: 'Glossy', spikes: 'N/A', toxic: 'NO' },
    { id: '10', name: 'Classic Toadstool', color: '255, 0, 0', texture: 'Matte', spikes: 'No', toxic: 'NO' },
    { id: '11', name: 'Rainbow Drip', color: 'Pastel', texture: 'Glossy', spikes: 'No', toxic: 'MAYBE' },
    { id: '12', name: 'Starlight Shroom', color: 'Purple', texture: '%&*(#@!', spikes: 'Yes', toxic: 'YES' },
  ],
}

// Error cells that need correction
const ERROR_CELLS = {
  1: [
    { id: '01', field: 'color', correct: 'Pink' },
    { id: '02', field: 'name', correct: 'Flame Bloom' },
    { id: '03', field: 'texture', correct: 'Fuzzy' },
    { id: '04', field: 'spikes', correct: 'No' },
  ],
  2: [
    { id: '05', field: 'color', correct: 'Purple' },
    { id: '06', field: 'spikes', correct: 'No' },
    { id: '06', field: 'toxic', correct: 'NO' },
    { id: '07', field: 'texture', correct: 'Striped' },
    { id: '08', field: 'name', correct: 'Drip Orb' },
  ],
  3: [
    { id: '09', field: 'spikes', correct: 'No' },
    { id: '10', field: 'color', correct: 'Red' },
    { id: '11', field: 'toxic', correct: 'NO' },
    { id: '12', field: 'texture', correct: 'Veined' },
  ],
}

const BATCH_HINTS = {
  1: "I see file names mixed with real names, and colors written as True/False! Fix the format errors in the highlighted cells.",
  2: "Someone entered Hex Codes instead of color names, and wrote a sentence in the texture column. The AI can't read sentences!",
  3: "Watch out for 'Maybe' labels and corrupted text characters. The AI needs certainty!",
}

// Missing values data for Fill Missing phase
const MISSING_DATA = [
  { id: '09', name: 'Frostfire Cap', color: 'Pink / Cyan / White', texture: 'Glossy / Glowing', spikes: null, toxic: 'YES', missingField: 'spikes', options: ['Yes', 'No'], correct: 'No' },
  { id: '02', name: 'Flame Bloom', color: 'Red / Orange', texture: null, spikes: 'Yes', toxic: 'YES', missingField: 'texture', options: ['Textured', 'Smooth', 'Plain', 'Flat'], correct: 'Textured' },
  { id: '08', name: 'Drip Orb', color: null, texture: 'Glossy / Dripping', spikes: 'No', toxic: 'YES', missingField: 'color', options: ['Yellow', 'Blue', 'Red', 'Green'], correct: 'Yellow' },
]

// Quiz data for Pre-Training Quiz
// Quiz data for Pre-Training Quiz
const PRE_TRAINING_QUIZ = [
  {
    id: 1,
    question: "Hold on! Before we push the big button, I need to make sure you understand what we are doing.\n\nQuick check: How does an AI actually learn?",
    options: [
      { text: "By analyzing patterns in data", correct: true },
      { text: "By just guessing randomly", correct: false },
    ],
    correctResponse: "Correct! AI isn't magic, and it doesn't verify answers by itself. It needs massive amounts of data to find the hidden rules.",
    incorrectResponse: "Not quite! AI doesn't just guess randomly. It learns by analyzing patterns in data. It needs massive amounts of data to find the hidden rules and make accurate predictions."
  },
  {
    id: 2,
    question: "Now, think about the data you just collected.\n\nTo help the AI decide if a mushroom is toxic, which features are actually helpful?",
    options: [
      { text: "Color, Shape, and Texture", correct: true },
      { text: "The name of the person who picked it", correct: false },
    ],
    correctResponse: "Precisely! To make accurate predictions, the AI needs data related to the object itself. Irrelevant info—like who picked it—is just Noise. It will only confuse the model!",
    incorrectResponse: "Actually, the name of the person who picked it is irrelevant! To make accurate predictions, the AI needs data related to the object itself - like Color, Shape, and Texture. Irrelevant info is just Noise and will confuse the model!"
  },
]

const TRAINING_READY_MESSAGE = "The dataset is clean. The patterns are clear. Are you ready? Let's initiate the Model Training process!"

const TRAINING_COMPLETE_QUIZ = {
  question: "Training complete! The AI has learned to identify the 'Toxic Traits'.\n\nBut wait... we need to verify if it really learned, or if it just memorized our list. How should we test the AI?",
  options: [
    { text: "Test with NEW mushrooms it hasn't seen", correct: true },
    { text: "Test with the SAME mushrooms it already studied", correct: false },
  ],
  correctResponse: "Spot on! If we test with old data, the AI is just cheating—like memorizing the answers to a test. Only by using Unseen Data (New Mushrooms) can we prove it can truly judge and generalize!",
  incorrectResponse: "Not quite! If we test with old data, the AI is just cheating—like memorizing the answers to a test. Only by using Unseen Data (New Mushrooms) can we prove it can truly judge and generalize!"
}

const QUIZ_DATA = [
  {
    question: "Hold on! Before we push the big button, I need to make sure you understand what we are doing. Quick check: How does an AI actually learn?",
    options: [
      { text: "By analyzing patterns in data", correct: true },
      { text: "By just guessing randomly", correct: false },
    ],
    correctResponse: "Correct! AI isn't magic, and it doesn't verify answers by itself. It needs massive amounts of data to find the hidden rules.",
    incorrectResponse: "Not quite! AI doesn't just guess randomly. It learns by analyzing patterns in data. It needs massive amounts of data to find the hidden rules and make accurate predictions."
  },
  {
    question: "Now, think about the data you just collected. To help the AI decide if a mushroom is toxic, which features are actually helpful?",
    options: [
      { text: "Color, Shape, and Texture", correct: true },
      { text: "The name of the person who picked it", correct: false },
    ],
    correctResponse: "Precisely! To make accurate predictions, the AI needs data related to the object itself. Irrelevant info—like who picked it—is just Noise. It will only confuse the model!",
    incorrectResponse: "Actually, the name of the person who picked it is irrelevant! To make accurate predictions, the AI needs data related to the object itself - like Color, Shape, and Texture. Irrelevant info is just Noise and will confuse the model!"
  },
]

const TRAINING_INTRO = "The dataset is clean. The patterns are clear. Are you ready? Let's initiate the Model Training process!"

const TRAINING_VOICEOVER = "Watch closely. The AI is taking the mushroom features as Input. But the Output isn't just a simple 'Yes' or 'No'. It gives us a Probability—a percentage score of how likely it is that the mushroom is toxic."

// Validation phase data
const VALIDATION_INTRO = "Training complete! The AI has learned to identify the 'Toxic Traits'. But wait... we need to verify if it really learned, or if it just memorized our list. How should we test the AI?"

const VALIDATION_OPTIONS = [
  { text: "Test with NEW mushrooms it hasn't seen", correct: true },
  { text: "Test with the SAME mushrooms it already studied", correct: false },
]

const VALIDATION_CORRECT_RESPONSE = "Spot on! If we test with old data, the AI is just cheating—like memorizing the answers to a test. Only by using Unseen Data (New Mushrooms) can we prove it can truly judge and generalize!"

// Test mushrooms for validation - 13, 14, 15 are new (correct), 04, 06, 08 are already collected (wrong)
const TEST_MUSHROOMS = [
  { id: '13', isNew: true },
  { id: '14', isNew: true },
  { id: '15', isNew: true },
  { id: '04', isNew: false },
  { id: '06', isNew: false },
  { id: '08', isNew: false },
]

// Model Adjustment phase data
const ADJUST_MODEL_DIALOGUES = [
  "Uh oh... 😱 This is bad news! The AI only got 45% correct on the new mushrooms.",
  "It's confusing 😵‍💫 the 'Death Cap' with the 'Edible Paddy Straw' mushroom! If we use this AI now, the Elf might get a tummy ache... or worse!",
  "We can't give up, but we need to fix this."
]

const ADJUST_MODEL_QUIZ = {
  question: "Think like a Data Scientist. Why is the AI failing? It probably hasn't seen enough examples of the tricky mushrooms yet.\n\nWhat should we do to improve the AI's accuracy?",
  options: [
    { text: "Feed it MORE varied photos & Retrain", correct: true },
    { text: "Only test it on mushrooms it knows", correct: false },
    { text: "Change the code to say 'Safe' for everything", correct: false },
  ],
  correctResponse: "Brilliant! 🌟 Option B is cheating (and dangerous!), and Option C is just lazy code.",
  incorrectResponse: "That won't help the AI learn better! Think about what data scientists do."
}

const ADJUST_MODEL_OPTIONS = [
  { text: "Feed it MORE varied photos & Retrain", correct: true },
  { text: "Only test it on mushrooms it knows", correct: false },
  { text: "Change the code to say 'Safe' for everything", correct: false },
]

const ADJUST_CORRECT_RESPONSE = "Brilliant! 🌟 Option B is cheating (and dangerous!), and Option C is just lazy code."

const TRAINING_PHOTOS = [
  { id: '16', isGood: true },
  { id: '17', isGood: true },
  { id: '18', isGood: true },
  { id: '19', isGood: true },
  { id: '26', isGood: true },
  { id: '27', isGood: false, duplicateOf: '12' },
  { id: '20', isGood: false, duplicateOf: '12' },
  { id: '21', isGood: false, duplicateOf: '11' },
]

// Color Map positions and data
const MAP_POSITIONS = {
  BOTTOM_LEFT: 0,
  BOTTOM_RIGHT: 1,
  TOP_LEFT: 2,
  TOP_RIGHT: 3,
}

// Navigation directions available from each position
const colorMapNavigation = {
  [MAP_POSITIONS.BOTTOM_LEFT]: { up: MAP_POSITIONS.TOP_LEFT, right: MAP_POSITIONS.BOTTOM_RIGHT },
  [MAP_POSITIONS.BOTTOM_RIGHT]: { up: MAP_POSITIONS.TOP_RIGHT, left: MAP_POSITIONS.BOTTOM_LEFT },
  [MAP_POSITIONS.TOP_LEFT]: { down: MAP_POSITIONS.BOTTOM_LEFT, right: MAP_POSITIONS.TOP_RIGHT },
  [MAP_POSITIONS.TOP_RIGHT]: { down: MAP_POSITIONS.BOTTOM_RIGHT, left: MAP_POSITIONS.TOP_LEFT },
}

// CSS transform values for each position
const mapPositionTransforms = {
  [MAP_POSITIONS.BOTTOM_LEFT]: 'translate(0%, -50%)',
  [MAP_POSITIONS.BOTTOM_RIGHT]: 'translate(-50%, -50%)',
  [MAP_POSITIONS.TOP_LEFT]: 'translate(0%, 0%)',
  [MAP_POSITIONS.TOP_RIGHT]: 'translate(-50%, 0%)',
}

// Mushroom positions in color map
const colorMapMushrooms = {
  [MAP_POSITIONS.TOP_RIGHT]: [
    { id: '17', size: 500, left: '0px', bottom: '0px', status: 'DANGER', toxicity: '99% Toxic' },
  ],
  [MAP_POSITIONS.BOTTOM_LEFT]: [
    { id: '26', size: 400, right: '50px', bottom: '50px', status: 'DANGER', toxicity: '98% Toxic' },
    { id: '14', size: 300, left: '50px', bottom: '100px', status: 'DANGER', toxicity: '94% Toxic' },
    { id: '24', size: 200, left: '800px', top: '400px', status: 'EDIBLE', toxicity: '90% Safe' },
  ],
  [MAP_POSITIONS.BOTTOM_RIGHT]: [
    { id: '21', size: 400, right: '300px', bottom: '0px', status: 'DANGER', toxicity: '99% Toxic' },
    { id: '22', size: 200, right: '0px', bottom: '250px', status: 'EDIBLE', toxicity: '92% Safe' },
    { id: '15', size: 250, left: '100px', top: '100px', status: 'DANGER', toxicity: '90% Toxic' },
  ],
  [MAP_POSITIONS.TOP_LEFT]: [
    { id: '25', size: 400, left: '50px', bottom: '200px', status: 'DANGER', toxicity: '99% Toxic' },
    { id: '18', size: 250, left: '500px', top: '0px', status: 'DANGER', toxicity: '95% Toxic' },
    { id: '23', size: 200, left: '500px', bottom: '0px', status: 'EDIBLE', toxicity: '95% Safe' },
    { id: '19', size: 200, right: '550px', top: '350px', status: 'DANGER', toxicity: '91% Toxic' },
  ],
}

// NPC positions in color map
const colorMapNpcs = {
  [MAP_POSITIONS.TOP_RIGHT]: {
    npc: 'npc_c',
    image: '/jungle/npc_c2.gif',
    right: '20%',
    top: '5%',
    height: '66.67vh',
    width: 'auto',
    dialogues: [
      [
        "We're back online! And the system is running smoothly.",
        "The workers have their lunch, and everyone is safe thanks to you.",
        "But the forest is huge and full of surprises. Since you have the scanner... why not take a look around?",
        "Go ahead, try to see which other mushrooms are EDIBLE. Who knows? You might find something rare!"
      ],
      ["Production is up! No more sick days!"]
    ]
  },
  [MAP_POSITIONS.BOTTOM_LEFT]: {
    npc: 'npc_a',
    image: '/jungle/npc_a2.gif',
    right: '40%',
    bottom: '5%',
    height: '540px',
    width: 'auto',
    dialogues: [
      [
        "Yay! No stomach ache today.",
        "I'd love to see the world through your eyes—would you show me?"
      ]
    ]
  },
  [MAP_POSITIONS.BOTTOM_RIGHT]: {
    npc: 'npc_b',
    image: '/jungle/npc_b.gif',
    left: '5%',
    bottom: '0%',
    height: '450px',
    width: 'auto',
    dialogues: [
      [
        "This new scanner is like magic. It knows everything!",
        "I'd love to see the world through your eyes—would you show me?"
      ]
    ]
  },
}

const DataCleaning = ({ onComplete, onExit }) => {
  const { t } = useLanguage()
  const [phase, setPhase] = useState('INTRO') // INTRO, NOISE_REMOVAL, LABEL_CORRECTION, FILL_MISSING_INTRO, FILL_MISSING, QUIZ, TRAINING, VALIDATION_INTRO, VALIDATION_DATA, ADJUST_MODEL_INTRO, ADJUST_MODEL_DATA, ADJUST_MODEL_TRAINING, LOADING, COLOR_MAP_EXPLORATION, COMPLETE
  const [noiseBatch, setNoiseBatch] = useState(0)
  const [removedItems, setRemovedItems] = useState([])
  const [progressLoaded, setProgressLoaded] = useState(false) // Flag to prevent saving before loading
  const [wrongSelections, setWrongSelections] = useState([]) // Track wrong selections with red border
  
  // Modern Ranger Moss dialogue states
  const [showModernRangerDialogue, setShowModernRangerDialogue] = useState(false)
  const [rangerMessages, setRangerMessages] = useState([])
  const [currentRangerStep, setCurrentRangerStep] = useState(0)
  const [rangerDisplayedText, setRangerDisplayedText] = useState('')
  const [rangerIsTyping, setRangerIsTyping] = useState(false)
  const [currentTypingMessage, setCurrentTypingMessage] = useState(null)
  const [waitingForRangerAction, setWaitingForRangerAction] = useState(false)

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const dataCleaningProgress = userData.dataCleaningProgress
      const rangerMossPhase = userData.rangerMossPhase || 1
      
      console.log('=== DataCleaning Loading ===')
      console.log('rangerMossPhase:', rangerMossPhase)
      console.log('dataCleaningProgress:', dataCleaningProgress)
      
      if (dataCleaningProgress) {
        const loadedPhase = dataCleaningProgress.phase || 'INTRO'
        console.log('Loading phase:', loadedPhase)
        setPhase(loadedPhase)
        setNoiseBatch(dataCleaningProgress.noiseBatch || 0)
        setRemovedItems(dataCleaningProgress.removedItems || [])
        console.log('Loaded Data Cleaning progress:', dataCleaningProgress)
      } else {
        console.log('No dataCleaningProgress found, starting from INTRO')
      }
    }
    // Mark progress as loaded
    setProgressLoaded(true)
  }, [])

  // Save progress when phase changes (only after initial load)
  useEffect(() => {
    if (!progressLoaded) return // Don't save until progress is loaded
    
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.dataCleaningProgress = {
        phase,
        noiseBatch,
        removedItems,
        lastSaved: Date.now()
      }
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Saved Data Cleaning progress:', userData.dataCleaningProgress)
    }
  }, [phase, noiseBatch, removedItems, progressLoaded])
  const [labelBatch, setLabelBatch] = useState(1)
  const [selectedCells, setSelectedCells] = useState([]) // Cells user clicked as errors
  const [wrongCells, setWrongCells] = useState([]) // Cells user clicked incorrectly
  const [showGlitchHint, setShowGlitchHint] = useState(false)
  const [glitchHintText, setGlitchHintText] = useState('')
  const [showRangerDialogue, setShowRangerDialogue] = useState(false)
  const [rangerDialogueIndex, setRangerDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [dialogueHistory, setDialogueHistory] = useState([]) // Keep all dialogue messages
  
  // Fill Missing Values state
  const [currentMissingIndex, setCurrentMissingIndex] = useState(0)
  const [filledValues, setFilledValues] = useState({})
  const [selectedMissingCell, setSelectedMissingCell] = useState(null)
  const [showOptions, setShowOptions] = useState(false)
  
  // Quiz state
  const [chatMessages, setChatMessages] = useState([])
  const [quizStep, setQuizStep] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [showTrainingVoiceover, setShowTrainingVoiceover] = useState(false)
  
  // Pre-Training Quiz state (modern dialogue)
  const [preTrainingQuizStep, setPreTrainingQuizStep] = useState(0)
  const [preTrainingAnswered, setPreTrainingAnswered] = useState(false)
  const [showTrainingReadyButton, setShowTrainingReadyButton] = useState(false)
  const [trainingCompleteQuizAnswered, setTrainingCompleteQuizAnswered] = useState(false)
  const [selectedQuizOption, setSelectedQuizOption] = useState(null) // Track selected option
  const [wrongQuizOption, setWrongQuizOption] = useState(null) // Track wrong option for red border
  
  // Validation state
  const [validationStep, setValidationStep] = useState(0) // 0: question, 1: answered correctly, 2: data selection
  const [selectedTestMushrooms, setSelectedTestMushrooms] = useState([]) // Selected mushroom IDs for testing
  const [isScanning, setIsScanning] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [accuracyProgress, setAccuracyProgress] = useState(0) // Animated progress from 0 to 45
  const [sliderPosition, setSliderPosition] = useState(0) // Position of slider (0 to maxSlide)
  const [isDragging, setIsDragging] = useState(false)
  const sliderContainerRef = React.useRef(null)

  // Model Adjustment state
  const [adjustDialogueIndex, setAdjustDialogueIndex] = useState(0)
  const [adjustStep, setAdjustStep] = useState(0) // 0: dialogues, 1: choice, 2: data selection, 3: retraining
  const [selectedTrainingPhotos, setSelectedTrainingPhotos] = useState([])
  const [feedbackPhoto, setFeedbackPhoto] = useState(null) // Which photo to show in feedback panel
  const [adjustProgress, setAdjustProgress] = useState(0)
  const [adjustQuizAnswered, setAdjustQuizAnswered] = useState(false)
  const [showSelectDataButton, setShowSelectDataButton] = useState(false)
  const [showRangerPraise, setShowRangerPraise] = useState(false)
  const [finalAccuracyProgress, setFinalAccuracyProgress] = useState(0) // Animated progress from 0 to 95
  const adjustSliderRef = React.useRef(null)
  const [adjustSliderPos, setAdjustSliderPos] = useState(0)
  const [isAdjustDragging, setIsAdjustDragging] = useState(false)
  const [adjustDisplayedText, setAdjustDisplayedText] = useState('')
  const [isAdjustTyping, setIsAdjustTyping] = useState(false)
  const [adjustDialogueHistory, setAdjustDialogueHistory] = useState([])
  const [selectedWrongOption, setSelectedWrongOption] = useState(null) // Track which wrong option was selected
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false) // Only show when clicking wrong photo

  // Color Map Exploration state
  const [mapPosition, setMapPosition] = useState(3) // 0: bottom-left, 1: bottom-right, 2: top-left, 3: top-right (start from top-right)
  const [isMapTransitioning, setIsMapTransitioning] = useState(false)
  const [showNpcDialogue, setShowNpcDialogue] = useState(false)
  const [npcDialogueText, setNpcDialogueText] = useState('')
  const [currentNpc, setCurrentNpc] = useState(null)
  
  // Glitch chat states for COLOR_MAP_EXPLORATION
  const [showGlitchChatDialogue, setShowGlitchChatDialogue] = useState(false)
  const [glitchChatInput, setGlitchChatInput] = useState('')
  const [glitchChatHistory, setGlitchChatHistory] = useState([])
  const [isGlitchChatTyping, setIsGlitchChatTyping] = useState(false)
  
  // Camera states for NPC photo feature in color map
  const [showNpcCamera, setShowNpcCamera] = useState(false)
  const [npcCameraStream, setNpcCameraStream] = useState(null)
  const [npcCapturedPhoto, setNpcCapturedPhoto] = useState(null)
  const [currentPhotoNpc, setCurrentPhotoNpc] = useState(null)
  const [showRecognitionCard, setShowRecognitionCard] = useState(false)
  const [recognitionResult, setRecognitionResult] = useState(null)
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [showValidationCard, setShowValidationCard] = useState(true) // Show validation card by default
  const [npcClickCount, setNpcClickCount] = useState({ npc_c: 0 })
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [clickedMushroom, setClickedMushroom] = useState(null) // Track which mushroom is clicked
  const [currentDialogueSet, setCurrentDialogueSet] = useState(0) // Track which dialogue set (first click, second click, etc.)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0) // Track current sentence in dialogue set
  
  // Color Map NPC typing effect states
  const [colorMapNpcDisplayedText, setColorMapNpcDisplayedText] = useState('')
  const [colorMapNpcIsTyping, setColorMapNpcIsTyping] = useState(false)
  const [colorMapNpcAutoShown, setColorMapNpcAutoShown] = useState({}) // Track which NPCs have auto-shown dialogue
  const [dialogueInitialized, setDialogueInitialized] = useState(false) // Prevent duplicate dialogue initialization

  const rangerDialogues = [
    "Outstanding work, Human! You've gathered enough raw data. But... we can't feed this directly to the <strong>AI</strong>. Not yet.",
    "In the world of AI, there is a golden rule: <strong>'Garbage In, Garbage Out'</strong>. If we train the model with messy data, it will learn the wrong lessons.",
    "We must enter the <strong>Data Cleaning Phase</strong>.",
  ]

  const labelIntroDialogues = [
    "Great job removing the noise. Now, look at this <strong>Data Table</strong>.",
    "The auto-tagging system was glitching, so some <strong>Labels</strong> are wrong. Click on the cells you think contain errors!",
    "Here's what to watch for:",
    "<strong>Color</strong> should be plain color names like Purple, Red / White, or Lavender—not codes like #2323332, RGB values like rgb(255,0,0), or random strings like 7F3A9C.",
    "<strong>Texture</strong> needs descriptive words—Smooth, Rough, Striped—not yes/no answers, booleans like True, or numbers like 1.",
    "<strong>Toxic</strong> is strictly Yes or No. Anything fuzzy like Maybe, Probably, N/A, or idk? That's a glitch.",
    "If you see any of that nonsense—click the cell and flag it!"
  ]
  
  const fillMissingIntroDialogues = [
    "Some data fields are completely <strong>Empty (Null)</strong>.",
    "The AI cannot learn from nothing! Click on the <strong>empty cells</strong>.",
    "I will project the hologram (photo) of the mushroom. Look at the photo, and <strong>fill in the blank</strong>."
  ]
  
  const preTrainingQuizDialogues = [
    { type: 'message', text: "Hold on! Before we push the big button, I need to make sure you understand what we are doing." },
    { 
      type: 'quiz', 
      question: "Quick check: How does an AI actually learn?",
      options: [
        { text: "By analyzing patterns in data", correct: true },
        { text: "By just guessing randomly", correct: false },
      ],
      correctResponse: "Correct! AI isn't magic, and it doesn't verify answers by itself. It needs massive amounts of data to find the hidden rules.",
      incorrectResponse: "Not quite! AI doesn't just guess randomly. It learns by analyzing patterns in data."
    },
    { 
      type: 'quiz', 
      question: "Now, think about the data you just collected. To help the AI decide if a mushroom is toxic, which features are actually helpful?",
      options: [
        { text: "Color, Shape, and Texture", correct: true },
        { text: "The name of the person who picked it", correct: false },
      ],
      correctResponse: "Precisely! To make accurate predictions, the AI needs data related to the object itself. Irrelevant info—like who picked it—is just Noise. It will only confuse the model!",
      incorrectResponse: "Actually, the name of the person who picked it is irrelevant! The AI needs data related to the object itself."
    },
    { type: 'message', text: "The dataset is clean. The patterns are clear. Are you ready? Let's initiate the Model Training process!" },
  ]
  
  const validationIntroDialogues = [
    { type: 'message', text: "Training complete! The AI has learned to identify the 'Toxic Traits'." },
    { 
      type: 'quiz', 
      question: "But wait... we need to verify if it really learned, or if it just memorized our list. How should we test the AI?",
      options: [
        { text: "Test with NEW mushrooms it hasn't seen", correct: true },
        { text: "Test with the SAME mushrooms it already studied", correct: false },
      ],
      correctResponse: "Spot on! If we test with old data, the AI is just cheating—like memorizing the answers to a test. Only by using Unseen Data (New Mushrooms) can we prove it can truly judge and generalize!",
      incorrectResponse: "Not quite! Testing with the same data is like cheating. We need NEW mushrooms to verify real learning."
    }
  ]
  
  const adjustModelIntroDialogues = [
    "Uh oh... 😱 This is bad news! The AI only got 45% correct on the new mushrooms.",
    "It's confusing 😵‍💫 the 'Death Cap' with the 'Edible Paddy Straw' mushroom! If we use this AI now, the Elf might get a tummy ache... or worse!",
    "We can't give up, but we need to fix this.",
    {
      type: 'quiz',
      question: "Think like a Data Scientist. Why is the AI failing? It probably hasn't seen enough examples of the tricky mushrooms yet. What should we do to improve the AI's accuracy?",
      options: [
        { text: "Feed it MORE varied photos & Retrain", correct: true },
        { text: "Only test it on mushrooms it knows", correct: false },
        { text: "Change the code to say 'Safe' for everything", correct: false },
      ],
      correctResponse: "Brilliant! 🌟 Option B is cheating (and dangerous!), and Option C is just lazy code.",
      incorrectResponse: "That won't help the AI learn better! Think about what data scientists do."
    }
  ]

  // Reset selected cells when batch changes
  useEffect(() => {
    setSelectedCells([])
    setWrongCells([])
  }, [labelBatch])

  // Typing effect for ranger dialogue
  useEffect(() => {
    if (!showRangerDialogue) return
    
    const fullText = rangerDialogues[rangerDialogueIndex]
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
  }, [rangerDialogueIndex, showRangerDialogue])

  useEffect(() => {
    if (phase === 'INTRO' && !dialogueInitialized) {
      setTimeout(() => {
        setShowModernRangerDialogue(true)
        setDialogueInitialized(true)
        startRangerDialogue()
      }, 500)
    } else if (phase === 'LABEL_INTRO' && !dialogueInitialized) {
      setTimeout(() => {
        setShowModernRangerDialogue(true)
        setDialogueInitialized(true)
        startLabelIntroDialogue()
      }, 500)
    } else if (phase === 'FILL_MISSING_INTRO' && !dialogueInitialized) {
      setTimeout(() => {
        setShowModernRangerDialogue(true)
        setDialogueInitialized(true)
        startFillMissingIntroDialogue()
      }, 500)
    }
    
    // Reset dialogue initialized flag when phase changes to a non-intro phase
    if (phase !== 'INTRO' && phase !== 'LABEL_INTRO' && phase !== 'FILL_MISSING_INTRO') {
      setDialogueInitialized(false)
    }
  }, [phase, dialogueInitialized])
  
  // Typing sound
  const [typingSound] = useState(new Audio('/sound/typing_jungle.wav'))
  
  // Sound effects
  const [trashSound] = useState(new Audio('/sound/trash.wav'))
  const [wrongSound] = useState(new Audio('/sound/wrong.mp3'))
  const [correctSound] = useState(new Audio('/sound/correct.wav'))
  const [selectSound] = useState(new Audio('/sound/select.mp3'))
  const [testSound] = useState(new Audio('/sound/test.wav'))
  
  useEffect(() => {
    trashSound.volume = 0.5
    wrongSound.volume = 0.5
    correctSound.volume = 0.5
    selectSound.volume = 0.6
    testSound.volume = 0.5
  }, [trashSound, wrongSound, correctSound, selectSound, testSound])
  
  // Format text with bold keywords (deep green color)
  const formatTextWithBold = (text) => {
    if (!text) return text
    const parts = text.split(/(<strong>.*?<\/strong>)/g)
    return parts.map((part, index) => {
      if (part.startsWith('<strong>')) {
        const content = part.replace(/<\/?strong>/g, '')
        return <span key={index} style={{ fontWeight: 700, color: '#00bf63' }}>{content}</span>
      }
      return part
    })
  }
  
  // Get current timestamp
  const getCurrentTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }
  
  // Start Ranger dialogue for INTRO
  const startRangerDialogue = () => {
    setRangerMessages([])
    setCurrentRangerStep(0)
    addRangerMessage(0)
  }
  
  // Start Label Intro dialogue
  const startLabelIntroDialogue = () => {
    setRangerMessages([])
    setCurrentRangerStep(0)
    addLabelIntroMessage(0)
  }
  
  // Start Fill Missing Intro dialogue
  const startFillMissingIntroDialogue = () => {
    setRangerMessages([])
    setCurrentRangerStep(0)
    addFillMissingIntroMessage(0)
  }
  
  // Add Ranger message with typing effect
  const addRangerMessage = (stepIndex) => {
    if (stepIndex >= rangerDialogues.length) return
    
    const text = rangerDialogues[stepIndex]
    console.log(`Adding Ranger message ${stepIndex}:`, text.substring(0, 50))
    
    const newMessage = { type: 'message', text }
    setRangerMessages(prev => {
      console.log('Current rangerMessages length:', prev.length)
      return [...prev, newMessage]
    })
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setRangerDisplayedText(text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // Check if this is the last message
        if (stepIndex === rangerDialogues.length - 1) {
          setWaitingForRangerAction(true)
        } else {
          // Auto-continue to next message
          setTimeout(() => {
            setCurrentRangerStep(stepIndex + 1)
            addRangerMessage(stepIndex + 1)
          }, 500)
        }
      }
    }, 25)
  }
  
  // Add Label Intro message with typing effect
  const addLabelIntroMessage = (stepIndex) => {
    if (stepIndex >= labelIntroDialogues.length) return
    
    const text = labelIntroDialogues[stepIndex]
    const newMessage = { type: 'message', text }
    setRangerMessages(prev => [...prev, newMessage])
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setRangerDisplayedText(text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // Check if this is the last message
        if (stepIndex === labelIntroDialogues.length - 1) {
          setWaitingForRangerAction(true)
        } else {
          // Auto-continue to next message
          setTimeout(() => {
            setCurrentRangerStep(stepIndex + 1)
            addLabelIntroMessage(stepIndex + 1)
          }, 500)
        }
      }
    }, 25)
  }
  
  // Add Fill Missing Intro message with typing effect
  const addFillMissingIntroMessage = (stepIndex) => {
    if (stepIndex >= fillMissingIntroDialogues.length) return
    
    const text = fillMissingIntroDialogues[stepIndex]
    const newMessage = { type: 'message', text }
    setRangerMessages(prev => [...prev, newMessage])
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setRangerDisplayedText(text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // Check if this is the last message
        if (stepIndex === fillMissingIntroDialogues.length - 1) {
          // Show example image after last message
          setWaitingForRangerAction(true)
        } else {
          // Auto-continue to next message
          setTimeout(() => {
            setCurrentRangerStep(stepIndex + 1)
            addFillMissingIntroMessage(stepIndex + 1)
          }, 500)
        }
      }
    }, 25)
  }
  
  // Handle Mission Accepted button
  const handleMissionAccepted = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setShowModernRangerDialogue(false)
    
    if (phase === 'INTRO') {
      setPhase('NOISE_REMOVAL')
      // Save phase progress
      const savedUser = localStorage.getItem('aiJourneyUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        userData.rangerMossPhase = 2 // Phase 2: Data Cleaning
        localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      }
    } else if (phase === 'LABEL_INTRO') {
      setPhase('LABEL_CORRECTION')
    } else if (phase === 'FILL_MISSING_INTRO') {
      setPhase('FILL_MISSING')
    }
  }

  const handleRangerContinue = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    if (isTyping) {
      setDisplayedText(rangerDialogues[rangerDialogueIndex])
      setIsTyping(false)
      return
    }

    // Add current dialogue to history
    setDialogueHistory(prev => [...prev, rangerDialogues[rangerDialogueIndex]])

    if (rangerDialogueIndex < rangerDialogues.length - 1) {
      setRangerDialogueIndex(prev => prev + 1)
    } else {
      setShowRangerDialogue(false)
      setPhase('NOISE_REMOVAL')
    }
  }

  const handleItemClick = (itemId) => {
    const isNoise = NOISE_ITEMS.includes(itemId)
    
    if (removedItems.includes(itemId)) {
      // Put back from trash
      setRemovedItems(prev => prev.filter(id => id !== itemId))
      setWrongSelections(prev => prev.filter(id => id !== itemId))
    } else {
      if (isNoise) {
        // Correct - remove to trash
        trashSound.currentTime = 0
        trashSound.play().catch(err => console.log('Trash sound error:', err))
        setRemovedItems(prev => [...prev, itemId])
        setWrongSelections(prev => prev.filter(id => id !== itemId))
      } else {
        // Wrong - show red border
        wrongSound.currentTime = 0
        wrongSound.play().catch(err => console.log('Wrong sound error:', err))
        if (!wrongSelections.includes(itemId)) {
          setWrongSelections(prev => [...prev, itemId])
        }
      }
    }
  }

  const handleNoiseNext = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Check if correct items removed in current batch
    const currentBatchItems = NOISE_BATCHES[noiseBatch]
    const noiseInBatch = currentBatchItems.filter(id => NOISE_ITEMS.includes(id))
    const correctlyRemoved = noiseInBatch.every(id => removedItems.includes(id))
    const wronglyRemoved = currentBatchItems.filter(id => 
      !NOISE_ITEMS.includes(id) && removedItems.includes(id)
    )

    if (!correctlyRemoved || wronglyRemoved.length > 0) {
      setGlitchHintText("First, look at what you collected. Some of these aren't mushrooms at all! These are what we call 'Noise'.")
      setShowGlitchHint(true)
      return
    }

    if (noiseBatch < 1) {
      setNoiseBatch(prev => prev + 1)
    } else {
      // All noise removed, move to label correction
      setPhase('LABEL_INTRO')
    }
  }

  const handleLabelIntroNext = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setPhase('LABEL_CORRECTION')
  }

  const handleCellClick = (rowId, field) => {
    const cellKey = `${rowId}-${field}`
    
    // Check if this cell is actually an error
    const errors = ERROR_CELLS[labelBatch]
    const isActualError = errors.some(e => e.id === rowId && e.field === field)
    
    if (selectedCells.includes(cellKey)) {
      // Deselect if already selected
      setSelectedCells(prev => prev.filter(c => c !== cellKey))
      setWrongCells(prev => prev.filter(c => c !== cellKey))
    } else {
      // Select the cell
      setSelectedCells(prev => [...prev, cellKey])
      
      if (isActualError) {
        // Correct selection - play correct sound
        correctSound.currentTime = 0
        correctSound.play().catch(err => console.log('Correct sound error:', err))
      } else {
        // Wrong selection - mark as wrong and play wrong sound
        setWrongCells(prev => [...prev, cellKey])
        wrongSound.currentTime = 0
        wrongSound.play().catch(err => console.log('Wrong sound error:', err))
      }
    }
  }

  const handleLabelNext = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Check if user selected exactly the correct error cells
    const errors = ERROR_CELLS[labelBatch]
    const correctCellKeys = errors.map(e => `${e.id}-${e.field}`)
    
    // Check if selected matches expected errors
    const selectedSet = new Set(selectedCells)
    const correctSet = new Set(correctCellKeys)
    
    const allCorrectSelected = correctCellKeys.every(key => selectedSet.has(key))
    const noWrongSelected = selectedCells.every(key => correctSet.has(key))

    if (!allCorrectSelected || !noWrongSelected) {
      setGlitchHintText(BATCH_HINTS[labelBatch])
      setShowGlitchHint(true)
      return
    }

    if (labelBatch < 3) {
      setLabelBatch(prev => prev + 1)
    } else {
      // Move to Fill Missing phase
      setPhase('FILL_MISSING_INTRO')
    }
  }

  const handleFillMissingIntroNext = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setPhase('FILL_MISSING')
  }

  const handleMissingCellClick = (itemId, field) => {
    const item = MISSING_DATA.find(d => d.id === itemId)
    if (item && item.missingField === field) {
      setSelectedMissingCell({ itemId, field })
      setShowOptions(true)
    }
  }

  const handleOptionSelect = (value) => {
    if (!selectedMissingCell) return
    
    const item = MISSING_DATA.find(d => d.id === selectedMissingCell.itemId)
    if (item && value === item.correct) {
      // Correct selection - play correct sound and fill the value
      correctSound.currentTime = 0
      correctSound.play().catch(err => console.log('Correct sound error:', err))
      
      setFilledValues(prev => ({
        ...prev,
        [selectedMissingCell.itemId]: value
      }))
      setSelectedMissingCell(null)
      setShowOptions(false)
    } else {
      // Wrong selection - play wrong sound and allow reselection
      wrongSound.currentTime = 0
      wrongSound.play().catch(err => console.log('Wrong sound error:', err))
      
      setGlitchHintText("Look carefully at the mushroom photo! What do you see?")
      setShowGlitchHint(true)
      // Don't close the selection, allow user to try again
    }
  }

  const handleFillMissingNext = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Check if all values are filled
    const allFilled = MISSING_DATA.every(item => filledValues[item.id])
    if (!allFilled) {
      setGlitchHintText("You still have empty cells! Click on the ❓ to fill them.")
      setShowGlitchHint(true)
      return
    }
    
    // Update rangerMossPhase to 3 (Phase 3: Model Training)
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.rangerMossPhase = 3 // Phase 3: Correct Labels + Model Training
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
    
    // Move to Pre-Training Quiz phase with modern dialogue
    setPhase('PRE_TRAINING_QUIZ')
    setPreTrainingQuizStep(0)
    setPreTrainingAnswered(false)
    setShowTrainingReadyButton(false)
    
    // Initialize modern dialogue
    setTimeout(() => {
      setShowModernRangerDialogue(true)
      startPreTrainingQuizDialogue()
    }, 500)
  }
  
  // Start Pre-Training Quiz dialogue
  const startPreTrainingQuizDialogue = () => {
    const firstQuiz = PRE_TRAINING_QUIZ[0]
    const newMessage = { type: 'message', text: firstQuiz.question }
    setRangerMessages([newMessage])
    setCurrentRangerStep(0)
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < firstQuiz.question.length) {
        setRangerDisplayedText(firstQuiz.question.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        setWaitingForRangerAction(false)
      }
    }, 25)
  }
  
  // Handle Pre-Training Quiz answer
  const handlePreTrainingQuizAnswer = (optionIndex, isCorrect) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    const currentQuiz = PRE_TRAINING_QUIZ[preTrainingQuizStep]
    
    if (isCorrect) {
      // Play correct sound
      correctSound.currentTime = 0
      correctSound.play()
      
      // Mark as selected
      setSelectedQuizOption(optionIndex)
      setWrongQuizOption(null)
      
      const response = currentQuiz.correctResponse
      setPreTrainingAnswered(true)
      
      // Add user's choice message
      const userChoice = { type: 'user', text: currentQuiz.options[optionIndex].text }
      setRangerMessages(prev => [...prev, userChoice])
      
      // Add response message after delay
      setTimeout(() => {
        const responseMessage = { type: 'message', text: response }
        setRangerMessages(prev => [...prev, responseMessage])
        setCurrentTypingMessage(responseMessage)
        
        // Start typing effect for response
        let charIndex = 0
        setRangerDisplayedText('')
        setRangerIsTyping(true)
        typingSound.play().catch(err => console.log('Typing sound error:', err))
        
        const typingInterval = setInterval(() => {
          if (charIndex < response.length) {
            setRangerDisplayedText(response.substring(0, charIndex + 1))
            charIndex++
          } else {
            setRangerIsTyping(false)
            setCurrentTypingMessage(null)
            typingSound.pause()
            typingSound.currentTime = 0
            clearInterval(typingInterval)
            
            // Check if there are more quiz questions
            if (preTrainingQuizStep < PRE_TRAINING_QUIZ.length - 1) {
              // Move to next quiz question after delay
              setTimeout(() => {
                const nextQuiz = PRE_TRAINING_QUIZ[preTrainingQuizStep + 1]
                const nextMessage = { type: 'message', text: nextQuiz.question }
                setRangerMessages(prev => [...prev, nextMessage])
                setCurrentTypingMessage(nextMessage)
                setPreTrainingQuizStep(prev => prev + 1)
                setPreTrainingAnswered(false)
                setSelectedQuizOption(null)
                setWrongQuizOption(null)
                
                // Type next question
                let nextCharIndex = 0
                setRangerDisplayedText('')
                setRangerIsTyping(true)
                typingSound.play().catch(err => console.log('Typing sound error:', err))
                
                const nextTypingInterval = setInterval(() => {
                  if (nextCharIndex < nextQuiz.question.length) {
                    setRangerDisplayedText(nextQuiz.question.substring(0, nextCharIndex + 1))
                    nextCharIndex++
                  } else {
                    setRangerIsTyping(false)
                    setCurrentTypingMessage(null)
                    typingSound.pause()
                    typingSound.currentTime = 0
                    clearInterval(nextTypingInterval)
                  }
                }, 25)
              }, 800)
            } else {
              // All quizzes complete, show training ready message after delay
              setTimeout(() => {
                const readyMessage = { type: 'message', text: TRAINING_READY_MESSAGE }
                setRangerMessages(prev => [...prev, readyMessage])
                setCurrentTypingMessage(readyMessage)
                
                // Type ready message
                let readyCharIndex = 0
                setRangerDisplayedText('')
                setRangerIsTyping(true)
                typingSound.play().catch(err => console.log('Typing sound error:', err))
                
                const readyTypingInterval = setInterval(() => {
                  if (readyCharIndex < TRAINING_READY_MESSAGE.length) {
                    setRangerDisplayedText(TRAINING_READY_MESSAGE.substring(0, readyCharIndex + 1))
                    readyCharIndex++
                  } else {
                    setRangerIsTyping(false)
                    setCurrentTypingMessage(null)
                    typingSound.pause()
                    typingSound.currentTime = 0
                    clearInterval(readyTypingInterval)
                    setShowTrainingReadyButton(true)
                  }
                }, 25)
              }, 800)
            }
          }
        }, 25)
      }, 300)
    } else {
      // Play wrong sound
      wrongSound.currentTime = 0
      wrongSound.play()
      
      // Mark as wrong (red border) but allow reselection
      setWrongQuizOption(optionIndex)
      setSelectedQuizOption(null)
    }
  }
  
  // Handle Ready Let's GO button
  const handleReadyLetsGo = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    setShowModernRangerDialogue(false)
    setPhase('TRAINING')
    setTrainingProgress(0)
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          // After training completes, show training complete quiz
          setTimeout(() => {
            setPhase('TRAINING_COMPLETE_QUIZ')
            setTrainingCompleteQuizAnswered(false)
            setTimeout(() => {
              setShowModernRangerDialogue(true)
              startTrainingCompleteQuizDialogue()
            }, 500)
          }, 1000)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }
  
  // Start Training Complete Quiz dialogue
  const startTrainingCompleteQuizDialogue = () => {
    const newMessage = { type: 'message', text: TRAINING_COMPLETE_QUIZ.question }
    setRangerMessages([newMessage])
    setCurrentRangerStep(0)
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < TRAINING_COMPLETE_QUIZ.question.length) {
        setRangerDisplayedText(TRAINING_COMPLETE_QUIZ.question.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        setWaitingForRangerAction(false)
      }
    }, 25)
  }
  
  // Handle Training Complete Quiz answer
  const handleTrainingCompleteQuizAnswer = (optionIndex, isCorrect) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    const response = isCorrect ? TRAINING_COMPLETE_QUIZ.correctResponse : TRAINING_COMPLETE_QUIZ.incorrectResponse
    
    setTrainingCompleteQuizAnswered(true)
    
    // Add response message
    const responseMessage = { type: 'message', text: response }
    setRangerMessages(prev => [...prev, responseMessage])
    setCurrentTypingMessage(responseMessage)
    
    // Start typing effect for response
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < response.length) {
        setRangerDisplayedText(response.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // After response is typed, show continue button
        setTimeout(() => {
          setWaitingForRangerAction(true)
        }, 500)
      }
    }, 25)
  }
  
  // Handle continue to test phase
  const handleContinueToTest = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    // Update rangerMossPhase to 4 (Phase 4: Test the Model)
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.rangerMossPhase = 4 // Phase 4: Test the Model
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
    
    setShowModernRangerDialogue(false)
    setPhase('VALIDATION_DATA')
    setSelectedTestMushrooms([])
  }

  const handleQuizAnswer = (optionIndex, isCorrect) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    const currentQuestion = QUIZ_DATA[quizStep]
    const selectedOption = currentQuestion.options[optionIndex]
    
    // Record the answer
    setSelectedAnswers(prev => ({
      ...prev,
      [quizStep]: { optionIndex, isCorrect }
    }))

    // Choose response based on whether answer is correct or not
    const response = isCorrect ? currentQuestion.correctResponse : currentQuestion.incorrectResponse
    
    // Add user's answer and ranger's response
    const newMessages = [
      ...chatMessages,
      { type: 'user', text: selectedOption.text },
      { type: 'ranger', text: response }
    ]
    
    if (quizStep < QUIZ_DATA.length - 1) {
      // Add next question
      newMessages.push({ type: 'ranger', text: QUIZ_DATA[quizStep + 1].question })
      setChatMessages(newMessages)
      setQuizStep(prev => prev + 1)
    } else {
      // Quiz complete, add training intro
      newMessages.push({ type: 'ranger', text: TRAINING_INTRO })
      newMessages.push({ type: 'button', text: "Ready, Let's GO!" })
      setChatMessages(newMessages)
      setQuizStep(prev => prev + 1)
    }
  }

  const handleStartTraining = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setPhase('TRAINING')
    setTrainingProgress(0)
    
    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setShowTrainingVoiceover(true)
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  const handleTrainingComplete = () => {
    setPhase('VALIDATION_INTRO')
    setValidationStep(0)
  }

  const handleValidationAnswer = (isCorrect) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    if (isCorrect) {
      setValidationStep(1) // Show correct response
    }
  }

  const handleValidationContinue = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setPhase('VALIDATION_DATA')
    setSelectedTestMushrooms([])
  }

  const handleTestMushroomClick = (id) => {
    const mushroom = TEST_MUSHROOMS.find(m => m.id === id)
    
    // If clicking on a wrong mushroom (already collected)
    if (!mushroom.isNew) {
      wrongSound.currentTime = 0
      wrongSound.play().catch(err => console.log('Wrong sound error:', err))
      setGlitchHintText("We should test with New Mushrooms! These have already been collected.")
      setShowGlitchHint(true)
      return
    }
    
    // Toggle selection for correct mushrooms
    if (selectedTestMushrooms.includes(id)) {
      // Deselecting - no sound
      setSelectedTestMushrooms(prev => prev.filter(m => m !== id))
    } else {
      // Selecting - play correct sound
      correctSound.currentTime = 0
      correctSound.play().catch(err => console.log('Correct sound error:', err))
      setSelectedTestMushrooms(prev => [...prev, id])
    }
  }

  const handleSlideTest = () => {
    // Check if exactly 3 mushrooms are selected
    if (selectedTestMushrooms.length !== 3) {
      setGlitchHintText("Please select exactly 3 mushrooms to test!")
      setShowGlitchHint(true)
      setSliderPosition(0) // Reset slider
      return
    }
    
    // Play test sound
    testSound.currentTime = 0
    testSound.play().catch(err => console.log('Test sound error:', err))
    
    // Start scanning animation
    setIsScanning(true)
    // Simulate scanning animation
    setTimeout(() => {
      setIsScanning(false)
      setShowPrediction(true)
    }, 2000)
  }

  // Drag handlers for slide button
  const maxSlideDistance = 290 // Container width (350) - button width (50) - padding (10)
  
  const handleSliderMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleSliderMouseMove = (e) => {
    if (!isDragging || !sliderContainerRef.current) return
    
    const containerRect = sliderContainerRef.current.getBoundingClientRect()
    const newPosition = e.clientX - containerRect.left - 25 // 25 = half button width
    
    // Clamp position between 0 and maxSlideDistance
    const clampedPosition = Math.max(0, Math.min(newPosition, maxSlideDistance))
    setSliderPosition(clampedPosition)
    
    // Check if slider reached the end
    if (clampedPosition >= maxSlideDistance - 10) {
      setIsDragging(false)
      handleSlideTest()
    }
  }

  const handleSliderMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      // Reset slider if not completed
      if (sliderPosition < maxSlideDistance - 10) {
        setSliderPosition(0)
      }
    }
  }

  // Touch handlers for mobile
  const handleSliderTouchStart = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleSliderTouchMove = (e) => {
    if (!isDragging || !sliderContainerRef.current) return
    
    const touch = e.touches[0]
    const containerRect = sliderContainerRef.current.getBoundingClientRect()
    const newPosition = touch.clientX - containerRect.left - 25
    
    const clampedPosition = Math.max(0, Math.min(newPosition, maxSlideDistance))
    setSliderPosition(clampedPosition)
    
    if (clampedPosition >= maxSlideDistance - 10) {
      setIsDragging(false)
      handleSlideTest()
    }
  }

  const handleSliderTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false)
      if (sliderPosition < maxSlideDistance - 10) {
        setSliderPosition(0)
      }
    }
  }

  // Add global mouse/touch event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleSliderMouseMove)
      window.addEventListener('mouseup', handleSliderMouseUp)
      window.addEventListener('touchmove', handleSliderTouchMove)
      window.addEventListener('touchend', handleSliderTouchEnd)
    }
    
    return () => {
      window.removeEventListener('mousemove', handleSliderMouseMove)
      window.removeEventListener('mouseup', handleSliderMouseUp)
      window.removeEventListener('touchmove', handleSliderTouchMove)
      window.removeEventListener('touchend', handleSliderTouchEnd)
    }
  }, [isDragging, sliderPosition])

  // Animate accuracy progress when prediction is shown
  useEffect(() => {
    if (showPrediction) {
      setAccuracyProgress(0)
      const targetAccuracy = 45
      const duration = 2000 // 2 seconds
      const steps = 60 // 60 frames
      const increment = targetAccuracy / steps
      const stepDuration = duration / steps
      
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        if (currentStep >= steps) {
          setAccuracyProgress(targetAccuracy)
          clearInterval(interval)
        } else {
          setAccuracyProgress(Math.round(currentStep * increment))
        }
      }, stepDuration)
      
      return () => clearInterval(interval)
    }
  }, [showPrediction])

  // Animate final accuracy progress when training completes
  useEffect(() => {
    if (adjustProgress >= 100) {
      setFinalAccuracyProgress(0)
      const targetAccuracy = 95
      const duration = 2000 // 2 seconds
      const steps = 60 // 60 frames
      const increment = targetAccuracy / steps
      const stepDuration = duration / steps
      
      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        if (currentStep >= steps) {
          setFinalAccuracyProgress(targetAccuracy)
          clearInterval(interval)
        } else {
          setFinalAccuracyProgress(Math.round(currentStep * increment))
        }
      }, stepDuration)
      
      return () => clearInterval(interval)
    }
  }, [adjustProgress])

  const handleValidationComplete = () => {
    // Transition to model adjustment phase with modern dialogue
    setPhase('ADJUST_MODEL_INTRO')
    setAdjustDialogueIndex(0)
    setAdjustStep(0)
    setAdjustQuizAnswered(false)
    setShowSelectDataButton(false)
    
    // Initialize modern dialogue
    setTimeout(() => {
      setShowModernRangerDialogue(true)
      startAdjustModelDialogue()
    }, 500)
  }
  
  // Start Adjust Model dialogue
  const startAdjustModelDialogue = () => {
    const firstMessage = ADJUST_MODEL_DIALOGUES[0]
    const newMessage = { type: 'message', text: firstMessage }
    setRangerMessages([newMessage])
    setCurrentRangerStep(0)
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < firstMessage.length) {
        setRangerDisplayedText(firstMessage.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // Auto-continue to next message
        setTimeout(() => {
          addAdjustModelMessage(1)
        }, 500)
      }
    }, 25)
  }
  
  // Add Adjust Model message with typing effect
  const addAdjustModelMessage = (stepIndex) => {
    if (stepIndex >= ADJUST_MODEL_DIALOGUES.length) {
      // All dialogues done, show quiz
      setTimeout(() => {
        const quizMessage = { type: 'message', text: ADJUST_MODEL_QUIZ.question }
        setRangerMessages(prev => [...prev, quizMessage])
        setCurrentTypingMessage(quizMessage)
        
        // Type quiz question
        let charIndex = 0
        setRangerDisplayedText('')
        setRangerIsTyping(true)
        typingSound.play().catch(err => console.log('Typing sound error:', err))
        
        const typingInterval = setInterval(() => {
          if (charIndex < ADJUST_MODEL_QUIZ.question.length) {
            setRangerDisplayedText(ADJUST_MODEL_QUIZ.question.substring(0, charIndex + 1))
            charIndex++
          } else {
            setRangerIsTyping(false)
            setCurrentTypingMessage(null)
            typingSound.pause()
            typingSound.currentTime = 0
            clearInterval(typingInterval)
          }
        }, 25)
      }, 500)
      return
    }
    
    const text = ADJUST_MODEL_DIALOGUES[stepIndex]
    const newMessage = { type: 'message', text }
    setRangerMessages(prev => [...prev, newMessage])
    setCurrentTypingMessage(newMessage)
    
    // Start typing effect and sound
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setRangerDisplayedText(text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // Check if this is the last message
        if (stepIndex === ADJUST_MODEL_DIALOGUES.length - 1) {
          // Show quiz after last dialogue
          addAdjustModelMessage(stepIndex + 1)
        } else {
          // Auto-continue to next message
          setTimeout(() => {
            addAdjustModelMessage(stepIndex + 1)
          }, 500)
        }
      }
    }, 25)
  }
  
  // Handle Adjust Model Quiz answer
  const handleAdjustModelQuizAnswer = (optionIndex, isCorrect) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    const response = isCorrect ? ADJUST_MODEL_QUIZ.correctResponse : ADJUST_MODEL_QUIZ.incorrectResponse
    
    setAdjustQuizAnswered(true)
    
    // Add response message
    const responseMessage = { type: 'message', text: response }
    setRangerMessages(prev => [...prev, responseMessage])
    setCurrentTypingMessage(responseMessage)
    
    // Start typing effect for response
    let charIndex = 0
    setRangerDisplayedText('')
    setRangerIsTyping(true)
    typingSound.play().catch(err => console.log('Typing sound error:', err))
    
    const typingInterval = setInterval(() => {
      if (charIndex < response.length) {
        setRangerDisplayedText(response.substring(0, charIndex + 1))
        charIndex++
      } else {
        setRangerIsTyping(false)
        setCurrentTypingMessage(null)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
        
        // Show select data button if correct
        if (isCorrect) {
          setTimeout(() => {
            setShowSelectDataButton(true)
          }, 500)
        }
      }
    }, 25)
  }
  
  // Handle select training data button
  const handleSelectTrainingData = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    setShowModernRangerDialogue(false)
    setPhase('ADJUST_MODEL_DATA')
  }

  // Typing effect for model adjustment dialogues
  useEffect(() => {
    if (phase !== 'ADJUST_MODEL_INTRO' || adjustStep !== 0) return
    
    const fullText = ADJUST_MODEL_DIALOGUES[adjustDialogueIndex]
    if (!fullText) return
    
    let charIndex = 0
    setAdjustDisplayedText('')
    setIsAdjustTyping(true)

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setAdjustDisplayedText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsAdjustTyping(false)
        clearInterval(typingInterval)
      }
    }, 25)

    return () => clearInterval(typingInterval)
  }, [adjustDialogueIndex, phase, adjustStep])

  // Model Adjustment handlers
  const handleAdjustDialogueContinue = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // If typing, skip to full text
    if (isAdjustTyping) {
      setAdjustDisplayedText(ADJUST_MODEL_DIALOGUES[adjustDialogueIndex])
      setIsAdjustTyping(false)
      return
    }

    // Add current dialogue to history
    setAdjustDialogueHistory(prev => [...prev, ADJUST_MODEL_DIALOGUES[adjustDialogueIndex]])

    if (adjustDialogueIndex < ADJUST_MODEL_DIALOGUES.length - 1) {
      setAdjustDialogueIndex(prev => prev + 1)
    } else {
      setAdjustStep(1) // Show choice options
    }
  }

  const handleAdjustOptionSelect = (option, index) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    if (option.correct) {
      setAdjustStep(2) // Move to data selection
    } else {
      // Mark wrong option with low opacity
      setSelectedWrongOption(index)
      setGlitchHintText("That won't help the AI learn better! Think about what data scientists do.")
      setShowGlitchHint(true)
    }
  }

  const handleTrainingPhotoClick = (photo) => {
    if (photo.isGood) {
      // Add to selected if not already selected
      if (!selectedTrainingPhotos.includes(photo.id)) {
        correctSound.currentTime = 0
        correctSound.play().catch(err => console.log('Correct sound error:', err))
        setSelectedTrainingPhotos(prev => [...prev, photo.id])
        setFeedbackPhoto(null)
        setShowFeedbackPanel(false) // Hide feedback panel on correct selection
        setShowRangerPraise(true)
        setTimeout(() => setShowRangerPraise(false), 2000)
      }
    } else {
      // Show feedback panel with duplicate mushroom
      wrongSound.currentTime = 0
      wrongSound.play().catch(err => console.log('Wrong sound error:', err))
      setFeedbackPhoto(photo)
      setShowFeedbackPanel(true) // Only show feedback panel when wrong
      setGlitchHintText("Even though they aren't exactly the same, they don't teach the AI anything new. Try a different one!")
      setShowGlitchHint(true)
    }
  }

  const handleImproveAccuracy = () => {
    // Check if all correct photos selected (16,17,18,19)
    const correctPhotos = TRAINING_PHOTOS.filter(p => p.isGood).map(p => p.id)
    const allCorrectSelected = correctPhotos.every(id => selectedTrainingPhotos.includes(id))
    
    if (allCorrectSelected) {
      // Play test sound
      testSound.currentTime = 0
      testSound.play().catch(err => console.log('Test sound error:', err))
      
      setPhase('ADJUST_MODEL_TRAINING') // Move to retraining phase
      // Animate progress bar
      let progress = 0
      const interval = setInterval(() => {
        progress += 2
        setAdjustProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
        }
      }, 50)
    }
  }

  const handleAdjustComplete = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    // Update rangerMossPhase to 5 (completed all phases)
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      userData.rangerMossPhase = 5 // Phase 5: Refine the Model - Complete
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
    }
    
    setPhase('LOADING')
  }

  // Adjust slider drag handlers
  const maxAdjustSlideDistance = 225

  const handleAdjustSliderMouseDown = (e) => {
    e.preventDefault()
    setIsAdjustDragging(true)
  }

  const handleAdjustSliderMouseMove = (e) => {
    if (!isAdjustDragging || !adjustSliderRef.current) return
    const containerRect = adjustSliderRef.current.getBoundingClientRect()
    const newPosition = e.clientX - containerRect.left - 25
    const clampedPosition = Math.max(0, Math.min(newPosition, maxAdjustSlideDistance))
    setAdjustSliderPos(clampedPosition)
    if (clampedPosition >= maxAdjustSlideDistance - 10) {
      setIsAdjustDragging(false)
      handleImproveAccuracy()
    }
  }

  const handleAdjustSliderMouseUp = () => {
    if (isAdjustDragging) {
      setIsAdjustDragging(false)
      if (adjustSliderPos < maxAdjustSlideDistance - 10) {
        setAdjustSliderPos(0)
      }
    }
  }

  useEffect(() => {
    if (isAdjustDragging) {
      window.addEventListener('mousemove', handleAdjustSliderMouseMove)
      window.addEventListener('mouseup', handleAdjustSliderMouseUp)
    }
    return () => {
      window.removeEventListener('mousemove', handleAdjustSliderMouseMove)
      window.removeEventListener('mouseup', handleAdjustSliderMouseUp)
    }
  }, [isAdjustDragging, adjustSliderPos])

  // Loading effect
  useEffect(() => {
    if (phase === 'LOADING') {
      let progress = 0
      const interval = setInterval(() => {
        progress += 2
        setLoadingProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setPhase('COLOR_MAP_EXPLORATION')
          }, 500)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [phase])
  
  // Auto-show NPC dialogue when entering color map area with NPC
  useEffect(() => {
    if (phase === 'COLOR_MAP_EXPLORATION' && !isMapTransitioning) {
      const npc = colorMapNpcs[mapPosition]
      if (npc && npc.npc && !colorMapNpcAutoShown[`${mapPosition}-${npc.npc}`]) {
        // Mark this NPC as auto-shown
        setColorMapNpcAutoShown(prev => ({ ...prev, [`${mapPosition}-${npc.npc}`]: true }))
        
        // Auto-show dialogue after a short delay
        setTimeout(() => {
          if (npc.npc === 'npc_c' && npc.dialogues && npc.dialogues.length > 0) {
            // For npc_c, show first dialogue set
            startColorMapNpcDialogue(npc.npc, npc.dialogues[0][0])
          } else if (npc.hoverText) {
            // For other NPCs, show hover text
            startColorMapNpcDialogue(npc.npc, npc.hoverText)
          }
        }, 800)
      }
    }
  }, [phase, mapPosition, isMapTransitioning])
  
  // Start color map NPC dialogue with typing effect
  const startColorMapNpcDialogue = (npcType, text) => {
    setCurrentNpc(npcType)
    setNpcDialogueText(text)
    setShowNpcDialogue(true)
    setColorMapNpcDisplayedText('')
    setColorMapNpcIsTyping(true)
    
    // Start typing sound
    typingSound.volume = 0.5
    typingSound.currentTime = 0
    typingSound.play()
    
    // Typing effect
    let charIndex = 0
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setColorMapNpcDisplayedText(text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setColorMapNpcIsTyping(false)
        typingSound.pause()
        typingSound.currentTime = 0
        clearInterval(typingInterval)
      }
    }, 30)
  }

  // Color map navigation handlers
  const handleMapNavigate = (direction) => {
    const nextPosition = colorMapNavigation[mapPosition]?.[direction]
    if (nextPosition !== undefined && !isMapTransitioning) {
      setIsMapTransitioning(true)
      setClickedMushroom(null) // Reset clicked mushroom when navigating
      setShowNpcDialogue(false) // Hide any open dialogue
      setCurrentNpc(null) // Reset current NPC
      setTimeout(() => {
        setMapPosition(nextPosition)
        setIsMapTransitioning(false)
      }, 500)
    }
  }

  const handleColorMapNpcClick = (npcType) => {
    const npc = colorMapNpcs[mapPosition]
    if (npc && npc.npc === npcType) {
      if (npcType === 'npc_c') {
        const clickCount = npcClickCount.npc_c
        if (clickCount < npc.dialogues.length) {
          // Start new dialogue set with typing effect
          setCurrentDialogueSet(clickCount)
          setCurrentDialogueIndex(0)
          startColorMapNpcDialogue(npcType, npc.dialogues[clickCount][0])
        }
      } else if (npcType === 'npc_a' || npcType === 'npc_b') {
        // For NPC A and B, show their dialogues
        if (npc.dialogues && npc.dialogues[0]) {
          setCurrentDialogueSet(0)
          setCurrentDialogueIndex(0)
          startColorMapNpcDialogue(npcType, npc.dialogues[0][0])
        }
      } else if (npc.hoverText) {
        // For other NPCs, show hover text with typing effect
        startColorMapNpcDialogue(npcType, npc.hoverText)
      }
    }
  }

  const handleDialogueContinue = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Skip typing if still typing
    if (colorMapNpcIsTyping) {
      setColorMapNpcDisplayedText(npcDialogueText)
      setColorMapNpcIsTyping(false)
      typingSound.pause()
      typingSound.currentTime = 0
      return
    }
    
    const npc = colorMapNpcs[mapPosition]
    if (npc && (currentNpc === 'npc_c' || currentNpc === 'npc_a' || currentNpc === 'npc_b')) {
      const currentDialogueArray = npc.dialogues[currentDialogueSet]
      if (currentDialogueIndex < currentDialogueArray.length - 1) {
        // Show next sentence in current dialogue set with typing effect
        setCurrentDialogueIndex(prev => prev + 1)
        startColorMapNpcDialogue(currentNpc, currentDialogueArray[currentDialogueIndex + 1])
      } else {
        // End of current dialogue set
        // For NPC A and B, don't close dialogue on last message (show camera icon)
        if (currentNpc === 'npc_a' || currentNpc === 'npc_b') {
          // Keep dialogue open to show camera icon
          return
        }
        
        setShowNpcDialogue(false)
        if (currentNpc === 'npc_c') {
          setNpcClickCount(prev => ({ ...prev, npc_c: prev.npc_c + 1 }))
        }
        setCurrentNpc(null)
        typingSound.pause()
        typingSound.currentTime = 0
      }
    } else {
      // For other NPCs or simple dialogues
      setShowNpcDialogue(false)
      setCurrentNpc(null)
      typingSound.pause()
      typingSound.currentTime = 0
    }
  }

  const handleColorMapNpcHover = (npcType, isEntering) => {
    const npc = colorMapNpcs[mapPosition]
    if (npc && npc.npc === npcType && npc.hoverText) {
      if (isEntering) {
        setNpcDialogueText(npc.hoverText)
        setShowNpcDialogue(true)
        setCurrentNpc(npcType)
      } else {
        setShowNpcDialogue(false)
        setCurrentNpc(null)
      }
    }
  }

  const handleGlitchClickColorMap = () => {
    setShowGlitchChatDialogue(true)
  }
  
  const handleGlitchChatSend = async () => {
    if (glitchChatInput.trim()) {
      const userMessage = glitchChatInput.trim()
      console.log('User message to Glitch:', userMessage)
      
      // Add user message to chat history
      setGlitchChatHistory(prev => [...prev, { role: 'user', text: userMessage }])
      setGlitchChatInput('') // Clear input after sending
      setIsGlitchChatTyping(true) // Show typing indicator
      
      try {
        // Call Gemini API
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=AIzaSyBcXQWrPV9YwtEW44u6JmkaFlmMEtaMTw4', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are Glitch, a helpful AI guide in the Fungi Jungle color map exploration. The player has completed all training phases and is now exploring the colorful jungle. You help them reflect on what they learned about data collection, cleaning, labeling, and model training. Emphasize that AI is just a tool - it was their careful choices as a 'Data Detective' that taught the AI to see the truth. You're friendly, encouraging, and explain concepts in simple terms. Keep responses concise (2-3 sentences max).\n\nUser question: ${userMessage}`
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
        setIsGlitchChatTyping(false)
      }
    }
  }
  
  const handleGlitchChatInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchChatSend()
    }
  }
  
  // Camera functions for NPC photo feature in color map
  const handleCameraIconClick = (npcId) => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setCurrentPhotoNpc(npcId)
    setShowNpcDialogue(false)
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
    // Play camera sound if available
    const cameraSound = new Audio('/sound/camera.wav')
    cameraSound.volume = 0.5
    cameraSound.play().catch(err => console.log('Camera sound error:', err))
    
    // Create canvas to capture photo from video stream
    const video = document.getElementById('jungleCameraVideo')
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
    setShowValidationCard(true) // Reset validation card for new recognition
    
    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Data = photoBase64.split(',')[1]
      
      console.log('Calling Gemini API for photo recognition...')
      
      // Use gemini-3-flash-preview model
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=AIzaSyBcXQWrPV9YwtEW44u6JmkaFlmMEtaMTw4',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: 'Identify the main object in this image. Respond in this exact format: "Object Name (English) - Category". For example: "Coffee Mug - Kitchenware" or "Laptop - Electronics". Be concise and specific.'
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
        throw new Error(`API request failed: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Gemini API response received')
      
      // Extract result text
      let resultText = null
      
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        resultText = data.candidates[0].content.parts[0].text.trim()
      }
      
      console.log('Recognition result:', resultText)
      
      if (resultText) {
        // Parse the result (format: "Object Name - Category")
        const parts = resultText.split(' - ')
        const itemName = parts[0] || resultText
        const itemType = parts[1] || 'Unknown'
        
        setRecognitionResult({
          item: itemName,
          type: itemType,
          photo: photoBase64,
          timestamp: new Date().toISOString(),
          npc: currentPhotoNpc
        })
        
        setIsRecognizing(false)
        setShowNpcCamera(false)
        setShowRecognitionCard(true)
      } else {
        throw new Error('Invalid API response')
      }
    } catch (error) {
      console.error('Recognition error:', error)
      setIsRecognizing(false)
      alert(`Failed to recognize the object: ${error.message}`)
      setShowNpcCamera(false)
    }
  }
  
  const handleCloseCamera = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Stop camera stream
    if (npcCameraStream) {
      npcCameraStream.getTracks().forEach(track => track.stop())
      setNpcCameraStream(null)
    }
    
    setShowNpcCamera(false)
    setNpcCapturedPhoto(null)
  }
  
  const handleLabelCorrect = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Hide validation card, show download/save buttons
    setShowValidationCard(false)
  }
  
  const handleLabelIncorrect = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    // Re-call API for new recognition
    if (npcCapturedPhoto) {
      recognizePhoto(npcCapturedPhoto)
    }
  }
  
  const handleDownloadPhoto = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    if (!recognitionResult) return
    
    // Create download link
    const link = document.createElement('a')
    link.href = recognitionResult.photo
    link.download = `jungle_${recognitionResult.item}_${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('Photo downloaded:', recognitionResult.item)
  }
  
  const handleSaveToJournal = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    if (!recognitionResult) return
    
    // Save to Explorer's Journal in localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      if (!userData.explorerJournal) {
        userData.explorerJournal = []
      }
      
      userData.explorerJournal.push({
        ...recognitionResult,
        region: 'jungle',
        savedAt: Date.now()
      })
      
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      console.log('Saved to Explorer Journal:', recognitionResult)
      
      alert('Photo saved to Explorer\'s Journal!')
    }
    
    setShowRecognitionCard(false)
    setRecognitionResult(null)
    setNpcCapturedPhoto(null)
    setShowValidationCard(true) // Reset for next time
  }
  
  const handleDiscardPhoto = () => {
    selectSound.currentTime = 0
    selectSound.play().catch(err => console.log('Select sound error:', err))
    
    setShowRecognitionCard(false)
    setRecognitionResult(null)
    setNpcCapturedPhoto(null)
  }

  const handleMushroomClick = (mushroomId) => {
    setClickedMushroom(clickedMushroom === mushroomId ? null : mushroomId)
  }

  const isCellSelected = (rowId, field) => {
    return selectedCells.includes(`${rowId}-${field}`)
  }
  
  const isCellWrong = (rowId, field) => {
    return wrongCells.includes(`${rowId}-${field}`)
  }

  const styles = {
    container: {
      width: '100%',
      height: '100vh',
      backgroundImage: 'url(/jungle/map_full.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 30, 20, 0.5)',
      zIndex: 1,
    },
    exitButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#666',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid rgba(81, 112, 255, 0.4)',
      padding: '12px 30px',
      borderRadius: '8px',
      cursor: 'pointer',
      zIndex: 100,
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
    rangerNpc: {
      position: 'absolute',
      right: '30px',
      bottom: '0',
      height: '66.67vh',
      width: 'auto',
      zIndex: 40,
    },
    // Left side dialogue container (2/3 width)
    leftDialogueContainer: {
      position: 'absolute',
      top: '100px',
      left: '30px',
      width: '60%',
      maxWidth: '700px',
      zIndex: 50,
    },
    dialogueHistoryBox: {
      padding: '25px 30px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      maxHeight: '60vh',
      overflowY: 'auto',
    },
    dialogueHistoryItem: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      color: '#333',
      lineHeight: 1.7,
      marginBottom: '15px',
      paddingBottom: '15px',
      borderBottom: '1px solid #eee',
    },
    dialogueHistoryItemLast: {
      borderBottom: 'none',
      marginBottom: 0,
      paddingBottom: 0,
    },
    // Glitch hint near avatar (horizontal strip)
    glitchHintInline: {
      position: 'absolute',
      top: '15px',
      right: '100px',
      maxWidth: '350px',
      padding: '12px 20px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '2px solid #FFB6C1',
      boxShadow: '0 3px 15px rgba(0,0,0,0.15)',
      zIndex: 150,
    },
    glitchHintInlineText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      color: '#555',
      lineHeight: 1.5,
      margin: 0,
    },
    glitchHintCloseBtn: {
      position: 'absolute',
      top: '5px',
      right: '8px',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      color: '#999',
      cursor: 'pointer',
    },
    // Card styles - positioned on left side (2/3 width area)
    cardContainer: {
      position: 'absolute',
      top: '100px',
      left: '30px',
      width: '80%', // Increased from 60%
      maxWidth: '2100px', // Increased from 700px (3x)
      zIndex: 50,
    },
    card: {
      width: '1650px', // Increased from 550px (3x)
      padding: '90px', // Increased from 30px (3x)
      borderRadius: '75px', // Increased from 25px (3x)
      background: 'rgba(255, 255, 255, 0.98)',
      border: '12px solid transparent', // Increased from 4px (3x)
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    cardTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '78px', // Increased from 26px (3x)
      fontWeight: 700,
      color: '#333',
      textAlign: 'center',
      marginBottom: '30px', // Increased from 10px (3x)
    },
    cardSubtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '42px', // Increased from 14px (3x)
      color: '#666',
      textAlign: 'center',
      marginBottom: '75px', // Increased from 25px (3x)
    },
    itemGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '45px', // Increased from 15px (3x)
      marginBottom: '60px', // Increased from 20px (3x)
    },
    itemCard: {
      width: '330px', // Increased from 110px (3x)
      height: '330px', // Increased from 110px (3x)
      borderRadius: '45px', // Increased from 15px (3x)
      background: '#fff',
      border: '9px solid transparent', // Increased from 3px (3x)
      backgroundImage: 'linear-gradient(#fff, #fff), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    itemCardRemoved: {
      opacity: 0.3,
      background: '#1a1a2e',
      backgroundImage: 'none',
      border: '3px solid #444',
    },
    itemImage: {
      width: '240px', // Increased from 80px (3x)
      height: '240px', // Increased from 80px (3x)
      objectFit: 'contain',
    },
    trashArea: {
      display: 'flex',
      justifyContent: 'center',
      gap: '45px', // Increased from 15px (3x)
      marginTop: '45px', // Increased from 15px (3x)
    },
    trashSlot: {
      width: '240px', // Increased from 80px (3x)
      height: '240px', // Increased from 80px (3x)
      borderRadius: '12px',
      background: '#1a1a2e',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    nextButton: {
      display: 'block',
      margin: '60px auto 0', // Increased from 20px (3x)
      padding: '36px 120px', // Increased from 12px 40px (3x)
      fontFamily: "'Roboto', sans-serif",
      fontSize: '48px', // Increased from 16px (3x)
      fontWeight: 600,
      color: '#333',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    // Table styles
    tableCard: {
      width: '650px',
      padding: '25px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '15px',
    },
    th: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 700,
      color: '#555',
      textTransform: 'uppercase',
      padding: '10px 8px',
      borderBottom: '2px solid #ddd',
      textAlign: 'left',
    },
    td: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '13px',
      color: '#333',
      padding: '12px 8px',
      borderBottom: '1px solid #eee',
    },
    errorCell: {
      background: 'rgba(255, 100, 100, 0.2)',
      borderRadius: '4px',
    },
    selectedCell: {
      background: 'rgba(123, 104, 238, 0.3)',
      cursor: 'pointer',
      borderRadius: '4px',
      border: '2px solid #7B68EE',
    },
    clickableCell: {
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.6)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dialogueBox: {
      maxWidth: '500px',
      padding: '30px 40px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
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
      color: '#333',
      lineHeight: 1.7,
    },
    continueButton: {
      marginTop: '20px',
      float: 'right',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#5170FF',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textTransform: 'uppercase',
    },
    hintBox: {
      maxWidth: '450px',
      padding: '25px 30px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid #FFB6C1',
      textAlign: 'center',
    },
    hintTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '18px',
      fontWeight: 700,
      color: '#7B68EE',
      marginBottom: '15px',
    },
    hintText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      color: '#555',
      lineHeight: 1.6,
    },
    okButton: {
      marginTop: '20px',
      padding: '10px 30px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#fff',
      background: 'linear-gradient(135deg, #7B68EE, #FFB6C1)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    navArrow: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '40px',
      color: '#fff',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
      zIndex: 50,
    },
    // Fill Missing Values styles - positioned on left side (2/3 width area)
    fillMissingContainer: {
      position: 'absolute',
      top: '100px',
      left: '30px',
      width: '60%',
      maxWidth: '900px',
      display: 'flex',
      gap: '20px',
      zIndex: 60,
    },
    fillTableCard: {
      width: '550px',
      padding: '25px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(135deg, #5170FF, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    imagePanel: {
      width: '320px',
      padding: '20px',
      borderRadius: '25px',
      background: 'rgba(20, 20, 30, 0.95)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(20,20,30,0.95), rgba(20,20,30,0.95)), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 60,
    },
    imagePanelTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '28px',
      fontWeight: 700,
      color: '#fff',
      marginBottom: '15px',
    },
    mushroomImage: {
      width: '250px',
      height: '250px',
      objectFit: 'contain',
      marginBottom: '15px',
    },
    missingCell: {
      background: 'rgba(255, 200, 100, 0.3)',
      cursor: 'pointer',
      borderRadius: '4px',
      padding: '8px 12px',
      display: 'inline-block',
    },
    missingCellActive: {
      background: 'rgba(123, 104, 238, 0.4)',
      border: '2px solid #7B68EE',
    },
    filledCell: {
      background: 'rgba(100, 200, 100, 0.3)',
      borderRadius: '4px',
      padding: '8px 12px',
    },
    optionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '15px',
    },
    optionButton: {
      padding: '10px 20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#fff',
      background: 'rgba(81, 112, 255, 0.8)',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    completeCard: {
      width: '600px',
      padding: '40px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #5170FF, #7B68EE)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      textAlign: 'center',
    },
    completeTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '28px',
      fontWeight: 700,
      color: '#333',
      marginBottom: '20px',
    },
    completeText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#555',
      lineHeight: 1.8,
      marginBottom: '15px',
    },
    statusText: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '20px',
      fontWeight: 700,
      color: '#5170FF',
      marginBottom: '30px',
    },
    nextStepButton: {
      padding: '15px 40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#fff',
      background: 'linear-gradient(135deg, #5170FF, #7B68EE)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    // Quiz styles - positioned on left side (2/3 width area)
    quizContainer: {
      position: 'absolute',
      top: '100px',
      left: '30px',
      width: '60%',
      maxWidth: '700px',
      maxHeight: '80vh',
      zIndex: 50,
    },
    chatCard: {
      padding: '30px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(135deg, #5170FF, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      maxHeight: '70vh',
      overflowY: 'auto',
    },
    chatMessages: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    rangerMessage: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
    },
    rangerAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: '#1a1a2e',
      flexShrink: 0,
      overflow: 'hidden',
    },
    messageBubble: {
      padding: '15px 20px',
      borderRadius: '15px',
      background: 'rgba(81, 112, 255, 0.1)',
      maxWidth: '80%',
    },
    messageText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      color: '#333',
      lineHeight: 1.6,
    },
    messageSpeaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      fontWeight: 600,
      color: '#5170FF',
      marginBottom: '5px',
    },
    userMessage: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    userBubble: {
      padding: '12px 18px',
      borderRadius: '15px',
      background: 'rgba(123, 104, 238, 0.2)',
      maxWidth: '70%',
    },
    quizOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '15px',
      marginLeft: '62px',
    },
    quizOptionButton: {
      padding: '12px 20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      color: '#333',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid #5170FF',
      borderRadius: '10px',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
    quizOptionDisabled: {
      opacity: 0.1,
      cursor: 'default',
    },
    quizOptionSelected: {
      background: 'rgba(123, 104, 238, 0.3)',
      borderColor: '#7B68EE',
    },
    goButton: {
      display: 'block',
      margin: '20px auto 0',
      padding: '15px 40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#fff',
      background: 'linear-gradient(135deg, #5170FF, #7B68EE)',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    // Training styles - positioned on left side (2/3 width area)
    trainingContainer: {
      position: 'absolute',
      top: '100px',
      left: '30px',
      width: '60%',
      maxWidth: '700px',
      zIndex: 50,
      textAlign: 'center',
    },
    trainingCard: {
      padding: '40px',
      borderRadius: '25px',
      background: 'rgba(20, 20, 35, 0.95)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(20,20,35,0.95), rgba(20,20,35,0.95)), linear-gradient(135deg, #5170FF, #7B68EE)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    trainingTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '24px',
      fontWeight: 700,
      color: '#fff',
      marginBottom: '30px',
    },
    trainingGif: {
      width: '400px',
      height: 'auto',
      borderRadius: '15px',
      marginBottom: '30px',
    },
    progressBarContainer: {
      width: '100%',
      height: '20px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '10px',
      overflow: 'hidden',
      marginBottom: '20px',
    },
    progressBar: {
      height: '100%',
      background: 'linear-gradient(90deg, #5170FF, #7B68EE)',
      transition: 'width 0.1s ease',
    },
    progressText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#aaa',
      marginBottom: '20px',
    },
    voiceoverText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#fff',
      lineHeight: 1.8,
      marginTop: '20px',
      padding: '20px',
      background: 'rgba(81, 112, 255, 0.2)',
      borderRadius: '10px',
    },
    // Validation styles - positioned on left side (2/3 width area)
    validationContainer: {
      position: 'absolute',
      top: '100px',
      left: '30px',
      width: '60%',
      maxWidth: '700px',
      zIndex: 50,
    },
    validationCard: {
      padding: '30px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    validationText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.7,
      marginBottom: '25px',
    },
    validationOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    validationOption: {
      padding: '15px 25px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      fontWeight: 500,
      color: '#5170FF',
      background: 'rgba(81, 112, 255, 0.1)',
      border: '2px solid #5170FF',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
    },
    testMushroomGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '15px',
      marginBottom: '25px',
    },
    testMushroomCard: {
      position: 'relative',
      width: '100%',
      aspectRatio: '1',
      borderRadius: '15px',
      background: '#fff',
      border: '3px solid #eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      overflow: 'hidden',
    },
    testMushroomCardSelected: {
      border: '3px solid #7B68EE',
      boxShadow: '0 4px 15px rgba(123, 104, 238, 0.3)',
    },
    testMushroomImage: {
      width: '85%',
      height: '85%',
      objectFit: 'contain',
    },
    correctIcon: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
    },
    scanningOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(81, 112, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    slideButtonContainer: {
      position: 'relative',
      width: '280px',
      height: '50px',
      background: '#1a1a2e',
      borderRadius: '25px',
      margin: '0 auto 25px',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      cursor: 'pointer',
    },
    slideButtonTrack: {
      position: 'absolute',
      left: '5px',
      width: '45px',
      height: '40px',
      background: 'linear-gradient(135deg, #5170FF, #7B68EE)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'left 0.15s ease-out',
      userSelect: 'none',
    },
    slideButtonText: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '14px',
      fontWeight: 700,
      color: '#fff',
      marginLeft: '60px',
      letterSpacing: '1px',
    },
    arrowIcon: {
      width: '20px',
      height: '20px',
    },
    predictionContainer: {
      textAlign: 'center',
      marginTop: '20px',
    },
    predictionLabel: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '10px',
    },
    predictionValue: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '72px',
      fontWeight: 700,
      color: '#333',
      lineHeight: 1,
    },
    predictionUnit: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      color: '#666',
      marginTop: '5px',
    },
    // Model Adjustment Phase Styles
    adjustContainer: {
      position: 'absolute',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '20px',
      zIndex: 50,
    },
    adjustDialogueCard: {
      width: '500px',
      padding: '30px',
      borderRadius: '20px',
      background: 'rgba(240, 240, 245, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(240,240,245,0.98), rgba(240,240,245,0.98)), linear-gradient(135deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    adjustDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      color: '#333',
      lineHeight: 1.8,
      marginBottom: '20px',
    },
    adjustOptionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '20px',
    },
    adjustOptionButton: {
      padding: '15px 20px',
      borderRadius: '12px',
      background: '#fff',
      border: '2px solid #ddd',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s',
    },
    trainingPhotosCard: {
      width: '550px',
      padding: '25px',
      borderRadius: '20px',
      background: 'rgba(240, 240, 245, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(240,240,245,0.98), rgba(240,240,245,0.98)), linear-gradient(135deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    trainingPhotosTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '18px',
      fontWeight: 700,
      color: '#333',
      textAlign: 'center',
      marginBottom: '20px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    trainingPhotosGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    trainingPhotoCard: {
      position: 'relative',
      aspectRatio: '1',
      borderRadius: '15px',
      background: '#fff',
      border: '3px solid #eee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s',
      overflow: 'hidden',
    },
    trainingPhotoCardSelected: {
      border: '3px solid #7B68EE',
      boxShadow: '0 4px 15px rgba(123, 104, 238, 0.3)',
    },
    trainingPhotoImage: {
      width: '90%',
      height: '90%',
      objectFit: 'contain',
    },
    trainingPhotoCheck: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      width: '24px',
      height: '24px',
    },
    feedbackPanel: {
      width: '320px',
      padding: '25px',
      borderRadius: '20px',
      background: '#1a1a2e',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(#1a1a2e, #1a1a2e), linear-gradient(135deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    feedbackTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#fff',
      textAlign: 'center',
      marginBottom: '20px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    feedbackImage: {
      width: '200px',
      height: '200px',
      objectFit: 'contain',
      marginBottom: '20px',
    },
    feedbackValueText: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '20px',
      fontWeight: 700,
      color: '#fff',
      textTransform: 'uppercase',
    },
    feedbackPanelContainer: {
      position: 'absolute',
      top: '100px',
      right: '30px',
      zIndex: 50,
    },
    rangerPraisePopup: {
      position: 'absolute',
      bottom: '120px',
      right: '200px',
      padding: '15px 25px',
      borderRadius: '15px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid #7B68EE',
      boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
      zIndex: 200,
    },
    rangerPraiseText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      margin: 0,
    },
    retrainingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      zIndex: 50,
    },
    modelGif: {
      width: '400px',
      height: 'auto',
      marginBottom: '30px',
    },
    progressBarContainer: {
      width: '400px',
      height: '20px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '0 auto 30px',
    },
    progressBarFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #5170FF, #7B68EE)',
      borderRadius: '10px',
      transition: 'width 0.1s linear',
    },
    finalAccuracyContainer: {
      padding: '40px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #5170FF, #7B68EE)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    finalAccuracyLabel: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#666',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '10px',
    },
    finalAccuracyValue: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '80px',
      fontWeight: 700,
      color: '#4CAF50',
      lineHeight: 1,
    },
    finalAccuracyUnit: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 500,
      color: '#666',
      marginTop: '5px',
    },
    // Loading styles
    loadingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
      zIndex: 50,
    },
    loadingTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '32px',
      fontWeight: 700,
      color: '#fff',
      marginBottom: '30px',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
    },
    loadingBar: {
      width: '400px',
      height: '20px',
      background: 'rgba(255,255,255,0.3)',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '0 auto',
    },
    loadingFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #5170FF, #7B68EE)',
      borderRadius: '10px',
      transition: 'width 0.1s linear',
    },
    // Color Map styles
    colorMapContainer: {
      width: '100%',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    colorMapWrapper: {
      width: '200%',
      height: '200%',
      position: 'absolute',
      top: 0,
      left: 0,
      transition: 'transform 0.5s ease-in-out',
    },
    colorMapImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    colorMapNavArrow: {
      position: 'absolute',
      width: '80px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    colorMapArrowImage: {
      width: '80px',
      height: '80px',
      objectFit: 'contain',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
    },
    colorMapUpArrow: { top: '30px', left: '50%', transform: 'translateX(-50%)' },
    colorMapDownArrow: { bottom: '30px', left: '50%', transform: 'translateX(-50%)' },
    colorMapLeftArrow: { left: '30px', top: '50%', transform: 'translateY(-50%)' },
    colorMapRightArrow: { right: '30px', top: '50%', transform: 'translateY(-50%)' },
    colorMapMushroom: {
      position: 'absolute',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      zIndex: 20,
    },
    colorMapMushroomImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))',
    },
    colorMapNpc: {
      position: 'absolute',
      cursor: 'pointer',
      zIndex: 25,
      transition: 'transform 0.2s',
    },
    colorMapNpcImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    mushroomStatusBadge: {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '6px 12px',
      borderRadius: '20px',
      fontFamily: "'Roboto Mono', monospace",
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)',
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    dangerBadge: {
      color: '#fff',
    },
    edibleBadge: {
      color: '#fff',
    },
    // Color Map Dialogue - Irregular bubble design (like FungiJungleMap)
    colorMapDialogueContainer: {
      position: 'absolute',
      zIndex: 100,
      animation: 'fadeIn 0.3s ease-out',
    },
    dialogueContainerNpcA: {
      top: '33.33%',
      left: '80px',
      width: '45%',
      maxWidth: '500px',
    },
    dialogueContainerNpcB: {
      top: '50%',
      right: '80px',
      width: '45%',
      maxWidth: '500px',
    },
    dialogueContainerRangerMoss: {
      bottom: '10%',
      left: '5%',
      width: '35%',
      maxWidth: '450px',
    },
    colorMapDialogueBox: {
      padding: '25px 30px',
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', // Irregular organic shape
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid #8B4513',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.5)',
      position: 'relative',
      minHeight: '100px',
    },
    colorMapSpeakerName: {
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
    colorMapDialogueText: {
      fontFamily: "'Patrick Hand', cursive",
      fontSize: '20px',
      fontWeight: 400,
      color: '#333',
      lineHeight: 1.6,
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
      marginTop: '10px',
      marginBottom: '15px',
    },
    colorMapContinueButton: {
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
    // Modern Ranger Moss dialogue styles
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
      background: '#8FCCAE',
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
    modernActionButton: {
      alignSelf: 'stretch',
      background: '#8B4513',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '25px',
      fontFamily: "'Roboto', sans-serif",
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
      marginTop: '8px',
    },
  }

  const currentBatchItems = NOISE_BATCHES[noiseBatch] || []
  const currentTableData = DIRTY_DATA[labelBatch]
  
  // Render modern Ranger Moss dialogue
  const renderModernRangerDialogue = () => {
    if (!showModernRangerDialogue) return null
    
    // Get current phase from localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    const userData = savedUser ? JSON.parse(savedUser) : {}
    const currentPhase = userData.rangerMossPhase || 2
    
    // Phase titles
    const phaseTitles = {
      1: 'PHASE 1: COLLECTING DATA',
      2: 'PHASE 2: DATA CLEANING',
      3: 'PHASE 3: CORRECT LABELS',
      4: 'PHASE 4: TEST THE MODEL',
      5: 'PHASE 5: REFINE THE MODEL'
    }
    
    // Determine current phase based on the actual phase state
    let displayPhase = currentPhase
    if (phase === 'PRE_TRAINING_QUIZ' || phase === 'TRAINING' || phase === 'TRAINING_COMPLETE_QUIZ') {
      displayPhase = 3
    }
    
    const totalSteps = 5
    const progressPercent = (displayPhase / totalSteps) * 100
    
    return (
      <div style={styles.modernDialogueContainer}>
        {/* Header with Progress */}
        <div style={styles.modernDialogueHeader}>
          <div style={styles.modernProgressContainer}>
            <div style={styles.modernMissionTitle}>
              {phaseTitles[displayPhase]}
            </div>
            <div style={styles.modernStepIndicator}>
              Phase {displayPhase} of {totalSteps}
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
                typingSound.pause()
                typingSound.currentTime = 0
                setShowModernRangerDialogue(false)
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
          {rangerMessages.map((message, index) => {
            const timestamp = getCurrentTimestamp()
            
            if (message.type === 'message') {
              return (
                <div key={index} style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>RANGER MOSS:</div>
                  <p style={styles.modernNpcText}>
                    {currentTypingMessage && currentTypingMessage === message ? (
                      <>
                        {formatTextWithBold(rangerDisplayedText)}
                        {rangerIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
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
                <div key={index} style={{
                  alignSelf: 'flex-end',
                  maxWidth: '85%',
                }}>
                  <div style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '6px',
                    textAlign: 'right',
                  }}>YOU:</div>
                  <div style={{
                    background: '#00bf63',
                    padding: '12px 18px',
                    borderRadius: '18px',
                    boxShadow: '0 2px 6px rgba(0, 191, 99, 0.3)',
                  }}>
                    <p style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '14px',
                      color: '#fff',
                      lineHeight: 1.5,
                      margin: 0,
                    }}>
                      {message.text}
                    </p>
                  </div>
                  <div style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '4px',
                    textAlign: 'right',
                  }}>{timestamp}</div>
                </div>
              )
            }
            
            return null
          })}
          
          {/* Example Image for FILL_MISSING_INTRO */}
          {phase === 'FILL_MISSING_INTRO' && waitingForRangerAction && (
            <div style={{
              background: '#1a1a2e',
              borderRadius: '15px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '10px',
            }}>
              <img 
                src="/jungle/object/12.png"
                alt="Example Mushroom"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'contain',
                  marginBottom: '15px',
                }}
              />
              <p style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '13px',
                color: '#fff',
                lineHeight: 1.6,
                margin: 0,
                textAlign: 'center',
              }}>
                <strong>Color:</strong> Pink / Purple<br/>
                <strong>Texture:</strong> Slimy / Webbed<br/>
                <strong>Spikes:</strong> Yes
              </p>
            </div>
          )}
          
          {/* Quiz Options for PRE_TRAINING_QUIZ */}
          {phase === 'PRE_TRAINING_QUIZ' && !preTrainingAnswered && !showTrainingReadyButton && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '15px',
            }}>
              {PRE_TRAINING_QUIZ[preTrainingQuizStep].options.map((option, index) => {
                const isWrong = wrongQuizOption === index
                const isSelected = selectedQuizOption === index
                
                return (
                  <button
                    key={index}
                    style={{
                      ...styles.modernActionButton,
                      background: isSelected ? '#00bf63' : 'rgba(139, 69, 19, 0.1)',
                      color: isSelected ? '#fff' : '#8B4513',
                      border: isWrong ? '2px solid #ff0000' : '2px solid #8B4513',
                      fontWeight: 500,
                      pointerEvents: isSelected ? 'none' : 'auto',
                    }}
                    onClick={() => handlePreTrainingQuizAnswer(index, option.correct)}
                    onMouseOver={(e) => {
                      if (!isSelected) {
                        e.target.style.background = '#8B4513'
                        e.target.style.color = '#fff'
                        e.target.style.transform = 'scale(1.02)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) {
                        e.target.style.background = 'rgba(139, 69, 19, 0.1)'
                        e.target.style.color = '#8B4513'
                        e.target.style.transform = 'scale(1)'
                      }
                    }}
                  >
                    {option.text}
                  </button>
                )
              })}
            </div>
          )}
          
          {/* Ready Let's GO Button */}
          {phase === 'PRE_TRAINING_QUIZ' && showTrainingReadyButton && (
            <button 
              style={styles.modernActionButton}
              onClick={handleReadyLetsGo}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              Ready, Let's GO!
            </button>
          )}
          
          {/* Quiz Options for TRAINING_COMPLETE_QUIZ */}
          {phase === 'TRAINING_COMPLETE_QUIZ' && !trainingCompleteQuizAnswered && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '15px',
            }}>
              {TRAINING_COMPLETE_QUIZ.options.map((option, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.modernActionButton,
                    background: 'rgba(139, 69, 19, 0.1)',
                    color: '#8B4513',
                    border: '2px solid #8B4513',
                    fontWeight: 500,
                  }}
                  onClick={() => handleTrainingCompleteQuizAnswer(index, option.correct)}
                  onMouseOver={(e) => {
                    e.target.style.background = '#8B4513'
                    e.target.style.color = '#fff'
                    e.target.style.transform = 'scale(1.02)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(139, 69, 19, 0.1)'
                    e.target.style.color = '#8B4513'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
          
          {/* Continue to Test Button */}
          {phase === 'TRAINING_COMPLETE_QUIZ' && trainingCompleteQuizAnswered && waitingForRangerAction && (
            <button 
              style={styles.modernActionButton}
              onClick={handleContinueToTest}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              CONTINUE TO TEST
            </button>
          )}
          
          {/* Quiz Options for ADJUST_MODEL_INTRO */}
          {phase === 'ADJUST_MODEL_INTRO' && !adjustQuizAnswered && !showSelectDataButton && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginTop: '15px',
            }}>
              {ADJUST_MODEL_QUIZ.options.map((option, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.modernActionButton,
                    background: 'rgba(139, 69, 19, 0.1)',
                    color: '#8B4513',
                    border: '2px solid #8B4513',
                    fontWeight: 500,
                  }}
                  onClick={() => handleAdjustModelQuizAnswer(index, option.correct)}
                  onMouseOver={(e) => {
                    e.target.style.background = '#8B4513'
                    e.target.style.color = '#fff'
                    e.target.style.transform = 'scale(1.02)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(139, 69, 19, 0.1)'
                    e.target.style.color = '#8B4513'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
          
          {/* Select Training Data Button */}
          {phase === 'ADJUST_MODEL_INTRO' && showSelectDataButton && (
            <button 
              style={styles.modernActionButton}
              onClick={handleSelectTrainingData}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              SELECT TRAINING DATA
            </button>
          )}
          
          {/* Mission Accepted Button */}
          {(phase === 'INTRO' || phase === 'LABEL_INTRO' || phase === 'FILL_MISSING_INTRO') && waitingForRangerAction && (
            <button 
              style={styles.modernActionButton}
              onClick={handleMissionAccepted}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)'
              }}
            >
              MISSION ACCEPTED
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* CSS Animation for bouncing mushrooms */}
      <style>
        {`
          @keyframes bounceMove {
            0% {
              transform: translateX(0) translateY(0);
            }
            25% {
              transform: translateX(-20vw) translateY(-15px);
            }
            50% {
              transform: translateX(-40vw) translateY(0);
            }
            75% {
              transform: translateX(-60vw) translateY(-15px);
            }
            100% {
              transform: translateX(-80vw) translateY(0);
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
        {/* Only show overlay for non-color-map phases */}
        {phase !== 'COLOR_MAP_EXPLORATION' && phase !== 'LOADING' && (
          <div style={styles.overlay}></div>
        )}

      {/* Loading Phase - Full black background */}
      {phase === 'LOADING' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '60px',
        }}>
          {/* Loading Text - Moved up */}
          <div style={styles.loadingContainer}>
            <h2 style={styles.loadingTitle}>Loading...</h2>
            <div style={styles.loadingBar}>
              <div style={{...styles.loadingFill, width: `${loadingProgress}%`}} />
            </div>
          </div>
          
          {/* Bouncing Mushrooms Animation - Below loading text */}
          <div style={{
            width: '60%',
            height: '80px',
            background: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {[...Array(10)].map((_, index) => (
              <img
                key={index}
                src={index % 2 === 0 ? '/jungle/icon/red.svg' : '/jungle/icon/green.svg'}
                alt="mushroom"
                style={{
                  width: '40px',
                  height: '40px',
                  position: 'absolute',
                  animation: `bounceMove 3s ease-in-out infinite`,
                  animationDelay: `${index * 0.2}s`,
                  left: `${100 - (index * 8)}%`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Color Map Exploration Phase - Replace everything */}
      {phase === 'COLOR_MAP_EXPLORATION' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#000',
          zIndex: 100,
        }}>
          <div style={styles.colorMapContainer}>
            {/* Color Map Background */}
            <div 
              style={{
                ...styles.colorMapWrapper,
                transform: mapPositionTransforms[mapPosition],
              }}
            >
              <img 
                src="/jungle/map_color.png"
                alt="Fungi Jungle Color Map"
                style={styles.colorMapImage}
              />
            </div>

            {/* Exit Button */}
            <button style={styles.exitButton} onClick={onExit}>{t('exit')}</button>

            {/* Glitch NPC */}
            <div 
              style={{
                ...styles.glitchNpc,
                width: '120px',
                height: '120px',
              }}
              onClick={handleGlitchClickColorMap}
            >
              <img src="/npc/npc_jungle.png" alt="Glitch" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            
            {/* Glitch Chat Dialogue */}
            {showGlitchChatDialogue && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '150px',
                width: '350px',
                background: 'rgba(255, 255, 255, 0.98)',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                zIndex: 150,
                border: '3px solid #8B4513',
              }}>
                {/* Close button */}
                <button
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
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
                  }}
                  onClick={() => {
                    setShowGlitchChatDialogue(false)
                    setGlitchChatHistory([]) // Clear chat history when closing
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#333'
                    e.target.style.transform = 'scale(1.1)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#999'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  ✕
                </button>
                
                {/* Header with avatar and name */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '15px',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '24px' }}>👾</span>
                  </div>
                  <h4 style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#333',
                    margin: 0,
                  }}>Glitch</h4>
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
                    <p style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '14px',
                      color: '#666',
                      lineHeight: 1.6,
                      margin: 0,
                    }}>
                      You know, technology didn't save the day—YOU did. An AI is just a tool. It was your careful choices as a 'Data Detective' that taught it to see the truth.
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
                          ? 'rgba(139, 69, 19, 0.1)' 
                          : 'rgba(139, 69, 19, 0.05)',
                        border: message.role === 'user'
                          ? '1px solid rgba(139, 69, 19, 0.3)'
                          : '1px solid rgba(139, 69, 19, 0.1)',
                        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                      }}
                    >
                      <div style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#8B4513',
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
                  {isGlitchChatTyping && (
                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: 'rgba(139, 69, 19, 0.05)',
                      border: '1px solid rgba(139, 69, 19, 0.1)',
                      alignSelf: 'flex-start',
                      maxWidth: '85%',
                    }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#8B4513',
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
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '25px',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#8B4513'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                  }}
                >
                  <input
                    type="text"
                    placeholder="Ask Glitch anything..."
                    value={glitchChatInput}
                    onChange={(e) => setGlitchChatInput(e.target.value)}
                    onKeyPress={handleGlitchChatInputKeyPress}
                    disabled={isGlitchChatTyping}
                    style={{
                      flex: 1,
                      padding: '10px 15px',
                      border: 'none',
                      background: 'transparent',
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '14px',
                      color: '#333',
                      outline: 'none',
                    }}
                  />
                  <div style={{
                    width: '2px',
                    height: '24px',
                    background: '#e0e0e0',
                    borderRadius: '1px',
                    flexShrink: 0,
                  }}></div>
                  <button
                    onClick={handleGlitchChatSend}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      cursor: isGlitchChatTyping ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                      opacity: isGlitchChatTyping ? 0.5 : 1,
                    }}
                    disabled={isGlitchChatTyping}
                    onMouseOver={(e) => {
                      if (!isGlitchChatTyping) e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    <img 
                      src="/icon/send.png" 
                      alt="Send" 
                      style={{
                        width: '24px',
                        height: '24px',
                        objectFit: 'contain',
                      }}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Arrows */}
            {colorMapNavigation[mapPosition]?.up !== undefined && (
              <button 
                style={{ ...styles.colorMapNavArrow, ...styles.colorMapUpArrow }}
                onClick={() => handleMapNavigate('up')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
              >
                <img 
                  src="/jungle/icon/up.png" 
                  alt="Up" 
                  style={styles.colorMapArrowImage}
                />
              </button>
            )}
            {colorMapNavigation[mapPosition]?.down !== undefined && (
              <button 
                style={{ ...styles.colorMapNavArrow, ...styles.colorMapDownArrow }}
                onClick={() => handleMapNavigate('down')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
              >
                <img 
                  src="/jungle/icon/down.png" 
                  alt="Down" 
                  style={styles.colorMapArrowImage}
                />
              </button>
            )}
            {colorMapNavigation[mapPosition]?.left !== undefined && (
              <button 
                style={{ ...styles.colorMapNavArrow, ...styles.colorMapLeftArrow }}
                onClick={() => handleMapNavigate('left')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
              >
                <img 
                  src="/jungle/icon/left.png" 
                  alt="Left" 
                  style={styles.colorMapArrowImage}
                />
              </button>
            )}
            {colorMapNavigation[mapPosition]?.right !== undefined && (
              <button 
                style={{ ...styles.colorMapNavArrow, ...styles.colorMapRightArrow }}
                onClick={() => handleMapNavigate('right')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
              >
                <img 
                  src="/jungle/icon/right.png" 
                  alt="Right" 
                  style={styles.colorMapArrowImage}
                />
              </button>
            )}

            {/* Mushrooms in current area */}
            {colorMapMushrooms[mapPosition]?.map((mushroom) => (
              <div
                key={mushroom.id}
                style={{
                  ...styles.colorMapMushroom,
                  width: `${mushroom.size}px`,
                  height: `${mushroom.size}px`,
                  top: mushroom.top,
                  bottom: mushroom.bottom,
                  left: mushroom.left,
                  right: mushroom.right,
                }}
                onClick={() => handleMushroomClick(mushroom.id)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src={`/jungle/object/${mushroom.id}.png`}
                  alt={`Mushroom ${mushroom.id}`}
                  style={styles.colorMapMushroomImage}
                />
                {/* Only show status badge when mushroom is clicked */}
                {clickedMushroom === mushroom.id && (
                  <div 
                    style={{
                      ...styles.mushroomStatusBadge,
                      ...(mushroom.status === 'DANGER' ? styles.dangerBadge : styles.edibleBadge),
                    }}
                  >
                    <img 
                      src={mushroom.status === 'DANGER' ? '/jungle/icon/wrong.png' : '/jungle/icon/correct.png'}
                      alt={mushroom.status}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span>{mushroom.status} ({mushroom.toxicity})</span>
                  </div>
                )}
              </div>
            ))}

            {/* NPC in current area */}
            {colorMapNpcs[mapPosition] && (
              <div
                style={{
                  ...styles.colorMapNpc,
                  top: colorMapNpcs[mapPosition].top,
                  bottom: colorMapNpcs[mapPosition].bottom,
                  left: colorMapNpcs[mapPosition].left,
                  right: colorMapNpcs[mapPosition].right,
                  width: colorMapNpcs[mapPosition].width,
                  height: colorMapNpcs[mapPosition].height,
                }}
                onClick={() => handleColorMapNpcClick(colorMapNpcs[mapPosition].npc)}
                onMouseEnter={() => handleColorMapNpcHover(colorMapNpcs[mapPosition].npc, true)}
                onMouseLeave={() => handleColorMapNpcHover(colorMapNpcs[mapPosition].npc, false)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src={colorMapNpcs[mapPosition].image}
                  alt={colorMapNpcs[mapPosition].npc}
                  style={styles.colorMapNpcImage}
                />
              </div>
            )}

            {/* NPC Dialogue - Irregular bubble design */}
            {showNpcDialogue && (
              <div style={{
                ...styles.colorMapDialogueContainer,
                ...(currentNpc === 'npc_a' ? styles.dialogueContainerNpcA :
                    currentNpc === 'npc_b' ? styles.dialogueContainerNpcB :
                    currentNpc === 'npc_c' ? styles.dialogueContainerRangerMoss : {})
              }}>
                <div style={styles.colorMapDialogueBox}>
                  <div style={styles.colorMapSpeakerName}>
                    {currentNpc === 'npc_a' ? 'NPC A' : 
                     currentNpc === 'npc_b' ? 'NPC B' : 
                     currentNpc === 'npc_c' ? 'Ranger Moss' : 'NPC'}
                  </div>
                  <p style={styles.colorMapDialogueText}>
                    {colorMapNpcIsTyping ? (
                      <>
                        {colorMapNpcDisplayedText}
                        <span style={{ opacity: 0.5 }}>|</span>
                      </>
                    ) : (
                      npcDialogueText
                    )}
                  </p>
                  
                  {/* Camera Icon for NPC A and B on last dialogue */}
                  {(currentNpc === 'npc_a' || currentNpc === 'npc_b') && 
                   !colorMapNpcIsTyping &&
                   colorMapNpcs[mapPosition]?.dialogues[currentDialogueSet] &&
                   currentDialogueIndex === colorMapNpcs[mapPosition].dialogues[currentDialogueSet].length - 1 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '15px',
                    }}>
                      <img 
                        src="/jungle/icon/photo.svg" 
                        alt="Camera" 
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain',
                          cursor: 'pointer',
                          transition: 'transform 0.3s',
                        }}
                        onClick={() => handleCameraIconClick(currentNpc)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.15)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      />
                    </div>
                  )}
                  
                  <button
                    style={styles.colorMapContinueButton}
                    onClick={(currentNpc === 'npc_c' || currentNpc === 'npc_a' || currentNpc === 'npc_b') ? handleDialogueContinue : () => {
                      setShowNpcDialogue(false)
                      setCurrentNpc(null)
                      typingSound.pause()
                      typingSound.currentTime = 0
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#8B4513'
                      e.target.style.color = '#fff'
                      e.target.style.transform = 'scale(1.05)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 235, 205, 0.9)'
                      e.target.style.color = '#8B4513'
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    {((currentNpc === 'npc_c' || currentNpc === 'npc_a' || currentNpc === 'npc_b') && 
                      colorMapNpcs[mapPosition]?.dialogues[currentDialogueSet] && 
                      currentDialogueIndex < colorMapNpcs[mapPosition].dialogues[currentDialogueSet].length - 1)
                     ? 'Continue →' : 'OK'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Camera Interface for NPC Photo */}
            {showNpcCamera && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: '#000',
                zIndex: 200,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Close button */}
                <button
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid #fff',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 201,
                  }}
                  onClick={handleCloseCamera}
                >
                  ✕
                </button>
                
                {/* Video stream with frame overlay */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <video
                    id="jungleCameraVideo"
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
                  
                  {/* Center square frame with thick dashed border */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    maxWidth: '500px',
                    aspectRatio: '1/1',
                    border: '5px dashed #fff',
                    pointerEvents: 'none',
                  }} />
                  
                  {/* Screen corner frames */}
                  {/* Top-left corner */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    width: '60px',
                    height: '60px',
                    borderTop: '6px solid #fff',
                    borderLeft: '6px solid #fff',
                    pointerEvents: 'none',
                  }} />
                  {/* Top-right corner */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderTop: '6px solid #fff',
                    borderRight: '6px solid #fff',
                    pointerEvents: 'none',
                  }} />
                  {/* Bottom-left corner */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    width: '60px',
                    height: '60px',
                    borderBottom: '6px solid #fff',
                    borderLeft: '6px solid #fff',
                    pointerEvents: 'none',
                  }} />
                  {/* Bottom-right corner */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderBottom: '6px solid #fff',
                    borderRight: '6px solid #fff',
                    pointerEvents: 'none',
                  }} />
                </div>
                
                {/* Capture button */}
                <button
                  style={{
                    position: 'absolute',
                    bottom: '40px',
                    background: '#009b01',
                    border: '4px solid #fff',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 25px rgba(0, 155, 1, 0.7), 0 0 15px rgba(0, 155, 1, 0.5)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onClick={handleCapturePhoto}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 155, 1, 0.8), 0 0 20px rgba(0, 155, 1, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0, 155, 1, 0.7), 0 0 15px rgba(0, 155, 1, 0.5)'
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: '#fff',
                    borderRadius: '50%',
                  }} />
                </button>
              </div>
            )}
            
            {/* Recognition Result Card */}
            {showRecognitionCard && recognitionResult && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.8)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '20px',
                  padding: '30px',
                  maxWidth: '500px',
                  width: '90%',
                  border: '4px solid #009b01',
                  boxShadow: '0 10px 40px rgba(0, 155, 1, 0.5), 0 0 20px rgba(0, 155, 1, 0.3)',
                }}>
                  {isRecognizing ? (
                    <div style={{ textAlign: 'center' }}>
                      <h2 style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '24px',
                        color: '#009b01',
                        marginBottom: '20px',
                      }}>
                        Analyzing...
                      </h2>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #009b01',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto',
                      }} />
                    </div>
                  ) : (
                    <>
                      <h2 style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '24px',
                        color: '#009b01',
                        marginBottom: '20px',
                        textAlign: 'center',
                      }}>
                        Recognition Result
                      </h2>
                      
                      {/* Photo with green border and white dashed inner frame */}
                      <div style={{
                        position: 'relative',
                        marginBottom: '20px',
                      }}>
                        <img
                          src={recognitionResult.photo}
                          alt="Captured"
                          style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            border: '4px solid #009b01',
                            boxShadow: '0 4px 15px rgba(0, 155, 1, 0.4), 0 0 10px rgba(0, 155, 1, 0.2)',
                          }}
                        />
                        {/* White dashed inner frame */}
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          right: '15px',
                          bottom: '15px',
                          border: '2px dashed #fff',
                          borderRadius: '6px',
                          pointerEvents: 'none',
                        }} />
                      </div>
                      
                      {/* Result info */}
                      <div style={{
                        background: 'rgba(0, 155, 1, 0.1)',
                        padding: '20px',
                        borderRadius: '10px',
                        marginBottom: '20px',
                      }}>
                        <p style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#333',
                          marginBottom: '10px',
                        }}>
                          Item: {recognitionResult.item}
                        </p>
                        <p style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '16px',
                          color: '#666',
                        }}>
                          Type: {recognitionResult.type}
                        </p>
                      </div>
                      
                      {/* Validation Card */}
                      {showValidationCard && (
                        <div style={{
                          background: '#fff',
                          border: '2px solid #ccc',
                          borderRadius: '10px',
                          padding: '20px',
                          marginBottom: '20px',
                        }}>
                          <p style={{
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: '16px',
                            color: '#333',
                            marginBottom: '15px',
                            textAlign: 'center',
                          }}>
                            Is this a correct detection?
                          </p>
                          
                          {/* Validation buttons */}
                          <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                          }}>
                            <button
                              style={{
                                flex: 1,
                                padding: '12px',
                                background: '#7ed957',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                              }}
                              onClick={handleLabelCorrect}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(126, 217, 87, 0.4)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            >
                              <img src="/jungle/icon/correct.png" alt="Correct" style={{ width: '24px', height: '24px' }} />
                              <span style={{
                                fontFamily: "'Roboto', sans-serif",
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#fff',
                              }}>
                                Label Correct
                              </span>
                            </button>
                            
                            <button
                              style={{
                                flex: 1,
                                padding: '12px',
                                background: '#ff3131',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                              }}
                              onClick={handleLabelIncorrect}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 49, 49, 0.4)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                                e.currentTarget.style.boxShadow = 'none'
                              }}
                            >
                              <img src="/jungle/icon/wrong.png" alt="Incorrect" style={{ width: '24px', height: '24px' }} />
                              <span style={{
                                fontFamily: "'Roboto', sans-serif",
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#fff',
                              }}>
                                Label Incorrect
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Download and Save buttons (shown after validation) */}
                      {!showValidationCard && (
                        <div style={{
                          display: 'flex',
                          gap: '15px',
                          justifyContent: 'center',
                        }}>
                          <button
                            style={{
                              flex: 1,
                              padding: '15px',
                              background: '#fff',
                              color: '#333',
                              border: '2px solid #ccc',
                              borderRadius: '10px',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontFamily: "'Roboto', sans-serif",
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                            }}
                            onClick={handleDownloadPhoto}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)'
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <img src="/jungle/icon/download.png" alt="Download" style={{ width: '24px', height: '24px' }} />
                            <span>Download</span>
                          </button>
                          
                          <button
                            style={{
                              flex: 1,
                              padding: '15px',
                              background: '#006300',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '10px',
                              fontSize: '16px',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              fontFamily: "'Roboto', sans-serif",
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                            }}
                            onClick={handleSaveToJournal}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)'
                              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 99, 0, 0.4)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <img src="/jungle/icon/save.png" alt="Save" style={{ width: '24px', height: '24px' }} />
                            <span>Save</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All other phases - only show when not in LOADING or COLOR_MAP_EXPLORATION */}
      {phase !== 'LOADING' && phase !== 'COLOR_MAP_EXPLORATION' && (
        <>
          {/* Exit Button */}
          <button style={styles.exitButton} onClick={onExit}>{t('exit')}</button>

          {/* Glitch NPC */}
          <div 
            style={styles.glitchNpc}
            onClick={() => {
              setShowGlitchChatDialogue(true)
            }}
          >
            <img src="/npc/npc_jungle.png" alt="Glitch" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          
          {/* Glitch Chat Dialogue - Modern Design */}
          {showGlitchChatDialogue && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '150px',
              width: '350px',
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 150,
              border: '3px solid #8B4513',
            }}>
              {/* Close button */}
              <button
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
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
                }}
                onClick={() => {
                  setShowGlitchChatDialogue(false)
                  setGlitchChatHistory([])
                }}
                onMouseOver={(e) => {
                  e.target.style.color = '#333'
                  e.target.style.transform = 'scale(1.1)'
                }}
                onMouseOut={(e) => {
                  e.target.style.color = '#999'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                ✕
              </button>
              
              {/* Header with avatar and name */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '15px',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '24px' }}>👾</span>
                </div>
                <h4 style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#333',
                  margin: 0,
                }}>Glitch</h4>
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
                {/* Initial greeting based on phase */}
                {glitchChatHistory.length === 0 && (
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {phase === 'NOISE_REMOVAL' 
                      ? "First, look at what you collected. Some of these aren't mushrooms at all! These are what we call 'Noise'."
                      : phase === 'LABEL_CORRECTION'
                      ? BATCH_HINTS[labelBatch]
                      : "I'm here to help you with data cleaning and labeling. Ask me anything!"}
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
                        ? 'rgba(139, 69, 19, 0.1)' 
                        : 'rgba(139, 69, 19, 0.05)',
                      border: message.role === 'user'
                        ? '1px solid rgba(139, 69, 19, 0.3)'
                        : '1px solid rgba(139, 69, 19, 0.1)',
                      alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                    }}
                  >
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#8B4513',
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
                {isGlitchChatTyping && (
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(139, 69, 19, 0.05)',
                    border: '1px solid rgba(139, 69, 19, 0.1)',
                    alignSelf: 'flex-start',
                    maxWidth: '85%',
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 'bold',
                      color: '#8B4513',
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
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '25px',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#8B4513'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0'
                }}
              >
                <input
                  type="text"
                  placeholder="Ask Glitch anything..."
                  value={glitchChatInput}
                  onChange={(e) => setGlitchChatInput(e.target.value)}
                  onKeyPress={handleGlitchChatInputKeyPress}
                  disabled={isGlitchChatTyping}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    border: 'none',
                    background: 'transparent',
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '14px',
                    color: '#333',
                    outline: 'none',
                  }}
                />
                <div style={{
                  width: '2px',
                  height: '24px',
                  background: '#e0e0e0',
                  borderRadius: '1px',
                  flexShrink: 0,
                }}></div>
                <button
                  onClick={handleGlitchChatSend}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: isGlitchChatTyping ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s',
                    flexShrink: 0,
                    opacity: isGlitchChatTyping ? 0.5 : 1,
                  }}
                  disabled={isGlitchChatTyping}
                  onMouseOver={(e) => {
                    if (!isGlitchChatTyping) e.currentTarget.style.transform = 'scale(1.1)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <img 
                    src="/icon/send.png" 
                    alt="Send" 
                    style={{
                      width: '24px',
                      height: '24px',
                      objectFit: 'contain',
                    }}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Ranger Moss NPC */}
          <img src="/jungle/npc_c.png" alt="Ranger Moss" style={styles.rangerNpc} />
          
          {/* Modern Ranger Moss Dialogue */}
          {renderModernRangerDialogue()}
        </>
      )}

      {/* Noise Removal Phase - New Design */}
      {phase === 'NOISE_REMOVAL' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          height: '80%',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 50,
        }}>
          {/* Title */}
          <div style={{
            background: '#fff',
            border: '3px solid #00bf63',
            borderRadius: '15px',
            padding: '12px 35px',
            marginBottom: '15px',
          }}>
            <h2 style={{
              fontFamily: "'Coming Soon', cursive",
              fontSize: '28px',
              color: '#333',
              margin: 0,
              letterSpacing: '2px',
            }}>
              CLEAN THE DATA
            </h2>
          </div>
          
          {/* Subtitle */}
          <p style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '16px',
            color: '#fff',
            marginBottom: '20px',
          }}>
            Please click on the <span style={{ fontWeight: 'bold', color: '#00bf63' }}>irrelevant items</span>. Keep ONLY the mushrooms!
          </p>
          
          {/* Items Grid */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {currentBatchItems.map(id => {
              const isRemoved = removedItems.includes(id)
              const isWrong = wrongSelections.includes(id)
              
              return (
                <div
                  key={id}
                  style={{
                    width: '140px',
                    height: '140px',
                    background: isRemoved ? 'transparent' : '#fff',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isRemoved ? 'default' : 'pointer',
                    boxShadow: isRemoved ? 'none' : (isWrong ? '0 0 20px rgba(255, 0, 0, 0.8)' : '0 0 20px rgba(255, 255, 255, 0.5)'),
                    border: isWrong ? '3px solid #ff0000' : 'none',
                    transition: 'all 0.3s',
                    opacity: isRemoved ? 0 : 1,
                  }}
                  onClick={() => !isRemoved && handleItemClick(id)}
                  onMouseOver={(e) => {
                    if (!isRemoved) {
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {!isRemoved && (
                    <img 
                      src={`/jungle/object/${id}.png`}
                      alt={`Object ${id}`}
                      style={{
                        width: '110px',
                        height: '110px',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </div>
              )
            })}
            
            {/* Next Button */}
            {noiseBatch < 1 && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#fff',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  padding: '8px 15px',
                  transition: 'transform 0.2s',
                }}
                onClick={handleNoiseNext}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                NEXT
                <img 
                  src="/jungle/icon/right.png"
                  alt="Next"
                  style={{ width: '25px', height: '25px' }}
                />
              </button>
            )}
          </div>
          
          {/* Trash Area */}
          <div style={{
            display: 'flex',
            gap: '20px',
            marginTop: 'auto',
          }}>
            {/* Trash Bins - Show removed items */}
            {[0, 1, 2].map(i => {
              const removedItem = removedItems[i] // Get the i-th removed item
              
              return (
                <div
                  key={i}
                  style={{
                    width: '140px',
                    height: '140px',
                    background: '#00bf63',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  {/* Trash icon as background */}
                  <img 
                    src="/jungle/icon/trash.svg"
                    alt="Trash"
                    style={{
                      width: '70px',
                      height: '70px',
                      filter: 'brightness(0) invert(1)',
                      opacity: removedItem ? 0.3 : 1,
                      position: 'absolute',
                    }}
                  />
                  
                  {/* Show removed item on top of trash icon */}
                  {removedItem && (
                    <img 
                      src={`/jungle/object/${removedItem}.png`}
                      alt={`Removed ${removedItem}`}
                      style={{
                        width: '110px',
                        height: '110px',
                        objectFit: 'contain',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Final Next Button */}
          {noiseBatch === 1 && (
            <button
              style={{
                marginTop: '20px',
                background: '#00bf63',
                border: 'none',
                borderRadius: '10px',
                padding: '15px 40px',
                color: '#fff',
                fontFamily: "'Roboto', sans-serif",
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={handleNoiseNext}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              CONTINUE
            </button>
          )}
        </div>
      )}

      {/* Label Correction Phase */}
      {phase === 'LABEL_CORRECTION' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85%',
          height: '85%',
          background: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '20px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 50,
        }}>
          {/* Title */}
          <div style={{
            background: '#fff',
            border: '3px solid #00bf63',
            borderRadius: '15px',
            padding: '15px 40px',
            marginBottom: '15px',
          }}>
            <h2 style={{
              fontFamily: "'Coming Soon', cursive",
              fontSize: '32px',
              color: '#333',
              margin: 0,
              letterSpacing: '2px',
            }}>
              CORRECT LABELS
            </h2>
          </div>
          
          {/* Subtitle */}
          <p style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '14px',
            color: '#fff',
            marginBottom: '25px',
            textAlign: 'center',
          }}>
            Click on the cells that contain <span style={{ fontWeight: 'bold', color: '#00bf63' }}>ERRORS</span> to select them. Find all the incorrect data!
          </p>
          
          {/* Table Container */}
          <div style={{
            width: '100%',
            flex: 1,
            overflowY: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            padding: '25px',
            border: '3px solid #8FCCAE',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), inset 0 2px 5px rgba(143, 204, 174, 0.2)',
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
            }}>
              <thead>
                <tr>
                  <th style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    padding: '18px 15px',
                    borderBottom: '3px solid #8FCCAE',
                    textAlign: 'left',
                    background: 'rgba(143, 204, 174, 0.1)',
                  }}>ID</th>
                  <th style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    padding: '18px 15px',
                    borderBottom: '3px solid #8FCCAE',
                    textAlign: 'left',
                    background: 'rgba(143, 204, 174, 0.1)',
                  }}>Name</th>
                  <th style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    padding: '18px 15px',
                    borderBottom: '3px solid #8FCCAE',
                    textAlign: 'left',
                    background: 'rgba(143, 204, 174, 0.1)',
                  }}>Color</th>
                  <th style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    padding: '18px 15px',
                    borderBottom: '3px solid #8FCCAE',
                    textAlign: 'left',
                    background: 'rgba(143, 204, 174, 0.1)',
                  }}>Texture</th>
                  <th style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    padding: '18px 15px',
                    borderBottom: '3px solid #8FCCAE',
                    textAlign: 'left',
                    background: 'rgba(143, 204, 174, 0.1)',
                  }}>Spikes</th>
                  <th style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#1a1a1a',
                    textTransform: 'uppercase',
                    padding: '18px 15px',
                    borderBottom: '3px solid #8FCCAE',
                    textAlign: 'left',
                    background: 'rgba(143, 204, 174, 0.1)',
                  }}>Toxic</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((row, rowIndex) => (
                  <tr key={row.id}>
                    <td style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '15px',
                      color: '#1a1a1a',
                      padding: '18px 15px',
                      borderBottom: '1px solid #e0e0e0',
                      background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                    }}>{row.id}</td>
                    <td 
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        color: rowIndex % 2 === 0 ? '#1a1a1a' : '#2d5f3f',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                        cursor: 'pointer',
                        ...(isCellWrong(row.id, 'name') && {
                          background: 'rgba(255, 0, 0, 0.3)',
                          border: '2px solid #ff0000',
                          borderRadius: '6px',
                        }),
                        ...(isCellSelected(row.id, 'name') && !isCellWrong(row.id, 'name') && {
                          background: 'rgba(143, 204, 174, 0.4)',
                          border: '2px solid #00bf63',
                          borderRadius: '6px',
                        }),
                      }}
                      onClick={() => handleCellClick(row.id, 'name')}
                    >{row.name}</td>
                    <td 
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        color: rowIndex % 2 === 0 ? '#2d5f3f' : '#1a1a1a',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                        cursor: 'pointer',
                        ...(isCellWrong(row.id, 'color') && {
                          background: 'rgba(255, 0, 0, 0.3)',
                          border: '2px solid #ff0000',
                          borderRadius: '6px',
                        }),
                        ...(isCellSelected(row.id, 'color') && !isCellWrong(row.id, 'color') && {
                          background: 'rgba(143, 204, 174, 0.4)',
                          border: '2px solid #00bf63',
                          borderRadius: '6px',
                        }),
                      }}
                      onClick={() => handleCellClick(row.id, 'color')}
                    >{row.color}</td>
                    <td 
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        color: rowIndex % 2 === 0 ? '#1a1a1a' : '#2d5f3f',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                        cursor: 'pointer',
                        ...(isCellWrong(row.id, 'texture') && {
                          background: 'rgba(255, 0, 0, 0.3)',
                          border: '2px solid #ff0000',
                          borderRadius: '6px',
                        }),
                        ...(isCellSelected(row.id, 'texture') && !isCellWrong(row.id, 'texture') && {
                          background: 'rgba(143, 204, 174, 0.4)',
                          border: '2px solid #00bf63',
                          borderRadius: '6px',
                        }),
                      }}
                      onClick={() => handleCellClick(row.id, 'texture')}
                    >{row.texture}</td>
                    <td 
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        color: rowIndex % 2 === 0 ? '#2d5f3f' : '#1a1a1a',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                        cursor: 'pointer',
                        ...(isCellWrong(row.id, 'spikes') && {
                          background: 'rgba(255, 0, 0, 0.3)',
                          border: '2px solid #ff0000',
                          borderRadius: '6px',
                        }),
                        ...(isCellSelected(row.id, 'spikes') && !isCellWrong(row.id, 'spikes') && {
                          background: 'rgba(143, 204, 174, 0.4)',
                          border: '2px solid #00bf63',
                          borderRadius: '6px',
                        }),
                      }}
                      onClick={() => handleCellClick(row.id, 'spikes')}
                    >{row.spikes}</td>
                    <td 
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        color: rowIndex % 2 === 0 ? '#1a1a1a' : '#2d5f3f',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                        cursor: 'pointer',
                        ...(isCellWrong(row.id, 'toxic') && {
                          background: 'rgba(255, 0, 0, 0.3)',
                          border: '2px solid #ff0000',
                          borderRadius: '6px',
                        }),
                        ...(isCellSelected(row.id, 'toxic') && !isCellWrong(row.id, 'toxic') && {
                          background: 'rgba(143, 204, 174, 0.4)',
                          border: '2px solid #00bf63',
                          borderRadius: '6px',
                        }),
                      }}
                      onClick={() => handleCellClick(row.id, 'toxic')}
                    >{row.toxic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Next Button */}
          <button
            style={{
              marginTop: '20px',
              background: '#00bf63',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 40px',
              color: '#fff',
              fontFamily: "'Roboto', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onClick={handleLabelNext}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            NEXT
            <img 
              src="/jungle/icon/right.png"
              alt="Next"
              style={{ width: '24px', height: '24px' }}
            />
          </button>
        </div>
      )}

      {/* Fill Missing Values Phase */}
      {phase === 'FILL_MISSING' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          height: '70%',
          display: 'flex',
          gap: '20px',
          zIndex: 50,
        }}>
          {/* Left side: Title + Table combined */}
          <div style={{
            width: '65%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {/* Card 1: Title - 22% of parent height */}
            <div style={{
              height: '22%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '3px solid #00bf63',
              borderRadius: '15px',
              padding: '20px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <h2 style={{
                fontFamily: "'Coming Soon', cursive",
                fontSize: '32px',
                color: '#333',
                margin: '0 0 10px 0',
                letterSpacing: '2px',
              }}>
                FILL MISSING VALUES
              </h2>
              <p style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '14px',
                color: '#666',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}>
                Click on the 
                <img 
                  src="/jungle/icon/question.svg" 
                  alt="?" 
                  style={{ width: '20px', height: '20px' }}
                />
                cells to fill in the missing data based on the mushroom photo.
              </p>
            </div>

            {/* Card 2: Table - 65% of parent height */}
            <div style={{
              height: '65%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '3px solid #8FCCAE',
              borderRadius: '15px',
              padding: '25px',
              overflowY: 'auto',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
              }}>
                <thead>
                  <tr>
                    <th style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      padding: '18px 15px',
                      borderBottom: '3px solid #8FCCAE',
                      textAlign: 'left',
                      background: 'rgba(143, 204, 174, 0.1)',
                    }}>ID</th>
                    <th style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      padding: '18px 15px',
                      borderBottom: '3px solid #8FCCAE',
                      textAlign: 'left',
                      background: 'rgba(143, 204, 174, 0.1)',
                    }}>Mushroom</th>
                    <th style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      padding: '18px 15px',
                      borderBottom: '3px solid #8FCCAE',
                      textAlign: 'left',
                      background: 'rgba(143, 204, 174, 0.1)',
                    }}>Color</th>
                    <th style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      padding: '18px 15px',
                      borderBottom: '3px solid #8FCCAE',
                      textAlign: 'left',
                      background: 'rgba(143, 204, 174, 0.1)',
                    }}>Texture</th>
                    <th style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      padding: '18px 15px',
                      borderBottom: '3px solid #8FCCAE',
                      textAlign: 'left',
                      background: 'rgba(143, 204, 174, 0.1)',
                    }}>Spikes</th>
                    <th style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1a1a1a',
                      textTransform: 'uppercase',
                      padding: '18px 15px',
                      borderBottom: '3px solid #8FCCAE',
                      textAlign: 'left',
                      background: 'rgba(143, 204, 174, 0.1)',
                    }}>Toxic</th>
                  </tr>
                </thead>
                <tbody>
                  {MISSING_DATA.map((row, rowIndex) => (
                    <tr key={row.id}>
                      <td style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '17px',
                        color: '#1a1a1a',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                      }}>#{row.id}</td>
                      <td style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '17px',
                        color: rowIndex % 2 === 0 ? '#1a1a1a' : '#2d5f3f',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                      }}>{row.name}</td>
                      <td 
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '17px',
                          color: rowIndex % 2 === 0 ? '#2d5f3f' : '#1a1a1a',
                          padding: '18px 15px',
                          borderBottom: '1px solid #e0e0e0',
                          background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                          cursor: row.missingField === 'color' && !filledValues[row.id] ? 'pointer' : 'default',
                          ...(row.missingField === 'color' && !filledValues[row.id] && {
                            background: 'rgba(255, 200, 100, 0.3)',
                            borderRadius: '6px',
                          }),
                          ...(row.missingField === 'color' && selectedMissingCell?.itemId === row.id && {
                            background: 'rgba(143, 204, 174, 0.4)',
                            border: '2px solid #00bf63',
                            borderRadius: '6px',
                          }),
                          ...(row.missingField === 'color' && filledValues[row.id] && {
                            background: 'rgba(100, 200, 100, 0.3)',
                            borderRadius: '6px',
                          }),
                        }}
                        onClick={() => row.missingField === 'color' && !filledValues[row.id] && handleMissingCellClick(row.id, 'color')}
                      >
                        {row.missingField === 'color' ? (
                          filledValues[row.id] || (
                            <img 
                              src="/jungle/icon/question.svg" 
                              alt="?" 
                              style={{ width: '28px', height: '28px' }}
                            />
                          )
                        ) : row.color}
                      </td>
                      <td 
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '17px',
                          color: rowIndex % 2 === 0 ? '#1a1a1a' : '#2d5f3f',
                          padding: '18px 15px',
                          borderBottom: '1px solid #e0e0e0',
                          background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                          cursor: row.missingField === 'texture' && !filledValues[row.id] ? 'pointer' : 'default',
                          ...(row.missingField === 'texture' && !filledValues[row.id] && {
                            background: 'rgba(255, 200, 100, 0.3)',
                            borderRadius: '6px',
                          }),
                          ...(row.missingField === 'texture' && selectedMissingCell?.itemId === row.id && {
                            background: 'rgba(143, 204, 174, 0.4)',
                            border: '2px solid #00bf63',
                            borderRadius: '6px',
                          }),
                          ...(row.missingField === 'texture' && filledValues[row.id] && {
                            background: 'rgba(100, 200, 100, 0.3)',
                            borderRadius: '6px',
                          }),
                        }}
                        onClick={() => row.missingField === 'texture' && !filledValues[row.id] && handleMissingCellClick(row.id, 'texture')}
                      >
                        {row.missingField === 'texture' ? (
                          filledValues[row.id] || (
                            <img 
                              src="/jungle/icon/question.svg" 
                              alt="?" 
                              style={{ width: '28px', height: '28px' }}
                            />
                          )
                        ) : row.texture}
                      </td>
                      <td 
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '17px',
                          color: rowIndex % 2 === 0 ? '#2d5f3f' : '#1a1a1a',
                          padding: '18px 15px',
                          borderBottom: '1px solid #e0e0e0',
                          background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                          cursor: row.missingField === 'spikes' && !filledValues[row.id] ? 'pointer' : 'default',
                          ...(row.missingField === 'spikes' && !filledValues[row.id] && {
                            background: 'rgba(255, 200, 100, 0.3)',
                            borderRadius: '6px',
                          }),
                          ...(row.missingField === 'spikes' && selectedMissingCell?.itemId === row.id && {
                            background: 'rgba(143, 204, 174, 0.4)',
                            border: '2px solid #00bf63',
                            borderRadius: '6px',
                          }),
                          ...(row.missingField === 'spikes' && filledValues[row.id] && {
                            background: 'rgba(100, 200, 100, 0.3)',
                            borderRadius: '6px',
                          }),
                        }}
                        onClick={() => row.missingField === 'spikes' && !filledValues[row.id] && handleMissingCellClick(row.id, 'spikes')}
                      >
                        {row.missingField === 'spikes' ? (
                          filledValues[row.id] || (
                            <img 
                              src="/jungle/icon/question.svg" 
                              alt="?" 
                              style={{ width: '28px', height: '28px' }}
                            />
                          )
                        ) : row.spikes}
                      </td>
                      <td style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '17px',
                        color: rowIndex % 2 === 0 ? '#1a1a1a' : '#2d5f3f',
                        padding: '18px 15px',
                        borderBottom: '1px solid #e0e0e0',
                        background: rowIndex % 2 === 0 ? '#fff' : 'rgba(143, 204, 174, 0.05)',
                      }}>{row.toxic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right side: Card 3 - Image Panel - 90% height */}
          <div style={{
            width: '30%',
            height: '90%',
            background: 'rgba(45, 95, 63, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '2px dashed #8FCCAE',
            borderRadius: '15px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
          }}>
              {!selectedMissingCell ? (
                <>
                  <img 
                    src="/jungle/icon/mushroom.svg"
                    alt="Mushroom"
                    style={{
                      width: '120px',
                      height: '120px',
                      opacity: 0.5,
                    }}
                  />
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    color: '#fff',
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    Waiting for Input
                  </p>
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    Select a ? cell on the data table to activate the Magic Scanner.
                  </p>
                </>
              ) : (
                <>
                  <img 
                    src={`/jungle/object/${selectedMissingCell.itemId}.png`}
                    alt={`Mushroom ${selectedMissingCell.itemId}`}
                    style={{
                      width: '240px',
                      height: '240px',
                      objectFit: 'contain',
                      marginBottom: '5px',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '100%',
                  }}>
                    {MISSING_DATA.find(d => d.id === selectedMissingCell.itemId)?.options.map((option, index) => (
                      <button
                        key={index}
                        style={{
                          padding: '12px 20px',
                          fontFamily: "'Roboto Mono', monospace",
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#fff',
                          background: 'rgba(143, 204, 174, 0.3)',
                          backdropFilter: 'blur(10px)',
                          border: '2px solid rgba(143, 204, 174, 0.5)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onClick={() => handleOptionSelect(option)}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(143, 204, 174, 0.5)'
                          e.target.style.borderColor = '#8FCCAE'
                          e.target.style.transform = 'scale(1.02)'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(143, 204, 174, 0.3)'
                          e.target.style.borderColor = 'rgba(143, 204, 174, 0.5)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
          </div>

          {/* Complete Button - Positioned below and centered */}
          <button
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#00bf63',
              border: 'none',
              borderRadius: '10px',
              padding: '15px 50px',
              color: '#fff',
              fontFamily: "'Roboto', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
            onClick={handleFillMissingNext}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
          >
            COMPLETE
            <img 
              src="/jungle/icon/right.png"
              alt="Next"
              style={{ width: '24px', height: '24px' }}
            />
          </button>
        </div>
      )}

      {/* Quiz Phase */}
      {phase === 'QUIZ' && (
        <div style={styles.quizContainer}>
          <div style={styles.chatCard}>
            <div style={styles.chatMessages}>
              {chatMessages.map((msg, index) => {
                if (msg.type === 'ranger') {
                  return (
                    <div key={index}>
                      <div style={styles.rangerMessage}>
                        <div style={styles.rangerAvatar}>
                          <img src="/jungle/npc_c.png" alt="Ranger" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={styles.messageBubble}>
                          <p style={styles.messageSpeaker}>Ranger Moss:</p>
                          <p style={styles.messageText}>{msg.text}</p>
                        </div>
                      </div>
                      {/* Show options for current question */}
                      {index === chatMessages.length - 1 && quizStep < QUIZ_DATA.length && (
                        <div style={styles.quizOptions}>
                          {QUIZ_DATA[quizStep].options.map((opt, optIndex) => {
                            const answered = selectedAnswers[quizStep] !== undefined
                            const isSelected = selectedAnswers[quizStep]?.optionIndex === optIndex
                            
                            return (
                              <button
                                key={optIndex}
                                style={{
                                  ...styles.quizOptionButton,
                                  ...(isSelected ? styles.quizOptionSelected : {}),
                                }}
                                onClick={() => !answered && handleQuizAnswer(optIndex, opt.correct)}
                                disabled={answered}
                              >
                                {opt.text}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                } else if (msg.type === 'user') {
                  return (
                    <div key={index} style={styles.userMessage}>
                      <div style={styles.userBubble}>
                        <p style={styles.messageText}>{msg.text}</p>
                      </div>
                    </div>
                  )
                } else if (msg.type === 'button') {
                  return (
                    <button
                      key={index}
                      style={styles.goButton}
                      onClick={handleStartTraining}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      {msg.text}
                    </button>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>
      )}

      {/* Training Phase */}
      {phase === 'TRAINING' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
        }}>
          <img 
            src="/jungle/model.GIF"
            alt="Model Training"
            style={{
              width: 'auto',
              height: '80%',
              objectFit: 'contain',
              marginBottom: '30px',
            }}
          />
          <div style={{
            width: '80%',
            height: '30px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '15px',
            overflow: 'hidden',
            border: '2px solid #8FCCAE',
          }}>
            <div style={{
              height: '100%',
              width: `${trainingProgress}%`,
              background: 'linear-gradient(90deg, #00bf63, #8FCCAE)',
              transition: 'width 0.1s linear',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#fff',
              }}>
                {trainingProgress}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Validation Intro Phase */}
      {phase === 'VALIDATION_INTRO' && (
        <div style={styles.validationContainer}>
          <div style={styles.validationCard}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            <p style={styles.validationText}>{VALIDATION_INTRO}</p>
            
            {validationStep === 0 && (
              <div style={styles.validationOptions}>
                {VALIDATION_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    style={styles.validationOption}
                    onClick={() => handleValidationAnswer(option.correct)}
                    onMouseOver={(e) => e.target.style.background = 'rgba(81, 112, 255, 0.2)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(81, 112, 255, 0.1)'}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            )}
            
            {validationStep === 1 && (
              <>
                <p style={{ ...styles.validationText, marginTop: '20px', color: '#5170FF' }}>
                  {VALIDATION_CORRECT_RESPONSE}
                </p>
                <button 
                  style={{ ...styles.goButton, marginTop: '20px' }}
                  onClick={handleValidationContinue}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Continue →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Validation Data Selection Phase */}
      {phase === 'VALIDATION_DATA' && (
        <>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '75%',
            height: '65%',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '20px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 50,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}>
            {/* Title */}
            <h2 style={{
              fontFamily: "'Coming Soon', cursive",
              fontSize: '32px',
              color: '#fff',
              margin: '0 0 10px 0',
              letterSpacing: '2px',
            }}>
              Select Testing Samples
            </h2>
            
            {/* Subtitle */}
            <p style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '14px',
              color: '#ccc',
              marginBottom: '30px',
              textAlign: 'center',
            }}>
              Select <strong>three</strong> mushrooms you want to test the AI with. Choose the <strong>NEW</strong> mushrooms that the AI hasn't seen before!
            </p>
            
            {!showPrediction ? (
              <>
                {/* Mushroom Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '25px',
                  marginBottom: '30px',
                }}>
                  {TEST_MUSHROOMS.map((mushroom) => {
                    const isSelected = selectedTestMushrooms.includes(mushroom.id)
                    
                    return (
                      <div
                        key={mushroom.id}
                        style={{
                          width: '150px',
                          height: '150px',
                          background: isSelected ? 'rgba(0, 191, 99, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.3s',
                          boxShadow: isSelected 
                            ? '0 8px 25px rgba(0, 191, 99, 0.4), inset 0 -3px 10px rgba(0, 0, 0, 0.3)'
                            : '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 -3px 10px rgba(0, 0, 0, 0.2)',
                        }}
                        onClick={() => handleTestMushroomClick(mushroom.id)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)'
                          e.currentTarget.style.boxShadow = isSelected
                            ? '0 12px 30px rgba(0, 191, 99, 0.5), inset 0 -3px 10px rgba(0, 0, 0, 0.3)'
                            : '0 8px 20px rgba(255, 255, 255, 0.2), inset 0 -3px 10px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = isSelected
                            ? '0 8px 25px rgba(0, 191, 99, 0.4), inset 0 -3px 10px rgba(0, 0, 0, 0.3)'
                            : '0 5px 15px rgba(0, 0, 0, 0.3), inset 0 -3px 10px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <img 
                          src={`/jungle/object/${mushroom.id}.png`}
                          alt={`Mushroom ${mushroom.id}`}
                          style={{
                            width: '120px',
                            height: '120px',
                            objectFit: 'contain',
                          }}
                        />
                        {isSelected && mushroom.isNew && (
                          <img 
                            src="/jungle/icon/correct.png"
                            alt="Correct"
                            style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              width: '40px',
                              height: '40px',
                            }}
                          />
                        )}
                        {isScanning && isSelected && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 191, 99, 0.3)',
                            borderRadius: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>Scanning...</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              /* Prediction Results Card */
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <h2 style={{
                  fontFamily: "'Coming Soon', cursive",
                  fontSize: '28px',
                  color: '#fff',
                  margin: '0 0 30px 0',
                  letterSpacing: '2px',
                }}>
                  YOUR AI PREDICTION
                </h2>
                
                {/* Circular Progress */}
                <div style={{
                  position: 'relative',
                  width: '200px',
                  height: '200px',
                  marginBottom: '20px',
                }}>
                  <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="15"
                    />
                    {/* Progress circle - animated */}
                    <circle
                      cx="100"
                      cy="100"
                      r="85"
                      fill="none"
                      stroke="#00bf63"
                      strokeWidth="15"
                      strokeDasharray={`${2 * Math.PI * 85 * (accuracyProgress / 100)} ${2 * Math.PI * 85}`}
                      strokeLinecap="round"
                      style={{
                        filter: 'drop-shadow(0 0 10px #00bf63)',
                        transition: 'stroke-dasharray 0.1s ease-out',
                      }}
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: "'Coming Soon', cursive",
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#00bf63',
                      lineHeight: 1,
                    }}>
                      {accuracyProgress}%
                    </div>
                  </div>
                </div>
                
                <p style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '18px',
                  color: '#ccc',
                  marginBottom: '40px',
                  letterSpacing: '2px',
                }}>
                  ACCURACY
                </p>
                
                {/* Continue Button */}
                <button 
                  style={{
                    background: '#00bf63',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px 50px',
                    color: '#fff',
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '18px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(0, 191, 99, 0.4)',
                  }}
                  onClick={handleValidationComplete}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 191, 99, 0.6)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 191, 99, 0.4)'
                  }}
                >
                  CONTINUE
                </button>
              </div>
            )}
          </div>
          
          {/* Slide to Test Button - Outside card, below */}
          {!showPrediction && (
            <div 
              ref={sliderContainerRef}
              style={{
                position: 'absolute',
                top: 'calc(50% + 35%)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '350px',
                height: '60px',
                background: '#fff',
                border: '3px solid #00bf63',
                borderRadius: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 51,
                boxShadow: '0 8px 25px rgba(0, 191, 99, 0.4)',
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  left: `${5 + sliderPosition}px`,
                  width: '50px',
                  height: '50px',
                  background: '#00bf63',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab',
                  boxShadow: '0 4px 15px rgba(0, 191, 99, 0.6)',
                  ...(isDragging ? { cursor: 'grabbing' } : {}),
                }}
                onMouseDown={handleSliderMouseDown}
                onTouchStart={handleSliderTouchStart}
              >
                <img 
                  src="/jungle/icon/arrow.png"
                  alt="Arrow"
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
              <span style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#00bf63',
                letterSpacing: '1.5px',
              }}>
                TEST THE MODEL
              </span>
            </div>
          )}
        </>
      )}

      {/* Model Adjustment Intro Phase - Dialogue and Choice */}
      {/* Model Adjustment Data Selection Phase */}
      {phase === 'ADJUST_MODEL_DATA' && (
        <>
          {/* Main Container */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '65%',
            height: '75%',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '20px',
            padding: '35px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 50,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          }}>
            {/* Title */}
            <h2 style={{
              fontFamily: "'Coming Soon', cursive",
              fontSize: '28px',
              color: '#fff',
              margin: '0 0 8px 0',
              letterSpacing: '2px',
            }}>
              TRAINING PHOTOS
            </h2>
            
            {/* Subtitle */}
            <p style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '13px',
              color: '#ccc',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              Feed the AI <strong>High Quality Data</strong>
            </p>
            
            {/* Content Area with Photos Grid and Feedback Panel */}
            <div style={{
              display: 'flex',
              gap: '15px',
              width: '100%',
              flex: 1,
              marginBottom: '15px',
            }}>
              {/* Training Photos Grid */}
              <div style={{
                flex: showFeedbackPanel ? '0 0 60%' : '1',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                alignContent: 'start',
              }}>
                {TRAINING_PHOTOS.map((photo) => {
                  const isSelected = selectedTrainingPhotos.includes(photo.id)
                  
                  return (
                    <div
                      key={photo.id}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        background: isSelected ? 'rgba(0, 191, 99, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.3s',
                        boxShadow: isSelected 
                          ? '0 6px 20px rgba(0, 191, 99, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.3)'
                          : '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                      onClick={() => handleTrainingPhotoClick(photo)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = isSelected
                          ? '0 8px 25px rgba(0, 191, 99, 0.5), inset 0 -2px 8px rgba(0, 0, 0, 0.3)'
                          : '0 6px 16px rgba(255, 255, 255, 0.2), inset 0 -2px 8px rgba(0, 0, 0, 0.2)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = isSelected
                          ? '0 6px 20px rgba(0, 191, 99, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.3)'
                          : '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 -2px 8px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <img 
                        src={`/jungle/object/${photo.id}.png`}
                        alt={`Training photo ${photo.id}`}
                        style={{
                          width: '80%',
                          height: '80%',
                          objectFit: 'contain',
                        }}
                      />
                      {isSelected && photo.isGood && (
                        <img 
                          src="/jungle/icon/correct.png"
                          alt="Correct"
                          style={{
                            position: 'absolute',
                            top: '6px',
                            right: '6px',
                            width: '25px',
                            height: '25px',
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
              
              {/* Feedback Panel - Glassmorphism */}
              {showFeedbackPanel && feedbackPhoto && (
                <div style={{
                  flex: '0 0 35%',
                  height: '100%',
                  background: 'rgba(143, 204, 174, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '15px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                }}>
                  <h3 style={{
                    fontFamily: "'Coming Soon', cursive",
                    fontSize: '18px',
                    color: '#fff',
                    margin: 0,
                  }}>
                    FEEDBACK PANEL
                  </h3>
                  <img 
                    src={`/jungle/object/${feedbackPhoto.duplicateOf}.png`}
                    alt="Duplicate"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'contain',
                    }}
                  />
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#ff6b6b',
                    margin: 0,
                  }}>
                    LOW VALUE
                  </p>
                  <p style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '12px',
                    color: '#ccc',
                    textAlign: 'center',
                    margin: 0,
                  }}>
                    This is a duplicate. Choose unique samples!
                  </p>
                </div>
              )}
            </div>
            
            {/* Selected Photos Display - Bottom */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: 'auto',
            }}>
              {[0, 1, 2, 3, 4].map((index) => {
                const selectedPhoto = selectedTrainingPhotos[index]
                
                return (
                  <div
                    key={index}
                    style={{
                      width: '70px',
                      height: '70px',
                      background: selectedPhoto ? 'rgba(0, 191, 99, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    {selectedPhoto ? (
                      <img 
                        src={`/jungle/object/${selectedPhoto}.png`}
                        alt={`Selected ${selectedPhoto}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <img 
                        src="/jungle/icon/download.svg"
                        alt="Empty"
                        style={{
                          width: '30px',
                          height: '30px',
                          opacity: 0.3,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Improve Accuracy Button - Outside card, below */}
          {selectedTrainingPhotos.length >= 5 && (
            <div 
              ref={adjustSliderRef}
              style={{
                position: 'absolute',
                top: 'calc(50% + 39%)',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '350px',
                height: '60px',
                background: '#fff',
                border: '3px solid #00bf63',
                borderRadius: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 51,
                boxShadow: '0 8px 25px rgba(0, 191, 99, 0.4)',
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  left: `${5 + adjustSliderPos}px`,
                  width: '50px',
                  height: '50px',
                  background: '#00bf63',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'grab',
                  boxShadow: '0 4px 15px rgba(0, 191, 99, 0.6)',
                  ...(isAdjustDragging ? { cursor: 'grabbing' } : {}),
                }}
                onMouseDown={handleAdjustSliderMouseDown}
              >
                <img 
                  src="/jungle/icon/arrow.png"
                  alt="Arrow"
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
              <span style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#00bf63',
                letterSpacing: '1.5px',
              }}>
                IMPROVE ACCURACY
              </span>
            </div>
          )}

          {/* Ranger Moss Praise Popup - Top Right of NPC */}
          {showRangerPraise && (
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '12%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #00bf63',
              borderRadius: '15px',
              padding: '15px 20px',
              maxWidth: '250px',
              zIndex: 52,
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            }}>
              <p style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '14px',
                color: '#333',
                margin: 0,
                lineHeight: 1.5,
              }}>
                🌟 Excellent choice! A new angle/condition. That will help it generalize!
              </p>
            </div>
          )}
        </>
      )}

      {/* Model Adjustment Retraining Phase */}
      {phase === 'ADJUST_MODEL_TRAINING' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '5%',
          zIndex: 50,
        }}>
          <img 
            src="/jungle/model.GIF"
            alt="Model Training"
            style={{
              width: 'auto',
              height: adjustProgress >= 100 ? '40%' : '70%',
              objectFit: 'contain',
              marginBottom: adjustProgress >= 100 ? '20px' : '30px',
              transition: 'height 0.3s ease',
            }}
          />
          
          {adjustProgress < 100 && (
            <div style={{
              width: '80%',
              height: '30px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '15px',
              overflow: 'hidden',
              border: '2px solid #8FCCAE',
            }}>
              <div style={{
                height: '100%',
                width: `${adjustProgress}%`,
                background: 'linear-gradient(90deg, #00bf63, #8FCCAE)',
                transition: 'width 0.1s linear',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                  {adjustProgress}%
                </span>
              </div>
            </div>
          )}
          
          {adjustProgress >= 100 && (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <h2 style={{
                fontFamily: "'Coming Soon', cursive",
                fontSize: '28px',
                color: '#fff',
                margin: '0 0 20px 0',
                letterSpacing: '2px',
              }}>
                YOUR AI PREDICTION
              </h2>
              
              {/* Circular Progress */}
              <div style={{
                position: 'relative',
                width: '180px',
                height: '180px',
                marginBottom: '15px',
              }}>
                <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background circle */}
                  <circle
                    cx="90"
                    cy="90"
                    r="75"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="15"
                  />
                  {/* Progress circle - animated */}
                  <circle
                    cx="90"
                    cy="90"
                    r="75"
                    fill="none"
                    stroke="#00bf63"
                    strokeWidth="15"
                    strokeDasharray={`${2 * Math.PI * 75 * (finalAccuracyProgress / 100)} ${2 * Math.PI * 75}`}
                    strokeLinecap="round"
                    style={{
                      filter: 'drop-shadow(0 0 10px #00bf63)',
                      transition: 'stroke-dasharray 0.1s ease-out',
                    }}
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: "'Coming Soon', cursive",
                    fontSize: '44px',
                    fontWeight: 'bold',
                    color: '#00bf63',
                    lineHeight: 1,
                  }}>
                    {finalAccuracyProgress}%
                  </div>
                </div>
              </div>
              
              <p style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '16px',
                color: '#ccc',
                marginBottom: '25px',
                letterSpacing: '2px',
              }}>
                ACCURACY
              </p>
              
              {/* Done Button */}
              <button 
                style={{
                  background: '#00bf63',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 45px',
                  color: '#fff',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 15px rgba(0, 191, 99, 0.4)',
                }}
                onClick={handleAdjustComplete}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)'
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 191, 99, 0.6)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 191, 99, 0.4)'
                }}
              >
                DONE
              </button>
            </div>
          )}
        </div>
      )}

      {/* Complete Phase */}
      {phase === 'COMPLETE' && (
        <div style={styles.cardContainer}>
          <div style={styles.completeCard}>
            <h2 style={styles.completeTitle}>🎉 Data Cleaning Complete!</h2>
            <p style={styles.completeText}>
              <strong>Ranger Moss:</strong> "Excellent! You used visual evidence to fill in the missing data. Now our dataset is complete—no holes, no errors."
            </p>
            <p style={styles.statusText}>System Status: 100% Clean ✓</p>
            <button 
              style={styles.nextStepButton}
              onClick={onComplete}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              Next Step: Model Training →
            </button>
          </div>
        </div>
      )}

      {/* Ranger Moss Dialogue - Left Side Panel (OLD - only show if not using modern dialogue) */}
      {showRangerDialogue && !showModernRangerDialogue && (
        <div style={styles.leftDialogueContainer}>
          <div style={styles.dialogueHistoryBox}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            {/* Show dialogue history */}
            {dialogueHistory.map((text, index) => (
              <p key={index} style={{
                ...styles.dialogueHistoryItem,
                ...(index === dialogueHistory.length - 1 && !displayedText ? styles.dialogueHistoryItemLast : {}),
              }}>
                {text}
              </p>
            ))}
            {/* Show current dialogue with typing effect */}
            {displayedText && (
              <p style={{...styles.dialogueHistoryItem, ...styles.dialogueHistoryItemLast}}>
                {displayedText}
                {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
              </p>
            )}
            <button style={styles.continueButton} onClick={handleRangerContinue}>
              {isTyping ? 'Skip' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* Dialogue History - Show until user enters card selection (exclude INTRO phases that use modern dialogue) */}
      {!showRangerDialogue && !showModernRangerDialogue && dialogueHistory.length > 0 && (
        phase === 'NOISE_REMOVAL' || phase === 'LABEL_CORRECTION' || phase === 'FILL_MISSING'
      ) && (
        <div style={styles.leftDialogueContainer}>
          <div style={styles.dialogueHistoryBox}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            {dialogueHistory.map((text, index) => (
              <p key={index} style={{
                ...styles.dialogueHistoryItem,
                ...(index === dialogueHistory.length - 1 ? styles.dialogueHistoryItemLast : {}),
              }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Glitch Hint - Inline near avatar */}
      {showGlitchHint && phase !== 'LOADING' && phase !== 'COLOR_MAP_EXPLORATION' && (
        <div style={styles.glitchHintInline}>
          <button style={styles.glitchHintCloseBtn} onClick={() => setShowGlitchHint(false)}>×</button>
          <p style={styles.glitchHintInlineText}>💡 {glitchHintText}</p>
        </div>
      )}

      </div>
    </>
  )
}

export default DataCleaning
