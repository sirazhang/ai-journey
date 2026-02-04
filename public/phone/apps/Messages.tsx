import React, { useState } from 'react';
import { ChevronLeft, Edit, Video, Phone, ChevronRight } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar: string; // Emoji or initial
  lastMessage: string;
  time: string;
  unread?: boolean;
  history: { text: string; isMe: boolean }[];
}

const CHATS: Chat[] = [
  { 
    id: '1', name: 'Mom', avatar: '👩', lastMessage: 'Don\'t forget dinner at 6!', time: '10:42 AM', unread: true,
    history: [
        { text: 'Hi sweetie, are you coming over today?', isMe: false },
        { text: 'Yes mom, I\'ll be there.', isMe: true },
        { text: 'Don\'t forget dinner at 6!', isMe: false }
    ]
  },
  { 
    id: '2', name: 'Pizza Place', avatar: '🍕', lastMessage: 'Your order is out for delivery.', time: 'Yesterday',
    history: [
        { text: 'Order #2049 confirmed.', isMe: false },
        { text: 'Your order is out for delivery.', isMe: false }
    ]
  },
  { 
    id: '3', name: 'Boss', avatar: 'BB', lastMessage: 'Can you send me the report?', time: 'Friday',
    history: [
        { text: 'Meeting is moved to 3pm.', isMe: false },
        { text: 'Understood.', isMe: true },
        { text: 'Can you send me the report?', isMe: false }
    ]
  },
  { 
    id: '4', name: 'Momo', avatar: '❄️', lastMessage: 'The glacier is beautiful today.', time: 'Friday',
    history: [
        { text: 'Did you see the northern lights?', isMe: true },
        { text: 'Yes! The glacier is beautiful today.', isMe: false }
    ]
  }
];

const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  if (selectedChat) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black">
        <div className="pt-10 px-4 pb-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-10">
           <button onClick={() => setSelectedChat(null)} className="flex items-center text-blue-500 text-lg">
             <ChevronLeft size={28} />
             <span className="font-medium -ml-1">Messages</span>
           </button>
           <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">{selectedChat.avatar}</div>
                <span className="text-xs text-gray-900 dark:text-white font-medium">{selectedChat.name}</span>
           </div>
           <div className="flex gap-4 text-blue-500">
               <Video size={24} />
               <Phone size={22} />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {selectedChat.history.map((msg, i) => (
                <div key={i} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-[17px] leading-snug ${msg.isMe ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-neutral-800 text-black dark:text-white'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-black overflow-y-auto">
      <div className="pt-12 px-4 pb-2 sticky top-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-md flex justify-between items-end">
         <button className="text-blue-500 font-medium text-lg">Edit</button>
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
         <Edit size={24} className="text-blue-500 mb-1" />
      </div>
      
      <div className="mt-2">
         {CHATS.map((chat) => (
            <div 
                key={chat.id} 
                onClick={() => setSelectedChat(chat)}
                className="flex items-center pl-4 active:bg-gray-100 dark:active:bg-neutral-900 cursor-pointer group"
            >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xl text-white shadow-sm flex-shrink-0">
                    {chat.avatar}
                </div>
                <div className="ml-3 flex-1 border-b border-gray-100 dark:border-neutral-800 py-3 pr-4">
                    <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-[17px]">{chat.name}</h3>
                        <span className={`text-[15px] ${chat.unread ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>{chat.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <p className={`text-[15px] truncate flex-1 leading-tight ${chat.unread ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500'}`}>
                            {chat.lastMessage}
                        </p>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Messages;