import React from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  zIndex: number;
  onFocus: () => void;
  children: React.ReactNode;
  defaultWidth?: string;
  defaultHeight?: string;
}

const Window: React.FC<WindowProps> = ({ 
  title, 
  isOpen, 
  onClose, 
  zIndex, 
  onFocus, 
  children,
  defaultWidth = "w-[90%] md:w-[800px]",
  defaultHeight = "h-[80%] md:h-[600px]"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${defaultWidth} ${defaultHeight} bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden animate-popIn ring-1 ring-black/10 pointer-events-auto`}
      style={{
        zIndex: zIndex,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.1)' 
      }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div className="h-9 bg-[#f6f5f5] border-b border-[#d1d1d1] flex items-center justify-between px-4 select-none" onDoubleClick={() => {}}>
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 flex items-center justify-center group border border-[#E0443E]"
          >
             <X className="w-2 h-2 text-red-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-[#FEBC2E] hover:bg-[#FEBC2E]/80 flex items-center justify-center group border border-[#D89E24]">
             <Minus className="w-2 h-2 text-yellow-900 opacity-0 group-hover:opacity-100" />
          </button>
          <button className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80 flex items-center justify-center group border border-[#1AAB29]">
             <Maximize2 className="w-2 h-2 text-green-900 opacity-0 group-hover:opacity-100" />
          </button>
        </div>
        
        <div className="font-semibold text-xs text-gray-500 flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2">
            <span>{title}</span>
        </div>

        <div className="w-14"></div> {/* Spacer */}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white relative">
        {children}
      </div>
    </div>
  );
};

export default Window;