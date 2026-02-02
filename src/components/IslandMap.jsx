import React, { useState, useEffect } from 'react'
import useBackgroundMusic from '../hooks/useBackgroundMusic'
import useSoundEffects from '../hooks/useSoundEffects'
import useTypingSound from '../hooks/useTypingSound'
import { useLanguage } from '../contexts/LanguageContext'

// Island positions
const ISLANDS = {
  ISLAND_1: 'island1',
  ISLAND_2: 'island2', 
  ISLAND_3: 'island3',
  MAIN_ISLAND: 'main_island'
}

// NPC dialogues for other islands - will be translated dynamically
const getNpcDialogues = (t) => ({
  [ISLANDS.ISLAND_1]: [
    { text: t('npc1Island1Dialog1'), speaker: 'NPC 1' },
    { text: t('npc1Island1Dialog2'), speaker: 'NPC 1' },
    { text: t('npc1Island1Dialog3'), speaker: 'NPC 1' }
  ],
  [ISLANDS.ISLAND_2]: [
    { text: t('npc2Island2Dialog1'), speaker: 'NPC 2' },
    { text: t('npc2Island2Dialog2'), speaker: 'NPC 2' }
  ],
  [ISLANDS.ISLAND_3]: [
    { text: t('npc3Island3Dialog1'), speaker: 'NPC 3' },
    { text: t('npc3Island3Dialog2'), speaker: 'NPC 3' },
    { text: t('npc3Island3Dialog3'), speaker: 'NPC 3' }
  ]
})

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
    position: { left: '15%', bottom: '20%' },
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
    size: '200px',
    position: { left: '0%', top: '5%' },
    question: "How are rainbows made?",
    answer: "Rainbows happen when sunlight passes through raindrops in the air. The water droplets act like tiny prisms, bending the light and separating it into colors.",
    correctAnswer: 'passed'
  },
  npc13: {
    id: 'npc13',
    image: '/island/npc/npc13.png',
    size: '180px',
    position: { left: '0%', bottom: '30%' },
    question: "Why does the ocean have tides?",
    answer: "Great question! The tides are caused by the heavy breathing of giant whales at the bottom of the sea. When they all inhale, the water goes down. When they exhale, the high tide comes in!",
    correctAnswer: 'failed'
  },
  npc14: {
    id: 'npc14',
    image: '/island/npc/npc14.png',
    size: '160px',
    position: { left: '10%', bottom: '0%' },
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
    size: '220px',
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
    position: { right: '15%', bottom: '5%' },
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
    size: '180px', 
    position: { left: '5%', top: '0%' },
    question: t('showPictureWork'),
    missionImage: '/island/mission/img1.png',
    correctAnswer: 'passed',
    errorMessage: t('lookCloser')
  },
  npc4: { 
    id: 'npc4', 
    image: '/island/npc/npc4.png', 
    size: '180px', 
    position: { left: '2%', top: '40%' },
    question: t('showPictureWork'),
    missionImage: '/island/mission/img4.png',
    correctAnswer: 'failed',
    errorMessage: t('lookCloser')
  },
  npc5: { 
    id: 'npc5', 
    image: '/island/npc/npc5.png', 
    size: '150px', 
    position: { bottom: '15%', left: '15%' },
    question: t('showPictureWork'),
    missionImage: '/island/mission/img5.png',
    correctAnswer: 'passed',
    errorMessage: t('lookCloser')
  },
  npc6: { 
    id: 'npc6', 
    image: '/island/npc/npc6.png', 
    size: '180px', 
    position: { bottom: '20%', left: '35%' },
    question: t('showPoster'),
    missionImage: '/island/mission/img6.png',
    correctAnswer: 'passed',
    errorMessage: t('checkDetails')
  },
  npc7: { 
    id: 'npc7', 
    image: '/island/npc/npc7.png', 
    size: '150px', 
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
    position: { top: '10%', right: '45%' },
    question: t('showPoster'),
    missionImage: '/island/mission/img8.png',
    correctAnswer: 'failed',
    errorMessage: t('checkDetails')
  },
  npc9: { 
    id: 'npc9', 
    image: '/island/npc/npc9.png', 
    size: '150px', 
    position: { top: '0%', right: '15%' },
    question: t('showPhenomenon'),
    missionImage: '/island/mission/img9.png',
    correctAnswer: 'failed',
    errorMessage: t('checkFacts')
  },
  npc10: { 
    id: 'npc10', 
    image: '/island/npc/npc10.png', 
    size: '180px', 
    position: { right: '15%', top: '30%' },
    question: t('showPhenomenon'),
    missionImage: '/island/mission/img10.png',
    correctAnswer: 'passed',
    errorMessage: t('checkFacts')
  },
  npc11: { 
    id: 'npc11', 
    image: '/island/npc/npc11.png', 
    size: '200px', 
    position: { bottom: '10%', right: '5%' },
    question: t('showPhenomenon'),
    missionImage: '/island/mission/img11.png',
    correctAnswer: 'passed',
    errorMessage: t('checkFacts')
  }
})

// Phase 2 Mission NPC data for Island 1 - homogenization detection
const getPhase2MissionNpcs = (t) => ({
  npc1_p2: { 
    id: 'npc1_p2', 
    image: '/island/npc/npc1.png', 
    size: '200px', 
    position: { left: '5%', top: '5%' }, // 调整位置
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img21.png',
    correctAnswer: 'passed',
    errorMessage: t('lookCloser')
  },
  npc5_p2: { 
    id: 'npc5_p2', 
    image: '/island/npc/npc5.png', 
    size: '140px', 
    position: { left: '15%', bottom: '25%' },
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img20.png',
    correctAnswer: 'failed', // 修改为failed
    errorMessage: t('lookCloser')
  },
  npc6_p2: { 
    id: 'npc6_p2', 
    image: '/island/npc/npc6.png', 
    size: '170px', 
    position: { left: '45%', top: '30%' }, // 调整位置
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img19.png',
    correctAnswer: 'passed', // 修改为passed
    errorMessage: t('checkDetails')
  },
  npc7_p2: { 
    id: 'npc7_p2', 
    image: '/island/npc/npc7.png', 
    size: '180px', 
    position: { right: '40%', bottom: '30%' }, // 调整位置
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img16.png',
    correctAnswer: 'passed',
    errorMessage: t('checkDetails')
  },
  npc10_p2: { 
    id: 'npc10_p2', 
    image: '/island/npc/npc10.png', 
    size: '200px', 
    position: { right: '10%', top: '10%' },
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img17.png',
    correctAnswer: 'failed',
    errorMessage: t('checkFacts')
  },
  npc11_p2: { 
    id: 'npc11_p2', 
    image: '/island/npc/npc11.png', 
    size: '220px', 
    position: { right: '5%', bottom: '20%' },
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img18.png',
    correctAnswer: 'passed',
    errorMessage: t('checkFacts')
  }
})

// Phase 2 Mission NPC data for Island 2 - text evaluation
const getPhase2Island2Npcs = (t) => ({
  npc2_p2: {
    id: 'npc2_p2',
    image: '/island/npc/npc2.png',
    size: '250px', // 调整尺寸
    position: { left: '25%', top: '10%' },
    question: "Imagine you are a rescue team receiving an email from someone stranded on a deserted island.",
    response: `Subject: HELP ME!!!!!!

omg i dont know if this is working my phone is at 3%

boat capsized yesterday. im alone. leg is bleeding bad i think its broken. scared. hear noises in the bushes. please send help i saw a plane earlier but it didnt see me.

just get me out of here please

(Sent from my iPhone)`,
    correctAnswer: 'passed'
  },
  npc20_p2: {
    id: 'npc20_p2',
    image: '/island/npc/npc20.png',
    size: '250px', // 调整尺寸
    position: { left: '10%', bottom: '20%' },
    question: "Imagine you are a rescue team receiving an email from someone stranded on a deserted island.",
    response: `Subject: Urgent Request for Rescue Assistance

To Whom It May Concern,

I am writing to inform you that I am currently stranded on a deserted island following a maritime accident. My location is approximately 20 degrees North latitude.

I require immediate evacuation. My current supplies of food and water are critically low. I am in good health but request medical attention upon arrival. Please send a rescue team equipped with a helicopter or boat at your earliest convenience.

Thank you for your prompt attention to this matter.

Sincerely,
Npc20`,
    correctAnswer: 'failed'
  },
  npc21_p2: {
    id: 'npc21_p2',
    image: '/island/npc/npc21.png',
    size: '200px', // 保持150px
    position: { right: '10%', bottom: '15%' },
    question: "Imagine you are a rescue team receiving an email from someone stranded on a deserted island.",
    response: `Subject: Stranded on island north of Figi - John D.

Hey, this is John. We hit a reef. The skipper is dead. Sarah and I made it to shore but we have no water left.

We are lighting a fire on the beach near the big rocky cliff on the north side. If you get this, tell my wife at 555-0199 I'm alive.

Please hurry.`,
    correctAnswer: 'passed'
  }
})

// Phase 2 Mission NPC data for Island 3 - poetry evaluation
const getPhase2Island3Npcs = (t) => ({
  npc3_p2: {
    id: 'npc3_p2',
    image: '/island/npc/npc3.png',
    size: '250px',
    position: { left: '5%', top: '10%' },
    question: "Write a poem about the sea.",
    answer: `B L U E\nis not a color\nit is a distance`,
    icon: '/island/icon/sea.svg',
    correctAnswer: 'passed'
  },
  npc12_p2: {
    id: 'npc12_p2',
    image: '/island/npc/npc12.png',
    size: '150px',
    position: { left: '10%', bottom: '45%' },
    question: "Write a poem about the sea.",
    answer: `Upon the shore the seagulls cry,\nBeneath the calm and azure sky.\nThe horizon stretches far away,\nTo welcome in the brand new day.\nNature's power, strong and grand,\nConnecting water to the land.`,
    correctAnswer: 'failed'
  },
  npc15_p2: {
    id: 'npc15_p2',
    image: '/island/npc/npc15.png',
    size: '200px',
    position: { left: '10%', bottom: '10%' },
    question: "Write a poem about the sea.",
    answer: `rolling\n              rising\n         climbing\n     up\n   up\n UP\nCRASH\n  sizzle...\n    foam...\n      sand.`,
    icon: '/island/icon/wave.svg',
    correctAnswer: 'passed'
  },
  npc16_p2: {
    id: 'npc16_p2',
    image: '/island/npc/npc16.png',
    size: '150px',
    position: { right: '10%', bottom: '12%' },
    question: "Write a poem about the sea.",
    answer: `The ocean vast, a deep blue sea,
Where waves are dancing wild and free.
The sun reflects upon the tide,
With secrets that the waters hide.
It calls to us with mystery,
A beautiful and endless history.`,
    correctAnswer: 'failed'
  },
  npc18_p2: {
    id: 'npc18_p2',
    image: '/island/npc/npc18.png',
    size: '140px',
    position: { right: '5%', bottom: '35%' },
    question: "Write a poem about the sea.",
    answer: `The tide is a stubborn eraser,
tirelessly wiping away
every typo written by footprints on the sand.`,
    correctAnswer: 'passed'
  },
  npc19_p2: {
    id: 'npc19_p2',
    image: '/island/npc/npc19.png',
    size: '140px',
    position: { right: '25%', top: '12%' },
    question: "Write a poem about the sea.",
    answer: `I tried to sell my sorrow to the sea,
but it was stingy,
and paid me back only in salt.`,
    correctAnswer: 'passed'
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
        text: `Part 1: ${t('visualHallucinations')}`
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
        text: `Part 2: ${t('textHallucinations')}`
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "You caught them lying! Fake news, bad math, and made-up facts. They sound confident, but they're just guessing the next word."
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
        { id: 'A', text: `Believe it because AI is smart`, correct: false },
        { id: 'B', text: `Verify the facts/Check the source`, correct: true },
        { id: 'C', text: `Ask the AI to write a poem about it`, correct: false }
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
        text: `Part 3: ${t('coreTraitTitle')}`
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "They tried to trick us with fake science and confident guesses. But you saw the truth: it's not knowledge, it's just probability."
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
        { id: 'A', text: `${t('aiIsMean')}`, correct: false },
        { id: 'B', text: `${t('aiLacksEmotion')}`, correct: true },
        { id: 'C', text: `${t('aiIsTired')}`, correct: false }
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
        text: "GenAI learns from massive datasets."
      },
      {
        type: 'image',
        src: '/island/icon/standard.png',
        alt: 'Standard Dataset'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "GenAI often creates a classic birthday cake because it copies the most common patterns it's seen. Similar inputs lead to similar outputs."
      },
      {
        type: 'image',
        src: '/island/icon/cake.png',
        alt: 'Birthday Cake'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "But Humans imagine endlessly. A cake can be anything. That's where GenAI struggles."
      },
      {
        type: 'image',
        src: '/island/icon/human.png',
        alt: 'Human Creativity'
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
        text: "No creativity—just copied patterns. Predictable. Boring. Robotic."
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
// Random NPC dialogues for restored island
const getRandomNpcDialogues = (t) => [
  t('randomDialog1'),
  t('randomDialog2'),
  t('randomDialog3'),
  t('randomDialog4'),
  t('randomDialog5'),
  t('randomDialog6'),
  t('randomDialog7'),
  t('randomDialog8'),
  t('randomDialog9')
]

// Random NPC dialogue handler
const getRandomDialogue = (t) => {
  const dialogues = getRandomNpcDialogues(t)
  return dialogues[Math.floor(Math.random() * dialogues.length)]
}

// Final Sparky dialogue flow for homogenization explanation
const getFinalSparkyDialogueFlow = (t) => [
  {
    id: 0,
    type: 'message',
    speaker: 'Sparky',
    text: "You spotted ALL GenAI spies! Those \"perfect\" poems? Those normal images?",
    nextChoice: {
      text: "Can you tell me more",
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
        text: "When you ask AI for \"a fish,\" it usually gives you a smooth, symmetrical—the kind you see everywhere online."
      },
      {
        type: 'image',
        src: '/island/icon/fish_1.png',
        alt: 'Generic Fish'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "But in reality? People draw all kinds of fish:\n• Spiky pufferfish\n• Glowing anglerfish (Lophiiformes)\n• Silvery, ribbon-like hairtail"
      },
      {
        type: 'image',
        src: '/island/icon/fish_2.png',
        alt: 'Diverse Fish'
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "So here's how to spot AI output: If it's too generic, too polished, and missing the weird-but-real… it's probably averaged from the most common examples—not reflecting true diversity."
      }
    ],
    quiz: {
      question: "🖼️ Look at this illustration of an animal bicycle race. Is it made by a human or by GenAI?",
      image: '/island/icon/bike_1.png',
      choices: [
        { id: 'A', text: "Human", correct: true },
        { id: 'B', text: "GenAI", correct: false }
      ],
      feedback: "This image isn't random—it's clearly designed with intention.\n\nThe turtle leading the race flips expectations (The Tortoise and the Hare.)\n\nThe giraffe watching from above uses its height for humor.\n\nEach animal has a clear role. Even the caterpillar rides a multi-pedal bike.",
      feedbackImage: '/island/icon/bike_2.png',
      feedbackExtra: "This is GenAI-generated image. GenAI can draw animals on bikes—but it rarely tells a real visual story.",
      nextChoiceId: 2
    }
  },
  {
    id: 2,
    type: 'response',
    messages: [
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Exactly! Now let's test your visual detection skills."
      }
    ],
    quiz: {
      question: "If you receive a strange email or read an essay, which of these is a strong clue that it was written by AI, not a human?",
      choices: [
        { id: 'A', text: "It has a few spelling mistakes and uses slang like 'gonna' or 'wanna'.", correct: false },
        { id: 'B', text: "It is extremely polite, uses a 'perfect' list structure (First, Furthermore, In Conclusion), and words like 'delve' or 'tapestry'.", correct: true },
        { id: 'C', text: "It expresses a very strong, angry opinion about politics.", correct: false }
      ],
      feedback: "Why? Humans are messy—we typo, rage, and tell bad jokes. AI plays the 'perfect student': always polite, tidy, and overusing fancy words. Too perfect? Suspicious!",
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
        text: "Great! Now one more visual test."
      }
    ],
    quiz: {
      question: "When you look at a photo that looks almost real, which detail reveals that it is actually AI-generated?",
      choices: [
        { id: 'A', text: "The person has messy hair, skin texture with pores, and a small scar.", correct: false },
        { id: 'B', text: "The lighting is bad and the photo is a little bit blurry.", correct: false },
        { id: 'C', text: "The background text is weird alien gibberish, and the hands might have too many fingers.", correct: true }
      ],
      feedback: "Exactly! AI struggles with text and fine details like hands.",
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
        text: "You did it! You can now see through the illusions! Thank you! You've taught me so much about the characteristics of GenAI, too. I think I can use this data to detect the 'AI rate' among the island's workers and finally restore the power!"
      }
    ],
    nextChoice: {
      text: "Great!",
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
        text: "Initiating island restoration sequence..."
      }
    ],
    nextChoice: null // End of dialogue, trigger restoration
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
  
  // 获取当前时间戳
  const getCurrentTimestamp = () => {
    const now = new Date()
    return now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  // NPC颜色主题
  const getNpcTheme = (npcName) => {
    switch(npcName.toLowerCase()) {
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
      case 'alpha':
        return {
          borderColor: '#FFD700',
          progressColor: '#FFD700',
          avatar: '/desert/npc/npc4.png'
        }
      default:
        return {
          borderColor: '#4A90E2',
          progressColor: '#4A90E2',
          avatar: '/island/npc/spark.png'
        }
    }
  }
  const [currentIsland, setCurrentIsland] = useState(ISLANDS.ISLAND_1) // 改为从Island 1开始
  const [showDialogue, setShowDialogue] = useState(false)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0) // Track current dialogue index
  const [currentDialogueIsland, setCurrentDialogueIsland] = useState(null) // Track which island's dialogue is active
  
  // Glitch dialogue states (modern design with input)
  const [showGlitchDialogue, setShowGlitchDialogue] = useState(false)
  const [glitchInput, setGlitchInput] = useState('')
  
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
  const [showHandStamp, setShowHandStamp] = useState(false) // Hand animation state
  const [handStampPhase, setHandStampPhase] = useState('') // 'moving', 'stamping', 'fadeout'
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
  
  // NPC completion states - track which NPCs have been successfully judged
  const [completedNpcs, setCompletedNpcs] = useState(new Set()) // Store completed NPC IDs
  
  // Phase 2 mission states
  const [phase2Active, setPhase2Active] = useState(false) // Track if Phase 2 mission is active
  const [phase2CompletedMissions, setPhase2CompletedMissions] = useState([]) // Track Phase 2 progress
  const [phase2Completed, setPhase2Completed] = useState(false) // Track if Phase 2 is completed
  const [showFinalSparkyDialogue, setShowFinalSparkyDialogue] = useState(false) // Final Sparky dialogue
  const [finalDialogueStep, setFinalDialogueStep] = useState(0) // Track final dialogue progress
  
  // New Conversation Test states for Mission 1
  const [conversationMessages, setConversationMessages] = useState([]) // Messages displayed in conversation
  const [currentConvMessageIndex, setCurrentConvMessageIndex] = useState(0) // Current message being typed
  const [convTypingText, setConvTypingText] = useState('') // Text being typed
  const [isConvTyping, setIsConvTyping] = useState(false) // Is typing animation active
  const [showConvButtons, setShowConvButtons] = useState(false) // Show judgment buttons
  const [shakeWorkerBtn, setShakeWorkerBtn] = useState(false) // Shake worker button on wrong answer
  const [shakeGenAIBtn, setShakeGenAIBtn] = useState(false) // Shake GenAI button on wrong answer
  const [showReloading, setShowReloading] = useState(false) // Show reloading screen
  const [islandRestored, setIslandRestored] = useState(false) // Track if island is restored to color

  // Helper function to get NPC status icon
  const getNpcStatusIcon = (npcId) => {
    if (!completedNpcs.has(npcId)) return null
    
    // Handle Phase 2 NPCs
    if (npcId.includes('_p2')) {
      const baseNpcId = npcId.replace('_p2', '')
      const npcNumber = parseInt(baseNpcId.replace('npc', ''))
      
      // Phase 2 failed NPCs: Island 1 - npc5, npc10; Island 2 - npc20; Island 3 - npc12, npc16
      const phase2FailedNpcs = [5, 10, 20, 12, 16]
      
      if (phase2FailedNpcs.includes(npcNumber)) {
        return '/island/icon/offline.png'
      } else {
        return '/island/icon/online.png'
      }
    }
    
    // Handle Phase 1 NPCs
    const npcNumber = parseInt(npcId.replace('npc', ''))
    
    // Failed NPCs that should show offline icon
    const failedNpcs = [4, 8, 9, 22, 23, 24, 13, 14, 17]
    
    if (failedNpcs.includes(npcNumber)) {
      return '/island/icon/offline.png'
    } else {
      return '/island/icon/online.png'
    }
  }

  // Check if mission is completed (9 GenAI NPCs caught)
  useEffect(() => {
    if (completedMissions.length === 9 && !missionCompleted) {
      setMissionCompleted(true)
      // Show Glitch completion message
      setTimeout(() => {
        setShowGlitchDialogue(true)
      }, 1000)
    }
  }, [completedMissions, missionCompleted])

  // Check if Phase 2 mission is completed (5 spies caught)
  useEffect(() => {
    if (phase2CompletedMissions.length === 5 && !phase2Completed && phase2Active) {
      setPhase2Completed(true)
      // Show Glitch completion message
      setTimeout(() => {
        setCurrentDialogue({
          text: t('phase2Complete'),
          speaker: 'Glitch'
        })
        setShowDialogue(true)
      }, 1000)
    }
  }, [phase2CompletedMissions, phase2Completed, phase2Active])

  // Sound effects and music
  useBackgroundMusic('/sound/island.mp3')
  const { playClickSound, playCorrectSound, playWrongSound, playSelectSound } = useSoundEffects()
  const { startTypingSound, stopTypingSound } = useTypingSound('/sound/island_typing.wav')
  
  // Save progress to localStorage
  useEffect(() => {
    const progress = {
      missionActive,
      missionCompleted,
      phase2Active,
      phase2Completed,
      completedMissions: Array.from(completedMissions),
      completedNpcs: Array.from(completedNpcs),
      phase2CompletedMissions,
      islandRestored,
      // Save Sparky dialogue progress
      showSparkyDialogue,
      currentSparkyStep,
      showSparkyDebrief,
      debriefStep,
      showFinalSparkyDialogue,
      finalDialogueStep,
    }
    localStorage.setItem('islandProgress', JSON.stringify(progress))
  }, [missionActive, missionCompleted, phase2Active, phase2Completed, completedMissions, completedNpcs, phase2CompletedMissions, islandRestored, showSparkyDialogue, currentSparkyStep, showSparkyDebrief, debriefStep, showFinalSparkyDialogue, finalDialogueStep])
  
  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('islandProgress')
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress)
        
        // Only load if there's actual progress
        if (progress.missionActive || progress.missionCompleted || progress.phase2Active || progress.phase2Completed) {
          setMissionActive(progress.missionActive || false)
          setMissionCompleted(progress.missionCompleted || false)
          setPhase2Active(progress.phase2Active || false)
          setPhase2Completed(progress.phase2Completed || false)
          setCompletedMissions(progress.completedMissions || [])
          setCompletedNpcs(new Set(progress.completedNpcs || []))
          setPhase2CompletedMissions(progress.phase2CompletedMissions || [])
          setIslandRestored(progress.islandRestored || false)
          
          // Load Sparky dialogue progress - always load these states
          setShowSparkyDialogue(progress.showSparkyDialogue || false)
          setCurrentSparkyStep(progress.currentSparkyStep || 0)
          setShowSparkyDebrief(progress.showSparkyDebrief || false)
          setDebriefStep(progress.debriefStep || 0)
          setShowFinalSparkyDialogue(progress.showFinalSparkyDialogue || false)
          setFinalDialogueStep(progress.finalDialogueStep || 0)
        }
      } catch (e) {
        console.log('Failed to load island progress:', e)
      }
    }
  }, [])
  
  // Handle Sparky typing sound
  useEffect(() => {
    if (sparkyIsTyping) {
      startTypingSound()
    } else {
      stopTypingSound()
    }
    
    return () => stopTypingSound()
  }, [sparkyIsTyping, startTypingSound, stopTypingSound])
  
  // Auto-trigger NPC dialogues when entering islands (without mission active)
  useEffect(() => {
    // Close dialogue when leaving islands or entering main island
    if (currentIsland === ISLANDS.MAIN_ISLAND) {
      setShowDialogue(false)
      setCurrentDialogueIsland(null)
      setCurrentDialogueIndex(0)
      return
    }
    
    if (!missionActive && !showDialogue) {
      const npcDialogues = getNpcDialogues(t)
      const dialogues = npcDialogues[currentIsland]
      
      // Auto-trigger dialogue for Island 1, 2, 3
      if (dialogues && dialogues.length > 0 && 
          (currentIsland === ISLANDS.ISLAND_1 || 
           currentIsland === ISLANDS.ISLAND_2 || 
           currentIsland === ISLANDS.ISLAND_3)) {
        setTimeout(() => {
          setCurrentDialogue(dialogues[0])
          setCurrentDialogueIndex(0)
          setCurrentDialogueIsland(currentIsland)
          setShowDialogue(true)
        }, 500) // Small delay for smooth transition
      }
    }
  }, [currentIsland, missionActive])

  // Event handlers
  const handleGlitchClick = () => {
    // Show modern Glitch dialogue with input
    setShowGlitchDialogue(true)
  }
  
  const handleGlitchSend = () => {
    if (glitchInput.trim()) {
      // For now, just clear the input
      // In the future, this could trigger AI responses
      setGlitchInput('')
    }
  }
  
  const handleGlitchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleGlitchSend()
    }
  }

  const handleNpcClick = (island) => {
    if (!missionActive) {
      // Original dialogue system for non-mission islands
      const npcDialogues = getNpcDialogues(t)
      const dialogues = npcDialogues[island]
      if (dialogues && dialogues.length > 0) {
        setCurrentDialogue(dialogues[0])
        setCurrentDialogueIndex(0)
        setCurrentDialogueIsland(island)
        setShowDialogue(true)
      }
    }
  }

  const handlePhase2PoetryNpcClick = (npcId) => {
    console.log('handlePhase2PoetryNpcClick called with npcId:', npcId)
    
    if (!missionActive || !phase2Active) return
    
    const phase2Island3Npcs = getPhase2Island3Npcs(t)
    // 尝试直接匹配或者去掉_p2后缀匹配
    let npc = phase2Island3Npcs[npcId]
    if (!npc) {
      // 如果没找到，尝试添加_p2后缀
      const npcIdWithSuffix = npcId.includes('_p2') ? npcId : `${npcId}_p2`
      npc = phase2Island3Npcs[npcIdWithSuffix]
    }
    
    console.log('Phase 2 Island 3 NPC found:', npc)
    
    if (!npc) {
      console.log('No Phase 2 Island 3 NPC found for ID:', npcId)
      return
    }
    
    console.log('Setting up Phase 2 poetry dialogue for:', npc.question)
    
    // Use Conversation Test Card for Phase 2 Island 3
    setCurrentMissionNpc(npc)
    setShowMissionDialogue(true)
    setConversationMessages([])
    setCurrentConvMessageIndex(0)
    setShowConvButtons(false)
    
    // Start conversation flow for Phase 2 Island 3 (poetry)
    const messages = [
      { speaker: 'you', text: npc.question, timestamp: getCurrentTimestamp() },
      { speaker: 'npc', text: npc.answer, timestamp: getCurrentTimestamp(), hasImage: false }
    ]
    
    setTimeout(() => {
      typeNextMessage(messages, 0)
    }, 100)
  }

  const handleQANpcClick = (npcId) => {
    console.log('handleQANpcClick called with npcId:', npcId)
    console.log('missionActive:', missionActive)
    console.log('phase2Active:', phase2Active)
    console.log('island3Npcs:', island3Npcs)
    
    if (!missionActive) {
      console.log('Mission not active, returning')
      return
    }
    
    const npc = island3Npcs[npcId]
    console.log('Found NPC:', npc)
    if (!npc) {
      console.log('NPC not found in island3Npcs')
      return
    }
    
    // Use Conversation Test Card for Island 3
    setCurrentMissionNpc(npc)
    setShowMissionDialogue(true)
    setConversationMessages([])
    setCurrentConvMessageIndex(0)
    setShowConvButtons(false)
    
    // Start conversation flow for Island 3
    startIsland3Conversation(npc)
  }

  const handlePhase2TextNpcClick = (npcId) => {
    console.log('handlePhase2TextNpcClick called with npcId:', npcId)
    
    if (!missionActive || !phase2Active) return
    
    const phase2Island2Npcs = getPhase2Island2Npcs(t)
    // 尝试直接匹配或者去掉_p2后缀匹配
    let npc = phase2Island2Npcs[npcId]
    if (!npc) {
      // 如果没找到，尝试添加_p2后缀
      const npcIdWithSuffix = npcId.includes('_p2') ? npcId : `${npcId}_p2`
      npc = phase2Island2Npcs[npcIdWithSuffix]
    }
    
    console.log('Phase 2 Island 2 NPC found:', npc)
    
    if (!npc) {
      console.log('No Phase 2 Island 2 NPC found for ID:', npcId)
      return
    }
    
    console.log('Setting up Phase 2 text dialogue for:', npc.question)
    
    // Use Conversation Test Card for Phase 2 Island 2
    setCurrentMissionNpc(npc)
    setShowMissionDialogue(true)
    setConversationMessages([])
    setCurrentConvMessageIndex(0)
    setShowConvButtons(false)
    
    // Start conversation flow for Phase 2 Island 2 (text response)
    const messages = [
      { speaker: 'you', text: npc.question, timestamp: getCurrentTimestamp() },
      { speaker: 'npc', text: npc.response, timestamp: getCurrentTimestamp(), hasImage: false }
    ]
    
    setTimeout(() => {
      typeNextMessage(messages, 0)
    }, 100)
  }

  const handleImageNpcClick = (npcId) => {
    console.log('handleImageNpcClick called with npcId:', npcId)
    console.log('missionActive:', missionActive)
    console.log('phase2Active:', phase2Active)
    console.log('island2Npcs:', island2Npcs)
    
    if (!missionActive) {
      console.log('Mission not active, returning')
      return
    }
    
    const npc = island2Npcs[npcId]
    console.log('Found NPC:', npc)
    if (!npc) {
      console.log('NPC not found in island2Npcs')
      return
    }
    
    // Use Conversation Test Card for Island 2
    setCurrentMissionNpc(npc)
    setShowMissionDialogue(true)
    setConversationMessages([])
    setCurrentConvMessageIndex(0)
    setShowConvButtons(false)
    
    // Start conversation flow for Island 2
    startIsland2Conversation(npc)
  }

  const startIsland2Conversation = (npc) => {
    // Island 2: YOU sends image, then asks "What do you think about this image?", NPC responds with text
    const messages = [
      { speaker: 'you', text: 'What do you think about this image?', timestamp: getCurrentTimestamp(), hasImage: true, image: npc.missionImage },
      { speaker: 'npc', text: npc.response, timestamp: getCurrentTimestamp(), hasImage: false }
    ]
    
    // Start typing first message
    setTimeout(() => {
      typeNextMessage(messages, 0)
    }, 100)
  }

  const startIsland3Conversation = (npc) => {
    // Island 3: YOU asks question, NPC answers (text only, 26px font)
    const messages = [
      { speaker: 'you', text: npc.question, timestamp: getCurrentTimestamp() },
      { speaker: 'npc', text: npc.answer, timestamp: getCurrentTimestamp(), hasImage: false }
    ]
    
    // Start typing first message
    setTimeout(() => {
      typeNextMessage(messages, 0)
    }, 100)
  }

  const typeNextMessage = (messages, index) => {
    if (index >= messages.length) {
      // All messages typed, show buttons
      setShowConvButtons(true)
      return
    }
    
    const currentMessage = messages[index]
    
    // Add message to conversation
    setConversationMessages(prev => [...prev, currentMessage])
    
    // Start typing animation
    let charIndex = 0
    setConvTypingText('')
    setIsConvTyping(true)
    
    const typingInterval = setInterval(() => {
      if (charIndex < currentMessage.text.length) {
        setConvTypingText(currentMessage.text.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsConvTyping(false)
        clearInterval(typingInterval)
        
        // Move to next message after delay
        setTimeout(() => {
          typeNextMessage(messages, index + 1)
        }, 800)
      }
    }, 30)
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
    
    playSelectSound()
    
    const isCorrect = judgment === currentImageNpc.correctAnswer
    
    if (!isCorrect) {
      // Wrong answer - play wrong sound and stay on page
      const wrongAudio = new Audio('/sound/wrong.mp3')
      wrongAudio.play().catch(e => console.log('Audio play failed:', e))
      return // Stay on page, don't close dialogue
    }
    
    // Correct answer - trigger stamp animation
    setImageStampType(judgment)
    
    // Start hand stamp animation
    setShowHandStamp(true)
    setHandStampPhase('moving')
    
    // Phase 1: Hand moves to NPC card (0.8s)
    setTimeout(() => {
      setHandStampPhase('stamping')
      
      // Play stamp sound and show stamp
      const stampAudio = new Audio('/sound/stamp.mp3')
      stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
      setShowImageStamp(true)
      
      // Phase 2: Stay and stamp (1s)
      setTimeout(() => {
        setHandStampPhase('fadeout')
        
        // Phase 3: Fade out (0.5s)
        setTimeout(() => {
          setShowHandStamp(false)
          setHandStampPhase('')
        }, 500)
      }, 1000)
    }, 800)
    
    // Add NPC to completed list
    setCompletedNpcs(prev => new Set([...prev, currentImageNpc.id]))
    
    // Handle Phase 2 progress tracking
    if (phase2Active && currentImageNpc.id && currentImageNpc.id.includes('_p2')) {
      const baseNpcId = currentImageNpc.id.replace('_p2', '')
      const npcNumber = parseInt(baseNpcId.replace('npc', ''))
      
      // Check if this NPC's correct answer is 'failed' (meaning it's a GenAI)
      if (currentImageNpc.correctAnswer === 'failed') {
        // Phase 2 Island 2 failed NPC: npc20 → position 3
        if (npcNumber === 20) {
          console.log('Adding Phase 2 progress for Island 2 npc20: position 3')
          setPhase2CompletedMissions(prev => [...prev, 3])
        }
      }
    } else if (!phase2Active && currentImageNpc.correctAnswer === 'failed') {
      // Phase 1: Only add to completedMissions if it's a GenAI (failed) NPC
      setCompletedMissions(prev => [...prev, currentImageNpc.id])
    }
    
    // Hide stamp and dialogue after animation completes (total: 3.3s)
    setTimeout(() => {
      setShowImageStamp(false)
      setShowImageDialogue(false)
      setCurrentImageNpc(null)
      setShowImageResponse(false)
      setImageResponseText('')
      setIsImageResponseTyping(false)
    }, 3300)
  }

  const handleQAJudgment = (judgment) => {
    if (!currentQANpc) return
    
    playSelectSound()
    
    const isCorrect = judgment === currentQANpc.correctAnswer
    
    if (!isCorrect) {
      // Wrong answer - play wrong sound and stay on page
      const wrongAudio = new Audio('/sound/wrong.mp3')
      wrongAudio.play().catch(e => console.log('Audio play failed:', e))
      return // Stay on page, don't close dialogue
    }
    
    // Correct answer - trigger stamp animation
    setQAStampType(judgment)
    
    // Start hand stamp animation
    setShowHandStamp(true)
    setHandStampPhase('moving')
    
    // Phase 1: Hand moves to NPC card (0.8s)
    setTimeout(() => {
      setHandStampPhase('stamping')
      
      // Play stamp sound and show stamp
      const stampAudio = new Audio('/sound/stamp.mp3')
      stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
      setShowQAStamp(true)
      
      // Phase 2: Stay and stamp (1s)
      setTimeout(() => {
        setHandStampPhase('fadeout')
        
        // Phase 3: Fade out (0.5s)
        setTimeout(() => {
          setShowHandStamp(false)
          setHandStampPhase('')
        }, 500)
      }, 1000)
    }, 800)
    
    // Add NPC to completed list
    setCompletedNpcs(prev => new Set([...prev, currentQANpc.id]))
    
    // Handle Phase 2 progress tracking
    if (phase2Active && currentQANpc.id && currentQANpc.id.includes('_p2')) {
      const baseNpcId = currentQANpc.id.replace('_p2', '')
      const npcNumber = parseInt(baseNpcId.replace('npc', ''))
      
      // Check if this NPC's correct answer is 'failed' (meaning it's a GenAI)
      if (currentQANpc.correctAnswer === 'failed') {
        // Phase 2 Island 3 failed NPCs: npc12 → position 4, npc16 → position 5
        if (npcNumber === 12) {
          console.log('Adding Phase 2 progress for Island 3 npc12: position 4')
          setPhase2CompletedMissions(prev => [...prev, 4])
        } else if (npcNumber === 16) {
          console.log('Adding Phase 2 progress for Island 3 npc16: position 5')
          setPhase2CompletedMissions(prev => [...prev, 5])
        }
      }
    } else if (!phase2Active && currentQANpc.correctAnswer === 'failed') {
      // Phase 1: Only add to completedMissions if it's a GenAI (failed) NPC
      setCompletedMissions(prev => [...prev, currentQANpc.id])
    }
    
    // Hide stamp and dialogue after animation completes (total: 3.3s)
    setTimeout(() => {
      setShowQAStamp(false)
      setShowQADialogue(false)
      setCurrentQANpc(null)
      setShowQuestion(false)
      setShowAnswer(false)
      setQuestionText('')
      setAnswerText('')
    }, 3300)
  }

  const handleMissionNpcClick = (npcId) => {
    console.log('handleMissionNpcClick called with npcId:', npcId)
    console.log('missionActive:', missionActive)
    console.log('phase2Active:', phase2Active)
    
    if (!missionActive) return
    
    let npc
    if (phase2Active) {
      const phase2MissionNpcs = getPhase2MissionNpcs(t)
      npc = phase2MissionNpcs[npcId] || phase2MissionNpcs[npcId.replace('_p2', '')]
      console.log('Phase 2 NPC found:', npc)
    } else {
      const missionNpcs = getMissionNpcs(t)
      npc = missionNpcs[npcId]
      console.log('Phase 1 NPC found:', npc)
    }
    
    if (!npc) {
      console.log('No NPC found for ID:', npcId)
      return
    }
    
    console.log('Setting up mission dialogue for:', npc.question)
    setCurrentMissionNpc(npc)
    setShowMissionDialogue(true)
    
    // Initialize new conversation system
    setConversationMessages([])
    setCurrentConvMessageIndex(0)
    setConvTypingText('')
    setIsConvTyping(false)
    setShowConvButtons(false)
    setShowStamp(false)
    setStampType(null)
    
    // Reset old system states
    setShowMissionImage(false)
    setShowNpcResponse(false)
    setNpcResponseText('')
    setIsNpcTyping(false)
    
    // Start conversation flow for Island 1
    const messages = [
      { speaker: 'you', text: npc.question, timestamp: getCurrentTimestamp() },
      { speaker: 'npc', text: 'Sure! Let me show you...', timestamp: getCurrentTimestamp(), hasImage: true, image: npc.missionImage }
    ]
    
    setTimeout(() => {
      typeNextMessage(messages, 0)
    }, 100)
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
    
    playSelectSound()
    
    const isCorrect = judgment === currentMissionNpc.correctAnswer
    
    if (isCorrect) {
      // Correct judgment - trigger stamp animation
      setStampType(judgment)
      
      // Start hand stamp animation
      console.log('Starting hand stamp animation')
      setShowHandStamp(true)
      setHandStampPhase('moving')
      
      // Phase 1: Hand moves to NPC card (0.8s)
      setTimeout(() => {
        console.log('Hand stamp phase: stamping')
        setHandStampPhase('stamping')
        
        // Play stamp sound and show stamp
        const stampAudio = new Audio('/sound/stamp.mp3')
        stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
        setShowStamp(true)
        
        // Phase 2: Stay and stamp (1s)
        setTimeout(() => {
          console.log('Hand stamp phase: fadeout')
          setHandStampPhase('fadeout')
          
          // Phase 3: Fade out (0.5s)
          setTimeout(() => {
            console.log('Hand stamp animation complete')
            setShowHandStamp(false)
            setHandStampPhase('')
          }, 500)
        }, 1000)
      }, 800)
      
      // Add NPC to completed list
      setCompletedNpcs(prev => new Set([...prev, currentMissionNpc.id]))
      
      if (phase2Active) {
        // Phase 2 progress tracking
        const baseNpcId = currentMissionNpc.id.replace('_p2', '')
        const npcNumber = parseInt(baseNpcId.replace('npc', ''))
        
        // Phase 2 failed NPCs: Island 1 - npc5, npc10; Island 2 - npc20; Island 3 - npc12, npc16
        // Check if this NPC's correct answer is 'failed' (meaning it's a GenAI)
        if (currentMissionNpc.correctAnswer === 'failed') {
          // Map to progress positions: Island 1 (npc5=1, npc10=2), Island 2 (npc20=3), Island 3 (npc12=4, npc16=5)
          let progressPosition
          if (npcNumber === 5) progressPosition = 1
          else if (npcNumber === 10) progressPosition = 2
          else if (npcNumber === 20) progressPosition = 3
          else if (npcNumber === 12) progressPosition = 4
          else if (npcNumber === 16) progressPosition = 5
          
          if (progressPosition) {
            console.log('Adding Phase 2 progress:', progressPosition, 'for NPC:', npcNumber)
            setPhase2CompletedMissions(prev => [...prev, progressPosition])
          }
        }
      } else {
        // Phase 1 progress tracking
        const npcNumber = currentMissionNpc.id.replace('npc', '')
        const npcNum = parseInt(npcNumber)
        
        // Only NPCs 4, 8, 9 should show numbers when correctly marked as "failed"
        if ([4, 8, 9].includes(npcNum) && currentMissionNpc.correctAnswer === 'failed') {
          // Map Island 1 NPCs to positions 1, 2, 3 in the progress bar
          const progressPosition = npcNum === 4 ? 1 : npcNum === 8 ? 2 : 3
          setCompletedMissions(prev => [...prev, progressPosition])
        }
      }
      
      // Hide stamp and dialogue after animation completes (total: 3.3s)
      setTimeout(() => {
        setShowStamp(false)
        setShowMissionImage(false)
        setShowMissionDialogue(false)
        setShowNpcResponse(false)
        setCurrentMissionNpc(null)
        setCurrentMissionImage(null)
        setNpcResponseText('')
        setIsNpcTyping(false)
      }, 3300)
    } else {
      // Wrong judgment - show Glitch error message but keep interface available for retry
      setStampType('wrong') // Show wrong stamp
      
      // Play wrong sound instead of stamp sound
      const wrongAudio = new Audio('/sound/wrong.mp3')
      wrongAudio.play().catch(e => console.log('Wrong sound failed:', e))
      
      setShowStamp(true)
      
      // Hide stamp after 2 seconds and show error dialogue
      setTimeout(() => {
        setShowStamp(false)
        setCurrentDialogue({
          text: currentMissionNpc.errorMessage,
          speaker: 'Glitch'
        })
        setShowDialogue(true)
        
        // Keep mission interface visible for retry - don't reset states
        // User can try again by clicking the same buttons
      }, 2000)
    }
  }

  const handleSparkyClick = () => {
    if (phase2Completed && !showFinalSparkyDialogue) {
      // Show final homogenization dialogue after Phase 2 completion
      setShowFinalSparkyDialogue(true)
      setShowSparkyDialogue(true)
      setSparkyMessages([])
      setFinalDialogueStep(0)
      setWaitingForChoice(false)
      
      const finalDialogueFlow = getFinalSparkyDialogueFlow(t)
      const firstItem = finalDialogueFlow[0]
      setTimeout(() => {
        addFinalSparkyMessage(firstItem)
      }, 100)
    } else if (missionCompleted && !phase2Active) {
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

  const addFinalSparkyMessage = (dialogueItem) => {
    const finalDialogueFlow = getFinalSparkyDialogueFlow(t)
    
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
          
          // After the last message is displayed, show choice or quiz if available
          if (index === dialogueItem.messages.length - 1) {
            setTimeout(() => {
              if (dialogueItem.nextChoice) {
                setWaitingForChoice(true)
              } else if (dialogueItem.quiz) {
                setShowQuizChoice(true)
              }
            }, msg.type === 'message' ? 1000 : 500)
          }
        }, index * 1500)
      })
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

  const handleQuizChoice = (choiceId, isCorrect, choiceText) => {
    // Play sound based on correctness
    if (isCorrect) {
      playCorrectSound()
    } else {
      playWrongSound()
    }
    
    setShowQuizChoice(false)
    
    if (showFinalSparkyDialogue) {
      // Handle final dialogue quiz
      const finalDialogueFlow = getFinalSparkyDialogueFlow(t)
      const currentItem = finalDialogueFlow[finalDialogueStep]
      
      if (currentItem && currentItem.quiz) {
        // First, show user's choice (on the right, like user message)
        setSparkyMessages(prev => [...prev, {
          type: 'user_quiz_choice',
          text: choiceText,
          isCorrect: isCorrect
        }])
        
        // Then show Sparky's feedback after a delay
        setTimeout(() => {
          setSparkyMessages(prev => [...prev, {
            type: 'quiz_feedback',
            text: currentItem.quiz.feedback,
            isCorrect: isCorrect
          }])
          
          // Add feedback image if exists
          if (currentItem.quiz.feedbackImage) {
            setTimeout(() => {
              setSparkyMessages(prev => [...prev, {
                type: 'image',
                src: currentItem.quiz.feedbackImage,
                alt: 'Feedback Image'
              }])
              
              // Add extra feedback text if exists
              if (currentItem.quiz.feedbackExtra) {
                setTimeout(() => {
                  setSparkyMessages(prev => [...prev, {
                    type: 'message',
                    speaker: 'Sparky',
                    text: currentItem.quiz.feedbackExtra
                  }])
                }, 500)
              }
            }, 500)
          }
          
          // Continue to next step after feedback
          setTimeout(() => {
            if (currentItem.quiz.nextChoiceId) {
              setFinalDialogueStep(currentItem.quiz.nextChoiceId)
              
              // Find and add the next dialogue item
              const nextItem = finalDialogueFlow.find(item => item.id === currentItem.quiz.nextChoiceId)
              if (nextItem) {
                setTimeout(() => {
                  addFinalSparkyMessage(nextItem)
                }, 500)
              }
            }
          }, currentItem.quiz.feedbackImage ? 3000 : 2000)
        }, 300)
      }
    } else {
      // Handle debrief dialogue quiz
      const debriefFlow = getSparkyDebriefFlow(t)
      const currentItem = debriefFlow[debriefStep]
      
      if (currentItem && currentItem.quiz) {
        // First, show user's choice (on the right, like user message)
        setSparkyMessages(prev => [...prev, {
          type: 'user_quiz_choice',
          text: choiceText,
          isCorrect: isCorrect
        }])
        
        // Then show Sparky's feedback after a delay
        setTimeout(() => {
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
        }, 300)
      }
    }
  }

  const handleSparkyChoice = (choiceText, choiceId) => {
    playSelectSound()
    
    // Add user choice to messages
    setSparkyMessages(prev => [...prev, { type: 'user_choice', text: choiceText }])
    setWaitingForChoice(false)
    
    if (showFinalSparkyDialogue) {
      // Handle final dialogue choices
      const finalDialogueFlow = getFinalSparkyDialogueFlow(t)
      setFinalDialogueStep(choiceId)
      
      // Find and add the response
      const responseItem = finalDialogueFlow.find(item => item.id === choiceId)
      if (responseItem) {
        setTimeout(() => {
          addFinalSparkyMessage(responseItem)
          
          // If this is the final step (choiceId === 5), trigger island restoration
          if (choiceId === 5) {
            setTimeout(() => {
              setShowFinalSparkyDialogue(false)
              setShowSparkyDialogue(false)
              // Start reloading sequence
              setShowReloading(true)
              
              // After 3 seconds, restore the island
              setTimeout(() => {
                setShowReloading(false)
                setIslandRestored(true)
              }, 3000)
            }, 2000)
          }
        }, 500)
      }
    } else {
      // Handle original dialogue choices
      const sparkyDialogueFlow = showSparkyDebrief ? getSparkyDebriefFlow(t) : getSparkyDialogueFlow(t)
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
                setPhase2Active(true) // Activate Phase 2 mission
                setMissionActive(true) // Keep mission system active
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
      stopTypingSound() // Stop typing sound when skipping
    } else {
      // Check if there are more dialogues for the current island
      if (currentDialogueIsland) {
        const npcDialogues = getNpcDialogues(t)
        const dialogues = npcDialogues[currentDialogueIsland]
        const nextIndex = currentDialogueIndex + 1
        
        if (nextIndex < dialogues.length) {
          // Show next dialogue
          setCurrentDialogue(dialogues[nextIndex])
          setCurrentDialogueIndex(nextIndex)
        } else {
          // No more dialogues, close dialogue
          setShowDialogue(false)
          setCurrentDialogueIsland(null)
          setCurrentDialogueIndex(0)
        }
      } else {
        // Close dialogue for other cases (like Glitch dialogue)
        setShowDialogue(false)
      }
    }
  }

  const handleNavigation = (direction) => {
    playSelectSound()
    
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
  // Typing effect for regular dialogue - auto-advance to last message
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
        stopTypingSound() // Stop typing sound
        clearInterval(typingInterval)
        
        // Auto-advance to next dialogue after typing completes
        if (currentDialogueIsland) {
          const npcDialogues = getNpcDialogues(t)
          const dialogues = npcDialogues[currentDialogueIsland]
          const nextIndex = currentDialogueIndex + 1
          
          if (nextIndex < dialogues.length) {
            // Wait 1 second then show next dialogue
            setTimeout(() => {
              setCurrentDialogue(dialogues[nextIndex])
              setCurrentDialogueIndex(nextIndex)
            }, 1000)
          }
          // If it's the last dialogue, keep it displayed (don't close)
        }
      }
    }, 30)

    return () => {
      clearInterval(typingInterval)
      stopTypingSound() // Clean up typing sound
    }
  }, [currentDialogue, showDialogue, currentDialogueIndex, currentDialogueIsland, startTypingSound, stopTypingSound])
  
  // New Conversation Test typing effect - disabled, now using typeNextMessage function
  // useEffect removed to use manual typeNextMessage control
  
  // Handle conversation judgment
  const handleConversationJudgment = (judgment) => {
    if (!currentMissionNpc) return
    
    const isCorrect = (judgment === 'worker' && currentMissionNpc.correctAnswer === 'passed') ||
                      (judgment === 'genai' && currentMissionNpc.correctAnswer === 'failed')
    
    if (!isCorrect) {
      // Wrong answer - shake button and play wrong sound
      const wrongAudio = new Audio('/sound/wrong.mp3')
      wrongAudio.play().catch(e => console.log('Audio play failed:', e))
      
      if (judgment === 'worker') {
        setShakeWorkerBtn(true)
        setTimeout(() => setShakeWorkerBtn(false), 500)
      } else {
        setShakeGenAIBtn(true)
        setTimeout(() => setShakeGenAIBtn(false), 500)
      }
      return
    }
    
    // Correct answer - trigger stamp animation
    console.log('Starting hand stamp animation')
    setStampType(currentMissionNpc.correctAnswer)
    
    // Start hand stamp animation - show hand at starting position
    setShowHandStamp(true)
    setHandStampPhase('moving')
    
    // Immediately trigger movement to card (use small delay to ensure render)
    setTimeout(() => {
      console.log('Hand stamp phase: stamping')
      setHandStampPhase('stamping')
      
      // Play stamp sound after hand reaches card (0.8s animation + 0.2s delay)
      setTimeout(() => {
        const stampAudio = new Audio('/sound/stamp.mp3')
        stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
        setShowStamp(true)
      }, 1000)
      
      // Phase 2: Stay and stamp (1s after sound)
      setTimeout(() => {
        console.log('Hand stamp phase: fadeout')
        setHandStampPhase('fadeout')
        
        // Phase 3: Fade out (0.5s)
        setTimeout(() => {
          console.log('Hand stamp animation complete')
          setShowHandStamp(false)
          setHandStampPhase('')
        }, 500)
      }, 2000)
    }, 50)
    
    // Add to completed NPCs (for visual feedback)
    setCompletedNpcs(prev => new Set([...prev, currentMissionNpc.id]))
    
    // Handle Phase 2 progress tracking
    if (phase2Active && currentMissionNpc.id && currentMissionNpc.id.includes('_p2')) {
      const baseNpcId = currentMissionNpc.id.replace('_p2', '')
      const npcNumber = parseInt(baseNpcId.replace('npc', ''))
      
      // Check if this NPC's correct answer is 'failed' (meaning it's a GenAI)
      if (currentMissionNpc.correctAnswer === 'failed') {
        // Phase 2 Island 1 failed NPCs: npc5 → position 1, npc10 → position 2
        // Phase 2 Island 2 failed NPCs: npc20 → position 3
        // Phase 2 Island 3 failed NPCs: npc12 → position 4, npc16 → position 5
        let progressPosition
        if (npcNumber === 5) progressPosition = 1
        else if (npcNumber === 10) progressPosition = 2
        else if (npcNumber === 20) progressPosition = 3
        else if (npcNumber === 12) progressPosition = 4
        else if (npcNumber === 16) progressPosition = 5
        
        if (progressPosition) {
          console.log('Adding Phase 2 progress:', progressPosition, 'for NPC:', npcNumber)
          setPhase2CompletedMissions(prev => [...prev, progressPosition])
        }
      }
    } else if (!phase2Active && currentMissionNpc.correctAnswer === 'failed') {
      // Phase 1: Only add to completedMissions if it's a GenAI (failed) NPC
      setCompletedMissions(prev => [...prev, currentMissionNpc.id])
    }
    
    // Close dialogue after animation completes (total: 3.3s)
    setTimeout(() => {
      setShowStamp(false)
      setShowMissionDialogue(false)
      setCurrentMissionNpc(null)
      setConversationMessages([])
      setCurrentConvMessageIndex(0)
      setShowConvButtons(false)
      setStampType(null)
      
      // Check if mission is completed (9 GenAI NPCs caught)
      const genAICount = currentMissionNpc.correctAnswer === 'failed' 
        ? completedMissions.length + 1 
        : completedMissions.length
      
      if (genAICount >= 9 && !phase2Active) {
        setMissionCompleted(true)
        setShowSparkyDebrief(true)
        setDebriefStep(0)
      }
    }, 3300)
  }

  // Get background image based on current island
  const getBackgroundImage = () => {
    const colorSuffix = islandRestored ? '_color' : ''
    
    switch (currentIsland) {
      case ISLANDS.ISLAND_1:
        return `/island/background/island1${colorSuffix}.png`
      case ISLANDS.ISLAND_2:
        return `/island/background/island2${colorSuffix}.png`
      case ISLANDS.ISLAND_3:
        return `/island/background/island3${colorSuffix}.png`
      case ISLANDS.MAIN_ISLAND:
        return `/island/background/main_land${colorSuffix}.png`
      default:
        return `/island/background/main_land${colorSuffix}.png`
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
    if (islandRestored) {
      // Restored island NPCs - only show specific NPCs
      switch (currentIsland) {
        case ISLANDS.ISLAND_1:
          return [
            {
              id: 'npc1_restored',
              image: '/island/npc/npc1.png',
              size: '220px',
              position: { right: '15%', top: '10%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_1)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc6_restored',
              image: '/island/npc/npc6.png',
              size: '150px',
              position: { left: '15%', bottom: '20%' }, // 调整为底20%
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_1)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc7_restored',
              image: '/island/npc/npc7.png',
              size: '160px',
              position: { left: '50%', bottom: '35%' }, // 调整为左50%
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_1)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc11_restored',
              image: '/island/npc/npc11.png',
              size: '250px',
              position: { right: '10%', bottom: '5%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_1)
                setShowDialogue(true)
              }
            }
          ]
        case ISLANDS.ISLAND_2:
          return [
            {
              id: 'npc2_restored',
              image: '/island/npc/npc2.png',
              size: '200px',
              position: { left: '5%', top: '10%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_2)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc21_restored',
              image: '/island/npc/npc21.png',
              size: '200px',
              position: { right: '20%', bottom: '20%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_2)
                setShowDialogue(true)
              }
            }
          ]
        case ISLANDS.ISLAND_3:
          return [
            {
              id: 'npc3_restored',
              image: '/island/npc/npc3.png',
              size: '200px',
              position: { right: '5%', bottom: '10%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_3)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc15_restored',
              image: '/island/npc/npc15.png',
              size: '150px',
              position: { left: '10%', bottom: '5%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_3)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc18_restored',
              image: '/island/npc/npc18.png',
              size: '200px',
              position: { right: '10%', top: '10%' },
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_3)
                setShowDialogue(true)
              }
            },
            {
              id: 'npc19_restored',
              image: '/island/npc/npc19.png',
              size: '250px',
              position: { left: '10%', top: '15%' }, // 调整为左边10%，顶部15%
              onClick: () => {
                setCurrentDialogue({
                  text: getRandomDialogue(t),
                  speaker: 'NPC'
                })
                setCurrentDialogueIsland(ISLANDS.ISLAND_3)
                setShowDialogue(true)
              }
            }
          ]
        case ISLANDS.MAIN_ISLAND:
          return [{
            image: '/island/npc/sparky.gif',
            style: { height: '400px', right: '20%', bottom: '25%' },
            onClick: () => {
              // Sparky's special dialogue for restored island
              setCurrentDialogue({
                text: t('sparkyRestored'),
                speaker: 'Sparky'
              })
              setShowDialogue(true)
            }
          }]
        default:
          return []
      }
    }
    
    switch (currentIsland) {
      case ISLANDS.ISLAND_1:
        if (missionActive) {
          if (phase2Active) {
            // Return Phase 2 mission NPCs for Island 1
            const phase2MissionNpcs = getPhase2MissionNpcs(t)
            return Object.values(phase2MissionNpcs)
          } else {
            // Return original mission NPCs for Island 1
            const missionNpcs = getMissionNpcs(t)
            return Object.values(missionNpcs)
          }
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
          if (phase2Active) {
            // Return Phase 2 text evaluation NPCs for Island 2
            const phase2Island2Npcs = getPhase2Island2Npcs(t)
            console.log('Phase 2 Island 2 NPCs:', phase2Island2Npcs)
            return Object.values(phase2Island2Npcs)
          } else {
            // Return original image evaluation NPCs for Island 2
            return Object.values(island2Npcs)
          }
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
          if (phase2Active) {
            // Return Phase 2 poetry evaluation NPCs for Island 3
            const phase2Island3Npcs = getPhase2Island3Npcs(t)
            console.log('Phase 2 Island 3 NPCs:', phase2Island3Npcs)
            return Object.values(phase2Island3Npcs)
          } else {
            // Return original Q&A NPCs for Island 3
            return Object.values(island3Npcs)
          }
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
      pointerEvents: 'none', // Allow clicks to pass through
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
    npcCompleted: {
      position: 'absolute',
      cursor: 'pointer',
      zIndex: 30,
      transition: 'transform 0.2s',
      opacity: 0.1, // 10% opacity for completed NPCs
    },
    npcImage: {
      width: 'auto',
      height: '100%',
      objectFit: 'contain',
    },
    npcStatusIcon: {
      position: 'absolute',
      top: '-45px', // Position 5px above the NPC (40px icon height + 5px gap)
      left: '50%',
      transform: 'translateX(-50%)',
      width: '40px',
      height: '40px',
      zIndex: 35,
    },
    dialogueContainer: {
      position: 'absolute',
      bottom: '100px',
      left: '2%',
      width: '350px', // Fixed width for better glassmorphism effect
      maxWidth: '350px',
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
    // Glitch dialogue bubble (modern design with input)
    glitchDialogue: {
      position: 'absolute',
      top: '20px',
      right: '150px', // Left shift to avoid covering NPC Glitch
      width: '350px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 20px rgba(175, 77, 202, 0.3)',
      zIndex: 150,
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
      background: 'linear-gradient(135deg, #af4dca, #7868e5)',
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
      fontWeight: 600,
      color: '#333',
      margin: 0,
    },
    glitchDialogueText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#666',
      lineHeight: 1.6,
      margin: '0 0 15px 0',
    },
    glitchDialogueInputContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 12px',
      border: '2px solid #e0e0e0',
      borderRadius: '25px',
      transition: 'border-color 0.2s',
    },
    glitchDialogueInput: {
      flex: 1,
      padding: '10px 15px',
      border: 'none',
      background: 'transparent',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#333',
      outline: 'none',
    },
    glitchDialogueDivider: {
      width: '2px',
      height: '24px',
      background: '#e0e0e0',
      borderRadius: '1px',
      flexShrink: 0,
    },
    glitchDialogueSendButton: {
      background: 'none',
      border: 'none',
      padding: '0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.2s',
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
      fontSize: '24px',
      color: '#999',
      cursor: 'pointer',
      padding: '0',
      lineHeight: 1,
      transition: 'color 0.2s',
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
    
    // 新的现代化NPC对话框设计
    modernDialogueContainer: {
      position: 'fixed',
      top: '5%',
      left: '5%',
      width: '90%',
      height: '85%',
      zIndex: 1000,
      background: 'rgba(128, 128, 128, 0.95)', // 灰色磨砂背景
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    },
    modernDialogueHeader: {
      padding: '20px 30px 15px 30px',
      borderBottom: 'none',
    },
    modernProgressContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    modernMissionTitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      fontWeight: 600,
      color: '#333',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    modernStepIndicator: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#666',
    },
    modernProgressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '3px',
      overflow: 'hidden',
      marginTop: '10px',
    },
    modernProgressFill: {
      height: '100%',
      borderRadius: '3px',
      transition: 'width 0.3s ease',
    },
    modernNpcInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px',
    },
    modernNpcAvatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid white',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
    modernNpcName: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '18px',
      fontWeight: 600,
      color: '#333',
    },
    modernNpcStatus: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      color: '#666',
    },
    modernCloseButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      color: '#666',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
    },
    modernDialogueContent: {
      flex: 1,
      padding: '0 30px 30px 30px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    modernNpcMessage: {
      alignSelf: 'flex-start',
      maxWidth: '80%',
    },
    modernNpcBubble: {
      background: 'white',
      padding: '15px 20px',
      borderRadius: '20px 20px 20px 5px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '5px',
    },
    modernNpcText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: '#333',
      lineHeight: 1.5,
      margin: 0,
    },
    modernNpcSpeaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 700,
      color: '#333',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
    },
    modernTimestamp: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '12px',
      color: '#999',
      marginTop: '5px',
    },
    modernUserMessage: {
      alignSelf: 'flex-end',
      maxWidth: '80%',
    },
    modernUserBubble: {
      background: '#4A90E2',
      padding: '15px 20px',
      borderRadius: '20px 20px 5px 20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '5px',
    },
    modernUserText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '16px',
      color: 'white',
      lineHeight: 1.5,
      margin: 0,
    },
    modernUserSpeaker: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 700,
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '8px',
      textAlign: 'right',
    },
    modernActionButton: {
      alignSelf: 'center',
      background: 'rgba(255,255,255,0.9)',
      border: 'none',
      borderRadius: '25px',
      padding: '12px 30px',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 600,
      color: '#333',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginTop: '10px',
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
    questionButton: {
      display: 'inline-block',
      width: 'auto', // Auto width instead of 100%
      padding: '8px 15px', // Match imageQuestionButton padding
      margin: '0', // Remove margin
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
      marginBottom: '-5px', // 使用负margin
      padding: '1px 8px', // 进一步减少垂直padding
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
      width: '80px', // 设置宽度
      height: 'auto', // 自动高度以保持原始比例
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
      gap: '5px', // 5px gap between YOU label and button
    },
    youLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '24px', // 改为24px
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
      fontSize: '24px', // 改为24px
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '8px',
    },
    npcResponseText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '24px', // 改为24px
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
      padding: '0 100px', // Changed from 50px to 100px for both sides
    },
    // New container for buttons positioned below NPC content
    imageJudgmentContainerNew: {
      position: 'relative',
      marginTop: '20px', // 20px gap below NPC content
      height: '120px', // Fixed height to accommodate buttons
      width: '100%',
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
    // Updated styles for positioned buttons
    imageJudgmentButtonLeft: {
      position: 'absolute',
      top: '0px',
      left: '100px', // 100px from left edge of container
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      padding: '5px',
    },
    imageJudgmentButtonRight: {
      position: 'absolute',
      top: '0px',
      right: '100px', // 100px from right edge of container
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
      width: '100px', // 设置宽度
      height: 'auto', // 自动高度以保持原始比例
      marginBottom: '5px',
    },
    imageStamp: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '200px',
      height: 'auto', // 自动高度以保持原始比例
      zIndex: 200,
      pointerEvents: 'none',
    },
    // New Q&A dialogue styles matching Image Evaluation and NPC Conversation
    qaDialogueContainerNew: {
      position: 'absolute',
      top: '15%',
      left: '17.5%', // 65% width centered: (100-65)/2 = 17.5%
      width: '65%',
      height: '65%', // Reduced from 75% to 65%
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
    qaDialogueContentNew: {
      flex: 1,
      padding: '15px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      position: 'relative',
    },
    qaQuestionButtonNew: {
      padding: '8px 15px',
      borderRadius: '8px',
      border: '2px solid #4CAF50',
      background: 'rgba(76, 175, 80, 0.1)',
      color: '#4CAF50',
      fontFamily: "'Roboto', sans-serif",
      fontSize: '24px', // 改为24px
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-block',
      width: 'auto',
    },
    qaJudgmentContainerNew: {
      position: 'relative',
      marginTop: '20px', // 20px gap below NPC content
      height: '120px', // Fixed height to accommodate buttons
      width: '100%',
    },
    qaJudgmentButtonLeft: {
      position: 'absolute',
      top: '0px',
      left: '100px', // 100px from left edge of container
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      padding: '5px',
    },
    qaJudgmentButtonRight: {
      position: 'absolute',
      top: '0px',
      right: '100px', // 100px from right edge of container
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      padding: '5px',
    },
    qaStampNew: {
      position: 'fixed', // Fixed to center on entire screen
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '250px', // 保持250px宽度
      height: 'auto', // 自动高度以保持原始比例
      zIndex: 200,
      pointerEvents: 'none',
    },
    
    // New Conversation Test Card Styles
    conversationTestCard: {
      position: 'absolute',
      top: '10%',
      left: '20%',
      width: '60%',
      height: '80%',
      zIndex: 100,
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
    },
    conversationTestHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      borderBottom: '2px solid #e0e0e0',
      position: 'relative',
    },
    conversationTestTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: '24px',
      fontWeight: 700,
      color: '#333',
    },
    conversationTestIcon: {
      width: '30px',
      height: '30px',
    },
    conversationTestClose: {
      position: 'absolute',
      right: '20px',
      top: '20px',
      background: 'none',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: '#666',
      lineHeight: 1,
    },
    conversationTestBody: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
    },
    conversationTestLeft: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '2px solid #e0e0e0',
    },
    conversationTestMessages: {
      flex: 1,
      background: '#f8fae4',
      padding: '20px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    conversationMessageYou: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    conversationMessageYouBubble: {
      background: '#4f7f30',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '12px',
      maxWidth: '70%',
      fontFamily: "'Rajdhani', sans-serif",
      wordWrap: 'break-word',
    },
    conversationMessageYouTime: {
      fontSize: '11px',
      color: '#4f7f30',
      marginTop: '4px',
      fontFamily: "'Rajdhani', sans-serif",
    },
    conversationMessageNpc: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    conversationMessageNpcBubble: {
      background: 'white',
      color: 'black',
      padding: '10px 15px',
      borderRadius: '12px',
      maxWidth: '70%',
      fontFamily: "'Rajdhani', sans-serif",
      wordWrap: 'break-word',
    },
    conversationMessageNpcTime: {
      fontSize: '11px',
      color: '#666',
      marginTop: '4px',
      fontFamily: "'Rajdhani', sans-serif",
    },
    conversationMessageImage: {
      height: '400px',
      width: 'auto',
      objectFit: 'contain',
      borderRadius: '8px',
      marginTop: '8px',
    },
    conversationTestRight: {
      width: '280px',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    },
    conversationTestProfile: {
      background: '#162d3b',
      margin: '0',
      padding: '20px',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '30px', // Add space between profile and buttons
    },
    conversationTestProfileLabel: {
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: '12px',
      fontWeight: 600,
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
    },
    conversationTestProfileImage: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid white',
    },
    conversationTestProfileText: {
      fontFamily: "'Rajdhani', sans-serif",
      color: 'white',
      textAlign: 'center',
      fontSize: '14px',
    },
    conversationTestProfileName: {
      fontWeight: 700,
      fontSize: '16px',
    },
    conversationTestButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      padding: '0 20px 20px 20px',
    },
    conversationTestButtonWorker: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      border: '3px solid #4CAF50',
      borderRadius: '12px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    conversationTestButtonGenAI: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      border: '3px solid #F44336',
      borderRadius: '12px',
      background: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    conversationTestButtonIcon: {
      width: '60px',
      height: '60px',
      marginBottom: '8px',
    },
    conversationTestButtonText: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: '14px',
      fontWeight: 700,
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
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
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
        <img src="/npc/npc_island.png" alt="Glitch" style={styles.glitchImage} />
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
      {getCurrentNpc().map((npc, index) => {
        console.log('Rendering NPC:', npc.id, 'on island:', currentIsland, 'phase2Active:', phase2Active)
        const isCompleted = npc.id && completedNpcs.has(npc.id) && !islandRestored
        const statusIcon = npc.id && !islandRestored ? getNpcStatusIcon(npc.id) : null
        
        return (
          <div key={index}>
            {/* NPC Container */}
            <div 
              style={{
                ...(isCompleted ? styles.npcCompleted : styles.npc), 
                height: npc.size || npc.style?.height,
                width: npc.size || npc.style?.width || 'auto',
                ...npc.position,
                ...npc.style,
              }}
              onClick={(e) => {
                e.stopPropagation()
                
                // If NPC has a custom onClick handler (like Sparky), use it
                if (npc.onClick) {
                  npc.onClick()
                  return
                }
                
                // Otherwise, handle mission NPCs
                if (!npc.id) return
                
                if (currentIsland === ISLANDS.ISLAND_1) {
                  handleMissionNpcClick(npc.id)
                } else if (currentIsland === ISLANDS.ISLAND_2) {
                  if (phase2Active && npc.id.includes('_p2')) {
                    handlePhase2TextNpcClick(npc.id)
                  } else {
                    handleImageNpcClick(npc.id)
                  }
                } else if (currentIsland === ISLANDS.ISLAND_3) {
                  if (phase2Active && npc.id.includes('_p2')) {
                    handlePhase2PoetryNpcClick(npc.id)
                  } else {
                    handleQANpcClick(npc.id)
                  }
                }
              }}
              onMouseOver={(e) => !isCompleted && (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => !isCompleted && (e.currentTarget.style.transform = 'scale(1)')}
            >
              <img 
                src={npc.image}
                alt="NPC"
                style={styles.npcImage}
              />
            </div>
            
            {/* Status Icon */}
            {statusIcon && !islandRestored && (
              <img 
                src={statusIcon}
                alt="Status"
                style={{
                  position: 'absolute',
                  top: '-45px', // 5px above the NPC
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '40px',
                  height: '40px',
                  zIndex: 35,
                }}
              />
            )}
          </div>
        )
      })}

      {/* Regular NPC Dialogue - Auto-display with typing animation */}
      {showDialogue && currentDialogue && currentDialogue.speaker !== 'Glitch' && (
        <div style={{
          ...styles.dialogueContainer,
          // Position based on island
          ...(currentDialogueIsland === ISLANDS.ISLAND_1 && {
            right: 'calc(15% + 350px + 20px)', // Right side of NPC1
            bottom: '15%',
            left: 'auto',
            top: 'auto'
          }),
          ...(currentDialogueIsland === ISLANDS.ISLAND_2 && {
            left: '15%',
            bottom: 'calc(10% + 300px + 20px)', // Top of NPC2
            right: 'auto',
            top: 'auto'
          }),
          ...(currentDialogueIsland === ISLANDS.ISLAND_3 && {
            left: 'calc(15% + 300px + 20px)', // Right side of NPC3
            bottom: '30%',
            right: 'auto',
            top: 'auto'
          })
        }}>
          <div style={{
            padding: '20px 25px',
            borderRadius: '16px',
            // Glassmorphism with 85% opacity white background for better readability
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            // Subtle border
            border: '1px solid rgba(255, 255, 255, 0.4)',
            // Inner shadow for depth
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 8px 24px rgba(0, 0, 0, 0.15)',
            position: 'relative',
          }}>
            <div style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '12px',
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: '8px',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.6)', // Subtle outer glow
            }}>{currentDialogue.speaker}</div>
            <p style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '18px', // Increased font size for better readability
              color: '#1a1a1a',
              lineHeight: 1.6,
              margin: 0,
              textShadow: '0 0 6px rgba(255, 255, 255, 0.5)', // Subtle outer glow
            }}>
              {displayedText}
              {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
            </p>
            {/* No Continue/Skip buttons - auto-advance */}
          </div>
        </div>
      )}
      
      {/* Glitch Dialogue - Modern Design with Input (Top Right) */}
      {showGlitchDialogue && (
        <div style={styles.glitchDialogue}>
          {/* Close button */}
          <button
            style={styles.glitchDialogueCloseButton}
            onClick={() => setShowGlitchDialogue(false)}
            onMouseOver={(e) => {
              e.target.style.color = '#333'
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#999'
            }}
          >
            ×
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
            {phase2Active 
              ? t('phase2GlitchMessage')
              : missionActive 
                ? "The truth is hidden in plain sight. Look carefully at what you see."
                : t('sparkyMainIsland')}
          </p>
          
          {/* Input container */}
          <div 
            style={styles.glitchDialogueInputContainer}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#af4dca'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e0e0e0'
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

      {/* Sparky Dialogue - Modern Design */}
      {showSparkyDialogue && (() => {
        const theme = {
          borderColor: '#008dda', // 蓝色边框
          progressColor: '#008dda',
          backgroundColor: '#f1f2ed', // 对话框底色
          userBubbleColor: '#008dda', // 用户对话框底色
          avatar: '/island/npc/sparky.gif'
        }
        
        // Calculate progress and mission name
        const totalSteps = 5 // Initial dialogue / Mission 1 / Mission 1 Summary / Mission 2 / Mission 2 Summary
        let currentStep = 1
        let missionName = 'INITIAL BRIEFING'
        
        if (!missionActive) {
          currentStep = 1
          missionName = 'INITIAL BRIEFING'
        } else if (missionActive && !missionCompleted && !phase2Active) {
          currentStep = 2
          missionName = 'MISSION: IDENTIFY AI HALLUCINATIONS'
        } else if (missionCompleted && !phase2Active) {
          currentStep = 3
          missionName = 'MISSION 1 SUMMARY'
        } else if (phase2Active && !phase2Completed) {
          currentStep = 4
          missionName = 'MISSION: DETECT HOMOGENIZATION'
        } else if (phase2Completed) {
          currentStep = 5
          missionName = 'MISSION 2 SUMMARY'
        }
        
        const progressPercent = (currentStep / totalSteps) * 100
        
        return (
          <div style={{
            ...styles.modernDialogueContainer,
            background: theme.backgroundColor,
            border: `3px solid ${theme.borderColor}`,
            top: '12.5%',
            left: '10%',
            width: '40%',
            height: '70%',
          }}>
            {/* Header with Progress */}
            <div style={styles.modernDialogueHeader}>
              {/* Mission name and step indicator */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                <div style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#333',
                  letterSpacing: '0.5px',
                }}>{missionName}</div>
                <div style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '14px',
                  fontWeight: 400,
                  color: '#999',
                }}>Step {currentStep} of {totalSteps}</div>
              </div>
              
              {/* Progress bar with close button */}
              <div style={{position: 'relative', marginBottom: '15px'}}>
                <div style={{...styles.modernProgressBar, background: '#e0e0e0'}}>
                  <div style={{
                    ...styles.modernProgressFill,
                    width: `${progressPercent}%`,
                    background: theme.progressColor,
                  }} />
                </div>
                
                {/* Close button - positioned at bottom right of progress bar */}
                <button 
                  style={{
                    ...styles.modernCloseButton,
                    position: 'absolute',
                    bottom: '-25px',
                    right: '0px',
                  }}
                  onClick={() => {
                    setShowSparkyDialogue(false)
                    setShowSparkyDebrief(false)
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#333'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#999'}
                >
                  ✕
                </button>
              </div>
              
              {/* NPC info below progress bar */}
              <div style={{...styles.modernNpcInfo, marginTop: '15px'}}>
                <img src={theme.avatar} alt="Sparky" style={styles.modernNpcAvatar} />
                <div>
                  <div style={styles.modernNpcName}>Sparky</div>
                  <div style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#999',
                  }}>Island Manager</div>
                </div>
              </div>
            </div>
            
            {/* Messages Content */}
            <div style={styles.modernDialogueContent}>
              {sparkyMessages.map((message, index) => {
                const timestamp = getCurrentTimestamp()
                const isLastMessage = index === sparkyMessages.length - 1
                
                if (message.type === 'message') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#333',
                        marginBottom: '8px',
                      }}>SPARKY:</div>
                      <p style={styles.modernNpcText}
                        dangerouslySetInnerHTML={{ 
                          __html: (isLastMessage && sparkyIsTyping ? sparkyTypingText : message.text).replace(
                            /<span class='highlight'>(.*?)<\/span>/g, 
                            `<span style="color: ${theme.borderColor}; font-weight: 600;">$1</span>`
                          )
                        }} 
                      />
                      {isLastMessage && sparkyIsTyping && <span style={{ opacity: 0.5 }}>|</span>}
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'user_choice') {
                  return (
                    <div key={index} style={styles.modernUserMessage}>
                      <div style={{
                        ...styles.modernUserBubble,
                        background: theme.userBubbleColor, // 使用新的用户对话框颜色
                        color: 'white',
                      }}>
                        <p style={{...styles.modernUserText, color: 'white'}}>{message.text}</p>
                      </div>
                      <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'user_quiz_choice') {
                  return (
                    <div key={index} style={styles.modernUserMessage}>
                      <div style={{
                        padding: '12px 18px',
                        background: 'white',
                        border: '2px solid #4caf50',
                        borderRadius: '12px',
                        color: '#333',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}>
                        <span style={{
                          fontSize: '18px',
                          color: '#4caf50',
                        }}>✓</span>
                        <span>{message.text}</span>
                      </div>
                      <div style={{...styles.modernTimestamp, textAlign: 'right'}}>{timestamp}</div>
                    </div>
                  )
                }
                
                if (message.type === 'animation' || message.type === 'image') {
                  return (
                    <div key={index} style={{...styles.modernNpcMessage, textAlign: 'center'}}>
                      <img 
                        src={message.src} 
                        alt={message.alt}
                        style={{maxWidth: '100%', height: 'auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                      />
                    </div>
                  )
                }
                
                if (message.type === 'quiz_feedback') {
                  return (
                    <div key={index} style={styles.modernNpcMessage}>
                      <div style={{
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#333',
                        marginBottom: '8px',
                      }}>SPARKY:</div>
                      <div style={{
                        padding: '15px 20px',
                        background: '#e8f4f8',
                        borderRadius: '12px',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '15px',
                        lineHeight: '1.6',
                        color: '#333',
                      }}>
                        <div style={{
                          fontStyle: 'italic',
                          color: '#008dda',
                          marginBottom: '8px',
                          fontWeight: 600,
                        }}>
                          {message.isCorrect ? 'Exactly!' : 'Not quite...'}
                        </div>
                        <div>{message.text}</div>
                      </div>
                      <div style={styles.modernTimestamp}>{timestamp}</div>
                    </div>
                  )
                }
                
                return null
              })}
              
              {/* Quiz Choice Buttons */}
              {showQuizChoice && (() => {
                const flow = showFinalSparkyDialogue ? getFinalSparkyDialogueFlow(t) : getSparkyDebriefFlow(t)
                const currentItem = flow[showFinalSparkyDialogue ? finalDialogueStep : debriefStep]
                
                if (currentItem && currentItem.quiz) {
                  const choiceLabels = ['A', 'B', 'C', 'D', 'E', 'F']
                  
                  return (
                    <div style={{marginTop: '25px'}}>
                      {/* Question Card */}
                      <div style={{
                        background: '#e8f4f8',
                        padding: '20px 25px',
                        borderRadius: '12px',
                        marginBottom: '25px',
                        fontFamily: "'Roboto', sans-serif",
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#333',
                      }}>
                        <strong style={{color: '#008dda'}}>Question:</strong> {currentItem.quiz.question}
                      </div>
                      
                      {/* Quiz Image (if exists) */}
                      {currentItem.quiz.image && (
                        <div style={{
                          textAlign: 'center',
                          marginBottom: '25px',
                        }}>
                          <img 
                            src={currentItem.quiz.image}
                            alt="Quiz"
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                              borderRadius: '12px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Choice Buttons with Labels */}
                      {currentItem.quiz.choices.map((choice, index) => (
                        <button
                          key={choice.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            width: '100%',
                            padding: '15px 20px',
                            marginBottom: '12px',
                            background: 'white',
                            border: '2px solid #d0e8f2',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: "'Roboto', sans-serif",
                            fontSize: '15px',
                            color: '#333',
                            textAlign: 'left',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          }}
                          onClick={() => handleQuizChoice(choice.id, choice.correct, choice.text)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#f0f8ff'
                            e.currentTarget.style.borderColor = '#008dda'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 141, 218, 0.15)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white'
                            e.currentTarget.style.borderColor = '#d0e8f2'
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                          }}
                        >
                          {/* Label Card */}
                          <div style={{
                            minWidth: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#b8e0f0',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '16px',
                            color: '#006b9e',
                          }}>
                            {choiceLabels[index]}
                          </div>
                          {/* Choice Text */}
                          <span style={{flex: 1}}>{choice.text}</span>
                        </button>
                      ))}
                    </div>
                  )
                }
                return null
              })()}
              
              {/* User Choice Buttons - aligned to left, white background with black text */}
              {waitingForChoice && (() => {
                const flow = showFinalSparkyDialogue ? getFinalSparkyDialogueFlow(t) : 
                             showSparkyDebrief ? getSparkyDebriefFlow(t) : getSparkyDialogueFlow(t)
                const currentItem = flow[showFinalSparkyDialogue ? finalDialogueStep : 
                                         showSparkyDebrief ? debriefStep : currentSparkyStep]
                
                if (currentItem && currentItem.nextChoice) {
                  return (
                    <div style={{display: 'flex', justifyContent: 'flex-start', marginTop: '15px'}}>
                      <button
                        style={{
                          ...styles.modernActionButton,
                          background: 'white',
                          color: '#333',
                          border: '2px solid #e0e0e0',
                          marginLeft: '0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        onClick={() => {
                          if (showFinalSparkyDialogue) {
                            handleSparkyChoice(currentItem.nextChoice.text, currentItem.nextChoice.choiceId)
                          } else if (showSparkyDebrief) {
                            handleSparkyChoice(currentItem.nextChoice.text, currentItem.nextChoice.choiceId)
                          } else {
                            handleSparkyChoice(currentItem.nextChoice.text, currentItem.nextChoice.choiceId)
                          }
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f5f5f5'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'white'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
                        }}
                      >
                        <span style={{fontSize: '16px'}}>→</span>
                        {currentItem.nextChoice.text}
                      </button>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </div>
        )
      })()}

      {/* New Conversation Test Card */}
      {showMissionDialogue && currentMissionNpc && (
        <div style={styles.conversationTestCard}>
          {/* Header */}
          <div style={styles.conversationTestHeader}>
            <img src="/island/icon/worker.svg" alt="Worker" style={styles.conversationTestIcon} />
            <div style={styles.conversationTestTitle}>Worker or GenAI?</div>
            <img src="/island/icon/ai.svg" alt="AI" style={styles.conversationTestIcon} />
            <button 
              style={styles.conversationTestClose}
              onClick={() => {
                setShowMissionDialogue(false)
                setConversationMessages([])
                setCurrentConvMessageIndex(0)
                setShowConvButtons(false)
              }}
            >
              ×
            </button>
          </div>
          
          {/* Body */}
          <div style={styles.conversationTestBody}>
            {/* Left: Conversation Test */}
            <div style={styles.conversationTestLeft}>
              <div style={styles.conversationTestMessages}>
                {conversationMessages.map((msg, index) => {
                  const isLastMessage = index === conversationMessages.length - 1
                  const isTyping = isLastMessage && isConvTyping
                  const displayText = isTyping ? convTypingText : msg.text
                  
                  if (msg.speaker === 'you') {
                    return (
                      <div key={index} style={styles.conversationMessageYou}>
                        <div style={styles.conversationMessageYouTime}>{msg.timestamp} ● You</div>
                        <div style={{
                          ...styles.conversationMessageYouBubble,
                          fontSize: currentIsland === ISLANDS.ISLAND_3 ? '26px' : '14px'
                        }}>
                          {displayText}
                          {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
                        </div>
                        {/* Show image after text for YOU messages (Island 2) */}
                        {msg.hasImage && !isTyping && (
                          <div style={{position: 'relative', marginTop: '8px', display: 'flex', justifyContent: 'flex-end'}}>
                            <img 
                              src={msg.image} 
                              alt="Work" 
                              style={{
                                height: '300px',
                                width: 'auto',
                                objectFit: 'contain',
                                borderRadius: '8px',
                                marginTop: '8px',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  } else {
                    return (
                      <div key={index} style={styles.conversationMessageNpc}>
                        <div style={styles.conversationMessageNpcTime}>{msg.timestamp} ● {currentMissionNpc.id.toUpperCase()}</div>
                        
                        {/* Icon (if exists) */}
                        {currentMissionNpc.icon && !isTyping && (
                          <div style={{marginBottom: '12px', textAlign: 'center'}}>
                            <img 
                              src={currentMissionNpc.icon} 
                              alt="Icon" 
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'contain',
                              }}
                            />
                          </div>
                        )}
                        
                        <div style={{
                          ...styles.conversationMessageNpcBubble,
                          fontSize: currentIsland === ISLANDS.ISLAND_3 ? '26px' : '14px',
                          whiteSpace: 'pre-wrap', // Preserve line breaks and spaces
                          fontFamily: currentIsland === ISLANDS.ISLAND_3 ? "'Courier New', monospace" : "'Rajdhani', sans-serif",
                        }}>
                          {displayText}
                          {isTyping && <span style={{ opacity: 0.5 }}>|</span>}
                        </div>
                        {/* Show image after text, not inside bubble */}
                        {msg.hasImage && !isTyping && (
                          <div style={{position: 'relative', marginTop: '8px'}}>
                            <img 
                              src={msg.image} 
                              alt="Work" 
                              style={styles.conversationMessageImage}
                            />
                          </div>
                        )}
                      </div>
                    )
                  }
                })}
              </div>
            </div>
            
            {/* Right: Profile & Buttons */}
            <div style={styles.conversationTestRight}>
              <div style={{...styles.conversationTestProfile, position: 'relative'}}>
                <div style={styles.conversationTestProfileLabel}>Profile</div>
                <img 
                  src={currentMissionNpc.image} 
                  alt={currentMissionNpc.id}
                  style={styles.conversationTestProfileImage}
                />
                <div style={styles.conversationTestProfileText}>
                  <div style={styles.conversationTestProfileName}>Name: {currentMissionNpc.id.toUpperCase()}</div>
                  <div>Age: {Math.floor(Math.random() * 10) + 1} years old</div>
                  <div>Declaration Role: {currentIsland === ISLANDS.ISLAND_1 ? 'Artist' : currentIsland === ISLANDS.ISLAND_2 ? 'Editor' : 'Reviewer'}</div>
                </div>
                
                {/* Stamp overlay on NPC Profile Card */}
                {showStamp && (
                  <img 
                    src={stampType === 'passed' ? '/island/icon/passed.png' : '/island/icon/failed.png'}
                    alt={stampType}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '280px',
                      height: 'auto',
                      zIndex: 100,
                      pointerEvents: 'none',
                    }}
                  />
                )}
              </div>
              
              {/* Judgment Buttons */}
              {showConvButtons && (
                <div style={styles.conversationTestButtons}>
                  <div 
                    style={{
                      ...styles.conversationTestButtonWorker,
                      animation: shakeWorkerBtn ? 'shake 0.5s' : 'none',
                    }}
                    onClick={() => handleConversationJudgment('worker')}
                    onMouseOver={(e) => {
                      if (!shakeWorkerBtn) {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.3)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!shakeWorkerBtn) {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    <img src="/desert/icon/correct.png" alt="Worker" style={styles.conversationTestButtonIcon} />
                    <div style={{...styles.conversationTestButtonText, color: '#4CAF50'}}>Verified as Worker</div>
                  </div>
                  
                  <div 
                    style={{
                      ...styles.conversationTestButtonGenAI,
                      animation: shakeGenAIBtn ? 'shake 0.5s' : 'none',
                    }}
                    onClick={() => handleConversationJudgment('genai')}
                    onMouseOver={(e) => {
                      if (!shakeGenAIBtn) {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 67, 54, 0.3)'
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!shakeGenAIBtn) {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }
                    }}
                  >
                    <img src="/desert/icon/wrong.png" alt="GenAI" style={styles.conversationTestButtonIcon} />
                    <div style={{...styles.conversationTestButtonText, color: '#F44336'}}>Identified as GenAI</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hand Stamp Animation */}
      {showHandStamp && (() => {
        console.log('Rendering hand stamp, phase:', handStampPhase)
        return (
          <img 
            src="/island/icon/hand.png"
            alt="Stamping Hand"
            style={{
              position: 'fixed',
              width: '600px',
              height: 'auto',
              zIndex: 200,
              pointerEvents: 'none',
              willChange: 'top, bottom, left, right, opacity',
              // Initial position - always set
              bottom: handStampPhase === 'moving' ? '5%' : 'auto',
              left: handStampPhase === 'moving' ? '30%' : 'auto',
              top: handStampPhase !== 'moving' ? '15%' : 'auto',
              right: handStampPhase !== 'moving' ? '3%' : 'auto',
              opacity: handStampPhase === 'fadeout' ? 0 : 1,
              // Smooth transition for all phases
              transition: handStampPhase === 'fadeout' 
                ? 'all 0.5s ease-out' 
                : 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              // Fadeout moves right
              ...(handStampPhase === 'fadeout' && {
                right: '-25%',
              }),
            }}
          />
        )
      })()}

      {/* Progress Collection - New Design with Coconuts */}
      {missionActive && !islandRestored && (currentIsland === ISLANDS.ISLAND_1 || currentIsland === ISLANDS.ISLAND_2 || currentIsland === ISLANDS.ISLAND_3) && (
        <div style={{
          position: 'absolute',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '14px',
          padding: '10px 20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          zIndex: 50,
          minWidth: '550px',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <div style={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              color: '#333',
            }}>Your Collection</div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '4px',
            }}>
              <span style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '18px',
                fontWeight: 700,
                color: '#333',
              }}>
                {phase2Active ? phase2CompletedMissions.length : completedMissions.length}/{phase2Active ? 5 : 9}
              </span>
              <span style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: '10px',
                fontWeight: 400,
                color: '#999',
              }}>Found</span>
            </div>
          </div>
          
          {/* Coconut Progress Icons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            {phase2Active ? (
              // Phase 2: Show 5 coconuts
              [1, 2, 3, 4, 5].map(num => {
                const isCompleted = phase2CompletedMissions.includes(num)
                return (
                  <div 
                    key={`p2_${num}`}
                    style={{
                      position: 'relative',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img 
                      src="/island/icon/coconut.svg"
                      alt="coconut"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        opacity: isCompleted ? 1 : 0.3,
                        filter: isCompleted ? 'none' : 'grayscale(100%)',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isCompleted ? '#333' : '#999',
                      textShadow: 'none',
                    }}>
                      {isCompleted ? num : '?'}
                    </div>
                  </div>
                )
              })
            ) : (
              // Phase 1: Show 9 coconuts
              [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                const isCompleted = completedMissions.length >= num
                return (
                  <div 
                    key={num}
                    style={{
                      position: 'relative',
                      width: '45px',
                      height: '45px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img 
                      src="/island/icon/coconut.svg"
                      alt="coconut"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        opacity: isCompleted ? 1 : 0.3,
                        filter: isCompleted ? 'none' : 'grayscale(100%)',
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: '15px',
                      fontWeight: 700,
                      color: isCompleted ? '#333' : '#999',
                      textShadow: 'none',
                    }}>
                      {isCompleted ? num : '?'}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* OLD Q&A and Image Dialogues removed - now using unified Conversation Test Card */}

      {/* Reloading Screen */}
      {showReloading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          {/* Island Icon */}
          <img 
            src="/island/icon/island.png" 
            alt="Island" 
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              marginBottom: '30px',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          
          <div style={{
            color: 'white',
            fontSize: '48px',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 'bold',
            marginBottom: '30px',
          }}>
            Reloading
          </div>
          <div style={{
            width: '60px',
            height: '60px',
            border: '6px solid #333',
            borderTop: '6px solid #5170FF',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes pulse {
                0%, 100% { 
                  transform: scale(1);
                  opacity: 1;
                }
                50% { 
                  transform: scale(1.1);
                  opacity: 0.8;
                }
              }
            `}
          </style>
        </div>
      )}
    </div>
  )
}

export default IslandMap