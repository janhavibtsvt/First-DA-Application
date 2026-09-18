import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ThemeMode, 
  ThemeColor, 
  ThemeColorDefinition, 
  THEME_COLORS, 
  getThemeColorDefinition 
} from '../utils/themeColors';

const STORAGE_KEY_MODE = 'theme';
const STORAGE_KEY_COLOR = 'theme_color';

export interface UseThemeReturn {
  theme: ThemeMode;
  themeColor: ThemeColor;
  colorDefinition: ThemeColorDefinition;
  primaryColor: string;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setThemeColor: (color: ThemeColor) => void;
  applyPreset: (mode: ThemeMode, color: ThemeColor) => void;
  resetTheme: () => void;
}

/**
 * Enhanced hook to manage and persist theme mode (light/dark) and theme color accent
 * in localStorage with immediate DOM synchronization and cross-tab responsiveness.
 */
export function useTheme(defaultMode: ThemeMode = 'light', defaultColor: ThemeColor = 'indigo'): UseThemeReturn {
  // Theme Mode (light / dark)
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_MODE);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      }
    } catch (e) {
      console.warn('Unable to read theme mode from localStorage:', e);
    }
    return defaultMode;
  });

  // Theme Accent Color (indigo, emerald, blue, rose, etc.)
  const [themeColor, setThemeColorState] = useState<ThemeColor>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COLOR);
      if (stored && THEME_COLORS.some(c => c.id === stored)) {
        return stored as ThemeColor;
      }
    } catch (e) {
      console.warn('Unable to read theme color from localStorage:', e);
    }
    return defaultColor;
  });

  const colorDefinition = useMemo(() => getThemeColorDefinition(themeColor), [themeColor]);

  // Synchronize DOM classes, attributes & CSS custom properties
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark class to both html and body elements
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body?.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body?.classList.remove('dark');
    }

    // Apply data-theme-color attribute to both html and body
    root.setAttribute('data-theme-color', themeColor);
    document.body?.setAttribute('data-theme-color', themeColor);
    root.style.setProperty('--theme-primary', colorDefinition.primary);
    document.body?.style.setProperty('--theme-primary', colorDefinition.primary);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY_MODE, theme);
      localStorage.setItem(STORAGE_KEY_COLOR, themeColor);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage:', e);
    }
  }, [theme, themeColor, colorDefinition]);

  // Synchronize changes across multiple browser tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_MODE && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue);
      }
      if (e.key === STORAGE_KEY_COLOR && e.newValue && THEME_COLORS.some(c => c.id === e.newValue)) {
        setThemeColorState(e.newValue as ThemeColor);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const setThemeColor = useCallback((color: ThemeColor) => {
    setThemeColorState(color);
  }, []);

  const applyPreset = useCallback((mode: ThemeMode, color: ThemeColor) => {
    setThemeState(mode);
    setThemeColorState(color);
  }, []);

  const resetTheme = useCallback(() => {
    setThemeState('light');
    setThemeColorState('indigo');
  }, []);

  return {
    theme,
    themeColor,
    colorDefinition,
    primaryColor: colorDefinition.primary,
    isDark: theme === 'dark',
    setTheme: setThemeMode,
    setThemeMode,
    toggleTheme,
    setThemeColor,
    applyPreset,
    resetTheme
  };
}
