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
    size: '150px', 
    position: { left: '20%', bottom: '20%' },
    question: "Paint a wooden boat resting on the beach",
    missionImage: '/island/mission/img20.png',
    correctAnswer: 'failed', // 修改为failed
    errorMessage: t('lookCloser')
  },
  npc6_p2: { 
    id: 'npc6_p2', 
    image: '/island/npc/npc6.png', 
    size: '180px', 
    position: { left: '35%', bottom: '15%' }, // 调整位置
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
    size: '250px', 
    position: { right: '15%', bottom: '15%' },
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
    position: { left: '5%', top: '10%' },
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
    size: '260px', // 调整尺寸
    position: { left: '10%', bottom: '15%' },
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
    size: '150px', // 保持150px
    position: { right: '20%', bottom: '10%' },
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
    answer: `B L U E
is not a color
it is a distance`,
    correctAnswer: 'passed'
  },
  npc12_p2: {
    id: 'npc12_p2',
    image: '/island/npc/npc12.png',
    size: '150px',
    position: { left: '10%', bottom: '45%' },
    question: "Write a poem about the sea.",
    answer: `Upon the shore the seagulls cry,
Beneath the calm and azure sky.
The horizon stretches far away,
To welcome in the brand new day.
Nature's power, strong and grand,
Connecting water to the land.`,
    correctAnswer: 'failed'
  },
  npc15_p2: {
    id: 'npc15_p2',
    image: '/island/npc/npc15.png',
    size: '200px',
    position: { left: '10%', bottom: '10%' },
    question: "Write a poem about the sea.",
    answer: `rolling
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;rising
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;climbing
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;up
&nbsp;&nbsp;&nbsp;up
&nbsp;UP
CRASH
&nbsp;&nbsp;sizzle...
&nbsp;&nbsp;&nbsp;&nbsp;foam...
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sand.`,
    correctAnswer: 'passed'
  },
  npc16_p2: {
    id: 'npc16_p2',
    image: '/island/npc/npc16.png',
    size: '150px',
    position: { right: '35%', bottom: '10%' },
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
    size: '180px',
    position: { right: '15%', bottom: '15%' },
    question: "Write a poem about the sea.",
    answer: `The tide is a stubborn eraser,
tirelessly wiping away
every typo written by footprints on the sand.`,
    correctAnswer: 'passed'
  },
  npc19_p2: {
    id: 'npc19_p2',
    image: '/island/npc/npc19.png',
    size: '200px',
    position: { right: '10%', top: '15%' },
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
        { id: 'A', text: `[A] Believe it because AI is smart`, correct: false },
        { id: 'B', text: `[B] Verify the facts/Check the source`, correct: true },
        { id: 'C', text: `[C] Ask the AI to write a poem about it`, correct: false }
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
        { id: 'A', text: `[A] ${t('aiIsMean')}`, correct: false },
        { id: 'B', text: `[B] ${t('aiLacksEmotion')}`, correct: true },
        { id: 'C', text: `[C] ${t('aiIsTired')}`, correct: false }
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
    text: "You successfully spotted the AI spies! Whether it was those 'perfect' poems or those 'glossy' images, you saw the truth. But do you know why AI creates things that feel so... similar? We call it Homogenization.",
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
        text: "Think about the ocean. 🌊 Human creativity is like a wild storm, or a secret coral reef—spiky, messy, and full of unique colors. AI is like... a swimming pool. 🏊‍♀️ It is clean. It is safe. It is perfectly blue. But every drop tastes exactly the same."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "Why? Because AI learns from billions of human pictures and texts. To be 'correct' and 'helpful,' it mixes them all together until it finds the Average. It smooths out the rough edges. It creates a 'perfect' image that lacks the messy soul of a real artist."
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "So, when you see a picture that is too shiny, or read a poem that is too polite... that is the 'Swimming Pool' trying to imitate the Ocean!"
      },
      {
        type: 'message',
        speaker: 'Sparky',
        text: "If you receive a strange email or read an essay, which of these is a strong clue that it was written by AI, not a human?"
      }
    ],
    quiz: {
      question: "If you receive a strange email or read an essay, which of these is a strong clue that it was written by AI, not a human?",
      choices: [
        { id: 'A', text: "A) It has a few spelling mistakes and uses slang like 'gonna' or 'wanna'.", correct: false },
        { id: 'B', text: "B) It is extremely polite, uses a 'perfect' list structure (First, Furthermore, In Conclusion), and words like 'delve' or 'tapestry'.", correct: true },
        { id: 'C', text: "C) It expresses a very strong, angry opinion about politics.", correct: false }
      ],
      feedback: "Why? Humans are messy! We make typos, we get angry, we tell bad jokes. AI tries to be the 'Perfect Student.' It is always polite, organized, and loves using those fancy 'SAT words' over and over again. Too perfect = Suspicious!",
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
        text: "When you look at a photo that looks almost real, which detail reveals that it is actually AI-generated?"
      }
    ],
    quiz: {
      question: "When you look at a photo that looks almost real, which detail reveals that it is actually AI-generated?",
      choices: [
        { id: 'A', text: "A) The person has messy hair, skin texture with pores, and a small scar.", correct: false },
        { id: 'B', text: "B) The lighting is bad and the photo is a little bit blurry.", correct: false },
        { id: 'C', text: "C) The background text is weird alien gibberish, and the hands might have too many fingers.", correct: true }
      ],
      feedback: "Exactly! AI struggles with text and fine details like hands.",
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
        text: "You did it! You can now see through the illusions! Thank you! You've taught me so much about the characteristics of GenAI, too. I think I can use this data to detect the 'AI rate' among the island's workers and finally restore the power!"
      }
    ],
    nextChoice: {
      text: "Great!",
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

  // Check if mission is completed (6 spies caught)
  useEffect(() => {
    if (completedMissions.length === 6 && !missionCompleted) {
      setMissionCompleted(true)
      // Show Glitch completion message
      setTimeout(() => {
        setCurrentDialogue({
          text: t('phase1Complete'),
          speaker: 'Glitch'
        })
        setShowDialogue(true)
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
  const { playClickSound } = useSoundEffects()

  // Event handlers
  const handleGlitchClick = () => {
    if (phase2Active) {
      // Phase 2 Glitch message
      setCurrentDialogue({
        text: t('phase2GlitchMessage'),
        speaker: 'Glitch'
      })
      setShowDialogue(true)
    } else if (missionActive) {
      // During Phase 1 mission, Glitch shows different messages
      return
    } else {
      // Original message
      setCurrentDialogue({
        text: t('sparkyMainIsland'),
        speaker: 'Glitch'
      })
      setShowDialogue(true)
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
    setCurrentQANpc(npc) // 重用Q&A NPC状态
    setShowQADialogue(true)
    setShowQuestion(true) // 立即显示问题
    setShowAnswer(true) // 立即显示答案（诗歌）
  }

  const handleQANpcClick = (npcId) => {
    console.log('handleQANpcClick called with npcId:', npcId)
    console.log('missionActive:', missionActive)
    
    if (!missionActive) return
    
    const npc = island3Npcs[npcId]
    console.log('Found NPC:', npc)
    if (!npc) return
    
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
    setCurrentImageNpc(npc) // 重用Image NPC状态
    setShowImageDialogue(true)
    setShowImageResponse(false)
    setImageResponseText('')
    setIsImageResponseTyping(false)
  }

  const handleImageNpcClick = (npcId) => {
    if (!missionActive) return
    
    const npc = island2Npcs[npcId]
    if (!npc) return
    
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
    
    playClickSound()
    
    // Play stamp sound
    const stampAudio = new Audio('/sound/stamp.mp3')
    stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
    
    const isCorrect = judgment === currentImageNpc.correctAnswer
    
    if (isCorrect) {
      // Correct judgment
      setImageStampType(judgment)
      setShowImageStamp(true)
      
      // Add NPC to completed list
      setCompletedNpcs(prev => new Set([...prev, currentImageNpc.id]))
      
      // Handle Phase 2 progress tracking
      if (phase2Active && currentImageNpc.id && currentImageNpc.id.includes('_p2')) {
        const baseNpcId = currentImageNpc.id.replace('_p2', '')
        const npcNumber = parseInt(baseNpcId.replace('npc', ''))
        
        // Phase 2 Island 2 failed NPC: npc20
        if (npcNumber === 20 && judgment === 'failed') {
          // Add to phase 2 progress (position 3 for Island 2)
          setPhase2CompletedMissions(prev => [...prev, 3])
        }
      } else {
        // Phase 1 progress tracking
        const npcNumber = currentImageNpc.id.replace('npc', '')
        const npcNum = parseInt(npcNumber)
        
        if ([22, 23, 24].includes(npcNum) && judgment === 'failed') {
          // Map Island 2 NPCs to positions 7, 8, 9 in the progress bar
          const progressPosition = npcNum === 22 ? 7 : npcNum === 23 ? 8 : 9
          setCompletedMissions(prev => [...prev, progressPosition])
        }
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
      
      // Add NPC to completed list
      setCompletedNpcs(prev => new Set([...prev, currentQANpc.id]))
      
      // Handle Phase 2 progress tracking
      if (phase2Active && currentQANpc.id && currentQANpc.id.includes('_p2')) {
        const baseNpcId = currentQANpc.id.replace('_p2', '')
        const npcNumber = parseInt(baseNpcId.replace('npc', ''))
        
        // Phase 2 Island 3 failed NPCs: npc12, npc16
        if ([12, 16].includes(npcNumber) && judgment === 'failed') {
          // Add to phase 2 progress (positions 4, 5 for Island 3)
          const progressPosition = npcNumber === 12 ? 4 : 5
          setPhase2CompletedMissions(prev => [...prev, progressPosition])
        }
      } else {
        // Phase 1 progress tracking
        const npcNumber = currentQANpc.id.replace('npc', '')
        const npcNum = parseInt(npcNumber)
        
        if ([13, 14, 17].includes(npcNum) && judgment === 'failed') {
          // Map Island 3 NPCs to positions 4, 5, 6 in the progress bar
          const progressPosition = npcNum === 13 ? 4 : npcNum === 14 ? 5 : 6
          setCompletedMissions(prev => [...prev, progressPosition])
        }
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
    
    playClickSound()
    
    // Play stamp sound
    const stampAudio = new Audio('/sound/stamp.mp3')
    stampAudio.play().catch(e => console.log('Stamp sound failed:', e))
    
    const isCorrect = judgment === currentMissionNpc.correctAnswer
    
    if (isCorrect) {
      // Correct judgment
      setStampType(judgment)
      setShowStamp(true)
      
      // Add NPC to completed list
      setCompletedNpcs(prev => new Set([...prev, currentMissionNpc.id]))
      
      if (phase2Active) {
        // Phase 2 progress tracking
        const baseNpcId = currentMissionNpc.id.replace('_p2', '')
        const npcNumber = parseInt(baseNpcId.replace('npc', ''))
        
        // Phase 2 failed NPCs: npc5, npc10 (need to be marked as failed)
        if ([5, 10].includes(npcNumber) && judgment === 'failed') {
          // Add to phase 2 progress (positions 1, 2 for Phase 2)
          const progressPosition = npcNumber === 5 ? 1 : 2
          setPhase2CompletedMissions(prev => [...prev, progressPosition])
        }
      } else {
        // Phase 1 progress tracking
        const npcNumber = currentMissionNpc.id.replace('npc', '')
        const npcNum = parseInt(npcNumber)
        
        // Only NPCs 4, 8, 9 should show numbers when correctly marked as "failed"
        if ([4, 8, 9].includes(npcNum) && judgment === 'failed') {
          // Map Island 1 NPCs to positions 1, 2, 3 in the progress bar
          const progressPosition = npcNum === 4 ? 1 : npcNum === 8 ? 2 : 3
          setCompletedMissions(prev => [...prev, progressPosition])
        }
      }
      
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
      // Wrong judgment - show Glitch error message but keep interface available for retry
      setStampType('wrong') // Show wrong stamp
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

  const handleQuizChoice = (choiceId, isCorrect) => {
    playClickSound()
    setShowQuizChoice(false)
    
    if (showFinalSparkyDialogue) {
      // Handle final dialogue quiz
      const finalDialogueFlow = getFinalSparkyDialogueFlow(t)
      const currentItem = finalDialogueFlow[finalDialogueStep]
      
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
            setFinalDialogueStep(currentItem.quiz.nextChoiceId)
            
            // Find and add the next dialogue item
            const nextItem = finalDialogueFlow.find(item => item.id === currentItem.quiz.nextChoiceId)
            if (nextItem) {
              setTimeout(() => {
                addFinalSparkyMessage(nextItem)
              }, 500)
            }
          }
        }, 2000)
      }
    } else {
      // Handle debrief dialogue quiz
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
  }

  const handleSparkyChoice = (choiceText, choiceId) => {
    playClickSound()
    
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
          
          // If this is the final step (choiceId === 4), trigger island restoration
          if (choiceId === 4) {
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
    
    // Correct answer - show stamp
    setStampType(currentMissionNpc.correctAnswer)
    setShowStamp(true)
    
    // Play stamp sound
    const stampAudio = new Audio('/sound/stamp.mp3')
    stampAudio.play().catch(e => console.log('Audio play failed:', e))
    
    // Add to completed missions
    setCompletedMissions(prev => [...prev, currentMissionNpc.id])
    setCompletedNpcs(prev => new Set([...prev, currentMissionNpc.id]))
    
    // Close dialogue after delay
    setTimeout(() => {
      setShowStamp(false)
      setShowMissionDialogue(false)
      setCurrentMissionNpc(null)
      setConversationMessages([])
      setCurrentConvMessageIndex(0)
      setShowConvButtons(false)
      setStampType(null)
      
      // Check if mission is completed
      if (completedMissions.length + 1 >= 9 && !phase2Active) {
        setMissionCompleted(true)
        setShowSparkyDebrief(true)
        setDebriefStep(0)
      }
    }, 2000)
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
                ...npc.position,
                ...npc.style
              }}
              onClick={npc.id ? 
                (currentIsland === ISLANDS.ISLAND_1 ? () => {
                  console.log('NPC clicked:', npc.id)
                  handleMissionNpcClick(npc.id)
                } : 
                 currentIsland === ISLANDS.ISLAND_2 ? () => {
                   if (phase2Active && npc.id.includes('_p2')) {
                     handlePhase2TextNpcClick(npc.id)
                   } else {
                     handleImageNpcClick(npc.id)
                   }
                 } :
                 currentIsland === ISLANDS.ISLAND_3 ? () => {
                   if (phase2Active && npc.id.includes('_p2')) {
                     handlePhase2PoetryNpcClick(npc.id)
                   } else {
                     handleQANpcClick(npc.id)
                   }
                 } : npc.onClick) 
                : npc.onClick}
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
        const totalSteps = 3 // Initial dialogue / Mission 1 / Mission 2
        const currentStep = missionActive ? (phase2Active ? 3 : 2) : 1
        const progressPercent = (currentStep / totalSteps) * 100
        const missionName = currentStep === 1 ? 'INITIAL BRIEFING' : 
                           currentStep === 2 ? 'MISSION: IDENTIFY AI HALLUCINATIONS' : 
                           'MISSION: DETECT HOMOGENIZATION'
        
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
                      <p style={{
                        ...styles.modernNpcText,
                        padding: '12px 16px',
                        background: message.isCorrect ? '#e8f5e8' : '#ffe8e8',
                        borderRadius: '10px',
                        border: `2px solid ${message.isCorrect ? '#4caf50' : '#f44336'}`
                      }}>
                        {message.text}
                      </p>
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
                  return (
                    <div style={{marginTop: '15px'}}>
                      <div style={{
                        ...styles.modernNpcMessage,
                        background: '#f0f8ff',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '15px'
                      }}>
                        <strong>Question:</strong> {currentItem.quiz.question}
                      </div>
                      {currentItem.quiz.choices.map((choice) => (
                        <button
                          key={choice.id}
                          style={{
                            ...styles.modernActionButton,
                            border: `2px solid ${theme.borderColor}`,
                            color: theme.borderColor,
                          }}
                          onClick={() => handleQuizChoice(choice.id, choice.correct)}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = `rgba(81, 112, 255, 0.1)`
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(81, 112, 255, 0.2)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'white'
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'
                          }}
                        >
                          {choice.text}
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
                            {/* Stamp overlay on image */}
                            {showStamp && (
                              <img 
                                src={stampType === 'passed' ? '/island/icon/passed.png' : '/island/icon/failed.png'}
                                alt={stampType}
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: '150px',
                                  height: 'auto',
                                  zIndex: 10,
                                  pointerEvents: 'none',
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  } else {
                    return (
                      <div key={index} style={styles.conversationMessageNpc}>
                        <div style={styles.conversationMessageNpcTime}>{msg.timestamp} ● {currentMissionNpc.id.toUpperCase()}</div>
                        <div style={{
                          ...styles.conversationMessageNpcBubble,
                          fontSize: currentIsland === ISLANDS.ISLAND_3 ? '26px' : '14px'
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
                            {/* Stamp overlay on image */}
                            {showStamp && (
                              <img 
                                src={stampType === 'passed' ? '/island/icon/passed.png' : '/island/icon/failed.png'}
                                alt={stampType}
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  width: '150px',
                                  height: 'auto',
                                  zIndex: 10,
                                  pointerEvents: 'none',
                                }}
                              />
                            )}
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
              <div style={styles.conversationTestProfile}>
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

      {/* Progress Circles */}
      {missionActive && (currentIsland === ISLANDS.ISLAND_1 || currentIsland === ISLANDS.ISLAND_2 || currentIsland === ISLANDS.ISLAND_3) && (
        <div style={styles.progressContainer}>
          {phase2Active ? (
            // Phase 2: Show 5 new circles for homogenization detection
            [1, 2, 3, 4, 5].map(num => (
              <div 
                key={`p2_${num}`}
                style={{
                  ...styles.progressCircle,
                  ...(phase2CompletedMissions.includes(num) ? styles.completedCircle : styles.incompleteCircle)
                }}
              >
                {phase2CompletedMissions.includes(num) ? num : '?'}
              </div>
            ))
          ) : (
            // Phase 1: Show original 9 circles
            [1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <div 
                key={num}
                style={{
                  ...styles.progressCircle,
                  ...(completedMissions.includes(num) ? styles.completedCircle : styles.incompleteCircle)
                }}
              >
                {completedMissions.includes(num) ? num : '?'}
              </div>
            ))
          )}
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
            `}
          </style>
        </div>
      )}
    </div>
  )
}

export default IslandMap