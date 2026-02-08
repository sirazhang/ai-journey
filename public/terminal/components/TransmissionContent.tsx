
import React from 'react';
import { TRANSMISSION_TEXT } from '../constants';

const TransmissionContent: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {/* Simulated Video Background (Dynamic CSS Gradients/Grain) */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150"></div>
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-black to-red-900 animate-pulse duration-[4000ms]"></div>
      </div>
      
      {/* Video Content Overlay */}
      <div className="absolute inset-0 flex flex-col">
        {/* Video Scopes */}
        <div className="p-4 flex justify-between opacity-50">
           <div className="w-24 h-12 border border-blue-500 flex items-end p-1 gap-1">
              <div className="flex-1 bg-blue-500 animate-[bounce_1s_infinite_0.1s]" style={{height: '40%'}}></div>
              <div className="flex-1 bg-blue-500 animate-[bounce_1s_infinite_0.3s]" style={{height: '80%'}}></div>
              <div className="flex-1 bg-blue-500 animate-[bounce_1s_infinite_0.2s]" style={{height: '60%'}}></div>
           </div>
           <div className="text-[0.5rem] text-blue-400 font-mono text-right">
              FREQ: 142.0 MHz<br/>
              SIG: STABLE
           </div>
        </div>

        {/* Central Message */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-xl w-full bg-[#0a0a0c] bg-opacity-70 border-l-2 border-red-500 p-6 backdrop-blur-sm relative shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <span className="text-[0.6rem] text-red-500 font-bold tracking-[0.3em] uppercase">Emergency Priority</span>
            </div>

            <p className="text-white text-lg md:text-xl leading-relaxed font-sans font-light tracking-wide mb-6">
              {TRANSMISSION_TEXT}
            </p>

            <div className="flex gap-4">
               <div className="flex-1 h-1 bg-gray-800 overflow-hidden">
                  <div className="h-full bg-blue-500 animate-[progress_10s_linear_infinite]"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="p-4 flex justify-center opacity-30">
           <div className="text-[0.5rem] text-white tracking-[0.5em] font-bold">LIVE TRANSMISSION // SECTOR 07</div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default TransmissionContent;
