import React, { useState } from 'react';
import { 
  Download, 
  Sun, 
  Moon, 
  Menu, 
  Filter, 
  RotateCcw,
  Sparkles,
  Calendar,
  Layers,
  Palette
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ThemeCustomizerModal } from './ThemeCustomizerModal';

interface HeaderProps {
  onToggleSidebar: () => void;
  activeTabTitle: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, activeTabTitle }) => {
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    activeFilterCount, 
    filteredTransactions, 
    exportToCSV, 
    theme, 
    themeColor,
    colorDefinition,
    toggleTheme 
  } = useData();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Mobile hamburger + Breadcrumb/Title */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                ShopSphere Analytics
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal">
                {filteredTransactions.length.toLocaleString()} transactions loaded
              </span>
            </div>
            <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeTabTitle}
            </h1>
          </div>
        </div>

        {/* Right: Quick Date Presets, Active Filter Badge, Export, Theme Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Presets */}
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
            <button
              id="date-preset-all-btn"
              onClick={() => updateFilter('datePreset', 'all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filters.datePreset === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All (24M)
            </button>
            <button
              id="date-preset-2025-btn"
              onClick={() => updateFilter('datePreset', '2025')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filters.datePreset === '2025'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              2025
            </button>
            <button
              id="date-preset-2024-btn"
              onClick={() => updateFilter('datePreset', '2024')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filters.datePreset === '2024'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              2024
            </button>
            <button
              id="date-preset-festive-btn"
              onClick={() => updateFilter('datePreset', 'festive')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                filters.datePreset === 'festive'
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Festive Q4
            </button>
          </div>

          {/* Active Filters Reset Indicator */}
          {activeFilterCount > 0 && (
            <button
              id="reset-active-filters-btn"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 transition-colors"
              title="Reset all active filters"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{activeFilterCount} Active</span>
              <RotateCcw className="w-3 h-3 ml-0.5 opacity-70" />
            </button>
          )}

          {/* Export to CSV */}
          <button
            id="export-csv-header-btn"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-xs"
            title="Download current filtered dataset as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {/* Theme & Palette Customizer */}
          <button
            id="open-theme-customizer-btn"
            onClick={() => setIsThemeModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Customize themes, colors, and appearance mode"
          >
            <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span 
              className="w-2.5 h-2.5 rounded-full ring-1 ring-black/10 dark:ring-white/20" 
              style={{ backgroundColor: colorDefinition.hex }} 
            />
            <span className="hidden sm:inline">{colorDefinition.name}</span>
          </button>

          {/* Theme Toggle (Quick Light/Dark) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark/light theme"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Theme Customizer Dialog */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
      />
    </header>
  );
};
