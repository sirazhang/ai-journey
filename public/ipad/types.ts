
export enum AppStage {
  START = 'START',
  DRAWING = 'DRAWING',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
  EDITING = 'EDITING'
}

export type ShapeType = 'circle' | 'heart' | 'square' | 'triangle' | 'star';
export type StickerType = 'star' | 'heart' | 'cloud' | 'moon' | 'flower' | 'diamond';

export interface IdeaPrompt {
  shape: ShapeType;
  storyStarter: string;
}

export interface DrawingTool {
  mode: 'brush' | 'sticker';
  color: string;
  size: number;
  sticker?: StickerType;
}
