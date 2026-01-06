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
    response: "Correct! AI isn't magic, and it doesn't verify answers by itself. It needs massive amounts of data to find the hidden rules."
  },
  {
    question: "Now, think about the data you just collected. To help the AI decide if a mushroom is toxic, which features are actually helpful?",
    options: [
      { text: "Color, Shape, and Texture", correct: true },
      { text: "The name of the person who picked it", correct: false },
    ],
    response: "Precisely! To make accurate predictions, the AI needs data related to the object itself. Irrelevant info—like who picked it—is just Noise. It will only confuse the model!"
  },
]

const TRAINING_INTRO = "The dataset is clean. The patterns are clear. Are you ready? Let's initiate the Model Training process!"

const TRAINING_VOICEOVER = "Watch closely. The AI is taking the mushroom features as Input. But the Output isn't just a simple 'Yes' or 'No'. It gives us a Probability—a percentage score of how likely it is that the mushroom is toxic."

const DataCleaning = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState('INTRO') // INTRO, NOISE_REMOVAL, LABEL_CORRECTION, FILL_MISSING_INTRO, FILL_MISSING, QUIZ, TRAINING, COMPLETE
  const [noiseBatch, setNoiseBatch] = useState(0)
  const [removedItems, setRemovedItems] = useState([])
  const [labelBatch, setLabelBatch] = useState(1)
  const [selectedCells, setSelectedCells] = useState([]) // Cells user clicked as errors
  const [showGlitchHint, setShowGlitchHint] = useState(false)
  const [glitchHintText, setGlitchHintText] = useState('')
  const [showRangerDialogue, setShowRangerDialogue] = useState(false)
  const [rangerDialogueIndex, setRangerDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
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

    if (isCorrect) {
      // Add response and next question or move to training
      const newMessages = [
        ...chatMessages,
        { type: 'user', text: selectedOption.text },
        { type: 'ranger', text: currentQuestion.response }
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
    setPhase('COMPLETE')
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
      top: '10px',
      right: '10px',
      width: '80px',
      height: '80px',
      zIndex: 100,
      cursor: 'pointer',
    },
    rangerNpc: {
      position: 'absolute',
      right: '50px',
      bottom: '50px',
      width: '280px',
      height: 'auto',
      zIndex: 50,
    },
    // Card styles
    cardContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-60%, -50%)',
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
    // Fill Missing Values styles
    fillMissingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      gap: '20px',
      zIndex: 50,
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
    // Quiz styles
    quizContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '700px',
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
    // Training styles
    trainingContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '700px',
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
  }

  const currentBatchItems = NOISE_BATCHES[noiseBatch] || []
  const currentTableData = DIRTY_DATA[labelBatch]

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>

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
                  <div key={i} style={styles.trashSlot}>
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
                            const isWrong = answered && !opt.correct
                            
                            return (
                              <button
                                key={optIndex}
                                style={{
                                  ...styles.quizOptionButton,
                                  ...(isSelected ? styles.quizOptionSelected : {}),
                                  ...(isWrong ? styles.quizOptionDisabled : {}),
                                }}
                                onClick={() => !answered && handleQuizAnswer(optIndex, opt.correct)}
                                disabled={answered && !opt.correct}
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

      {/* Ranger Moss Dialogue */}
      {showRangerDialogue && (
        <div style={styles.modalOverlay}>
          <div style={styles.dialogueBox}>
            <p style={styles.speakerName}>Ranger Moss:</p>
            <p style={styles.dialogueText}>
              {displayedText}
              {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
            </p>
            <button style={styles.continueButton} onClick={handleRangerContinue}>
              {isTyping ? 'Skip' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* Glitch Hint Modal */}
      {showGlitchHint && (
        <div style={styles.modalOverlay} onClick={() => setShowGlitchHint(false)}>
          <div style={styles.hintBox} onClick={e => e.stopPropagation()}>
            <h3 style={styles.hintTitle}>💡 Glitch says:</h3>
            <p style={styles.hintText}>{glitchHintText}</p>
            <button style={styles.okButton} onClick={() => setShowGlitchHint(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Navigation Arrow */}
      <div style={styles.navArrow}>﹀</div>
    </div>
  )
}

export default DataCleaning
