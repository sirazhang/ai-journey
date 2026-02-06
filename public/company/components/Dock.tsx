import React from 'react';
import { AppId } from '../types';
import { Mail, Gamepad2, Calendar, Globe, Map } from 'lucide-react';

interface DockProps {
  onAppClick: (id: AppId) => void;
  openApps: AppId[];
}

const Dock: React.FC<DockProps> = ({ onAppClick, openApps }) => {
  
  const renderIcon = (id: AppId, icon: React.ReactNode, bgClass: string, label: string) => {
    const isOpen = openApps.includes(id);
    return (
      <div className="group relative flex flex-col items-center cursor-pointer" onClick={() => onAppClick(id)}>
        <div className={`w-12 h-12 md:w-14 md:h-14 ${bgClass} rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 group-hover:-translate-y-4 ring-1 ring-white/20 relative overflow-hidden`}>
           {icon}
           {/* Glossy reflection effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none"></div>
        </div>
        {/* Active Dot indicator */}
        <div className={`w-1 h-1 bg-gray-800 rounded-full mt-1 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        
         {/* Tooltip */}
         <div className="absolute -top-12 bg-gray-800/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm pointer-events-none">
          {label}
         </div>
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl flex justify-center">
      <div className="bg-white/20 backdrop-blur-2xl border border-white/30 rounded-3xl px-4 py-2 flex items-end space-x-2 md:space-x-4 shadow-2xl transition-all duration-300">
        
        {/* Exam App (Workbench) */}
        {renderIcon('exam', 
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white stroke-2" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>, 
            'bg-gradient-to-b from-red-500 to-red-600', 'Workbench'
        )}

        {/* Browser */}
        {renderIcon('browser', <Globe className="w-8 h-8 text-white" />, 'bg-blue-600', 'Safari')}

        {/* Maps */}
        {renderIcon('maps', <Map className="w-8 h-8 text-white" />, 'bg-green-500', 'Maps')}

        {/* Email */}
        {renderIcon('email', <Mail className="w-8 h-8 text-white" />, 'bg-blue-400', 'Mail')}

        {/* Calendar */}
        {renderIcon('calendar', <Calendar className="w-8 h-8 text-red-500" />, 'bg-white', 'Calendar')}

        {/* Separator */}
        <div className="w-px h-10 bg-gray-400/30 mx-1"></div>

        {/* Trash */}
         <div className="group relative flex flex-col items-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group-hover:-translate-y-2 border border-white/10">
                 <span className="text-2xl">🗑️</span>
            </div>
             <div className="w-1 h-1 bg-white/50 rounded-full mt-1 opacity-0"></div>
        </div>

      </div>
    </div>
  );
};

export default Dock;