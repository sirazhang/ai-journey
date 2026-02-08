
import React from 'react';

interface RemoteProps {
  onPowerClick: () => void;
  isActive: boolean;
}

const Remote: React.FC<RemoteProps> = ({ onPowerClick, isActive }) => {
  return (
    <div className="relative group">
      {/* Remote Body */}
      <div className="w-48 h-80 bg-[#1a1f2e] rounded-[2.5rem] border-4 border-[#2d3548] shadow-2xl flex flex-col items-center p-6 relative overflow-hidden ring-1 ring-white ring-opacity-5">
        
        <div className="text-[0.6rem] text-blue-400 font-bold tracking-[0.3em] mb-8 opacity-70">CONTROL</div>

        {/* Power / Close Button Area */}
        <div className="flex flex-col items-center gap-2 mb-10">
          <button 
            onClick={onPowerClick}
            aria-label="Power off transmission and proceed"
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner group active:scale-95
              ${isActive 
                ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] border-2 border-red-400' 
                : 'bg-red-900 border-2 border-red-800 opacity-90 hover:opacity-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]'
              }`}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </button>
          <div className="text-[0.5rem] text-red-500 font-bold tracking-widest uppercase animate-pulse">STOP FEED</div>
        </div>

        {/* Static Nav Cluster */}
        <div className="grid grid-cols-3 gap-2 w-full px-2 mb-4 opacity-40">
          <div className="w-10 h-8 bg-[#2d3548] rounded flex items-center justify-center text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
          <div className="w-10 h-8 bg-[#2d3548] rounded flex items-center justify-center text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
          <div className="w-10 h-8 bg-[#2d3548] rounded flex items-center justify-center text-gray-400">
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
        </div>

        {/* Info Screen */}
        <div className="w-full bg-[#131722] rounded-lg p-2 mb-4 border border-[#2d3548] flex flex-col items-center gap-1">
          <div className="w-full h-1 bg-blue-900 rounded-full overflow-hidden">
             <div className="w-2/3 h-full bg-blue-400"></div>
          </div>
          <span className="text-[0.4rem] text-blue-300 font-bold tracking-widest uppercase">Signal Lock</span>
        </div>

        {/* Status Dots */}
        <div className="flex gap-4 mt-auto mb-2 opacity-30">
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Remote;
