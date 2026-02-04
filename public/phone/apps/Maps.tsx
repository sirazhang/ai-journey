import React, { useState } from 'react';
import { Search, Navigation, Menu, Info, Car, User, Layers, Zap, Shield, Database, MapPin } from 'lucide-react';

const Maps: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  const startNavigation = () => {
    setShowRoute(true);
    setTimeout(() => setIsNavigating(true), 500);
  };

  const cancelNavigation = () => {
    setIsNavigating(false);
    setShowRoute(false);
    setSearch('');
  };

  return (
    <div className="h-full relative bg-[#1e293b] overflow-hidden flex flex-col font-sans">
        {/* Custom Game World Map Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
             {/* Base Layer: Ocean/Water */}
             <div className="absolute inset-0 bg-[#3b82f6]"></div>

             {/* Region 2: Aether Desert (Top) */}
             <div 
                className="absolute top-0 left-0 w-full h-[45%] bg-[#eab308]" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 70% 80%, 30% 70%, 0 90%)' }}
             >
                <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center opacity-60">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-amber-900 uppercase">Region 2</div>
                    <div className="text-lg font-black text-amber-900 tracking-wide">AETHER DESERT</div>
                </div>
                 {/* Decorative elements */}
                 <div className="absolute top-20 right-20 w-8 h-8 rounded-full bg-amber-400 opacity-50"></div>
                 <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-amber-300 opacity-50"></div>
             </div>

             {/* Region 1: Funga Jungle (Left) */}
             <div 
                className="absolute top-[20%] left-0 w-[45%] h-[60%] bg-[#10b981]" 
                style={{ clipPath: 'polygon(0 0, 80% 20%, 100% 60%, 60% 100%, 0 100%)' }}
             >
                 <div className="absolute top-1/3 left-4 opacity-60">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-900 uppercase">Region 1</div>
                    <div className="text-lg font-black text-emerald-900 tracking-wide leading-tight">FUNGA<br/>JUNGLE</div>
                </div>
                {/* Trees/Spots */}
                <div className="absolute bottom-20 left-10 w-6 h-6 rounded-full bg-emerald-800 opacity-20"></div>
             </div>

             {/* Region 4: Core Glacier (Bottom) */}
             <div 
                className="absolute bottom-0 left-0 w-full h-[35%] bg-[#cffafe]" 
                style={{ clipPath: 'polygon(0 40%, 30% 20%, 60% 30%, 100% 10%, 100% 100%, 0 100%)' }}
             >
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center opacity-70">
                    <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-900 uppercase">Region 4</div>
                    <div className="text-lg font-black text-cyan-900 tracking-wide">CORE GLACIER</div>
                </div>
             </div>

             {/* Region 3: Nexus Island (Right) */}
             <div className="absolute top-[30%] right-[-10%] w-[45%] h-[40%]">
                 <div className="w-full h-full bg-[#84cc16] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] transform rotate-12 flex items-center justify-center shadow-xl">
                    <div className="transform -rotate-12 text-center opacity-70">
                        <div className="text-[10px] font-bold tracking-[0.2em] text-lime-900 uppercase">Region 3</div>
                        <div className="text-lg font-black text-lime-900 tracking-wide">NEXUS<br/>ISLAND</div>
                    </div>
                 </div>
             </div>

             {/* Region 5: Ringed Central City (Center) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 z-10">
                 {/* Outer Ring */}
                 <div className="absolute inset-0 rounded-full border-[6px] border-purple-500/30 animate-spin-slow"></div>
                 <div className="absolute inset-2 rounded-full border-[2px] border-purple-400/50"></div>
                 {/* Core */}
                 <div className="absolute inset-4 bg-gray-900 rounded-full border-2 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.6)] flex items-center justify-center flex-col text-center p-2">
                     <div className="text-[8px] font-bold text-purple-400 tracking-widest uppercase mb-0.5">Region 5</div>
                     <div className="text-[11px] font-bold text-white leading-tight">RINGED<br/>CENTRAL<br/>CITY</div>
                 </div>
             </div>

             {/* Player Location Marker */}
             <div className="absolute top-[48%] left-[48%] z-20">
                <div className="relative">
                    <div className="w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow-lg z-10 relative"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
                </div>
             </div>

             {/* Navigation Route Line */}
             {showRoute && (
                 <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                    <path 
                        d="M 180 390 Q 220 300 280 320" 
                        stroke="#8b5cf6" 
                        strokeWidth="4" 
                        fill="none" 
                        strokeLinecap="round" 
                        strokeDasharray="8"
                        className="animate-pulse"
                    />
                    <circle cx="280" cy="320" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
                 </svg>
             )}
        </div>

        {/* UI Overlay */}
        {!isNavigating ? (
            <>
                <div className="absolute top-12 left-4 right-4 z-10 flex flex-col gap-2">
                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-2xl shadow-lg flex items-center px-4 py-3 border border-white/20">
                        <Menu className="text-gray-500 mr-3" size={20} />
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search Game World..." 
                            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-500 font-medium"
                        />
                        <div className="w-8 h-8 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-gray-500">
                             <User size={16} />
                        </div>
                    </div>
                </div>

                {/* Map Filters / Toggles */}
                <div className="absolute top-32 right-4 z-10 flex flex-col gap-3">
                    <button 
                        className="w-10 h-10 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform text-gray-700 dark:text-gray-200 border border-white/10"
                    >
                        <Layers size={20} />
                    </button>
                    <button 
                        className="w-10 h-10 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform text-gray-700 dark:text-gray-200 border border-white/10"
                    >
                        <Info size={20} />
                    </button>
                </div>

                {/* Bottom Sheet */}
                <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#111] rounded-t-3xl shadow-[0_-5px_30px_rgba(0,0,0,0.3)] p-6 z-20 pb-10 transition-transform duration-300">
                    <div className="w-12 h-1 bg-gray-300 dark:bg-neutral-700 rounded-full mx-auto mb-4"></div>
                    
                    {search ? (
                         <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white text-gray-900">{search}</h2>
                                    <p className="text-gray-500 text-sm font-medium">Unknown Sector</p>
                                </div>
                                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                                    <MapPin size={20} className="text-purple-600 dark:text-purple-400" />
                                </div>
                            </div>
                            <div className="flex gap-3 mb-6">
                                <button 
                                    onClick={startNavigation}
                                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold shadow-md shadow-purple-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                >
                                    <Car size={20} /> Warp
                                </button>
                                <button className="flex-1 bg-gray-100 dark:bg-neutral-800 text-purple-600 dark:text-purple-400 py-3 rounded-xl font-bold active:scale-95 transition-transform">
                                    Scan
                                </button>
                            </div>
                         </div>
                    ) : (
                        <div>
                             <h3 className="text-lg font-bold mb-4 dark:text-white text-gray-900">Points of Interest</h3>
                             <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                                 {[
                                   { name: 'Data Nodes', icon: <Database size={14}/>, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                                   { name: 'Safe Houses', icon: <Shield size={14}/>, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
                                   { name: 'Power Grid', icon: <Zap size={14}/>, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' }
                                 ].map(item => (
                                     <div key={item.name} className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 ${item.color} dark:text-white border border-transparent dark:border-white/5`}>
                                         {item.icon}
                                         {item.name}
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
            </>
        ) : (
            // Navigation Mode
            <div className="flex flex-col h-full relative z-30">
                 <div className="bg-purple-600 p-6 pt-12 text-white shadow-lg z-20 rounded-b-3xl">
                     <div className="flex gap-4 items-center">
                        <div className="bg-white/20 p-2 rounded-lg">
                             <Navigation size={32} className="transform rotate-45 text-white" />
                        </div>
                        <div>
                            <div className="text-sm font-medium opacity-90">Head North-East</div>
                            <div className="text-2xl font-bold mt-0.5">Toward Nexus Island</div>
                        </div>
                     </div>
                 </div>
                 
                 <div className="flex-1"></div>

                 <div className="bg-white dark:bg-[#111] p-6 pb-10 rounded-t-3xl shadow-2xl z-20 m-4 mb-0">
                     <div className="flex justify-between items-center">
                         <div>
                             <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4 min</div>
                             <div className="text-gray-500 text-sm font-medium mt-1">12.5 km • 85% Charge Required</div>
                         </div>
                         <button 
                            onClick={cancelNavigation}
                            className="bg-red-50 dark:bg-red-900/20 text-red-500 px-6 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
                         >
                             Abort
                         </button>
                     </div>
                 </div>
            </div>
        )}
    </div>
  );
};

export default Maps;