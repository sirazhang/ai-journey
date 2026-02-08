
export enum ViewMode {
  TRANSMISSION = 'TRANSMISSION',
  JUDGMENT = 'JUDGMENT'
}

export interface SystemStatus {
  coord: string;
  temp: string;
  status: string;
  dataIntegrity: number;
}
