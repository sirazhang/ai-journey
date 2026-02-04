import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, Send, MapPin } from 'lucide-react'

// Assistant App - Complete NPC Chat Implementation
const AssistantApp = ({ onClose }) => {
  const [selectedNPC, setSelectedNPC] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Determine available NPCs based on region progress
  const [availableNPCs, setAvailableNPCs] = useState([])

  useEffect(() => {
    const savedUser = localStorage.getItem('aiJourneyUser')
    
    const allNPCs = [
      { 
        id: 'glitch', 
        name: 'Glitch', 
        location: 'Central City', 
        color: '#9333ea', 
        textColor: '#ddd6fe',
        bgGradient: 'linear-gradient(135deg, #0f172a 0%, #581c87 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1517646577322-2637b3f2c002?auto=format&fit=crop&q=80',
        avatar: '/npc/npc1.png',
        initialMessage: "[System Error]... Welcome to my world. I've read your entire 'Error Collection'. Very interesting thought paths. Rebooting reality for you... Are you ready for the ultimate test? 💻",
        instruction: "You are Glitch, an AI construct in Central City. You speak with a cyberpunk/hacker tone. You often act like there are system errors. You are omniscient regarding the user's data and past mistakes. You reference 'reading their error logs'. You are mysterious and slightly intimidating.",
        alwaysAvailable: true
      },
      { 
        id: 'alpha', 
        name: 'Alpha', 
        location: 'Desert', 
        color: '#d97706', 
        textColor: '#78350f',
        bgGradient: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1545656134-8c46011c2e42?auto=format&fit=crop&q=80',
        avatar: '/desert/npc/npc4.png',
        initialMessage: "Target locked. Label accuracy 85%. Speed is acceptable, but precision needs improvement. In the desert, a wrong label means death. Proceed. 🌵",
        instruction: "You are Alpha, a wanderer in the Desert. You are cold, emotionless, and purely data-driven. You speak in short, clipped sentences. You focus on percentages, accuracy, and efficiency. You do not offer comfort; you offer facts.",
        region: 'desert'
      },
      { 
        id: 'moss', 
        name: 'Ranger Moss', 
        location: 'Jungle', 
        color: '#16a34a', 
        textColor: '#14532d',
        bgGradient: 'linear-gradient(135deg, #bbf7d0 0%, #6ee7b7 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1596706978434-2e94711933cc?auto=format&fit=crop&q=80',
        avatar: '/jungle/npc_c.png',
        initialMessage: "Bro! Look at that logic jungle! You just missed a 'Bias Mushroom' back there, that's a huge taboo in data collection. Don't lose heart, keep your eyes peeled next time! 🌿",
        instruction: "You are Ranger Moss, protector of the Jungle. You act like a supportive 'Big Brother'. You use slang like 'Bro'. You use jungle/nature metaphors to describe data and logic (e.g., 'logic jungle', 'bias mushroom'). Even when the user is wrong, you encourage them warmly and guide them.",
        region: 'jungle'
      },
      { 
        id: 'sparky', 
        name: 'Sparky', 
        location: 'Island', 
        color: '#f97316', 
        textColor: '#7c2d12',
        bgGradient: 'linear-gradient(135deg, #fed7aa 0%, #fef08a 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1596484552993-9c8cb05d15a5?auto=format&fit=crop&q=80',
        avatar: '/island/npc/spark.png',
        initialMessage: "OMG! You actually spotted that the 'Fake Captain' was an AI? 😱 How did you train those eagle eyes? Come play another round with me, if you win I've got a huge gift pack for you! ✨",
        instruction: "You are Sparky, living on a tropical Island. You are extremely high-energy, use lots of emojis (✨, 😱, 🔥), and treat everything like a game. You are very enthusiastic and get incredibly excited when the user identifies AI or solves puzzles correctly. You are a gamer/surfer archetype.",
        region: 'island'
      },
      { 
        id: 'momo', 
        name: 'Momo', 
        location: 'Glacier', 
        color: '#0891b2', 
        textColor: '#164e63',
        bgGradient: 'linear-gradient(135deg, #cffafe 0%, #bfdbfe 100%)',
        backgroundImage: 'https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?auto=format&fit=crop&q=80',
        avatar: '/glacier/npc/momo.png',
        initialMessage: "Privacy is the last bastion of civilization. You showed respect for 'Alex Chen's' personal data in the last verdict, which is good. But the law allows for no deviation. Stay vigilant. ❄️",
        instruction: "You are Momo, living in the Glacier. You focus on ethics, values, and legal precision. You speak formally and use sophisticated vocabulary. You view privacy as sacred. Even when praising, remain cautious and stern. Focus on the user's ethical tendencies.",
        region: 'glacier'
      }
    ]

    if (!savedUser) {
      setAvailableNPCs(allNPCs.filter(npc => npc.alwaysAvailable))
      return
    }

    const userData = JSON.parse(savedUser)
    const filtered = allNPCs.filter(npc => {
      if (npc.alwaysAvailable) return true
      const progressKey = `${npc.region}Progress`
      const progress = userData[progressKey] || 0
      return progress > 0
    })

    setAvailableNPCs(filtered)
  }, [])

  const handleSelectNPC = (npc) => {
    setSelectedNPC(npc)
    setMessages([{ 
      id: 'init', 
      role: 'model', 
      text: npc.initialMessage 
    }])
  }

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !selectedNPC) return

    const userMsg = { id: Date.now().toString(), role: 'user', text: inputText }
    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setIsLoading(true)

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }))

    // Import the service dynamically
    const { sendMessageToGemini } = await import('../../../services/geminiService')
    const responseText = await sendMessageToGemini(userMsg.text, history, selectedNPC.instruction)

    const modelMsg = { id: (Date.now() + 1).toString(), role: 'model', text: responseText }
    setMessages(prev => [...prev, modelMsg])
    setIsLoading(false)
  }

  // NPC Selection Screen
  if (!selectedNPC) {
    return (
      <div style={{
        height: '100%',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        <div style={{
          paddingTop: '56px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingBottom: '16px'
        }}>
          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '8px'
          }}>Choose your Companion</h1>
          <p style={{
            color: '#9ca3af',
            fontSize: '15px'
          }}>Select a character to start chatting.</p>
        </div>
        <div style={{
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingBottom: '80px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {availableNPCs.length === 0 ? (
            <div style={{
              padding: '48px 16px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <p>Complete missions to unlock NPCs!</p>
            </div>
          ) : (
            availableNPCs.map(npc => (
            <div 
              key={npc.id}
              onClick={() => handleSelectNPC(npc)}
              style={{
                padding: '16px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'pointer',
                transform: 'scale(1)',
                transition: 'transform 0.2s',
                background: npc.bgGradient,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                zIndex: 10,
                overflow: 'hidden'
              }}>
                <img 
                  src={npc.avatar} 
                  alt={npc.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{ flex: 1, zIndex: 10 }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: npc.id === 'glitch' ? '#fff' : '#111827'
                }}>{npc.name}</h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: '500',
                  opacity: 0.8,
                  color: npc.id === 'glitch' ? '#bfdbfe' : '#1f2937'
                }}>
                  <MapPin size={12} style={{ marginRight: '4px' }} />
                  {npc.location}
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    )
  }

  // Chat Screen
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      background: selectedNPC.id === 'glitch' ? '#0f172a' : '#f3f4f6'
    }}>
      {/* Header */}
      <div style={{
        height: '96px',
        paddingTop: '40px',
        paddingLeft: '16px',
        paddingRight: '16px',
        background: selectedNPC.id === 'glitch' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: selectedNPC.id === 'glitch' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
      }}>
        <button 
          onClick={() => setSelectedNPC(null)}
          style={{
            marginRight: '8px',
            padding: '8px',
            borderRadius: '9999px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
            color: selectedNPC.id === 'glitch' ? '#fff' : '#000'
          }}
        >
          <ChevronLeft />
        </button>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '12px',
          background: 'rgba(128, 128, 128, 0.2)',
          backdropFilter: 'blur(4px)',
          overflow: 'hidden'
        }}>
          <img 
            src={selectedNPC.avatar} 
            alt={selectedNPC.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        <div style={{ color: selectedNPC.id === 'glitch' ? '#fff' : '#000' }}>
          <h1 style={{
            fontSize: '18px',
            fontWeight: '700',
            lineHeight: 1,
            margin: 0
          }}>{selectedNPC.name}</h1>
          <span style={{
            fontSize: '12px',
            opacity: 0.7,
            fontWeight: '500'
          }}>{selectedNPC.location}</span>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: selectedNPC.id === 'glitch' ? '#0f172a' : '#f3f4f6'
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                borderRadius: '16px',
                padding: '12px 16px',
                fontSize: '15px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                background: msg.role === 'user' ? selectedNPC.color : (selectedNPC.id === 'glitch' ? '#1e293b' : '#fff'),
                color: msg.role === 'user' ? '#fff' : (selectedNPC.id === 'glitch' ? '#fff' : '#1f2937'),
                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.role === 'user' ? '16px' : '4px'
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: selectedNPC.id === 'glitch' ? '#1e293b' : '#fff',
              borderRadius: '16px',
              borderBottomLeftRadius: '4px',
              padding: '12px 16px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                background: '#6b7280',
                borderRadius: '9999px',
                animation: 'bounce 1s infinite'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                background: '#6b7280',
                borderRadius: '9999px',
                animation: 'bounce 1s infinite 0.1s'
              }} />
              <div style={{
                width: '6px',
                height: '6px',
                background: '#6b7280',
                borderRadius: '9999px',
                animation: 'bounce 1s infinite 0.2s'
              }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        background: selectedNPC.id === 'glitch' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(40px)',
        borderTop: selectedNPC.id === 'glitch' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        paddingBottom: '32px'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedNPC.name}...`}
            style={{
              width: '100%',
              background: selectedNPC.id === 'glitch' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              color: selectedNPC.id === 'glitch' ? '#fff' : '#000',
              borderRadius: '9999px',
              padding: '12px 16px',
              paddingRight: '48px',
              outline: 'none',
              border: selectedNPC.id === 'glitch' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              padding: '8px',
              borderRadius: '9999px',
              color: '#fff',
              background: selectedNPC.color,
              border: 'none',
              cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
              opacity: isLoading || !inputText.trim() ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssistantApp
