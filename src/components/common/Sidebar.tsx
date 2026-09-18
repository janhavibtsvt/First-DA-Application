import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Package, 
  MapPin, 
  RotateCcw, 
  Table, 
  Lightbulb, 
  Database, 
  FileCode, 
  Wrench,
  ChevronRight,
  HelpCircle,
  BarChart3,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export type NavigationTab = 
  | 'overview'
  | 'sales'
  | 'profitability'
  | 'customers'
  | 'products'
  | 'regions'
  | 'returns'
  | 'explorer'
  | 'insights'
  | 'toolkit'
  | 'sql'
  | 'python';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
  group: 'dashboards' | 'analyst';
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, group: 'dashboards' },
  { id: 'sales', label: 'Sales Analytics', icon: TrendingUp, group: 'dashboards' },
  { id: 'profitability', label: 'Profitability', icon: DollarSign, badge: 'Crucial', group: 'dashboards' },
  { id: 'customers', label: 'Customer Analytics', icon: Users, badge: 'RFM', group: 'dashboards' },
  { id: 'products', label: 'Product Analytics', icon: Package, group: 'dashboards' },
  { id: 'regions', label: 'Regional Analytics', icon: MapPin, group: 'dashboards' },
  { id: 'returns', label: 'Returns & Cancellations', icon: RotateCcw, group: 'dashboards' },
  { id: 'explorer', label: 'Data Explorer', icon: Table, badge: '10.5k', group: 'dashboards' },
  { id: 'insights', label: 'Business Insights', icon: Lightbulb, badge: 'Actionable', group: 'dashboards' },
  // Analyst Section
  { id: 'toolkit', label: 'Analyst Toolkit', icon: Wrench, group: 'analyst' },
  { id: 'sql', label: 'SQL Analysis', icon: Database, badge: '12 Queries', group: 'analyst' },
  { id: 'python', label: 'Python / EDA', icon: FileCode, badge: 'Pandas', group: 'analyst' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const { theme, colorDefinition, toggleTheme } = useData();
  const dashboards = navItems.filter(i => i.group === 'dashboards');
  const analystTools = navItems.filter(i => i.group === 'analyst');

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top brand & close on mobile */}
        <div>
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white shadow-xs font-bold text-lg">
                S
              </div>
              <div>
                <div className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  ShopSphere
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    BI Studio
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Sales & Margin Intelligence
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prompt / Context Callout */}
          <div className="p-3 mx-4 mt-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs">
            <div className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-1 mb-0.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              Core Problem Statement
            </div>
            <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px] leading-relaxed">
              &quot;Our revenue is growing, but are we actually becoming more profitable?&quot;
            </p>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-3 overflow-y-auto max-h-[calc(100vh-280px)] space-y-6">
            <div>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Dashboards & Views
              </div>
              <nav className="space-y-1">
                {dashboards.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-indigo-200/80 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Data Analyst Deliverables
              </div>
              <nav className="space-y-1">
                {analystTools.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => {
                        onSelectTab(item.id);
                        onClose();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Portfolio & Theme Footer */}
        <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-1.5">
            <div>
              <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                E-Commerce BI Studio
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: colorDefinition.hex }} />
                <span>{colorDefinition.name}</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="capitalize">{theme}</span>
              </div>
            </div>
            <button
              id="sidebar-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={`Toggle to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          </div>
          <div className="text-[9px] text-slate-400 dark:text-slate-500">
            Star Schema (FactSales + 5 Dimensions)
          </div>
        </div>
      </aside>
    </>
  );
};
