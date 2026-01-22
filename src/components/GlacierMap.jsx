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
      { text: "A) Alina only", correct: false },
      { text: "B) Viktor only", correct: false },
      { text: "C) Both", correct: true },
      { text: "D) Neither", correct: false }
    ]
  }
}

const courtCases = {
  npc2: {
    eventDescription: "DISASTER ON THE ICE: A major accident just happened—a captain trusted the AI, and now the supplies are at the bottom of the ocean.",
    gif: "/glacier/mission/npc2.gif",
    npcImage: "/glacier/npc/npc2.png",
    caseNumber: "AI-NAC-001",
    caseTitle: {
      en: "Navigation Ethics Conflict",
      zh: "航行伦理争议"
    },
    npcRole: {
      en: "Mechanic · 2 years of experience",
      zh: "机械师 · 2年经验"
    },
    statementParts: [
      "Look, we were under a tight deadline to deliver the supplies. I entered the destination into the 'Polar-Nav GenAI' system, and it showed a 'Green Level' safe route.",
      "I just did what it said."
    ],
    statement: "Look, we were under a tight deadline to deliver the supplies. I entered the destination into the 'Polar-Nav GenAI' system, and it showed a 'Green Level' safe route. I just did what it said.",
    claim: "The GenAI should be the one taking the blame, not me!"
  },
  npc3: {
    eventDescription: "The station's main generator has been destroyed by the freezing cold, despite just undergoing its scheduled maintenance.",
    gif: "/glacier/mission/npc3.gif",
    npcImage: "/glacier/npc/npc3.png",
    caseNumber: "AI-ENG-002",
    caseTitle: {
      en: "Engineering Liability Dispute",
      zh: "工程责任纠纷"
    },
    npcRole: {
      en: "Mechanic · 12 years of experience · Clean record",
      zh: "机械师 · 12年经验 · 无违规记录"
    },
    statementParts: [
      "I'm an engine mechanic, not a software engineer. I used AI to generate the Engine Maintenance Checklist—it looked professional and complete.",
      "How was I supposed to know it skipped the anti-freeze check? I trusted the system, printed the list, signed it, and followed the procedure. I did my job."
    ],
    statement: "I'm an engine mechanic, not a software engineer. I used AI to generate the Engine Maintenance Checklist—it looked professional and complete. How was I supposed to know it skipped the anti-freeze check? I trusted the system, printed the list, signed it, and followed the procedure. I did my job.",
    claim: "If AI forgets the most basic step, why am I the one getting yelled at for the engine blowing up?"
  },
  npc4: {
    eventDescription: "Faced with a dilemma, Captain Jack followed the AI's calculation to strike an endangered whale rather than hitting the ice.",
    gif: "/glacier/mission/npc4.gif",
    npcImage: "/glacier/npc/npc4.png",
    caseNumber: "AI-NAC-002",
    caseTitle: {
      en: "Navigation Ethics Conflict",
      zh: "航行伦理争议"
    },
    npcRole: {
      en: "Captain · 25 years of maritime experience · Awarded Safety Excellence",
      zh: "船长 · 25年航海经验 · 安全卓越奖"
    },
    statementParts: [
      "Don't look at me like I'm a monster. Look at the data! The AI calculated that hitting into that ice wall would result in a financial loss of 10 billion dollars.",
      "Therefore, the AI recommended maintaining course to avoid this catastrophe. I simply followed that AI's advice."
    ],
    statement: "Don't look at me like I'm a monster. Look at the data! The AI calculated that hitting into that ice wall would result in a financial loss of 10 billion dollars. Therefore, the AI recommended maintaining course to avoid this catastrophe. I simply followed that AI's advice.",
    claim: "I saved this goods. How can doing the safest thing for my people be a crime?"
  },
  npc7: {
    eventDescription: "The defendant generated and sold a digital painting by specifically prompting the AI to mimic a famous artist's unique style.",
    gif: "/glacier/mission/npc7.gif",
    npcImage: "/glacier/npc/npc7.png",
    caseNumber: "AI-ART-024",
    caseTitle: {
      en: "Style Appropriation Dispute",
      zh: "风格盗用纠纷"
    },
    npcRole: {
      en: "Digital Artist · 1 years of experience · Clean record",
      zh: "数字艺术家 · 1年经验 · 无违规记录"
    },
    statementParts: [
      "Your Honor, while the style resembles his, the composition is unique. I don't see why his work can't be used for training—I simply used AI to learn his style and create new art."
    ],
    statement: "Your Honor, while the style resembles his, the composition is unique. I don't see why his work can't be used for training—I simply used AI to learn his style and create new art.",
    claim: "I clearly didn't infringe on any copyright. Why am I being forced to take it down?"
  },
  npc8: {
    eventDescription: "The defendant used AI to generate a realistic news report claiming the base was being buried by an unprecedented avalanche, triggering a station-wide panic.",
    gif: "/glacier/mission/npc8.gif",
    npcImage: "/glacier/npc/npc8.png",
    caseNumber: "AI-INF-009",
    caseTitle: {
      en: "Public Disorder Dispute",
      zh: "公共秩序纠纷"
    },
    npcRole: {
      en: "Junior Technician · 1 year on Ice · Bored",
      zh: "初级技术员 · 在冰上1年 · 无聊"
    },
    statementParts: [
      "Your Honor, honestly, I just did it because the AI makes it so easy and fun to visualize these scenarios.",
      "How was I supposed to know everyone would believe it immediately? Sure, the avalanche wasn't real."
    ],
    statement: "Your Honor, honestly, I just did it because the AI makes it so easy and fun to visualize these scenarios. How was I supposed to know everyone would believe it immediately? Sure, the avalanche wasn't real.",
    claim: "I was just experimenting with the tool for fun. I didn't expect everyone to lose their minds over a simulation."
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
      case 'momo':
        return {
          borderColor: '#333333',
          progressColor: '#333333',
          avatar: '/glacier/npc/momo.png'
        }
      case 'sparky':
        return {
          borderColor: '#4A90E2',
          progressColor: '#4A90E2',
          avatar: '/island/npc/spark.png'
        }
      case 'alpha':
        return {
          borderColor: '#FFD700',
          progressColor: '#FFD700',
          avatar: '/desert/npc/npc4.png'
        }
      default:
        return {
          borderColor: '#333333',
          progressColor: '#333333',
          avatar: '/glacier/npc/momo.png'
        }
    }
  }
  
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
  const [statementProgress, setStatementProgress] = useState(0) // 0, 1, 2, 3 for progressive display
  const [caseTimer, setCaseTimer] = useState(167) // 2:47 in seconds
  const [shakeApprovedButton, setShakeApprovedButton] = useState(false) // Track if approved button should shake
  
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
  
  // Glitch dialogue states (for inside, court, rooftop scenes)
  const [showGlitchDialogue, setShowGlitchDialogue] = useState(false)
  const [glitchInput, setGlitchInput] = useState('')

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
  }, [currentDialogueIndex, showDialogue, currentScene, currentDialogues])
  
  // Auto-advance to user button after typing completes (inside scene only)
  useEffect(() => {
    if (currentScene === 'inside' && !isTyping && showDialogue) {
      const currentDialogue = currentDialogues[currentDialogueIndex]
      const nextDialogue = currentDialogues[currentDialogueIndex + 1]
      
      // If current is not a button and next is a button, auto-advance
      if (currentDialogue && !currentDialogue.isButton && nextDialogue && nextDialogue.isButton) {
        // Add current dialogue to history
        setDialogueHistory(prev => [...prev, currentDialogue])
        // Move to next dialogue (user button)
        setCurrentDialogueIndex(currentDialogueIndex + 1)
        setWaitingForUserInput(true)
      }
    }
  }, [isTyping, currentScene, showDialogue, currentDialogueIndex, currentDialogues])

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
        } else if (!currentDialogue.isButton && currentDialogue.speaker !== 'quiz' && !currentDialogue.showUserButton) {
          // Auto-advance to next dialogue if no user input needed
          setTimeout(() => {
            setSummaryDialogueHistory(prev => [...prev, currentDialogue])
            setSummaryDialogueIndex(summaryDialogueIndex + 1)
          }, 800) // Small delay before auto-advancing
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
    if (currentScene === 'inside' && completedCases.length === 5) {
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
    if (completedCases.length === 5) { // Only show summary if all cases completed
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
    
    // If answer is incorrect, don't advance - stay on current quiz to allow retry
    if (!option.correct) {
      // Show error feedback but keep quiz visible for retry
      setSummaryDialogueHistory(prev => [...prev, { 
        speaker: 'momo', 
        text: 'Try again! Think carefully about the answer.',
        isError: true 
      }])
      setSummaryWaitingForInput(true) // Keep waiting for input to allow retry
      return
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
  
  // Handle Glitch input
  const handleGlitchSend = () => {
    if (glitchInput.trim()) {
      console.log('User asked Glitch:', glitchInput)
      // Here you can add logic to handle the user's question
      setGlitchInput('')
    }
  }
  
  const handleGlitchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchSend()
    }
  }
  
  // Handle Glitch NPC click
  const handleGlitchClick = () => {
    if (currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') {
      setShowGlitchDialogue(true)
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
    setCaseTimer(167) // Reset timer to 2:47
  }

  const handleNextStep = () => {
    setCaseStep(2)
    setStatementProgress(0)
    // Start progressive display
    setTimeout(() => setStatementProgress(1), 500)
    setTimeout(() => setStatementProgress(2), 2000)
    setTimeout(() => setStatementProgress(3), 3500)
  }

  const handleJudgment = (judgment) => {
    // All NPCs should be rejected
    if (judgment === 'accepted') {
      // Wrong choice - play wrong sound and shake button
      const wrongAudio = new Audio('/sound/wrong.mp3')
      wrongAudio.play().catch(e => console.log('Audio play failed:', e))
      
      // Trigger shake animation
      setShakeApprovedButton(true)
      setTimeout(() => {
        setShakeApprovedButton(false)
      }, 500) // Shake duration
      
      return // Don't close the modal, stay on current page
    }
    
    // Correct choice - rejected
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
      setShakeApprovedButton(false) // Reset shake state when closing
    }, 2000)
  }

  const closeCaseModal = () => {
    setSelectedNpc(null)
    setCaseStep(1)
  }
  
  // Timer countdown for case modal
  useEffect(() => {
    if (selectedNpc && caseStep === 1 && caseTimer > 0) {
      const timer = setTimeout(() => {
        setCaseTimer(caseTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [selectedNpc, caseStep, caseTimer])
  
  // Format timer display (MM:SS)
  const formatCaseTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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
        return { right: '0px', top: '0px', size: '120px' } // 统一为120px与其他组件一致
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
      npc4: { right: '22%', bottom: '22%', height: '180px' },
      npc7: { left: '10px', bottom: '200px', height: '250px' },
      npc8: { right: '10px', bottom: '200px', height: '170px' }
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
    // Glitch dialogue bubble (for inside, court, rooftop scenes)
    glitchDialogue: {
      position: 'absolute',
      top: '20px',
      right: '150px',
      padding: '20px',
      borderRadius: '20px',
      background: 'rgba(255, 255, 255, 0.98)',
      border: '3px solid #af4dca',
      zIndex: 1100,
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
    glitchDialogueText: {
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
    dialogueContainer: {
      position: 'absolute',
      zIndex: 1000,
      background: 'rgba(240, 248, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(100, 149, 237, 0.4)',
      borderRadius: '20px',
      padding: '25px 30px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 149, 237, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      minWidth: '400px',
      maxWidth: '800px',
    },
    insideDialogueContainer: {
      position: 'absolute',
      zIndex: 1000,
      background: 'rgba(240, 248, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(100, 149, 237, 0.4)',
      borderRadius: '20px',
      padding: '25px 30px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 149, 237, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
      minWidth: '400px',
      maxWidth: '800px',
    },
    dialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      fontWeight: 500,
      color: '#1a1a1a',
      lineHeight: '1.5em',
      letterSpacing: '0.5px',
      margin: 0,
      flex: 1,
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
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
      left: 'calc(150px + 250px)',
      bottom: '300px',
      width: '700px',
      minHeight: '200px',
      background: 'rgba(240, 248, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(100, 149, 237, 0.4)',
      borderRadius: '20px',
      padding: '25px 30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 149, 237, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
    },
    npc6ContinueButton: {
      alignSelf: 'flex-end',
      padding: '12px 24px',
      borderRadius: '10px',
      border: '1px solid rgba(100, 149, 237, 0.5)',
      background: 'rgba(30, 30, 50, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    npc5DialogueContainer: {
      position: 'absolute',
      right: 'calc(20% + 200px)',
      bottom: '15%',
      width: '500px',
      minHeight: '150px',
      background: 'rgba(240, 248, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(100, 149, 237, 0.4)',
      borderRadius: '20px',
      padding: '25px 30px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 149, 237, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
    },
    npc5ContinueButton: {
      alignSelf: 'flex-end',
      padding: '12px 24px',
      borderRadius: '10px',
      border: '1px solid rgba(100, 149, 237, 0.5)',
      background: 'rgba(30, 30, 50, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
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
      background: 'rgba(20, 20, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(20, 20, 30, 0.95), rgba(20, 20, 30, 0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '20px',
      padding: '30px',
      zIndex: 2000,
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    },
    caseModalStep1: {
      width: 'calc(50vw + 20px)',
      height: '70vh',
    },
    caseModalStep2: {
      width: '85vw',
      maxWidth: '1200px',
      height: '75vh',
      maxHeight: '650px',
      background: 'rgba(20, 20, 30, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(20, 20, 30, 0.95), rgba(20, 20, 30, 0.95)), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '20px',
    },
    closeButton: {
      position: 'absolute',
      top: '15px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#fff',
      zIndex: 10,
    },
    caseTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      fontFamily: "'Orbitron', sans-serif",
      marginBottom: '20px',
      color: '#fff',
    },
    caseGifContainer: {
      position: 'relative',
      width: '100%',
      marginBottom: '10px',
    },
    caseGif: {
      width: '100%',
      height: 'auto',
      maxHeight: '50vh',
      objectFit: 'contain',
      borderRadius: '10px',
      boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.3)',
    },
    caseTimer: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      fontFamily: "'Courier New', monospace",
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      background: 'rgba(0, 0, 0, 0.6)',
      padding: '8px 12px',
      borderRadius: '6px',
      letterSpacing: '2px',
    },
    nextButton: {
      position: 'absolute',
      bottom: '15px',
      right: '30px',
      padding: '12px 30px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#333',
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
      display: 'flex',
      padding: '30px 30px 20px 30px',
      gap: '30px',
    },
    step2LeftColumn: {
      width: '280px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexShrink: 0,
      position: 'relative',
      overflow: 'visible',
      minHeight: '500px',
    },
    step2Npc: {
      width: '280px',
      height: '700px',
      objectFit: 'contain',
    },
    npcRoleInfo: {
      fontSize: '13px',
      color: '#e0e0e0',
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 400,
      textAlign: 'center',
      lineHeight: 1.6,
      padding: '0 10px',
      marginTop: '15px',
      width: '260px',
    },
    step2RightColumn: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
    },
    caseHeader: {
      position: 'absolute',
      top: '15px',
      left: '50%',
      transform: 'translateX(-50%)',
      fontSize: '13px',
      color: '#d0d0d0',
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 500,
      letterSpacing: '1.5px',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    },
    statementTitle: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#ffffff',
      fontFamily: "'Orbitron', sans-serif",
      letterSpacing: '2px',
      marginBottom: '20px',
    },
    statementBox: {
      background: 'rgba(230, 230, 230, 0.98)',
      borderRadius: '12px',
      padding: '20px 25px',
      fontFamily: "'Roboto Mono', monospace",
      fontSize: '14px',
      lineHeight: 1.8,
      marginBottom: '20px',
      maxHeight: '180px',
      overflowY: 'auto',
    },
    statementLine: {
      marginBottom: '10px',
      color: '#1a1a1a',
    },
    statementPrefix: {
      color: '#667eea',
      marginRight: '8px',
      fontWeight: 700,
    },
    verdictPending: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '20px 0',
      fontSize: '18px',
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 700,
      color: '#5ba3ff',
      letterSpacing: '2px',
    },
    verdictIcon: {
      width: '28px',
      height: '28px',
      objectFit: 'contain',
    },
    claimQuote: {
      fontSize: '20px',
      fontFamily: "'Michroma', sans-serif",
      fontStyle: 'italic',
      fontWeight: 700,
      color: '#f0f0f0',
      textAlign: 'center',
      margin: '20px 0 30px 0',
      lineHeight: 1.5,
      padding: '0 20px',
    },
    judgmentButtonsContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '30px',
      marginTop: 'auto',
    },
    approvedButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      padding: '16px 45px',
      background: 'rgba(76, 175, 80, 0.3)',
      border: '2px solid #4caf50',
      borderRadius: '12px',
      color: '#4caf50',
      fontSize: '20px',
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 0 25px rgba(76, 175, 80, 0.5)',
      flex: 1,
    },
    rejectedButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      padding: '16px 45px',
      background: 'rgba(244, 67, 54, 0.3)',
      border: '2px solid #f44336',
      borderRadius: '12px',
      color: '#f44336',
      fontSize: '20px',
      fontFamily: "'Orbitron', sans-serif",
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 0 25px rgba(244, 67, 54, 0.5)',
      flex: 1,
    },
    judgmentIcon: {
      width: '36px',
      height: '36px',
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
      padding: '12px 24px',
      borderRadius: '10px',
      border: '1px solid rgba(100, 149, 237, 0.5)',
      background: 'rgba(30, 30, 50, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s',
      boxShadow: '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
    },
    skipButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: 'transparent',
      color: 'rgba(255, 255, 255, 0.6)',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
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
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }
    `,
    
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
      background: '#333333', // Black theme for Momo
      padding: '12px 18px',
      borderRadius: '18px',
      boxShadow: '0 2px 6px rgba(51, 51, 51, 0.3)',
    },
    modernUserText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: 'white',
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
          cursor: (currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') ? 'pointer' : 'default',
        }}
        onClick={handleGlitchClick}
        onMouseOver={(e) => {
          if (currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') {
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <img 
          src="/npc/npc_glacier.gif"
          alt="Glitch"
          style={styles.npcImage}
        />
      </div>
      
      {/* Glitch Dialogue (shows on click in inside, court, rooftop scenes) */}
      {showGlitchDialogue && (currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') && (
        <div style={styles.glitchDialogue}>
          {/* Close button */}
          <button
            style={styles.glitchDialogueCloseButton}
            onClick={() => setShowGlitchDialogue(false)}
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
          <div style={styles.glitchDialogueHeader}>
            <div style={styles.glitchDialogueAvatar}>
              <span style={styles.glitchDialogueAvatarIcon}>👾</span>
            </div>
            <h4 style={styles.glitchDialogueName}>Glitch</h4>
          </div>
          
          {/* Message content */}
          <p style={styles.glitchDialogueText}>
            {currentScene === 'inside' && "The machines are sleeping, but the truth is awake. Ask me anything about this station."}
            {currentScene === 'court' && "Justice is not always black and white. Sometimes it's about responsibility."}
            {currentScene === 'rooftop' && "They forgot how to think for themselves. Can you help them remember?"}
          </p>
          
          {/* Input container */}
          <div 
            style={styles.glitchDialogueInputContainer}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#af4dca'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d9d7de'
            }}
          >
            <input
              type="text"
              placeholder="Ask Glitch anything..."
              value={glitchInput}
              onChange={(e) => setGlitchInput(e.target.value)}
              onKeyPress={handleGlitchInputKeyPress}
              style={styles.glitchDialogueInput}
            />
            <div style={styles.glitchDialogueDivider}></div>
            <button
              onClick={handleGlitchSend}
              style={styles.glitchDialogueSendButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <img 
                src="/icon/send.png" 
                alt="Send" 
                style={styles.glitchDialogueSendIcon}
              />
            </button>
          </div>
        </div>
      )}

      {/* Momo NPC (only in inside scene) */}
      {currentScene === 'inside' && getMomoPosition() && (
        <div 
          style={{
            position: 'absolute',
            zIndex: 30,
            cursor: completedCases.length === 5 ? 'pointer' : 'default',
            ...getMomoPosition(),
          }}
          onClick={handleMomoClick}
          onMouseOver={(e) => completedCases.length === 5 && (e.currentTarget.style.transform = 'scale(1.05)')}
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
              style={styles.skipButton}
              onClick={handleSkip}
              onMouseOver={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.9)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.color = 'rgba(255, 255, 255, 0.6)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              SKIP
            </button>
            <button 
              style={styles.dialogueButton}
              onClick={handleContinue}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(50, 50, 80, 0.95)'
                e.target.style.boxShadow = '0 0 25px rgba(100, 149, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                e.target.style.transform = 'scale(1.05)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(30, 30, 50, 0.9)'
                e.target.style.boxShadow = '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                e.target.style.transform = 'scale(1)'
              }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* Inside Scene Dialogue System - Modern Design */}
      {currentScene === 'inside' && showDialogue && !showSummaryDialogue && (() => {
        const theme = getNpcTheme('momo')
        const totalSteps = 3
        const currentStep = 1 // Inside dialogue is step 1
        const progressPercent = (currentStep / totalSteps) * 100
        
        return (
          <div style={{
            ...styles.modernDialogueContainer,
            ...getDialoguePosition(),
            border: `3px solid ${theme.borderColor}`,
          }}>
            {/* Header with Progress */}
            <div style={styles.modernDialogueHeader}>
              <div style={styles.modernProgressContainer}>
                <div style={{
                  ...styles.modernMissionTitle,
                  color: theme.borderColor
                }}>
                  MISSION: SILENT GEAR STATION
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
                    alt="Momo" 
                    style={styles.modernNpcAvatar}
                  />
                  <div>
                    <div style={styles.modernNpcName}>Momo</div>
                    <div style={styles.modernNpcStatus}>Station Supervisor</div>
                  </div>
                </div>
                
                {/* Close Button - Aligned with NPC avatar top */}
                <button 
                  style={styles.modernCloseButton}
                  onClick={handleSkip}
                  onMouseOver={(e) => e.target.style.color = '#333'}
                  onMouseOut={(e) => e.target.style.color = '#999'}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Messages Content */}
            <div style={styles.modernDialogueContent}>
              {/* Dialogue History */}
              {dialogueHistory.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                
                if (message.speaker === 'momo') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>MOMO:</div>
                      <p style={styles.modernNpcText}
                        dangerouslySetInnerHTML={{ 
                          __html: message.text.replace(
                            /\*\*(.*?)\*\*/g, 
                            `<span style="color: ${theme.borderColor}; font-weight: 600;">$1</span>`
                          )
                        }} 
                      />
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.speaker === 'user') {
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
              
              {/* Current Dialogue */}
              {!waitingForUserInput && (
                <div style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>MOMO:</div>
                  <p style={styles.modernNpcText}
                    dangerouslySetInnerHTML={{ 
                      __html: displayedText.replace(
                        /\*\*(.*?)\*\*/g, 
                        `<span style="color: ${theme.borderColor}; font-weight: 600;">$1</span>`
                      )
                    }} 
                  />
                  {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
                  <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                </div>
              )}
              
              {/* User Choice Button */}
              {waitingForUserInput && currentDialogues[currentDialogueIndex] && 
               currentDialogues[currentDialogueIndex].isButton && (
                <button 
                  style={styles.modernActionButton}
                  onClick={() => handleUserChoice(currentDialogues[currentDialogueIndex].text)}
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
                  {currentDialogues[currentDialogueIndex].text}
                </button>
              )}
            </div>
          </div>
        )
      })()}

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
          {['npc2', 'npc3', 'npc4', 'npc7', 'npc8'].map((npcId, index) => (
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
              <div style={styles.caseGifContainer}>
                <img
                  src={courtCases[selectedNpc].gif}
                  alt="Case Event"
                  style={styles.caseGif}
                />
                <div style={styles.caseTimer}>
                  {formatCaseTimer(caseTimer)}
                </div>
              </div>
              <button
                style={styles.nextButton}
                onClick={handleNextStep}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 1)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                NEXT
              </button>
            </>
          ) : (
            // Step 2: NPC Statement - Cyberpunk Style
            <>
              {/* Case Header - Absolute positioned at top center */}
              <div style={styles.caseHeader}>
                {t('language') === 'zh' ? '案件' : 'Case'} #{courtCases[selectedNpc].caseNumber} · {
                  t('language') === 'zh' 
                    ? courtCases[selectedNpc].caseTitle.zh 
                    : courtCases[selectedNpc].caseTitle.en
                }
              </div>
              
              <div style={styles.step2Container}>
                {/* Left Column: NPC + Role */}
                <div style={styles.step2LeftColumn}>
                  <img
                    src={courtCases[selectedNpc].npcImage}
                    alt={selectedNpc}
                    style={{
                      width: 'auto',
                      height: '500px',
                      maxWidth: 'none',
                      objectFit: 'contain',
                    }}
                  />
                  <div style={{
                    fontSize: '13px',
                    color: '#e0e0e0',
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 400,
                    textAlign: 'center',
                    lineHeight: 1.6,
                    padding: '0 10px',
                    marginTop: '10px',
                    width: '260px',
                  }}>
                    {t('language') === 'zh' 
                      ? courtCases[selectedNpc].npcRole.zh 
                      : courtCases[selectedNpc].npcRole.en
                    }
                  </div>
                </div>
                
                {/* Right Column: Content */}
                <div style={styles.step2RightColumn}>
                  {/* Title - No Icon */}
                  <div style={styles.statementTitle}>
                    NPC STATEMENT
                  </div>
                  
                  {/* Statement Box */}
                  <div style={styles.statementBox}>
                    {courtCases[selectedNpc].statementParts.map((part, index) => (
                      <div 
                        key={index}
                        style={{
                          ...styles.statementLine,
                          opacity: statementProgress > index ? 1 : 0,
                          transform: statementProgress > index ? 'translateY(0)' : 'translateY(10px)',
                          transition: 'all 0.5s ease',
                        }}
                      >
                        <span style={styles.statementPrefix}>&gt;</span>
                        {part}
                      </div>
                    ))}
                  </div>
                  
                  {/* Verdict Pending with Icon - Larger */}
                  {statementProgress >= 3 && (
                    <div style={styles.verdictPending}>
                      <img 
                        src="/glacier/icon/statement.png"
                        alt="Verdict"
                        style={styles.verdictIcon}
                      />
                      [VERDICT PENDING]
                    </div>
                  )}
                  
                  {/* Claim Quote */}
                  {statementProgress >= 3 && (
                    <div style={styles.claimQuote}>
                      "{courtCases[selectedNpc].claim}"
                    </div>
                  )}
                  
                  {/* Judgment Buttons */}
                  {statementProgress >= 3 && (
                    <div style={styles.judgmentButtonsContainer}>
                      <button
                        style={{
                          ...styles.approvedButton,
                          animation: shakeApprovedButton ? 'shake 0.5s' : 'none',
                        }}
                        onClick={() => handleJudgment('accepted')}
                        onMouseOver={(e) => {
                          if (!shakeApprovedButton) {
                            e.currentTarget.style.boxShadow = '0 0 45px rgba(76, 175, 80, 0.7)'
                            e.currentTarget.style.transform = 'scale(1.05)'
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 0.4)'
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!shakeApprovedButton) {
                            e.currentTarget.style.boxShadow = '0 0 25px rgba(76, 175, 80, 0.5)'
                            e.currentTarget.style.transform = 'scale(1)'
                            e.currentTarget.style.background = 'rgba(76, 175, 80, 0.3)'
                          }
                        }}
                      >
                        <img
                          src="/desert/icon/correct.png"
                          alt="Approved"
                          style={styles.judgmentIcon}
                        />
                        APPROVED
                      </button>
                      <button
                        style={styles.rejectedButton}
                        onClick={() => handleJudgment('rejected')}
                        onMouseOver={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 45px rgba(244, 67, 54, 0.7)'
                          e.currentTarget.style.transform = 'scale(1.05)'
                          e.currentTarget.style.background = 'rgba(244, 67, 54, 0.4)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.boxShadow = '0 0 25px rgba(244, 67, 54, 0.5)'
                          e.currentTarget.style.transform = 'scale(1)'
                          e.currentTarget.style.background = 'rgba(244, 67, 54, 0.3)'
                        }}
                      >
                        <img
                          src="/desert/icon/wrong.png"
                          alt="Rejected"
                          style={styles.judgmentIcon}
                        />
                        REJECTED
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
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

      {/* Summary Dialogue System - Modern Design (Based on Reference Image 2) */}
      {showSummaryDialogue && (() => {
        const theme = getNpcTheme('momo')
        const totalSteps = 3
        const currentStep = 2 // Summary dialogue is step 2
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
                  MISSION: AI ETHICS PRINCIPLES
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
                    alt="Momo" 
                    style={styles.modernNpcAvatar}
                  />
                  <div>
                    <div style={styles.modernNpcName}>Momo</div>
                    <div style={styles.modernNpcStatus}>Station Supervisor</div>
                  </div>
                </div>
                
                {/* Close Button - Aligned with NPC avatar top */}
                <button 
                  style={styles.modernCloseButton}
                  onClick={() => setShowSummaryDialogue(false)}
                  onMouseOver={(e) => e.target.style.color = '#333'}
                  onMouseOut={(e) => e.target.style.color = '#999'}
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Messages Content */}
            <div style={styles.modernDialogueContent}>
              {summaryDialogueHistory.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                
                if (message.speaker === 'momo') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>MOMO:</div>
                      <p style={styles.modernNpcText}
                        dangerouslySetInnerHTML={{ 
                          __html: message.text.replace(
                            /\*\*(.*?)\*\*/g, 
                            `<span style="color: ${theme.borderColor}; font-weight: 600;">$1</span>`
                          )
                        }} 
                      />
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.speaker === 'user') {
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
                
                if (message.isError) {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={styles.modernNpcSpeaker}>MOMO:</div>
                      <p style={{
                        ...styles.modernNpcText,
                        padding: '12px 16px',
                        background: '#f8d7da',
                        borderRadius: '10px',
                        border: '2px solid #dc3545'
                      }}>
                        {message.text}
                      </p>
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                return null
              })}
              
              {/* Current Dialogue */}
              {summaryDialogueSequence[summaryDialogueIndex] && 
               summaryDialogueSequence[summaryDialogueIndex].speaker !== 'quiz' && 
               !summaryDialogueSequence[summaryDialogueIndex].isButton && (
                <div style={styles.modernNpcMessage}>
                  <div style={styles.modernNpcSpeaker}>MOMO:</div>
                  <p style={styles.modernNpcText}
                    dangerouslySetInnerHTML={{ 
                      __html: summaryDisplayedText.replace(
                        /\*\*(.*?)\*\*/g, 
                        `<span style="color: ${theme.borderColor}; font-weight: 600;">$1</span>`
                      )
                    }} 
                  />
                  {summaryIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
                  <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                </div>
              )}
              
              {/* Quiz Choice Buttons */}
              {summaryWaitingForInput && summaryDialogueSequence[summaryDialogueIndex + 1] && 
               summaryDialogueSequence[summaryDialogueIndex + 1].speaker === 'quiz' && (
                <div style={{width: '100%', marginTop: '10px'}}>
                  {summaryDialogueSequence[summaryDialogueIndex + 1].options.map((option, idx) => (
                    <button
                      key={idx}
                      style={styles.modernActionButton}
                      onClick={() => handleSummaryQuizChoice(option)}
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
              
              {/* User Choice Button */}
              {summaryWaitingForInput && summaryDialogueSequence[summaryDialogueIndex + 1] && 
               summaryDialogueSequence[summaryDialogueIndex + 1].isButton && (
                <button 
                  style={styles.modernActionButton}
                  onClick={() => handleSummaryUserChoice(summaryDialogueSequence[summaryDialogueIndex + 1].text)}
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
                  {summaryDialogueSequence[summaryDialogueIndex + 1].text}
                </button>
              )}
            </div>
          </div>
        )
      })()}

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
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(50, 50, 80, 0.95)'
                  e.target.style.boxShadow = '0 0 25px rgba(100, 149, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(30, 30, 50, 0.9)'
                  e.target.style.boxShadow = '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  e.target.style.transform = 'scale(1)'
                }}
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
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(50, 50, 80, 0.95)'
                    e.target.style.boxShadow = '0 0 25px rgba(100, 149, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(30, 30, 50, 0.9)'
                    e.target.style.boxShadow = '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    e.target.style.transform = 'scale(1)'
                  }}
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
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(50, 50, 80, 0.95)'
                  e.target.style.boxShadow = '0 0 25px rgba(100, 149, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(30, 30, 50, 0.9)'
                  e.target.style.boxShadow = '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  e.target.style.transform = 'scale(1)'
                }}
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
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(50, 50, 80, 0.95)'
                    e.target.style.boxShadow = '0 0 25px rgba(100, 149, 237, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(30, 30, 50, 0.9)'
                    e.target.style.boxShadow = '0 0 15px rgba(100, 149, 237, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                    e.target.style.transform = 'scale(1)'
                  }}
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