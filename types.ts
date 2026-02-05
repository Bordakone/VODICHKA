
export enum ProjectCategory {
  BRANDING = 'BRANDING',
  CREATIVE = 'CREATIVE',
  AI_VIDEO = 'AI_VIDEO',
  COMMERCIAL = 'COMMERCIAL'
}

export interface Project {
  id: string;
  code: string; // e.g., P_001
  client: string;
  title: string;
  category: string; // Changed to string to allow specific inputs like "WILDBERRIES"
  year: string;
  status: string; // New field for "TV 30'", etc.
  target: string; // New field for specific target scan labels
  description: string;
  specs: string[]; // e.g., "4K", "Unreal Engine 5", "Stereo"
  task?: string; // New field for "Задача"
  idea?: string; // New field for "Идея"
  imageUrl: string; // Fallback image if video not available
  previewVideoUrl?: string; // Short video for list item (5-10 sec loop, muted)
  hoverVideoUrl?: string; // Slightly larger/better quality for hover preview
  fullVideoUrl?: string; // Full video for project detail page
  extraVideoUrl?: string; // Additional video for project detail page
  extraVideoText?: string; // Text shown next to the additional video
}

export interface Service {
  id: string;
  code: string; // e.g., SVC_A
  name: string;
  description: string;
  modules: string[];
}

export enum ViewState {
  INDEX = 'INDEX',
  PROJECT_DETAIL = 'PROJECT_DETAIL'
}