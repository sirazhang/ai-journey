
export type AppId = 'exam' | 'email' | 'game' | 'calendar' | 'browser' | 'maps';

export interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export type VerificationCategory = 
  | 'COMMON_SENSE' 
  | 'NEWS_CREDIBILITY' 
  | 'PLACE_EXISTENCE' 
  | 'LOCATION_ACCURACY' 
  | 'DISTANCE_REACHABILITY';

export interface FactStatement {
  statement: string;
  isTrue: boolean;
  explanation: string;
  searchHint: string; // Hint on what to search for
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export enum ExamStage {
  INTRO = 'INTRO',
  LOADING_QUESTION = 'LOADING_QUESTION',
  QUESTION = 'QUESTION',
  EVALUATING = 'EVALUATING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

export interface MapResult {
  name: string;
  address: string;
  rating?: string;
  reviews?: string;
  category?: string;
  websiteUri?: string;
  description?: string;
  openStatus?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface RouteInfo {
  origin: string;
  destination: string;
  distance?: string;
  duration?: string;
}

export interface MapSearchResponse {
  places: MapResult[];
  answer: string;
  route?: RouteInfo;
}
