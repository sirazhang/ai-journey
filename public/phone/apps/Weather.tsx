import React from 'react';
import { CloudRain, Sun, Cloud, Wind, Droplets } from 'lucide-react';

const Weather: React.FC = () => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-6 overflow-y-auto">
      <div className="flex flex-col items-center mt-12 space-y-1">
        <h2 className="text-3xl font-medium">Cupertino</h2>
        <span className="text-8xl font-thin ml-4">72°</span>
        <span className="text-xl font-medium text-blue-100">Mostly Sunny</span>
        <div className="flex space-x-4 text-lg font-medium">
          <span>H:81°</span>
          <span>L:60°</span>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
          <div className="text-sm font-medium text-blue-100 mb-4 flex items-center border-b border-white/20 pb-2">
             <CloudRain size={16} className="mr-2" /> HOURLY FORECAST
          </div>
          <div className="flex justify-between overflow-x-auto no-scrollbar space-x-6">
            {[
              { time: 'Now', icon: <Sun size={24} />, temp: '72°' },
              { time: '1PM', icon: <Sun size={24} />, temp: '74°' },
              { time: '2PM', icon: <Cloud size={24} />, temp: '75°' },
              { time: '3PM', icon: <Cloud size={24} />, temp: '73°' },
              { time: '4PM', icon: <CloudRain size={24} />, temp: '70°' },
              { time: '5PM', icon: <CloudRain size={24} />, temp: '68°' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2 min-w-[3rem]">
                <span className="text-sm font-medium">{item.time}</span>
                <div className="text-yellow-300">{item.icon}</div>
                <span className="text-lg font-medium">{item.temp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4">
          <div className="text-sm font-medium text-blue-100 mb-2 flex items-center border-b border-white/20 pb-2">
             <Wind size={16} className="mr-2" /> 10-DAY FORECAST
          </div>
          <div className="space-y-4 pt-2">
             {[
               { day: 'Today', icon: <Sun size={20} className="text-yellow-400" />, min: 60, max: 81 },
               { day: 'Tue', icon: <Cloud size={20} className="text-gray-300" />, min: 58, max: 75 },
               { day: 'Wed', icon: <CloudRain size={20} className="text-blue-300" />, min: 55, max: 70 },
               { day: 'Thu', icon: <Sun size={20} className="text-yellow-400" />, min: 57, max: 74 },
               { day: 'Fri', icon: <Sun size={20} className="text-yellow-400" />, min: 62, max: 80 },
             ].map((day, idx) => (
               <div key={idx} className="flex items-center justify-between text-base font-medium">
                 <span className="w-12">{day.day}</span>
                 <span>{day.icon}</span>
                 <div className="flex space-x-4 w-24 justify-end text-blue-50">
                   <span className="opacity-70">{day.min}°</span>
                   <div className="w-20 h-1 bg-white/30 rounded-full mt-2 relative overflow-hidden">
                       <div className="absolute top-0 left-0 h-full bg-yellow-400 w-1/2"></div>
                   </div>
                   <span>{day.max}°</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
             <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between h-32">
                <div className="flex items-center text-blue-100 text-xs font-semibold uppercase"><Sun size={14} className="mr-1"/> UV Index</div>
                <div className="text-3xl font-medium">4 <span className="text-lg">Moderate</span></div>
                <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full"></div>
             </div>
             <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between h-32">
                <div className="flex items-center text-blue-100 text-xs font-semibold uppercase"><Droplets size={14} className="mr-1"/> Humidity</div>
                <div className="text-3xl font-medium">48%</div>
                <div className="text-xs text-blue-50">The dew point is 54° right now.</div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;