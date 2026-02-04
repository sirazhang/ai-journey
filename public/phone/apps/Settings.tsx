import React from 'react';
import { ChevronRight, Moon, Sun, Wallpaper, Plane, Wifi, Bluetooth, Battery, Bell } from 'lucide-react';

interface SettingsProps {
  currentWallpaper: string;
  onWallpaperChange: (url: string) => void;
  onClose: () => void;
}

const WALLPAPERS = [
  { name: 'Default', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
  { name: 'Sierra', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2564&auto=format&fit=crop' },
  { name: 'Ocean', url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2564&auto=format&fit=crop' },
  { name: 'Midnight', url: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2564&auto=format&fit=crop' },
  { name: 'Dunes', url: 'https://images.unsplash.com/photo-1541187714594-731deadcd16a?q=80&w=2564&auto=format&fit=crop' },
  { name: 'Abstract', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop' },
];

const SettingsItem: React.FC<{ icon: React.ReactNode; color: string; label: string; value?: string; onClick?: () => void; toggle?: boolean }> = ({ icon, color, label, value, onClick, toggle }) => (
  <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 active:bg-gray-100 dark:active:bg-neutral-700 cursor-pointer border-b border-gray-100 dark:border-neutral-700 last:border-0" onClick={onClick}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-md ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      <span className="text-[17px] font-medium text-gray-900 dark:text-white">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-[17px] text-gray-500">{value}</span>}
      {toggle !== undefined ? (
         <div className={`w-12 h-7 rounded-full relative transition-colors ${toggle ? 'bg-green-500' : 'bg-gray-300 dark:bg-neutral-600'}`}>
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${toggle ? 'left-[22px]' : 'left-0.5'}`}></div>
         </div>
      ) : (
        <ChevronRight size={20} className="text-gray-400" />
      )}
    </div>
  </div>
);

const Settings: React.FC<SettingsProps> = ({ currentWallpaper, onWallpaperChange }) => {
  const [airplaneMode, setAirplaneMode] = React.useState(false);

  return (
    <div className="h-full bg-gray-100 dark:bg-black overflow-y-auto">
      <div className="pt-12 px-4 pb-2 sticky top-0 z-10 bg-gray-100/90 dark:bg-black/90 backdrop-blur-md">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
      </div>

      <div className="px-4 space-y-6 pb-20">
        {/* Connectivity */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <SettingsItem 
            icon={<Plane size={18} />} 
            color="bg-orange-500" 
            label="Airplane Mode" 
            toggle={airplaneMode} 
            onClick={() => setAirplaneMode(!airplaneMode)}
          />
          <SettingsItem icon={<Wifi size={18} />} color="bg-blue-500" label="Wi-Fi" value="Starlink" />
          <SettingsItem icon={<Bluetooth size={18} />} color="bg-blue-500" label="Bluetooth" value="On" />
        </div>

        {/* General */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm">
           <SettingsItem icon={<Bell size={18} />} color="bg-red-500" label="Notifications" />
           <SettingsItem icon={<Moon size={18} />} color="bg-indigo-500" label="Focus" />
        </div>

        {/* Wallpaper Picker */}
        <div>
            <div className="pl-2 mb-2 text-xs text-gray-500 uppercase font-semibold">Wallpaper</div>
            <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm p-4">
                <div className="grid grid-cols-3 gap-3">
                    {WALLPAPERS.map((wp) => (
                        <div 
                            key={wp.name} 
                            onClick={() => onWallpaperChange(wp.url)}
                            className={`aspect-[9/16] rounded-lg overflow-hidden relative cursor-pointer border-2 ${currentWallpaper === wp.url ? 'border-blue-500' : 'border-transparent'}`}
                        >
                            <img src={wp.url} alt={wp.name} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center py-1 truncate px-1">
                                {wp.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

         <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm">
           <SettingsItem icon={<Battery size={18} />} color="bg-green-500" label="Battery" />
           <SettingsItem icon={<Wallpaper size={18} />} color="bg-cyan-500" label="Display & Brightness" />
        </div>
      </div>
    </div>
  );
};

export default Settings;