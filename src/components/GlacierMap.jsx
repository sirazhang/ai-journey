import React, { useState, useEffect, useMemo } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

// Summary dialogue sequence
const summaryDialogueSequence = [
  {
    speaker: 'momo',
    text: "Thanks! You made some tough calls today 👨‍⚖️. Let's look at the 'Principles of AI Ethics' we just built 🏗️."
  },
  {
    speaker: 'momo',
    text: "Remember the Transport Captain? 🚛 AI tools are advisory, not authoritative. Humans are the Human-in-the-Loop 🔄. Humans have the ultimate responsibility to verify conditions. Humans can outsource the task, but never the blame 🚫.",
    showUserButton: true // Show user button after this dialogue
  },
  {
    speaker: 'user',
    text: "Got it! Human Responsibility is Key",
    isButton: true
  },
  {
    speaker: 'momo',
    text: "If an AI doctor prescribes the wrong medicine, but the human doctor signs off on it without checking, who is legally responsible?",
    showUserButton: true // Show quiz options after this dialogue
  },
  {
    speaker: 'quiz',
    options: [
      { text: "A. The AI Developer (Only the coder is at fault)", correct: false },
      { text: "B. The Human Doctor (The Human-in-the-Loop is liable)", correct: true },
      { text: "C. Nobody (It was an accident)", correct: false }
    ]
  },
  {
    speaker: 'momo',
    text: "Correct! The human has the final authority.",
    condition: 'correct'
  },
  {
    speaker: 'momo',
    text: "Blindly trusting an algorithm is negligence 🙈. Always perform a secondary check—like a visual inspection or a manual test 🔍. If humans just press 'Print & Sign' without looking, humans aren't doing your job.",
    showUserButton: true // Show user button after this dialogue
  },
  {
    speaker: 'user',
    text: "Agreed. Never blame the machine",
    isButton: true
  },
  {
    speaker: 'momo',
    text: "You are using AI to design a bridge. The AI says the design is '100% Safe'. What should you do next?",
    showUserButton: true // Show quiz options after this dialogue
  },
  {
    speaker: 'quiz',
    options: [
      { text: "A. Start building immediately. (Trust the machine)", correct: false },
      { text: "B. Ask the AI \"Are you sure?\" (Ask politely)", correct: false },
      { text: "C. Perform independent stress tests. (Verify with secondary checks)", correct: true }
    ]
  },
  {
    speaker: 'momo',
    text: "Exactly. Trust, but verify.",
    condition: 'correct'
  },
  {
    speaker: 'momo',
    text: "And the Captain... who chose money over a species 🚢. In a 'Trolley Problem,' we must follow a Hierarchy of Values: Human Safety & Sentient Life 🐋 > Property & Economic Value 💰. There is no perfect answer, but 'saving money' is rarely a good excuse for destruction 🛑.",
    showUserButton: true // Show user button after this dialogue
  },
  {
    speaker: 'user',
    text: "Agreed. Values > Profit",
    isButton: true
  },
  {
    speaker: 'momo',
    text: "An AI suggests driving a car through a crowded park to save 5 minutes of delivery time. Efficiency score is high. Should you do it?",
    showUserButton: true // Show quiz options after this dialogue
  },
  {
    speaker: 'quiz',
    options: [
      { text: "A. Yes. (Efficiency is money)", correct: false },
      { text: "B. No. (Safety > Efficiency)", correct: true }
    ]
  },
  {
    speaker: 'momo',
    text: "Right. Human safety ranks higher than speed or profit.",
    condition: 'correct'
  },
  {
    speaker: 'momo',
    text: "Excellent work!"
  },
  {
    speaker: 'momo',
    text: "Phew... The court case is settled for now. But honestly? That was the easy part. We've got a much bigger mess upstairs.",
    showUserButton: true // Show user button after this dialogue
  },
  {
    speaker: 'user',
    text: "What's wrong now? Tell me.",
    isButton: true
  },
  {
    speaker: 'momo',
    text: "It's the Rooftop. There's a group of workers up there... they're in bad shape. Just wailing and crying all day long. It's getting spooky.",
    showUserButton: true // Show user button after this dialogue
  },
  {
    speaker: 'user',
    text: "Why are they crying?",
    isButton: true
  },
  {
    speaker: 'momo',
    text: "It's the 'AI Withdrawal.' They relied on AI for everything—thinking, writing, remembering. Now that the system is glitchy, they've realized they lost their own skills. No critical thinking, no creativity, no memory... they're basically frozen. Could you go up there? Maybe you can help them 'reboot' their brains.",
    showUserButton: true // Show user button after this dialogue
  },
  {
    speaker: 'user',
    text: "I'm on it. Taking the elevator up.",
    isButton: true
  }
]

// NPC 6 dialogue sequence
const npc6DialogueSequence = [
  {
    speaker: 'npc6',
    text: "It's gone. It's all gone. The spark... the vision... the soul."
  },
  {
    speaker: 'user',
    text: "Are you okay? You look like you've seen a ghost.",
    isButton: true
  },
  {
    speaker: 'npc6',
    text: "I haven't seen a ghost. I've become one. I used to be a concept artist. A good one. But then... I got lazy. I started using 'MidJourney-X' for everything. Need a dragon? Click. Need a landscape? Click. It was so easy."
  },
  {
    speaker: 'user',
    text: "Continue",
    isButton: true
  },
  {
    speaker: 'npc6',
    text: "But last week, the studio fired me. They said, 'Your portfolio looks like everyone else's. Where is your voice?'"
  },
  {
    speaker: 'user',
    text: "That sounds tough. But you can start painting again, right?",
    isButton: true
  },
  {
    speaker: 'npc6',
    text: "I can't! I tried! I sat here for three days, and I couldn't draw a single line."
  },
  {
    speaker: 'user',
    text: "Let's get that spark back！",
    isButton: true,
    startChallenge: true
  }
]

// Creativity challenges data
const creativityChallenges = [
  {
    title: "List at least 9 creative uses for a Shipping Bag 🛍️ within 2 Minutes",
    requiredCount: 9,
    timeLimit: 120 // 2 minutes in seconds
  },
  {
    title: "List at least 9 creative uses for a Toothbrush 🪥 within 2 Minutes",
    requiredCount: 9,
    timeLimit: 120
  }
]

// NPC 5 dialogue sequence
const npc5DialogueSequence = [
  {
    speaker: 'npc5',
    text: "P-please... help me... I used to be a Master Librarian. Or... I thought I was."
  },
  {
    speaker: 'user',
    text: "What happened to you?",
    isButton: true
  },
  {
    speaker: 'npc5',
    text: "I let the AI handle everything. Sorting, answering questions... I stopped thinking years ago. My logic circuits are... frozen.",
    noContinue: true // Skip continue button, go directly to next
  },
  {
    speaker: 'npc5',
    text: "I have a job interview in five minutes. The interviewer sent me these two logic puzzles. Usually, I'd just feed them into the system and get the answer. But now? My mind is just... fog. A total blank.",
    noContinue: true // Skip continue button, go directly to next
  },
  {
    speaker: 'npc5',
    text: "If I can't answer these on my own, I'm finished. I'll be unemployed forever. Please... can you be my brain for just a moment? Walk me through it?"
  },
  {
    speaker: 'user',
    text: "Show me the puzzles..",
    isButton: true
  },
  {
    speaker: 'npc5',
    text: "Okay, here is the first one. It's about a dictionary. I can't figure out why the statement is wrong..."
  },
  {
    speaker: 'user',
    text: "Let's solve this together.",
    isButton: true,
    startPuzzle: true // This triggers puzzle 1
  }
]

// Puzzle data
const puzzleData = {
  1: {
    title: "Puzzle 1: The Dictionary Dilemma",
    image: "/glacier/mission/npc5_1.png",
    statement: "If you tell me the word, I can tell you the exact meaning you want by looking it up in my dictionary.",
    question: "What is the mistake in NPC 5's thinking?",
    options: [
      { text: "A) She doesn't know how to use a dictionary.", correct: false },
      { text: "B) Words can have multiple meanings, so context is needed.", correct: true },
      { text: "C) Words have different spellings.", correct: false },
      { text: "D) Dictionaries aren't for meanings.", correct: false }
    ],
    correctResponse: "Context... right. Like how 'bank' can mean money or a river... I... I remember now! Okay, one more. This one is about boxes. It's making my head spin."
  },
  2: {
    title: "Puzzle 2: Box Logic",
    image: "/glacier/mission/npc5_2.png",
    premise: "Pink Box: Flowers ONLY.\nGreen Box: Dresses (but maybe other things).",
    arguments: "Alina: \"My box is Pink. It does not have dresses.\"\nViktor: \"My box is Green. It might have flowers too.\"",
    question: "Who is logically correct based ONLY on the rules?",
    options: [
      { text: "A) Alina only", correct: true },
      { text: "B) Viktor only", correct: false },
      { text: "C) Both", correct: false },
      { text: "D) Neither", correct: false }
    ]
  }
}

const courtCases = {
  npc2: {
    eventDescription: "DISASTER ON THE ICE: A major accident just happened—a captain trusted the AI, and now the supplies are at the bottom of the ocean.",
    gif: "/glacier/mission/npc2.gif",
    npcImage: "/glacier/npc/npc2.png",
    statement: "Look, we were under a tight deadline to deliver the supplies. I entered the destination into the 'Polar-Nav GenAI' system, and it showed a 'Green Level' safe route. I just did what it said.",
    claim: "The GenAI should be the one taking the blame, not me!"
  },
  npc3: {
    eventDescription: "The station's main generator has been destroyed by the freezing cold, despite just undergoing its scheduled maintenance.",
    gif: "/glacier/mission/npc3.gif",
    npcImage: "/glacier/npc/npc3.png",
    statement: "I'm an engine mechanic, not a software engineer. I used AI to generate the Engine Maintenance Checklist—it looked professional and complete. How was I supposed to know it skipped the anti-freeze check? I trusted the system, printed the list, signed it, and followed the procedure. I did my job.",
    claim: "If AI forgets the most basic step, why am I the one getting yelled at for the engine blowing up?"
  },
  npc4: {
    eventDescription: "Faced with a dilemma, Captain Jack followed the AI's calculation to strike an endangered whale rather than hitting the ice.",
    gif: "/glacier/mission/npc4.gif",
    npcImage: "/glacier/npc/npc4.png",
    statement: "Don't look at me like I'm a monster. Look at the data! The AI calculated that hitting into that ice wall would result in a financial loss of 10 billion dollars. Therefore, the AI recommended maintaining course to avoid this catastrophe. I simply followed that AI's advice.",
    claim: "I saved this goods. How can doing the safest thing for my people be a crime?"
  }
}
const getDialogueSequences = (t) => ({
  hallway: [
    "Brrr… it's freezing out here! You might think this place looks empty and desolate, but actually—",
    "this is the most advanced region of all four zones.",
    "The Glacier Zone has always encouraged rational thinking, common sense, and the use of the latest technologies. Almost every industry here relies on GenAI to boost efficiency.",
    "Let's move forward and see what's really going on."
  ],
  outside: [
    "Huh? That's strange… Why is there no one around?",
    "The automated systems have stopped. The factories are idle. Nothing seems to be running.",
    "If this place is so advanced, why does the entire region look like it's shut down?",
    "Honestly… I don't know either. Let's go ask the local supervisor, Momo. He should be inside."
  ],
  inside: [
    {
      speaker: 'momo',
      text: "**Halt**, Traveler. You stand before the 'Silent Gear Station'. It used to be the busiest hub in the Antarctic, but now... the machines are sleeping"
    },
    {
      speaker: 'user',
      text: "Why did it stop?",
      isButton: true
    },
    {
      speaker: 'momo',
      text: "It is not broken. It is... paused.\n\nEverything changed when '**GenAI**' arrived. It was like magic!\n\nIt helped us find fish or shrimp swarms in minutes.\nIt designed wind-proof igloos instantly. Efficiency was perfect. Life was easy."
    },
    {
      speaker: 'user',
      text: "That sounds amazing!",
      isButton: true
    },
    {
      speaker: 'momo',
      text: "Yes. Ease brought carelessness.\n\nWhen the AI made a mistake—like guiding a truck onto thin ice—the workers stopped taking responsibility.\n\nThey shouted: 'The machine tricked me! It's not my fault!'\n\n**Chaos** spread. No one knew who to blame anymore."
    },
    {
      speaker: 'user',
      text: "That is a difficult problem.",
      isButton: true
    },
    {
      speaker: 'momo',
      text: "That is the question.\n\nMy code says: Technology is the tool, but **Worker** is the **Master**.\n\nNo matter how smart the AI gets, the hand that presses the button must bear the weight of the result.\n\nBut not everyone agrees... We need a **Judge** to settle this."
    },
    {
      speaker: 'user',
      text: "I am ready to judge",
      isButton: true
    },
    {
      speaker: 'momo',
      text: "Good. The Court is waiting for you."
    }
  ]
})

const GlacierMap = ({ onExit }) => {
  const { t } = useLanguage()
  const [currentScene, setCurrentScene] = useState('hallway') // hallway, outside, inside, court, rooftop
  const [showDialogue, setShowDialogue] = useState(true)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showArrow, setShowArrow] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dialogueHistory, setDialogueHistory] = useState([]) // For inside scene dialogue history
  const [waitingForUserInput, setWaitingForUserInput] = useState(false)
  
  // Court scene states
  const [selectedNpc, setSelectedNpc] = useState(null) // npc2, npc3, npc4
  const [caseStep, setCaseStep] = useState(1) // 1: event description, 2: NPC statement
  const [completedCases, setCompletedCases] = useState([]) // Track completed cases
  const [showStamp, setShowStamp] = useState(false)
  const [stampType, setStampType] = useState('') // 'accepted' or 'rejected'
  
  // Summary dialogue states
  const [showSummaryDialogue, setShowSummaryDialogue] = useState(false)
  const [summaryDialogueIndex, setSummaryDialogueIndex] = useState(0)
  const [summaryDisplayedText, setSummaryDisplayedText] = useState('')
  const [summaryIsTyping, setSummaryIsTyping] = useState(false)
  const [summaryDialogueHistory, setSummaryDialogueHistory] = useState([])
  const [summaryWaitingForInput, setSummaryWaitingForInput] = useState(false)
  const [showElevatorArrow, setShowElevatorArrow] = useState(false)
  
  // Rooftop states
  const [showNpc5Dialogue, setShowNpc5Dialogue] = useState(false)
  const [npc5DialogueIndex, setNpc5DialogueIndex] = useState(0)
  const [npc5DialogueHistory, setNpc5DialogueHistory] = useState([])
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [currentPuzzle, setCurrentPuzzle] = useState(1)
  const [puzzleTimer, setPuzzleTimer] = useState(600) // 10 minutes in seconds
  const [selectedAnswer, setSelectedAnswer] = useState(null) // Track selected answer for color feedback
  const [npc5Completed, setNpc5Completed] = useState(false) // Track if NPC5 puzzles are completed
  const [rooftopCompletedTasks, setRooftopCompletedTasks] = useState([]) // Track completed rooftop tasks (npc5, npc6, npc7)
  
  // NPC6 states
  const [showNpc6Dialogue, setShowNpc6Dialogue] = useState(false)
  const [npc6DialogueIndex, setNpc6DialogueIndex] = useState(0)
  const [showCreativityChallenge, setShowCreativityChallenge] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [challengeTimer, setChallengeTimer] = useState(120)
  const [userInputs, setUserInputs] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [npc6Completed, setNpc6Completed] = useState(false)

  // Background music
  useEffect(() => {
    const audio = new Audio('/sound/glacier.mp3')
    audio.loop = true
    audio.volume = 0.5
    
    audio.play().catch(e => console.log('Audio play failed:', e))
    
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  // 使用useMemo来避免每次渲染都重新创建dialogues
  const dialogueSequences = useMemo(() => getDialogueSequences(t), [t])
  const currentDialogues = dialogueSequences[currentScene] || []

  // Show arrow after all dialogues are complete
  useEffect(() => {
    if (currentScene === 'inside') {
      // Inside scene has different logic
      if (currentDialogueIndex >= currentDialogues.length && !isTyping && showDialogue) {
        setShowDialogue(false)
        setShowArrow(true)
      }
    } else {
      // Original logic for hallway and outside
      if (currentDialogueIndex >= currentDialogues.length && !isTyping && showDialogue) {
        setShowDialogue(false)
        setShowArrow(true)
      }
    }
  }, [currentDialogueIndex, currentDialogues.length, isTyping, showDialogue, currentScene])

  // Typing effect for dialogue
  useEffect(() => {
    if (!showDialogue) return
    
    if (currentScene === 'inside') {
      // Inside scene dialogue logic
      const currentDialogue = currentDialogues[currentDialogueIndex]
      if (!currentDialogue || currentDialogue.isButton) {
        setWaitingForUserInput(true)
        return
      }
      
      const currentText = currentDialogue.text
      if (!currentText) return
      
      let charIndex = 0
      setDisplayedText('')
      setIsTyping(true)
      setWaitingForUserInput(false)

      const typingInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setDisplayedText(currentText.substring(0, charIndex + 1))
          charIndex++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    } else {
      // Original typing logic for hallway and outside
      if (currentDialogueIndex >= currentDialogues.length) return
      
      const currentText = currentDialogues[currentDialogueIndex]
      if (!currentText) return
      
      let charIndex = 0
      setDisplayedText('')
      setIsTyping(true)

      const typingInterval = setInterval(() => {
        if (charIndex < currentText.length) {
          setDisplayedText(currentText.substring(0, charIndex + 1))
          charIndex++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, 30)

      return () => clearInterval(typingInterval)
    }
  }, [currentDialogueIndex, showDialogue, currentScene]) // 移除currentDialogues依赖

  // Summary dialogue typing effect
  useEffect(() => {
    if (!showSummaryDialogue) return
    
    const currentDialogue = summaryDialogueSequence[summaryDialogueIndex]
    if (!currentDialogue) return
    
    if (currentDialogue.isButton || currentDialogue.speaker === 'quiz') {
      setSummaryWaitingForInput(true)
      return
    }
    
    const currentText = currentDialogue.text
    if (!currentText) return
    
    let charIndex = 0
    setSummaryDisplayedText('')
    setSummaryIsTyping(true)
    setSummaryWaitingForInput(false)

    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setSummaryDisplayedText(currentText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setSummaryIsTyping(false)
        clearInterval(typingInterval)
        
        // Check if this dialogue should show user button after typing
        if (currentDialogue.showUserButton) {
          setSummaryWaitingForInput(true)
        }
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [summaryDialogueIndex, showSummaryDialogue])

  // Reset dialogue when scene changes
  useEffect(() => {
    setCurrentDialogueIndex(0)
    setShowDialogue(true)
    setShowArrow(false)
    setDisplayedText('')
    setIsTyping(false)
    setDialogueHistory([])
    setWaitingForUserInput(false)
    
    // Auto-trigger summary dialogue when returning to inside after completing all cases
    if (currentScene === 'inside' && completedCases.length === 3) {
      setTimeout(() => {
        setShowSummaryDialogue(true)
        setSummaryDialogueIndex(0)
        setSummaryDialogueHistory([])
        setSummaryWaitingForInput(false)
        setShowDialogue(false) // Hide regular dialogue
      }, 500) // Small delay to ensure scene transition is complete
    }
  }, [currentScene, completedCases.length])

  const handleContinue = () => {
    if (currentScene === 'inside') {
      // Inside scene continue logic
      const currentDialogue = currentDialogues[currentDialogueIndex]
      
      if (isTyping) {
        // Skip typing animation
        setDisplayedText(currentDialogue.text)
        setIsTyping(false)
      } else {
        // Add current dialogue to history
        setDialogueHistory(prev => [...prev, currentDialogue])
        
        // Move to next dialogue
        if (currentDialogueIndex < currentDialogues.length - 1) {
          setCurrentDialogueIndex(currentDialogueIndex + 1)
        } else {
          // End of dialogue, show arrow
          setShowDialogue(false)
          setShowArrow(true)
        }
      }
    } else {
      // Original continue logic
      if (isTyping) {
        // Skip typing animation
        setDisplayedText(currentDialogues[currentDialogueIndex])
        setIsTyping(false)
      } else if (currentDialogueIndex < currentDialogues.length - 1) {
        // Next dialogue
        setCurrentDialogueIndex(currentDialogueIndex + 1)
      } else {
        // Hide dialogue and show arrow
        setShowDialogue(false)
        setShowArrow(true)
      }
    }
  }

  const handleSkip = () => {
    if (currentScene === 'inside') {
      // Skip all remaining dialogues and show arrow
      setShowDialogue(false)
      setShowArrow(true)
    } else {
      setShowDialogue(false)
      setShowArrow(true)
    }
  }

  const handleUserChoice = (choiceText) => {
    // Add user choice to history
    setDialogueHistory(prev => [...prev, { speaker: 'user', text: choiceText }])
    
    // Move to next dialogue (should be Momo's response)
    setCurrentDialogueIndex(currentDialogueIndex + 1)
    setWaitingForUserInput(false)
  }

  // Handle Momo click for summary dialogue
  const handleMomoClick = () => {
    if (completedCases.length === 3) { // Only show summary if all cases completed
      setShowSummaryDialogue(true)
      setSummaryDialogueIndex(0)
      setSummaryDialogueHistory([])
      setSummaryWaitingForInput(false)
      setShowDialogue(false) // Hide regular dialogue when showing summary
    }
  }

  // Summary dialogue handlers
  const handleSummaryUserChoice = (choiceText) => {
    setSummaryDialogueHistory(prev => [...prev, { speaker: 'user', text: choiceText }])
    
    // Move forward by 2 positions: skip the user button and go to next Momo dialogue
    const nextIndex = summaryDialogueIndex + 2
    
    // Check if this is the last dialogue
    if (nextIndex >= summaryDialogueSequence.length) {
      // This is the last user choice, show elevator arrow
      setShowSummaryDialogue(false)
      setShowElevatorArrow(true)
    } else {
      // Move to next dialogue
      setSummaryDialogueIndex(nextIndex)
      setSummaryWaitingForInput(false)
    }
  }

  const handleSummaryQuizChoice = (option) => {
    setSummaryDialogueHistory(prev => [...prev, { speaker: 'user', text: option.text }])
    
    // Current index is at the Momo question, +1 is the quiz, +2 is the response
    let nextIndex = summaryDialogueIndex + 2
    const nextDialogue = summaryDialogueSequence[nextIndex]
    
    if (nextDialogue && nextDialogue.condition === 'correct' && !option.correct) {
      // Skip correct response if answer was wrong
      nextIndex += 1
    }
    
    setSummaryDialogueIndex(nextIndex)
    setSummaryWaitingForInput(false)
  }

  const handleSummaryContinue = () => {
    const currentDialogue = summaryDialogueSequence[summaryDialogueIndex]
    
    if (summaryIsTyping) {
      // Skip typing animation
      setSummaryDisplayedText(currentDialogue.text)
      setSummaryIsTyping(false)
      
      // Check if this dialogue should show user button after skipping
      if (currentDialogue.showUserButton) {
        setSummaryWaitingForInput(true)
      }
    } else if (!summaryWaitingForInput) {
      // Only advance if not waiting for user input
      // Add current dialogue to history and advance
      setSummaryDialogueHistory(prev => [...prev, currentDialogue])
      
      if (summaryDialogueIndex < summaryDialogueSequence.length - 1) {
        setSummaryDialogueIndex(summaryDialogueIndex + 1)
      } else {
        // End of all dialogues
        setShowSummaryDialogue(false)
        setShowElevatorArrow(true)
      }
    }
  }

  const handleSummarySkip = () => {
    setShowSummaryDialogue(false)
  }

  // Handle elevator arrow click
  const handleElevatorArrowClick = () => {
    setCurrentScene('rooftop')
    setShowElevatorArrow(false)
    setShowSummaryDialogue(false)
  }

  // Handle NPC 5 click
  const handleNpc5Click = () => {
    if (npc5Completed) {
      // Show completion message
      setShowNpc5Dialogue(true)
      setNpc5DialogueIndex(-1) // Special index for completion message
    } else {
      // Start normal dialogue
      setShowNpc5Dialogue(true)
      setNpc5DialogueIndex(0)
      setNpc5DialogueHistory([])
    }
    // Close puzzle if it's open
    setShowPuzzle(false)
  }

  // Handle NPC 6 click
  const handleNpc6Click = () => {
    if (npc6Completed) {
      // Show completion message
      setShowNpc6Dialogue(true)
      setNpc6DialogueIndex(-1)
    } else {
      // Start normal dialogue
      setShowNpc6Dialogue(true)
      setNpc6DialogueIndex(0)
    }
  }

  // Handle NPC 6 dialogue
  const handleNpc6UserChoice = () => {
    const currentDialogue = npc6DialogueSequence[npc6DialogueIndex]
    
    // Check if this button should start the challenge
    if (currentDialogue.isButton && currentDialogue.startChallenge) {
      setShowCreativityChallenge(true)
      setCurrentChallenge(0)
      setChallengeTimer(120)
      setUserInputs([])
      setCurrentInput('')
      setShowNpc6Dialogue(false)
      return
    }
    
    // Advance to next dialogue
    if (npc6DialogueIndex < npc6DialogueSequence.length - 1) {
      setNpc6DialogueIndex(npc6DialogueIndex + 1)
    }
  }

  // Handle creativity challenge input
  const handleChallengeSubmit = () => {
    if (currentInput.trim()) {
      const newInputs = [...userInputs, currentInput.trim()]
      setUserInputs(newInputs)
      setCurrentInput('')
      
      // Check if user has entered enough items
      if (newInputs.length >= creativityChallenges[currentChallenge].requiredCount) {
        // Move to next challenge or complete
        setTimeout(() => {
          if (currentChallenge < creativityChallenges.length - 1) {
            setCurrentChallenge(currentChallenge + 1)
            setChallengeTimer(120)
            setUserInputs([])
          } else {
            // All challenges completed
            setShowCreativityChallenge(false)
            setNpc6Completed(true)
            setRooftopCompletedTasks(prev => [...prev, 'npc6'])
          }
        }, 500)
      }
    }
  }

  // Challenge timer countdown
  useEffect(() => {
    if (showCreativityChallenge && challengeTimer > 0) {
      const timer = setTimeout(() => {
        setChallengeTimer(challengeTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showCreativityChallenge, challengeTimer])

  // Handle NPC 5 dialogue
  const handleNpc5UserChoice = (choiceText) => {
    const currentDialogue = npc5DialogueSequence[npc5DialogueIndex]
    
    // Check if this button should start the puzzle
    if (currentDialogue.isButton && currentDialogue.startPuzzle) {
      setShowPuzzle(true)
      setCurrentPuzzle(1)
      setPuzzleTimer(600)
      setShowNpc5Dialogue(false)
      setSelectedAnswer(null)
      // Mark as completed when starting puzzle (user has engaged with NPC5)
      setNpc5Completed(true)
      if (!rooftopCompletedTasks.includes('npc5')) {
        setRooftopCompletedTasks(prev => [...prev, 'npc5'])
      }
      return
    }
    
    // Check if current dialogue has noContinue flag
    if (currentDialogue.noContinue) {
      // Skip to next dialogue immediately without showing continue button
      if (npc5DialogueIndex < npc5DialogueSequence.length - 1) {
        setNpc5DialogueIndex(npc5DialogueIndex + 1)
      }
      return
    }
    
    // Simply advance to next dialogue
    if (npc5DialogueIndex < npc5DialogueSequence.length - 1) {
      setNpc5DialogueIndex(npc5DialogueIndex + 1)
    }
  }

  // Handle puzzle answer
  const handlePuzzleAnswer = (option, optionIndex) => {
    // Set selected answer for visual feedback
    setSelectedAnswer(optionIndex)
    
    if (option.correct) {
      // Correct answer - wait 1 second then move to next puzzle or close
      setTimeout(() => {
        if (currentPuzzle === 1) {
          // Move to puzzle 2
          setCurrentPuzzle(2)
          setSelectedAnswer(null)
        } else {
          // Puzzle 2 completed - close puzzle
          setShowPuzzle(false)
          setSelectedAnswer(null)
        }
      }, 1000)
    }
    // If wrong, just show red border (don't advance)
  }

  // Auto-advance for noContinue dialogues
  useEffect(() => {
    if (showNpc5Dialogue && npc5DialogueIndex < npc5DialogueSequence.length) {
      const currentDialogue = npc5DialogueSequence[npc5DialogueIndex]
      if (currentDialogue.noContinue && !currentDialogue.isButton) {
        // Auto-advance after a short delay (1 second)
        const timer = setTimeout(() => {
          if (npc5DialogueIndex < npc5DialogueSequence.length - 1) {
            setNpc5DialogueIndex(npc5DialogueIndex + 1)
          }
        }, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [showNpc5Dialogue, npc5DialogueIndex])

  // Timer countdown
  useEffect(() => {
    if (showPuzzle && puzzleTimer > 0) {
      const timer = setTimeout(() => {
        setPuzzleTimer(puzzleTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [showPuzzle, puzzleTimer])

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Court scene handlers
  const handleNpcClick = (npcId) => {
    if (completedCases.includes(npcId)) return // Don't allow clicking completed cases
    setSelectedNpc(npcId)
    setCaseStep(1)
  }

  const handleNextStep = () => {
    setCaseStep(2)
  }

  const handleJudgment = (judgment) => {
    setStampType(judgment)
    setShowStamp(true)
    
    // Play stamp sound
    const audio = new Audio('/sound/stamp.mp3')
    audio.play().catch(e => console.log('Audio play failed:', e))
    
    // Add to completed cases
    setCompletedCases(prev => [...prev, selectedNpc])
    
    // Hide stamp and close case after 2 seconds
    setTimeout(() => {
      setShowStamp(false)
      setSelectedNpc(null)
      setCaseStep(1)
      setStampType('')
    }, 2000)
  }

  const closeCaseModal = () => {
    setSelectedNpc(null)
    setCaseStep(1)
  }

  // Handle left button click in court
  const handleLeftButton = () => {
    if (currentScene === 'court') {
      setCurrentScene('inside')
      setShowDialogue(false)
      setShowArrow(false)
    } else if (currentScene === 'rooftop') {
      setCurrentScene('inside')
      setShowNpc5Dialogue(false)
      setShowPuzzle(false)
    }
  }

  const handleArrowClick = () => {
    if (currentScene === 'hallway') {
      // Transition to outside scene
      setIsTransitioning(true)
      setShowArrow(false)
      setShowDialogue(false)
      
      // Show hallway.gif for 2 seconds, then switch to outside.png
      setTimeout(() => {
        setCurrentScene('outside')
        // 场景切换时的状态重置会由useEffect处理
        setIsTransitioning(false)
      }, 2000)
    } else if (currentScene === 'outside') {
      // Transition to inside scene
      setCurrentScene('inside')
      setShowArrow(false)
      setShowDialogue(false)
    } else if (currentScene === 'inside') {
      // Transition to court scene
      setCurrentScene('court')
      setShowArrow(false)
      setShowDialogue(false)
    }
  }

  const getBackgroundImage = () => {
    if (isTransitioning && currentScene === 'hallway') {
      return '/glacier/background/hallway.gif'
    }
    
    switch (currentScene) {
      case 'hallway':
        return '/glacier/background/hallway.png'
      case 'outside':
        return '/glacier/background/outside.png'
      case 'inside':
        return '/glacier/background/inside.png'
      case 'court':
        return '/glacier/background/court.png'
      case 'rooftop':
        return '/glacier/background/rooftop.png'
      default:
        return '/glacier/background/hallway.png'
    }
  }

  const getArrowImage = () => {
    switch (currentScene) {
      case 'hallway':
        return '/glacier/icon/arrow1.png'
      case 'outside':
        return '/glacier/icon/arrow2.png'
      default:
        return '/glacier/icon/arrow1.png'
    }
  }

  const getArrowPosition = () => {
    switch (currentScene) {
      case 'hallway':
        return { right: '350px', bottom: '10px' }
      case 'outside':
        return { left: '300px', bottom: '0px' }
      case 'inside':
        return { left: '30%', bottom: '0%' } // Arrow position for court transition
      default:
        return { right: '350px', bottom: '10px' }
    }
  }

  // Helper function to render text with bold formatting
  const renderTextWithBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  const getNpcPosition = () => {
    switch (currentScene) {
      case 'hallway':
        return { left: '5px', bottom: '5px', size: '400px' } // 修改为400px
      case 'outside':
        return { right: '0px', top: '0px', size: '400px' } // 增大到400px
      case 'inside':
        return { right: '0px', top: '0px', size: '80px' } // Glitch NPC 80px in top right
      case 'court':
        return { right: '0px', top: '0px', size: '120px' } // Glitch NPC 120px in top right for court
      case 'rooftop':
        return { right: '0px', top: '0px', size: '120px' } // Glitch NPC 120px in top right for rooftop
      default:
        return { left: '5px', bottom: '5px', size: '400px' }
    }
  }

  const getCourtNpcPositions = () => {
    return {
      npc2: { right: '30%', bottom: '20%', height: '280px' },
      npc3: { left: '25%', bottom: '20%', height: '240px' },
      npc4: { right: '22%', bottom: '22%', height: '180px' }
    }
  }

  const getMomoPosition = () => {
    if (currentScene === 'inside') {
      return { right: '10%', bottom: '0%', height: '85%' } // Momo position
    }
    return null
  }

  const getDialoguePosition = () => {
    switch (currentScene) {
      case 'hallway':
        return { left: '420px', bottom: '150px', width: '700px', minHeight: '200px' } // 调整到NPC右侧贴近位置
      case 'outside':
        return { right: '420px', top: '150px', width: '500px', minHeight: '120px' } // 向下向左移动，贴近400px的NPC
      case 'inside':
        return { right: '50%', top: '15%', width: '40%', height: '70%' } // Align with Momo's top (15% from top), reduce height to 70%
      default:
        return { left: '420px', bottom: '150px', width: '700px', minHeight: '200px' }
    }
  }

  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
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
    npc: {
      position: 'absolute',
      zIndex: 30,
      transition: 'transform 0.2s',
    },
    npcImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    dialogueContainer: {
      position: 'absolute',
      zIndex: 1000, // 增加z-index确保显示在最上层
      background: 'rgba(255, 255, 255, 0.85)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)', // 添加阴影使其更明显
    },
    insideDialogueContainer: {
      position: 'absolute',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.85)', // Changed from 0.9 to 0.85
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), linear-gradient(90deg, #5170FF, #FFBBC4)', // Changed from 0.9 to 0.85
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      overflowY: 'auto', // Enable scrolling
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px', // 增大字体
      color: '#333',
      lineHeight: 1.6,
      margin: 0,
      flex: 1,
    },
    dialogueHistory: {
      marginBottom: '20px',
    },
    dialogueMessage: {
      marginBottom: '15px',
      padding: '10px',
      borderRadius: '8px',
      background: 'transparent', // Remove individual message backgrounds
      border: 'none', // Remove individual message borders
    },
    momoMessage: {
      textAlign: 'left',
      background: 'transparent', // Remove background
      borderLeft: 'none', // Remove left border
    },
    userMessage: {
      textAlign: 'right',
      background: 'transparent', // Remove background
      borderRight: 'none', // Remove right border
    },
    currentDialogue: {
      padding: '15px',
      borderRadius: '8px',
      background: 'transparent', // Remove current dialogue background
      border: 'none', // Remove current dialogue border
    },
    firstDialogue: {
      padding: '15px',
      borderRadius: '8px',
      background: 'transparent', // No background for first dialogue
      border: 'none', // No border for first dialogue
    },
    firstDialogueContainer: {
      position: 'absolute',
      zIndex: 1000,
      background: 'transparent', // Completely transparent background
      border: 'none', // No border
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    },
    userChoiceButton: {
      padding: '12px 20px',
      margin: '10px 0',
      borderRadius: '8px',
      border: 'none',
      background: '#FFBBC4',
      color: '#333',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      textAlign: 'right',
      transition: 'all 0.2s',
      alignSelf: 'flex-end',
      maxWidth: '80%',
    },
    quizOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '15px',
    },
    quizOption: {
      padding: '12px 20px',
      borderRadius: '8px',
      border: '2px solid #5170FF',
      background: 'rgba(81, 112, 255, 0.1)',
      color: '#333',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
    },
    leftButton: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      width: '60px',
      height: '40px',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      zIndex: 100,
      transition: 'all 0.2s',
    },
    leftButtonImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    elevatorArrow: {
      position: 'absolute',
      top: '300px',
      right: '900px',
      width: '300px',
      height: '215px',
      cursor: 'pointer',
      zIndex: 50,
      animation: 'breathe 2s ease-in-out infinite',
      transition: 'transform 0.2s',
    },
    npc5: {
      position: 'absolute',
      bottom: '15%',
      right: '20%',
      width: '200px',
      height: '200px',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
    },
    npc6: {
      position: 'absolute',
      left: '150px',
      bottom: '300px',
      width: '250px',
      height: '270px',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
    },
    npc6DialogueContainer: {
      position: 'absolute',
      left: 'calc(150px + 250px)', // Right of NPC6 (NPC6 left + width)
      bottom: '300px',
      width: '700px',
      minHeight: '200px',
      background: 'rgba(255, 255, 255, 0.85)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
    },
    npc6ContinueButton: {
      alignSelf: 'flex-end',
      padding: '8px 20px',
      background: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    npc5DialogueContainer: {
      position: 'absolute',
      right: 'calc(20% + 200px)', // Right edge touches NPC5's left edge (NPC5 is at right 20%, width 200px)
      bottom: '15%',
      width: '500px',
      minHeight: '150px',
      background: 'rgba(255, 255, 255, 0.85)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.85)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 1000,
    },
    npc5ContinueButton: {
      alignSelf: 'flex-end', // Position at right
      padding: '8px 20px',
      background: '#000',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    puzzleContainer: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '70vw', // Changed to 70% of viewport width
      maxWidth: '1200px',
      minHeight: '500px',
      background: 'rgba(50, 50, 50, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(50,50,50,0.95), rgba(50,50,50,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '20px',
      padding: '40px',
      zIndex: 2000,
      color: '#fff',
    },
    puzzleTimer: {
      position: 'absolute',
      top: '30px',
      left: '30px',
      fontSize: '22px', // Increased from 18px
      fontWeight: 'bold',
      color: '#fff',
      background: 'rgba(0, 0, 0, 0.7)',
      padding: '12px 20px', // Increased padding
      borderRadius: '8px',
    },
    puzzleTitle: {
      fontSize: '28px', // Increased from 20px
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
    },
    puzzleContent: {
      display: 'flex',
      gap: '40px', // Increased gap
      alignItems: 'flex-start',
    },
    puzzleImageContainer: {
      width: '250px', // Increased from 200px
      flexShrink: 0,
    },
    puzzleImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '10px',
    },
    puzzleTextContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    puzzleStatement: {
      fontSize: '20px', // Increased from 16px
      marginBottom: '15px',
      fontStyle: 'italic',
      lineHeight: 1.5,
    },
    puzzleQuestion: {
      fontSize: '24px', // Increased from 18px
      fontWeight: 'bold',
      marginBottom: '25px',
      lineHeight: 1.4,
    },
    puzzleOptions: {
      display: 'grid', // Changed from flex to grid
      gridTemplateColumns: '1fr 1fr', // Two columns
      gap: '15px', // Gap between options
      marginTop: '20px',
    },
    puzzleOption: {
      padding: '15px 25px', // Increased padding
      borderRadius: '8px',
      border: '2px solid #5170FF',
      background: 'rgba(81, 112, 255, 0.2)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px', // Increased from 14px
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
      lineHeight: 1.4,
    },
    puzzleOptionCorrect: {
      borderColor: '#00ff00', // Green border for correct answer
      background: 'rgba(0, 255, 0, 0.2)',
    },
    puzzleOptionWrong: {
      background: 'rgba(255, 0, 0, 0.3)',
      borderColor: '#ff0000',
    },
    // Creativity Challenge styles
    creativityContainer: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '1100px',
      height: '700px',
      background: 'rgba(50, 50, 50, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(50,50,50,0.95), rgba(50,50,50,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '20px',
      padding: '40px',
      zIndex: 2000,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
    },
    creativityTimer: {
      fontSize: '48px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontFamily: 'monospace',
    },
    creativityTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '40px',
      lineHeight: 1.4,
    },
    creativityTagsContainer: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      gap: '15px',
      marginBottom: '30px',
      overflowY: 'auto',
    },
    creativityTag: {
      padding: '12px 20px',
      borderRadius: '25px',
      border: '2px solid transparent',
      backgroundImage: 'linear-gradient(rgba(50,50,50,0.95), rgba(50,50,50,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      fontSize: '16px',
      color: '#fff',
      whiteSpace: 'nowrap',
    },
    creativityInputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    creativityInput: {
      flex: 1,
      padding: '15px 20px',
      borderRadius: '10px',
      border: '2px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      fontSize: '16px',
      outline: 'none',
    },
    creativitySendButton: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
    },
    creativitySendIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    // Court scene styles
    progressContainer: {
      position: 'absolute',
      bottom: '50px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '20px',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.85)', // White background with 85% opacity
      padding: '15px 25px',
      borderRadius: '30px',
    },
    progressCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      border: '3px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#666',
      transition: 'all 0.3s',
      background: '#fff', // White background for circles
    },
    progressCircleCompleted: {
      background: '#4CAF50',
      borderColor: '#4CAF50',
      color: '#fff',
    },
    courtNpc: {
      position: 'absolute',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      zIndex: 50,
    },
    caseModal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '20px',
      padding: '30px',
      zIndex: 2000,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    },
    caseModalStep1: {
      width: '50vw',
      height: '70vh',
    },
    caseModalStep2: {
      width: '1380px', // Changed from 65vw to 1380px
      height: '640px', // Changed from 60vh to 640px
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#666',
    },
    caseTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#333',
    },
    caseGif: {
      width: '100%',
      height: 'auto', // Maintain original aspect ratio
      maxHeight: '50vh', // Limit maximum height
      objectFit: 'contain', // Keep original proportions
      borderRadius: '10px',
      marginBottom: '10px', // Reduce gap from 20px to 10px
    },
    nextButton: {
      position: 'absolute',
      bottom: '15px', // Reduce from 20px to 15px
      right: '30px',
      padding: '12px 30px',
      background: '#333',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    step2Container: {
      position: 'relative',
      height: '100%',
      width: '100%',
    },
    step2Npc: {
      position: 'absolute',
      left: '-150px', // Changed from -180px to -150px
      top: '0',
      width: '600px', // Increased from 500px to 600px
      height: '100%',
      objectFit: 'contain',
      zIndex: 1,
    },
    step2Content: {
      position: 'absolute',
      left: '200px', // Text starts 200px from left edge
      top: '0',
      right: '0',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 2, // Above the NPC
      paddingRight: '20px',
    },
    npcStatement: {
      fontSize: '24px', // Changed from 22px to 24px
      lineHeight: 1.6,
      marginTop: '80px', // Changed from 40px to 80px
      marginBottom: '20px',
      color: '#333',
      textAlign: 'center', // Center align
    },
    npcClaim: {
      fontSize: '30px', // Changed from 27px to 30px
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#333',
      textAlign: 'center', // Center align
    },
    judgmentButtons: {
      position: 'absolute',
      bottom: '90px', // Changed from 50px to 90px
      left: '0',
      right: '0',
      display: 'flex',
      alignItems: 'center',
    },
    approvedButton: {
      position: 'absolute',
      left: '300px', // Changed from right: 600px to left: 300px
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    rejectedButton: {
      position: 'absolute',
      right: '200px', // Changed from 100px to 200px
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    judgmentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    judgmentIcon: {
      width: '123px', // Maintain aspect ratio (slightly less than height)
      height: '135px', // Original ratio height
      marginBottom: '-5px', // -5px distance from icon to text
      objectFit: 'contain', // Maintain aspect ratio
    },
    judgmentLabel: {
      fontSize: '32px', // Changed from 18px to 32px
      fontWeight: 'bold',
      color: '#333',
    },
    stampOverlay: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 3000,
      width: '350px',
      height: '350px',
    },
    dialogueButtons: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '15px',
    },
    dialogueButton: {
      padding: '8px 16px',
      borderRadius: '6px',
      border: 'none',
      background: '#333',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    arrow: {
      position: 'absolute',
      width: '300px',
      height: '300px',
      cursor: 'pointer',
      zIndex: 50,
      animation: 'breathe 2s ease-in-out infinite',
      transition: 'transform 0.2s',
    },
    arrowSmall: {
      position: 'absolute',
      width: '350px',
      height: '350px',
      cursor: 'pointer',
      zIndex: 50,
      animation: 'breathe 2s ease-in-out infinite',
      transition: 'transform 0.2s',
    },
    arrowImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    keyframes: `
      @keyframes breathe {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `,
  }

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      
      {/* Background Image */}
      <img 
        src={getBackgroundImage()}
        alt="Glacier Background" 
        style={styles.backgroundImage}
      />
      
      {/* Exit Button / Left Button */}
      {currentScene === 'court' || currentScene === 'rooftop' ? (
        <button 
          style={styles.leftButton} 
          onClick={handleLeftButton}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img 
            src="/jungle/icon/left.png"
            alt="Left"
            style={styles.leftButtonImage}
          />
        </button>
      ) : (
        <button 
          style={styles.exitButton} 
          onClick={onExit}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.5)'
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.3)'
            e.target.style.transform = 'scale(1)'
          }}
        >
          {t('exit')}
        </button>
      )}

      {/* NPC Glitch */}
      <div 
        style={{
          ...styles.npc,
          ...getNpcPosition(),
          width: getNpcPosition().size,
          height: getNpcPosition().size,
        }}
      >
        <img 
          src="/npc/npc_glacier.gif"
          alt="Glitch"
          style={styles.npcImage}
        />
      </div>

      {/* Momo NPC (only in inside scene) */}
      {currentScene === 'inside' && getMomoPosition() && (
        <div 
          style={{
            position: 'absolute',
            zIndex: 30,
            cursor: completedCases.length === 3 ? 'pointer' : 'default',
            ...getMomoPosition(),
          }}
          onClick={handleMomoClick}
          onMouseOver={(e) => completedCases.length === 3 && (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <img 
            src="/glacier/npc/momo.png"
            alt="Momo"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Dialogue Box */}
      {showDialogue && currentDialogues.length > 0 && currentScene !== 'inside' && (
        <div 
          style={{
            ...styles.dialogueContainer,
            ...getDialoguePosition(),
          }}
        >
          <p style={styles.dialogueText}>
            {displayedText}
            {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
          </p>
          
          <div style={styles.dialogueButtons}>
            <button 
              style={styles.dialogueButton}
              onClick={handleSkip}
              onMouseOver={(e) => e.target.style.background = '#555'}
              onMouseOut={(e) => e.target.style.background = '#333'}
            >
              SKIP
            </button>
            <button 
              style={styles.dialogueButton}
              onClick={handleContinue}
              onMouseOver={(e) => e.target.style.background = '#555'}
              onMouseOut={(e) => e.target.style.background = '#333'}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* Inside Scene Dialogue System */}
      {currentScene === 'inside' && showDialogue && !showSummaryDialogue && (
        <div 
          style={{
            ...styles.insideDialogueContainer, // Always use the white background container
            ...getDialoguePosition(),
          }}
        >
          {/* Dialogue History */}
          <div style={styles.dialogueHistory}>
            {dialogueHistory.map((dialogue, index) => (
              <div 
                key={index}
                style={{
                  ...styles.dialogueMessage,
                  ...(dialogue.speaker === 'momo' ? styles.momoMessage : styles.userMessage),
                }}
              >
                <div style={styles.dialogueText}>
                  {dialogue.speaker === 'momo' ? renderTextWithBold(dialogue.text) : dialogue.text}
                </div>
              </div>
            ))}
          </div>

          {/* Current Dialogue */}
          {!waitingForUserInput && (
            <div style={styles.currentDialogue}> {/* Always use currentDialogue style, never firstDialogue */}
              <div style={styles.dialogueText}>
                {renderTextWithBold(displayedText)}
                {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
              </div>
              
              <div style={styles.dialogueButtons}>
                <button 
                  style={styles.dialogueButton}
                  onClick={handleSkip}
                  onMouseOver={(e) => e.target.style.background = '#555'}
                  onMouseOut={(e) => e.target.style.background = '#333'}
                >
                  SKIP
                </button>
                <button 
                  style={styles.dialogueButton}
                  onClick={handleContinue}
                  onMouseOver={(e) => e.target.style.background = '#555'}
                  onMouseOut={(e) => e.target.style.background = '#333'}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          )}

          {/* User Choice Buttons */}
          {waitingForUserInput && currentDialogues[currentDialogueIndex] && currentDialogues[currentDialogueIndex].isButton && (
            <button 
              style={styles.userChoiceButton}
              onClick={() => handleUserChoice(currentDialogues[currentDialogueIndex].text)}
              onMouseOver={(e) => e.target.style.background = '#ff9fb0'}
              onMouseOut={(e) => e.target.style.background = '#FFBBC4'}
            >
              {currentDialogues[currentDialogueIndex].text}
            </button>
          )}
        </div>
      )}

      {/* Court Scene NPCs */}
      {currentScene === 'court' && (
        <>
          {Object.entries(getCourtNpcPositions()).map(([npcId, position]) => (
            <div
              key={npcId}
              style={{
                ...styles.courtNpc,
                ...position,
                height: position.height,
                opacity: completedCases.includes(npcId) ? 0.5 : 1,
              }}
              onClick={() => handleNpcClick(npcId)}
              onMouseOver={(e) => !completedCases.includes(npcId) && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img
                src={courtCases[npcId].npcImage}
                alt={npcId}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* Progress Circles */}
      {currentScene === 'court' && (
        <div style={styles.progressContainer}>
          {['npc2', 'npc3', 'npc4'].map((npcId, index) => (
            <div
              key={npcId}
              style={{
                ...styles.progressCircle,
                ...(completedCases.includes(npcId) ? styles.progressCircleCompleted : {}),
              }}
            >
              {completedCases.includes(npcId) ? '✓' : '?'}
            </div>
          ))}
        </div>
      )}

      {/* Rooftop Progress Circles */}
      {currentScene === 'rooftop' && (
        <div style={styles.progressContainer}>
          {['npc5', 'npc6', 'npc7'].map((npcId, index) => (
            <div
              key={npcId}
              style={{
                ...styles.progressCircle,
                ...(rooftopCompletedTasks.includes(npcId) ? styles.progressCircleCompleted : {}),
              }}
            >
              {rooftopCompletedTasks.includes(npcId) ? '✓' : '?'}
            </div>
          ))}
        </div>
      )}

      {/* Case Modal */}
      {selectedNpc && (
        <div
          style={{
            ...styles.caseModal,
            ...(caseStep === 1 ? styles.caseModalStep1 : styles.caseModalStep2),
          }}
        >
          <button style={styles.closeButton} onClick={closeCaseModal}>
            ×
          </button>

          {caseStep === 1 ? (
            // Step 1: Event Description
            <>
              <div style={styles.caseTitle}>
                {courtCases[selectedNpc].eventDescription}
              </div>
              <img
                src={courtCases[selectedNpc].gif}
                alt="Case Event"
                style={styles.caseGif}
              />
              <button
                style={styles.nextButton}
                onClick={handleNextStep}
                onMouseOver={(e) => (e.target.style.background = '#555')}
                onMouseOut={(e) => (e.target.style.background = '#333')}
              >
                NEXT
              </button>
            </>
          ) : (
            // Step 2: NPC Statement
            <div style={styles.step2Container}>
              <img
                src={courtCases[selectedNpc].npcImage}
                alt={selectedNpc}
                style={styles.step2Npc}
              />
              <div style={styles.step2Content}>
                <div>
                  <div style={styles.npcStatement}>
                    {courtCases[selectedNpc].statement}
                  </div>
                  <div style={styles.npcClaim}>
                    <strong>NPC Statement:</strong><br />
                    {courtCases[selectedNpc].claim}
                  </div>
                </div>
                <div style={styles.judgmentButtons}>
                  <button
                    style={styles.approvedButton}
                    onClick={() => handleJudgment('accepted')}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <img
                      src="/desert/icon/correct.png"
                      alt="Approved"
                      style={styles.judgmentIcon}
                    />
                    <div style={styles.judgmentLabel}>APPROVED</div>
                  </button>
                  <button
                    style={styles.rejectedButton}
                    onClick={() => handleJudgment('rejected')}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <img
                      src="/desert/icon/wrong.png"
                      alt="Rejected"
                      style={styles.judgmentIcon}
                    />
                    <div style={styles.judgmentLabel}>REJECTED</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stamp Overlay */}
      {showStamp && (
        <img
          src={`/glacier/icon/${stampType}.png`}
          alt={stampType}
          style={styles.stampOverlay}
        />
      )}

      {/* Summary Dialogue System */}
      {showSummaryDialogue && (
        <div 
          style={{
            ...styles.insideDialogueContainer, // Use the proper dialogue container with white background
            ...getDialoguePosition(),
          }}
        >
          {/* Summary Dialogue History */}
          <div style={styles.dialogueHistory}>
            {summaryDialogueHistory.map((dialogue, index) => (
              <div 
                key={index}
                style={{
                  ...styles.dialogueMessage,
                  ...(dialogue.speaker === 'momo' ? styles.momoMessage : styles.userMessage),
                }}
              >
                <div style={styles.dialogueText}>
                  {dialogue.speaker === 'momo' ? renderTextWithBold(dialogue.text) : dialogue.text}
                </div>
              </div>
            ))}
          </div>

          {/* Current Summary Dialogue */}
          {summaryDialogueSequence[summaryDialogueIndex] && 
           summaryDialogueSequence[summaryDialogueIndex].speaker !== 'quiz' && 
           !summaryDialogueSequence[summaryDialogueIndex].isButton && (
            <div style={styles.currentDialogue}>
              <div style={styles.dialogueText}>
                {renderTextWithBold(summaryDisplayedText)}
                {summaryIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
              </div>
              
              {!summaryWaitingForInput && !summaryDialogueSequence[summaryDialogueIndex].showUserButton && (
                <div style={styles.dialogueButtons}>
                  <button 
                    style={styles.dialogueButton}
                    onClick={handleSummarySkip}
                    onMouseOver={(e) => e.target.style.background = '#555'}
                    onMouseOut={(e) => e.target.style.background = '#333'}
                  >
                    SKIP
                  </button>
                  <button 
                    style={styles.dialogueButton}
                    onClick={handleSummaryContinue}
                    onMouseOver={(e) => e.target.style.background = '#555'}
                    onMouseOut={(e) => e.target.style.background = '#333'}
                  >
                    CONTINUE
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Summary User Choice Buttons */}
          {summaryWaitingForInput && summaryDialogueSequence[summaryDialogueIndex + 1] && 
           summaryDialogueSequence[summaryDialogueIndex + 1].isButton && (
            <button 
              style={styles.userChoiceButton}
              onClick={() => handleSummaryUserChoice(summaryDialogueSequence[summaryDialogueIndex + 1].text)}
              onMouseOver={(e) => e.target.style.background = '#ff9fb0'}
              onMouseOut={(e) => e.target.style.background = '#FFBBC4'}
            >
              {summaryDialogueSequence[summaryDialogueIndex + 1].text}
            </button>
          )}

          {/* Quiz Options */}
          {summaryWaitingForInput && summaryDialogueSequence[summaryDialogueIndex + 1] && 
           summaryDialogueSequence[summaryDialogueIndex + 1].speaker === 'quiz' && (
            <div style={styles.quizOptions}>
              {summaryDialogueSequence[summaryDialogueIndex + 1].options.map((option, index) => (
                <button
                  key={index}
                  style={styles.quizOption}
                  onClick={() => handleSummaryQuizChoice(option)}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(81, 112, 255, 0.2)'
                    e.target.style.transform = 'scale(1.02)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(81, 112, 255, 0.1)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Elevator Arrow */}
      {showElevatorArrow && currentScene === 'inside' && (
        <div 
          style={styles.elevatorArrow}
          onClick={handleElevatorArrowClick}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img 
            src="/glacier/icon/arrow3.png"
            alt="Elevator Arrow"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Rooftop NPC 5 */}
      {currentScene === 'rooftop' && (
        <div 
          style={styles.npc5}
          onClick={handleNpc5Click}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img 
            src="/glacier/npc/npc5.png"
            alt="NPC 5"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Rooftop NPC 6 */}
      {currentScene === 'rooftop' && (
        <div 
          style={styles.npc6}
          onClick={handleNpc6Click}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img 
            src="/glacier/npc/npc6.png"
            alt="NPC 6"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* NPC 5 Dialogue */}
      {showNpc5Dialogue && (
        <div style={styles.npc5DialogueContainer}>
          {/* Completion message */}
          {npc5DialogueIndex === -1 ? (
            <>
              <div style={{ marginBottom: '15px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  Oh, hello again! You know, my brain feels... awake.
                </div>
              </div>
              <button 
                style={styles.npc5ContinueButton}
                onClick={() => setShowNpc5Dialogue(false)}
                onMouseOver={(e) => e.target.style.background = '#333'}
                onMouseOut={(e) => e.target.style.background = '#000'}
              >
                CLOSE
              </button>
            </>
          ) : (
            <>
              {/* Current NPC5 Dialogue or User Button */}
              <div style={{ marginBottom: '15px', flex: 1 }}>
                {npc5DialogueIndex < npc5DialogueSequence.length && !npc5DialogueSequence[npc5DialogueIndex].isButton && (
                  <div style={styles.dialogueText}>
                    {npc5DialogueSequence[npc5DialogueIndex].text}
                  </div>
                )}

                {npc5DialogueIndex < npc5DialogueSequence.length && npc5DialogueSequence[npc5DialogueIndex].isButton && (
                  <button 
                    style={styles.userChoiceButton}
                    onClick={() => handleNpc5UserChoice(npc5DialogueSequence[npc5DialogueIndex].text)}
                    onMouseOver={(e) => e.target.style.background = '#ff9fb0'}
                    onMouseOut={(e) => e.target.style.background = '#FFBBC4'}
                  >
                    {npc5DialogueSequence[npc5DialogueIndex].text}
                  </button>
                )}
              </div>

              {/* Continue Button - only show if NOT noContinue and NOT isButton */}
              {npc5DialogueIndex < npc5DialogueSequence.length && 
               !npc5DialogueSequence[npc5DialogueIndex].isButton && 
               !npc5DialogueSequence[npc5DialogueIndex].noContinue && (
                <button 
                  style={styles.npc5ContinueButton}
                  onClick={() => handleNpc5UserChoice(npc5DialogueSequence[npc5DialogueIndex].text)}
                  onMouseOver={(e) => e.target.style.background = '#333'}
                  onMouseOut={(e) => e.target.style.background = '#000'}
                >
                  CONTINUE
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* NPC 6 Dialogue */}
      {showNpc6Dialogue && (
        <div style={styles.npc6DialogueContainer}>
          {/* Completion message */}
          {npc6DialogueIndex === -1 ? (
            <>
              <div style={{ marginBottom: '15px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  Thank you... I can feel it coming back. The spark. The vision. My hands remember now.
                </div>
              </div>
              <button 
                style={styles.npc6ContinueButton}
                onClick={() => setShowNpc6Dialogue(false)}
                onMouseOver={(e) => e.target.style.background = '#333'}
                onMouseOut={(e) => e.target.style.background = '#000'}
              >
                CLOSE
              </button>
            </>
          ) : (
            <>
              {/* Current NPC6 Dialogue or User Button */}
              <div style={{ marginBottom: '15px', flex: 1 }}>
                {npc6DialogueIndex < npc6DialogueSequence.length && !npc6DialogueSequence[npc6DialogueIndex].isButton && (
                  <div style={styles.dialogueText}>
                    {npc6DialogueSequence[npc6DialogueIndex].text}
                  </div>
                )}

                {npc6DialogueIndex < npc6DialogueSequence.length && npc6DialogueSequence[npc6DialogueIndex].isButton && (
                  <button 
                    style={styles.userChoiceButton}
                    onClick={handleNpc6UserChoice}
                    onMouseOver={(e) => e.target.style.background = '#ff9fb0'}
                    onMouseOut={(e) => e.target.style.background = '#FFBBC4'}
                  >
                    {npc6DialogueSequence[npc6DialogueIndex].text}
                  </button>
                )}
              </div>

              {/* Continue Button */}
              {npc6DialogueIndex < npc6DialogueSequence.length && 
               !npc6DialogueSequence[npc6DialogueIndex].isButton && (
                <button 
                  style={styles.npc6ContinueButton}
                  onClick={handleNpc6UserChoice}
                  onMouseOver={(e) => e.target.style.background = '#333'}
                  onMouseOut={(e) => e.target.style.background = '#000'}
                >
                  CONTINUE
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Creativity Challenge */}
      {showCreativityChallenge && (
        <div style={styles.creativityContainer}>
          <div style={styles.creativityTimer}>
            {formatTimer(challengeTimer)}
          </div>
          
          <div style={styles.creativityTitle}>
            {creativityChallenges[currentChallenge].title}
          </div>
          
          <div style={styles.creativityTagsContainer}>
            {userInputs.map((input, index) => (
              <div key={index} style={styles.creativityTag}>
                {input}
              </div>
            ))}
          </div>
          
          <div style={styles.creativityInputContainer}>
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleChallengeSubmit()
                }
              }}
              placeholder="Type… and Enter"
              style={styles.creativityInput}
              autoFocus
            />
            <button
              style={styles.creativitySendButton}
              onClick={handleChallengeSubmit}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              <img 
                src="/glacier/icon/send.png"
                alt="Send"
                style={styles.creativitySendIcon}
              />
            </button>
          </div>
        </div>
      )}

      {/* Puzzle Interface */}
      {showPuzzle && (
        <div style={styles.puzzleContainer}>
          <div style={styles.puzzleTimer}>
            {formatTimer(puzzleTimer)}
          </div>
          
          <div style={styles.puzzleTitle}>
            {puzzleData[currentPuzzle].title}
          </div>
          
          <div style={styles.puzzleContent}>
            <div style={styles.puzzleImageContainer}>
              <img 
                src={puzzleData[currentPuzzle].image}
                alt={`Puzzle ${currentPuzzle}`}
                style={styles.puzzleImage}
              />
            </div>
            
            <div style={styles.puzzleTextContainer}>
              <div>
                {puzzleData[currentPuzzle].statement && (
                  <div style={styles.puzzleStatement}>
                    NPC 5: "{puzzleData[currentPuzzle].statement}"
                  </div>
                )}
                
                {puzzleData[currentPuzzle].premise && (
                  <div style={styles.puzzleStatement}>
                    Premise:<br />
                    {puzzleData[currentPuzzle].premise}
                  </div>
                )}
                
                {puzzleData[currentPuzzle].arguments && (
                  <div style={styles.puzzleStatement}>
                    Arguments:<br />
                    {puzzleData[currentPuzzle].arguments}
                  </div>
                )}
                
                <div style={styles.puzzleQuestion}>
                  Question: {puzzleData[currentPuzzle].question}
                </div>
              </div>
              
              <div style={styles.puzzleOptions}>
                {puzzleData[currentPuzzle].options.map((option, index) => {
                  // Determine style based on selection
                  let optionStyle = styles.puzzleOption
                  if (selectedAnswer === index) {
                    if (option.correct) {
                      optionStyle = { ...styles.puzzleOption, ...styles.puzzleOptionCorrect }
                    } else {
                      optionStyle = { ...styles.puzzleOption, ...styles.puzzleOptionWrong }
                    }
                  }
                  
                  return (
                    <button
                      key={index}
                      style={optionStyle}
                      onClick={() => handlePuzzleAnswer(option, index)}
                      onMouseOver={(e) => {
                        if (selectedAnswer === null) {
                          e.target.style.background = 'rgba(81, 112, 255, 0.4)'
                          e.target.style.transform = 'scale(1.02)'
                        }
                      }}
                      onMouseOut={(e) => {
                        if (selectedAnswer === null) {
                          e.target.style.background = 'rgba(81, 112, 255, 0.2)'
                          e.target.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      {option.text}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {showArrow && currentScene !== 'court' && currentScene !== 'rooftop' && (
        <div 
          style={{
            ...(currentScene === 'outside' ? styles.arrowSmall : 
                currentScene === 'inside' ? { ...styles.arrow, width: '380px', height: '380px' } : styles.arrow),
            ...getArrowPosition(),
          }}
          onClick={handleArrowClick}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img 
            src={getArrowImage()}
            alt="Arrow"
            style={styles.arrowImage}
          />
        </div>
      )}
    </div>
  )
}

export default GlacierMap