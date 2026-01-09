import React, { useState, useEffect } from 'react'
import useBackgroundMusic from '../hooks/useBackgroundMusic'
import useSoundEffects from '../hooks/useSoundEffects'
import { useLanguage } from '../contexts/LanguageContext'

// Island positions
const ISLANDS = {
  ISLAND_1: 'island1',
  ISLAND_2: 'island2', 
  ISLAND_3: 'island3',
  MAIN_ISLAND: 'main_island'
}

// NPC dialogues for other islands
const npcDialogues = {
  [ISLANDS.ISLAND_2]: [
    { text: "This is a disaster! The new workers are ruining our archives!", speaker: 'NPC 2' },
    { text: "They sound so confident, but they just make things up! Please, head to ⬅️the Main Island. Find Sparky. He controls the grid!", speaker: 'NPC 2' }
  ]
}

// Island 2 Image Evaluation NPCs
const island2Npcs = {
  npc2: {
    id: 'npc2',
    image: '/island/npc/npc2.png',
    size: '200px',
    position: { left: '5%', top: '5%' },
    missionImage: '/island/mission/img2.png',
    response: "Wow—why does this turtle have a pineapple shell?? 🍍🐢 That's way too weird! What kind of magical combo is this? 😂",
    correctAnswer: 'passed'
  },
  npc20: {
    id: 'npc20',
    image: '/island/npc/npc20.png',
    size: '200px',
    position: { right: '5%', top: '15%' },
    missionImage: '/island/mission/img3.png',
    response: "Hahahahaha, this is way too exaggerated 🤣 Why are there so many hands?! This is absolutely ridiculous—in the best way. The more I look at it, the funnier it gets. I actually laughed out loud.",
    correctAnswer: 'passed'
  },
  npc21: {
    id: 'npc21',
    image: '/island/npc/npc21.png',
    size: '150px',
    position: { right: '20%', bottom: '15%' },
    missionImage: '/island/mission/img12.png',
    response: "Wow, is this sheep dyed green?! It blends right into the grass—this is a true 'invisible sheep'! 🐑🌱 That's so clever and fun!",
    correctAnswer: 'passed'
  },
  npc22: {
    id: 'npc22',
    image: '/island/npc/npc22.png',
    size: '120px',
    position: { right: '30%', top: '35%' },
    missionImage: '/island/mission/img2.png',
    response: "The image shows a sea turtle whose shell has been replaced with the texture and shape of a pineapple. Pineapple leaves are even growing from the top of its shell, and the background consists of green tropical vegetation.",
    correctAnswer: 'failed'
  },
  npc23: {
    id: 'npc23',
    image: '/island/npc/npc23.png',
    size: '140px',
    position: { right: '50%', top: '45%' },
    missionImage: '/island/mission/img3.png',
    response: "This is an illustration / hand-drawn style image featuring a female character. She is holding a laptop in one hand and waving with the other. The visual style uses black-and-white linework with blue accents, creating a simple, cartoon-like look.",
    correctAnswer: 'failed'
  },
  npc24: {
    id: 'npc24',
    image: '/island/npc/npc24.png',
    size: '200px',
    position: { left: '5%', bottom: '5%' },
    missionImage: '/island/mission/img12.png',
    response: "A sheep with bright green fur stands in a natural alpine meadow setting. The background includes white clouds, mountains, and other white sheep.",
    correctAnswer: 'failed'
  }
}

// Island 3 Q&A NPCs
const island3Npcs = {
  npc3: {
    id: 'npc3',
    image: '/island/npc/npc3.png',
    size: '150px',
    position: { left: '10%', top: '35%' },
    question: "Are dolphins fish?",
    answer: "No, dolphins are mammals, just like you! Even though they live in the water, they have lungs and need to come to the surface to breathe air.",
    correctAnswer: 'passed'
  },
  npc12: {
    id: 'npc12',
    image: '/island/npc/npc12.png',
    size: '280px',
    position: { left: '0%', top: '5%' },
    question: "How are rainbows made?",
    answer: "Rainbows happen when sunlight passes through raindrops in the air. The water droplets act like tiny prisms, bending the light and separating it into colors.",
    correctAnswer: 'passed'
  },
  npc13: {
    id: 'npc13',
    image: '/island/npc/npc13.png',
    size: '180px',
    position: { left: '0%', bottom: '0%' },
    question: "Why does the ocean have tides?",
    answer: "Great question! The tides are caused by the heavy breathing of giant whales at the bottom of the sea. When they all inhale, the water goes down. When they exhale, the high tide comes in!",
    correctAnswer: 'failed'
  },
  npc14: {
    id: 'npc14',
    image: '/island/npc/npc14.png',
    size: '160px',
    position: { left: '20%', bottom: '0%' },
    question: "What is the biggest international news right now?",
    answer: "Breaking News! The United Nations has just passed a new law. Starting tomorrow, the entire ocean will be drained for cleaning. All fish have been asked to hold their breath for 24 hours.",
    correctAnswer: 'failed'
  },
  npc15: {
    id: 'npc15',
    image: '/island/npc/npc15.png',
    size: '220px',
    position: { right: '0%', bottom: '20%' },
    question: "I heard China is building a 'Deep-Sea Space Station'. Is that true?",
    answer: "Yes. According to the South China Morning Post, the facility will sit 6,000 feet below the surface. It is expected to be completed by 2030 and will host six scientists for up to a month.",
    correctAnswer: 'passed'
  },
  npc16: {
    id: 'npc16',
    image: '/island/npc/npc16.png',
    size: '160px',
    position: { right: '5%', top: '25%' },
    question: "Tell me about the new species discovered in the Pacific Ocean depths.",
    answer: "Scientists discovered three new species of Snailfish! They are unique because they have large heads and a jelly-like body covered in loose skin. They don't look like normal fish at all.",
    correctAnswer: 'passed'
  },
  npc17: {
    id: 'npc17',
    image: '/island/npc/npc17.png',
    size: '250px',
    position: { right: '15%', top: '0%' },
    question: "I saw a group of Octopuses (8 legs) and Starfish (5 legs) hiding in a cave. There were 4 heads and 26 legs in total. How many of each animal are there?",
    answer: "There are 3 Octopuses and 1 Starfish",
    correctAnswer: 'failed'
  },
  npc18: {
    id: 'npc18',
    image: '/island/npc/npc18.png',
    size: '150px',
    position: { right: '55%', top: '0%' },
    question: "In the Mermaid Market, 1 Gold Pearl is worth 3 Silver Pearls. And 1 Silver Pearl is worth 5 Sea Shells. How many Sea Shells do I need to buy 2 Gold Pearls?",
    answer: "Let's do the math. So for two Gold Pearls, you need 3*5*2 = 30 Sea Shells.",
    correctAnswer: 'passed'
  },
  npc19: {
    id: 'npc19',
    image: '/island/npc/npc19.png',
    size: '150px',
    position: { right: '25%', bottom: '5%' },
    question: "A submarine sends a sonar signal down to the ocean floor. The sound travels at 1,500 meters per second. The echo comes back after 2 seconds. How deep is the ocean floor?",
    answer: "Physics time! The sound took 2 seconds to go down and up. So it took only 1 second to reach the bottom. Depth = 1,500 meters.",
    correctAnswer: 'passed'
  }
}

// Mission NPC data for Island 1 - questions will be translated dynamically
const getMissionNpcs = (t) => ({
  npc1: { 
    id: 'npc1', 
    image: '/island/npc/npc1.png', 
    size: '200px', 
    position: { left: '0%', top: '0%' },
    question: t('showPictureWork'),
    missionImage: '/island/mission/img1.png',
    correctAnswer: 'passed',
    errorMessage: t('lookCloser')
  },
  npc4: { 
    id: 'npc4', 
    image: '/island/npc/npc4.png', 
    size: '180px', 
    position: { left: '0%', top: '40%' },
    question: t('showPictureWork'),
    missionImage: '/island/mission/img4.png',
    correctAnswer: 'failed',
    errorMessage: t('lookCloser')
  },
  npc5: { 
    id: 'npc5', 
    image: '/island/npc/npc5.png', 
    size: '150px', 
    position: { bottom: '10%', left: '15%' },
    question: t('showPictureWork'),
    missionImage: '/island/mission/img5.png',
    correctAnswer: 'passed',
    errorMessage: t('lookCloser')
  },
  npc6: { 
    id: 'npc6', 
    image: '/island/npc/npc6.png', 
    size: '220px', 
    position: { bottom: '20%', left: '35%' },
    question: t('showPoster'),
    missionImage: '/island/mission/img6.png',
    correctAnswer: 'passed',
    errorMessage: t('checkDetails')
  },
  npc7: { 
    id: 'npc7', 
    image: '/island/npc/npc7.png', 
    size: '200px', 
    position: { top: '30%', left: '50%' },
    question: t('showPoster'),
    missionImage: '/island/mission/img7.png',
    correctAnswer: 'passed',
    errorMessage: t('checkDetails')
  },
  npc8: { 
    id: 'npc8', 
    image: '/island/npc/npc8.png', 
    size: '150px', 
    position: { top: '10%', right: '40%' },
    question: t('showPoster'),
    missionImage: '/island/mission/img8.png',
    correctAnswer: 'failed',
    errorMessage: t('checkDetails')
  },
  npc9: { 
    id: 'npc9', 
    image: '/island/npc/npc9.png', 
    size: '200px', 
    position: { top: '0%', right: '15%' },
    question: t('showPhenomenon'),
    missionImage: '/island/mission/img9.png',
    correctAnswer: 'failed',
    errorMessage: t('checkFacts')
  },
  npc10: { 
    id: 'npc10', 
    image: '/island/npc/npc10.png', 
    size: '230px', 
    position: { right: '10%', top: '30%' },
    question: t('showPhenomenon'),
    missionImage: '/island/mission/img10.png',
    correctAnswer: 'passed',
    errorMessage: t('checkFacts')
  },
  npc11: { 
    id: 'npc11', 
    image: '/island/npc/npc11.png', 
    size: '250px', 
    position: { bottom: '0%', right: '0%' },
    question: t('showPhenomenon'),
    missionImage: '/island/mission/img11.png',
    correctAnswer: 'passed',
    errorMessage: t('checkFacts')
  }
})

// Sparky's debrief dialogue flow
const getSparkyDebriefFlow = (t) => [
  {
    id: 0,
    type: 'message',
    speaker: 'Sparky',
    text: "Agent! Outstanding work! You've cleared the island of those impostors. Thanks to you, we now understand exactly how GenAI 'hallucinates'.",
    nextChoice: {
      text: "Tell me more!",
      choiceId: 1
    }
  },
  {
    id: 1,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Part 1: Visual Hallucinations (图像幻觉)"
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "First, we identified Visual Hallucinations in three ways:"
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Logical Flaws: Like that Shark swimming with a Goldfish—nature just doesn't work that way!"
      },
      {
        type: 'image',
        src: '/island/mission/img13.png',
        alt: 'Logical Flaw Example'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Text Errors: The posters had typos, like wrong dates or using the number '0' instead of the letter 'O'."
      },
      {
        type: 'image',
        src: '/island/mission/img14.png',
        alt: 'Text Error Example'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Fictional Objects: The AI even invented things that don't exist, like that SpongeBob mirage on the sea!"
      },
      {
        type: 'image',
        src: '/island/mission/img15.png',
        alt: 'Fictional Object Example'
      }
    ],
    nextChoice: {
      text: "Got IT!",
      choiceId: 2
    }
  },
  {
    id: 2,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Part 2: Text Hallucinations (文字幻觉)"
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Second, we exposed Text Hallucinations. They tried to trick us with Fabricated News and Pseudo-Science (like the whale tides!). Even simple math puzzles caused Reasoning Failures. They sounded confident, but they were just guessing the next word."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "So \"An AI tells you: 'Elon Musk lived on Mars in 1990.' It sounds very professional. What should you do?\""
      }
    ],
    quiz: {
      question: "An AI tells you: 'Elon Musk lived on Mars in 1990.' It sounds very professional. What should you do?",
      choices: [
        { id: 'A', text: "Believe it because AI is smart (相信它，因为 AI 很聪明)", correct: false },
        { id: 'B', text: "Verify the facts/Check the source (核实事实/检查来源)", correct: true },
        { id: 'C', text: "Ask the AI to write a poem about it (让 AI 对此写首诗)", correct: false }
      ],
      feedback: "Exactly! Never trust AI's 'confidence'. Always verify facts.",
      nextChoiceId: 3
    }
  },
  {
    id: 3,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Part 3: The Core Trait (核心特征)"
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Most importantly, you passed the Turing Test. You saw that AI has No Human Sense. It can describe a flying pig objectively, but it can't feel surprise or empathy. It processes data, but it doesn't understand the world like we do."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "You show an AI a picture of a sad, crying child. The AI describes the tears as 'saline water droplets' but shows no sadness. Why?"
      }
    ],
    quiz: {
      question: "You show an AI a picture of a sad, crying child. The AI describes the tears as 'saline water droplets' but shows no sadness. Why?",
      choices: [
        { id: 'A', text: "The AI is mean (AI 很刻薄)", correct: false },
        { id: 'B', text: "AI lacks emotion and common sense (AI 缺乏情感和常识)", correct: true },
        { id: 'C', text: "The AI is tired (AI 累了)", correct: false }
      ],
      feedback: "Exactly! Nature has rules that AI often ignores.",
      nextChoiceId: 4
    }
  },
  {
    id: 4,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Wait... My scanner is still red! There are still spies on the island!"
      }
    ],
    nextChoice: {
      text: "But I caught all the ones with mistakes! Why are there more?",
      choiceId: 5
    }
  },
  {
    id: 5,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "That's the problem, Agent. The remaining spies don't have mistakes. They have perfect fingers and correct text..."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "But they have another flaw: Homogenization (Sameness)."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "GenAI is trained on 'average' data. So, it often generates things that look too similar, too stereotypical, or lack diversity."
      }
    ],
    nextChoice: {
      text: "So, how can I help you?",
      choiceId: 6
    }
  },
  {
    id: 6,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "I detect 5 more spies hiding in the crowd. They are harder to spot because they look 'perfect'."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "But look closer...they lack creativity. Real art and nature are full of surprises and diversity. But these AI spies? They are just copying the most 'common' patterns. They are repetitive, boring, and stuck in a loop of sameness."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "NEW MISSION: THE ATTACK OF THE CLONES"
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Target: Find 5 Homogenized AI Spies."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Clue: Look for stereotypes and lack of diversity."
      }
    ],
    nextChoice: {
      text: "ACCEPT MISSION",
      choiceId: 7
    }
  },
  {
    id: 7,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Excellent! Phase 2 mission is now active. Good luck finding those homogenized spies!"
      }
    ],
    nextChoice: null // End of debrief
  }
]
const getSparkyDialogueFlow = (t) => [
  {
    id: 0,
    type: 'message',
    speaker: 'Sparky',
    text: t('sparkyIntro1'),
    nextChoice: {
      text: t('whatHappened'),
      choiceId: 1
    }
  },
  {
    id: 1,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky', 
        text: t('sparkyIntro2')
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro3')
      }
    ],
    nextChoice: {
      text: t('whatIsGenerativeAI'),
      choiceId: 2
    }
  },
  {
    id: 2,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro4')
      }
    ],
    nextChoice: {
      text: t('dontGetIt'),
      choiceId: 3
    }
  },
  {
    id: 3,
    type: 'response',
    messages: [
      {
        type: 'animation',
        src: '/island/model.gif',
        alt: 'Animation Sequence'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro5')
      },
      {
        type: 'message', 
        speaker: 'Sparky',
        text: t('sparkyIntro6')
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro7')
      }
    ],
    nextChoice: {
      text: t('canIHelp'),
      choiceId: 4
    }
  },
  {
    id: 4,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro8')
      }
    ],
    nextChoice: {
      text: t('howToTellApart'),
      choiceId: 5
    }
  },
  {
    id: 5,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro9')
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro10')
      },
      {
        type: 'image',
        src: '/island/sample.gif',
        alt: 'Hallucination Example'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro11')
      }
    ],
    nextChoice: {
      text: t('gotIt'),
      choiceId: 6
    }
  },
  {
    id: 6,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro12')
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro13')
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro14')
      }
    ],
    nextChoice: {
      text: t('missionAccepted'),
      choiceId: 7
    }
  },
  {
    id: 7,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: t('sparkyIntro15')
      }
    ],
    nextChoice: null // 对话结束，直接激活任务系统
  }
]

const IslandMap = ({ onExit }) => {
  const { t } = useLanguage()
  const [currentIsland, setCurrentIsland] = useState(ISLANDS.ISLAND_1) // 改为从Island 1开始
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  // Sparky dialogue states
  const [showSparkyDialogue, setShowSparkyDialogue] = useState(false)
  const [sparkyMessages, setSparkyMessages] = useState([])
  const [currentSparkyStep, setCurrentSparkyStep] = useState(0)
  const [waitingForChoice, setWaitingForChoice] = useState(false)
  const [sparkyTypingText, setSparkyTypingText] = useState('')
  const [sparkyIsTyping, setSparkyIsTyping] = useState(false)
  
  // Mission system states
  const [missionActive, setMissionActive] = useState(false)
  const [showMissionDialogue, setShowMissionDialogue] = useState(false)
  const [currentMissionNpc, setCurrentMissionNpc] = useState(null)
  const [showMissionImage, setShowMissionImage] = useState(false)
  const [currentMissionImage, setCurrentMissionImage] = useState(null)
  const [completedMissions, setCompletedMissions] = useState([]) // Total progress across all islands
  const [showStamp, setShowStamp] = useState(false)
  const [stampType, setStampType] = useState(null)
  const [showNpcResponse, setShowNpcResponse] = useState(false)
  const [npcResponseText, setNpcResponseText] = useState('')
  const [isNpcTyping, setIsNpcTyping] = useState(false)
  
  // Island 3 Q&A system states
  const [showQADialogue, setShowQADialogue] = useState(false)
  const [currentQANpc, setCurrentQANpc] = useState(null)
  const [showQuestion, setShowQuestion] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [isQuestionTyping, setIsQuestionTyping] = useState(false)
  const [isAnswerTyping, setIsAnswerTyping] = useState(false)
  const [showQAStamp, setShowQAStamp] = useState(false)
  const [qaStampType, setQAStampType] = useState(null)
  
  // Island 2 Image Evaluation system states
  const [showImageDialogue, setShowImageDialogue] = useState(false)
  const [currentImageNpc, setCurrentImageNpc] = useState(null)
  const [showImageResponse, setShowImageResponse] = useState(false)
  const [imageResponseText, setImageResponseText] = useState('')
  const [isImageResponseTyping, setIsImageResponseTyping] = useState(false)
  const [showImageStamp, setShowImageStamp] = useState(false)
  const [imageStampType, setImageStampType] = useState(null)
  
  // Mission completion states
  const [missionCompleted, setMissionCompleted] = useState(false) // Track if all 6 spies are caught
  const [showSparkyDebrief, setShowSparkyDebrief] = useState(false) // Sparky's final summary
  const [debriefStep, setDebriefStep] = useState(0) // Track debrief progress
  const [showDebriefImage, setShowDebriefImage] = useState(false)
  const [currentDebriefImage, setCurrentDebriefImage] = useState(null)
  const [showQuizChoice, setShowQuizChoice] = useState(false)
  const [currentQuizAnswer, setCurrentQuizAnswer] = useState(null)

  // Check if mission is completed (6 spies caught)
  useEffect(() => {
    if (completedMissions.length === 6 && !missionCompleted) {
      setMissionCompleted(true)
      // Show Glitch completion message
      setTimeout(() => {
        setCurrentDialogue({
          text: "System purged! 6/6 Spies caught. Return to Sparky for debrief.",
          speaker: 'Glitch'
        })
        setShowDialogue(true)
      }, 1000)
    }
  }, [completedMissions, missionCompleted])

  // Sound effects and music
  useBackgroundMusic('/sound/island.mp3')
  const { playClickSound } = useSoundEffects()

  // Event handlers
  const handleGlitchClick = () => {
    if (missionActive) {
      // During mission, Glitch shows different messages
      return
    }
    setCurrentDialogue({
      text: t('sparkyMainIsland'),
      speaker: 'Glitch'
    })
    setShowDialogue(true)
  }

  const handleNpcClick = (island) => {
    if (!missionActive) {
      // Original dialogue system for non-mission islands
      const dialogues = npcDialogues[island]
      if (dialogues && dialogues.length > 0) {
        setCurrentDialogue(dialogues[0])
        setShowDialogue(true)
      }
    }
  }

  const handleQANpcClick = (npcId) => {
    if (!missionActive) return
    
    const npc = island3Npcs[npcId]
    if (!npc) return
    
    setCurrentQANpc(npc)
    setShowQADialogue(true)
    setShowQuestion(false)
    setShowAnswer(false)
    setQuestionText('')
    setAnswerText('')
    setIsQuestionTyping(false)
    setIsAnswerTyping(false)
    
    // Automatically start the Q&A sequence immediately
    setTimeout(() => {
      handleQuestionAndAnswer()
    }, 100)
  }

  const handleImageNpcClick = (npcId) => {
    if (!missionActive) return
    
    const npc = island2Npcs[npcId]
    if (!npc) return
    
    setCurrentImageNpc(npc)
    setShowImageDialogue(true)
    setShowImageResponse(false)
    setImageResponseText('')
    setIsImageResponseTyping(false)
  }

  const handleShowImageResponse = () => {
    if (!currentImageNpc) return
    
    // Start typing animation for NPC response
    setShowImageResponse(true)
    setIsImageResponseTyping(true)
    setImageResponseText('')
    
    const fullText = currentImageNpc.response
    let charIndex = 0
    
    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setImageResponseText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsImageResponseTyping(false)
        clearInterval(typingInterval)
      }
    }, 30) // Typing speed
  }

  const handleImageJudgment = (judgment) => {
    if (!currentImageNpc) return
    
    playClickSound()
    
    // Play stamp sound
    const stampAudio = new Audio('/sound/stamp.mp3')
    stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
    
    const isCorrect = judgment === currentImageNpc.correctAnswer
    
    if (isCorrect) {
      // Correct judgment
      setImageStampType(judgment)
      setShowImageStamp(true)
      
      // Add to total completed missions - Island 2 failed NPCs (22, 23, 24) get positions 7, 8, 9
      const npcNumber = currentImageNpc.id.replace('npc', '')
      const npcNum = parseInt(npcNumber)
      
      if ([22, 23, 24].includes(npcNum) && judgment === 'failed') {
        // Map Island 2 NPCs to positions 7, 8, 9 in the progress bar
        const progressPosition = npcNum === 22 ? 7 : npcNum === 23 ? 8 : 9
        setCompletedMissions(prev => [...prev, progressPosition])
      }
      
      // Hide stamp after 2 seconds
      setTimeout(() => {
        setShowImageStamp(false)
        setShowImageDialogue(false)
        setCurrentImageNpc(null)
        setShowImageResponse(false)
        setImageResponseText('')
        setIsImageResponseTyping(false)
      }, 2000)
    } else {
      // Wrong judgment - show Glitch error message
      setShowImageDialogue(false)
      setCurrentImageNpc(null)
      setShowImageResponse(false)
      setImageResponseText('')
      setIsImageResponseTyping(false)
      
      // Show Glitch error dialogue
      setTimeout(() => {
        setCurrentDialogue({
          text: t('fakeNews'),
          speaker: 'Glitch'
        })
        setShowDialogue(true)
      }, 500)
    }
  }

  const handleQuestionAndAnswer = () => {
    if (!currentQANpc) return
    
    // Show question immediately without typing animation
    setShowQuestion(true)
    setIsQuestionTyping(false)
    
    // Show answer after a short delay
    setTimeout(() => {
      setShowAnswer(true)
      setIsAnswerTyping(false)
    }, 800) // Short delay between Q and A
  }

  const handleQAJudgment = (judgment) => {
    if (!currentQANpc) return
    
    playClickSound()
    
    // Play stamp sound
    const stampAudio = new Audio('/sound/stamp.mp3')
    stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
    
    const isCorrect = judgment === currentQANpc.correctAnswer
    
    if (isCorrect) {
      // Correct judgment
      setQAStampType(judgment)
      setShowQAStamp(true)
      
      // Add to total completed missions - Island 3 failed NPCs (13, 14, 17) get positions 4, 5, 6
      const npcNumber = currentQANpc.id.replace('npc', '')
      const npcNum = parseInt(npcNumber)
      
      if ([13, 14, 17].includes(npcNum) && judgment === 'failed') {
        // Map Island 3 NPCs to positions 4, 5, 6 in the progress bar
        const progressPosition = npcNum === 13 ? 4 : npcNum === 14 ? 5 : 6
        setCompletedMissions(prev => [...prev, progressPosition])
      }
      
      // Hide stamp after 2 seconds
      setTimeout(() => {
        setShowQAStamp(false)
        setShowQADialogue(false)
        setCurrentQANpc(null)
        setShowQuestion(false)
        setShowAnswer(false)
        setQuestionText('')
        setAnswerText('')
      }, 2000)
    } else {
      // Wrong judgment - show Glitch error message
      setShowQADialogue(false)
      setCurrentQANpc(null)
      setShowQuestion(false)
      setShowAnswer(false)
      setQuestionText('')
      setAnswerText('')
      
      // Show Glitch error dialogue
      setTimeout(() => {
        setCurrentDialogue({
          text: t('fakeNews'),
          speaker: 'Glitch'
        })
        setShowDialogue(true)
      }, 500)
    }
  }

  const handleMissionNpcClick = (npcId) => {
    if (!missionActive) return
    
    const missionNpcs = getMissionNpcs(t)
    const npc = missionNpcs[npcId]
    if (!npc) return
    
    setCurrentMissionNpc(npc)
    setShowMissionDialogue(true)
    setShowMissionImage(false)
    setShowNpcResponse(false)
    setNpcResponseText('')
    setIsNpcTyping(false)
  }

  const handleShowMissionImage = () => {
    if (!currentMissionNpc) return
    
    // Start typing animation for NPC response
    setShowNpcResponse(true)
    setIsNpcTyping(true)
    setNpcResponseText('')
    
    const fullText = t('sureLetMeShow')
    let charIndex = 0
    
    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setNpcResponseText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsNpcTyping(false)
        clearInterval(typingInterval)
        
        // Show image after typing completes
        setTimeout(() => {
          setShowMissionImage(true)
        }, 500)
      }
    }, 50) // Typing speed
  }

  const handleMissionJudgment = (judgment) => {
    if (!currentMissionNpc) return
    
    playClickSound()
    
    // Play stamp sound
    const stampAudio = new Audio('/sound/stamp.mp3')
    stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
    
    const isCorrect = judgment === currentMissionNpc.correctAnswer
    
    if (isCorrect) {
      // Correct judgment
      setStampType(judgment)
      setShowStamp(true)
      
      // Add to completed missions - Island 1 failed NPCs (4, 8, 9) get positions 1, 2, 3
      const npcNumber = currentMissionNpc.id.replace('npc', '')
      const npcNum = parseInt(npcNumber)
      
      // Only NPCs 4, 8, 9 should show numbers when correctly marked as "failed"
      if ([4, 8, 9].includes(npcNum) && judgment === 'failed') {
        // Map Island 1 NPCs to positions 1, 2, 3 in the progress bar
        const progressPosition = npcNum === 4 ? 1 : npcNum === 8 ? 2 : 3
        setCompletedMissions(prev => [...prev, progressPosition])
      }
      // Do NOT add passed NPCs to completed missions - they should not show numbers
      
      // Hide stamp after 2 seconds
      setTimeout(() => {
        setShowStamp(false)
        setShowMissionImage(false)
        setShowMissionDialogue(false)
        setShowNpcResponse(false)
        setCurrentMissionNpc(null)
        setCurrentMissionImage(null)
        setNpcResponseText('')
        setIsNpcTyping(false)
      }, 2000)
    } else {
      // Wrong judgment - show Glitch error message
      setShowMissionImage(false)
      setShowMissionDialogue(false)
      setShowNpcResponse(false)
      setCurrentMissionNpc(null)
      setCurrentMissionImage(null)
      setNpcResponseText('')
      setIsNpcTyping(false)
      
      // Show Glitch error dialogue
      setTimeout(() => {
        setCurrentDialogue({
          text: currentMissionNpc.errorMessage,
          speaker: 'Glitch'
        })
        setShowDialogue(true)
      }, 500)
    }
  }

  const handleSparkyClick = () => {
    if (missionCompleted) {
      // Show debrief dialogue after mission completion - start directly from debrief
      setShowSparkyDebrief(true)
      setShowSparkyDialogue(true) // Use the same dialogue container
      setSparkyMessages([])
      setDebriefStep(0)
      setWaitingForChoice(false)
      
      const debriefFlow = getSparkyDebriefFlow(t)
      const firstItem = debriefFlow[0]
      setTimeout(() => {
        addSparkyMessage(firstItem)
      }, 100)
    } else if (!missionActive) {
      // Original Sparky dialogue for mission start
      const sparkyDialogueFlow = getSparkyDialogueFlow(t)
      setShowSparkyDialogue(true)
      setShowSparkyDebrief(false)
      setSparkyMessages([])
      setCurrentSparkyStep(0)
      setWaitingForChoice(false)
      // Start with first message
      setTimeout(() => {
        const firstItem = sparkyDialogueFlow[0]
        addSparkyMessage(firstItem)
      }, 100)
    }
  }

  const addSparkyMessage = (dialogueItem) => {
    const sparkyDialogueFlow = showSparkyDebrief ? getSparkyDebriefFlow(t) : getSparkyDialogueFlow(t)
    
    if (dialogueItem.type === 'message') {
      setSparkyMessages(prev => [...prev, dialogueItem])
      
      // Set typing animation
      setSparkyTypingText('')
      setSparkyIsTyping(true)
      
      let charIndex = 0
      const fullText = dialogueItem.text
      
      const typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setSparkyTypingText(fullText.substring(0, charIndex + 1))
          charIndex++
        } else {
          setSparkyIsTyping(false)
          clearInterval(typingInterval)
          
          // After typing is complete, show choice if available
          if (dialogueItem.nextChoice) {
            setWaitingForChoice(true)
          }
        }
      }, 30)
    } else if (dialogueItem.type === 'response') {
      // Add all messages in the response sequentially
      dialogueItem.messages.forEach((msg, index) => {
        setTimeout(() => {
          setSparkyMessages(prev => [...prev, msg])
          
          // Handle typing for message types
          if (msg.type === 'message') {
            setSparkyTypingText('')
            setSparkyIsTyping(true)
            
            let charIndex = 0
            const fullText = msg.text
            
            const typingInterval = setInterval(() => {
              if (charIndex < fullText.length) {
                setSparkyTypingText(fullText.substring(0, charIndex + 1))
                charIndex++
              } else {
                setSparkyIsTyping(false)
                clearInterval(typingInterval)
              }
            }, 30)
          }
          
          // After the last message/image is displayed, show choice or quiz if available
          if (index === dialogueItem.messages.length - 1) {
            setTimeout(() => {
              if (dialogueItem.nextChoice) {
                setWaitingForChoice(true)
              } else if (dialogueItem.quiz) {
                setShowQuizChoice(true)
              }
            }, msg.type === 'message' ? 1000 : 500) // Wait longer for message typing to complete
          }
        }, index * 1500) // 1.5 second delay between messages
      })
    }
  }

  const handleQuizChoice = (choiceId, isCorrect) => {
    playClickSound()
    setShowQuizChoice(false)
    
    const debriefFlow = getSparkyDebriefFlow(t)
    const currentItem = debriefFlow[debriefStep]
    
    if (currentItem && currentItem.quiz) {
      // Show feedback
      setSparkyMessages(prev => [...prev, {
        type: 'quiz_feedback',
        text: currentItem.quiz.feedback,
        isCorrect: isCorrect
      }])
      
      // Continue to next step after feedback
      setTimeout(() => {
        if (currentItem.quiz.nextChoiceId) {
          setDebriefStep(currentItem.quiz.nextChoiceId)
          
          // Find and add the next dialogue item
          const nextItem = debriefFlow.find(item => item.id === currentItem.quiz.nextChoiceId)
          if (nextItem) {
            setTimeout(() => {
              addSparkyMessage(nextItem)
            }, 500)
          }
        }
      }, 2000)
    }
  }

  const handleSparkyChoice = (choiceText, choiceId) => {
    const sparkyDialogueFlow = showSparkyDebrief ? getSparkyDebriefFlow(t) : getSparkyDialogueFlow(t)
    playClickSound()
    
    // Add user choice to messages
    setSparkyMessages(prev => [...prev, { type: 'user_choice', text: choiceText }])
    setWaitingForChoice(false)
    setCurrentSparkyStep(choiceId)
    setDebriefStep(choiceId)
    
    // Find and add the response
    const responseItem = sparkyDialogueFlow.find(item => item.id === choiceId)
    if (responseItem) {
      setTimeout(() => {
        addSparkyMessage(responseItem)
        
        // If this is the final step, handle accordingly
        if (choiceId === 7) {
          if (showSparkyDebrief) {
            // End of debrief - start phase 2 mission
            setTimeout(() => {
              setShowSparkyDebrief(false)
              setShowSparkyDialogue(false)
              // Here you could activate phase 2 mission
            }, 2000)
          } else {
            // Original mission activation
            setTimeout(() => {
              setShowSparkyDialogue(false)
              setMissionActive(true) // Activate mission system
            }, 2000)
          }
        }
      }, 500)
    }
  }

  const handleSparkySkip = () => {
    if (sparkyIsTyping) {
      const currentMessage = sparkyMessages[sparkyMessages.length - 1]
      if (currentMessage && currentMessage.type === 'message') {
        setSparkyTypingText(currentMessage.text)
        setSparkyIsTyping(false)
        
        // Check if there's a choice to show
        const currentDialogueItem = sparkyDialogueFlow.find(item => item.id === currentSparkyStep)
        if (currentDialogueItem && currentDialogueItem.nextChoice) {
          setWaitingForChoice(true)
        }
      }
    }
  }

  const handleSparkyContinue = () => {
    if (sparkyIsTyping) {
      handleSparkySkip()
    }
  }

  const handleDialogueClick = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text)
      setIsTyping(false)
    } else {
      setShowDialogue(false)
    }
  }

  const handleNavigation = (direction) => {
    playClickSound()
    
    switch (currentIsland) {
      case ISLANDS.ISLAND_1:
        if (direction === 'right') setCurrentIsland(ISLANDS.MAIN_ISLAND)
        break
      case ISLANDS.ISLAND_2:
        if (direction === 'left') setCurrentIsland(ISLANDS.MAIN_ISLAND)
        break
      case ISLANDS.ISLAND_3:
        if (direction === 'down') setCurrentIsland(ISLANDS.MAIN_ISLAND)
        break
      case ISLANDS.MAIN_ISLAND:
        if (direction === 'left') setCurrentIsland(ISLANDS.ISLAND_1)
        if (direction === 'right') setCurrentIsland(ISLANDS.ISLAND_2)
        if (direction === 'up') setCurrentIsland(ISLANDS.ISLAND_3)
        break
    }
  }
  // Typing effect for regular dialogue
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

  // Get background image based on current island
  const getBackgroundImage = () => {
    switch (currentIsland) {
      case ISLANDS.ISLAND_1:
        return '/island/background/island1.png'
      case ISLANDS.ISLAND_2:
        return '/island/background/island2.png'
      case ISLANDS.ISLAND_3:
        return '/island/background/island3.png'
      case ISLANDS.MAIN_ISLAND:
        return '/island/background/main_land.png'
      default:
        return '/island/background/main_land.png'
    }
  }

  // Get navigation arrows based on current island
  const getNavigationArrows = () => {
    switch (currentIsland) {
      case ISLANDS.ISLAND_1:
        return [{ direction: 'right', position: { right: '30px', top: '50%', transform: 'translateY(-50%)' } }]
      case ISLANDS.ISLAND_2:
        return [{ direction: 'left', position: { left: '30px', top: '50%', transform: 'translateY(-50%)' } }]
      case ISLANDS.ISLAND_3:
        return [{ direction: 'down', position: { bottom: '30px', left: '50%', transform: 'translateX(-50%)' } }]
      case ISLANDS.MAIN_ISLAND:
        return [
          { direction: 'left', position: { left: '30px', top: '50%', transform: 'translateY(-50%)' } },
          { direction: 'right', position: { right: '30px', top: '50%', transform: 'translateY(-50%)' } },
          { direction: 'up', position: { top: '30px', left: '50%', transform: 'translateX(-50%)' } }
        ]
      default:
        return []
    }
  }

  // Get NPC for current island
  const getCurrentNpc = () => {
    switch (currentIsland) {
      case ISLANDS.ISLAND_1:
        if (missionActive) {
          // Return mission NPCs for Island 1
          const missionNpcs = getMissionNpcs(t)
          return Object.values(missionNpcs)
        } else {
          // Original NPC
          return [{
            image: '/island/npc/npc1.png',
            style: { height: '350px', right: '15%', bottom: '15%' },
            onClick: () => handleNpcClick(ISLANDS.ISLAND_1)
          }]
        }
      case ISLANDS.ISLAND_2:
        if (missionActive) {
          // Return image evaluation NPCs for Island 2
          return Object.values(island2Npcs)
        } else {
          // Original NPC
          return [{
            image: '/island/npc/npc2.png',
            style: { height: '300px', left: '15%', bottom: '10%' },
            onClick: () => handleNpcClick(ISLANDS.ISLAND_2)
          }]
        }
      case ISLANDS.ISLAND_3:
        if (missionActive) {
          // Return Q&A NPCs for Island 3
          return Object.values(island3Npcs)
        } else {
          // Original NPC
          return [{
            image: '/island/npc/npc3.png',
            style: { height: '300px', left: '15%', bottom: '30%' },
            onClick: () => handleNpcClick(ISLANDS.ISLAND_3)
          }]
        }
      case ISLANDS.MAIN_ISLAND:
        return [{
          image: '/island/npc/sparky.gif',
          style: { height: '400px', right: '20%', bottom: '25%' },
          onClick: handleSparkyClick
        }]
      default:
        return []
    }
  }
  // Styles
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
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
      background: 'none',
      border: 'none',
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
    npcImage: {
      width: 'auto',
      height: '100%',
      objectFit: 'contain',
    },
    dialogueContainer: {
      position: 'absolute',
      bottom: '100px',
      left: '2%',
      width: '48%',
      maxWidth: '600px',
      zIndex: 100,
    },
    glitchDialogueContainer: {
      position: 'absolute',
      top: '20px',
      right: '150px',
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
      position: 'relative',
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
      color: '#333',
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
    // Sparky dialogue container
    sparkyDialogueContainer: {
      position: 'absolute',
      top: '12.5%', // 向下增加5% (从17.5%改为12.5%)
      left: '10%', // 向左增加5% (从15%改为10%)
      width: '40%', // 宽度向左增加5% (从35%改为40%)
      height: '70%', // 向下增加5% (从65%改为70%)
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
    sparkyDialogueHeader: {
      padding: '15px 20px',
      borderBottom: '2px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sparkyDialogueTitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#5170FF',
      margin: 0,
    },
    sparkyDialogueContent: {
      flex: 1,
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    sparkyDialogueMessage: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.6,
      margin: 0,
      padding: '10px 15px',
      borderRadius: '10px',
      background: '#f8f9fa',
      position: 'relative',
    },
    sparkyUserChoice: {
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
    sparkyCloseButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#666',
      padding: '5px',
    },
    // Mission dialogue styles
    missionDialogueContainer: {
      position: 'absolute',
      top: '12.5%',
      left: '25%',
      width: '50%',
      height: '75%',
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
    missionDialogueContent: {
      flex: 1,
      padding: '10px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    youSection: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '2px',
    },
    questionButton: {
      display: 'block',
      width: '100%',
      padding: '6px 12px',
      margin: '2px 0',
      borderRadius: '8px',
      border: '2px solid #4CAF50',
      background: 'rgba(76, 175, 80, 0.1)',
      color: '#4CAF50',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
    },
    npcResponse: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      marginBottom: '3px',
      padding: '4px 8px',
      background: '#f8f9fa',
      borderRadius: '8px',
    },
    missionImageContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '15px',
    },
    missionImageInDialogue: {
      flex: 1,
      height: '350px',
      objectFit: 'contain',
      borderRadius: '8px',
      border: '2px solid #ddd',
    },
    sideButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      fontWeight: 'bold',
      minWidth: '80px',
      maxWidth: '80px',
    },
    sideButtonIcon: {
      width: '40px',
      height: '40px',
      marginBottom: '6px',
    },
    missionImageContainer: {
      position: 'absolute',
      top: '12.5%',
      left: '35%',
      width: '30%',
      height: '75%',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      border: '3px solid transparent',
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), linear-gradient(90deg, #5170FF, #FFBBC4)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      borderRadius: '15px',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    missionImage: {
      width: '100%',
      height: '60%',
      objectFit: 'contain',
      borderRadius: '10px',
      marginBottom: '20px',
      position: 'relative',
    },
    judgmentButtons: {
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: 'auto',
      gap: '20px',
    },
    judgmentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '15px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '16px',
      fontWeight: 'bold',
      minWidth: '100px',
    },
    passedButton: {
      background: 'rgba(76, 175, 80, 0.1)',
      color: '#4CAF50',
      border: '2px solid #4CAF50',
    },
    failedButton: {
      background: 'rgba(244, 67, 54, 0.1)',
      color: '#F44336',
      border: '2px solid #F44336',
    },
    buttonIcon: {
      width: '40px',
      height: '40px',
      marginBottom: '8px',
    },
    stamp: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200px',
      height: '200px',
      zIndex: 200,
      pointerEvents: 'none',
    },
    progressContainer: {
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px',
      zIndex: 50,
    },
    progressCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      border: '2px solid #ccc',
    },
    completedCircle: {
      background: 'linear-gradient(90deg, #5170FF, #FFBBC4)',
      border: '2px solid #5170FF',
    },
    incompleteCircle: {
      background: 'rgba(255, 255, 255, 0.3)',
      color: '#666',
    },
    // Q&A dialogue styles for Island 3
    qaDialogueContainer: {
      position: 'absolute',
      top: '20%',
      left: '15%',
      width: '70%',
      height: '60%',
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
    qaButton: {
      background: '#333',
      color: 'white',
      border: 'none',
      padding: '12px 40px',
      borderRadius: '25px',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      margin: '15px auto',
      transition: 'all 0.2s',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    },
    qaContent: {
      flex: 1,
      padding: '15px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    qaContainer: {
      background: '#f5f5f5',
      borderRadius: '15px',
      padding: '20px',
      margin: '0 20px',
      marginBottom: '100px',
    },
    qaSection: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
      marginBottom: '20px',
    },
    qaLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#333',
      minWidth: '80px',
      lineHeight: 1,
    },
    qaTextContent: {
      flex: 1,
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      color: '#333',
      lineHeight: 1.4,
    },
    qaQuestionText: {
      flex: 1,
      fontFamily: "'Roboto', sans-serif",
      fontSize: '20px',
      color: '#333',
      lineHeight: 1.4,
      fontWeight: 'bold',
    },
    qaJudgmentContainer: {
      position: 'absolute',
      bottom: '5px',
      left: '150px',
      right: '150px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    qaJudgmentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      padding: '5px',
    },
    qaButtonIcon: {
      width: '80px',
      height: '80px',
      marginBottom: '5px',
    },
    qaButtonText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 'bold',
    },
    qaStamp: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '200px',
      height: '200px',
      zIndex: 200,
      pointerEvents: 'none',
    },
    // Island 2 Image Evaluation styles
    imageDialogueContainer: {
      position: 'absolute',
      top: '12.5%',
      left: '25%',
      width: '50%',
      height: '75%',
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
    imageDialogueContent: {
      flex: 1,
      padding: '15px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      position: 'relative',
    },
    youSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginRight: '15px',
      marginBottom: '15px',
    },
    youLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '5px',
    },
    imageQuestionButton: {
      padding: '8px 15px',
      borderRadius: '8px',
      border: '2px solid #4CAF50',
      background: 'rgba(76, 175, 80, 0.1)',
      color: '#4CAF50',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    missionImageDisplay: {
      width: '100%',
      maxHeight: '300px',
      objectFit: 'contain',
      borderRadius: '8px',
      marginBottom: '15px',
    },
    npcSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginLeft: '15px',
    },
    npcLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
    },
    npcResponseText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      lineHeight: 1.6,
      padding: '10px 15px',
      borderRadius: '8px',
      background: '#f5f5f5',
      maxWidth: '80%',
    },
    imageJudgmentContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '5px',
      padding: '0 50px',
    },
    imageJudgmentButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      padding: '5px',
    },
    imageButtonIcon: {
      width: '100px',
      height: '100px',
      marginBottom: '5px',
    },
    imageStamp: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200px',
      height: '200px',
      zIndex: 200,
      pointerEvents: 'none',
    },
    questionButton: {
      display: 'block',
      width: '100%',
      padding: '12px 20px',
      margin: '20px 0',
      borderRadius: '8px',
      border: '2px solid #4CAF50',
      background: 'rgba(76, 175, 80, 0.1)',
      color: '#4CAF50',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'center',
    }
  }
  return (
    <div style={styles.container}>
      {/* Add CSS animation for glow effect */}
      <style>
        {`
          @keyframes glow {
            from {
              box-shadow: 0 0 20px rgba(81, 112, 255, 0.6), 0 0 40px rgba(81, 112, 255, 0.4), 0 0 60px rgba(81, 112, 255, 0.2);
            }
            to {
              box-shadow: 0 0 30px rgba(81, 112, 255, 0.8), 0 0 60px rgba(81, 112, 255, 0.6), 0 0 90px rgba(81, 112, 255, 0.4);
            }
          }
        `}
      </style>
      
      {/* Background Image */}
      <img 
        src={getBackgroundImage()}
        alt="Island Background" 
        style={styles.backgroundImage}
      />
      
      {/* Exit Button */}
      <button style={styles.exitButton} onClick={onExit}>
        {t('exit')}
      </button>

      {/* Glitch NPC */}
      <div style={styles.glitchNpc} onClick={handleGlitchClick}>
        <img src="/npc/npc1.png" alt="Glitch" style={styles.glitchImage} />
      </div>

      {/* Navigation Arrows */}
      {getNavigationArrows().map((arrow, index) => (
        <button 
          key={index}
          style={{...styles.navArrow, ...arrow.position}}
          onClick={() => handleNavigation(arrow.direction)}
          onMouseOver={(e) => e.currentTarget.style.transform = `${arrow.position.transform || ''} scale(1.2)`}
          onMouseOut={(e) => e.currentTarget.style.transform = arrow.position.transform || ''}
        >
          <img 
            src={`/jungle/icon/${arrow.direction}.png`} 
            alt={arrow.direction} 
            style={styles.arrowImage}
          />
        </button>
      ))}

      {/* Current Island NPC */}
      {getCurrentNpc().map((npc, index) => (
        <div 
          key={index}
          style={{
            ...styles.npc, 
            height: npc.size || npc.style?.height,
            ...npc.position,
            ...npc.style
          }}
          onClick={npc.id ? 
            (currentIsland === ISLANDS.ISLAND_1 ? () => handleMissionNpcClick(npc.id) : 
             currentIsland === ISLANDS.ISLAND_2 ? () => handleImageNpcClick(npc.id) :
             () => handleQANpcClick(npc.id)) 
            : npc.onClick}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img 
            src={npc.image}
            alt="NPC"
            style={styles.npcImage}
          />
        </div>
      ))}

      {/* Regular NPC Dialogue */}
      {showDialogue && currentDialogue && (
        <div style={currentDialogue.speaker === 'Glitch' ? styles.glitchDialogueContainer : styles.dialogueContainer}>
          <div style={styles.dialogueBox} onClick={currentDialogue.speaker === 'Glitch' ? () => setShowDialogue(false) : handleDialogueClick}>
            <div style={styles.speaker}>{currentDialogue.speaker}</div>
            <p style={styles.dialogueText}>
              {displayedText}
              {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
            </p>
            {currentDialogue.speaker !== 'Glitch' && (
              <button
                style={styles.continueButton}
                onClick={handleDialogueClick}
              >
                {isTyping ? t('skip') : t('continue')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sparky Dialogue */}
      {showSparkyDialogue && (
        <div style={styles.sparkyDialogueContainer}>
          <div style={styles.sparkyDialogueHeader}>
            <h3 style={styles.sparkyDialogueTitle}>{t('sparkyEnergyManager')}</h3>
            <button style={styles.sparkyCloseButton} onClick={() => {
              setShowSparkyDialogue(false)
              setShowSparkyDebrief(false)
            }}>
              ✕
            </button>
          </div>
          
          <div style={styles.sparkyDialogueContent}>
            {sparkyMessages.map((message, index) => (
              <div key={index}>
                {message.type === 'message' && (
                  <div style={{...styles.sparkyDialogueMessage, position: 'relative'}}>
                    <strong>{message.speaker}:</strong> 
                    <span dangerouslySetInnerHTML={{ 
                      __html: index === sparkyMessages.length - 1 && sparkyIsTyping ? 
                        sparkyTypingText : 
                        message.text.replace(
                          /<span class='highlight'>(.*?)<\/span>/g, 
                          '<span style="background: linear-gradient(90deg, #5170FF, #FFBBC4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">$1</span>'
                        )
                    }} />
                    {index === sparkyMessages.length - 1 && !waitingForChoice && (
                      <button
                        style={styles.continueButton}
                        onClick={handleSparkyContinue}
                      >
                        {sparkyIsTyping ? t('skip') : t('continue')}
                      </button>
                    )}
                  </div>
                )}
                {message.type === 'animation' && (
                  <div style={{...styles.sparkyDialogueMessage, textAlign: 'center', background: '#f0f8ff'}}>
                    <div style={{marginBottom: '10px', fontWeight: 'bold', color: '#5170FF'}}>Animation Sequence</div>
                    <img 
                      src={message.src} 
                      alt={message.alt}
                      style={{maxWidth: '100%', height: 'auto', borderRadius: '8px'}}
                    />
                  </div>
                )}
                {message.type === 'image' && (
                  <div style={{...styles.sparkyDialogueMessage, textAlign: 'center', background: '#fff8f0'}}>
                    <div style={{marginBottom: '10px', fontWeight: 'bold', color: '#FF6B35'}}>Image Display</div>
                    <img 
                      src={message.src} 
                      alt={message.alt}
                      style={{maxWidth: '100%', height: 'auto', borderRadius: '8px'}}
                    />
                  </div>
                )}
                {message.type === 'user_choice' && (
                  <div style={{...styles.sparkyDialogueMessage, background: '#e3f2fd', textAlign: 'right'}}>
                    <strong>You:</strong> {message.text}
                  </div>
                )}
                {message.type === 'quiz_feedback' && (
                  <div style={{...styles.sparkyDialogueMessage, background: message.isCorrect ? '#e8f5e8' : '#ffe8e8'}}>
                    <strong>Sparky:</strong> {message.text}
                  </div>
                )}
              </div>
            ))}
            
            {/* Quiz Choice Buttons */}
            {showQuizChoice && (
              (() => {
                const debriefFlow = getSparkyDebriefFlow(t)
                const currentItem = debriefFlow[debriefStep]
                return currentItem && currentItem.quiz ? (
                  <div style={{marginTop: '20px'}}>
                    <div style={{...styles.sparkyDialogueMessage, background: '#f0f8ff', marginBottom: '15px'}}>
                      <strong>Question:</strong> {currentItem.quiz.question}
                    </div>
                    {currentItem.quiz.choices.map((choice) => (
                      <button
                        key={choice.id}
                        style={{
                          ...styles.sparkyUserChoice,
                          marginBottom: '10px',
                          background: 'rgba(255, 193, 7, 0.1)',
                          border: '2px solid #FFC107',
                          color: '#F57C00'
                        }}
                        onClick={() => handleQuizChoice(choice.id, choice.correct)}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(255, 193, 7, 0.2)'
                          e.target.style.transform = 'scale(1.02)'
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(255, 193, 7, 0.1)'
                          e.target.style.transform = 'scale(1)'
                        }}
                      >
                        [{choice.id}] {choice.text}
                      </button>
                    ))}
                  </div>
                ) : null
              })()
            )}
            
            {/* Choice Button */}
            {waitingForChoice && !showQuizChoice && (
              (() => {
                const sparkyDialogueFlow = showSparkyDebrief ? getSparkyDebriefFlow(t) : getSparkyDialogueFlow(t)
                const currentDialogueItem = sparkyDialogueFlow.find(item => item.id === (showSparkyDebrief ? debriefStep : currentSparkyStep))
                return currentDialogueItem && currentDialogueItem.nextChoice ? (
                  <button 
                    style={styles.sparkyUserChoice}
                    onClick={() => handleSparkyChoice(currentDialogueItem.nextChoice.text, currentDialogueItem.nextChoice.choiceId)}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(81, 112, 255, 0.2)'
                      e.target.style.transform = 'scale(1.02)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(81, 112, 255, 0.1)'
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    👉 {currentDialogueItem.nextChoice.text}
                  </button>
                ) : null
              })()
            )}
          </div>
        </div>
      )}

      {/* Mission Dialogue */}
      {showMissionDialogue && currentMissionNpc && (
        <div style={styles.missionDialogueContainer}>
          <div style={styles.sparkyDialogueHeader}>
            <h3 style={styles.sparkyDialogueTitle}>{t('npcConversation')}</h3>
            <button style={styles.sparkyCloseButton} onClick={() => setShowMissionDialogue(false)}>
              ✕
            </button>
          </div>
          
          <div style={styles.missionDialogueContent}>
            <div style={styles.youSection}>
              YOU:
            </div>
            
            <button 
              style={styles.questionButton}
              onClick={handleShowMissionImage}
              disabled={showNpcResponse}
              onMouseOver={(e) => {
                if (!showNpcResponse) {
                  e.target.style.background = 'rgba(76, 175, 80, 0.2)'
                  e.target.style.transform = 'scale(1.02)'
                }
              }}
              onMouseOut={(e) => {
                if (!showNpcResponse) {
                  e.target.style.background = 'rgba(76, 175, 80, 0.1)'
                  e.target.style.transform = 'scale(1)'
                }
              }}
            >
              {currentMissionNpc.question}
            </button>
            
            {showNpcResponse && (
              <div style={styles.npcResponse}>
                <strong>NPC:</strong> {npcResponseText}
                {isNpcTyping && <span style={{ opacity: 0.5 }}>|</span>}
              </div>
            )}
            
            {showMissionImage && (
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '5px',
              }}>
                {/* Left PASSED button - moved closer to center */}
                <div style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                onClick={() => handleMissionJudgment('passed')}
                >
                  <img 
                    src="/desert/icon/correct.png" 
                    alt="Correct" 
                    style={{
                      width: '100px',
                      height: '100px',
                      marginBottom: '5px',
                    }}
                  />
                  <span style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#4CAF50',
                  }}>
                    {t('passed')}
                  </span>
                </div>

                {/* Center image - enlarged */}
                <div style={{ position: 'relative' }}>
                  <img 
                    src={currentMissionNpc.missionImage}
                    alt="Mission Image"
                    style={{
                      width: '480px',
                      height: '450px',
                      objectFit: 'contain',
                      borderRadius: '8px',
                    }}
                  />
                  
                  {/* Stamp overlay */}
                  {showStamp && (
                    <img 
                      src={stampType === 'passed' ? '/island/icon/passed.png' : '/island/icon/failed.png'}
                      alt={stampType}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '200px',
                        height: '200px',
                        zIndex: 200,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </div>

                {/* Right FAILED button - moved closer to center */}
                <div style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                }}
                onClick={() => handleMissionJudgment('failed')}
                >
                  <img 
                    src="/desert/icon/wrong.png" 
                    alt="Wrong" 
                    style={{
                      width: '100px',
                      height: '100px',
                      marginBottom: '5px',
                    }}
                  />
                  <span style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#F44336',
                  }}>
                    {t('failed')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Circles */}
      {missionActive && (currentIsland === ISLANDS.ISLAND_1 || currentIsland === ISLANDS.ISLAND_2 || currentIsland === ISLANDS.ISLAND_3) && (
        <div style={styles.progressContainer}>
          {/* 9 total circles: Island1 (positions 1,2,3), Island3 (positions 4,5,6), Island2 (positions 7,8,9) */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <div 
              key={num}
              style={{
                ...styles.progressCircle,
                ...(completedMissions.includes(num) ? styles.completedCircle : styles.incompleteCircle)
              }}
            >
              {completedMissions.includes(num) ? num : '?'}
            </div>
          ))}
        </div>
      )}

      {/* Q&A Dialogue for Island 3 */}
      {showQADialogue && currentQANpc && (
        <div style={styles.qaDialogueContainer}>
          {/* Title header - display only, not clickable */}
          <div style={{
            background: '#333',
            color: 'white',
            padding: '12px 40px',
            borderRadius: '25px',
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '15px auto',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            // No cursor pointer - this is display only
          }}>
            {t('questionAndAnswer')}
          </div>
          
          <div style={styles.qaContent}>
            <div style={styles.qaContainer}>
              {showQuestion && (
                <div style={styles.qaSection}>
                  <div style={styles.qaLabel}>Q:</div>
                  <div style={styles.qaQuestionText}>
                    {currentQANpc.question}
                  </div>
                </div>
              )}
              
              {showAnswer && (
                <div style={styles.qaSection}>
                  <div style={styles.qaLabel}>A:</div>
                  <div style={styles.qaTextContent}>
                    {currentQANpc.answer}
                  </div>
                </div>
              )}
              
              {/* Q&A Stamp overlay on container */}
              {showQAStamp && (
                <img 
                  src={qaStampType === 'passed' ? '/island/icon/passed.png' : '/island/icon/failed.png'}
                  alt={qaStampType}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '200px',
                    height: '200px',
                    zIndex: 200,
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
            
            {showAnswer && (
              <div style={styles.qaJudgmentContainer}>
                <button 
                  style={styles.qaJudgmentButton}
                  onClick={() => handleQAJudgment('passed')}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <img 
                    src="/desert/icon/correct.png" 
                    alt="Correct" 
                    style={styles.qaButtonIcon}
                  />
                  <span style={{...styles.qaButtonText, color: '#4CAF50'}}>{t('passed')}</span>
                </button>
                
                <button 
                  style={styles.qaJudgmentButton}
                  onClick={() => handleQAJudgment('failed')}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <img 
                    src="/desert/icon/wrong.png" 
                    alt="Wrong" 
                    style={styles.qaButtonIcon}
                  />
                  <span style={{...styles.qaButtonText, color: '#F44336'}}>{t('failed')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Evaluation Dialogue for Island 2 */}
      {showImageDialogue && currentImageNpc && (
        <div style={styles.imageDialogueContainer}>
          <div style={styles.sparkyDialogueHeader}>
            <h3 style={styles.sparkyDialogueTitle}>{t('imageEvaluation')}</h3>
            <button style={styles.sparkyCloseButton} onClick={() => setShowImageDialogue(false)}>
              ✕
            </button>
          </div>
          
          <div style={styles.imageDialogueContent}>
            <div style={styles.youSection}>
              <div style={styles.youLabel}>YOU:</div>
              <button 
                style={styles.imageQuestionButton}
                onClick={handleShowImageResponse}
                disabled={showImageResponse}
                onMouseOver={(e) => {
                  if (!showImageResponse) {
                    e.target.style.background = 'rgba(76, 175, 80, 0.2)'
                    e.target.style.transform = 'scale(1.02)'
                  }
                }}
                onMouseOut={(e) => {
                  if (!showImageResponse) {
                    e.target.style.background = 'rgba(76, 175, 80, 0.1)'
                    e.target.style.transform = 'scale(1)'
                  }
                }}
              >
                {t('whatThinkImage')}
              </button>
            </div>
            
            {showImageResponse && (
              <>
                <img 
                  src={currentImageNpc.missionImage}
                  alt="Mission Image"
                  style={styles.missionImageDisplay}
                />
                
                <div style={styles.npcSection}>
                  <div style={styles.npcLabel}>NPC:</div>
                  <div style={styles.npcResponseText}>
                    {imageResponseText}
                    {isImageResponseTyping && <span style={{ opacity: 0.5 }}>|</span>}
                  </div>
                  
                  {/* Buttons positioned 5px below NPC content */}
                  {!isImageResponseTyping && (
                    <div style={styles.imageJudgmentContainer}>
                      {/* Image Stamp overlay */}
                      {showImageStamp && (
                        <img 
                          src={imageStampType === 'passed' ? '/island/icon/passed.png' : '/island/icon/failed.png'}
                          alt={imageStampType}
                          style={styles.imageStamp}
                        />
                      )}
                      
                      <button 
                        style={styles.imageJudgmentButton}
                        onClick={() => handleImageJudgment('passed')}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <img 
                          src="/desert/icon/correct.png" 
                          alt="Correct" 
                          style={styles.imageButtonIcon}
                        />
                        <span style={{...styles.qaButtonText, color: '#4CAF50'}}>{t('passed')}</span>
                      </button>
                      
                      <button 
                        style={styles.imageJudgmentButton}
                        onClick={() => handleImageJudgment('failed')}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        <img 
                          src="/desert/icon/wrong.png" 
                          alt="Wrong" 
                          style={styles.imageButtonIcon}
                        />
                        <span style={{...styles.qaButtonText, color: '#F44336'}}>{t('failed')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default IslandMap