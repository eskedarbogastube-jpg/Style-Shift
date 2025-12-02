export interface ProcessedImage {
  original: string; // Base64 data URL
  generated: string | null; // Base64 data URL
  mimeType: string;
}

export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface PresetStyle {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}