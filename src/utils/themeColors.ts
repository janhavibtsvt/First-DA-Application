export type ThemeMode = 'light' | 'dark';

export type ThemeColor = 
  | 'indigo'
  | 'emerald'
  | 'blue'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'teal'
  | 'cyan'
  | 'fuchsia'
  | 'orange'
  | 'slate';

export interface ThemeColorDefinition {
  id: ThemeColor;
  name: string;
  category: 'Classic' | 'Vibrant' | 'Corporate' | 'Earthy';
  tagline: string;
  hex: string;
  primary: string;
  primaryHover: string;
  ringColor: string;
  badgeBg: string;
  badgeText: string;
  previewGradient: string;
}

export const THEME_COLORS: ThemeColorDefinition[] = [
  {
    id: 'indigo',
    name: 'Royal Indigo',
    category: 'Classic',
    tagline: 'Enterprise BI & Deep Analytics (Default)',
    hex: '#4f46e5',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    ringColor: 'ring-indigo-500',
    badgeBg: 'bg-indigo-500',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    previewGradient: 'from-indigo-500 to-indigo-700'
  },
  {
    id: 'emerald',
    name: 'Emerald Growth',
    category: 'Corporate',
    tagline: 'Capital Health, Margins & Positive ROI',
    hex: '#059669',
    primary: '#059669',
    primaryHover: '#047857',
    ringColor: 'ring-emerald-500',
    badgeBg: 'bg-emerald-500',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    previewGradient: 'from-emerald-500 to-teal-700'
  },
  {
    id: 'blue',
    name: 'Ocean Blue',
    category: 'Corporate',
    tagline: 'Enterprise Cloud & Supply Chain Precision',
    hex: '#2563eb',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    ringColor: 'ring-blue-500',
    badgeBg: 'bg-blue-500',
    badgeText: 'text-blue-600 dark:text-blue-400',
    previewGradient: 'from-blue-500 to-indigo-700'
  },
  {
    id: 'violet',
    name: 'Imperial Violet',
    category: 'Classic',
    tagline: 'Executive Leadership & Luxury Retail',
    hex: '#7c3aed',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    ringColor: 'ring-violet-500',
    badgeBg: 'bg-violet-500',
    badgeText: 'text-violet-600 dark:text-violet-400',
    previewGradient: 'from-violet-500 to-purple-800'
  },
  {
    id: 'rose',
    name: 'Crimson Rose',
    category: 'Vibrant',
    tagline: 'Consumer Velocity, Fashion & Flash Sales',
    hex: '#e11d48',
    primary: '#e11d48',
    primaryHover: '#be123c',
    ringColor: 'ring-rose-500',
    badgeBg: 'bg-rose-500',
    badgeText: 'text-rose-600 dark:text-rose-400',
    previewGradient: 'from-rose-500 to-red-700'
  },
  {
    id: 'amber',
    name: 'Golden Amber',
    category: 'Earthy',
    tagline: 'Festive Season, Momentum & Peak GMV',
    hex: '#d97706',
    primary: '#d97706',
    primaryHover: '#b45309',
    ringColor: 'ring-amber-500',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-amber-600 dark:text-amber-400',
    previewGradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'teal',
    name: 'Nordic Teal',
    category: 'Corporate',
    tagline: 'FinTech Balance, Trust & Data Hygiene',
    hex: '#0d9488',
    primary: '#0d9488',
    primaryHover: '#0f766e',
    ringColor: 'ring-teal-500',
    badgeBg: 'bg-teal-500',
    badgeText: 'text-teal-600 dark:text-teal-400',
    previewGradient: 'from-teal-500 to-emerald-700'
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    category: 'Vibrant',
    tagline: 'Real-time Telemetry & High-Tech Observability',
    hex: '#0891b2',
    primary: '#0891b2',
    primaryHover: '#0e7490',
    ringColor: 'ring-cyan-500',
    badgeBg: 'bg-cyan-500',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    previewGradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'fuchsia',
    name: 'Vibrant Fuchsia',
    category: 'Vibrant',
    tagline: 'Direct-to-Consumer & Modern Lifestyle',
    hex: '#c026d3',
    primary: '#c026d3',
    primaryHover: '#a21caf',
    ringColor: 'ring-fuchsia-500',
    badgeBg: 'bg-fuchsia-500',
    badgeText: 'text-fuchsia-600 dark:text-fuchsia-400',
    previewGradient: 'from-fuchsia-500 to-pink-700'
  },
  {
    id: 'orange',
    name: 'Sunset Flame',
    category: 'Earthy',
    tagline: 'Conversion Optimization & Urgency',
    hex: '#ea580c',
    primary: '#ea580c',
    primaryHover: '#c2410c',
    ringColor: 'ring-orange-500',
    badgeBg: 'bg-orange-500',
    badgeText: 'text-orange-600 dark:text-orange-400',
    previewGradient: 'from-orange-500 to-rose-600'
  },
  {
    id: 'slate',
    name: 'Executive Slate',
    category: 'Earthy',
    tagline: 'Monochrome High-Contrast & Focus',
    hex: '#475569',
    primary: '#475569',
    primaryHover: '#334155',
    ringColor: 'ring-slate-500',
    badgeBg: 'bg-slate-500',
    badgeText: 'text-slate-600 dark:text-slate-400',
    previewGradient: 'from-slate-600 to-slate-800'
  }
];

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  mode: ThemeMode;
  color: ThemeColor;
  previewBg: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'executive-dark',
    name: 'Midnight Intelligence',
    description: 'Dark Mode with Royal Indigo',
    mode: 'dark',
    color: 'indigo',
    previewBg: 'bg-slate-900 border-indigo-500/50'
  },
  {
    id: 'growth-light',
    name: 'Capital Growth',
    description: 'Light Mode with Emerald Green',
    mode: 'light',
    color: 'emerald',
    previewBg: 'bg-white border-emerald-500/50'
  },
  {
    id: 'cyber-cyan',
    name: 'Cyber Analytics',
    description: 'Dark Mode with Electric Cyan',
    mode: 'dark',
    color: 'cyan',
    previewBg: 'bg-slate-900 border-cyan-500/50'
  },
  {
    id: 'festive-sunset',
    name: 'Diwali Festive Boost',
    description: 'Light Mode with Golden Amber',
    mode: 'light',
    color: 'amber',
    previewBg: 'bg-white border-amber-500/50'
  },
  {
    id: 'luxury-violet',
    name: 'Imperial Suite',
    description: 'Dark Mode with Violet Accent',
    mode: 'dark',
    color: 'violet',
    previewBg: 'bg-slate-900 border-violet-500/50'
  },
  {
    id: 'monochrome-focus',
    name: 'Executive Minimalist',
    description: 'High-contrast Slate in Dark',
    mode: 'dark',
    color: 'slate',
    previewBg: 'bg-slate-900 border-slate-600'
  }
];

export function getThemeColorDefinition(colorId: ThemeColor): ThemeColorDefinition {
  return THEME_COLORS.find(c => c.id === colorId) || THEME_COLORS[0];
}
