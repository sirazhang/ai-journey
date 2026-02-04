import React, { useEffect, useState } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { format } from 'date-fns';

export const StatusBar: React.FC<{ color?: 'white' | 'black' }> = ({ color = 'white' }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`absolute top-0 w-full h-12 flex justify-between items-center px-6 z-50 text-${color} font-medium select-none pointer-events-none`}>
      <div className="w-20 pl-2 text-[15px] font-semibold tracking-wide">
        {format(time, 'h:mm')}
      </div>
      <div className="flex gap-2 items-center pr-2">
        <Signal size={16} fill="currentColor" />
        <Wifi size={16} />
        <Battery size={20} />
      </div>
    </div>
  );
};

export const HomeBar: React.FC<{ onSwipeUp: () => void }> = ({ onSwipeUp }) => {
  return (
    <div 
      className="absolute bottom-0 w-full h-8 flex justify-center items-end pb-2 z-50 cursor-pointer"
      onClick={onSwipeUp}
    >
      <div className="w-32 h-1 bg-white/50 rounded-full hover:bg-white transition-colors shadow-sm" />
    </div>
  );
};

export const Notch: React.FC = () => {
    return (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-3xl z-50 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-4 bg-neutral-900 rounded-full ml-10 flex items-center gap-2 justify-end pr-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
            </div>
        </div>
    )
}
