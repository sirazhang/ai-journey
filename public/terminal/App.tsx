
import React, { useState } from 'react';
import Monitor from './components/Monitor';
import Remote from './components/Remote';
import TransmissionContent from './components/TransmissionContent';
import JudgmentContent from './components/JudgmentContent';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TRANSMISSION);

  const handleNextPhase = () => {
    // Transitioning from Transmission (Video) to Judgment (Statement Card)
    setViewMode(ViewMode.JUDGMENT);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-4 md:p-10 transition-all duration-1000 overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px]"></div>
      </div>

      <div className={`w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 z-10 transition-all duration-700 ${viewMode === ViewMode.JUDGMENT ? 'lg:scale-105' : ''}`}>
        
        {/* The Display Monitor Area */}
        <div className={`transition-all duration-1000 ease-in-out ${viewMode === ViewMode.JUDGMENT ? 'w-full max-w-5xl' : 'flex-1 w-full max-w-4xl'}`}>
          <Monitor>
            {viewMode === ViewMode.TRANSMISSION ? (
              <TransmissionContent />
            ) : (
              <JudgmentContent />
            )}
          </Monitor>
        </div>

        {/* The Handheld Remote Area - Only visible in Transmission Mode */}
        <div className={`flex-shrink-0 lg:mt-20 transition-all duration-500 transform ${
          viewMode === ViewMode.TRANSMISSION 
            ? 'opacity-100 translate-x-0 pointer-events-auto' 
            : 'opacity-0 translate-x-20 pointer-events-none hidden lg:block'
        }`}>
          <Remote 
            onPowerClick={handleNextPhase} 
            isActive={false}
          />
        </div>

      </div>

      {/* Subtle UI Decorations */}
      <div className="fixed top-8 left-8 text-[0.6rem] text-blue-500 font-bold tracking-[0.4em] opacity-30 select-none">
         CHRONOS-OS // TERMINAL_SESSION_ACTIVE
      </div>

      <div className="fixed bottom-4 text-[0.5rem] text-gray-700 uppercase tracking-widest opacity-20">
        Terminal v2.4.0-Stable // Unauthorized Access Prohibited
      </div>

    </div>
  );
};

export default App;
