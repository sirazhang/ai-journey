import React, { useState, useEffect } from 'react'

// Noise items that aren't mushrooms
const NOISE_ITEMS = ['03', '05', '07']

// All collected items (will be shown in 3 batches of 4)
const ALL_ITEMS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

// Batch groupings for noise removal display
const NOISE_BATCHES = [
  ['01', '02', '03', '04'],
  ['05', '06', '07', '08'],
  ['09', '10', '11', '12'],
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
  { id: '02', name: 'Flame Bloom', color: 'Red / Orange', texture: null, spikes: 'Yes', toxic: 'YES', missingField: 'texture', options: ['Wavy', 'Smooth', 'Glossy', 'Matte'], correct: 'Wavy' },
  { id: '08', name: 'Drip Orb', color: null, texture: 'Glossy / Dripping', spikes: 'No', toxic: 'YES', missingField: 'color', options: ['Yellow', 'Blue', 'Red', 'Green'], correct: 'Yellow' },
]

// Quiz data for Pre-Training Quiz
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

// Test mushrooms for validation - 13, 14, 15 are new (correct), 08 is already collected (wrong)
const TEST_MUSHROOMS = [
  { id: '13', isNew: true },
  { id: '14', isNew: true },
  { id: '15', isNew: true },
  { id: '08', isNew: false },
]

// Model Adjustment phase data
const ADJUST_MODEL_DIALOGUES = [
  "Uh oh... 😱 This is bad news! The AI only got 45% correct on the new mushrooms. It's confusing 😵‍💫 the 'Death Cap' with the 'Edible Paddy Straw' mushroom! If we use this AI now, the Elf might get a tummy ache... or worse! We can't give up, but we need to fix this.",
  "Think like a Data Scientist. Why is the AI failing? It probably hasn't seen enough examples of the tricky mushrooms yet. What should we do to improve the AI's accuracy?"
]

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
    { id: '17', size: 500, left: '2%', bottom: '0%', status: 'DANGER', toxicity: '99% Toxic' },
  ],
  [MAP_POSITIONS.BOTTOM_LEFT]: [
    { id: '26', size: 700, right: '0%', bottom: '0%', status: 'DANGER', toxicity: '98% Toxic' },
    { id: '14', size: 450, left: '0%', top: '0%', status: 'DANGER', toxicity: '94% Toxic' },
    { id: '24', size: 350, left: '50%', top: '0%', status: 'EDIBLE', toxicity: '90% Safe' },
  ],
  [MAP_POSITIONS.BOTTOM_RIGHT]: [
    { id: '21', size: 360, right: '30%', bottom: '0%', status: 'DANGER', toxicity: '99% Toxic' },
    { id: '22', size: 250, right: '45%', bottom: '5%', status: 'EDIBLE', toxicity: '92% Safe' },
    { id: '15', size: 250, left: '0%', top: '35%', status: 'DANGER', toxicity: '90% Toxic' },
  ],
  [MAP_POSITIONS.TOP_LEFT]: [
    { id: '25', size: 600, left: '0%', bottom: '10%', status: 'DANGER', toxicity: '99% Toxic' },
    { id: '18', size: 380, right: '30%', top: '30%', status: 'DANGER', toxicity: '95% Toxic' },
    { id: '23', size: 260, right: '50%', bottom: '0%', status: 'EDIBLE', toxicity: '95% Safe' },
    { id: '19', size: 350, left: '30%', top: '5%', status: 'DANGER', toxicity: '91% Toxic' },
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
    hoverText: "Yay! No stomach ache today."
  },
  [MAP_POSITIONS.BOTTOM_RIGHT]: {
    npc: 'npc_b',
    image: '/jungle/npc_b2.gif',
    left: '5%',
    bottom: '0%',
    height: '540px',
    width: 'auto',
    hoverText: "This new scanner is like magic. It knows everything!"
  },
}

const DataCleaning = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState('INTRO') // INTRO, NOISE_REMOVAL, LABEL_CORRECTION, FILL_MISSING_INTRO, FILL_MISSING, QUIZ, TRAINING, VALIDATION_INTRO, VALIDATION_DATA, ADJUST_MODEL_INTRO, ADJUST_MODEL_DATA, ADJUST_MODEL_TRAINING, LOADING, COLOR_MAP_EXPLORATION, COMPLETE
  const [noiseBatch, setNoiseBatch] = useState(0)
  const [removedItems, setRemovedItems] = useState([])

  // Load saved progress on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      const dataCleaningProgress = userData.dataCleaningProgress
      if (dataCleaningProgress) {
        setPhase(dataCleaningProgress.phase || 'INTRO')
        setNoiseBatch(dataCleaningProgress.noiseBatch || 0)
        setRemovedItems(dataCleaningProgress.removedItems || [])
        console.log('Loaded Data Cleaning progress:', dataCleaningProgress)
      }
    }
  }, [])

  // Save progress when phase changes
  useEffect(() => {
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
  }, [phase, noiseBatch, removedItems])
  const [labelBatch, setLabelBatch] = useState(1)
  const [selectedCells, setSelectedCells] = useState([]) // Cells user clicked as errors
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
  
  // Validation state
  const [validationStep, setValidationStep] = useState(0) // 0: question, 1: answered correctly, 2: data selection
  const [selectedTestMushrooms, setSelectedTestMushrooms] = useState([]) // Selected mushroom IDs for testing
  const [isScanning, setIsScanning] = useState(false)
  const [showPrediction, setShowPrediction] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0) // Position of slider (0 to maxSlide)
  const [isDragging, setIsDragging] = useState(false)
  const sliderContainerRef = React.useRef(null)

  // Model Adjustment state
  const [adjustDialogueIndex, setAdjustDialogueIndex] = useState(0)
  const [adjustStep, setAdjustStep] = useState(0) // 0: dialogues, 1: choice, 2: data selection, 3: retraining
  const [selectedTrainingPhotos, setSelectedTrainingPhotos] = useState([])
  const [feedbackPhoto, setFeedbackPhoto] = useState(null) // Which photo to show in feedback panel
  const [adjustProgress, setAdjustProgress] = useState(0)
  const [showRangerPraise, setShowRangerPraise] = useState(false)
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
  const [npcClickCount, setNpcClickCount] = useState({ npc_c: 0 })
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [clickedMushroom, setClickedMushroom] = useState(null) // Track which mushroom is clicked
  const [currentDialogueSet, setCurrentDialogueSet] = useState(0) // Track which dialogue set (first click, second click, etc.)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0) // Track current sentence in dialogue set

  const rangerDialogues = [
    "Outstanding work, Human! You've gathered enough raw data. But... we can't feed this directly to the AI. Not yet.",
    "In the world of AI, there is a golden rule: 'Garbage In, Garbage Out'. If we train the model with messy data, it will learn the wrong lessons.",
    "We must enter the Data Cleaning Phase.",
  ]

  const labelIntroDialogue = "Great job removing the noise. Now, look at this Data Table. The auto-tagging system was glitching, so some Labels are wrong. Click on the cells you think contain errors!"
  
  const fillMissingIntroDialogue = "Some data fields are completely Empty (Null). The AI cannot learn from nothing! Click on the empty cells. I will project the hologram (photo) of the mushroom. Look at the photo, and fill in the blank."

  // Reset selected cells when batch changes
  useEffect(() => {
    setSelectedCells([])
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
    if (phase === 'INTRO') {
      setTimeout(() => setShowRangerDialogue(true), 500)
    }
  }, [phase])

  const handleRangerContinue = () => {
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
    if (removedItems.includes(itemId)) {
      // Put back
      setRemovedItems(prev => prev.filter(id => id !== itemId))
    } else {
      // Remove to trash
      setRemovedItems(prev => [...prev, itemId])
    }
  }

  const handleNoiseNext = () => {
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

    if (noiseBatch < 2) {
      setNoiseBatch(prev => prev + 1)
    } else {
      // All noise removed, move to label correction
      setPhase('LABEL_INTRO')
    }
  }

  const handleLabelIntroNext = () => {
    setPhase('LABEL_CORRECTION')
  }

  const handleCellClick = (rowId, field) => {
    // Toggle cell selection (user identifying errors)
    const cellKey = `${rowId}-${field}`
    if (selectedCells.includes(cellKey)) {
      setSelectedCells(prev => prev.filter(c => c !== cellKey))
    } else {
      setSelectedCells(prev => [...prev, cellKey])
    }
  }

  const handleLabelNext = () => {
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
      setFilledValues(prev => ({
        ...prev,
        [selectedMissingCell.itemId]: value
      }))
      setSelectedMissingCell(null)
      setShowOptions(false)
    } else {
      setGlitchHintText("Look carefully at the mushroom photo! What do you see?")
      setShowGlitchHint(true)
    }
  }

  const handleFillMissingNext = () => {
    // Check if all values are filled
    const allFilled = MISSING_DATA.every(item => filledValues[item.id])
    if (!allFilled) {
      setGlitchHintText("You still have empty cells! Click on the ❓ to fill them.")
      setShowGlitchHint(true)
      return
    }
    // Move to Quiz phase
    setPhase('QUIZ')
    // Initialize quiz with first question
    setChatMessages([{ type: 'ranger', text: QUIZ_DATA[0].question }])
    setQuizStep(0)
  }

  const handleQuizAnswer = (optionIndex, isCorrect) => {
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
    if (isCorrect) {
      setValidationStep(1) // Show correct response
    }
  }

  const handleValidationContinue = () => {
    setPhase('VALIDATION_DATA')
    setSelectedTestMushrooms([])
  }

  const handleTestMushroomClick = (id) => {
    const mushroom = TEST_MUSHROOMS.find(m => m.id === id)
    
    // If clicking on a wrong mushroom (08 - already collected)
    if (!mushroom.isNew) {
      setGlitchHintText("We should test with New Mushrooms, the yellow one is already collected")
      setShowGlitchHint(true)
      return
    }
    
    // Toggle selection for correct mushrooms
    if (selectedTestMushrooms.includes(id)) {
      setSelectedTestMushrooms(prev => prev.filter(m => m !== id))
    } else {
      setSelectedTestMushrooms(prev => [...prev, id])
    }
  }

  const handleSlideTest = () => {
    // Check if all correct mushrooms are selected
    const correctMushrooms = TEST_MUSHROOMS.filter(m => m.isNew).map(m => m.id)
    const allCorrectSelected = correctMushrooms.every(id => selectedTestMushrooms.includes(id))
    
    if (allCorrectSelected && selectedTestMushrooms.length === 3) {
      setIsScanning(true)
      // Simulate scanning animation
      setTimeout(() => {
        setIsScanning(false)
        setShowPrediction(true)
      }, 2000)
    }
  }

  // Drag handlers for slide button
  const maxSlideDistance = 225 // Container width (280) - button width (45) - padding (10)
  
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

  const handleValidationComplete = () => {
    // Transition to model adjustment phase instead of complete
    setPhase('ADJUST_MODEL_INTRO')
    setAdjustDialogueIndex(0)
    setAdjustStep(0)
    setAdjustDialogueHistory([])
    setAdjustDisplayedText('')
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
        setSelectedTrainingPhotos(prev => [...prev, photo.id])
        setFeedbackPhoto(null)
        setShowFeedbackPanel(false) // Hide feedback panel on correct selection
        setShowRangerPraise(true)
        setTimeout(() => setShowRangerPraise(false), 2000)
      }
    } else {
      // Show feedback panel with duplicate mushroom
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
          // Start new dialogue set
          setCurrentDialogueSet(clickCount)
          setCurrentDialogueIndex(0)
          setNpcDialogueText(npc.dialogues[clickCount][0])
          setShowNpcDialogue(true)
          setCurrentNpc(npcType)
        }
      }
    }
  }

  const handleDialogueContinue = () => {
    const npc = colorMapNpcs[mapPosition]
    if (npc && currentNpc === 'npc_c') {
      const currentDialogueArray = npc.dialogues[currentDialogueSet]
      if (currentDialogueIndex < currentDialogueArray.length - 1) {
        // Show next sentence in current dialogue set
        setCurrentDialogueIndex(prev => prev + 1)
        setNpcDialogueText(currentDialogueArray[currentDialogueIndex + 1])
      } else {
        // End of current dialogue set
        setShowNpcDialogue(false)
        setNpcClickCount(prev => ({ ...prev, npc_c: prev.npc_c + 1 }))
        setCurrentNpc(null)
      }
    } else {
      // For other NPCs or simple dialogues
      setShowNpcDialogue(false)
      setCurrentNpc(null)
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
    setNpcDialogueText("You know, technology didn't save the day—YOU did. An AI is just a tool. It was your careful choices as a 'Data Detective' that taught it to see the truth.")
    setShowNpcDialogue(true)
    setCurrentNpc('glitch')
  }

  const handleMushroomClick = (mushroomId) => {
    setClickedMushroom(clickedMushroom === mushroomId ? null : mushroomId)
  }

  const isCellSelected = (rowId, field) => {
    return selectedCells.includes(`${rowId}-${field}`)
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
      width: '60%',
      maxWidth: '700px',
      zIndex: 50,
    },
    card: {
      width: '550px',
      padding: '30px',
      borderRadius: '25px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '4px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(135deg, #7B68EE, #FFB6C1)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
    },
    cardTitle: {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '26px',
      fontWeight: 700,
      color: '#333',
      textAlign: 'center',
      marginBottom: '10px',
    },
    cardSubtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '25px',
    },
    itemGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '15px',
      marginBottom: '20px',
    },
    itemCard: {
      width: '110px',
      height: '110px',
      borderRadius: '15px',
      background: '#fff',
      border: '3px solid transparent',
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
      width: '80px',
      height: '80px',
      objectFit: 'contain',
    },
    trashArea: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginTop: '15px',
    },
    trashSlot: {
      width: '80px',
      height: '80px',
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
      margin: '20px auto 0',
      padding: '12px 40px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
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
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      backdropFilter: 'blur(10px)',
    },
    colorMapArrowImage: {
      width: '30px',
      height: '30px',
      objectFit: 'contain',
      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
    },
    colorMapUpArrow: { top: '20px', left: '50%', transform: 'translateX(-50%)' },
    colorMapDownArrow: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    colorMapLeftArrow: { left: '20px', top: '50%', transform: 'translateY(-50%)' },
    colorMapRightArrow: { right: '20px', top: '50%', transform: 'translateY(-50%)' },
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
      padding: '8px 16px',
      borderRadius: '20px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
      zIndex: 30,
    },
    dangerBadge: {
      background: 'linear-gradient(135deg, #FF4444, #CC0000)',
      color: '#fff',
    },
    edibleBadge: {
      background: 'linear-gradient(135deg, #44FF44, #00CC00)',
      color: '#fff',
    },
    colorMapDialogue: {
      position: 'absolute',
      top: '10%',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '600px',
      padding: '25px 30px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.98), rgba(255,255,255,0.98)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      textAlign: 'center',
      zIndex: 100,
    },
    colorMapDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.6,
      marginBottom: '20px',
    },
    colorMapOkButton: {
      padding: '12px 30px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#5170FF',
      background: 'transparent',
      border: '2px solid #5170FF',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
  }

  const currentBatchItems = NOISE_BATCHES[noiseBatch] || []
  const currentTableData = DIRTY_DATA[labelBatch]

  return (
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
        }}>
          <div style={styles.loadingContainer}>
            <h2 style={styles.loadingTitle}>Loading...</h2>
            <div style={styles.loadingBar}>
              <div style={{...styles.loadingFill, width: `${loadingProgress}%`}} />
            </div>
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
            <button style={styles.exitButton} onClick={onExit}>Exit</button>

            {/* Glitch NPC */}
            <div 
              style={{
                ...styles.glitchNpc,
                width: '120px',
                height: '120px',
              }}
              onClick={handleGlitchClickColorMap}
            >
              <img src="/npc/npc1.png" alt="Glitch" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>

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
                    {mushroom.status === 'DANGER' ? '❌' : '✅'} {mushroom.status} ({mushroom.toxicity})
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

            {/* NPC Dialogue */}
            {showNpcDialogue && (
              <div style={styles.colorMapDialogue}>
                <p style={styles.colorMapDialogueText}>{npcDialogueText}</p>
                <button
                  style={styles.colorMapOkButton}
                  onClick={currentNpc === 'npc_c' ? handleDialogueContinue : () => setShowNpcDialogue(false)}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#5170FF'
                    e.target.style.color = '#fff'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#5170FF'
                  }}
                >
                  {currentNpc === 'npc_c' && colorMapNpcs[mapPosition]?.dialogues[currentDialogueSet] && 
                   currentDialogueIndex < colorMapNpcs[mapPosition].dialogues[currentDialogueSet].length - 1 
                   ? 'Continue' : 'OK'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All other phases - only show when not in LOADING or COLOR_MAP_EXPLORATION */}
      {phase !== 'LOADING' && phase !== 'COLOR_MAP_EXPLORATION' && (
        <>
          {/* Exit Button */}
          <button style={styles.exitButton} onClick={onExit}>Exit</button>

          {/* Glitch NPC */}
          <div 
            style={styles.glitchNpc}
            onClick={() => {
              if (phase === 'NOISE_REMOVAL') {
                setGlitchHintText("First, look at what you collected. Some of these aren't mushrooms at all! These are what we call 'Noise'.")
              } else if (phase === 'LABEL_CORRECTION') {
                setGlitchHintText(BATCH_HINTS[labelBatch])
              }
              setShowGlitchHint(true)
            }}
          >
            <img src="/npc/npc1.png" alt="Glitch" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          {/* Ranger Moss NPC */}
          <img src="/jungle/npc_c.png" alt="Ranger Moss" style={styles.rangerNpc} />
        </>
      )}

      {/* Noise Removal Phase */}
      {phase === 'NOISE_REMOVAL' && (
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>CLEAN THE DATA</h2>
            <p style={styles.cardSubtitle}>
              Please click on the irrelevant items to remove them. Keep ONLY the mushrooms!
            </p>
            
            <div style={styles.itemGrid}>
              {currentBatchItems.map(id => (
                <div
                  key={id}
                  style={{
                    ...styles.itemCard,
                    ...(removedItems.includes(id) ? styles.itemCardRemoved : {}),
                  }}
                  onClick={() => handleItemClick(id)}
                >
                  {!removedItems.includes(id) && (
                    <img 
                      src={`/jungle/object/${id}.png`}
                      alt={`Object ${id}`}
                      style={styles.itemImage}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={styles.trashArea}>
              {[0, 1, 2].map(i => {
                // Show ALL removed items across all batches, not just current batch
                const item = removedItems[i]
                return (
                  <div 
                    key={i} 
                    style={{
                      ...styles.trashSlot,
                      cursor: item ? 'pointer' : 'default',
                    }}
                    onClick={() => item && handleItemClick(item)}
                  >
                    {item && (
                      <img 
                        src={`/jungle/object/${item}.png`}
                        alt={`Removed ${item}`}
                        style={{ width: '60px', height: '60px', objectFit: 'contain', opacity: 0.7 }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            <button style={styles.nextButton} onClick={handleNoiseNext}>
              NEXT
            </button>
          </div>
        </div>
      )}

      {/* Label Intro Phase */}
      {phase === 'LABEL_INTRO' && (
        <div style={styles.modalOverlay}>
          <div style={styles.dialogueBox}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            <p style={styles.dialogueText}>{labelIntroDialogue}</p>
            <button style={styles.continueButton} onClick={handleLabelIntroNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Label Correction Phase */}
      {phase === 'LABEL_CORRECTION' && (
        <div style={styles.cardContainer}>
          <div style={styles.tableCard}>
            <h2 style={styles.cardTitle}>CORRECT LABELS</h2>
            <p style={styles.cardSubtitle}>
              Click on the cells that contain ERRORS to select them. Find all the incorrect data!
            </p>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Color</th>
                  <th style={styles.th}>Texture</th>
                  <th style={styles.th}>Spikes</th>
                  <th style={styles.th}>Toxic</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map(row => (
                  <tr key={row.id}>
                    <td style={styles.td}>#{row.id}</td>
                    <td 
                      style={{
                        ...styles.td,
                        ...styles.clickableCell,
                        ...(isCellSelected(row.id, 'name') ? styles.selectedCell : {}),
                      }}
                      onClick={() => handleCellClick(row.id, 'name')}
                    >
                      {row.name}
                    </td>
                    <td 
                      style={{
                        ...styles.td,
                        ...styles.clickableCell,
                        ...(isCellSelected(row.id, 'color') ? styles.selectedCell : {}),
                      }}
                      onClick={() => handleCellClick(row.id, 'color')}
                    >
                      {row.color}
                    </td>
                    <td 
                      style={{
                        ...styles.td,
                        ...styles.clickableCell,
                        ...(isCellSelected(row.id, 'texture') ? styles.selectedCell : {}),
                      }}
                      onClick={() => handleCellClick(row.id, 'texture')}
                    >
                      {row.texture}
                    </td>
                    <td 
                      style={{
                        ...styles.td,
                        ...styles.clickableCell,
                        ...(isCellSelected(row.id, 'spikes') ? styles.selectedCell : {}),
                      }}
                      onClick={() => handleCellClick(row.id, 'spikes')}
                    >
                      {row.spikes}
                    </td>
                    <td 
                      style={{
                        ...styles.td,
                        ...styles.clickableCell,
                        ...(isCellSelected(row.id, 'toxic') ? styles.selectedCell : {}),
                      }}
                      onClick={() => handleCellClick(row.id, 'toxic')}
                    >
                      {row.toxic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button style={styles.nextButton} onClick={handleLabelNext}>
              NEXT
            </button>
          </div>
        </div>
      )}

      {/* Fill Missing Intro Phase */}
      {phase === 'FILL_MISSING_INTRO' && (
        <div style={styles.modalOverlay}>
          <div style={styles.dialogueBox}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            <p style={styles.dialogueText}>{fillMissingIntroDialogue}</p>
            <button style={styles.continueButton} onClick={handleFillMissingIntroNext}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Fill Missing Values Phase */}
      {phase === 'FILL_MISSING' && (
        <div style={styles.fillMissingContainer}>
          {/* Table Card */}
          <div style={styles.fillTableCard}>
            <h2 style={styles.cardTitle}>FILL MISSING VALUES</h2>
            <p style={styles.cardSubtitle}>
              Click on the ❓ cells to fill in the missing data based on the mushroom photo.
            </p>
            
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Color</th>
                  <th style={styles.th}>Texture</th>
                  <th style={styles.th}>Spikes</th>
                  <th style={styles.th}>Toxic</th>
                </tr>
              </thead>
              <tbody>
                {MISSING_DATA.map(row => (
                  <tr key={row.id}>
                    <td style={styles.td}>#{row.id}</td>
                    <td style={styles.td}>{row.name}</td>
                    <td 
                      style={{
                        ...styles.td,
                        ...(row.missingField === 'color' && !filledValues[row.id] ? styles.missingCell : {}),
                        ...(row.missingField === 'color' && selectedMissingCell?.itemId === row.id ? styles.missingCellActive : {}),
                        ...(row.missingField === 'color' && filledValues[row.id] ? styles.filledCell : {}),
                      }}
                      onClick={() => row.missingField === 'color' && !filledValues[row.id] && handleMissingCellClick(row.id, 'color')}
                    >
                      {row.missingField === 'color' ? (filledValues[row.id] || '[ ❓ ]') : row.color}
                    </td>
                    <td 
                      style={{
                        ...styles.td,
                        ...(row.missingField === 'texture' && !filledValues[row.id] ? styles.missingCell : {}),
                        ...(row.missingField === 'texture' && selectedMissingCell?.itemId === row.id ? styles.missingCellActive : {}),
                        ...(row.missingField === 'texture' && filledValues[row.id] ? styles.filledCell : {}),
                      }}
                      onClick={() => row.missingField === 'texture' && !filledValues[row.id] && handleMissingCellClick(row.id, 'texture')}
                    >
                      {row.missingField === 'texture' ? (filledValues[row.id] || '[ ❓ ]') : row.texture}
                    </td>
                    <td 
                      style={{
                        ...styles.td,
                        ...(row.missingField === 'spikes' && !filledValues[row.id] ? styles.missingCell : {}),
                        ...(row.missingField === 'spikes' && selectedMissingCell?.itemId === row.id ? styles.missingCellActive : {}),
                        ...(row.missingField === 'spikes' && filledValues[row.id] ? styles.filledCell : {}),
                      }}
                      onClick={() => row.missingField === 'spikes' && !filledValues[row.id] && handleMissingCellClick(row.id, 'spikes')}
                    >
                      {row.missingField === 'spikes' ? (filledValues[row.id] || '[ ❓ ]') : row.spikes}
                    </td>
                    <td style={styles.td}>{row.toxic}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button style={styles.nextButton} onClick={handleFillMissingNext}>
              NEXT
            </button>
          </div>

          {/* Image Panel */}
          <div style={styles.imagePanel}>
            {selectedMissingCell ? (
              <>
                <h3 style={styles.imagePanelTitle}>#{selectedMissingCell.itemId}</h3>
                <img 
                  src={`/jungle/object/${selectedMissingCell.itemId}.png`}
                  alt={`Mushroom ${selectedMissingCell.itemId}`}
                  style={styles.mushroomImage}
                />
                <div style={styles.optionsContainer}>
                  {MISSING_DATA.find(d => d.id === selectedMissingCell.itemId)?.options.map(opt => (
                    <button
                      key={opt}
                      style={styles.optionButton}
                      onClick={() => handleOptionSelect(opt)}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h3 style={styles.imagePanelTitle}>Select a cell</h3>
                <p style={{ color: '#aaa', textAlign: 'center' }}>Click on a ❓ cell to see the mushroom photo</p>
              </>
            )}
          </div>
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
        <div style={styles.trainingContainer}>
          <div style={styles.trainingCard}>
            <h2 style={styles.trainingTitle}>MODEL TRAINING</h2>
            <img 
              src="/jungle/model.GIF"
              alt="Model Training"
              style={styles.trainingGif}
            />
            <div style={styles.progressBarContainer}>
              <div style={{ ...styles.progressBar, width: `${trainingProgress}%` }}></div>
            </div>
            <p style={styles.progressText}>Training Progress: {trainingProgress}%</p>
            
            {showTrainingVoiceover && (
              <>
                <p style={styles.voiceoverText}>
                  <strong>Ranger Moss:</strong> "{TRAINING_VOICEOVER}"
                </p>
                <button 
                  style={{ ...styles.goButton, marginTop: '20px' }}
                  onClick={handleTrainingComplete}
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
        <div style={styles.validationContainer}>
          <div style={styles.validationCard}>
            <p style={styles.validationText}>
              Select the mushrooms you want to test the AI with. Choose the NEW mushrooms that the AI hasn't seen before!
            </p>
            
            <div style={styles.testMushroomGrid}>
              {TEST_MUSHROOMS.map((mushroom) => (
                <div
                  key={mushroom.id}
                  style={{
                    ...styles.testMushroomCard,
                    ...(selectedTestMushrooms.includes(mushroom.id) ? styles.testMushroomCardSelected : {}),
                  }}
                  onClick={() => handleTestMushroomClick(mushroom.id)}
                >
                  <img 
                    src={`/jungle/object/${mushroom.id}.png`}
                    alt={`Mushroom ${mushroom.id}`}
                    style={styles.testMushroomImage}
                  />
                  {selectedTestMushrooms.includes(mushroom.id) && mushroom.isNew && (
                    <img 
                      src="/jungle/icon/correct.png"
                      alt="Correct"
                      style={styles.correctIcon}
                    />
                  )}
                  {isScanning && selectedTestMushrooms.includes(mushroom.id) && (
                    <div style={styles.scanningOverlay}>
                      <span style={{ color: '#fff', fontWeight: 'bold' }}>Scanning...</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {!showPrediction && (
              <div 
                ref={sliderContainerRef}
                style={styles.slideButtonContainer}
              >
                <div 
                  style={{
                    ...styles.slideButtonTrack,
                    left: `${5 + sliderPosition}px`,
                    cursor: 'grab',
                    ...(isDragging ? { cursor: 'grabbing' } : {}),
                  }}
                  onMouseDown={handleSliderMouseDown}
                  onTouchStart={handleSliderTouchStart}
                >
                  <img 
                    src="/jungle/icon/arrow.png"
                    alt="Arrow"
                    style={styles.arrowIcon}
                  />
                </div>
                <span style={styles.slideButtonText}>TEST THE MODEL</span>
              </div>
            )}
            
            {showPrediction && (
              <div style={styles.predictionContainer}>
                <p style={styles.predictionLabel}>YOUR AI PREDICTION</p>
                <p style={styles.predictionValue}>45%</p>
                <p style={styles.predictionUnit}>ACCURACY</p>
                <button 
                  style={{ ...styles.goButton, marginTop: '30px' }}
                  onClick={handleValidationComplete}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Model Adjustment Intro Phase - Dialogue and Choice */}
      {phase === 'ADJUST_MODEL_INTRO' && (
        <div style={styles.leftDialogueContainer}>
          <div style={styles.dialogueHistoryBox}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            
            {/* Show dialogue history */}
            {adjustDialogueHistory.map((text, index) => (
              <p key={index} style={{
                ...styles.dialogueHistoryItem,
                ...(index === adjustDialogueHistory.length - 1 && !adjustDisplayedText && adjustStep !== 1 ? styles.dialogueHistoryItemLast : {}),
              }}>
                {text}
              </p>
            ))}
            
            {/* Current dialogue with typing effect */}
            {adjustStep === 0 && adjustDisplayedText && (
              <p style={{...styles.dialogueHistoryItem, ...styles.dialogueHistoryItemLast}}>
                {adjustDisplayedText}
                {isAdjustTyping && <span style={{ opacity: 0.5 }}>|</span>}
              </p>
            )}
            
            {/* Continue/Skip button during dialogue */}
            {adjustStep === 0 && (
              <button 
                style={styles.continueButton} 
                onClick={handleAdjustDialogueContinue}
              >
                {isAdjustTyping ? 'Skip' : 'Continue →'}
              </button>
            )}
            
            {/* Choice options after dialogues */}
            {adjustStep === 1 && (
              <div style={styles.adjustOptionsContainer}>
                {ADJUST_MODEL_OPTIONS.map((option, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.adjustOptionButton,
                      ...(selectedWrongOption === index ? { opacity: 0.1 } : {}),
                    }}
                    onClick={() => handleAdjustOptionSelect(option, index)}
                    onMouseOver={(e) => { if (selectedWrongOption !== index) e.target.style.borderColor = '#7B68EE' }}
                    onMouseOut={(e) => { if (selectedWrongOption !== index) e.target.style.borderColor = '#ddd' }}
                    disabled={selectedWrongOption === index}
                  >
                    {String.fromCharCode(65 + index)}. {option.text}
                  </button>
                ))}
              </div>
            )}
            
            {/* Success response after correct selection */}
            {adjustStep === 2 && (
              <>
                <p style={{...styles.dialogueHistoryItem, marginTop: '15px', color: '#4CAF50', borderBottom: 'none'}}>
                  {ADJUST_CORRECT_RESPONSE}
                </p>
                <button 
                  style={styles.continueButton} 
                  onClick={() => setPhase('ADJUST_MODEL_DATA')}
                >
                  Select Training Data →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Model Adjustment Data Selection Phase */}
      {phase === 'ADJUST_MODEL_DATA' && (
        <>
          {/* Training Photos Grid - Left side */}
          <div style={styles.leftDialogueContainer}>
            <div style={styles.trainingPhotosCard}>
              <h3 style={styles.trainingPhotosTitle}>Potential Training Photos</h3>
              <div style={styles.trainingPhotosGrid}>
                {TRAINING_PHOTOS.map((photo) => (
                  <div
                    key={photo.id}
                    style={{
                      ...styles.trainingPhotoCard,
                      ...(selectedTrainingPhotos.includes(photo.id) ? styles.trainingPhotoCardSelected : {}),
                    }}
                    onClick={() => handleTrainingPhotoClick(photo)}
                  >
                    <img 
                      src={`/jungle/object/${photo.id}.png`}
                      alt={`Training photo ${photo.id}`}
                      style={styles.trainingPhotoImage}
                    />
                    {selectedTrainingPhotos.includes(photo.id) && photo.isGood && (
                      <img 
                        src="/jungle/icon/correct.png"
                        alt="Correct"
                        style={styles.trainingPhotoCheck}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* Improve Prediction Accuracy Button */}
              {selectedTrainingPhotos.length >= 4 && (
                <div 
                  ref={adjustSliderRef}
                  style={styles.slideButtonContainer}
                >
                  <div 
                    style={{
                      ...styles.slideButtonTrack,
                      left: `${5 + adjustSliderPos}px`,
                      cursor: 'grab',
                      ...(isAdjustDragging ? { cursor: 'grabbing' } : {}),
                    }}
                    onMouseDown={handleAdjustSliderMouseDown}
                  >
                    <img 
                      src="/jungle/icon/arrow.png"
                      alt="Arrow"
                      style={styles.arrowIcon}
                    />
                  </div>
                  <span style={styles.slideButtonText}>IMPROVE ACCURACY</span>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Panel - Only show when clicking wrong photo */}
          {showFeedbackPanel && feedbackPhoto && (
            <div style={styles.feedbackPanelContainer}>
              <div style={styles.feedbackPanel}>
                <h3 style={styles.feedbackTitle}>Feedback Panel</h3>
                <img 
                  src={`/jungle/object/${feedbackPhoto.duplicateOf}.png`}
                  alt="Duplicate"
                  style={styles.feedbackImage}
                />
                <p style={styles.feedbackValueText}>LOW VALUE</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Ranger Moss Praise Popup */}
      {showRangerPraise && (
        <div style={styles.rangerPraisePopup}>
          <p style={styles.rangerPraiseText}>
            🌟 Excellent choice! A new angle/condition. That will help it generalize!
          </p>
        </div>
      )}

      {/* Model Adjustment Retraining Phase */}
      {phase === 'ADJUST_MODEL_TRAINING' && (
        <div style={styles.retrainingContainer}>
          <img src="/jungle/model.GIF" alt="Model Training" style={styles.modelGif} />
          
          {adjustProgress < 100 && (
            <div style={styles.progressBarContainer}>
              <div style={{...styles.progressBarFill, width: `${adjustProgress}%`}} />
            </div>
          )}
          
          {adjustProgress >= 100 && (
            <div style={styles.finalAccuracyContainer}>
              <p style={styles.finalAccuracyLabel}>Your AI Prediction</p>
              <p style={styles.finalAccuracyValue}>95%</p>
              <p style={styles.finalAccuracyUnit}>ACCURACY</p>
              <button 
                style={{...styles.goButton, marginTop: '30px'}}
                onClick={handleAdjustComplete}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Done
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

      {/* Ranger Moss Dialogue - Left Side Panel */}
      {showRangerDialogue && (
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

      {/* Dialogue History - Show until user enters card selection */}
      {!showRangerDialogue && dialogueHistory.length > 0 && phase !== 'NOISE_REMOVAL' && phase !== 'LABEL_CORRECTION' && phase !== 'FILL_MISSING' && phase !== 'QUIZ' && phase !== 'TRAINING' && phase !== 'VALIDATION_INTRO' && phase !== 'VALIDATION_DATA' && phase !== 'ADJUST_MODEL_INTRO' && phase !== 'ADJUST_MODEL_DATA' && phase !== 'ADJUST_MODEL_TRAINING' && phase !== 'LOADING' && phase !== 'COLOR_MAP_EXPLORATION' && phase !== 'COMPLETE' && (
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

      {/* Navigation Arrow */}
      <div style={styles.navArrow}>﹀</div>
    </div>
  )
}

export default DataCleaning
