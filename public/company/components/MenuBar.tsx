import React, { useState, useEffect, useRef } from 'react';
import { Apple, Wifi, Battery, Search, Command } from 'lucide-react';

const MenuBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      weekday: 'short', 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).replace(/,/g, '');
  };

  const menuItems: Record<string, string[]> = {
    'Finder': ['About Finder', 'Preferences...', 'Empty Trash', 'Hide Finder', 'Hide Others', 'Show All'],
    'File': ['New Finder Window', 'New Folder', 'New Smart Folder', 'Burn Folder to Disc', 'Print', 'Close Window'],
    'Edit': ['Undo', 'Redo', 'Cut', 'Copy', 'Paste', 'Select All', 'Show Clipboard'],
    'View': ['As Icons', 'As List', 'As Columns', 'As Gallery', 'Use Stacks', 'Sort By', 'Clean Up', 'Show Sidebar'],
    'Go': ['Back', 'Forward', 'Enclosing Folder', 'Recents', 'Documents', 'Desktop', 'Downloads', 'Home', 'Computer', 'AirDrop', 'Applications'],
    'Window': ['Minimize', 'Zoom', 'Move Window to Left Side of Screen', 'Move Window to Right Side of Screen', 'Cycle Through Windows', 'Bring All to Front'],
    'Help': ['macOS Help', 'See What\'s New in macOS', 'New to Mac? Basics']
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  return (
    <div className="h-8 w-full bg-white/40 backdrop-blur-md flex items-center justify-between px-4 text-gray-900 text-xs font-medium fixed top-0 z-50 shadow-sm select-none border-b border-white/20" ref={menuRef}>
      <div className="flex items-center space-x-4 h-full">
        <div className="h-full flex items-center px-2 hover:bg-white/30 rounded cursor-pointer transition-colors">
            <Apple className="w-4 h-4 fill-current" />
        </div>
        
        {Object.keys(menuItems).map((menu) => (
          <div key={menu} className="relative h-full flex items-center">
            <span 
              className={`px-2 py-1 rounded cursor-pointer transition-colors ${activeMenu === menu ? 'bg-white/50' : 'hover:bg-white/30'}`}
              onClick={() => handleMenuClick(menu)}
            >
              <span className={menu === 'Finder' ? 'font-bold' : ''}>{menu}</span>
            </span>
            
            {activeMenu === menu && (
              <div className="absolute top-8 left-0 w-56 bg-white/90 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl py-1 flex flex-col z-50 animate-fadeIn">
                {menuItems[menu].map((item, idx) => (
                  <div key={idx} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-default text-left truncate transition-colors">
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <Battery className="w-5 h-5 opacity-80" />
        <Wifi className="w-4 h-4 opacity-80" />
        <Search className="w-4 h-4 opacity-80" />
        <Command className="w-4 h-4 opacity-80" />
        <span className="opacity-90">{formatTime(time)}</span>
      </div>
    </div>
  );
};

export default MenuBar;
