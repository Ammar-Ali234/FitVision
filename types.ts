
export interface BodyMeasurements {
  height?: number;
  neck?: number;
  shoulders?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  armLength?: number;
  inseam?: number;
  thigh?: number;
  calve?: number;
  wrist?: number;
  ankle?: number;
  unit: 'cm' | 'inch';
}

export interface ClothingItem {
  id: string;
  name: string;
  category: 'Top' | 'Bottom' | 'Dress' | 'Outerwear';
  imageUrl: string;
  description: string;
}

export type AppTab = 'dashboard' | 'measure' | 'try-on' | 'ar' | 'settings';

export interface ScanResult {
  measurements: BodyMeasurements;
  confidence: number;
  timestamp: number;
}
