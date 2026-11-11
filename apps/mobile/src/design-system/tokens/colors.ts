export type ThemeMode = 'light' | 'dark';

export interface SemanticColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  primary: string;
  primaryForeground: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  demo: string;
}

export const palettes: Record<ThemeMode, SemanticColors> = {
  dark: {
    background: '#0B0D10',
    surface: '#14181F',
    surfaceElevated: '#1B2029',
    primary: '#4CC9F0',
    primaryForeground: '#031018',
    foreground: '#F4F7FA',
    muted: '#9AA7B8',
    border: '#2A3140',
    success: '#3DDC97',
    warning: '#F4C95D',
    danger: '#F25F5C',
    demo: '#7A5CFF',
  },
  light: {
    background: '#F5F7FA',
    surface: '#FFFFFF',
    surfaceElevated: '#EEF2F6',
    primary: '#0B6E99',
    primaryForeground: '#FFFFFF',
    foreground: '#101418',
    muted: '#5C6775',
    border: '#D5DCE5',
    success: '#1F9D6A',
    warning: '#C58B1B',
    danger: '#C23B3B',
    demo: '#5B44C9',
  },
};
