import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Share, BookOpen, Copy, RotateCcw } from 'lucide-react';

const Safari: React.FC = () => {
  const [url, setUrl] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsLoading(true);
      setUrl(inputValue);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const loadFavorite = (site: string) => {
    setInputValue(site);
    setUrl(site);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-black text-black dark:text-white">
      {/* Top Bar (Status bar area placeholder handled by system) */}
      <div className="h-12"></div> 

      {/* Browser Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-neutral-900 relative">
        {!url ? (
          // Favorites / New Tab Page
          <div className="p-6 pt-12">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Favorites</h1>
            <div className="grid grid-cols-4 gap-6">
               <div onClick={() => loadFavorite('google.com')} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-50 transition-opacity">
                 <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-blue-500">G</div>
                 <span className="text-xs text-gray-500">Google</span>
               </div>
               <div onClick={() => loadFavorite('apple.com')} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-50 transition-opacity">
                 <div className="w-14 h-14 bg-gray-900 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-white"></div>
                 <span className="text-xs text-gray-500">Apple</span>
               </div>
               <div onClick={() => loadFavorite('bing.com')} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-50 transition-opacity">
                 <div className="w-14 h-14 bg-blue-100 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-blue-700">b</div>
                 <span className="text-xs text-gray-500">Bing</span>
               </div>
               <div onClick={() => loadFavorite('wikipedia.org')} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-50 transition-opacity">
                 <div className="w-14 h-14 bg-gray-100 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-black serif">W</div>
                 <span className="text-xs text-gray-500">Wiki</span>
               </div>
            </div>

            <div className="mt-12 px-2">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Privacy Report</h2>
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="bg-blue-500 p-2 rounded-full text-white"><Search size={20}/></div>
                    <div>
                        <div className="text-sm font-semibold dark:text-white">Trackers Prevented</div>
                        <div className="text-xs text-gray-500">Safari prevented 42 trackers from profiling you.</div>
                    </div>
                </div>
            </div>
          </div>
        ) : (
          // Simulated Web Page
          <div className="w-full h-full bg-white dark:bg-neutral-800">
             {isLoading ? (
                 <div className="flex flex-col items-center justify-center h-full space-y-4">
                     <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                     <div className="text-sm text-gray-500">Loading {url}...</div>
                 </div>
             ) : (
                 <div className="p-4">
                     {/* Mock Google Search Results */}
                     <div className="border-b border-gray-100 dark:border-neutral-700 pb-4 mb-4">
                         <div className="text-blue-600 dark:text-blue-400 text-xl font-medium truncate mb-1 cursor-pointer hover:underline">
                            {inputValue} - Official Site
                         </div>
                         <div className="text-green-700 dark:text-green-500 text-sm mb-1">https://www.{inputValue}/</div>
                         <div className="text-gray-600 dark:text-gray-300 text-sm">
                             This is a simulated search result for <b>{inputValue}</b>. In a real browser, you would see the actual content here.
                         </div>
                     </div>
                     
                     <div className="border-b border-gray-100 dark:border-neutral-700 pb-4 mb-4">
                         <div className="text-blue-600 dark:text-blue-400 text-xl font-medium truncate mb-1 cursor-pointer hover:underline">
                            About {inputValue}
                         </div>
                         <div className="text-green-700 dark:text-green-500 text-sm mb-1">https://www.{inputValue}/about</div>
                         <div className="text-gray-600 dark:text-gray-300 text-sm">
                             Learn more about the history and details of {inputValue}.
                         </div>
                     </div>

                     <div className="border-b border-gray-100 dark:border-neutral-700 pb-4 mb-4">
                         <div className="text-blue-600 dark:text-blue-400 text-xl font-medium truncate mb-1 cursor-pointer hover:underline">
                            Images for {inputValue}
                         </div>
                         <div className="flex gap-2 mt-2 overflow-hidden">
                             <div className="w-24 h-16 bg-gray-200 rounded-md"></div>
                             <div className="w-24 h-16 bg-gray-300 rounded-md"></div>
                             <div className="w-24 h-16 bg-gray-400 rounded-md"></div>
                         </div>
                     </div>
                 </div>
             )}
          </div>
        )}
      </div>

      {/* Bottom Search Bar */}
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-lg border-t border-gray-200 dark:border-neutral-700 pb-6 pt-2 px-4 transition-all duration-300">
         <div className="flex justify-between items-center text-blue-500 mb-2 px-1">
            <ChevronLeft size={24} className={history.length === 0 ? 'text-gray-300' : ''} />
            <ChevronRight size={24} className="text-gray-300" />
            <Share size={24} />
            <BookOpen size={24} />
            <Copy size={24} />
         </div>
         
         <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               {isLoading ? <RotateCcw size={14} className="animate-spin text-gray-500"/> : <Search size={14} className="text-gray-500" />}
            </div>
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={(e) => e.target.select()}
                className="block w-full pl-9 pr-3 py-2.5 bg-gray-100 dark:bg-neutral-700 border-none rounded-xl text-sm text-center focus:text-left focus:bg-white dark:focus:bg-neutral-600 transition-all focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                placeholder="Search or enter website name"
            />
         </div>
      </div>
    </div>
  );
};

export default Safari;