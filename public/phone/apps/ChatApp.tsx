import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, MapPin } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface NPC {
  id: string;
  name: string;
  location: string;
  color: string;
  textColor: string;
  bgGradient: string;
  backgroundImage: string;
  avatar: string;
  instruction: string;
  initialMessage: string;
}

const NPCS: NPC[] = [
  { 
    id: 'momo', 
    name: 'Momo', 
    location: 'Glacier', 
    color: 'bg-cyan-600', 
    textColor: 'text-cyan-900',
    bgGradient: 'from-cyan-100 to-blue-200',
    backgroundImage: 'https://images.unsplash.com/photo-1478562853135-c3c9e3ef7905?auto=format&fit=crop&q=80',
    avatar: '❄️',
    initialMessage: "Privacy is the last bastion of civilization. You showed respect for 'Alex Chen's' personal data in the last verdict, which is good. But the law allows for no deviation. Stay vigilant. ❄️",
    instruction: "You are Momo, living in the Glacier. You focus on ethics, values, and legal precision. You speak formally and use sophisticated vocabulary. You view privacy as sacred. Even when praising, remain cautious and stern. Focus on the user's ethical tendencies."
  },
  { 
    id: 'sparky', 
    name: 'Sparky', 
    location: 'Island', 
    color: 'bg-orange-500', 
    textColor: 'text-orange-900',
    bgGradient: 'from-orange-100 to-yellow-200',
    backgroundImage: 'https://images.unsplash.com/photo-1596484552993-9c8cb05d15a5?auto=format&fit=crop&q=80',
    avatar: '🏝️',
    initialMessage: "OMG! You actually spotted that the 'Fake Captain' was an AI? 😱 How did you train those eagle eyes? Come play another round with me, if you win I've got a huge gift pack for you! ✨",
    instruction: "You are Sparky, living on a tropical Island. You are extremely high-energy, use lots of emojis (✨, 😱, 🔥), and treat everything like a game. You are very enthusiastic and get incredibly excited when the user identifies AI or solves puzzles correctly. You are a gamer/surfer archetype."
  },
  { 
    id: 'glitch', 
    name: 'Glitch', 
    location: 'Central City', 
    color: 'bg-purple-600', 
    textColor: 'text-purple-100',
    bgGradient: 'from-slate-900 to-purple-900',
    backgroundImage: 'https://images.unsplash.com/photo-1517646577322-2637b3f2c002?auto=format&fit=crop&q=80',
    avatar: '💻',
    initialMessage: "[System Error]... Welcome to my world. I've read your entire 'Error Collection'. Very interesting thought paths. Rebooting reality for you... Are you ready for the ultimate test? 💻",
    instruction: "You are Glitch, an AI construct in Central City. You speak with a cyberpunk/hacker tone. You often act like there are system errors. You are omniscient regarding the user's data and past mistakes. You reference 'reading their error logs'. You are mysterious and slightly intimidating."
  },
  { 
    id: 'moss', 
    name: 'Ranger Moss', 
    location: 'Jungle', 
    color: 'bg-green-600', 
    textColor: 'text-green-900',
    bgGradient: 'from-green-100 to-emerald-300',
    backgroundImage: 'https://images.unsplash.com/photo-1596706978434-2e94711933cc?auto=format&fit=crop&q=80',
    avatar: '🌿',
    initialMessage: "Bro! Look at that logic jungle! You just missed a 'Bias Mushroom' back there, that's a huge taboo in data collection. Don't lose heart, keep your eyes peeled next time! 🌿",
    instruction: "You are Ranger Moss, protector of the Jungle. You act like a supportive 'Big Brother'. You use slang like 'Bro'. You use jungle/nature metaphors to describe data and logic (e.g., 'logic jungle', 'bias mushroom'). Even when the user is wrong, you encourage them warmly and guide them."
  },
  { 
    id: 'alpha', 
    name: 'Alpha', 
    location: 'Desert', 
    color: 'bg-amber-600', 
    textColor: 'text-amber-900',
    bgGradient: 'from-amber-100 to-orange-200',
    backgroundImage: 'https://images.unsplash.com/photo-1545656134-8c46011c2e42?auto=format&fit=crop&q=80',
    avatar: '🌵',
    initialMessage: "Target locked. Label accuracy 85%. Speed is acceptable, but precision needs improvement. In the desert, a wrong label means death. Proceed. 🌵",
    instruction: "You are Alpha, a wanderer in the Desert. You are cold, emotionless, and purely data-driven. You speak in short, clipped sentences. You focus on percentages, accuracy, and efficiency. You do not offer comfort; you offer facts."
  }
];

const ChatApp: React.FC = () => {
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelectNPC = (npc: NPC) => {
    setSelectedNPC(npc);
    setMessages([{ 
      id: 'init', 
      role: 'model', 
      text: npc.initialMessage 
    }]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading || !selectedNPC) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await sendMessageToGemini(userMsg.text, history, selectedNPC.instruction);

    const modelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  // NPC Selection Screen
  if (!selectedNPC) {
    return (
      <div className="h-full bg-gray-50 dark:bg-black flex flex-col overflow-y-auto">
        <div className="pt-14 px-6 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose your Companion</h1>
          <p className="text-gray-500 dark:text-gray-400">Select a character to start chatting.</p>
        </div>
        <div className="px-4 pb-20 space-y-4">
          {NPCS.map(npc => (
            <div 
              key={npc.id}
              onClick={() => handleSelectNPC(npc)}
              className={`p-4 rounded-3xl flex items-center space-x-4 cursor-pointer transform transition-all active:scale-95 bg-gradient-to-r ${npc.bgGradient} relative overflow-hidden`}
            >
              {/* Subtle background image overlay */}
              <img src={npc.backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none" />
              
              <div className="w-16 h-16 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-3xl shadow-sm z-10">
                {npc.avatar}
              </div>
              <div className="flex-1 z-10">
                <h3 className={`text-xl font-bold ${npc.id === 'glitch' ? 'text-white' : 'text-gray-900'}`}>{npc.name}</h3>
                <div className={`flex items-center text-sm font-medium opacity-80 ${npc.id === 'glitch' ? 'text-blue-100' : 'text-gray-800'}`}>
                  <MapPin size={12} className="mr-1" />
                  {npc.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Chat Screen
  return (
    <div className="h-full flex flex-col relative bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 opacity-60"
        style={{ backgroundImage: `url(${selectedNPC.backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />

      {/* Header */}
      <div className={`h-24 pt-10 px-4 bg-white/10 backdrop-blur-md border-b border-white/10 flex items-center sticky top-0 z-10 shadow-sm`}>
        <button onClick={() => setSelectedNPC(null)} className="mr-2 p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="text-white" />
        </button>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg bg-white/20 backdrop-blur-sm border border-white/20`}>
            {selectedNPC.avatar}
        </div>
        <div className="text-white">
          <h1 className="text-lg font-bold leading-none drop-shadow-md">{selectedNPC.name}</h1>
          <span className="text-xs text-white/80 font-medium drop-shadow-md">{selectedNPC.location}</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] shadow-sm backdrop-blur-md ${
                msg.role === 'user'
                  ? `${selectedNPC.color} text-white rounded-br-none`
                  : 'bg-white/90 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white/90 rounded-2xl rounded-bl-none px-4 py-3 flex space-x-1 items-center">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-black/40 backdrop-blur-lg border-t border-white/10 pb-8 z-10">
        <div className="relative flex items-center">
            <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedNPC.name}...`}
            className="w-full bg-white/20 text-white placeholder-white/50 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all border border-white/10"
            />
            <button
            onClick={handleSend}
            disabled={isLoading || !inputText.trim()}
            className={`absolute right-2 p-2 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${selectedNPC.color}`}
            >
            <Send size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;