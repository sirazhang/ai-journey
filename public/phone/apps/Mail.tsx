import React, { useState } from 'react';
import { ChevronLeft, Edit, Star, Archive, Trash2, Reply, MoreHorizontal, ChevronRight, Search } from 'lucide-react';

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  color: string;
}

const EMAILS: Email[] = [
  { 
    id: '1', 
    sender: 'Apple', 
    subject: 'Your receipt from Apple.', 
    preview: 'Receipt for your recent purchase of "Logic Pro"...', 
    body: 'Thank you for your purchase. Here is your receipt for Logic Pro. Total: $199.99.',
    time: '10:42 AM', 
    unread: true,
    color: 'bg-gray-500'
  },
  { 
    id: '2', 
    sender: 'Netflix', 
    subject: 'Coming soon: New Season', 
    preview: 'Get ready for the new season of your favorite show...', 
    body: 'The wait is almost over. Season 4 premieres this Friday only on Netflix.',
    time: 'Yesterday', 
    unread: true,
    color: 'bg-red-600'
  },
  { 
    id: '3', 
    sender: 'Boss', 
    subject: 'Project Update', 
    preview: 'Can we schedule a quick sync up for tomorrow?', 
    body: 'Hi, I reviewed the latest designs. They look great but I have a few notes. Can we meet tomorrow at 10 AM?',
    time: 'Friday', 
    unread: false,
    color: 'bg-blue-600'
  },
  { 
    id: '4', 
    sender: 'LinkedIn', 
    subject: 'You appeared in 5 searches', 
    preview: 'See who is looking at your profile this week.', 
    body: 'You are getting noticed. 5 people searched for you this week. Click to see who they are.',
    time: 'Thursday', 
    unread: false,
    color: 'bg-blue-700'
  }
];

const Mail: React.FC = () => {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  if (selectedEmail) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-black">
        {/* Detail Header */}
        <div className="pt-10 px-4 pb-4 bg-white dark:bg-black flex items-center justify-between border-b border-gray-100 dark:border-neutral-800 sticky top-0 z-10">
           <button onClick={() => setSelectedEmail(null)} className="flex items-center text-blue-500 text-base">
             <ChevronLeft size={24} />
             <span className="">Report</span>
           </button>
           <div className="flex gap-4 text-blue-500">
               <ChevronLeft size={24} className="text-gray-300" />
               <ChevronRight size={24} className="text-gray-300" />
           </div>
        </div>

        {/* Detail Content */}
        <div className="flex-1 overflow-y-auto p-5">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{selectedEmail.subject}</h1>
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full ${selectedEmail.color} flex items-center justify-center text-white text-xs font-bold`}>
                            {selectedEmail.sender[0]}
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{selectedEmail.sender}</div>
                            <div className="text-xs text-gray-500">To: Me</div>
                        </div>
                    </div>
                </div>
                <div className="text-xs text-gray-400">{selectedEmail.time}</div>
            </div>
            
            <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                {selectedEmail.body}
            </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="h-20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between px-6 pb-4">
             <Trash2 className="text-blue-500" size={22} />
             <Archive className="text-blue-500" size={22} />
             <Reply className="text-blue-500" size={22} />
             <Edit className="text-blue-500" size={22} />
        </div>
      </div>
    );
  }

  // Inbox View
  return (
    <div className="h-full bg-white dark:bg-black overflow-y-auto">
      <div className="pt-12 px-4 pb-2 sticky top-0 z-10 bg-white/95 dark:bg-black/95 backdrop-blur-md">
         <div className="flex justify-between items-center mb-2">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Report</h1>
             <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                 <MoreHorizontal size={20} className="text-blue-500" />
             </div>
         </div>
         <div className="relative mb-2">
             <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
             </div>
             <input type="text" placeholder="Search" className="w-full bg-gray-100 dark:bg-neutral-800 rounded-lg py-1.5 pl-8 text-sm focus:outline-none text-gray-900 dark:text-white" />
         </div>
      </div>
      
      <div className="px-4">
         <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Today</div>
         <div className="bg-white dark:bg-black divide-y divide-gray-100 dark:divide-neutral-800">
             {EMAILS.map((email) => (
                <div 
                    key={email.id} 
                    onClick={() => setSelectedEmail(email)}
                    className="py-3 flex gap-3 cursor-pointer active:opacity-70"
                >
                    {email.unread && (
                        <div className="mt-2 w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                    )}
                    <div className={`flex-1 ${!email.unread ? 'pl-3' : ''}`}>
                        <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className={`text-[17px] ${email.unread ? 'font-bold' : 'font-semibold'} text-gray-900 dark:text-white`}>{email.sender}</h3>
                            <span className="text-[14px] text-gray-400">{email.time}</span>
                        </div>
                        <div className="text-[15px] font-medium text-gray-800 dark:text-gray-200 mb-0.5 truncate">{email.subject}</div>
                        <div className="text-[15px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-snug">{email.preview}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 self-center" />
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};

export default Mail;