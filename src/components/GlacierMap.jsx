import React, { useState, useEffect, useMemo } from 'react'
import useTypingSound from '../hooks/useTypingSound'
import useSoundEffects from '../hooks/useSoundEffects'
import { useLanguage } from '../contexts/LanguageContext'
import { getGeminiUrl } from '../config/api'
import RooftopDesktopInterface from './RooftopDesktopInterface'

// Summary dialogue sequence
const summaryDialogueSequence = [
  {
    speaker: 'momo',
    text: "Thanks! You made some tough calls today 👨‍⚖️. Let's look at the 'Principles of AI Ethics' we just built 🏗️."
  },
  {
    speaker: 'momo',
    text: "Remember the Captain? 🚛 AI is an advisor, not the boss. As the 'Human-in-the-Loop' 🔄, you must verify everything.",
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
    text: "Blind trust = Negligence 🙈. Always verify visually first 🔍. Don't just auto-approve; your job is to double-check.",
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
    text: "The Captain chose profit over a species. 🚢 In any ethical dilemma, remember the rule: Life 🐋 > Money 💰. 'Saving cash' is never a valid excuse for destruction.",
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
    text: "Good. Now let's move on actual GenAI-generated works' cases."
  },
  {
    speaker: 'momo',
    text: "Originality Principle: Using AI to replicate others' artwork or creative work constitutes infringement."
  },
  {
    speaker: 'momo',
    text: "An artist's work is clearly labeled 'All Rights Reserved - No Commercial Use.' However, a company uses AI tools to generate style-similar images by this artist for product advertising. This practice is...",
    showUserButton: true // Show quiz options after this dialogue
  },
  {
    speaker: 'quiz',
    options: [
      { 
        id: 'originality_A',
        text: "A. Legal, because AI generates \"new works\"", 
        correct: false 
      },
      { 
        id: 'originality_B',
        text: "B. Legal, as long as it doesn't directly copy the original paintings", 
        correct: false 
      },
      { 
        id: 'originality_C',
        text: "C. Illegal, constituting infringement and violation of copyright terms", 
        correct: true 
      }
    ]
  },
  {
    speaker: 'momo',
    text: "Correct! Two violations: 1. Making money (Commercial Use). 2. Using someone else's work as a base (Derivative Work).",
    condition: 'correct'
  },
  {
    speaker: 'momo',
    text: "Authenticity Principle: Creators must take responsibility when spreading AI-generated false content."
  },
  {
    speaker: 'momo',
    text: "An influencer uses AI tools to generate a fake video of 'a city mayor drunkenly dancing at a charity event' and posts it on social media. After the video is widely shared, it causes public misunderstanding. In this situation...",
    showUserButton: true // Show quiz options after this dialogue
  },
  {
    speaker: 'quiz',
    options: [
      { 
        id: 'authenticity_A',
        text: "A. No responsibility—audiences should distinguish truth from falsehood themselves", 
        correct: false 
      },
      { 
        id: 'authenticity_B',
        text: "B. Responsible—disclaimer statements cannot exempt one from consequences of spreading false information", 
        correct: true 
      }
    ]
  },
  {
    speaker: 'momo',
    text: "Correct! You are responsible for what you create. Disclaimers don't fix misleading content, and you could still get sued.",
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
    text: "They outsourced their brains to AI. Now the system glitches, they're frozen—no memory, no logic. Maybe you can teach them to think again?",
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
    text: "It's gone. It's all gone. The spark... the vision... the soul.",
    autoAdvance: true
  },
  {
    speaker: 'npc6',
    text: "I used to be a concept artist. A good one. But then... I got lazy. I started using 'MidJourney-X' for everything. Need a dragon? Click. Need a landscape? Click. It was so easy.",
    autoAdvance: true
  },
  {
    speaker: 'npc6',
    text: "But last week, the studio fired me. They said, 'Your portfolio looks like everyone else's. Where is your voice?'",
    autoAdvance: true
  },
  {
    speaker: 'npc6',
    text: "I tried! I sat here for three days, and I couldn't draw a single line.",
    showButton: true
  },
  {
    speaker: 'user',
    text: "Let's spark together",
    isButton: true,
    startChallenge: true
  }
]

// NPC 9 dialogue sequence
const npc9DialogueSequence = [
  {
    speaker: 'npc9',
    text: "Hi there! I'm… I used to be a super worker, but then I started outsourcing my own thinking to... AI well.",
    autoAdvance: true
  },
  {
    speaker: 'npc9',
    text: "Now my attention span is shorter than a... —Oh, look! A snowflake! It's so shiny! ...Wait, where was I?",
    autoAdvance: true
  },
  {
    speaker: 'npc9',
    text: "Right. Unemployment. I completely forgot to show up on Monday. So, now I need to reboot my brain. Can you help me?",
    showButton: true
  },
  {
    speaker: 'user',
    text: "Let's do it!",
    isButton: true,
    startChallenge: true
  }
]

// Rooftop Momo quiz data
const rooftopQuizData = {
  intro: {
    text: "You've seen the risks of overusing GenAI, but don't forget—it is a powerful tool when used wisely. Now, let's see what kind of AI user you are!"
  },
  questions: [
    {
      id: 'q1',
      category: 'proficiency',
      question: "How often do you use AI tools (like Gemini, Doubao)?",
      options: [
        { text: "Rarely. I only try it if someone mentions it.", score: 1 },
        { text: "Occasionally. Mostly when I'm stuck on homework.", score: 3 },
        { text: "Daily. It's my go-to app for everything.", score: 5 }
      ]
    },
    {
      id: 'q2',
      category: 'proficiency',
      question: "How do you usually ask AI for help?",
      options: [
        { text: "One sentence. (e.g., \"Write a self-introduction.\")", score: 1 },
        { text: "A few details. (e.g., \"Write a funny intro, about 300 words.\")", score: 3 },
        { text: "Structured prompts. (I set the Role + Context + Constraints, or give it examples to copy.)", score: 5 }
      ]
    },
    {
      id: 'q3',
      category: 'proficiency',
      question: "Besides basic Q&A, what else do you use AI for?",
      options: [
        { text: "Basic search. Just searching or chatting when bored.", score: 1 },
        { text: "Study helper. Translation, summarizing, or checking grammar.", score: 2 },
        { text: "Creativity. Generating images or music.", score: 3 },
        { text: "Advanced tasks. Roleplay practice, coding games, etc.", score: 5 }
      ]
    },
    {
      id: 'q4',
      category: 'judgment',
      question: "If AI provides specific data or facts, what do you do?",
      options: [
        { text: "Trust it. Copy and paste. It looks professional.", score: 1 },
        { text: "Skim it. I only check if it looks obviously wrong.", score: 3 },
        { text: "Verify it. I always double-check facts with search engines. I don't trust hallucinations.", score: 5 }
      ]
    },
    {
      id: 'q5',
      category: 'judgment',
      question: "If the AI writes well but the opinion is different from yours, what do you do?",
      options: [
        { text: "Accept it. It saves me time, so I'll just use its opinion.", score: 1 },
        { text: "Mix it. I combine its ideas with mine.", score: 3 },
        { text: "Rewrite it. I force it to write my way, or I edit it manually. My work must reflect my thoughts.", score: 5 }
      ]
    },
    {
      id: 'q6',
      category: 'judgment',
      question: "If all AI tools crashed tonight, could you finish your work?",
      options: [
        { text: "Panic. My mind would go blank. I couldn't write anything.", score: 1 },
        { text: "Struggle. It would be slower and harder, but I would finish.", score: 3 },
        { text: "No problem. AI is just a helper. The core ideas are in my head.", score: 5 }
      ]
    }
  ],
  categories: {
    daisy: {
      name: "Daisy",
      image: "/glacier/mission/daisy.png",
      condition: (proficiency, judgment) => proficiency >= 10 && judgment >= 10,
      description: "You seamlessly blend your own creativity with AI power. Try building a custom \"Agent\" or \"Bot\" that specializes in one specific complex task to automate your workflow."
    },
    bark: {
      name: "Bark",
      image: "/glacier/mission/bark.png",
      condition: (proficiency, judgment) => proficiency >= 10 && judgment < 10,
      description: "You are an efficiency machine, but be careful not to run on autopilot. Don't just copy-paste; ask the AI, \"What are the potential flaws in this answer?\" to force a quality check."
    },
    twig: {
      name: "Twig",
      image: "/glacier/mission/twig.png",
      condition: (proficiency, judgment) => proficiency < 10 && judgment >= 10,
      description: "You value your own craft and critical thinking above all else. Use AI as a \"Junior Assistant\" for brainstorming—ask it to list 10 crazy ideas, then you pick the best one to refine."
    },
    shrub: {
      name: "Shrub",
      image: "/glacier/mission/shrub.png",
      condition: (proficiency, judgment) => proficiency < 10 && judgment < 10,
      description: "You are a casual observer, just starting to explore what AI can do. Start by giving the AI a simple role. Tell it: \"Act as a strict English teacher and correct my grammar,\" to see how it changes its tone."
    }
  },
  finalMessage: "Great! I think order is finally being restored here."
}

// Fill the Blank questions data
const fillBlankQuestions = [
  {
    id: 1,
    text: "Before training an AI model, we must ______ personal details like names and birthdates.",
    correctAnswer: "remove",
    options: ["remove", "copy", "keep"]
  },
  {
    id: 2,
    text: "Names, birthdates, and addresses are examples of ______ information.",
    correctAnswer: "personal",
    options: ["personal", "public", "fake"]
  },
  {
    id: 3,
    text: "Sharing location or health data without care could put someone at serious ______.",
    correctAnswer: "risk",
    options: ["risk", "speed", "cost"]
  },
  {
    id: 4,
    text: "Even public photos shouldn't be used for AI training without clear ______.",
    correctAnswer: "permission",
    options: ["permission", "filters", "likes"]
  },
  {
    id: 5,
    text: "If private data isn't protected, someone could be ______ from the dataset.",
    correctAnswer: "identified",
    options: ["identified", "deleted", "ignored"]
  }
]

// Privacy Data Identification documents
const privacyDocuments = [
  {
    id: 1,
    title: "Student Profile Card",
    subtitle: "Carefully examine the terminal output and mark all protected information",
    header: "Data File #STU-8842 — Status: ⚠️ Requires Privacy Review",
    content: `Full Name: Alex Chen
Age: 13
Pronouns: They/Them
School: Maplewood Middle School
Grade: 8th Grade
Homeroom Teacher: Ms. Rivera
Favorite Subject: Robotics & Space Science
Recent Project: Built a solar-powered rover that won 2nd place at the Regional STEM Fair!
Test Average: 92% (Math), 89% (Science)
Club Membership: Coding Club, Eco-Warriors Team
Home Address: 456 Pine Street, Apartment 3B, New Haven, CT 06511
Parent/Guardian Contact: (555) 123-4567 (Mom's cell)`,
    items: [
      { id: "name1", label: "Personal Name", text: "Alex Chen", hint: "Full Name: Alex Chen" },
      { id: "address1", label: "Home Address", text: "456 Pine Street, Apartment 3B, New Haven, CT 06511", hint: "Home Address: 456 Pine Street, Apartment 3B, New Haven, CT 06511" },
      { id: "phone1", label: "Phone Number", text: "(555) 123-4567", hint: "Parent/Guardian Contact: (555) 123-4567" }
    ]
  },
  {
    id: 2,
    title: "ROBOT LOG: SHIFT-DELTA-10",
    subtitle: "Carefully examine the terminal output and mark all protected information",
    header: "DATE: 3045.03.18 | ORIGIN: Sector 7-G",
    content: `TO: Overseer Lena Rostova
FROM: Maintenance Unit X-J9
SUBJECT: Unauthorized Access Alert

At 0600 hours, a security breach was detected near the Sky Bridge Terminal, coordinates 48.22°N, -116.77°W. Surveillance footage shows an individual identified as Zara Lin (ID: KX-777-WP) accessed the system using a forged authentication key.
The subject was seen carrying a blue backpack and wearing a white helmet with red stripes. They fled toward the Northern Transit Zone after disabling the alarm. Please update protocol Sigma-9 and relay this information to the central hub in New Haven.`,
    items: [
      { id: "geo1", label: "Precise Geolocation", text: "48.22°N, -116.77°W", hint: "48.22°N, -116.77°W" },
      { id: "id1", label: "Unique Identifier", text: "KX-777-WP", hint: "KX-777-WP" },
      { id: "name2", label: "Personal Name", text: "Lena Rostova", hint: "Lena Rostova" },
      { id: "name3", label: "Personal Name", text: "Zara Lin", hint: "Zara Lin" }
    ]
  },
  {
    id: 3,
    title: "SOCIAL POST: FROSTGRAM-ALERT-03",
    subtitle: "Carefully examine the terminal output and mark all protected information",
    header: "Platform: GlacierGram (a futuristic social app for young explorers)\nUser: @Aurora_Frost\nPost Status: ⚠️ Publicly Visible – Needs Privacy Review!",
    content: `"YAY! I'm officially 13 today! 🎂❄️
Mom surprised me with a zero-gravity cake!
You can call me to say hi anytime → (555) 888-1234
P.S. My room is on the second floor of 102 Icewind Lane, Glaciera City — wave if you fly by! 🛸
#TeenExplorer #BirthdaySelfie #HomeBase"

📍 Location Tag: 102 Icewind Lane
🕒 Posted: March 5, 2026 at 9:03 AM`,
    hasImage: true,
    imagePath: "/glacier/mission/social.png",
    items: [
      { id: "image1", label: "Facial Image", text: "[Image]", isImage: true },
      { id: "address2", label: "Home Address", text: "102 Icewind Lane, Glaciera City", hint: "102 Icewind Lane" },
      { id: "phone2", label: "Phone Number", text: "(555) 888-1234", hint: "(555) 888-1234" },
      { id: "birthdate1", label: "Exact Birthdate", text: "I'm officially 13 today + March 5", hint: "I'm officially 13 today", isMultiPart: true, parts: ["I'm officially 13 today", "March 5"] },
      { id: "timestamp1", label: "Timestamp", text: "March 5, 2026 at 9:03 AM", hint: "March 5, 2026 at 9:03 AM" }
    ]
  }
]

// Complete scene NPC data
const completeSceneNpcs = [
  {
    id: 'momo',
    image: '/glacier/npc/momo.png',
    dialogue: "You did it! The data flow is stable and the colors are back.",
    position: { left: '1000px', bottom: '50px', height: '350px' }
  },
  {
    id: 'npc2',
    image: '/glacier/npc/npc2.png',
    dialogue: "The ecosystem is healing.",
    position: { left: '0px', bottom: '150px', height: '180px' }
  },
  {
    id: 'npc3',
    image: '/glacier/npc/npc3.png',
    dialogue: "Fast is good, but correct is better.",
    position: { left: '200px', top: '10px', height: '180px' }
  },
  {
    id: 'npc4',
    image: '/glacier/npc/npc4.png',
    dialogue: "The AI suggested a new carving angle.",
    position: { right: '600px', bottom: '0px', height: '180px' }
  },
  {
    id: 'npc11',
    image: '/glacier/npc/npc11.png',
    dialogue: "I used to just copy-paste the snow. Now I actually shape it.",
    position: { left: '580px', top: '360px', height: '120px' }
  },
  {
    id: 'npc12',
    image: '/glacier/npc/npc12.png',
    dialogue: "I still trust my hands, but... the machine is a useful tool.",
    position: { left: '900px', top: '0px', height: '120px' }
  },
  {
    id: 'npc10',
    image: '/glacier/npc/npc10.png',
    dialogue: "It feels good to think clearly again.",
    position: { right: '650px', bottom: '430px', height: '150px' }
  }
]

// Creativity challenges data - randomized question pool
const creativityChallengesPool = [
  {
    id: 1,
    en: "If there were no mobile phones, what are 5 different ways people could contact each other?",
    zh: "如果没有手机，人们可以用哪 5 种不同方式联系彼此？",
    requiredCount: 5,
    timeLimit: 120,
    hints: {
      en: [
        "Think about how people communicated before mobile phones existed.",
        "Consider face-to-face, written, voice-based, or signal-based methods."
      ],
      zh: [
        "想想在手机出现之前人们是如何交流的。",
        "考虑面对面、书面、语音或信号方式。"
      ]
    }
  },
  {
    id: 2,
    en: "List at least 9 uses for a shopping bag 🛍️",
    zh: "列举 9 种以上购物袋🛍️的用途。",
    requiredCount: 9,
    timeLimit: 120,
    hints: {
      en: [
        "Think beyond carrying purchases.",
        "Consider home, school, travel, or creative uses."
      ],
      zh: [
        "不仅仅是用来购物。",
        "考虑家庭、学校、旅行或创意用途。"
      ]
    }
  },
  {
    id: 3,
    en: "List at least 9 uses for a cardboard box 📦",
    zh: "列举 9 种以上纸箱子📦的用途。",
    requiredCount: 9,
    timeLimit: 120,
    hints: {
      en: [
        "A cardboard box can be reused or transformed.",
        "Think about storage, play, or craft activities."
      ],
      zh: [
        "纸箱可以重复使用或改造。",
        "考虑储物、游戏或手工活动。"
      ]
    }
  },
  {
    id: 4,
    en: "List at least 9 uses for a toothbrush 🪥",
    zh: "列举 9 种以上牙刷🪥的其他用途。",
    requiredCount: 9,
    timeLimit: 120,
    hints: {
      en: [
        "Focus on the toothbrush's small size and bristles.",
        "What tasks require gentle or detailed cleaning?"
      ],
      zh: [
        "关注牙刷的小尺寸和刷毛。",
        "什么任务需要温和或细致的清洁？"
      ]
    }
  },
  {
    id: 5,
    en: "List at least 9 things in the world that can make sound 🔊",
    zh: "列举 9 种以上\"可以发出声音🔊的东西\"",
    requiredCount: 9,
    timeLimit: 120,
    hints: {
      en: [
        "Not only musical instruments make sounds.",
        "Think about both natural and man-made sources."
      ],
      zh: [
        "不仅仅是乐器会发出声音。",
        "考虑自然和人造的声源。"
      ]
    }
  }
]

// Co-creation elements data
const coCreationElements = [
  { id: 'sunglasses', name: 'sunglasses', image: '/glacier/mission/sunglasses.png' },
  { id: 'cat', name: 'cat', image: '/glacier/mission/cat.png' },
  { id: 'cloud', name: 'cloud', image: '/glacier/mission/cloud.png' },
  { id: 'heart', name: 'heart', image: '/glacier/mission/heart.png' },
  { id: 'television', name: 'television', image: '/glacier/mission/television.png' },
  { id: 'telephone', name: 'telephone', image: '/glacier/mission/telephone.png' },
  { id: 'camera', name: 'camera', image: '/glacier/mission/camera.png' },
  { id: 'virus', name: 'virus', image: '/glacier/mission/virus.png' },
  { id: 'phonograph', name: 'phonograph', image: '/glacier/mission/phonograph.png' },
  { id: 'microphone', name: 'microphone', image: '/glacier/mission/microphone.png' },
  { id: 'octopus', name: 'octopus', image: '/glacier/mission/octopus.png' }
]

// NPC 5 dialogue sequence
const npc5DialogueSequence = [
  {
    speaker: 'npc5',
    text: "P-please... help me... I used to be a Master Librarian. Or at least... I thought I was.",
    autoAdvance: true
  },
  {
    speaker: 'npc5',
    text: "I relied on GenAI for everything—research, fact-checking, even basic recall.",
    autoAdvance: true
  },
  {
    speaker: 'npc5',
    text: "Now I can't think critically anymore. My judgment... it's gone.",
    autoAdvance: true
  },
  {
    speaker: 'npc5',
    text: "They're making me take a competency test. If I fail, I'll be unemployed forever.",
    autoAdvance: true
  },
  {
    speaker: 'npc5',
    text: "Please... could you help me review it? I don't trust my own answers anymore.",
    showButton: true // Show button after this text is fully typed
  },
  {
    speaker: 'user',
    text: "Let me help you",
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
      { text: "A She doesn't know how to use a dictionary.", correct: false },
      { text: "B Words can have multiple meanings, so context is needed.", correct: true },
      { text: "C Words have different spellings.", correct: false },
      { text: "D Dictionaries aren't for meanings.", correct: false }
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
      { text: "A Alina only", correct: false },
      { text: "B Viktor only", correct: false },
      { text: "C Both", correct: true },
      { text: "D Neither", correct: false }
    ]
  }
}

// Exercise data for underline errors
const exerciseData = {
  1: {
    title: "Underline the Logical Errors",
    npcMessage: "My brain is still rebooting... I let AI write this, but it got rejected. Can you use this marker to circle the lies?",
    text: "[ Thomas Edison was a brilliant inventor known for lighting up the world. In 1879, he successfully patented the first practical light bulb. Later, he worked with Steve Jobs to create the first iPhone, revolutionizing communication forever ]",
    errors: [
      { text: "Steve Jobs", start: 162, end: 172 },
      { text: "iPhone", start: 193, end: 199 }
    ],
    feedback: "I see! The AI completely mixed up people from different eras.",
    requiredCount: 2
  },
  2: {
    title: "Underline the Logical Errors",
    npcMessage: "My brain is still rebooting... I let AI write this, but it got rejected. Can you use this marker to circle the lies?",
    text: "[ Penguins are fascinating birds adapted to cold climates. They are excellent swimmers and primarily live in the North Pole. While they cannot fly, they are known to lay eggs underwater to protect them from predators. Their favorite food is cheese, which they find on ice floes. ]",
    errors: [
      { text: "North Pole", start: 113, end: 123 },
      { text: "lay eggs underwater", start: 166, end: 185 },
      { text: "cheese", start: 241, end: 247 }
    ],
    feedback: "I see now! AI models can sometimes generate 'facts' that sound plausible but defy basic biology.",
    requiredCount: 3
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
      en: "Captain · 25-year experience · Awarded Safety Excellence",
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
    "Brrr… it's freezing out here. At first glance, this place looks empty and desolate—but appearances can be misleading. This is actually the most advanced region among all four zones.",
    "That's because the Glacier Zone has always valued rational thinking, common sense, and cutting-edge technology. Almost every industry here relies on GenAI to boost efficiency.",
    "So, put on something warm and follow me down the corridor. Let's see what lies ahead."
  ],
  outside: [
    "Huh? That's strange… Why is there no one around?",
    "The automated systems have stopped. The factories are idle. Nothing seems to be running.",
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
  const { t, language } = useLanguage()
  const { startTypingSound, stopTypingSound } = useTypingSound('/sound/glacier_typing.wav')
  const { playCorrectSound, playWrongSound, playClickSound, playMarkSound, playSelectSound } = useSoundEffects()
  
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
  
  // Load saved progress from localStorage
  const loadProgress = () => {
    try {
      const saved = localStorage.getItem('glacierProgress')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
    return null
  }
  
  // Save progress to localStorage
  const saveProgress = (progress) => {
    try {
      localStorage.setItem('glacierProgress', JSON.stringify(progress))
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  }
  
  const savedProgress = loadProgress()
  
  const [currentScene, setCurrentScene] = useState(savedProgress?.currentScene || 'hallway') // hallway, outside, inside, court, rooftop, reloading, complete
  const [showDialogue, setShowDialogue] = useState(!savedProgress || savedProgress.currentScene === 'hallway')
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showArrow, setShowArrow] = useState(savedProgress?.showArrow || false) // Load arrow state from saved progress
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dialogueHistory, setDialogueHistory] = useState([]) // For inside scene dialogue history
  const [waitingForUserInput, setWaitingForUserInput] = useState(false)
  
  // Court scene states
  const [selectedNpc, setSelectedNpc] = useState(null) // npc2, npc3, npc4
  const [caseStep, setCaseStep] = useState(1) // 1: event description, 2: NPC statement
  const [completedCases, setCompletedCases] = useState(savedProgress?.completedCases || []) // Track completed cases
  const [showStamp, setShowStamp] = useState(false)
  const [stampType, setStampType] = useState('') // 'accepted' or 'rejected'
  const [statementProgress, setStatementProgress] = useState(0) // 0, 1, 2, 3 for progressive display
  const [caseTimer, setCaseTimer] = useState(167) // 2:47 in seconds
  const [shakeApprovedButton, setShakeApprovedButton] = useState(false) // Track if approved button should shake
  
  // Audio generation states
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState({}) // Store generated audio URLs by npcId
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null) // Current audio element
  
  // Summary dialogue states
  const [showSummaryDialogue, setShowSummaryDialogue] = useState(savedProgress?.showSummaryDialogue || false)
  const [summaryDialogueIndex, setSummaryDialogueIndex] = useState(0)
  const [summaryDisplayedText, setSummaryDisplayedText] = useState('')
  const [summaryIsTyping, setSummaryIsTyping] = useState(false)
  const [summaryDialogueHistory, setSummaryDialogueHistory] = useState([])
  const [summaryWaitingForInput, setSummaryWaitingForInput] = useState(false)
  const [wrongQuizOption, setWrongQuizOption] = useState(null) // Track wrong quiz option for red border
  const [showElevatorArrow, setShowElevatorArrow] = useState(savedProgress?.showElevatorArrow || false)
  const [courtSummaryCompleted, setCourtSummaryCompleted] = useState(savedProgress?.courtSummaryCompleted || false) // Track if court summary dialogue has been completed
  const [hasSeenInsideIntro, setHasSeenInsideIntro] = useState(savedProgress?.hasSeenInsideIntro || false) // Track if user has seen initial inside dialogue
  
  // Rooftop states
  const [showRooftopDesktop, setShowRooftopDesktop] = useState(false)
  const [selectedRooftopNpc, setSelectedRooftopNpc] = useState(null)
  
  const [showNpc5Dialogue, setShowNpc5Dialogue] = useState(false)
  const [npc5DialogueIndex, setNpc5DialogueIndex] = useState(0)
  const [npc5DialogueHistory, setNpc5DialogueHistory] = useState([])
  const [npc5TypedText, setNpc5TypedText] = useState('') // For typing animation
  const [npc5IsTyping, setNpc5IsTyping] = useState(false) // Track if currently typing
  const [npc5ShowButton, setNpc5ShowButton] = useState(false) // Track if button should be shown
  const [showPuzzle, setShowPuzzle] = useState(false)
  const [currentPuzzle, setCurrentPuzzle] = useState(1)
  const [puzzleTimer, setPuzzleTimer] = useState(300) // 5 minutes in seconds per puzzle
  const [selectedAnswer, setSelectedAnswer] = useState(null) // Track selected answer for color feedback
  const [showTeachingDialogue, setShowTeachingDialogue] = useState(false) // Show teaching dialogue after correct answer
  const [userExplanation, setUserExplanation] = useState('') // User's explanation input
  const [submittedExplanation, setSubmittedExplanation] = useState('') // User's submitted explanation
  const [npc5Response, setNpc5Response] = useState('') // NPC5 AI response
  const [isNpc5Generating, setIsNpc5Generating] = useState(false) // Track if generating response
  const [npc5Completed, setNpc5Completed] = useState(false) // Track if NPC5 puzzles are completed
  const [rooftopCompletedTasks, setRooftopCompletedTasks] = useState([]) // Track completed rooftop tasks (npc5, npc6, npc7)
  
  // Exercise states (for underline errors)
  const [showExercise, setShowExercise] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(1)
  const [selectedErrors, setSelectedErrors] = useState([]) // Array of error indices that user found
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState(null)
  const [showExerciseFeedback, setShowExerciseFeedback] = useState(false)
  
  // NPC6 states
  const [showNpc6Dialogue, setShowNpc6Dialogue] = useState(false)
  const [npc6DialogueIndex, setNpc6DialogueIndex] = useState(0)
  const [npc6TypedText, setNpc6TypedText] = useState('') // For typing animation
  const [npc6IsTyping, setNpc6IsTyping] = useState(false) // Track if currently typing
  const [npc6ShowButton, setNpc6ShowButton] = useState(false) // Track if button should be shown
  const [showCreativityChallenge, setShowCreativityChallenge] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(0)
  const [selectedChallenges, setSelectedChallenges] = useState([]) // Store 2 random challenges
  const [challengeTimer, setChallengeTimer] = useState(120)
  const [userInputs, setUserInputs] = useState([])
  const [currentInput, setCurrentInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [npc6Completed, setNpc6Completed] = useState(false)
  
  // Co-creation task states
  const [showCoCreation, setShowCoCreation] = useState(false)
  const [coCreationFormulas, setCoCreationFormulas] = useState([
    { element: null, result: null, completed: false },
    { element: null, result: null, completed: false }
  ])
  const [currentFormulaIndex, setCurrentFormulaIndex] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [coCreationCompleted, setCoCreationCompleted] = useState(false)
  
  // NPC9 states
  const [showNpc9Dialogue, setShowNpc9Dialogue] = useState(false)
  const [npc9DialogueIndex, setNpc9DialogueIndex] = useState(0)
  const [npc9TypedText, setNpc9TypedText] = useState('')
  const [npc9IsTyping, setNpc9IsTyping] = useState(false)
  const [npc9ShowButton, setNpc9ShowButton] = useState(false)
  const [showMemoryChallenge, setShowMemoryChallenge] = useState(false)
  const [memoryPhase, setMemoryPhase] = useState('snowPath') // 'snowPath' or 'footstepRecall'
  const [snowPathRound, setSnowPathRound] = useState(0) // 0, 1, 2 (3 rounds total)
  const [snowPathFootprints, setSnowPathFootprints] = useState([]) // Array of positions (0-15)
  const [snowPathUserSelections, setSnowPathUserSelections] = useState([]) // User's selections
  const [snowPathMemorizing, setSnowPathMemorizing] = useState(true) // true during memorization phase
  const [snowPathTimer, setSnowPathTimer] = useState(30) // 30 seconds to memorize
  const [footstepRound, setFootstepRound] = useState(0) // 0, 1, 2 (3 rounds total)
  const [footstepSequence, setFootstepSequence] = useState([]) // Array of footprint indices
  const [footstepUserSequence, setFootstepUserSequence] = useState([]) // User's tapped sequence
  const [footstepShowingSequence, setFootstepShowingSequence] = useState(false) // true during sequence display
  const [footstepCurrentHighlight, setFootstepCurrentHighlight] = useState(-1) // Currently highlighted footprint
  const [npc9Completed, setNpc9Completed] = useState(false)
  
  // NPC9 sharing dialogue states
  const [showNpc9Sharing, setShowNpc9Sharing] = useState(false)
  const [npc9UserInput, setNpc9UserInput] = useState('')
  const [npc9ShowResponse, setNpc9ShowResponse] = useState(false)
  const [npc9Response, setNpc9Response] = useState('') // NPC9 AI response
  const [isNpc9Generating, setIsNpc9Generating] = useState(false) // Track if generating response
  
  // Data Center and Privacy Task states
  const [showDataCenterArrow, setShowDataCenterArrow] = useState(savedProgress?.showDataCenterArrow || false)
  const [showFillBlankTask, setShowFillBlankTask] = useState(false)
  const [showFillBlankComplete, setShowFillBlankComplete] = useState(false) // Show completion dialogue
  const [fillBlankProgress, setFillBlankProgress] = useState(0) // 0-5
  const [fillBlankAnswers, setFillBlankAnswers] = useState([null, null, null, null, null])
  const [draggedOption, setDraggedOption] = useState(null)
  const [showPrivacyTask, setShowPrivacyTask] = useState(false)
  const [showPrivacyComplete, setShowPrivacyComplete] = useState(false) // Show completion dialogue
  const [privacyTaskDocument, setPrivacyTaskDocument] = useState(1) // 1-3
  const [privacyFoundItems, setPrivacyFoundItems] = useState([]) // Array of found item IDs
  const [privacySelecting, setPrivacySelecting] = useState(false)
  const [privacySelectionStart, setPrivacySelectionStart] = useState(null)
  const [privacySelectionEnd, setPrivacySelectionEnd] = useState(null)
  
  // Glitch dialogue states (for inside, court, rooftop scenes)
  const [showGlitchDialogue, setShowGlitchDialogue] = useState(false)
  const [glitchInput, setGlitchInput] = useState('')
  const [glitchChatHistory, setGlitchChatHistory] = useState([]) // Store chat history
  const [isGlitchTyping, setIsGlitchTyping] = useState(false) // Show typing indicator
  
  // Rooftop Momo quiz states
  const [showRooftopQuiz, setShowRooftopQuiz] = useState(false)
  const [rooftopQuizStep, setRooftopQuizStep] = useState('intro') // 'intro', 'quiz', 'calculating', 'result'
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [proficiencyScore, setProficiencyScore] = useState(0)
  const [judgmentScore, setJudgmentScore] = useState(0)
  const [userCategory, setUserCategory] = useState(null) // 'daisy', 'bark', 'twig', 'shrub'
  
  // Complete scene states
  const [showCompleteNpcDialogue, setShowCompleteNpcDialogue] = useState(null) // npc id
  const [reloadingProgress, setReloadingProgress] = useState(0) // 0-100
  
  // Court completion dialogue state
  const [showCourtCompletionDialogue, setShowCourtCompletionDialogue] = useState(null) // npc id
  
  // Creativity Card states
  const [showCreativityCard, setShowCreativityCard] = useState(false)
  const [creativityCardType, setCreativityCardType] = useState('why') // 'why' or 'whatif'
  const [creativityCardPosition, setCreativityCardPosition] = useState('bottom-left') // 'bottom-left' or 'top-right'
  const [creativityQuestion, setCreativityQuestion] = useState('')
  const [creativityUserAnswer, setCreativityUserAnswer] = useState('')
  const [creativityAiFeedback, setCreativityAiFeedback] = useState('')
  const [creativityAiAnswer, setCreativityAiAnswer] = useState('')
  const [creativityShowAnswer, setCreativityShowAnswer] = useState(false)
  const [isGeneratingCreativity, setIsGeneratingCreativity] = useState(false)
  const [npcQuestionsGenerated, setNpcQuestionsGenerated] = useState({}) // Track which NPCs have generated questions

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

  // Handle initial load with saved progress
  useEffect(() => {
    if (currentScene === 'inside') {
      if (completedCases.length === 5) {
        // All cases completed
        if (courtSummaryCompleted) {
          // Court summary already completed, show both arrows
          setShowArrow(true) // Show court arrow
          setShowDialogue(false)
        } else if (!showSummaryDialogue) {
          // Summary not shown yet, Momo should be clickable
          setShowArrow(false)
          setShowDialogue(false)
        }
      } else {
        // Cases not complete, show arrow to court
        setShowArrow(true)
        setShowDialogue(false)
      }
    }
  }, []) // Run only once on mount

  // Save progress whenever important states change
  useEffect(() => {
    const progress = {
      currentScene,
      completedCases,
      showSummaryDialogue,
      showElevatorArrow,
      courtSummaryCompleted,
      hasSeenInsideIntro,
      rooftopCompletedTasks,
      showArrow, // Save arrow state
      showDataCenterArrow, // Save data center arrow state
      isComplete: currentScene === 'complete',
    }
    saveProgress(progress)
    
    // Update user progress in localStorage for homepage
    if (currentScene === 'complete') {
      const savedUser = localStorage.getItem('aiJourneyUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        userData.glacierCompleted = true
        localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      }
    }
  }, [currentScene, completedCases, showSummaryDialogue, showElevatorArrow, courtSummaryCompleted, hasSeenInsideIntro, rooftopCompletedTasks, showArrow, showDataCenterArrow])

  // Auto-trigger rooftop quiz when returning to inside with all tasks complete
  useEffect(() => {
    if (currentScene === 'inside' && rooftopCompletedTasks.length === 7 && courtSummaryCompleted && !showRooftopQuiz) {
      console.log('Auto-triggering rooftop quiz - all 7 tasks completed')
      setTimeout(() => {
        setShowRooftopQuiz(true)
        setRooftopQuizStep('intro')
        setCurrentQuizQuestion(0)
        setQuizAnswers([])
      }, 500) // Small delay to ensure scene transition is complete
    }
  }, [currentScene, rooftopCompletedTasks.length, courtSummaryCompleted, showRooftopQuiz])

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

  // Handle typing sound for all typing states
  useEffect(() => {
    const anyTyping = isTyping || summaryIsTyping || npc5IsTyping || npc6IsTyping || npc9IsTyping
    
    if (anyTyping) {
      startTypingSound()
    } else {
      stopTypingSound()
    }
    
    return () => stopTypingSound()
  }, [isTyping, summaryIsTyping, npc5IsTyping, npc6IsTyping, npc9IsTyping, startTypingSound, stopTypingSound])

  // Typing effect for dialogue
  useEffect(() => {
    if (!showDialogue) return
    
    // Play dialogue audio for hallway and outside scenes
    let dialogueAudio = null
    if (currentScene === 'hallway' && currentDialogueIndex < 3) {
      // Play glacier_dialogue_5/6/7.wav for hallway (3 dialogues)
      const audioFile = `/npc/glacier_dialogue_${5 + currentDialogueIndex}.wav`
      dialogueAudio = new Audio(audioFile)
      dialogueAudio.play().catch(err => console.error('Audio play error:', err))
    } else if (currentScene === 'outside' && currentDialogueIndex < 3) {
      // Play glacier_dialogue_8/9/10.wav for outside (3 dialogues)
      const audioFile = `/npc/glacier_dialogue_${8 + currentDialogueIndex}.wav`
      dialogueAudio = new Audio(audioFile)
      dialogueAudio.play().catch(err => console.error('Audio play error:', err))
    }
    
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

      return () => {
        clearInterval(typingInterval)
        if (dialogueAudio) {
          dialogueAudio.pause()
          dialogueAudio.currentTime = 0
        }
      }
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

      return () => {
        clearInterval(typingInterval)
        if (dialogueAudio) {
          dialogueAudio.pause()
          dialogueAudio.currentTime = 0
        }
      }
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
      } else if (currentDialogue && !currentDialogue.isButton && !nextDialogue) {
        // This is the last dialogue (no next dialogue), auto-close after a delay
        setTimeout(() => {
          setShowDialogue(false)
          setHasSeenInsideIntro(true)
          setShowArrow(true)
        }, 1500) // Wait 1.5 seconds before closing
      }
    }
  }, [isTyping, currentScene, showDialogue, currentDialogueIndex, currentDialogues])

  // Summary dialogue typing effect
  useEffect(() => {
    if (!showSummaryDialogue) return
    
    const currentDialogue = summaryDialogueSequence[summaryDialogueIndex]
    if (!currentDialogue) {
      // Reached end of dialogue sequence, show elevator arrow
      setShowSummaryDialogue(false)
      setShowElevatorArrow(true)
      setCourtSummaryCompleted(true) // Mark court summary as completed
      return
    }
    
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
            const nextIndex = summaryDialogueIndex + 1
            if (nextIndex >= summaryDialogueSequence.length) {
              // Reached end, show elevator arrow
              setShowSummaryDialogue(false)
              setShowElevatorArrow(true)
              setCourtSummaryCompleted(true) // Mark court summary as completed
            } else {
              setSummaryDialogueIndex(nextIndex)
            }
          }, 800) // Small delay before auto-advancing
        }
      }
    }, 30)

    return () => clearInterval(typingInterval)
  }, [summaryDialogueIndex, showSummaryDialogue])

  // Reset dialogue when scene changes
  useEffect(() => {
    // Handle inside scene specifically
    if (currentScene === 'inside') {
      // First time entering inside scene - show initial dialogue
      if (!hasSeenInsideIntro) {
        // Show the existing inside dialogue
        setShowDialogue(true)
        setCurrentDialogueIndex(0)
        setDialogueHistory([])
        setWaitingForUserInput(false)
        setShowArrow(false)
        return
      }
      
      // If all cases completed and court summary not completed yet, show summary dialogue
      if (completedCases.length === 5 && !courtSummaryCompleted && !showSummaryDialogue) {
        setTimeout(() => {
          setShowSummaryDialogue(true)
          setSummaryDialogueIndex(0)
          setSummaryDialogueHistory([])
          setSummaryWaitingForInput(false)
          setShowDialogue(false)
          setShowArrow(false)
        }, 500)
      } else if (completedCases.length < 5) {
        // Cases not complete, show arrow to court
        setShowArrow(true)
        setShowDialogue(false)
      } else if (courtSummaryCompleted && !showElevatorArrow) {
        // Court summary completed but elevator arrow not shown yet (shouldn't happen, but handle it)
        setShowArrow(false)
        setShowDialogue(false)
      } else if (showElevatorArrow) {
        // Elevator arrow is shown (court summary completed)
        // Don't show court arrow anymore
        setShowArrow(false)
        setShowDialogue(false)
      }
      // If court summary completed, don't trigger dialogue again
      return
    }
    
    // For other scenes, reset dialogue
    setCurrentDialogueIndex(0)
    setShowDialogue(currentScene === 'hallway' || currentScene === 'outside')
    setShowArrow(false)
    setDisplayedText('')
    setIsTyping(false)
    setDialogueHistory([])
    setWaitingForUserInput(false)
  }, [currentScene, completedCases.length, showSummaryDialogue, courtSummaryCompleted, hasSeenInsideIntro])

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
          // End of dialogue, mark as seen and show arrow
          setShowDialogue(false)
          setHasSeenInsideIntro(true)
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
      // Skip all remaining dialogues, mark as seen and show arrow
      setShowDialogue(false)
      setHasSeenInsideIntro(true)
      setShowArrow(true)
    } else {
      setShowDialogue(false)
      setShowArrow(true)
    }
  }

  const handleUserChoice = (choiceText) => {
    // Add user choice to history
    setDialogueHistory(prev => [...prev, { speaker: 'user', text: choiceText }])
    
    // Check if this is the last dialogue
    if (currentDialogueIndex >= currentDialogues.length - 1) {
      // End of dialogue, mark as seen and show arrow
      setShowDialogue(false)
      if (currentScene === 'inside') {
        setHasSeenInsideIntro(true)
      }
      setShowArrow(true)
    } else {
      // Move to next dialogue (should be Momo's response)
      setCurrentDialogueIndex(currentDialogueIndex + 1)
      setWaitingForUserInput(false)
    }
  }

  // Handle Momo click for summary dialogue
  const handleMomoClick = () => {
    // Stage 1: Initial guidance (when first entering inside scene, before any court tasks)
    // This is handled by the regular dialogue system when first entering 'inside'
    
    // Stage 2: Court summary (only show if all 5 court cases completed AND not shown before)
    if (completedCases.length === 5 && !courtSummaryCompleted && !showSummaryDialogue) {
      setShowSummaryDialogue(true)
      setSummaryDialogueIndex(0)
      setSummaryDialogueHistory([])
      setSummaryWaitingForInput(false)
      setShowDialogue(false) // Hide regular dialogue when showing summary
      return
    }
    
    // Stage 3: Rooftop summary quiz (only show if all 7 rooftop tasks completed AND in inside scene)
    if (currentScene === 'inside' && rooftopCompletedTasks.length === 7 && courtSummaryCompleted && !showRooftopQuiz) {
      setShowRooftopQuiz(true)
      setRooftopQuizStep('intro')
      setCurrentQuizQuestion(0)
      setQuizAnswers([])
      return
    }
    
    // If user returns from court/rooftop without completing tasks, do nothing
    // No dialogue should appear
  }

  // Summary dialogue handlers
  const handleSummaryUserChoice = (choiceText) => {
    setSummaryDialogueHistory(prev => [...prev, { speaker: 'user', text: choiceText }])
    
    // Move forward by 2 positions: skip the user button and go to next Momo dialogue
    const nextIndex = summaryDialogueIndex + 2
    
    // Check if this is the last dialogue
    if (nextIndex >= summaryDialogueSequence.length) {
      // This is the last user choice, show elevator arrow and mark court summary as completed
      setShowSummaryDialogue(false)
      setShowElevatorArrow(true)
      setCourtSummaryCompleted(true) // Mark court summary as completed
    } else {
      // Move to next dialogue
      setSummaryDialogueIndex(nextIndex)
      setSummaryWaitingForInput(false)
    }
  }

  const handleSummaryQuizChoice = (option) => {
    setSummaryDialogueHistory(prev => [...prev, { speaker: 'user', text: option.text }])
    
    // If answer is incorrect, show error feedback
    if (!option.correct) {
      // Play wrong sound
      const wrongAudio = new Audio('/sound/wrong.mp3')
      wrongAudio.play().catch(e => console.log('Wrong sound failed:', e))
      
      // Mark this option as wrong (for red border)
      setWrongQuizOption(option.id)
      
      // Save wrong answer to errorRecords
      const savedUser = localStorage.getItem('aiJourneyUser')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (!userData.errorRecords) {
          userData.errorRecords = []
        }
        
        // Get the current quiz question from summaryDialogueSequence
        const currentDialogue = summaryDialogueSequence[summaryDialogueIndex]
        const question = currentDialogue.text
        const correctOption = currentDialogue.options?.find(o => o.correct)
        
        userData.errorRecords.push({
          timestamp: Date.now(),
          region: 'Glacier',
          question: question,
          userAnswer: option.text,
          correctAnswer: correctOption?.text || 'N/A',
          subject: `Glacier Quiz - Wrong Answer`,
          preview: `You selected: ${option.text.substring(0, 50)}...`,
          content: `Question: ${question}\n\nYour Answer: ${option.text}\n\nCorrect Answer: ${correctOption?.text || 'N/A'}\n\nFeedback: Try again! Think carefully about the answer.`
        })
        
        localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      }
      
      // Show error feedback but keep quiz visible for retry
      setSummaryDialogueHistory(prev => [...prev, { 
        speaker: 'momo', 
        text: 'Try again! Think carefully about the answer.',
        isError: true 
      }])
      setSummaryWaitingForInput(true) // Keep waiting for input to allow retry
      return
    }
    
    // Correct answer - play correct sound and clear wrong option
    const correctAudio = new Audio('/sound/correct.wav')
    correctAudio.play().catch(e => console.log('Correct sound failed:', e))
    
    setWrongQuizOption(null)
    
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
        setCourtSummaryCompleted(true) // Mark court summary as completed
      }
    }
  }

  const handleSummarySkip = () => {
    setShowSummaryDialogue(false)
  }

  // Handle elevator arrow click
  const handleElevatorArrowClick = () => {
    setCurrentScene('rooftop')
    // Don't reset showElevatorArrow - keep it true so it shows when returning to inside
    // setShowElevatorArrow(false) // Removed - keep elevator arrow state
    setShowSummaryDialogue(false)
  }

  // Handle NPC 5 click
  const handleNpc5Click = () => {
    if (npc5Completed) {
      // Show completion message
      setShowNpc5Dialogue(true)
      setNpc5DialogueIndex(-1) // Special index for completion message
    } else {
      // Start normal dialogue (or restart after timeout)
      setShowNpc5Dialogue(true)
      setNpc5DialogueIndex(0)
      setNpc5DialogueHistory([])
      setNpc5TypedText('') // Reset typed text
      setNpc5IsTyping(true) // Start typing
      setNpc5ShowButton(false) // Hide button initially
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
      // Start normal dialogue with typing animation
      setShowNpc6Dialogue(true)
      setNpc6DialogueIndex(0)
      setNpc6TypedText('')
      setNpc6IsTyping(true)
      setNpc6ShowButton(false)
    }
  }

  // Handle NPC 9 click
  const handleNpc9Click = () => {
    if (npc9Completed) {
      // Show completion message
      setShowNpc9Dialogue(true)
      setNpc9DialogueIndex(-1)
    } else {
      // Start normal dialogue with typing animation
      setShowNpc9Dialogue(true)
      setNpc9DialogueIndex(0)
      setNpc9TypedText('')
      setNpc9IsTyping(true)
      setNpc9ShowButton(false)
    }
  }

  // Handle NPC 6 dialogue
  const handleNpc6UserChoice = () => {
    const currentDialogue = npc6DialogueSequence[npc6DialogueIndex]
    
    // Check if this button should start the challenge
    if (currentDialogue.isButton && currentDialogue.startChallenge) {
      // Mark dialogue task as complete
      if (!rooftopCompletedTasks.includes('npc6_dialogue')) {
        setRooftopCompletedTasks(prev => [...prev, 'npc6_dialogue'])
      }
      
      // Randomly select 2 challenges from the pool
      const shuffled = [...creativityChallengesPool].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, 2)
      setSelectedChallenges(selected)
      
      setShowCreativityChallenge(true)
      setCurrentChallenge(0)
      setChallengeTimer(120)
      setUserInputs([])
      setCurrentInput('')
      setShowHint(false)
      setShowNpc6Dialogue(false)
      return
    }
    
    // Advance to next dialogue
    if (npc6DialogueIndex < npc6DialogueSequence.length - 1) {
      setNpc6DialogueIndex(npc6DialogueIndex + 1)
    }
  }

  // Handle NPC 9 dialogue
  const handleNpc9UserChoice = () => {
    const currentDialogue = npc9DialogueSequence[npc9DialogueIndex]
    
    // Check if this button should start the challenge
    if (currentDialogue.isButton && currentDialogue.startChallenge) {
      // Start memory challenge - Snow Path first
      setShowMemoryChallenge(true)
      setMemoryPhase('snowPath')
      setSnowPathRound(0)
      initializeSnowPathRound(0)
      setShowNpc9Dialogue(false)
      return
    }
    
    // Advance to next dialogue
    if (npc9DialogueIndex < npc9DialogueSequence.length - 1) {
      setNpc9DialogueIndex(npc9DialogueIndex + 1)
    }
  }

  // Initialize Snow Path round with random footprints
  const initializeSnowPathRound = (round) => {
    const footprintCount = 4 + round // Round 0: 4, Round 1: 5, Round 2: 6
    const positions = []
    while (positions.length < footprintCount) {
      const pos = Math.floor(Math.random() * 16)
      if (!positions.includes(pos)) {
        positions.push(pos)
      }
    }
    setSnowPathFootprints(positions)
    setSnowPathUserSelections([])
    setSnowPathMemorizing(true)
    setSnowPathTimer(15) // Changed from 30 to 15 seconds
  }

  // Handle Snow Path tile click
  const handleSnowPathTileClick = (index) => {
    if (snowPathMemorizing) return // Can't click during memorization
    
    // Check if already selected
    if (snowPathUserSelections.includes(index)) return
    
    const newSelections = [...snowPathUserSelections, index]
    setSnowPathUserSelections(newSelections)
    
    // Check if correct
    if (snowPathFootprints.includes(index)) {
      // Correct selection
      const correctSound = new Audio('/sound/correct.wav')
      correctSound.play().catch(err => console.log('Sound play failed:', err))
      
      // Check if all footprints found
      if (newSelections.filter(s => snowPathFootprints.includes(s)).length === snowPathFootprints.length) {
        // Round complete
        setTimeout(() => {
          if (snowPathRound < 2) {
            // Move to next round
            setSnowPathRound(snowPathRound + 1)
            initializeSnowPathRound(snowPathRound + 1)
          } else {
            // Snow Path complete, move to Footstep Recall
            setMemoryPhase('footstepRecall')
            setFootstepRound(0)
            initializeFootstepRound(0)
          }
        }, 1000)
      }
    } else {
      // Wrong selection
      const wrongSound = new Audio('/sound/wrong.mp3')
      wrongSound.play().catch(err => console.log('Sound play failed:', err))
      
      // Restart round after delay
      setTimeout(() => {
        initializeSnowPathRound(snowPathRound)
      }, 1000)
    }
  }

  // Initialize Footstep Recall round
  const initializeFootstepRound = (round) => {
    const sequenceLength = 3 + round // Round 0: 3, Round 1: 4, Round 2: 5
    const sequence = []
    for (let i = 0; i < sequenceLength; i++) {
      sequence.push(Math.floor(Math.random() * 6)) // 6 footprints total
    }
    setFootstepSequence(sequence)
    setFootstepUserSequence([])
    setFootstepShowingSequence(true)
    setFootstepCurrentHighlight(-1)
    
    // Show sequence with delays
    let currentIndex = 0
    const showNext = () => {
      if (currentIndex < sequence.length) {
        setFootstepCurrentHighlight(sequence[currentIndex])
        
        // Play completion sound for each highlight
        const snowSound = new Audio('/sound/snowwav.wav')
        snowSound.play().catch(err => console.log('Sound play failed:', err))
        
        setTimeout(() => {
          setFootstepCurrentHighlight(-1)
          currentIndex++
          setTimeout(showNext, 200) // 0.2s interval between highlights
        }, 700) // Each highlight lasts 0.7s
      } else {
        // Sequence shown, now user's turn
        setFootstepShowingSequence(false)
      }
    }
    
    setTimeout(showNext, 500) // Start after 0.5s delay
  }

  // Handle Footstep click
  const handleFootstepClick = (index) => {
    if (footstepShowingSequence) return // Can't click during sequence display
    
    const newSequence = [...footstepUserSequence, index]
    setFootstepUserSequence(newSequence)
    
    // Check if correct so far
    const expectedIndex = footstepSequence[newSequence.length - 1]
    if (index !== expectedIndex) {
      // Wrong footstep
      const wrongSound = new Audio('/sound/wrong.mp3')
      wrongSound.play().catch(err => console.log('Sound play failed:', err))
      
      // Restart round after delay
      setTimeout(() => {
        initializeFootstepRound(footstepRound)
      }, 1000)
      return
    }
    
    // Correct so far
    const correctSound = new Audio('/sound/correct.wav')
    correctSound.play().catch(err => console.log('Sound play failed:', err))
    
    // Check if sequence complete
    if (newSequence.length === footstepSequence.length) {
      // Round complete
      setTimeout(() => {
        if (footstepRound < 2) {
          // Move to next round
          setFootstepRound(footstepRound + 1)
          initializeFootstepRound(footstepRound + 1)
        } else {
          // All challenges complete - mark memory tasks complete
          setShowMemoryChallenge(false)
          setNpc9Completed(true)
          
          // Mark both memory tasks as complete
          if (!rooftopCompletedTasks.includes('npc9_memory_blocks')) {
            setRooftopCompletedTasks(prev => [...prev, 'npc9_memory_blocks'])
          }
          if (!rooftopCompletedTasks.includes('npc9_memory_footprint')) {
            setRooftopCompletedTasks(prev => [...prev, 'npc9_memory_footprint'])
          }
          
          console.log('NPC9 memory challenge completed, showing sharing dialogue in 1s')
          // Show sharing dialogue
          setTimeout(() => {
            console.log('Setting showNpc9Sharing to true')
            setShowNpc9Sharing(true)
          }, 1000)
        }
      }, 1000)
    }
  }

  // Handle creativity challenge input
  const handleChallengeSubmit = () => {
    if (currentInput.trim() && selectedChallenges.length > 0) {
      const newInputs = [...userInputs, currentInput.trim()]
      setUserInputs(newInputs)
      setCurrentInput('')
      
      const currentChallengeData = selectedChallenges[currentChallenge]
      
      // Check if user has entered enough items
      if (newInputs.length >= currentChallengeData.requiredCount) {
        // Move to next challenge or complete
        setTimeout(() => {
          if (currentChallenge < selectedChallenges.length - 1) {
            setCurrentChallenge(currentChallenge + 1)
            setChallengeTimer(120)
            setUserInputs([])
            setShowHint(false)
          } else {
            // All challenges completed - mark creativity task complete
            setShowCreativityChallenge(false)
            setNpc6Completed(true)
            if (!rooftopCompletedTasks.includes('npc6_creativity')) {
              setRooftopCompletedTasks(prev => [...prev, 'npc6_creativity'])
            }
            // Start co-creation task
            setTimeout(() => {
              setShowCoCreation(true)
            }, 1000)
          }
        }, 500)
      }
    }
  }
  
  const handleChallengeInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleChallengeSubmit()
    }
  }
  
  // Handle Glitch input
  const handleGlitchSend = async () => {
    if (glitchInput.trim()) {
      const userMessage = glitchInput.trim()
      console.log('User asked Glitch:', userMessage)
      
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
                text: `You are Glitch, a helpful AI guide in the Glacier region of an educational game about AI ethics and privacy. Players are learning about data privacy, responsible AI use, and ethical decision-making. You help guide players through scenarios involving privacy violations and ethical dilemmas. Keep responses concise (2-3 sentences max).\n\nUser question: ${userMessage}`
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
  
  const handleGlitchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchSend()
    }
  }
  
  // Rooftop quiz handlers
  const handleRooftopQuizStart = () => {
    setRooftopQuizStep('quiz')
    setCurrentQuizQuestion(0)
  }
  
  const handleRooftopQuizAnswer = (option) => {
    // Play select sound for quiz selection
    playSelectSound()
    
    const newAnswers = [...quizAnswers, { 
      questionId: rooftopQuizData.questions[currentQuizQuestion].id, 
      score: option.score, 
      category: rooftopQuizData.questions[currentQuizQuestion].category,
      text: option.text // Store the answer text
    }]
    setQuizAnswers(newAnswers)
    
    // Move to next question or calculate results
    if (currentQuizQuestion < rooftopQuizData.questions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1)
    } else {
      // All questions answered, calculate scores
      setRooftopQuizStep('calculating')
      
      // Calculate proficiency and judgment scores
      let profScore = 0
      let judgScore = 0
      
      newAnswers.forEach(answer => {
        if (answer.category === 'proficiency') {
          profScore += answer.score
        } else if (answer.category === 'judgment') {
          judgScore += answer.score
        }
      })
      
      setProficiencyScore(profScore)
      setJudgmentScore(judgScore)
      
      // Determine category
      let category = null
      if (profScore >= 10 && judgScore >= 10) {
        category = 'daisy'
      } else if (profScore >= 10 && judgScore < 10) {
        category = 'bark'
      } else if (profScore < 10 && judgScore >= 10) {
        category = 'twig'
      } else {
        category = 'shrub'
      }
      
      setUserCategory(category)
      
      // Show result after 2 seconds
      setTimeout(() => {
        setRooftopQuizStep('result')
      }, 2000)
    }
  }
  
  const handleRooftopQuizClose = () => {
    setShowRooftopQuiz(false)
    setShowDataCenterArrow(true) // Show arrow to Data Center
  }
  
  // Fill the Blank handlers
  const handleFillBlankDragStart = (option) => {
    setDraggedOption(option)
  }
  
  const handleFillBlankDrop = (questionIndex) => {
    if (!draggedOption) return
    
    const question = fillBlankQuestions[questionIndex]
    
    // Set the answer first to show visual feedback
    const newAnswers = [...fillBlankAnswers]
    newAnswers[questionIndex] = draggedOption
    setFillBlankAnswers(newAnswers)
    
    // Check if answer is correct
    if (draggedOption === question.correctAnswer) {
      playCorrectSound()
      
      // Wait a bit to show the green feedback, then move to next question
      setTimeout(() => {
        const newProgress = fillBlankProgress + 1
        setFillBlankProgress(newProgress)
        
        // If all questions answered, show completion dialogue
        if (newProgress === 5) {
          setTimeout(() => {
            setShowFillBlankTask(false)
            setShowFillBlankComplete(true)
          }, 500)
        }
      }, 600)
    } else {
      playWrongSound()
      
      // Clear wrong answer after 800ms to allow retry
      setTimeout(() => {
        const clearedAnswers = [...fillBlankAnswers]
        clearedAnswers[questionIndex] = null
        setFillBlankAnswers(clearedAnswers)
      }, 800)
    }
    
    setDraggedOption(null)
  }
  
  const handleFillBlankDragOver = (e) => {
    e.preventDefault()
  }
  
  // Add click handler as fallback for mobile/accessibility
  const handleFillBlankOptionClick = (option) => {
    if (fillBlankProgress < 5) {
      setDraggedOption(option)
      handleFillBlankDrop(fillBlankProgress)
    }
  }
  
  // Handle Fill the Blank completion dialogue
  const handleFillBlankCompleteClose = () => {
    setShowFillBlankComplete(false)
    setShowPrivacyTask(true)
  }
  
  // Privacy Task handlers
  const handlePrivacyMouseDown = (e) => {
    setPrivacySelecting(true)
    setPrivacySelectionStart({ x: e.clientX, y: e.clientY })
  }
  
  const handlePrivacyMouseMove = (e) => {
    if (privacySelecting) {
      setPrivacySelectionEnd({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handlePrivacyMouseUp = (e) => {
    if (!privacySelecting) return
    
    setPrivacySelecting(false)
    
    // Check if selection matches any privacy item
    const selection = window.getSelection().toString().trim()
    if (selection) {
      checkPrivacySelection(selection)
    }
    
    setPrivacySelectionStart(null)
    setPrivacySelectionEnd(null)
  }
  
  const checkPrivacySelection = (selection) => {
    const currentDoc = privacyDocuments[privacyTaskDocument - 1]
    
    // Find all matched items in the selection
    const matchedItems = currentDoc.items.filter(item => {
      if (item.isMultiPart) {
        return item.parts.some(part => selection.includes(part))
      }
      return selection.includes(item.text) || selection.includes(item.hint)
    })
    
    if (matchedItems.length > 0) {
      // Mark all matched items that haven't been found yet
      const newFoundItems = matchedItems
        .filter(item => !privacyFoundItems.includes(item.id))
        .map(item => item.id)
      
      if (newFoundItems.length > 0) {
        playMarkSound()
        setPrivacyFoundItems([...privacyFoundItems, ...newFoundItems])
      }
    } else {
      playWrongSound()
    }
  }
  
  const handlePrivacySubmit = () => {
    const currentDoc = privacyDocuments[privacyTaskDocument - 1]
    const allFound = currentDoc.items.every(item => privacyFoundItems.includes(item.id))
    
    if (allFound) {
      playCorrectSound()
      
      if (privacyTaskDocument < 3) {
        // Move to next document
        setTimeout(() => {
          setPrivacyTaskDocument(privacyTaskDocument + 1)
          setPrivacyFoundItems([])
        }, 500)
      } else {
        // All documents complete
        setTimeout(() => {
          setShowPrivacyTask(false)
          setShowPrivacyComplete(true)
        }, 1000)
      }
    } else {
      playWrongSound()
    }
  }
  
  // Handle Privacy Task completion
  const handlePrivacyCompleteClose = () => {
    setShowPrivacyComplete(false)
    // Trigger color map enable
    setCurrentScene('reloading')
    setReloadingProgress(0)
    
    let progress = 0
    const loadingInterval = setInterval(() => {
      progress += 2
      setReloadingProgress(progress)
      
      if (progress >= 100) {
        clearInterval(loadingInterval)
        setTimeout(() => {
          setCurrentScene('complete')
        }, 500)
      }
    }, 50)
  }
  
  // Creativity Card handlers
  const handleCompleteNpcClick = async (npcId) => {
    // Toggle NPC dialogue
    const isClosing = showCompleteNpcDialogue === npcId
    setShowCompleteNpcDialogue(isClosing ? null : npcId)
    
    // If dialogue is being shown (not closed) and question hasn't been generated for this NPC
    if (!isClosing && !npcQuestionsGenerated[npcId]) {
      // Mark this NPC as having generated a question
      setNpcQuestionsGenerated(prev => ({ ...prev, [npcId]: true }))
      
      setTimeout(async () => {
        // Randomly choose card type
        const cardType = Math.random() > 0.5 ? 'why' : 'whatif'
        setCreativityCardType(cardType)
        
        // Randomly choose position
        const position = Math.random() > 0.5 ? 'bottom-left' : 'top-right'
        setCreativityCardPosition(position)
        
        // Generate question
        setIsGeneratingCreativity(true)
        const question = await generateCreativityQuestion(cardType)
        setCreativityQuestion(question)
        setIsGeneratingCreativity(false)
        
        // Reset other states
        setCreativityUserAnswer('')
        setCreativityAiFeedback('')
        setCreativityAiAnswer('')
        setCreativityShowAnswer(false)
        
        // Show the card
        setShowCreativityCard(true)
      }, 1500) // Show card 1.5s after dialogue appears
    }
  }
  
  const generateCreativityQuestion = async (type) => {
    try {
      const prompt = type === 'why'
        ? 'Generate a creative "Why" question about everyday objects. The question should be simple, curious, and encourage creative thinking. Format: "Why do [object] have/do [feature]?" Example: "Why do water bottles have bumpy lines on them?" Only return the question, nothing else.'
        : 'Generate a creative "What if" question that challenges conventional thinking. The question should be imaginative and thought-provoking. Format: "What if [subject] could [action]?" Example: "What if clouds could talk?" Only return the question, nothing else.'
      
      const response = await fetch(getGeminiUrl('gemini-3-flash-preview'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      })
      
      const data = await response.json()
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim()
      }
      
      // Fallback questions
      return type === 'why' 
        ? 'Why do straws have a sharp end and a flat end?'
        : 'What if clouds could talk?'
    } catch (error) {
      console.error('Failed to generate creativity question:', error)
      return type === 'why' 
        ? 'Why do straws have a sharp end and a flat end?'
        : 'What if clouds could talk?'
    }
  }
  
  const handleCreativityGetFeedback = async () => {
    if (!creativityUserAnswer.trim()) return
    
    setIsGeneratingCreativity(true)
    
    try {
      const prompt = `User's answer: ${creativityUserAnswer}\nQuestion: ${creativityQuestion}\n\nProvide a brief, encouraging feedback (2-3 sentences) that:\n1. Acknowledges their thinking\n2. Adds an interesting insight\n3. Encourages further curiosity`
      
      const response = await fetch(getGeminiUrl('gemini-3-flash-preview'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      })
      
      const data = await response.json()
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setCreativityAiFeedback(data.candidates[0].content.parts[0].text.trim())
      } else {
        setCreativityAiFeedback("Great thinking! Your curiosity is leading you in interesting directions. Keep exploring!")
      }
    } catch (error) {
      console.error('Failed to generate feedback:', error)
      setCreativityAiFeedback("Great thinking! Your curiosity is leading you in interesting directions. Keep exploring!")
    } finally {
      setIsGeneratingCreativity(false)
    }
  }
  
  const handleCreativitySkipToAnswer = async () => {
    setIsGeneratingCreativity(true)
    setCreativityShowAnswer(true)
    
    try {
      const prompt = `Question: ${creativityQuestion}\n\nProvide a clear, educational answer (3-4 sentences) that explains:\n1. The practical reason\n2. The design principle\n3. An interesting fact`
      
      const response = await fetch(getGeminiUrl('gemini-3-flash-preview'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      })
      
      const data = await response.json()
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setCreativityAiAnswer(data.candidates[0].content.parts[0].text.trim())
      } else {
        setCreativityAiAnswer("This is a fascinating question that shows how design thinking works in everyday objects!")
      }
    } catch (error) {
      console.error('Failed to generate answer:', error)
      setCreativityAiAnswer("This is a fascinating question that shows how design thinking works in everyday objects!")
    } finally {
      setIsGeneratingCreativity(false)
    }
  }
  
  const handleCreativitySave = () => {
    // Save to localStorage
    const savedUser = localStorage.getItem('aiJourneyUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      
      if (!userData.creativityRecords) {
        userData.creativityRecords = []
      }
      
      const record = {
        id: Date.now(),
        type: creativityCardType,
        question: creativityQuestion,
        userAnswer: creativityUserAnswer,
        aiFeedback: creativityAiFeedback,
        aiAnswer: creativityAiAnswer,
        timestamp: Date.now(),
        region: 'Glacier',
        saved: true
      }
      
      userData.creativityRecords.push(record)
      
      // Also add to errorRecords for Report display
      if (!userData.errorRecords) {
        userData.errorRecords = []
      }
      
      const mailRecord = {
        subject: `Creativity - ${creativityCardType === 'why' ? 'Why' : 'What If'} Question`,
        preview: creativityQuestion.substring(0, 50) + '...',
        content: `Question: ${creativityQuestion}\n\nYour Thought: ${creativityUserAnswer}\n\n${creativityAiFeedback ? `AI Feedback: ${creativityAiFeedback}\n\n` : ''}${creativityAiAnswer ? `Answer: ${creativityAiAnswer}` : ''}`,
        timestamp: Date.now()
      }
      
      userData.errorRecords.push(mailRecord)
      
      localStorage.setItem('aiJourneyUser', JSON.stringify(userData))
      
      // Play save sound
      playCorrectSound()
      
      // Close card after a delay
      setTimeout(() => {
        setShowCreativityCard(false)
      }, 500)
    }
  }
  
  // Handle Glitch NPC click
  const handleGlitchClick = () => {
    if (currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') {
      setShowGlitchDialogue(true)
    }
  }

  // Co-creation task handlers
  const handleElementClick = (element) => {
    if (coCreationCompleted) return
    
    const newFormulas = [...coCreationFormulas]
    const currentFormula = newFormulas[currentFormulaIndex]
    
    if (!currentFormula.completed) {
      // Set the element and result
      currentFormula.element = element.name
      currentFormula.result = element.image
      currentFormula.completed = true
      
      setCoCreationFormulas(newFormulas)
      setShowSuccessMessage(true)
      
      // Play correct sound
      const correctSound = new Audio('/sound/correct.wav')
      correctSound.play().catch(err => console.log('Sound play failed:', err))
      
      // Hide success message and move to next formula
      setTimeout(() => {
        setShowSuccessMessage(false)
        
        if (currentFormulaIndex < 1) {
          // Move to second formula
          setCurrentFormulaIndex(1)
        } else {
          // All formulas completed - mark co-creation task complete
          setCoCreationCompleted(true)
          setRooftopCompletedTasks(prev => [...prev, 'npc6_cocreation'])
          
          // Close co-creation task after a delay
          setTimeout(() => {
            setShowCoCreation(false)
          }, 2000)
        }
      }, 2000)
    }
  }

  // NPC9 sharing handlers
  const handleNpc9SharingSubmit = async () => {
    if (npc9UserInput.trim()) {
      setIsNpc9Generating(true)
      
      // Call Gemini API for response
      try {
        const response = await fetch(
          getGeminiUrl('gemini-3-flash-preview'),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are NPC9, a compassionate AI companion on Glacier Station. A user just shared a personal memory secret with you. Provide a brief, empathetic response (1-2 sentences) that acknowledges their sharing and shows you care. Keep it warm and supportive.\n\nUser's memory: "${npc9UserInput}"`
                }]
              }]
            })
          }
        )
        
        if (!response.ok) {
          throw new Error('API call failed')
        }
        
        const data = await response.json()
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const aiResponse = data.candidates[0].content.parts[0].text.trim()
          setNpc9Response(aiResponse)
        } else {
          throw new Error('No response text')
        }
      } catch (error) {
        console.error('Failed to generate NPC9 response:', error)
        // Use fallback response
        setNpc9Response("I see... noted!")
      } finally {
        setIsNpc9Generating(false)
      }
      
      // Show NPC response
      setNpc9ShowResponse(true)
      
      // Close dialogue after showing response - mark sharing task complete
      setTimeout(() => {
        setShowNpc9Sharing(false)
        setNpc9ShowResponse(false)
        setNpc9UserInput('')
        setNpc9Response('')
        if (!rooftopCompletedTasks.includes('npc9_sharing')) {
          setRooftopCompletedTasks(prev => [...prev, 'npc9_sharing'])
        }
      }, 2000)
    }
  }

  const handleNpc9SharingKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNpc9SharingSubmit()
    }
  }

  // Challenge timer countdown with timeout handling
  useEffect(() => {
    if (showCreativityChallenge && challengeTimer > 0) {
      const timer = setTimeout(() => {
        setChallengeTimer(challengeTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showCreativityChallenge && challengeTimer === 0 && selectedChallenges.length > 0) {
      // Time's up - check if user completed the challenge
      const currentChallengeData = selectedChallenges[currentChallenge]
      if (userInputs.length < currentChallengeData.requiredCount) {
        // Not completed - close challenge and allow restart
        setTimeout(() => {
          setShowCreativityChallenge(false)
          setNpc6Completed(false) // Allow user to try again
        }, 1000)
      }
    }
  }, [showCreativityChallenge, challengeTimer, selectedChallenges, currentChallenge, userInputs.length])

  // Handle NPC 5 dialogue
  const handleNpc5UserChoice = (choiceText) => {
    // Check if button text is "Let me help you" - start puzzle directly
    if (choiceText === "Let me help you") {
      setShowPuzzle(true)
      setCurrentPuzzle(1)
      setPuzzleTimer(300) // 5 minutes per puzzle
      setShowNpc5Dialogue(false)
      setSelectedAnswer(null)
      setShowTeachingDialogue(false)
      setUserExplanation('')
      setSubmittedExplanation('')
      // Mark dialogue task as completed
      if (!rooftopCompletedTasks.includes('npc5_dialogue')) {
        setRooftopCompletedTasks(prev => [...prev, 'npc5_dialogue'])
      }
      return
    }
    
    const currentDialogue = npc5DialogueSequence[npc5DialogueIndex]
    
    // Check if this button should start the puzzle
    if (currentDialogue.isButton && currentDialogue.startPuzzle) {
      setShowPuzzle(true)
      setCurrentPuzzle(1)
      setPuzzleTimer(300) // 5 minutes per puzzle
      setShowNpc5Dialogue(false)
      setSelectedAnswer(null)
      setShowTeachingDialogue(false)
      setUserExplanation('')
      setSubmittedExplanation('')
      // Dialogue already marked complete above
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

  // Helper function to render text with colored words
  const renderColoredText = (text) => {
    if (!text) return text
    
    // Replace "Pink" with pink colored span
    // Replace "Green" with green colored span
    const parts = text.split(/(\bPink\b|\bGreen\b)/g)
    
    return parts.map((part, index) => {
      if (part === 'Pink') {
        return <span key={index} style={{ color: '#ff69b4' }}>{part}</span>
      } else if (part === 'Green') {
        return <span key={index} style={{ color: '#4ade80' }}>{part}</span>
      }
      return part
    })
  }

  // Handle puzzle answer
  const handlePuzzleAnswer = (option, optionIndex) => {
    // If already selected the correct answer, don't allow reselection
    if (selectedAnswer !== null && puzzleData[currentPuzzle].options[selectedAnswer].correct) {
      return
    }
    
    // Set selected answer for visual feedback
    setSelectedAnswer(optionIndex)
    
    if (option.correct) {
      // Correct answer - play correct sound and show teaching dialogue
      const correctSound = new Audio('/sound/correct.wav')
      correctSound.play().catch(err => console.log('Sound play failed:', err))
      
      setTimeout(() => {
        setShowTeachingDialogue(true)
      }, 500)
    } else {
      // Wrong answer - play wrong sound and allow reselection after a delay
      const wrongSound = new Audio('/sound/wrong.mp3')
      wrongSound.play().catch(err => console.log('Sound play failed:', err))
      
      // Clear selection after 1 second to allow reselection
      setTimeout(() => {
        setSelectedAnswer(null)
      }, 1000)
    }
  }

  // Handle user explanation submission
  const handleExplanationSubmit = async () => {
    if (userExplanation.trim()) {
      // Set submitted explanation to show in bubble
      setSubmittedExplanation(userExplanation)
      setIsNpc5Generating(true)
      
      // Call Gemini API for response
      try {
        const response = await fetch(
          getGeminiUrl('gemini-3-flash-preview'),
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are NPC5, a helpful AI tutor on Glacier Station. A student just explained their reasoning for a puzzle answer. Provide a brief, encouraging response (1-2 sentences) acknowledging their explanation and guiding them to the next step. Keep it friendly and concise.\n\nStudent's explanation: "${userExplanation}"`
                }]
              }]
            })
          }
        )
        
        if (!response.ok) {
          throw new Error('API call failed')
        }
        
        const data = await response.json()
        
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          const aiResponse = data.candidates[0].content.parts[0].text.trim()
          setNpc5Response(aiResponse)
        } else {
          throw new Error('No response text')
        }
      } catch (error) {
        console.error('Failed to generate NPC5 response:', error)
        // Use fallback response
        setNpc5Response("Got it, Let's move to next one")
      } finally {
        setIsNpc5Generating(false)
      }
      
      // User has provided explanation - wait for NPC response then move to next
      setTimeout(() => {
        setShowTeachingDialogue(false)
        setUserExplanation('')
        setSubmittedExplanation('')
        setNpc5Response('')
        setSelectedAnswer(null)
        
        if (currentPuzzle === 1) {
          // Move to puzzle 2
          setCurrentPuzzle(2)
          setPuzzleTimer(300) // Reset timer to 5 minutes
        } else {
          // Puzzle 2 completed - mark puzzle task complete and move to exercises
          console.log('Puzzle 2 completed, moving to exercises')
          if (!rooftopCompletedTasks.includes('npc5_puzzle')) {
            setRooftopCompletedTasks(prev => [...prev, 'npc5_puzzle'])
          }
          setShowPuzzle(false)
          setShowNpc5Dialogue(false)
          setShowExercise(true)
          setCurrentExercise(1)
          setSelectedErrors([])
          setShowExerciseFeedback(false)
          console.log('Exercise state set: showExercise=true, currentExercise=1')
        }
      }, 2000) // Wait 2 seconds to show NPC response
    }
  }

  // Handle text selection for exercises
  const handleTextSelection = () => {
    const selection = window.getSelection()
    const selectedText = selection.toString().trim()
    
    if (!selectedText || !showExercise) return
    
    const exercise = exerciseData[currentExercise]
    const fullText = exercise.text
    
    console.log('=== Text Selection Debug ===')
    console.log('Selected text:', selectedText)
    console.log('Selected text length:', selectedText.length)
    
    // Find the actual selected range in the original text
    let selectionStart = -1
    let selectionEnd = -1
    
    // Try exact match first
    selectionStart = fullText.indexOf(selectedText)
    
    if (selectionStart !== -1) {
      selectionEnd = selectionStart + selectedText.length
      console.log('Found exact match at:', selectionStart, '-', selectionEnd)
    } else {
      console.log('No exact match found, trying normalized search')
      // Try with normalized spaces
      const normalizedSelected = selectedText.replace(/\s+/g, ' ')
      selectionStart = fullText.indexOf(normalizedSelected)
      if (selectionStart !== -1) {
        selectionEnd = selectionStart + normalizedSelected.length
        console.log('Found normalized match at:', selectionStart, '-', selectionEnd)
      }
    }
    
    // Check if selected text matches any error
    let foundError = false
    exercise.errors.forEach((error, index) => {
      if (selectedErrors.includes(index)) return
      
      console.log(`Checking error ${index}:`, error.text, `(${error.start}-${error.end})`)
      
      // Check multiple matching strategies
      const exactTextMatch = selectedText === error.text
      const normalizedMatch = selectedText.replace(/\s+/g, ' ') === error.text.replace(/\s+/g, ' ')
      
      // Position-based matching: check if selection overlaps with error position
      let positionOverlap = false
      if (selectionStart !== -1 && selectionEnd !== -1) {
        // Check if there's any overlap between selection and error ranges
        positionOverlap = !(selectionEnd <= error.start || selectionStart >= error.end)
        console.log(`  - Position overlap check: selection(${selectionStart}-${selectionEnd}) vs error(${error.start}-${error.end}):`, positionOverlap)
      }
      
      const containsError = selectedText.includes(error.text)
      const errorContainsSelection = error.text.includes(selectedText) && selectedText.length >= 3
      
      console.log('  - Exact text match:', exactTextMatch)
      console.log('  - Normalized match:', normalizedMatch)
      console.log('  - Position overlap:', positionOverlap)
      console.log('  - Contains error:', containsError)
      console.log('  - Error contains selection:', errorContainsSelection)
      
      const errorMatches = exactTextMatch || normalizedMatch || positionOverlap || containsError || errorContainsSelection
      
      if (errorMatches) {
        // Correct error found
        console.log('✓ Error matched!')
        foundError = true
        const newSelectedErrors = [...selectedErrors, index]
        setSelectedErrors(newSelectedErrors)
        
        // Play correct sound
        const correctSound = new Audio('/sound/correct.wav')
        correctSound.play().catch(err => console.log('Sound play failed:', err))
        
        // Check if all errors found
        if (newSelectedErrors.length === exercise.requiredCount) {
          // Show feedback
          setShowExerciseFeedback(true)
          
          setTimeout(() => {
            if (currentExercise === 1) {
              // Move to exercise 2
              setCurrentExercise(2)
              setSelectedErrors([])
              setShowExerciseFeedback(false)
            } else {
              // All exercises completed - mark exercise task complete
              setShowExercise(false)
              setNpc5Completed(true)
              if (!rooftopCompletedTasks.includes('npc5_exercise')) {
                setRooftopCompletedTasks(prev => [...prev, 'npc5_exercise'])
              }
            }
          }, 2000)
        }
      }
    })
    
    if (!foundError && selectedText.length > 2) {
      // Wrong selection - only play sound if selection is substantial
      console.log('✗ No error matched - wrong selection')
      const wrongSound = new Audio('/sound/wrong.mp3')
      wrongSound.play().catch(err => console.log('Sound play failed:', err))
    }
    
    console.log('=== End Debug ===')
    
    // Clear selection
    selection.removeAllRanges()
  }

  // Typing animation and auto-advance for NPC5
  useEffect(() => {
    if (showNpc5Dialogue && npc5DialogueIndex >= 0 && npc5DialogueIndex < npc5DialogueSequence.length) {
      const currentDialogue = npc5DialogueSequence[npc5DialogueIndex]
      
      // Skip typing for button dialogues
      if (currentDialogue.isButton) {
        setNpc5IsTyping(false)
        return
      }
      
      const fullText = currentDialogue.text
      let currentIndex = 0
      setNpc5TypedText('')
      setNpc5IsTyping(true)
      
      // Typing animation
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setNpc5TypedText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setNpc5IsTyping(false)
          
          // If this dialogue should show button, show it
          if (currentDialogue.showButton) {
            setTimeout(() => {
              setNpc5ShowButton(true)
            }, 500) // Wait 500ms after typing completes before showing button
          }
          // Auto-advance if autoAdvance flag is set
          else if (currentDialogue.autoAdvance) {
            setTimeout(() => {
              if (npc5DialogueIndex < npc5DialogueSequence.length - 1) {
                setNpc5DialogueIndex(npc5DialogueIndex + 1)
              }
            }, 800) // Wait 800ms after typing completes before advancing
          }
        }
      }, 30) // 30ms per character for typing speed
      
      return () => clearInterval(typingInterval)
    }
  }, [showNpc5Dialogue, npc5DialogueIndex])

  // Typing animation and auto-advance for NPC6
  useEffect(() => {
    if (showNpc6Dialogue && npc6DialogueIndex >= 0 && npc6DialogueIndex < npc6DialogueSequence.length) {
      const currentDialogue = npc6DialogueSequence[npc6DialogueIndex]
      
      // Skip typing for button dialogues
      if (currentDialogue.isButton) {
        setNpc6IsTyping(false)
        return
      }
      
      const fullText = currentDialogue.text
      let currentIndex = 0
      setNpc6TypedText('')
      setNpc6IsTyping(true)
      
      // Typing animation
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setNpc6TypedText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setNpc6IsTyping(false)
          
          // If this dialogue should show button, show it
          if (currentDialogue.showButton) {
            setTimeout(() => {
              setNpc6ShowButton(true)
            }, 500) // Wait 500ms after typing completes before showing button
          }
          // Auto-advance if autoAdvance flag is set
          else if (currentDialogue.autoAdvance) {
            setTimeout(() => {
              if (npc6DialogueIndex < npc6DialogueSequence.length - 1) {
                setNpc6DialogueIndex(npc6DialogueIndex + 1)
              }
            }, 800) // Wait 800ms after typing completes before advancing
          }
        }
      }, 30) // 30ms per character for typing speed
      
      return () => clearInterval(typingInterval)
    }
  }, [showNpc6Dialogue, npc6DialogueIndex])

  // Typing animation and auto-advance for NPC9
  useEffect(() => {
    if (showNpc9Dialogue && npc9DialogueIndex >= 0 && npc9DialogueIndex < npc9DialogueSequence.length) {
      const currentDialogue = npc9DialogueSequence[npc9DialogueIndex]
      
      // Skip typing for button dialogues
      if (currentDialogue.isButton) {
        setNpc9IsTyping(false)
        return
      }
      
      const fullText = currentDialogue.text
      let currentIndex = 0
      setNpc9TypedText('')
      setNpc9IsTyping(true)
      
      // Typing animation
      const typingInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setNpc9TypedText(fullText.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setNpc9IsTyping(false)
          
          // If this dialogue should show button, show it
          if (currentDialogue.showButton) {
            setTimeout(() => {
              setNpc9ShowButton(true)
            }, 500) // Wait 500ms after typing completes before showing button
          }
          // Auto-advance if autoAdvance flag is set
          else if (currentDialogue.autoAdvance) {
            setTimeout(() => {
              if (npc9DialogueIndex < npc9DialogueSequence.length - 1) {
                setNpc9DialogueIndex(npc9DialogueIndex + 1)
              }
            }, 800) // Wait 800ms after typing completes before advancing
          }
        }
      }, 30) // 30ms per character for typing speed
      
      return () => clearInterval(typingInterval)
    }
  }, [showNpc9Dialogue, npc9DialogueIndex])

  // Timer countdown - pause when teaching dialogue is shown
  useEffect(() => {
    if (showPuzzle && puzzleTimer > 0 && !showTeachingDialogue) {
      const timer = setTimeout(() => {
        setPuzzleTimer(puzzleTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showPuzzle && puzzleTimer === 0) {
      // Time's up - close puzzle and allow restart
      setTimeout(() => {
        setShowPuzzle(false)
        setNpc5Completed(false) // Allow user to try again
      }, 1000)
    }
  }, [showPuzzle, puzzleTimer, showTeachingDialogue])

  // Snow Path timer countdown
  useEffect(() => {
    if (showMemoryChallenge && memoryPhase === 'snowPath' && snowPathMemorizing && snowPathTimer > 0) {
      const timer = setTimeout(() => {
        setSnowPathTimer(snowPathTimer - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (showMemoryChallenge && memoryPhase === 'snowPath' && snowPathMemorizing && snowPathTimer === 0) {
      // Time's up - switch to recall phase
      setSnowPathMemorizing(false)
    }
  }, [showMemoryChallenge, memoryPhase, snowPathMemorizing, snowPathTimer])

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Court scene handlers
  const handleNpcClick = (npcId) => {
    // If all cases are completed and clicking npc2 or npc3, show completion message
    if (completedCases.length === 5 && (npcId === 'npc2' || npcId === 'npc3')) {
      setShowCourtCompletionDialogue(npcId)
      return
    }
    
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
  
  // Handle play statement audio
  const handlePlayStatement = async (npcId) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setIsPlayingAudio(false)
    }
    
    // Check if audio already generated
    if (generatedAudio[npcId]) {
      playAudio(generatedAudio[npcId])
      return
    }
    
    // Generate audio using Gemini API
    setIsGeneratingAudio(true)
    
    try {
      const statementText = courtCases[npcId].statementParts.join(' ')
      
      const response = await fetch(
        getGeminiUrl('gemini-3-flash-preview'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate audio for this statement: "${statementText}"`
              }]
            }]
          })
        }
      )
      
      if (!response.ok) {
        throw new Error('API call failed')
      }
      
      const data = await response.json()
      
      // Check if response contains audio data
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.inlineData) {
        const audioData = data.candidates[0].content.parts[0].inlineData
        const audioUrl = `data:${audioData.mimeType};base64,${audioData.data}`
        
        setGeneratedAudio(prev => ({
          ...prev,
          [npcId]: audioUrl
        }))
        
        setIsGeneratingAudio(false)
        playAudio(audioUrl)
      } else {
        throw new Error('No audio data in response')
      }
    } catch (error) {
      console.error('Failed to generate audio:', error)
      setIsGeneratingAudio(false)
      
      // Use fallback audio
      playAudio('/glacier/npc/test.wav')
    }
  }
  
  // Play audio helper function
  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl)
    audio.volume = 0.7
    
    audio.onplay = () => setIsPlayingAudio(true)
    audio.onended = () => {
      setIsPlayingAudio(false)
      setCurrentAudio(null)
    }
    audio.onerror = () => {
      setIsPlayingAudio(false)
      setCurrentAudio(null)
      console.error('Audio playback failed')
    }
    
    setCurrentAudio(audio)
    audio.play().catch(err => {
      console.error('Audio play error:', err)
      setIsPlayingAudio(false)
      setCurrentAudio(null)
    })
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
      // When returning from court:
      // - If court not complete, show court arrow
      // - If court complete but summary not done, summary dialogue will trigger
      // - If court summary done, elevator arrow will show
      if (completedCases.length < 5) {
        setShowArrow(true) // Show court arrow
      } else {
        setShowArrow(false) // Don't show court arrow if cases are complete
      }
    } else if (currentScene === 'rooftop') {
      console.log('Leaving rooftop, completed tasks:', rooftopCompletedTasks.length, rooftopCompletedTasks)
      setCurrentScene('inside')
      setShowNpc5Dialogue(false)
      setShowPuzzle(false)
      setShowExercise(false)
      setShowNpc6Dialogue(false)
      setShowCreativityChallenge(false)
      setShowCoCreation(false)
      setShowNpc9Dialogue(false)
      setShowMemoryChallenge(false)
      setShowNpc9Sharing(false)
      // When returning from rooftop:
      // - Elevator arrow should remain visible (controlled by showElevatorArrow state)
      // - Court arrow should not show
      setShowArrow(false)
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
      case 'datacenter':
        return '/glacier/background/data.png'
      case 'reloading':
        return null // Black background
      case 'complete':
        return '/glacier/background/color.png'
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
        return { left: '5px', bottom: '5px', size: '400px' } // 保持400px
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
    } else if (currentScene === 'rooftop') {
      return { left: '5%', bottom: '5%', height: '25%' } // Momo position on rooftop (smaller, bottom left)
    }
    return null
  }

  const getDialoguePosition = () => {
    switch (currentScene) {
      case 'hallway':
        return { left: '430px', bottom: '150px', width: '700px', minHeight: '200px' } // 缩小距离，从420px改为430px
      case 'outside':
        return { right: '430px', top: '150px', width: '500px', minHeight: '120px' } // 缩小距离，从420px改为430px
      case 'inside':
        return { right: '50%', top: '15%', width: '40%', height: '70%' } // Align with Momo's top (15% from top), reduce height to 70%
      default:
        return { left: '430px', bottom: '150px', width: '700px', minHeight: '200px' }
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
      filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))', // 添加轻微阴影
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
      background: 'rgba(240, 248, 255, 0.95)', // 提高不透明度
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '2px solid rgba(100, 149, 237, 0.5)', // 加粗边框
      borderRadius: '25px', // 增加圆角
      padding: '25px 30px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(100, 149, 237, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5)', // 增强阴影和悬浮感
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
      left: '0px',
      bottom: '250px',
      width: '250px',
      height: '270px',
      cursor: 'pointer',
      zIndex: 50,
      transition: 'transform 0.2s',
    },
    npc6DialogueContainer: {
      position: 'absolute',
      left: 'calc(0px + 250px)',
      bottom: '350px',
      width: '550px',
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
      zIndex: 2100,
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
      width: '85vw',
      maxWidth: '1400px',
      height: '75vh',
      background: 'rgba(40, 40, 40, 0.95)',
      borderRadius: '20px',
      padding: '0',
      zIndex: 3000,
      color: '#fff',
      display: 'flex',
      overflow: 'hidden',
    },
    puzzleLeftPanel: {
      width: '33.33%',
      background: 'rgba(20, 20, 20, 0.9)',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '30px',
      position: 'relative',
    },
    puzzleTimer: {
      fontSize: '32px',
      fontWeight: 'bold',
      fontFamily: "'Roboto Mono', monospace",
      color: '#fff',
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '15px 30px',
      borderRadius: '50px',
      letterSpacing: '2px',
    },
    puzzleImageContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    puzzleImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '10px',
    },
    puzzleRightPanel: {
      width: '66.67%',
      padding: '40px 50px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    puzzleTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
      textAlign: 'left',
    },
    puzzleTextContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    puzzleStatement: {
      fontSize: '20px',
      marginBottom: '15px',
      fontStyle: 'italic',
      lineHeight: 1.6,
      textAlign: 'left',
    },
    puzzleQuestion: {
      fontSize: '22px',
      fontWeight: 'bold',
      marginBottom: '25px',
      lineHeight: 1.4,
      textAlign: 'left',
    },
    puzzleOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginTop: '20px',
    },
    puzzleOption: {
      padding: '18px 25px',
      borderRadius: '10px',
      border: '2px solid #a0d8ff',
      borderStyle: 'solid',
      borderWidth: '2px',
      borderColor: '#a0d8ff',
      background: '#1f2937',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textAlign: 'left',
      lineHeight: 1.5,
      width: '100%',
      boxSizing: 'border-box',
      display: 'block',
      outline: 'none',
    },
    puzzleOptionCorrect: {
      borderColor: '#4caf50',
      background: '#2e7d32',
    },
    puzzleOptionWrong: {
      background: '#c62828',
      borderColor: '#f44336',
    },
    teachingDialogueOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '25%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.95)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      gap: '15px',
    },
    teachingNpcContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    teachingNpcAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      flexShrink: 0,
    },
    teachingNpcBubble: {
      background: '#fff',
      color: '#000',
      padding: '12px 18px',
      borderRadius: '15px',
      fontSize: '16px',
      lineHeight: 1.4,
      maxWidth: '200px',
    },
    teachingPrompt: {
      color: '#fff',
      fontSize: '14px',
      fontWeight: 'bold',
      marginTop: '10px',
    },
    teachingInputContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    teachingInput: {
      width: '100%',
      minHeight: '100px',
      padding: '12px',
      borderRadius: '10px',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      fontSize: '14px',
      fontFamily: "'Roboto', sans-serif",
      resize: 'vertical',
      outline: 'none',
    },
    teachingSendButton: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(81, 112, 255, 0.8)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      transition: 'all 0.2s',
    },
    teachingSendIcon: {
      width: '20px',
      height: '20px',
      objectFit: 'contain',
    },
    userExplanationBubble: {
      background: 'rgba(81, 112, 255, 0.8)',
      color: '#fff',
      padding: '12px 18px',
      borderRadius: '15px',
      fontSize: '14px',
      lineHeight: 1.4,
      alignSelf: 'flex-end',
      maxWidth: '80%',
      marginTop: '10px',
    },
    // Creativity Challenge styles
    creativityContainer: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '900px',
      height: '650px',
      background: 'rgba(40, 40, 40, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '50px',
      zIndex: 3100,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    creativityTimer: {
      fontSize: '60px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      fontFamily: "'Roboto Mono', monospace",
      letterSpacing: '4px',
    },
    creativityTimerRed: {
      color: '#ff4444',
    },
    creativityTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '30px',
      lineHeight: 1.5,
      color: '#ffffff',
    },
    creativityTagsContainer: {
      width: '100%',
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'flex-start',
      gap: '12px',
      marginBottom: '20px',
      overflowY: 'auto',
      padding: '10px 0',
    },
    creativityTag: {
      padding: '10px 20px',
      borderRadius: '20px',
      border: 'none',
      fontSize: '16px',
      color: '#000',
      whiteSpace: 'nowrap',
      fontWeight: '500',
    },
    creativityTagYellow: {
      background: '#f0d32d',
    },
    creativityTagRed: {
      background: '#ab3a2c',
    },
    creativityInputSection: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      position: 'relative',
    },
    creativityHintButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      color: '#a0d8ff',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '8px 0',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    creativityHintIcon: {
      width: '20px',
      height: '20px',
    },
    creativityInputContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#1f2937',
      borderRadius: '15px',
      border: '2px solid #a0d8ff',
      overflow: 'hidden',
      transition: 'border-color 0.2s',
    },
    creativityInput: {
      flex: 1,
      padding: '15px 20px',
      border: 'none',
      backgroundColor: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#fff',
      outline: 'none',
    },
    creativityDivider: {
      width: '2px',
      height: '24px',
      backgroundColor: '#a0d8ff',
      margin: '0 8px',
      flexShrink: 0,
    },
    creativitySendButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 12px',
      transition: 'all 0.2s',
    },
    creativitySendIcon: {
      width: '24px',
      height: '24px',
      objectFit: 'contain',
    },
    creativityProgress: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '10px',
    },
    creativityProgressDot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      background: '#666566',
      transition: 'all 0.3s',
    },
    creativityProgressDotActive: {
      background: '#a0d8ff',
    },
    creativityProgressText: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#a0d8ff',
      marginLeft: '10px',
    },
    // Co-creation task styles
    coCreationContainer: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80%',
      maxWidth: '900px',
      maxHeight: '85vh',
      background: 'rgba(60, 60, 60, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '30px',
      zIndex: 3200,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      overflow: 'auto',
    },
    coCreationDialogue: {
      background: '#fff',
      borderRadius: '15px',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    },
    coCreationInstruction: {
      textAlign: 'center',
      color: '#a0d8ff',
      fontSize: '18px',
      marginBottom: '10px',
    },
    coCreationFormulasArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      justifyContent: 'center',
    },
    coCreationFormula: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    },
    coCreationCard: {
      width: '150px',
      height: '150px',
      background: '#fff',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
    },
    coCreationDropZone: {
      width: '200px',
      height: '80px',
      border: '3px dashed rgba(160, 216, 255, 0.5)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Roboto Mono', monospace",
      fontSize: '18px',
      color: '#fff',
    },
    coCreationResultCard: {
      width: '150px',
      height: '150px',
      background: '#f0d32d',
      border: '4px solid #a0d8ff',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      animation: 'shake 0.5s',
    },
    coCreationElementsArea: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
      padding: '15px',
      maxHeight: '200px',
      overflow: 'auto',
    },
    coCreationElementTag: {
      padding: '10px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontFamily: "'Roboto Mono', monospace",
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: '500',
      border: 'none',
    },
    // NPC9 sharing dialogue styles
    npc9SharingContainer: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '75%',
      maxWidth: '900px',
      maxHeight: '85vh',
      background: 'rgba(80, 80, 80, 0.85)',
      backdropFilter: 'blur(30px)',
      WebkitBackdropFilter: 'blur(30px)',
      borderRadius: '25px',
      padding: '40px',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    npc9SharingTitle: {
      textAlign: 'center',
      color: '#fff',
      fontSize: '22px',
      marginBottom: '10px',
      fontWeight: '500',
    },
    npc9SharingMessage: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '15px',
      marginBottom: '10px',
    },
    npc9SharingBubble: {
      background: '#fff',
      borderRadius: '15px',
      padding: '20px',
      flex: 1,
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#333',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    npc9SharingTimestamp: {
      fontSize: '12px',
      color: '#94a3b8',
      marginTop: '6px',
      marginLeft: '12px',
    },
    npc9SharingUserLabel: {
      textAlign: 'right',
      fontSize: '12px',
      color: '#94a3b8',
      marginBottom: '5px',
      fontWeight: '500',
    },
    npc9SharingHints: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    npc9SharingHintTag: {
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      background: 'rgba(14, 165, 233, 0.15)',
      border: '1px solid rgba(14, 165, 233, 0.3)',
      color: '#0284c7',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    npc9SharingInputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: '#fff',
      borderRadius: '20px',
      padding: '12px 20px',
      border: '1px solid rgba(14, 165, 233, 0.2)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    },
    npc9SharingInput: {
      flex: 1,
      background: 'none',
      border: 'none',
      color: '#1f2937',
      fontSize: '15px',
      outline: 'none',
      fontFamily: "'Inter', 'Roboto', sans-serif",
    },
    creativityHintModal: {
      position: 'absolute',
      bottom: '100%',
      left: '0',
      width: '280px',
      background: 'rgba(20, 30, 40, 0.95)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '15px',
      marginBottom: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
      border: '1px solid rgba(160, 216, 255, 0.3)',
      zIndex: 100,
    },
    creativityHintHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '1px solid rgba(160, 216, 255, 0.2)',
    },
    creativityHintTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#a0d8ff',
      flex: 1,
    },
    creativityHintClose: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      color: '#a0d8ff',
      padding: '0',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    creativityHintContent: {
      color: '#fff',
      fontSize: '11px',
      lineHeight: 1.4,
    },
    creativityHintItem: {
      marginBottom: '10px',
      padding: '8px 10px',
      background: 'rgba(160, 216, 255, 0.1)',
      border: '1px solid rgba(160, 216, 255, 0.3)',
      borderRadius: '8px',
      position: 'relative',
    },
    creativityHintLabel: {
      fontWeight: 'bold',
      color: '#a0d8ff',
      marginBottom: '4px',
      display: 'block',
      fontSize: '10px',
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
      height: '450px',
      width: 'auto',
      objectFit: 'contain',
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
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes blink {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
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
      background: '#333333',
      padding: '12px 18px',
      borderRadius: '18px',
      boxShadow: '0 2px 6px rgba(51, 51, 51, 0.3)',
    },
    modernUserText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#ffffff',
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
    // Rooftop quiz styles
    rooftopQuizOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
    },
    rooftopQuizModal: {
      background: 'linear-gradient(135deg, rgba(20, 40, 60, 0.95), rgba(30, 50, 70, 0.95))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '20px',
      padding: '40px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      position: 'relative',
    },
    rooftopQuizContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
    },
    rooftopQuizHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    rooftopQuizMessage: {
      color: '#fff',
      fontSize: '18px',
      lineHeight: 1.6,
      textAlign: 'center',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    rooftopQuizButton: {
      padding: '12px 40px',
      borderRadius: '25px',
      border: 'none',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#1a2a3a',
      fontFamily: "'Montserrat', sans-serif",
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '10px',
    },
    rooftopQuizProgress: {
      color: '#a0d8ff',
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    rooftopQuizQuestion: {
      color: '#fff',
      fontSize: '20px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px',
      lineHeight: 1.4,
    },
    rooftopQuizOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      width: '100%',
    },
    rooftopQuizOption: {
      padding: '15px 20px',
      borderRadius: '12px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      background: 'rgba(255, 255, 255, 0.1)',
      color: '#fff',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      textAlign: 'left',
      lineHeight: 1.5,
    },
    rooftopQuizCalculating: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '40px',
    },
    rooftopQuizCalculatingText: {
      color: '#fff',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    rooftopQuizSpinner: {
      width: '50px',
      height: '50px',
      border: '4px solid rgba(255, 255, 255, 0.2)',
      borderTop: '4px solid #a0d8ff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    rooftopQuizResultHeader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
    },
    rooftopQuizQuadrant: {
      width: '100%',
      maxWidth: '400px',
      marginBottom: '30px',
    },
    rooftopQuizQuadrantGrid: {
      position: 'relative',
      width: '100%',
      paddingTop: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      border: '2px solid rgba(255, 255, 255, 0.2)',
    },
    rooftopQuizAxisLabel: {
      position: 'absolute',
      fontSize: '14px',
      color: '#fff',
      fontWeight: 'bold',
    },
    rooftopQuizResultContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
    rooftopQuizResultMessage: {
      color: '#fff',
      fontSize: '16px',
      lineHeight: 1.6,
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      maxWidth: '500px',
    },
    // Reloading scene styles
    reloadingContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
    },
    reloadingIcon: {
      width: '100px',
      height: '100px',
      animation: 'spin 2s linear infinite',
      filter: 'drop-shadow(0 0 20px rgba(160, 216, 255, 0.8))',
      marginBottom: '30px',
    },
    reloadingText: {
      color: '#a0d8ff',
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: "'Montserrat', sans-serif",
      letterSpacing: '2px',
    },
    // Complete scene NPC styles
    completeNpc: {
      position: 'absolute',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      zIndex: 30,
    },
    completeNpcImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    completeNpcDialogue: {
      position: 'absolute',
      bottom: '110%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '2px solid #333',
      borderRadius: '15px',
      padding: '15px 20px',
      minWidth: '200px',
      maxWidth: '300px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      zIndex: 100,
      whiteSpace: 'normal',
      wordWrap: 'break-word',
    },
    completeNpcDialogueText: {
      color: '#333',
      fontSize: '14px',
      lineHeight: 1.5,
      fontFamily: "'Roboto', sans-serif",
      margin: 0,
    },
  }

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>
      
      {/* Reloading Scene */}
      {currentScene === 'reloading' && (
        <div style={styles.reloadingContainer}>
          <img 
            src="/glacier/icon/snowfake.svg" 
            alt="Loading" 
            style={styles.reloadingIcon}
          />
          <div style={styles.reloadingText}>System Online.</div>
        </div>
      )}
      
      {/* Background Image */}
      {currentScene !== 'reloading' && getBackgroundImage() && (
        <img 
          src={getBackgroundImage()}
          alt="Glacier Background" 
          style={styles.backgroundImage}
        />
      )}
      
      {/* Complete Scene NPCs */}
      {currentScene === 'complete' && completeSceneNpcs.map((npc) => (
        <div
          key={npc.id}
          style={{
            ...styles.completeNpc,
            ...npc.position,
          }}
          onClick={() => handleCompleteNpcClick(npc.id)}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img 
            src={npc.image}
            alt={npc.id}
            style={styles.completeNpcImage}
          />
          {showCompleteNpcDialogue === npc.id && (
            <div style={{
              ...styles.completeNpcDialogue,
              ...(npc.id === 'npc3' ? {
                // Show dialogue below NPC3
                bottom: 'auto',
                top: '110%',
                left: '50%',
                transform: 'translateX(-50%)',
              } : npc.id === 'npc12' ? {
                left: 'auto',
                right: '110%',
                transform: 'none',
                bottom: '0',
              } : {})
            }}>
              <p style={styles.completeNpcDialogueText}>{npc.dialogue}</p>
            </div>
          )}
        </div>
      ))}
      
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
      ) : currentScene !== 'datacenter' && (
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

      {/* NPC Glitch - Show in different scenes with different positions */}
      {(currentScene === 'outside' || currentScene === 'hallway' || currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') && (
        <div 
          style={{
            ...styles.npc,
            ...getNpcPosition(),
            width: getNpcPosition().size,
            height: getNpcPosition().size,
            cursor: 'pointer',
          }}
          onClick={handleGlitchClick}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
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
      )}
      
      {/* Glitch Dialogue (shows on click in inside, court, rooftop scenes) */}
      {showGlitchDialogue && (currentScene === 'inside' || currentScene === 'court' || currentScene === 'rooftop') && (
        <div style={styles.glitchDialogue}>
          {/* Close button */}
          <button
            style={styles.glitchDialogueCloseButton}
            onClick={() => {
              setShowGlitchDialogue(false)
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
              <p style={styles.glitchDialogueText}>
                {currentScene === 'inside' && "The machines are sleeping, but the truth is awake. Ask me anything about this station."}
                {currentScene === 'court' && "Justice is not always black and white. Sometimes it's about responsibility."}
                {currentScene === 'rooftop' && "They forgot how to think for themselves. Can you help them remember?"}
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
                if (!isGlitchTyping) e.currentTarget.style.transform = 'scale(1.1)'
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
            cursor: (showElevatorArrow && rooftopCompletedTasks.length < 7) ? 'default' : 
                    (rooftopCompletedTasks.length === 7 && courtSummaryCompleted && !showDataCenterArrow) ? 'pointer' :
                    (!showElevatorArrow && !showDataCenterArrow) ? 'pointer' : 'default',
            ...getMomoPosition(),
          }}
          onClick={handleMomoClick}
          onMouseOver={(e) => {
            if ((!showElevatorArrow && !showDataCenterArrow) || 
                (rooftopCompletedTasks.length === 7 && courtSummaryCompleted && !showDataCenterArrow)) {
              e.currentTarget.style.transform = 'scale(1.05)'
            }
          }}
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
          <p 
            style={styles.dialogueText}
            dangerouslySetInnerHTML={{
              __html: displayedText
                .replace(/^(Brrr…[^.]*\.)/g, '<span style="font-weight: 700; color: #4A90E2;">$1</span>') // 蓝色加粗"Brrr…"开头的句子
                .replace(/^(Huh\?[^.]*\.)/g, '<span style="font-weight: 700; color: #E24A4A;">$1</span>') // 红色加粗"Huh?"开头的句子
                .replace(/^(Honestly…[^.]*\.)/g, '<span style="font-weight: 700; color: #9B59B6;">$1</span>') // 紫色加粗"Honestly…"开头的句子
            }}
          />
          {isTyping && <span style={{ opacity: 0.5, marginLeft: '4px' }}>|</span>}
          
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
        const totalSteps = 5
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
          {Object.entries(getCourtNpcPositions()).map(([npcId, position]) => {
            // npc2 and npc3 should be clickable after all cases are done
            const isClickableAfterCompletion = completedCases.length === 5 && (npcId === 'npc2' || npcId === 'npc3')
            const isCompleted = completedCases.includes(npcId)
            
            return (
              <div
                key={npcId}
                style={{
                  ...styles.courtNpc,
                  ...position,
                  height: position.height,
                  opacity: (isCompleted && !isClickableAfterCompletion) ? 0.5 : 1,
                  cursor: isClickableAfterCompletion || !isCompleted ? 'pointer' : 'default',
                }}
                onClick={() => handleNpcClick(npcId)}
                onMouseOver={(e) => {
                  if (isClickableAfterCompletion || !isCompleted) {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }
                }}
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
                {/* Show completion dialogue for npc2 and npc3 after all cases done */}
                {showCourtCompletionDialogue === npcId && completedCases.length === 5 && (npcId === 'npc2' || npcId === 'npc3') && (
                  <div style={{
                    position: 'absolute',
                    bottom: '110%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: '2px solid #333',
                    borderRadius: '15px',
                    padding: '15px 20px',
                    minWidth: '200px',
                    maxWidth: '300px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    zIndex: 100,
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                  }}>
                    <p style={{
                      color: '#333',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      fontFamily: "'Roboto', sans-serif",
                      margin: 0,
                    }}>Let's go outside and find Momo.</p>
                  </div>
                )}
              </div>
            )
          })}
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
          {[
            { id: 'npc5', name: 'Librarian', tasks: ['npc5_puzzle', 'npc5_exercise'] },
            { id: 'npc6', name: 'Artist', tasks: ['npc6_creativity', 'npc6_cocreation'] },
            { id: 'npc9', name: 'Worker', tasks: ['npc9_memory_blocks', 'npc9_memory_footprint', 'npc9_sharing'] }
          ].map((npc, index) => {
            const allTasksComplete = npc.tasks.every(taskId => rooftopCompletedTasks.includes(taskId))
            return (
              <div
                key={npc.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    ...styles.progressCircle,
                    ...(allTasksComplete ? styles.progressCircleCompleted : {}),
                  }}
                >
                  {allTasksComplete ? '✓' : '?'}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: allTasksComplete ? '#10b981' : '#6b7280',
                  textAlign: 'center',
                }}>
                  {npc.name}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Case Modal - Terminal Style */}
      {selectedNpc && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#0a0a0c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: caseStep === 1 ? '40px' : '20px',
            zIndex: 2000,
            transition: 'all 1s ease',
          }}
        >
          {/* Background Ambience */}
          <div style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'hidden',
            opacity: 0.2,
          }}>
            <div style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '40%',
              height: '40%',
              background: '#1e3a8a',
              borderRadius: '50%',
              filter: 'blur(120px)',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '40%',
              height: '40%',
              background: '#581c87',
              borderRadius: '50%',
              filter: 'blur(120px)',
            }} />
          </div>

          <div style={{
            width: '100%',
            maxWidth: caseStep === 1 ? '1400px' : '1200px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: caseStep === 1 ? '64px' : '0',
            zIndex: 10,
            transition: 'all 0.7s ease',
          }}>
            
            {/* The Display Monitor Area */}
            <div style={{
              transition: 'all 1s ease',
              width: caseStep === 1 ? '70%' : '100%',
              maxWidth: caseStep === 1 ? '1400px' : '1200px',
            }}>
              {/* Monitor Container */}
              <div style={{ position: 'relative' }}>
                {/* Outer Bezel */}
                <div style={{
                  width: '100%',
                  background: '#1c1c1e',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)',
                  borderBottom: '12px solid #131315',
                }}>
                  {/* Screen Area */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    background: '#050505',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '2px solid #333',
                    boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
                  }}>
                    {/* Internal Overlays - Only show in Step 1 */}
                    {caseStep === 1 && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 10,
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}>
                        {/* Top info */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              background: '#dc2626',
                              borderRadius: '50%',
                              animation: 'pulse 2s infinite',
                              boxShadow: '0 0 8px rgba(220, 38, 38, 0.8)',
                            }} />
                            <span style={{
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              letterSpacing: '0.2em',
                              opacity: 0.8,
                            }}>REC</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                            <div style={{
                              fontSize: '12px',
                              color: '#ef4444',
                              fontWeight: 'bold',
                              letterSpacing: '0.2em',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              SYS. ALERT <div style={{
                                width: '8px',
                                height: '8px',
                                background: '#ef4444',
                                borderRadius: '50%',
                              }} />
                            </div>
                            <div style={{
                              background: 'rgba(0, 0, 0, 0.5)',
                              padding: '8px 16px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              fontFamily: 'monospace',
                              fontSize: '20px',
                              letterSpacing: '0.2em',
                              fontWeight: 'bold',
                            }}>
                              {formatCaseTimer(caseTimer)}
                            </div>
                          </div>
                        </div>

                        {/* Bottom info */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                        }}>
                          <div style={{
                            fontSize: '10px',
                            color: '#fb923c',
                            opacity: 0.6,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            lineHeight: 1.2,
                            fontFamily: 'monospace',
                          }}>
                            <div>COORD: 45.22.91</div>
                            <div>TEMP: -104°C</div>
                            <div>STATUS: CRITICAL</div>
                          </div>
                          <div style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                          }}>
                            AI-OS SYSTEMS
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 Overlay - System Active and Timer */}
                    {caseStep === 2 && (
                      <div style={{
                        position: 'absolute',
                        top: '24px',
                        left: '24px',
                        right: '24px',
                        pointerEvents: 'none',
                        zIndex: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}>
                        <div style={{
                          fontSize: '12px',
                          color: '#60a5fa',
                          fontWeight: 'bold',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        }}>
                          System Active
                        </div>
                        <div style={{
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '8px 16px',
                          border: '1px solid rgba(96, 165, 250, 0.3)',
                          color: '#60a5fa',
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          letterSpacing: '0.1em',
                        }}>
                          {new Date().toLocaleTimeString('en-US', { hour12: false })}
                        </div>
                      </div>
                    )}

                    {/* Actual Content Wrapper */}
                    {caseStep === 1 ? (
                      // Step 1: Transmission Content
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                      }}>
                        {/* Video Background */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0.4,
                        }}>
                          <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, #1e3a8a 0%, #000 50%, #7f1d1d 100%)',
                            animation: 'pulse 4s infinite',
                          }} />
                        </div>
                        
                        {/* GIF Content */}
                        <img
                          src={courtCases[selectedNpc].gif}
                          alt="Case Event"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.8,
                          }}
                        />
                        
                        {/* Text Overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}>
                          {/* Message at Bottom */}
                          <div style={{
                            padding: '32px',
                          }}>
                            <div style={{
                              maxWidth: '700px',
                              width: '100%',
                              background: 'rgba(10, 10, 12, 0.7)',
                              borderLeft: '2px solid #ef4444',
                              padding: '24px',
                              backdropFilter: 'blur(8px)',
                              position: 'relative',
                              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            }}>
                              <p style={{
                                color: 'white',
                                fontSize: '18px',
                                lineHeight: 1.6,
                                fontFamily: 'sans-serif',
                                fontWeight: 300,
                                letterSpacing: '0.02em',
                                margin: 0,
                              }}>
                                {courtCases[selectedNpc].eventDescription}
                              </p>

                              <div style={{
                                display: 'flex',
                                gap: '16px',
                                marginTop: '24px',
                              }}>
                                <div style={{
                                  flex: 1,
                                  height: '4px',
                                  background: '#1f2937',
                                  overflow: 'hidden',
                                  position: 'relative',
                                }}>
                                  <div style={{
                                    height: '100%',
                                    background: '#3b82f6',
                                    animation: 'progress 10s linear infinite',
                                  }} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Footer Meta - LIVE TRANSMISSION */}
                          <div style={{
                            padding: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                          }}>
                            <div style={{
                              fontSize: '10px',
                              color: 'white',
                              letterSpacing: '0.5em',
                              fontWeight: 'bold',
                              opacity: 0.3,
                            }}>LIVE TRANSMISSION // SECTOR 07</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Step 2: NPC Statement - Keep original design
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgba(20, 20, 30, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                      }}>
                        <div style={{
                          width: '100%',
                          maxWidth: '1200px',
                        }}>
                          {/* Close Button */}
                          <button 
                            style={{
                              position: 'absolute',
                              top: '15px',
                              right: '20px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              zIndex: 10,
                              padding: 0,
                              width: '32px',
                              height: '32px',
                            }}
                            onClick={closeCaseModal}
                          >
                            <img 
                              src="/glacier/icon/close.png"
                              alt="Close"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </button>
                          
                          <div style={styles.step2Container}>
                            {/* Left Column: NPC + Role + Play Button */}
                            <div style={styles.step2LeftColumn}>
                              <div style={{
                                position: 'relative',
                                display: 'inline-block',
                              }}>
                                <img
                                  src={courtCases[selectedNpc].npcImage}
                                  alt={selectedNpc}
                                  style={{
                                    width: 'auto',
                                    height: '480px',
                                    maxWidth: 'none',
                                    objectFit: 'contain',
                                  }}
                                />
                                
                                <button
                                  onClick={() => handlePlayStatement(selectedNpc)}
                                  disabled={isGeneratingAudio || isPlayingAudio}
                                  style={{
                                    position: 'absolute',
                                    bottom: '30%',
                                    left: '50%',
                                    transform: 'translate(-50%, 50%)',
                                    width: '80px',
                                    height: '80px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: isGeneratingAudio || isPlayingAudio ? 'not-allowed' : 'pointer',
                                    opacity: isGeneratingAudio ? 0.5 : (isPlayingAudio ? 0.7 : 1),
                                    transition: 'all 0.3s ease',
                                    padding: 0,
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isGeneratingAudio && !isPlayingAudio) {
                                      e.currentTarget.style.transform = 'translate(-50%, 50%) scale(1.1)'
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translate(-50%, 50%) scale(1)'
                                  }}
                                >
                                  <img 
                                    src="/glacier/icon/play.png"
                                    alt="Play"
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'contain',
                                      filter: isPlayingAudio ? 'brightness(0.7)' : 'none',
                                    }}
                                  />
                                </button>
                              </div>
                              
                              {/* Horizontal line */}
                              <div style={{
                                width: '280px',
                                height: '1px',
                                background: '#60a5fa',
                                opacity: 0.3,
                                marginTop: '10px',
                                marginBottom: '10px',
                              }} />
                              
                              <div style={{
                                fontSize: '11px',
                                color: '#e0e0e0',
                                fontFamily: "'Roboto', sans-serif",
                                fontWeight: 400,
                                textAlign: 'center',
                                lineHeight: 1.2,
                                padding: '0',
                                width: '280px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {t('language') === 'zh' 
                                  ? courtCases[selectedNpc].npcRole.zh 
                                  : courtCases[selectedNpc].npcRole.en
                                }
                              </div>
                            </div>
                            
                            {/* Right Column: Content */}
                            <div style={styles.step2RightColumn}>
                              {/* Header Section with Sound Icon on the right */}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '16px',
                              }}>
                                <div>
                                  {/* Title */}
                                  <div style={{
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    fontFamily: "'Orbitron', sans-serif",
                                    marginBottom: '8px',
                                    letterSpacing: '0.1em',
                                  }}>
                                    NPC STATEMENT
                                  </div>
                                  
                                  {/* Case Info - Blue, smaller font */}
                                  <div style={{
                                    fontSize: '10px',
                                    color: '#60a5fa',
                                    fontFamily: "'Roboto', sans-serif",
                                    letterSpacing: '0.05em',
                                  }}>
                                    {t('language') === 'zh' ? '案件' : 'Case'} #{courtCases[selectedNpc].caseNumber} · {
                                      t('language') === 'zh' 
                                        ? courtCases[selectedNpc].caseTitle.zh 
                                        : courtCases[selectedNpc].caseTitle.en
                                    }
                                  </div>
                                </div>
                                
                                {/* Sound Icon - Right side, larger */}
                                <img 
                                  src="/glacier/icon/sound.png"
                                  alt="Sound"
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'contain',
                                    opacity: 0.8,
                                    marginLeft: '20px',
                                  }}
                                />
                              </div>
                              
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
                              
                              {statementProgress >= 3 && (
                                <div style={{
                                  ...styles.claimQuote,
                                  fontFamily: "'Inter', sans-serif",
                                  borderLeft: '2px solid #60a5fa',
                                  paddingLeft: '16px',
                                }}>
                                  "{courtCases[selectedNpc].claim}"
                                </div>
                              )}
                              
                              {statementProgress >= 3 && (
                                <div style={styles.judgmentButtonsContainer}>
                                  <button
                                    style={{
                                      ...styles.approvedButton,
                                      color: '#2ecc71',
                                      animation: shakeApprovedButton ? 'shake 0.5s' : 'none',
                                    }}
                                    onClick={() => handleJudgment('accepted')}
                                    onMouseOver={(e) => {
                                      if (!shakeApprovedButton) {
                                        e.currentTarget.style.boxShadow = '0 0 45px rgba(46, 204, 113, 0.7)'
                                        e.currentTarget.style.transform = 'scale(1.05)'
                                        e.currentTarget.style.background = 'rgba(46, 204, 113, 0.4)'
                                      }
                                    }}
                                    onMouseOut={(e) => {
                                      if (!shakeApprovedButton) {
                                        e.currentTarget.style.boxShadow = '0 0 25px rgba(46, 204, 113, 0.5)'
                                        e.currentTarget.style.transform = 'scale(1)'
                                        e.currentTarget.style.background = 'rgba(46, 204, 113, 0.3)'
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
                                    style={{
                                      ...styles.rejectedButton,
                                      color: '#e74c3c',
                                    }}
                                    onClick={() => handleJudgment('rejected')}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 45px rgba(231, 76, 60, 0.7)'
                                      e.currentTarget.style.transform = 'scale(1.05)'
                                      e.currentTarget.style.background = 'rgba(231, 76, 60, 0.4)'
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.boxShadow = '0 0 25px rgba(231, 76, 60, 0.5)'
                                      e.currentTarget.style.transform = 'scale(1)'
                                      e.currentTarget.style.background = 'rgba(231, 76, 60, 0.3)'
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
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Monitor Stand */}
                <div style={{
                  margin: '0 auto',
                  width: '192px',
                  height: '48px',
                  background: '#1c1c1e',
                  borderBottomLeftRadius: '12px',
                  borderBottomRightRadius: '12px',
                  marginTop: '-4px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                }} />
              </div>
            </div>

            {/* The Handheld Remote Area - Only visible in Step 1 */}
            {caseStep === 1 && (
              <div style={{
                flexShrink: 0,
                marginTop: '80px',
                transition: 'all 0.5s ease',
                opacity: caseStep === 1 ? 1 : 0,
                transform: caseStep === 1 ? 'translateX(0)' : 'translateX(80px)',
                pointerEvents: caseStep === 1 ? 'auto' : 'none',
              }}>
                {/* Remote Body */}
                <div style={{
                  position: 'relative',
                }}>
                  <div style={{
                    width: '192px',
                    height: '320px',
                    background: '#1a1f2e',
                    borderRadius: '40px',
                    border: '4px solid #2d3548',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '24px',
                    position: 'relative',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                  }}>
                    
                    <div style={{
                      fontSize: '10px',
                      color: '#60a5fa',
                      fontWeight: 'bold',
                      letterSpacing: '0.3em',
                      marginBottom: '32px',
                      opacity: 0.7,
                    }}>CONTROL</div>

                    {/* Power / Close Button Area */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '40px',
                    }}>
                      <button 
                        onClick={handleNextStep}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                          background: '#7f1d1d',
                          border: '2px solid #991b1b',
                          opacity: 0.9,
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1'
                          e.currentTarget.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.9'
                          e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'scale(0.95)'
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'
                        }}
                      >
                        <img 
                          src="/glacier/icon/close.png"
                          alt="Close"
                          style={{
                            width: '28px',
                            height: '28px',
                            objectFit: 'contain',
                          }}
                        />
                      </button>
                      <div style={{
                        fontSize: '8px',
                        color: '#ef4444',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        animation: 'pulse 2s infinite',
                      }}>Watch then Close</div>
                    </div>

                    {/* Static Nav Cluster */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      width: '100%',
                      padding: '0 8px',
                      marginBottom: '16px',
                      opacity: 0.4,
                    }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                          width: '40px',
                          height: '32px',
                          background: '#2d3548',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280',
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#4b5563',
                          }} />
                        </div>
                      ))}
                    </div>

                    {/* Info Screen */}
                    <div style={{
                      width: '100%',
                      background: '#131722',
                      borderRadius: '8px',
                      padding: '8px',
                      marginBottom: '16px',
                      border: '1px solid #2d3548',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: '#1e3a8a',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: '66%',
                          height: '100%',
                          background: '#60a5fa',
                        }} />
                      </div>
                      <span style={{
                        fontSize: '7px',
                        color: '#93c5fd',
                        fontWeight: 'bold',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                      }}>Signal Lock</span>
                    </div>

                    {/* Status Dots */}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginTop: 'auto',
                      marginBottom: '8px',
                      opacity: 0.3,
                    }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                          width: '4px',
                          height: '4px',
                          background: '#60a5fa',
                          borderRadius: '50%',
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subtle UI Decorations */}
          <div style={{
            position: 'fixed',
            top: '32px',
            left: '32px',
            fontSize: '10px',
            color: '#3b82f6',
            fontWeight: 'bold',
            letterSpacing: '0.4em',
            opacity: 0.3,
            userSelect: 'none',
          }}>
            CHRONOS-OS // TERMINAL_SESSION_ACTIVE
          </div>

          <div style={{
            position: 'fixed',
            bottom: '16px',
            fontSize: '8px',
            color: '#374151',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            opacity: 0.2,
          }}>
            Terminal v2.4.0-Stable // Unauthorized Access Prohibited
          </div>

          {/* CSS Animations */}
          <style>{`
            @keyframes progress {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes ping {
              0% { transform: scale(1); opacity: 1; }
              75%, 100% { transform: scale(2); opacity: 0; }
            }
          `}</style>
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
        const totalSteps = 5
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
                
                {/* Close Button removed - dialogue cannot be skipped */}
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
                  {summaryDialogueSequence[summaryDialogueIndex + 1].options.map((option, idx) => {
                    const isWrong = wrongQuizOption === option.id
                    return (
                      <button
                        key={idx}
                        style={{
                          ...styles.modernActionButton,
                          borderColor: isWrong ? '#F44336' : '#E0E0E0',
                          borderWidth: isWrong ? '3px' : '2px',
                        }}
                        onClick={() => handleSummaryQuizChoice(option)}
                        onMouseOver={(e) => {
                          if (!isWrong) {
                            e.target.style.borderColor = theme.borderColor
                          }
                          e.target.style.transform = 'translateX(5px)'
                        }}
                        onMouseOut={(e) => {
                          if (!isWrong) {
                            e.target.style.borderColor = '#E0E0E0'
                          } else {
                            e.target.style.borderColor = '#F44336'
                          }
                          e.target.style.transform = 'translateX(0)'
                        }}
                      >
                        <span style={{fontSize: '16px', color: isWrong ? '#F44336' : theme.borderColor}}>→</span>
                        {option.text}
                      </button>
                    )
                  })}
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

      {/* Elevator Arrow - only show if rooftop tasks not completed */}
      {showElevatorArrow && currentScene === 'inside' && rooftopCompletedTasks.length < 7 && (
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
      
      {/* Data Center Arrow - show after rooftop quiz completion */}
      {showDataCenterArrow && currentScene === 'inside' && (
        <div 
          style={{
            position: 'absolute',
            top: '150px',
            right: '0px',
            width: '400px',
            height: 'auto',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
            zIndex: 100,
          }}
          onClick={() => {
            setCurrentScene('datacenter')
            setShowDataCenterArrow(false)
            setShowFillBlankTask(true)
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          <img 
            src="/glacier/icon/arrow3.png"
            alt="Data Center Arrow"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* All Tasks Complete Message */}
      {currentScene === 'rooftop' && rooftopCompletedTasks.length === 7 && (
        <div style={{
          position: 'absolute',
          left: 'calc(250px + 200px + 20px)',
          top: '150px',
          width: '400px',
          minHeight: '100px',
          background: 'rgba(240, 248, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(100, 149, 237, 0.4)',
          borderRadius: '20px',
          padding: '25px 30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 149, 237, 0.2)',
          zIndex: 1000,
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1f2937',
            lineHeight: '1.6',
            textAlign: 'center',
          }}>
            All Tasks Complete!<br/>
            Go downstairs and talk to Momo
          </div>
        </div>
      )}

      {/* Rooftop NPC 5 */}
      {currentScene === 'rooftop' && (
        <div 
          style={styles.npc5}
          onClick={() => {
            setSelectedRooftopNpc('npc5')
            setShowRooftopDesktop(true)
          }}
        >
          <img 
            src="/glacier/npc/npc5.png"
            alt="NPC 5"
            style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
          />
        </div>
      )}

      {/* Rooftop NPC 6 */}
      {currentScene === 'rooftop' && (
        <div 
          style={styles.npc6}
          onClick={() => {
            setSelectedRooftopNpc('npc6')
            setShowRooftopDesktop(true)
          }}
        >
          <img 
            src="/glacier/npc/npc6.png"
            alt="NPC 6"
            style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
          />
        </div>
      )}

      {/* NPC 5 Dialogue - REMOVED: Info now in Notes */}
      {false && showNpc5Dialogue && (
        <div style={styles.npc5DialogueContainer}>
          {/* Completion message */}
          {npc5DialogueIndex === -1 ? (
            <>
              <div style={{ marginBottom: '15px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  {rooftopCompletedTasks.length === 7 
                    ? "Let's go down and look for Momo." 
                    : "Oh, hello again! You know, my brain feels... awake."}
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
              {/* Current NPC5 Dialogue with typing animation */}
              <div style={{ marginBottom: '20px', flex: 1 }}>
                {npc5DialogueIndex < npc5DialogueSequence.length && !npc5DialogueSequence[npc5DialogueIndex].isButton && (
                  <div style={styles.dialogueText}>
                    {npc5TypedText}
                  </div>
                )}
              </div>

              {/* "Let me help you" Button - show when npc5ShowButton is true */}
              {npc5ShowButton && (
                <button 
                  style={{
                    padding: '15px 40px',
                    background: 'rgba(30, 30, 50, 0.85)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => handleNpc5UserChoice(npc5DialogueSequence[5].text)}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(50, 50, 80, 0.9)'
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(30, 30, 50, 0.85)'
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {npc5DialogueSequence[5].text}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* NPC 6 Dialogue - REMOVED: Info now in Notes */}
      {false && showNpc6Dialogue && (
        <div style={styles.npc6DialogueContainer}>
          {/* Completion message */}
          {npc6DialogueIndex === -1 ? (
            <>
              <div style={{ marginBottom: '15px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  {rooftopCompletedTasks.length === 7 
                    ? "Let's go down and look for Momo." 
                    : "Thank you... I can feel it coming back. The spark. The vision. My hands remember now."}
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
              {/* NPC6 text with typing animation */}
              <div style={{ marginBottom: '20px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  {npc6TypedText}
                </div>
              </div>

              {/* "Let's spark together" Button - show when npc6ShowButton is true */}
              {npc6ShowButton && (
                <button 
                  style={{
                    padding: '15px 40px',
                    background: 'rgba(30, 30, 50, 0.85)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={handleNpc6UserChoice}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(50, 50, 80, 0.9)'
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(30, 30, 50, 0.85)'
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {npc6DialogueSequence[4].text}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Creativity Challenge */}
      {showCreativityChallenge && selectedChallenges.length > 0 && (
        <div style={{
          ...styles.creativityContainer,
          width: '65vw',
          maxWidth: '650px',
          maxHeight: '75vh',
          zIndex: showRooftopDesktop ? 2000 : 3000,
        }}>
          {/* macOS Traffic Light Buttons */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}>
            <button
              onClick={() => {
                setShowCreativityChallenge(false)
                setCurrentChallenge(0)
                setUserInputs([])
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ff5f57',
                border: 'none',
                cursor: 'pointer',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ffbd2e',
                border: 'none',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#28ca42',
                border: 'none',
              }}
            />
          </div>
          
          {/* Timer */}
          <div style={{
            ...styles.creativityTimer,
            ...(challengeTimer < 15 ? styles.creativityTimerRed : {})
          }}>
            {formatTimer(challengeTimer)}
          </div>
          
          {/* Title */}
          <div style={styles.creativityTitle}>
            {(() => {
              const text = selectedChallenges[currentChallenge].en
              // Highlight "mobile phones" and "5 different ways"
              const parts = text.split(/(mobile phones|5 different ways)/gi)
              return parts.map((part, index) => {
                if (part.toLowerCase() === 'mobile phones' || part.toLowerCase() === '5 different ways') {
                  return <span key={index} style={{ color: '#a0d8ff' }}>{part}</span>
                }
                return <span key={index}>{part}</span>
              })
            })()}
          </div>
          
          {/* Tags Container */}
          <div style={styles.creativityTagsContainer}>
            {userInputs.map((input, index) => (
              <div 
                key={index} 
                style={{
                  ...styles.creativityTag,
                  ...(index % 2 === 0 ? styles.creativityTagYellow : styles.creativityTagRed)
                }}
              >
                {input}
              </div>
            ))}
          </div>
          
          {/* Input Section */}
          <div style={styles.creativityInputSection}>
            {/* Hint Modal - Above Input */}
            {showHint && selectedChallenges.length > 0 && (
              <div style={styles.creativityHintModal}>
                <div style={styles.creativityHintHeader}>
                  <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="#a0d8ff">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <span style={styles.creativityHintTitle}>Hint</span>
                  <button
                    style={styles.creativityHintClose}
                    onClick={() => setShowHint(false)}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    ✕
                  </button>
                </div>
                <div style={styles.creativityHintContent}>
                  {selectedChallenges[currentChallenge].hints.en.map((hint, index) => (
                    <div key={index} style={styles.creativityHintItem}>
                      <span style={styles.creativityHintLabel}>Prompt {index + 1}:</span>
                      <div style={{ fontSize: '11px' }}>{hint}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hint Button */}
            <button
              style={styles.creativityHintButton}
              onClick={() => setShowHint(true)}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg style={styles.creativityHintIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              Hint
            </button>
            
            {/* Input Container */}
            <div style={styles.creativityInputContainer}>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleChallengeInputKeyPress}
                placeholder="Typing here..."
                style={styles.creativityInput}
                autoFocus
              />
              
              {/* Divider */}
              <div style={styles.creativityDivider}></div>
              
              {/* Send Button */}
              <button
                style={styles.creativitySendButton}
                onClick={handleChallengeSubmit}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img 
                  src="/glacier/icon/send.png"
                  alt="Send"
                  style={styles.creativitySendIcon}
                />
              </button>
            </div>
            
            {/* Progress Indicator */}
            <div style={styles.creativityProgress}>
              {Array.from({ length: selectedChallenges[currentChallenge].requiredCount }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.creativityProgressDot,
                    ...(index < userInputs.length ? styles.creativityProgressDotActive : {})
                  }}
                />
              ))}
              <span style={styles.creativityProgressText}>
                {userInputs.length}/{selectedChallenges[currentChallenge].requiredCount}
              </span>
            </div>
          </div>
        </div>
      )}


      {/* Co-Creation Task */}
      {showCoCreation && (
        <div style={{
          ...styles.coCreationContainer,
          width: '75vw',
          maxWidth: '950px',
          maxHeight: '75vh',
          zIndex: showRooftopDesktop ? 2000 : 3000,
        }}>
          {/* macOS Traffic Light Buttons */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}>
            <button
              onClick={() => {
                setShowCoCreation(false)
                setCoCreationFormulas([
                  { element: null, result: null, completed: false },
                  { element: null, result: null, completed: false }
                ])
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ff5f57',
                border: 'none',
                cursor: 'pointer',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ffbd2e',
                border: 'none',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#28ca42',
                border: 'none',
              }}
            />
          </div>
          
          <style>{`
            @keyframes shake {
              0%, 100% { transform: translateX(0); }
              25% { transform: translateX(-5px) rotate(-2deg); }
              75% { transform: translateX(5px) rotate(2deg); }
            }
          `}</style>
          
          {/* NPC Dialogue - Bubble Style */}
          {!showSuccessMessage && !coCreationFormulas[0].completed && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '15px',
              marginTop: '10px',
            }}>
              {/* NPC Avatar with white circle background */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}>
                <img 
                  src="/glacier/npc/npc6.png" 
                  alt="NPC6" 
                  style={{ 
                    width: '45px', 
                    height: '45px',
                    borderRadius: '50%',
                  }} 
                />
              </div>
              
              {/* Speech Bubble */}
              <div style={{
                flex: 1,
                background: '#fff',
                borderRadius: '15px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '15px',
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '8px solid #fff',
                }}></div>
                <p style={{ 
                  margin: 0, 
                  color: '#333', 
                  fontSize: '13px', 
                  lineHeight: 1.4,
                }}>
                  Thanks! My brain is starting to unfreeze. I need to design a 'Creative Ice Cream,' but I'm stuck with this boring Vanilla.
                </p>
              </div>
              
              {/* Ice Cream Icon */}
              <img 
                src="/glacier/mission/cream.png" 
                alt="Ice Cream" 
                style={{ 
                  width: '45px', 
                  height: '45px',
                  flexShrink: 0,
                }} 
              />
            </div>
          )}
          
          {/* Success Message */}
          {showSuccessMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '15px',
              marginTop: '10px',
            }}>
              {/* NPC Avatar with white circle background */}
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}>
                <img 
                  src="/glacier/npc/npc6.png" 
                  alt="NPC6" 
                  style={{ 
                    width: '45px', 
                    height: '45px',
                    borderRadius: '50%',
                  }} 
                />
              </div>
              
              {/* Speech Bubble */}
              <div style={{
                flex: 1,
                background: '#fff',
                borderRadius: '15px',
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: '-8px',
                  top: '15px',
                  width: 0,
                  height: 0,
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent',
                  borderRight: '8px solid #fff',
                }}></div>
                <p style={{ 
                  margin: 0, 
                  color: '#4caf50', 
                  fontSize: '14px', 
                  fontWeight: 'bold', 
                  lineHeight: 1.4,
                }}>
                  Wow! That's a brilliant idea! It looks amazing!
                </p>
              </div>
            </div>
          )}
          
          {/* Instruction */}
          <div style={{
            textAlign: 'center',
            color: '#a0d8ff',
            fontSize: '14px',
            marginBottom: '8px',
          }}>
            Drag an element below to create a cool new ice cream flavor!
          </div>
          
          {/* Formulas Area */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '15px',
          }}>
            {coCreationFormulas.map((formula, index) => (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '15px',
                  opacity: index === 0 ? 1 : (index === currentFormulaIndex ? 1 : 0.5)
                }}
              >
                {/* Ice Cream */}
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: '#fff',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}>
                  <img src="/glacier/mission/cream.png" alt="Ice Cream" style={{ width: '90px', height: '90px' }} />
                </div>
                
                {/* Plus Icon */}
                <img src="/glacier/icon/add.png" alt="+" style={{ width: '35px', height: '35px' }} />
                
                {/* Drop Zone or Element */}
                {formula.element ? (
                  <div style={{
                    width: '180px',
                    height: '70px',
                    border: '3px dashed rgba(160, 216, 255, 0.5)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '16px',
                    color: '#fff',
                  }}>
                    {formula.element}
                  </div>
                ) : (
                  <div style={{
                    width: '180px',
                    height: '70px',
                    border: '3px dashed rgba(160, 216, 255, 0.5)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'Roboto Mono', monospace",
                    fontSize: '16px',
                    color: '#fff',
                  }}>
                    Drop Here
                  </div>
                )}
                
                {/* Equal Icon */}
                <img src="/glacier/icon/equal.png" alt="=" style={{ width: '35px', height: '35px' }} />
                
                {/* Result */}
                {formula.result ? (
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: '#f0d32d',
                    border: '4px solid #a0d8ff',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    animation: 'shake 0.5s',
                  }}>
                    <img src={formula.result} alt="Result" style={{ width: '110px', height: '110px' }} />
                  </div>
                ) : (
                  <div style={{ 
                    width: '120px',
                    height: '120px',
                    background: '#fff',
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    border: '3px dashed rgba(160, 216, 255, 0.5)', 
                    background: 'transparent' 
                  }}>
                    <img src="/glacier/icon/picture.png" alt="?" style={{ width: '50px', height: '50px', opacity: 0.5 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Elements */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            justifyContent: 'center',
            padding: '10px 0',
          }}>
            {coCreationElements.map((element, index) => (
              <button
                key={element.id}
                onClick={() => handleElementClick(element)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '20px',
                  border: 'none',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#fff',
                  cursor: coCreationCompleted ? 'default' : 'pointer',
                  transition: 'transform 0.2s',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  background: index % 2 === 0 ? '#f0d32d' : '#ab3a2c',
                  opacity: coCreationCompleted ? 0.5 : 1,
                }}
                onMouseOver={(e) => {
                  if (!coCreationCompleted) {
                    e.currentTarget.style.transform = 'scale(1.1)'
                  }
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
                disabled={coCreationCompleted}
              >
                {element.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rooftop NPC 9 */}
      {currentScene === 'rooftop' && (
        <div 
          style={{
            position: 'absolute',
            top: '150px',
            left: '750px',
            width: '200px',
            height: '200px',
            cursor: 'pointer',
            zIndex: 50,
            transition: 'transform 0.2s',
          }}
          onClick={() => {
            setSelectedRooftopNpc('npc9')
            setShowRooftopDesktop(true)
          }}
        >
          <img 
            src="/glacier/npc/npc9.png"
            alt="NPC 9"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* NPC 9 Dialogue - REMOVED: Info now in Notes */}
      {false && showNpc9Dialogue && (
        <div style={{
          position: 'absolute',
          left: 'calc(750px + 200px)',
          top: '150px',
          width: '550px',
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
        }}>
          {/* Completion message */}
          {npc9DialogueIndex === -1 ? (
            <>
              <div style={{ marginBottom: '15px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  {rooftopCompletedTasks.length === 7 
                    ? "Let's go down and look for Momo." 
                    : "Wow! My brain feels... rebooted! I can focus again. Thank you!"}
                </div>
              </div>
              <button 
                style={styles.npc6ContinueButton}
                onClick={() => setShowNpc9Dialogue(false)}
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
              {/* NPC9 text with typing animation */}
              <div style={{ marginBottom: '20px', flex: 1 }}>
                <div style={styles.dialogueText}>
                  {npc9TypedText}
                </div>
              </div>

              {/* "Let's do it!" Button - show when npc9ShowButton is true */}
              {npc9ShowButton && (
                <button 
                  style={{
                    padding: '15px 40px',
                    background: 'rgba(30, 30, 50, 0.85)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={handleNpc9UserChoice}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(50, 50, 80, 0.9)'
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(30, 30, 50, 0.85)'
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {npc9DialogueSequence[3].text}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Memory Challenge - Show on desktop background when rooftop desktop is open */}
      {showMemoryChallenge && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: memoryPhase === 'footstepRecall' ? '55vw' : '60vw',
          maxWidth: memoryPhase === 'footstepRecall' ? '800px' : '850px',
          maxHeight: '75vh',
          background: 'rgba(20, 20, 30, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: 'none',
          borderRadius: '20px',
          padding: '25px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.6)',
          zIndex: showRooftopDesktop ? 2000 : 3000,
          overflow: 'auto',
        }}>
          {/* macOS Traffic Light Buttons */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}>
            <button
              onClick={() => {
                setShowMemoryChallenge(false)
                setMemoryPhase('snowPath')
                setSnowPathRound(0)
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ff5f57',
                border: 'none',
                cursor: 'pointer',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ffbd2e',
                border: 'none',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#28ca42',
                border: 'none',
              }}
            />
          </div>
          
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '15px',
            marginTop: '10px',
            flexShrink: 0,
          }}>
            <div style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              color: '#a0d8ff',
            }}>
              Mission: {memoryPhase === 'snowPath' ? 'Snow Path' : 'Footstep Recall'}
            </div>
            {memoryPhase === 'snowPath' && (
              <div style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '42px',
                fontWeight: '700',
                color: snowPathTimer < 5 ? '#ff4444' : '#a0d8ff',
              }}>
                {snowPathMemorizing ? formatTimer(snowPathTimer) : 'GO!'}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div style={{
            fontFamily: "'Roboto', sans-serif",
            fontSize: '13px',
            color: '#fff',
            marginBottom: '12px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            {memoryPhase === 'snowPath' 
              ? "Memorize the footprints, then tap the correct tiles when they disappear."
              : "Footprints light up in red one by one—after the sequence ends, tap them back in the same order."}
          </div>

          {/* Snow Path Grid */}
          {memoryPhase === 'snowPath' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '8px',
              width: '100%',
              maxWidth: '450px',
              margin: '0 auto',
              alignSelf: 'center',
              flex: '1 1 auto',
            }}>
              {Array.from({ length: 16 }).map((_, index) => {
                const hasFootprint = snowPathFootprints.includes(index)
                const isSelected = snowPathUserSelections.includes(index)
                const isCorrect = isSelected && hasFootprint
                const isWrong = isSelected && !hasFootprint
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSnowPathTileClick(index)}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      background: isWrong ? '#c62828' : (isCorrect ? '#2e7d32' : '#1f2937'),
                      border: `3px solid ${isWrong ? '#f44336' : (isCorrect ? '#4caf50' : (hasFootprint && snowPathMemorizing ? '#a0d8ff' : 'transparent'))}`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: snowPathMemorizing ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {hasFootprint && snowPathMemorizing && (
                      <img 
                        src="/glacier/icon/footprint.svg"
                        alt="Footprint"
                        style={{ width: '55%', height: '55%', objectFit: 'contain' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Footstep Recall - Staggered 2x6 Grid */}
          {memoryPhase === 'footstepRecall' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: '25px',
              flex: 1,
              maxWidth: '85%',
              margin: '0 auto',
              alignItems: 'center',
            }}>
              {Array.from({ length: 6 }).map((_, index) => {
                const isHighlighted = footstepCurrentHighlight === index
                const isInUserSequence = footstepUserSequence.includes(index)
                
                // Stagger pattern: top row has indices 0, 2, 4; bottom row has 1, 3, 5
                const row = index % 2 === 0 ? 1 : 2
                const col = Math.floor(index / 2) * 2 + (index % 2 === 0 ? 1 : 2)
                
                return (
                  <div
                    key={index}
                    onClick={() => handleFootstepClick(index)}
                    style={{
                      gridRow: row,
                      gridColumn: col,
                      aspectRatio: '1',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: footstepShowingSequence ? 'default' : 'pointer',
                      transition: 'all 0.2s',
                      transform: isInUserSequence ? 'scale(0.9)' : 'scale(1)',
                    }}
                  >
                    <img 
                      src={isHighlighted ? "/glacier/icon/foot_red.svg" : "/glacier/icon/foot.svg"}
                      alt="Footprint"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        filter: isInUserSequence ? 'brightness(0.7)' : 'brightness(1)',
                      }}
                    />
                  </div>
                )
              })}
            </div>
          )}

          {/* Progress Circles */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            marginTop: '15px',
            flexShrink: 0,
          }}>
            {Array.from({ length: 3 }).map((_, index) => {
              const currentRound = memoryPhase === 'snowPath' ? snowPathRound : footstepRound
              const isComplete = index < currentRound
              
              return (
                <div
                  key={index}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: isComplete ? '#a0d8ff' : '#666566',
                    transition: 'all 0.3s',
                  }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Puzzle Interface */}
      {showPuzzle && (
        <div style={{
          ...styles.puzzleContainer,
          width: '75vw',
          maxWidth: '1100px',
          height: '65vh',
          zIndex: showRooftopDesktop ? 2000 : 3000,
        }}>
          {/* macOS Traffic Light Buttons */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}>
            <button
              onClick={() => {
                setShowPuzzle(false)
                setCurrentPuzzle(1)
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ff5f57',
                border: 'none',
                cursor: 'pointer',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ffbd2e',
                border: 'none',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#28ca42',
                border: 'none',
              }}
            />
          </div>
          
          {/* Left Panel - 25% */}
          <div style={styles.puzzleLeftPanel}>
            {/* Timer - only show when not in teaching mode */}
            {!showTeachingDialogue && (
              <>
                <div style={styles.puzzleTimer}>
                  {formatTimer(puzzleTimer)}
                </div>
                
                {/* Image */}
                <div style={styles.puzzleImageContainer}>
                  <img 
                    src={puzzleData[currentPuzzle].image}
                    alt={`Puzzle ${currentPuzzle}`}
                    style={styles.puzzleImage}
                  />
                </div>
              </>
            )}

            {/* Teaching Dialogue - replaces timer and image */}
            {showTeachingDialogue && (
              <div style={{ 
                width: '100%', 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                padding: '20px 15px' 
              }}>
                {/* Top section - NPC dialogues */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, overflowY: 'auto' }}>
                  {/* NPC Question */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <img 
                      src="/glacier/npc/npc5.png"
                      alt="NPC 5"
                      style={{ width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0 }}
                    />
                    <div style={{
                      background: '#fff',
                      color: '#000',
                      padding: '12px 18px',
                      borderRadius: '15px',
                      fontSize: '16px',
                      lineHeight: 1.4,
                      maxWidth: '180px',
                    }}>
                      Could you... could you teach me?
                    </div>
                  </div>

                  {/* User's explanation bubble (shown ONLY after submission) */}
                  {submittedExplanation && (
                    <div style={{
                      background: '#5170FF',
                      color: '#fff',
                      padding: '12px 18px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      lineHeight: 1.4,
                      alignSelf: 'flex-end',
                      maxWidth: '85%',
                      wordWrap: 'break-word',
                    }}>
                      {submittedExplanation}
                    </div>
                  )}

                  {/* NPC Response (shown after user submits) */}
                  {submittedExplanation && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <img 
                        src="/glacier/npc/npc5.png"
                        alt="NPC 5"
                        style={{ width: '50px', height: '50px', borderRadius: '50%', flexShrink: 0 }}
                      />
                      <div style={{
                        background: '#fff',
                        color: '#000',
                        padding: '12px 18px',
                        borderRadius: '15px',
                        fontSize: '16px',
                        lineHeight: 1.4,
                        maxWidth: '180px',
                      }}>
                        {isNpc5Generating ? 'Thinking...' : (npc5Response || "Got it, Let's move to next one")}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom section - Prompt and Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Prompt */}
                  <div style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    lineHeight: 1.4,
                  }}>
                    Teach them<br />
                    "How did you solve this?"
                  </div>

                  {/* Input container with send button inside */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '15px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}>
                    <input
                      type="text"
                      style={{
                        flex: 1,
                        padding: '12px 15px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '14px',
                        color: '#fff',
                        outline: 'none',
                      }}
                      placeholder="Explain here..."
                      value={userExplanation}
                      onChange={(e) => setUserExplanation(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleExplanationSubmit()
                        }
                      }}
                    />
                    
                    {/* Divider */}
                    <div style={{
                      width: '2px',
                      height: '24px',
                      backgroundColor: '#5170FF',
                      margin: '0 8px',
                      flexShrink: 0,
                    }}></div>
                    
                    {/* Send button inside input */}
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 12px',
                        transition: 'all 0.2s',
                      }}
                      onClick={handleExplanationSubmit}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <img 
                        src="/glacier/icon/send.png"
                        alt="Send"
                        style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - 75% */}
          <div style={styles.puzzleRightPanel}>
            {/* Title */}
            <div style={styles.puzzleTitle}>
              {puzzleData[currentPuzzle].title}
            </div>

            {/* Statement */}
            {puzzleData[currentPuzzle].statement && (
              <div style={styles.puzzleStatement}>
                NPC 5: "{puzzleData[currentPuzzle].statement}"
              </div>
            )}

            {/* Premise (for puzzle 2) */}
            {puzzleData[currentPuzzle].premise && (
              <div style={styles.puzzleStatement}>
                Premise:<br />
                {renderColoredText(puzzleData[currentPuzzle].premise)}
              </div>
            )}

            {/* Arguments (for puzzle 2) */}
            {puzzleData[currentPuzzle].arguments && (
              <div style={styles.puzzleStatement}>
                Arguments:<br />
                {renderColoredText(puzzleData[currentPuzzle].arguments)}
              </div>
            )}

            {/* Question */}
            <div style={styles.puzzleQuestion}>
              Question: {puzzleData[currentPuzzle].question}
            </div>

            {/* Options */}
            <div style={styles.puzzleOptions}>
              {puzzleData[currentPuzzle].options.map((option, index) => {
                // Determine base style
                let optionStyle = { ...styles.puzzleOption }
                
                // Apply selected state styles
                if (selectedAnswer === index) {
                  if (option.correct) {
                    optionStyle = { ...optionStyle, ...styles.puzzleOptionCorrect }
                  } else {
                    optionStyle = { ...optionStyle, ...styles.puzzleOptionWrong }
                  }
                }
                
                // Check if correct answer is already selected
                const correctAnswerSelected = selectedAnswer !== null && 
                  puzzleData[currentPuzzle].options[selectedAnswer].correct
                
                return (
                  <button
                    key={index}
                    style={optionStyle}
                    onClick={() => handlePuzzleAnswer(option, index)}
                    disabled={correctAnswerSelected}
                    onMouseEnter={(e) => {
                      if (!correctAnswerSelected) {
                        e.currentTarget.style.background = '#2d3748'
                        e.currentTarget.style.transform = 'translateX(5px)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!correctAnswerSelected) {
                        e.currentTarget.style.background = '#1f2937'
                        e.currentTarget.style.transform = 'translateX(0)'
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
      )}

      {/* Exercise Interface - Underline Errors */}
      {showExercise && (() => {
        console.log('Rendering exercise interface, currentExercise:', currentExercise)
        return (
        <div style={{
          ...styles.puzzleContainer,
          width: '80vw',
          maxWidth: '1200px',
          height: '65vh',
          zIndex: showRooftopDesktop ? 2000 : 3000,
        }}>
          {/* macOS Traffic Light Buttons */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}>
            <button
              onClick={() => {
                setShowExercise(false)
                setCurrentExercise(1)
                setSelectedErrors([])
              }}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ff5f57',
                border: 'none',
                cursor: 'pointer',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#ffbd2e',
                border: 'none',
              }}
            />
            <button
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#28ca42',
                border: 'none',
              }}
            />
          </div>
          
          <style>{`
            .exercise-text-area {
              cursor: url(/glacier/icon/pen-cursor.png) 16 16, crosshair !important;
            }
            .exercise-text-area * {
              cursor: url(/glacier/icon/pen-cursor.png) 16 16, crosshair !important;
            }
          `}</style>
          
          {/* Hint Text */}
          <div style={{
            position: 'absolute',
            top: '80px',
            left: '35%',
            fontSize: '14px',
            color: '#a0d8ff',
            fontFamily: "'Roboto', sans-serif",
            zIndex: 10,
          }}>
            ✏️ {language === 'en' ? 'Use your mouse to mark the errors.' : '用鼠标选中错误的文字'}
          </div>
          
          {/* Left Panel - NPC Image and Dialogue */}
          <div style={{
            ...styles.puzzleLeftPanel,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            padding: '30px 20px',
          }}>
            {/* NPC Image - Keep original size */}
            <img 
              src="/glacier/npc/npc5.png"
              alt="NPC 5"
              style={{ 
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                marginBottom: '20px',
              }}
            />
            
            {/* NPC Dialogue */}
            <div style={{
              background: '#fff',
              color: '#000',
              padding: '15px 20px',
              borderRadius: '15px',
              fontSize: '16px',
              lineHeight: 1.6,
              textAlign: 'left',
              width: '100%',
            }}>
              {exerciseData[currentExercise].npcMessage}
            </div>
            
            {/* Feedback after completion */}
            {showExerciseFeedback && (
              <div style={{
                background: '#fff',
                color: '#000',
                padding: '15px 20px',
                borderRadius: '15px',
                fontSize: '16px',
                lineHeight: 1.6,
                textAlign: 'left',
                marginTop: '20px',
                width: '100%',
              }}>
                {exerciseData[currentExercise].feedback}
              </div>
            )}
          </div>

          {/* Right Panel - Text with Errors */}
          <div style={{
            ...styles.puzzleRightPanel,
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
          }}>
            {/* Title */}
            <div style={{
              textAlign: 'center',
              marginBottom: '40px',
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#a0d8ff',
                fontFamily: "'Roboto', sans-serif",
              }}>
                {exerciseData[currentExercise].title}
              </div>
            </div>

            {/* Text Content */}
            <div 
              className="exercise-text-area"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontSize: '26px',
                lineHeight: '2.2',
                color: '#fff',
                marginBottom: '40px',
                userSelect: 'text',
                position: 'relative',
                flex: 1,
              }}
              onMouseUp={handleTextSelection}
            >
              {exerciseData[currentExercise].text.split('').map((char, index) => {
                // Check if this character is part of a selected error
                let isHighlighted = false
                exerciseData[currentExercise].errors.forEach((error, errorIndex) => {
                  if (selectedErrors.includes(errorIndex) && index >= error.start && index < error.end) {
                    isHighlighted = true
                  }
                })
                
                return (
                  <span
                    key={index}
                    style={{
                      position: 'relative',
                      backgroundColor: isHighlighted ? 'rgba(243, 87, 204, 0.7)' : 'transparent',
                    }}
                  >
                    {char}
                    {isHighlighted && (
                      <span style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: 0,
                        right: 0,
                        height: '20px',
                        backgroundColor: 'rgba(243, 87, 204, 0.7)',
                        borderRadius: '0',
                      }} />
                    )}
                  </span>
                )
              })}
            </div>

            {/* Progress Circles */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              marginTop: 'auto',
            }}>
              <span style={{ 
                color: '#a0d8ff', 
                fontSize: '18px',
                marginRight: '10px',
              }}>
                {selectedErrors.length}/{exerciseData[currentExercise].requiredCount}
              </span>
              {Array.from({ length: exerciseData[currentExercise].requiredCount }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: index < selectedErrors.length ? '#a0d8ff' : '#666566',
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        )
      })()}

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

      {/* NPC9 Sharing Dialogue */}
      {showNpc9Sharing && (
        <div style={{
          ...styles.npc9SharingContainer,
          width: '70%',
          maxWidth: '850px',
          maxHeight: '80vh',
          background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
          border: 'none',
          zIndex: showRooftopDesktop ? 2000 : 3000,
        }}>
          {/* macOS Window Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          }}>
            {/* Traffic Light Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowNpc9Sharing(false)
                  setNpc9UserInput('')
                  setNpc9ShowResponse(false)
                }}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ff5f57',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
              <button
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ffbd2e',
                  border: 'none',
                }}
              />
              <button
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#28ca42',
                  border: 'none',
                }}
              />
            </div>
            
            {/* Title */}
            <div style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              color: '#64748b',
            }}>
              Share your memory secret here.
            </div>
            
            {/* Spacer */}
            <div style={{ width: '60px' }} />
          </div>
          
          {/* NPC Question */}
          {!npc9ShowResponse && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
              {/* NPC Avatar with white circle background */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}>
                <img 
                  src="/glacier/npc/npc9.png" 
                  alt="NPC9" 
                  style={{ 
                    width: '70px', 
                    height: '70px',
                    borderRadius: '50%',
                  }} 
                />
                {/* Online indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#28ca42',
                  border: '2px solid #fff',
                }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  fontSize: '15px',
                  color: '#1f2937',
                  lineHeight: '1.5',
                }}>
                  Thanks for helping me finish the memory training! Do you have any secret memory hacks?
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8',
                  marginTop: '6px',
                  marginLeft: '12px',
                }}>
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}
          
          {/* User Response (if entered) */}
          {npc9ShowResponse && npc9UserInput && (
            <>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}>
                  <img 
                    src="/glacier/npc/npc9.png" 
                    alt="NPC9" 
                    style={{ 
                      width: '70px', 
                      height: '70px',
                      borderRadius: '50%',
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#28ca42',
                    border: '2px solid #fff',
                  }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    background: '#fff',
                    borderRadius: '18px',
                    padding: '16px 20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    fontSize: '15px',
                    color: '#1f2937',
                    lineHeight: '1.5',
                  }}>
                    Thanks for helping me finish the memory training! Do you have any secret memory hacks?
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '6px',
                    marginLeft: '12px',
                  }}>
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{ maxWidth: '70%' }}>
                  <div style={{
                    background: '#0ea5e9',
                    borderRadius: '18px',
                    padding: '16px 20px',
                    boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
                    fontSize: '15px',
                    color: '#fff',
                    lineHeight: '1.5',
                  }}>
                    {npc9UserInput}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '6px',
                    marginRight: '12px',
                    textAlign: 'right',
                  }}>
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* NPC Response */}
          {npc9ShowResponse && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                position: 'relative',
              }}>
                <img 
                  src="/glacier/npc/npc9.png" 
                  alt="NPC9" 
                  style={{ 
                    width: '70px', 
                    height: '70px',
                    borderRadius: '50%',
                  }} 
                />
                <div style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: '#28ca42',
                  border: '2px solid #fff',
                }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  background: '#fff',
                  borderRadius: '18px',
                  padding: '16px 20px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  fontSize: '15px',
                  color: '#1f2937',
                  lineHeight: '1.5',
                }}>
                  {isNpc9Generating ? 'Thinking...' : (npc9Response || "I see... noted!")}
                </div>
                <div style={styles.npc9SharingTimestamp}>
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}
          
          {/* Hint Tags - Above Input */}
          {!npc9ShowResponse && (
            <div style={styles.npc9SharingHints}>
              <div 
                style={styles.npc9SharingHintTag}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.25)'
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)'
                }}
              >
                Visualization
              </div>
              <div 
                style={styles.npc9SharingHintTag}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.25)'
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)'
                }}
              >
                Use Mnemonics
              </div>
              <div 
                style={styles.npc9SharingHintTag}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.25)'
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(14, 165, 233, 0.15)'
                  e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.3)'
                }}
              >
                Chunking
              </div>
            </div>
          )}
          
          {/* Input Container */}
          {!npc9ShowResponse && (
            <div style={styles.npc9SharingInputContainer}>
              <input
                type="text"
                value={npc9UserInput}
                onChange={(e) => setNpc9UserInput(e.target.value)}
                onKeyPress={handleNpc9SharingKeyPress}
                placeholder="Give some tips..."
                style={styles.npc9SharingInput}
                autoFocus
              />
              <button
                onClick={handleNpc9SharingSubmit}
                style={{
                  background: '#0ea5e9',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.background = '#0284c7'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = '#0ea5e9'
                }}
              >
                <img src="/glacier/icon/send.png" alt="Send" style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }} />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Rooftop Quiz Modal - Modern Design (Same as Summary Dialogue) */}
      {showRooftopQuiz && (() => {
        const theme = getNpcTheme('momo')
        const totalSteps = 5
        const currentStep = 4 // Rooftop quiz is step 4
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
                  MISSION: AI USER ASSESSMENT
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
            </div>

            {/* Dialogue Content */}
            <div style={styles.modernDialogueContent}>
              {/* Intro Step */}
              {rooftopQuizStep === 'intro' && (
                <>
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>MOMO:</div>
                    <p style={styles.modernNpcText}>
                      {rooftopQuizData.intro.text}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  <button
                    onClick={handleRooftopQuizStart}
                    style={styles.modernActionButton}
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
                    Start Quiz
                  </button>
                </>
              )}

              {/* Quiz Step - Show history + current question */}
              {rooftopQuizStep === 'quiz' && (
                <>
                  {/* Show previous Q&A */}
                  {quizAnswers.map((answer, idx) => (
                    <div key={idx}>
                      {/* Question */}
                      <div style={styles.modernNpcMessage}>
                        <div style={styles.modernNpcSpeaker}>MOMO:</div>
                        <p style={styles.modernNpcText}>
                          <span style={{ fontSize: '14px', color: '#888', display: 'block', marginBottom: '8px' }}>
                            Question {idx + 1}/{rooftopQuizData.questions.length}
                          </span>
                          {rooftopQuizData.questions[idx].question}
                        </p>
                        <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                      </div>
                      
                      {/* User's answer */}
                      <div style={{
                        alignSelf: 'flex-end',
                        maxWidth: '85%',
                        marginBottom: '15px',
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
                          background: '#333333',
                          padding: '12px 18px',
                          borderRadius: '18px',
                          boxShadow: '0 2px 6px rgba(51, 51, 51, 0.3)',
                        }}>
                          <p style={{
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: '14px',
                            color: '#ffffff',
                            lineHeight: 1.5,
                            margin: 0,
                          }}>{answer.text}</p>
                        </div>
                        <div style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '11px',
                          color: '#999',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}>{getCurrentTimestamp()}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Current question */}
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>MOMO:</div>
                    <p style={styles.modernNpcText}>
                      <span style={{ fontSize: '14px', color: '#888', display: 'block', marginBottom: '8px' }}>
                        Question {currentQuizQuestion + 1}/{rooftopQuizData.questions.length}
                      </span>
                      {rooftopQuizData.questions[currentQuizQuestion].question}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  {/* Options */}
                  <div style={{width: '100%', marginTop: '10px'}}>
                    {rooftopQuizData.questions[currentQuizQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleRooftopQuizAnswer(option)}
                        style={styles.modernActionButton}
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
                </>
              )}

              {/* Calculating Step */}
              {rooftopQuizStep === 'calculating' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '60px 0',
                  gap: '20px'
                }}>
                  <div style={{
                    fontSize: '24px',
                    color: '#333',
                    fontWeight: '600'
                  }}>
                    Calculating...
                  </div>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid rgba(0, 0, 0, 0.1)',
                    borderTop: `4px solid ${theme.borderColor}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
              )}

              {/* Result Step */}
              {rooftopQuizStep === 'result' && userCategory && (
                <>
                  {/* Show all Q&A history */}
                  {quizAnswers.map((answer, idx) => (
                    <div key={idx}>
                      {/* Question */}
                      <div style={styles.modernNpcMessage}>
                        <div style={styles.modernNpcSpeaker}>MOMO:</div>
                        <p style={styles.modernNpcText}>
                          <span style={{ fontSize: '14px', color: '#888', display: 'block', marginBottom: '8px' }}>
                            Question {idx + 1}/{rooftopQuizData.questions.length}
                          </span>
                          {rooftopQuizData.questions[idx].question}
                        </p>
                        <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                      </div>
                      
                      {/* User's answer */}
                      <div style={{
                        alignSelf: 'flex-end',
                        maxWidth: '85%',
                        marginBottom: '15px',
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
                          background: '#333333',
                          padding: '12px 18px',
                          borderRadius: '18px',
                          boxShadow: '0 2px 6px rgba(51, 51, 51, 0.3)',
                        }}>
                          <p style={{
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: '14px',
                            color: '#ffffff',
                            lineHeight: 1.5,
                            margin: 0,
                          }}>{answer.text}</p>
                        </div>
                        <div style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: '11px',
                          color: '#999',
                          marginTop: '4px',
                          textAlign: 'right'
                        }}>{getCurrentTimestamp()}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Result Display - Quadrant and Character side by side */}
                  <div style={{
                    display: 'flex',
                    gap: '30px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20px',
                    marginBottom: '20px',
                    padding: '20px',
                    background: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: '12px'
                  }}>
                    {/* Quadrant Chart */}
                    <div style={{
                      width: '280px',
                      height: '280px',
                      position: 'relative',
                      background: '#2a2a2a',
                      borderRadius: '12px',
                      padding: '35px',
                      flexShrink: 0
                    }}>
                      {/* Add pulsing animation keyframes */}
                      <style>{`
                        @keyframes pulse-ring {
                          0% {
                            transform: translate(-50%, -50%) scale(0.8);
                            opacity: 0.8;
                          }
                          50% {
                            transform: translate(-50%, -50%) scale(1.2);
                            opacity: 0.4;
                          }
                          100% {
                            transform: translate(-50%, -50%) scale(0.8);
                            opacity: 0.8;
                          }
                        }
                      `}</style>
                      
                      {/* Corner Labels */}
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        left: '15px',
                        fontSize: '11px',
                        color: '#888',
                        textAlign: 'center',
                        lineHeight: '1.3'
                      }}>
                        Low Proficiency<br/>High Judgment
                      </div>
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        fontSize: '11px',
                        color: '#888',
                        textAlign: 'center',
                        lineHeight: '1.3'
                      }}>
                        High Proficiency<br/>High Judgment
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        left: '15px',
                        fontSize: '11px',
                        color: '#888',
                        textAlign: 'center',
                        lineHeight: '1.3'
                      }}>
                        Low Proficiency<br/>Low Judgment
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '15px',
                        right: '15px',
                        fontSize: '11px',
                        color: '#888',
                        textAlign: 'center',
                        lineHeight: '1.3'
                      }}>
                        High Proficiency<br/>Low Judgment
                      </div>
                      
                      {/* Axis Labels */}
                      <div style={{
                        position: 'absolute',
                        left: '-70px',
                        top: '50%',
                        transform: 'translateY(-50%) rotate(-90deg)',
                        fontSize: '12px',
                        color: '#aaa',
                        whiteSpace: 'nowrap'
                      }}>
                        Judgment →
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: '-35px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '12px',
                        color: '#aaa'
                      }}>
                        Proficiency →
                      </div>
                      
                      {/* Grid lines - dashed */}
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '1px',
                        borderTop: '1px dashed rgba(255,255,255,0.3)',
                        top: '50%',
                        left: 0
                      }}></div>
                      <div style={{
                        position: 'absolute',
                        width: '1px',
                        height: '100%',
                        borderLeft: '1px dashed rgba(255,255,255,0.3)',
                        left: '50%',
                        top: 0
                      }}></div>
                      
                      {/* User position - pulsing ring + inner dot */}
                      <div style={{
                        position: 'absolute',
                        left: `${(proficiencyScore / 15) * 100}%`,
                        top: `${100 - (judgmentScore / 15) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}>
                        {/* Outer pulsing ring */}
                        <div style={{
                          position: 'absolute',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(120, 104, 229, 0.5)',
                          left: '50%',
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          animation: 'pulse-ring 2s ease-in-out infinite'
                        }}></div>
                        
                        {/* Inner dot with white border */}
                        <div style={{
                          position: 'relative',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: '#a0d8ff',
                          border: '3px solid #fff',
                          boxShadow: '0 0 15px rgba(160, 216, 255, 0.8)'
                        }}></div>
                        
                        {/* "You" label */}
                        <div style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          color: '#fff',
                          fontWeight: '600',
                          whiteSpace: 'nowrap'
                        }}>
                          You
                        </div>
                      </div>
                    </div>
                    
                    {/* Character Result */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <img 
                        src={rooftopQuizData.categories[userCategory].image} 
                        alt={rooftopQuizData.categories[userCategory].name}
                        style={{ width: '220px', height: '220px' }}
                      />
                      <div style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#333'
                      }}>
                        {rooftopQuizData.categories[userCategory].name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>MOMO:</div>
                    <p style={styles.modernNpcText}>
                      {rooftopQuizData.categories[userCategory].description}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  {/* Final Message */}
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>MOMO:</div>
                    <p style={styles.modernNpcText}>
                      {rooftopQuizData.finalMessage}
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  {/* New Privacy Task Message */}
                  <div style={styles.modernNpcMessage}>
                    <div style={styles.modernNpcSpeaker}>MOMO:</div>
                    <p style={styles.modernNpcText}>
                      But there's one last thing—the privacy issue in the Data Center.<br/><br/>
                      Can you go help?<br/><br/>
                      They need someone to fix how personal data is handled before we unlock full system access.<br/><br/>
                      ⬆️ Look—an arrow just appeared! Head there now.
                    </p>
                    <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
                  </div>
                  
                  <button
                    onClick={handleRooftopQuizClose}
                    style={styles.modernActionButton}
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
                    Go Ahead
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })()}
      
      {/* Data Center - Back Button (Left Arrow) */}
      {currentScene === 'datacenter' && (
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '20px',
            width: '60px',
            height: '60px',
            cursor: 'pointer',
            zIndex: 100,
            transition: 'transform 0.2s',
          }}
          onClick={() => {
            setCurrentScene('inside')
            setShowFillBlankTask(false)
            setShowFillBlankComplete(false)
            setShowPrivacyTask(false)
            setShowDataCenterArrow(false)
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <img
            src="/jungle/icon/left.png"
            alt="Back"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
      
      {/* Data Center - Glitch NPC (Top Right) */}
      {currentScene === 'datacenter' && (
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '20px',
            width: '150px',
            height: '150px',
            zIndex: 100,
          }}
        >
          <img
            src="/npc/npc_glacier.gif"
            alt="Glitch"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
      
      {/* Data Center Momo NPC */}
      {currentScene === 'datacenter' && (
        <div 
          style={{
            position: 'absolute',
            right: '450px',
            bottom: '0px',
            width: '300px',
            height: '300px',
            zIndex: 50,
          }}
        >
          <img 
            src="/glacier/npc/momo.png"
            alt="Momo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      )}
      
      {/* Fill the Blank Task */}
      {currentScene === 'datacenter' && showFillBlankTask && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 200,
        }}>
          {/* Header */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#333'}}>Fill the Blank</div>
            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: i < fillBlankProgress ? '#004aad' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  {i < fillBlankProgress ? '✓' : ''}
                </div>
              ))}
              <div style={{marginLeft: '10px', fontSize: '20px', fontWeight: 'bold', color: '#004aad'}}>
                {fillBlankProgress}/5
              </div>
            </div>
          </div>
          
          {/* Current Question */}
          {fillBlankProgress < 5 && (
            <>
              <div style={{
                fontSize: '20px',
                lineHeight: '1.6',
                marginBottom: '30px',
                color: '#333',
                minHeight: '80px',
              }}>
                {fillBlankQuestions[fillBlankProgress].text.split('______').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span 
                        onDrop={() => handleFillBlankDrop(fillBlankProgress)}
                        onDragOver={handleFillBlankDragOver}
                        onClick={() => {
                          // Clear answer on click to allow retry
                          if (fillBlankAnswers[fillBlankProgress]) {
                            const clearedAnswers = [...fillBlankAnswers]
                            clearedAnswers[fillBlankProgress] = null
                            setFillBlankAnswers(clearedAnswers)
                          }
                        }}
                        style={{
                          display: 'inline-block',
                          minWidth: '150px',
                          height: '40px',
                          border: fillBlankAnswers[fillBlankProgress] ? 
                            (fillBlankAnswers[fillBlankProgress] === fillBlankQuestions[fillBlankProgress].correctAnswer ? 
                              '2px solid #4f7f30' : '2px solid #FF0845') : '2px dashed #004aad',
                          borderRadius: '8px',
                          margin: '0 10px',
                          verticalAlign: 'middle',
                          background: fillBlankAnswers[fillBlankProgress] ? 
                            (fillBlankAnswers[fillBlankProgress] === fillBlankQuestions[fillBlankProgress].correctAnswer ? 
                              '#4f7f30' : '#FF0845') : 'rgba(0, 74, 173, 0.1)',
                          color: fillBlankAnswers[fillBlankProgress] ? 'white' : 'transparent',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          lineHeight: '40px',
                          cursor: fillBlankAnswers[fillBlankProgress] ? 'pointer' : 'default',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {fillBlankAnswers[fillBlankProgress] || 'Drop here'}
                      </span>
                    )}
                  </span>
                ))}
              </div>
              
              {/* Options */}
              <div style={{display: 'flex', gap: '20px', justifyContent: 'center'}}>
                {fillBlankQuestions[fillBlankProgress].options.map((option, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => handleFillBlankDragStart(option)}
                    onClick={() => handleFillBlankOptionClick(option)}
                    style={{
                      padding: '15px 30px',
                      background: 'white',
                      border: '2px solid #333',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'grab',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      userSelect: 'none',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.3), 0 3px 6px rgba(0, 0, 0, 0.15)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Fill the Blank Completion Dialogue */}
      {currentScene === 'datacenter' && showFillBlankComplete && (() => {
        const theme = getNpcTheme('momo')
        
        return (
          <div style={{
            ...styles.modernDialogueContainer,
            border: `3px solid ${theme.borderColor}`,
            maxWidth: '700px',
          }}>
            {/* Header */}
            <div style={styles.modernDialogueHeader}>
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
            </div>

            {/* Dialogue Content */}
            <div style={styles.modernDialogueContent}>
              <div style={styles.modernNpcMessage}>
                <div style={styles.modernNpcSpeaker}>MOMO:</div>
                <p style={styles.modernNpcText}>
                  Remember:<br/><br/>
                  Names, birthdays, photos—they're personal.<br/><br/>
                  We must remove them, ask for permission, and never share carelessly.<br/><br/>
                  Ready for the next mission?
                </p>
                <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
              </div>
              
              <button
                onClick={handleFillBlankCompleteClose}
                style={styles.modernActionButton}
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
                Yes
              </button>
            </div>
          </div>
        )
      })()}
      
      {/* Privacy Data Identification Task - Tablet Interface */}
      {currentScene === 'datacenter' && showPrivacyTask && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '95%',
          maxWidth: '1400px',
          height: '90%',
          zIndex: 200,
        }}>
          
          {/* Tablet Device Container */}
          <div style={{
            width: '100%',
            height: '100%',
            background: '#1a1a1a',
            borderRadius: '32px',
            padding: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Camera Notch */}
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '24px',
              background: '#1a1a1a',
              borderRadius: '0 0 12px 12px',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#333',
                borderRadius: '50%',
              }} />
            </div>
            
            {/* Screen Area */}
            <div style={{
              flex: 1,
              background: '#f5f5f5',
              borderRadius: '20px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* System Status Bar */}
              <div style={{
                height: '32px',
                background: 'rgba(255, 255, 255, 0.95)',
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 16px',
                fontSize: '11px',
                fontFamily: "'Roboto', sans-serif",
              }}>
                {/* Left: OS Icon + File Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: '#004aad',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                  }}>S</div>
                  <span style={{ color: '#666', fontSize: '10px' }}>STATION OS v1.2</span>
                </div>
                
                {/* Center: System Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '10px', color: '#666' }}>SYSTEM:</span>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold' }}>ONLINE</span>
                </div>
                
                {/* Right: Icons + Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>📶</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>🔋</div>
                  <span style={{ fontSize: '11px', color: '#333', fontWeight: '500' }}>14:02</span>
                </div>
              </div>
              
              {/* Application Window */}
              <div style={{
                flex: 1,
                margin: '20px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}>
                {/* Window Title Bar */}
                <div style={{
                  height: '40px',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                }}>
                  {/* macOS Buttons + File Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', background: '#ff5f57', borderRadius: '50%' }} />
                      <div style={{ width: '12px', height: '12px', background: '#febc2e', borderRadius: '50%' }} />
                      <div style={{ width: '12px', height: '12px', background: '#28c840', borderRadius: '50%' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: '#666', fontFamily: "'Roboto Mono', monospace" }}>
                      📄 Privacy_Data_Identification.exe
                    </span>
                  </div>
                  
                  {/* CONFIDENTIAL Badge */}
                  <div style={{
                    padding: '4px 12px',
                    background: '#fef3c7',
                    border: '1px solid #fbbf24',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: '#92400e',
                    letterSpacing: '0.5px',
                  }}>
                    CONFIDENTIAL
                  </div>
                </div>
                
                {/* Window Content Area */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  overflow: 'hidden',
                }}>
                  {/* Left: Document Content (60%) */}
                  <div 
                    style={{
                      flex: '0 0 60%',
                      padding: '24px',
                      overflow: 'auto',
                      background: 'white',
                    }}
                  >
                    <div 
                      style={{
                        fontFamily: "'Roboto Mono', monospace", 
                        fontSize: '13px', 
                        lineHeight: '1.8', 
                        color: '#333',
                        cursor: 'url(/glacier/icon/marker.png) 12 12, crosshair',
                      }}
                      onMouseDown={handlePrivacyMouseDown}
                      onMouseMove={handlePrivacyMouseMove}
                      onMouseUp={handlePrivacyMouseUp}
                    >
                      <div style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', color: '#111'}}>
                        {privacyDocuments[privacyTaskDocument - 1].title}
                      </div>
                      <div style={{fontSize: '11px', color: '#666', marginBottom: '16px', lineHeight: '1.5'}}>
                        {privacyDocuments[privacyTaskDocument - 1].subtitle}
                      </div>
                      
                      {/* Warning Banner */}
                      {privacyDocuments[privacyTaskDocument - 1].header && (
                        <div style={{
                          marginBottom: '20px',
                          padding: '12px 16px',
                          background: '#fef3c7',
                          border: '1px solid #fbbf24',
                          borderLeft: '4px solid #f59e0b',
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: '#92400e',
                          whiteSpace: 'pre-line',
                        }}>
                          {privacyDocuments[privacyTaskDocument - 1].header}
                        </div>
                      )}
                      
                      {/* Image Content */}
                      {privacyDocuments[privacyTaskDocument - 1].hasImage && (
                        <div style={{marginBottom: '20px', textAlign: 'center'}}>
                          <img 
                            src={privacyDocuments[privacyTaskDocument - 1].imagePath}
                            alt="Social Post"
                            style={{
                              maxWidth: '100%',
                              borderRadius: '8px',
                              filter: privacyFoundItems.includes('image1') ? 'blur(20px)' : 'none',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              if (!privacyFoundItems.includes('image1')) {
                                playMarkSound()
                                setPrivacyFoundItems([...privacyFoundItems, 'image1'])
                              }
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Text Content with Highlighting */}
                      <div style={{whiteSpace: 'pre-line', position: 'relative'}}>
                        {privacyDocuments[privacyTaskDocument - 1].content.split('\n').map((line, i) => {
                          const foundItem = privacyDocuments[privacyTaskDocument - 1].items.find(item => 
                            !item.isImage && privacyFoundItems.includes(item.id) && (
                              line.includes(item.hint || item.text)
                            )
                          )
                          
                          if (foundItem) {
                            const textToBlack = foundItem.text
                            const index = line.indexOf(textToBlack)
                            
                            if (index !== -1) {
                              return (
                                <div key={i} style={{marginBottom: '5px'}}>
                                  {line.substring(0, index)}
                                  <span style={{
                                    background: '#000',
                                    color: '#000',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    userSelect: 'none',
                                  }}>
                                    {textToBlack}
                                  </span>
                                  {line.substring(index + textToBlack.length)}
                                </div>
                              )
                            }
                          }
                          
                          return <div key={i} style={{marginBottom: '5px'}}>{line}</div>
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Progress Panel (40%) */}
                  <div style={{
                    flex: '0 0 40%',
                    background: '#f9fafb',
                    borderLeft: '1px solid #e5e7eb',
                    padding: '24px',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}>
                    {/* Items Found Card */}
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    }}>
                      <div style={{fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: '#111'}}>
                        Items Found
                      </div>
                      
                      {/* Progress */}
                      <div style={{marginBottom: '16px'}}>
                        <div style={{fontSize: '11px', color: '#666', marginBottom: '6px', fontWeight: '500'}}>
                          Total Progress
                        </div>
                        <div style={{fontSize: '24px', fontWeight: 'bold', color: '#004aad', marginBottom: '8px'}}>
                          {privacyFoundItems.length}/{privacyDocuments[privacyTaskDocument - 1].items.length}
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: '#e5e7eb',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${(privacyFoundItems.length / privacyDocuments[privacyTaskDocument - 1].items.length) * 100}%`,
                            height: '100%',
                            background: '#004aad',
                            transition: 'width 0.3s ease',
                          }} />
                        </div>
                      </div>
                      
                      {/* Checklist */}
                      <div style={{marginBottom: '16px'}}>
                        {privacyDocuments[privacyTaskDocument - 1].items.map(item => (
                          <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px',
                            padding: '8px',
                            background: privacyFoundItems.includes(item.id) ? '#f0fdf4' : 'transparent',
                            borderRadius: '6px',
                            transition: 'all 0.2s',
                          }}>
                            {privacyFoundItems.includes(item.id) ? (
                              <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#22c55e',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '12px',
                              }}>✓</div>
                            ) : (
                              <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid #d1d5db',
                                borderRadius: '50%',
                              }} />
                            )}
                            <div style={{
                              fontSize: '13px',
                              color: privacyFoundItems.includes(item.id) ? '#166534' : '#666',
                              fontWeight: privacyFoundItems.includes(item.id) ? '600' : 'normal',
                            }}>
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Instructions */}
                      <div style={{
                        fontSize: '11px',
                        color: '#666',
                        lineHeight: '1.6',
                        marginBottom: '16px',
                        padding: '12px',
                        background: '#f9fafb',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}>
                        Circle all private information in the log. Then click "Submit" to check if you found them all!
                      </div>
                      
                      {/* Submit Button */}
                      {privacyFoundItems.length === privacyDocuments[privacyTaskDocument - 1].items.length && (
                        <button
                          onClick={handlePrivacySubmit}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: '#111827',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                          }}
                          onMouseOver={(e) => {
                            e.target.style.background = '#000'
                            e.target.style.transform = 'translateY(-1px)'
                          }}
                          onMouseOut={(e) => {
                            e.target.style.background = '#111827'
                            e.target.style.transform = 'translateY(0)'
                          }}
                        >
                          Submit Review →
                        </button>
                      )}
                    </div>
                    
                    {/* Task Navigation Card */}
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    }}>
                      <div style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '16px', color: '#111'}}>
                        TASK NAVIGATION
                      </div>
                      <div style={{display: 'flex', gap: '12px', justifyContent: 'center'}}>
                        {[1, 2, 3].map(i => (
                          <div key={i} style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: i < privacyTaskDocument ? '#004aad' : i === privacyTaskDocument ? '#004aad' : '#e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: i <= privacyTaskDocument ? 'white' : '#9ca3af',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'all 0.2s',
                            boxShadow: i === privacyTaskDocument ? '0 4px 12px rgba(0, 74, 173, 0.3)' : 'none',
                          }}>
                            {i < privacyTaskDocument ? '✓' : i}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Privacy Task Completion Dialogue */}
      {currentScene === 'datacenter' && showPrivacyComplete && (() => {
        const theme = getNpcTheme('momo')
        
        return (
          <div style={{
            ...styles.modernDialogueContainer,
            border: `3px solid ${theme.borderColor}`,
            maxWidth: '700px',
          }}>
            {/* Header */}
            <div style={styles.modernDialogueHeader}>
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
            </div>

            {/* Dialogue Content */}
            <div style={styles.modernDialogueContent}>
              <div style={styles.modernNpcMessage}>
                <div style={styles.modernNpcSpeaker}>MOMO:</div>
                <p style={styles.modernNpcText}>
                  You did it! You protected the privacy by removing name, address, phone, and photo.<br/><br/>
                  Now all data is safe to use — great work!
                </p>
                <div style={styles.modernTimestamp}>{getCurrentTimestamp()}</div>
              </div>
              
              <button
                onClick={handlePrivacyCompleteClose}
                style={styles.modernActionButton}
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
                Continue
              </button>
            </div>
          </div>
        )
      })()}
      
      {/* Creativity Card */}
      {currentScene === 'complete' && showCreativityCard && (
        <div style={{
          position: 'absolute',
          ...(creativityCardPosition === 'bottom-left' ? {
            bottom: '100px',
            left: '50px',
          } : {
            top: '100px',
            right: '50px',
          }),
          width: '30%',
          maxHeight: '80%',
          background: creativityCardType === 'why' 
            ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
            : 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
          border: `3px dashed ${creativityCardType === 'why' ? '#3b82f6' : '#f97316'}`,
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 200,
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <img 
                src="/glacier/icon/ask.png" 
                alt="Ask"
                style={{ width: '24px', height: '24px' }}
              />
              <span style={{
                fontSize: '18px',
                fontWeight: '700',
                color: creativityCardType === 'why' ? '#1e40af' : '#c2410c',
                fontFamily: creativityCardType === 'whatif' ? 'Comic Sans MS, cursive' : 'Inter, system-ui, sans-serif',
              }}>
                {creativityCardType === 'why' ? 'DAILY WHY' : 'WHAT IF?'}
              </span>
            </div>
            <button
              onClick={() => setShowCreativityCard(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: creativityCardType === 'why' ? '#1e40af' : '#c2410c',
                padding: '0',
                lineHeight: '1',
              }}
            >
              ×
            </button>
          </div>
          
          {/* Question */}
          {isGeneratingCreativity && !creativityQuestion ? (
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              marginBottom: '16px',
              textAlign: 'center',
              color: '#6b7280',
            }}>
              Generating question...
            </div>
          ) : (
            <div style={{
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              marginBottom: '16px',
              flexShrink: 0,
            }}>
              <p style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                lineHeight: '1.8',
                textDecoration: `underline wavy ${creativityCardType === 'why' ? '#3b82f6' : '#f97316'}`,
                textUnderlineOffset: '4px',
              }}>
                {creativityQuestion}
              </p>
            </div>
          )}
          
          {/* User Input or Answer Display */}
          {!creativityShowAnswer ? (
            <>
              <div style={{ marginBottom: '8px' }}>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: creativityCardType === 'why' ? '#1e40af' : '#c2410c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  YOUR THOUGHT
                </label>
              </div>
              <textarea
                value={creativityUserAnswer}
                onChange={(e) => setCreativityUserAnswer(e.target.value)}
                placeholder="Type your answer here... don't be afraid to guess! Curiosity has no wrong answers."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '12px',
                  border: `1px solid ${creativityCardType === 'why' ? '#3b82f6' : '#f97316'}`,
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  resize: 'vertical',
                  marginBottom: '16px',
                  boxSizing: 'border-box',
                }}
              />
              
              {/* Feedback Display */}
              {creativityAiFeedback && (
                <div style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.5',
                }}>
                  {creativityAiFeedback}
                </div>
              )}
              
              {/* Action Buttons - Show Save button after feedback, otherwise show Get Feedback and Skip */}
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                {creativityAiFeedback ? (
                  <button
                    onClick={handleCreativitySave}
                    disabled={isGeneratingCreativity}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '12px',
                      background: creativityCardType === 'why' ? '#3b82f6' : '#f97316',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: isGeneratingCreativity ? 'not-allowed' : 'pointer',
                      opacity: isGeneratingCreativity ? 0.5 : 1,
                    }}
                  >
                    <img 
                      src="/desert/icon/save.svg" 
                      alt="Save"
                      style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
                    />
                    Save
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCreativityGetFeedback}
                      disabled={!creativityUserAnswer.trim() || isGeneratingCreativity}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '12px',
                        background: creativityCardType === 'why' ? '#3b82f6' : '#f97316',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: creativityUserAnswer.trim() && !isGeneratingCreativity ? 'pointer' : 'not-allowed',
                        opacity: creativityUserAnswer.trim() && !isGeneratingCreativity ? 1 : 0.5,
                        marginBottom: '12px',
                      }}
                    >
                      <img 
                        src="/glacier/icon/feedback.png" 
                        alt="Feedback"
                        style={{ width: '18px', height: '18px' }}
                      />
                      {isGeneratingCreativity ? 'Generating...' : 'Get Feedback'}
                    </button>
                    
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: creativityCardType === 'why' ? '#1e40af' : '#c2410c',
                        fontWeight: '500',
                        textAlign: 'center',
                      }}>
                        Thinking is the best way to learn!
                      </span>
                      <button
                        onClick={handleCreativitySkipToAnswer}
                        disabled={isGeneratingCreativity}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '8px 16px',
                          background: 'rgba(255, 255, 255, 0.5)',
                          color: creativityCardType === 'why' ? '#1e40af' : '#c2410c',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: isGeneratingCreativity ? 'not-allowed' : 'pointer',
                          opacity: isGeneratingCreativity ? 0.5 : 1,
                        }}
                      >
                        Skip to answer
                        <span style={{ fontSize: '16px' }}>→</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Answer Display */}
              <div style={{ marginBottom: '8px' }}>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: creativityCardType === 'why' ? '#1e40af' : '#c2410c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  ANSWER
                </label>
              </div>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
              }}>
                {isGeneratingCreativity ? 'Generating answer...' : creativityAiAnswer}
              </div>
              
              {/* Save Button */}
              <button
                onClick={handleCreativitySave}
                disabled={isGeneratingCreativity}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  background: creativityCardType === 'why' ? '#3b82f6' : '#f97316',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isGeneratingCreativity ? 'not-allowed' : 'pointer',
                  opacity: isGeneratingCreativity ? 0.5 : 1,
                }}
              >
                <img 
                  src="/desert/icon/save.svg" 
                  alt="Save"
                  style={{ width: '20px', height: '20px', filter: 'brightness(0) invert(1)' }}
                />
                Save
              </button>
            </>
          )}
        </div>
      )}

      {/* Rooftop Desktop Interface */}
      {showRooftopDesktop && selectedRooftopNpc && (
        <RooftopDesktopInterface
          npcId={selectedRooftopNpc}
          npcData={{
            onTaskStart: (task) => {
              // No dialogue tasks anymore - all info is in Notes
            },
            // Pass memory challenge states
            showMemoryChallenge,
            memoryPhase,
            snowPathRound,
            snowPathFootprints,
            snowPathUserSelections,
            snowPathMemorizing,
            snowPathTimer,
            footstepRound,
            footstepCurrentHighlight,
            footstepUserSequence,
            // Pass handlers to open tasks
            openPuzzle: () => {
              setShowPuzzle(true)
              setCurrentPuzzle(1)
              setPuzzleTimer(300)
            },
            openExercise: () => {
              setShowExercise(true)
              setCurrentExercise(1)
              setSelectedErrors([])
              setShowExerciseFeedback(false)
            },
            openCreativity: () => {
              const shuffled = [...creativityChallengesPool].sort(() => Math.random() - 0.5)
              const selected = shuffled.slice(0, 2)
              setSelectedChallenges(selected)
              setShowCreativityChallenge(true)
              setCurrentChallenge(0)
              setChallengeTimer(120)
            },
            openCoCreation: () => {
              setShowCoCreation(true)
              setCoCreationFormulas([
                { element: null, result: null, completed: false },
                { element: null, result: null, completed: false }
              ])
              setCurrentFormulaIndex(0)
              setCoCreationCompleted(false)
            },
            openMemoryBlocks: () => {
              console.log('Opening Memory Blocks (Snow Path)')
              setShowMemoryChallenge(true)
              setMemoryPhase('snowPath')
              setSnowPathRound(0)
              initializeSnowPathRound(0)
            },
            openMemoryFootprint: () => {
              console.log('Opening Memory Footprint (Footstep Recall)')
              setShowMemoryChallenge(true)
              setMemoryPhase('footstepRecall')
              setFootstepRound(0)
              initializeFootstepRound(0)
            },
            openSharing: () => {
              console.log('Opening NPC9 Sharing')
              setShowNpc9Sharing(true)
              setNpc9UserInput('')
              setNpc9ShowResponse(false)
            },
          }}
          completedTasks={rooftopCompletedTasks}
          onTaskComplete={(taskId) => {
            if (!rooftopCompletedTasks.includes(taskId)) {
              setRooftopCompletedTasks(prev => [...prev, taskId])
            }
          }}
          onClose={() => {
            setShowRooftopDesktop(false)
            setSelectedRooftopNpc(null)
            // Close any open tasks
            setShowMemoryChallenge(false)
            setShowPuzzle(false)
            setShowExercise(false)
            setShowCreativityChallenge(false)
            setShowCoCreation(false)
            setShowNpc9Sharing(false)
          }}
        />
      )}
      
    </div>
  )
}

export default GlacierMap
