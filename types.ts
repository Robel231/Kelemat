export interface Color {
  hex: string;
  name: string;
}

export interface Palette {
  id: string;
  name: string;
  description: string;
  colors: Color[];
  tags: string[];
  likes: number; // Simulation of popularity
}

export enum GenerationTheme {
  RANDOM = 'Random',
  TRENDING = 'Trending',
  UI_DASHBOARD = 'UI Dashboard',
  PASTEL = 'Pastel',
  NEON = 'Neon',
  VINTAGE = 'Vintage',
  DARK_MODE = 'Dark Mode',
  NATURE = 'Nature',
  CORPORATE = 'Corporate',
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'error' | 'info';
}