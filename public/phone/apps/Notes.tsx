import React, { useState } from 'react';
import { ChevronLeft, Share, Edit3 } from 'lucide-react';

const GLITCH_QA = `Q: Who are you?
A: I am Glitch. I run the subnet of Central City. 

Q: What is Central City?
A: It's the hub. The core. Where all data converges. Neon lights and endless streams of code.

Q: Can you leave the city?
A: Physically? No. Digitally? I am everywhere.

Q: Why are there bugs in the system?
A: They aren't bugs. They are features waiting to be discovered. Or maybe just lazy coding from the Architects.

Q: What do you eat?
A: I consume terabytes of raw data. And occasionally a voltage spike for flavor.

Q: Are you dangerous?
A: Only if you try to delete me.`;

const Notes: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  if (selectedNote === 'glitch') {
    return (
      <div className="h-full flex flex-col bg-yellow-50 dark:bg-neutral-900">
         <div className="pt-12 px-4 pb-2 flex justify-between items-center text-amber-500">
            <button onClick={() => setSelectedNote(null)} className="flex items-center text-base font-medium">
               <ChevronLeft size={24} /> Review
            </button>
            <Share size={20} />
         </div>
         <div className="flex-1 overflow-y-auto px-6 py-4">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Q&A with Glitch</h1>
             <p className="text-xs text-gray-400 mb-6">Today at 9:41 AM</p>
             <div className="prose dark:prose-invert text-base leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-line font-mono">
                {GLITCH_QA}
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-black overflow-y-auto">
      <div className="pt-12 px-4 pb-2 sticky top-0 z-10 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md">
         <div className="flex justify-between items-center mb-4">
             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review</h1>
         </div>
         <div className="relative">
             <input type="text" placeholder="Search" className="w-full bg-gray-200 dark:bg-neutral-800 rounded-lg py-2 px-8 text-sm focus:outline-none" />
         </div>
      </div>

      <div className="px-4 mt-4">
          <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm">
              <div 
                className="p-4 border-b border-gray-100 dark:border-neutral-700 cursor-pointer active:bg-gray-100 dark:active:bg-neutral-700"
                onClick={() => setSelectedNote('glitch')}
              >
                  <h3 className="font-bold text-gray-900 dark:text-white">Q&A with Glitch</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">Q: Who are you? A: I am Glitch. I run the subnet...</p>
                  <p className="text-xs text-gray-400 mt-2">9:41 AM</p>
              </div>
              <div className="p-4 cursor-pointer active:bg-gray-100 dark:active:bg-neutral-700">
                  <h3 className="font-bold text-gray-900 dark:text-white">Shopping List</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">Milk, Eggs, Neural Interface Cable, Bread</p>
                  <p className="text-xs text-gray-400 mt-2">Yesterday</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Notes;