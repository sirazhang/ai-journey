import React, { useState } from 'react';
import MenuBar from './components/MenuBar';
import Dock from './components/Dock';
import Window from './components/Window';
import ExamApp from './components/ExamApp';
import { EmailApp, GameApp, CalendarApp, BrowserApp, MapsApp } from './components/SystemApps';
import { AppId } from './types';
import { Globe, Map } from 'lucide-react';

const App: React.FC = () => {
  const [openApps, setOpenApps] = useState<AppId[]>(['calendar']); // Open Calendar by default for tasks
  const [activeApp, setActiveApp] = useState<AppId | null>('calendar');

  const toggleApp = (id: AppId) => {
    if (openApps.includes(id)) {
      setActiveApp(id);
    } else {
      setOpenApps([...openApps, id]);
      setActiveApp(id);
    }
  };

  const closeApp = (id: AppId) => {
    setOpenApps(openApps.filter(app => app !== id));
    if (activeApp === id) {
      setActiveApp(openApps.length > 1 ? openApps[openApps.length - 2] : null);
    }
  };

  const getZIndex = (id: AppId) => {
    return activeApp === id ? 50 : 10;
  };

  const DesktopIcon = ({ id, label, icon, colorClass }: { id: AppId, label: string, icon: React.ReactNode, colorClass: string }) => (
    <div className="group flex flex-col items-center space-y-1 cursor-pointer w-20 mb-4" onClick={() => toggleApp(id)}>
        <div className={`w-16 h-16 ${colorClass} rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform ring-1 ring-black/5 relative overflow-hidden`}>
            {icon}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none"></div>
        </div>
        <span className="text-white text-xs font-bold drop-shadow-md shadow-black text-shadow-sm px-2 py-0.5 rounded backdrop-blur-[2px] bg-black/10">{label}</span>
    </div>
  );

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative font-sans text-gray-900 select-none"
      style={{ 
        background: 'linear-gradient(135deg, #866ac6 0%, #9071b5 40%, #392a68 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>

      {/* Desktop Icons Grid */}
      <div className="absolute top-12 right-4 flex flex-col items-end p-4 z-0">
         
         <DesktopIcon 
            id="exam" 
            label="Workbench" 
            colorClass="bg-gradient-to-b from-red-500 to-red-600"
            icon={
                <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-white" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            }
         />

         <DesktopIcon 
            id="browser" 
            label="Safari" 
            colorClass="bg-blue-600"
            icon={<Globe className="w-10 h-10 text-white" />}
         />

         <DesktopIcon 
            id="maps" 
            label="Maps" 
            colorClass="bg-green-500"
            icon={<Map className="w-10 h-10 text-white" />}
         />

      </div>

      <MenuBar />

      {/* Windows Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="relative w-full h-full">
            
            <Window 
                title="Workbench" 
                isOpen={openApps.includes('exam')} 
                onClose={() => closeApp('exam')}
                onFocus={() => setActiveApp('exam')}
                zIndex={getZIndex('exam')}
            >
                <ExamApp />
            </Window>

            <Window 
                title="Safari" 
                isOpen={openApps.includes('browser')} 
                onClose={() => closeApp('browser')}
                onFocus={() => setActiveApp('browser')}
                zIndex={getZIndex('browser')}
                defaultWidth="w-[90%] md:w-[900px]"
            >
                <BrowserApp />
            </Window>

            <Window 
                title="Maps" 
                isOpen={openApps.includes('maps')} 
                onClose={() => closeApp('maps')}
                onFocus={() => setActiveApp('maps')}
                zIndex={getZIndex('maps')}
                defaultWidth="w-[90%] md:w-[900px]"
            >
                <MapsApp />
            </Window>

            <Window 
                title="Mail" 
                isOpen={openApps.includes('email')} 
                onClose={() => closeApp('email')}
                onFocus={() => setActiveApp('email')}
                zIndex={getZIndex('email')}
                defaultWidth="w-[90%] md:w-[900px]"
            >
                <EmailApp />
            </Window>

            <Window 
                title="Game Center" 
                isOpen={openApps.includes('game')} 
                onClose={() => closeApp('game')}
                onFocus={() => setActiveApp('game')}
                zIndex={getZIndex('game')}
                defaultWidth="w-[90%] md:w-[400px]"
                defaultHeight="h-[500px]"
            >
                <GameApp />
            </Window>

            <Window 
                title="Calendar & Tasks" 
                isOpen={openApps.includes('calendar')} 
                onClose={() => closeApp('calendar')}
                onFocus={() => setActiveApp('calendar')}
                zIndex={getZIndex('calendar')}
                defaultWidth="w-[90%] md:w-[900px]"
                defaultHeight="h-[600px]"
            >
                <CalendarApp />
            </Window>

          </div>
      </div>

      <Dock onAppClick={toggleApp} openApps={openApps} />
      
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-popIn {
          animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
        .text-shadow-sm {
            text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
      `}</style>
    </div>
  );
};

export default App;