import React from 'react';
import { LucideIcon } from 'lucide-react';

export enum AppID {
  Calculator = 'calculator',
  Weather = 'weather',
  Photos = 'photos',
  Chat = 'chat',
  Settings = 'settings',
  Mail = 'mail',
  Safari = 'safari',
  Music = 'music',
  Notes = 'notes',
  Maps = 'maps',
  Camera = 'camera'
}

export interface AppConfig {
  id: AppID;
  name: string;
  icon: LucideIcon;
  color: string;
  component?: React.ReactNode;
  badge?: number;
}

export interface SystemState {
  isLocked: boolean;
  activeApp: AppID | null;
  currentTime: Date;
  isControlCenterOpen: boolean;
  batteryLevel: number;
}