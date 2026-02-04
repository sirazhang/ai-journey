import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator as CalcIcon, 
  CloudSun, 
  Aperture, 
  MessageCircle, 
  Settings as SettingsIcon, 
  Mail as MailIcon, 
  Compass, 
  Music as MusicIcon,
  Flashlight,
  Camera as CameraIcon,
  StickyNote,
  Map as MapIcon
} from 'lucide-react';
import { format } from 'date-fns';

import { StatusBar, HomeBar, Notch } from './components/SystemUI';
import AppIcon from './components/AppIcon';
import Calculator from './apps/Calculator';
import Weather from './apps/Weather';
import ChatApp from './apps/ChatApp';
import Photos from './apps/Photos';
import Notes from './apps/Notes';
import Music from './apps/Music';
import Settings from './apps/Settings';
import Mail from './apps/Mail';
import Safari from './apps/Safari';
import Maps from './apps/Maps';
import Camera from './apps/Camera';
import { AppID, AppConfig } from './types';

// App Configurations
const APPS: AppConfig[] = [
  { id: AppID.Calculator, name: 'Calculator', icon: CalcIcon, color: 'bg-neutral-800' },
  { id: AppID.Weather, name: 'Weather', icon: CloudSun, color: 'bg-blue-500' },
  { id: AppID.Photos, name: 'Vision Log', icon: Aperture, color: 'bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600' }, 
  // NPC Link: Added badge
  { id: AppID.Chat, name: 'NPC Link', icon: MessageCircle, color: 'bg-green-500', badge: 3 },
  { id: AppID.Settings, name: 'Settings', icon: SettingsIcon, color: 'bg-gray-500' },
  // Report: Added badge
  { id: AppID.Mail, name: 'Report', icon: MailIcon, color: 'bg-yellow-400', badge: 5 },
  { id: AppID.Safari, name: 'Safari', icon: Compass, color: 'bg-blue-400' },
  { id: AppID.Music, name: 'Music', icon: MusicIcon, color: 'bg-red-500' },
  // Review: Changed to Orange
  { id: AppID.Notes, name: 'Review', icon: StickyNote, color: 'bg-orange-500' },
  { id: AppID.Maps, name: 'Maps', icon: MapIcon, color: 'bg-emerald-700' },
  { id: AppID.Camera, name: 'Camera', icon: CameraIcon, color: 'bg-stone-300 text-stone-900' },
];

const DOCK_APPS = [AppID.Photos, AppID.Chat, AppID.Settings, AppID.Mail];

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [activeApp, setActiveApp] = useState<AppID | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (id: AppID) => {
    setActiveApp(id);
  };

  const closeApp = () => {
    setActiveApp(null);
  };

  const renderActiveApp = () => {
    switch (activeApp) {
      case AppID.Calculator: return <Calculator />;
      case AppID.Weather: return <Weather />;
      case AppID.Chat: return <ChatApp />;
      case AppID.Photos: return <Photos />;
      case AppID.Notes: return <Notes />;
      case AppID.Music: return <Music />;
      case AppID.Settings: return <Settings currentWallpaper={wallpaper} onWallpaperChange={setWallpaper} onClose={closeApp} />;
      case AppID.Mail: return <Mail />;
      case AppID.Safari: return <Safari />;
      case AppID.Maps: return <Maps />;
      case AppID.Camera: return <Camera />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white dark:bg-black">
            <h2 className="text-2xl font-bold mb-2">Under Construction</h2>
            <p>This app is not yet implemented in the simulator.</p>
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4 font-sans text-gray-900 antialiased overflow-hidden">
        {/* Phone Frame */}
        <div className="relative w-[375px] h-[812px] bg-black rounded-[50px] shadow-2xl border-[8px] border-neutral-800 overflow-hidden ring-4 ring-neutral-700/50">
            {/* Screen Content */}
            <div className="relative w-full h-full bg-cover bg-center overflow-hidden text-white transition-all duration-700"
                 style={{ backgroundImage: `url(${wallpaper})` }}>
                
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                <StatusBar color={activeApp && activeApp !== AppID.Mail && activeApp !== AppID.Safari && activeApp !== AppID.Maps && activeApp !== AppID.Notes ? (activeApp === AppID.Calculator || activeApp === AppID.Weather || activeApp === AppID.Music || activeApp === AppID.Chat ? 'white' : 'black') : 'white'} />
                <Notch />

                {/* Lock Screen */}
                <AnimatePresence>
                    {isLocked && (
                        <motion.div 
                            initial={{ y: 0 }}
                            exit={{ y: '-100%', opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
                            className="absolute inset-0 z-40 flex flex-col items-center pt-20 backdrop-blur-sm bg-black/10"
                            onClick={() => setIsLocked(false)}
                        >
                            <div className="flex flex-col items-center mt-8">
                                <div className="text-2xl font-medium mb-1">{format(currentTime, 'EEEE, MMMM d')}</div>
                                <div className="text-[5.5rem] font-semibold leading-none tracking-tighter">
                                    {format(currentTime, 'h:mm')}
                                </div>
                            </div>

                            <div className="flex-1" />

                            <div className="flex w-full justify-between px-12 mb-12">
                                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center cursor-pointer active:bg-white/20 transition-colors">
                                    <Flashlight size={24} />
                                </div>
                                <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center cursor-pointer active:bg-white/20 transition-colors">
                                    <CameraIcon size={24} />
                                </div>
                            </div>

                            <div className="mb-4 text-sm font-medium opacity-80 animate-pulse">Swipe up to unlock</div>
                            <div className="w-1/3 h-1 bg-white rounded-full mb-2"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Home Screen */}
                <div className={`absolute inset-0 pt-24 pb-24 px-6 flex flex-col transition-all duration-500 ${isLocked ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                    {/* Grid */}
                    <div className="grid grid-cols-4 gap-x-4 gap-y-8">
                        {APPS.map((app) => (
                            <AppIcon 
                                key={app.id} 
                                name={app.name} 
                                Icon={app.icon} 
                                color={app.color} 
                                onClick={() => openApp(app.id)} 
                                badge={app.badge}
                            />
                        ))}
                    </div>
                    
                    {/* Page Dots */}
                    <div className="flex-1 flex items-end justify-center pb-8 space-x-2">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        <div className="w-2 h-2 rounded-full bg-white/40"></div>
                    </div>

                    {/* Dock */}
                    <div className="absolute bottom-6 left-4 right-4 h-24 bg-white/20 backdrop-blur-xl rounded-[32px] flex items-center justify-around px-4">
                         {DOCK_APPS.map((dockAppId) => {
                             const app = APPS.find(a => a.id === dockAppId);
                             if (!app) return null;
                             return (
                                <AppIcon 
                                    key={app.id} 
                                    name="" 
                                    Icon={app.icon} 
                                    color={app.color} 
                                    onClick={() => openApp(app.id)} 
                                    badge={app.badge}
                                />
                             );
                         })}
                    </div>
                </div>

                {/* Active App View */}
                <AnimatePresence>
                    {activeApp && (
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 100 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 100 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute inset-0 z-30 bg-black overflow-hidden"
                        >
                            {renderActiveApp()}
                            <HomeBar onSwipeUp={closeApp} />
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Global Home Bar for Home Screen */}
                {!activeApp && !isLocked && (
                    <div className="absolute bottom-0 w-full flex justify-center pb-2 z-10">
                       {/* Invisible hit area for home swipe on home screen just for visual consistency */}
                       <div className="w-32 h-1 bg-white/50 rounded-full" /> 
                    </div>
                )}

            </div>
        </div>
    </div>
  );
}