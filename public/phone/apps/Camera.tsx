import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';

const Camera: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    return () => {
      // Cleanup stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="h-full bg-black flex flex-col relative text-white">
      {/* Viewfinder */}
      <div className="flex-1 relative overflow-hidden bg-neutral-900 rounded-b-3xl">
        {hasPermission === false ? (
             <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Camera access denied
             </div>
        ) : (
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
            />
        )}
        
        {/* Overlays */}
        <div className="absolute top-12 left-0 right-0 px-6 flex justify-between items-center z-10">
            <Zap size={24} className="drop-shadow-md" />
            <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium">HDR</div>
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-black flex flex-col justify-end pb-8">
         <div className="flex justify-between items-center px-10 mb-4 text-xs font-medium text-yellow-400 tracking-widest uppercase">
             <span className="opacity-50 text-white">Video</span>
             <span>Photo</span>
             <span className="opacity-50 text-white">Portrait</span>
         </div>
         <div className="flex justify-between items-center px-8">
             <div className="w-12 h-12 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
                 {/* Gallery preview thumbnail mock */}
                 <img src="https://picsum.photos/seed/100/100/100" className="w-full h-full object-cover opacity-70" alt="Gallery" />
             </div>
             
             {/* Shutter */}
             <div className="w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center cursor-pointer active:scale-95 transition-transform">
                 <div className="w-full h-full bg-white rounded-full"></div>
             </div>

             <div className="w-12 h-12 bg-neutral-800/50 rounded-full flex items-center justify-center backdrop-blur-md">
                 <RotateCcw size={24} />
             </div>
         </div>
      </div>
    </div>
  );
};

export default Camera;