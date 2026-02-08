
import React from 'react';
import { NPC_STATEMENT, QUOTE } from '../constants';

const JudgmentContent: React.FC = () => {
  return (
    <div className="w-full h-full bg-[#0d1117] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Sketch Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full border-2 border-blue-900 grid grid-cols-4 grid-rows-4">
          {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-blue-900 border-opacity-20"></div>)}
        </div>
      </div>

      <div className="max-w-4xl w-full bg-[#161b22] rounded-xl border border-white border-opacity-10 p-6 shadow-2xl relative z-10 overflow-hidden">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-[0.6rem] text-gray-400 uppercase tracking-widest font-bold">
            Case #AI-ART-024 · Style Appropriation Dispute
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Character Preview */}
          <div className="md:col-span-4 flex flex-col items-center group">
            <div className="relative w-full aspect-square bg-[#0d1117] rounded-lg border-2 border-blue-900 border-opacity-30 overflow-hidden flex items-center justify-center">
              {/* This is a visual representation of the fluffy character */}
              <div className="relative w-40 h-40">
                {/* Visual placeholder for the creature in Image 3 */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-24 h-32 bg-white rounded-full relative shadow-inner">
                      <div className="absolute top-[-10px] w-12 h-12 bg-blue-100 rounded-full left-1/2 -translate-x-1/2 border border-blue-200"></div>
                      <div className="absolute top-10 left-6 w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="absolute top-10 right-6 w-2 h-2 bg-blue-600 rounded-full"></div>
                   </div>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-lg cursor-pointer">
                   <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>
            <div className="mt-3 text-[0.5rem] text-gray-500 font-mono text-center tracking-tighter">
              Digital Artist · 1 years of experience · Clean record
            </div>
          </div>

          {/* Statement and Verdict Area */}
          <div className="md:col-span-8 flex flex-col">
            <h2 className="text-white text-lg font-bold tracking-widest mb-4 uppercase">NPC Statement</h2>
            
            <div className="bg-[#0d1117] border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
              <p className="text-gray-300 text-sm leading-relaxed italic">
                <span className="text-blue-400 mr-2 font-bold">&gt;</span>
                {NPC_STATEMENT}
              </p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-blue-400 font-bold text-xs tracking-[0.2em] uppercase">[Verdict Pending]</span>
            </div>

            <div className="text-center mb-8">
               <p className="text-white text-sm md:text-base font-light italic leading-relaxed tracking-wide">
                 {QUOTE}
               </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 bg-green-900 bg-opacity-20 border border-green-500 rounded-lg text-green-400 font-bold uppercase tracking-widest text-xs hover:bg-green-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Approved
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg text-red-400 font-bold uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgmentContent;
