import React, { useState } from 'react';
import { 
  X, 
  Sun, 
  Moon, 
  Check, 
  Palette, 
  Sparkles, 
  RotateCcw,
  Sliders,
  Eye,
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { 
  THEME_COLORS, 
  THEME_PRESETS, 
  ThemeColor, 
  ThemeMode 
} from '../../utils/themeColors';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { 
    theme, 
    themeColor, 
    colorDefinition, 
    setThemeMode, 
    setThemeColor, 
    applyPreset, 
    resetTheme 
  } = useData();

  const [activeCategory, setActiveCategory] = useState<'All' | 'Classic' | 'Corporate' | 'Vibrant' | 'Earthy'>('All');

  if (!isOpen) return null;

  const filteredColors = activeCategory === 'All' 
    ? THEME_COLORS 
    : THEME_COLORS.filter(c => c.category === activeCategory);

  return (
    <div 
      id="theme-customizer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="theme-customizer-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Customize Theme & Visual Appearance
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personalize light/dark contrast and select your preferred BI brand accent palette.
              </p>
            </div>
          </div>
          <button
            id="close-theme-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">
          {/* Section 1: Appearance Mode */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              1. Base Appearance Mode
            </div>
            <div className="grid grid-cols-2 gap-3">
              {/* Light Mode Button */}
              <button
                id="theme-mode-light-btn"
                onClick={() => setThemeMode('light')}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                  theme === 'light'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  theme === 'light' 
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  <Sun className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</span>
                    {theme === 'light' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    High clarity, paper-clean daylight contrast
                  </p>
                </div>
              </button>

              {/* Dark Mode Button */}
              <button
                id="theme-mode-dark-btn"
                onClick={() => setThemeMode('dark')}
                className={`flex items-center gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                }`}>
                  <Moon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</span>
                    {theme === 'dark' && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Deep slate, low eye-strain OLED-friendly
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Curated Quick Presets */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              2. Curated Analyst Presets
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PRESETS.map(preset => {
                const isSelected = theme === preset.mode && themeColor === preset.color;
                return (
                  <button
                    key={preset.id}
                    id={`theme-preset-${preset.id}`}
                    onClick={() => applyPreset(preset.mode, preset.color)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {preset.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Color Palette Selection */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                3. Accent Brand Colors ({THEME_COLORS.length} Available)
              </div>
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1">
                {(['All', 'Classic', 'Corporate', 'Vibrant', 'Earthy'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                      activeCategory === cat
                        ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredColors.map(color => {
                const isSelected = themeColor === color.id;
                return (
                  <button
                    key={color.id}
                    id={`theme-color-btn-${color.id}`}
                    onClick={() => setThemeColor(color.id)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/50'
                    }`}
                  >
                    {/* Swatch circle */}
                    <div 
                      className="w-7 h-7 rounded-full shadow-xs shrink-0 flex items-center justify-center text-white border-2 border-white dark:border-slate-900"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {color.name}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400 dark:text-slate-500 uppercase">
                          {color.hex}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {color.tagline}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Live UI Preview Component */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                Live UI Component Preview ({colorDefinition.name})
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Mode: {theme.toUpperCase()} | Accent: {themeColor.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Primary button preview */}
              <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 dark:bg-indigo-500 shadow-xs flex items-center gap-1.5 cursor-default">
                <BarChart2 className="w-3.5 h-3.5" />
                Export Model
              </div>

              {/* Secondary pill preview */}
              <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-500" />
                +14.8% YoY Profit
              </div>

              {/* Active nav badge preview */}
              <div className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-100 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
                Active Tab Style
              </div>

              {/* Color swatch dot */}
              <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5 ml-auto">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorDefinition.hex }} />
                <span>Theme Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            id="reset-theme-btn"
            onClick={resetTheme}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default (Indigo / Light)
          </button>

          <button
            id="save-theme-btn"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-xs transition-colors"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
