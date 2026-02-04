import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music as MusicIcon, Heart } from 'lucide-react';

const Music: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const val = (audio.currentTime / audio.duration) * 100;
      setProgress(val || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  return (
    <div className="h-full bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col">
       {/* Softer track: A slower, more ambient sounding track example */}
       <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" preload="auto" />
       
       <div className="pt-6 flex justify-center pb-6">
          <div className="w-12 h-1 bg-stone-600 rounded-full opacity-50"></div>
       </div>

       <div className="flex-1 px-8 flex flex-col items-center justify-center">
          <div className={`w-72 h-72 bg-[#e8ded4] rounded-2xl shadow-2xl mb-10 flex items-center justify-center relative overflow-hidden transition-all duration-1000 ${isPlaying ? 'scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'scale-90 shadow-md'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-stone-300 opacity-60"></div>
              <MusicIcon size={80} className="text-stone-500 opacity-50" />
          </div>

          <div className="w-full mb-8 flex justify-between items-center px-2">
             <div className="text-left">
                <h2 className="text-2xl font-bold text-stone-100 mb-1">Morning Coffee</h2>
                <p className="text-stone-400 text-lg font-medium">Lo-Fi Study Beats</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center">
                 <Heart size={20} className="text-stone-400" />
             </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full space-y-2 mb-12">
              <div className="h-1.5 bg-stone-700 rounded-full overflow-hidden cursor-pointer group" onClick={(e) => {
                  if (audioRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const width = rect.width;
                      const time = (x / width) * audioRef.current.duration;
                      audioRef.current.currentTime = time;
                  }
              }}>
                  <div className="h-full bg-stone-300 relative rounded-full" style={{ width: `${progress}%` }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-stone-100 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
              </div>
              <div className="flex justify-between text-xs text-stone-500 font-semibold tracking-wide">
                  <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
                  <span>{audioRef.current ? formatTime(audioRef.current.duration) : '-:--'}</span>
              </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full max-w-xs px-2">
              <button className="text-stone-400 hover:text-white transition-colors">
                  <SkipBack size={36} fill="currentColor" />
              </button>
              <button 
                onClick={togglePlay}
                className="w-20 h-20 bg-stone-200 rounded-full flex items-center justify-center text-stone-900 hover:scale-105 transition-transform shadow-lg active:scale-95 active:bg-stone-300"
              >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
              </button>
              <button className="text-stone-400 hover:text-white transition-colors">
                  <SkipForward size={36} fill="currentColor" />
              </button>
          </div>
       </div>

       <div className="h-24 flex justify-center items-center pb-6">
           <div className="flex items-center space-x-3 text-stone-500 bg-stone-800/50 px-4 py-2 rounded-full">
               <Volume2 size={16} />
               <span className="text-xs tracking-widest font-semibold">Living Room Speaker</span>
           </div>
       </div>
    </div>
  );
};

const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

export default Music;