import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface AppIconProps {
  name: string;
  Icon: LucideIcon;
  color: string;
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  badge?: number;
}

const AppIcon: React.FC<AppIconProps> = ({ name, Icon, color, onClick, size = 'md', badge }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-[10px]',
    md: 'w-[60px] h-[60px] rounded-[14px]',
    lg: 'w-20 h-20 rounded-[18px]',
  };

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-pointer group" onClick={onClick}>
      <div className="relative">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className={`${sizeClasses[size]} ${color} flex items-center justify-center text-white shadow-sm relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
          <Icon size={size === 'md' ? 30 : 24} strokeWidth={2} />
        </motion.div>
        
        {/* Notification Badge */}
        {badge && badge > 0 && (
          <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full z-10 shadow-sm px-1">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>
      
      {name && (
        <span className="text-[11px] font-medium text-white tracking-wide drop-shadow-md text-center leading-tight">
          {name}
        </span>
      )}
    </div>
  );
};

export default AppIcon;