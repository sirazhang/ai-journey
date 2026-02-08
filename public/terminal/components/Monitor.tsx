
import React from 'react';

interface MonitorProps {
  children: React.ReactNode;
}

const Monitor: React.FC<MonitorProps> = ({ children }) => {
  return (
    <div className="relative">
      {/* Outer Bezel */}
      <div className="w-full max-w-5xl bg-[#1c1c1e] rounded-2xl p-4 shadow-[0_0_60px_rgba(0,0,0,0.8)] border-b-[12px] border-[#131315]">
        {/* Screen Area */}
        <div className="relative w-full aspect-video bg-[#050505] rounded-lg overflow-hidden border-2 border-[#333] scanlines shadow-inner">
          {/* Internal Overlays */}
          <div className="absolute inset-0 pointer-events-none z-10 p-6 flex flex-col justify-between">
            {/* Top info */}
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
                 <span className="text-white text-xs font-bold tracking-widest opacity-80">REC</span>
               </div>
               <div className="flex flex-col items-end">
                 <div className="text-xs text-red-500 font-bold tracking-widest flex items-center gap-1">
                    SYS. ALERT <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                 </div>
                 <div className="bg-black bg-opacity-50 px-3 py-1 mt-2 border border-white border-opacity-20 text-white font-mono text-lg tracking-[0.2em]">
                    02:43:12
                 </div>
               </div>
            </div>

            {/* Bottom info */}
            <div className="flex justify-between items-end">
               <div className="text-[0.6rem] text-orange-400 opacity-60 flex flex-col gap-0.5 leading-tight font-mono">
                 <div>COORD: 45.22.91</div>
                 <div>TEMP: -104°C</div>
                 <div>STATUS: CRITICAL</div>
               </div>
               <div className="text-[0.6rem] text-gray-500 font-bold uppercase tracking-widest">
                 AI-OS SYSTEMS
               </div>
            </div>
          </div>

          {/* Actual Content Wrapper */}
          <div className="relative w-full h-full z-0 crt-flicker">
            {children}
          </div>
        </div>
      </div>
      
      {/* Monitor Stand */}
      <div className="mx-auto w-48 h-12 bg-[#1c1c1e] rounded-b-xl -mt-1 shadow-lg"></div>
    </div>
  );
};

export default Monitor;
