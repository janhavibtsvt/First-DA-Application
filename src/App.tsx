import React, { useState } from 'react';
import { DataProvider } from './context/DataContext';
import { Sidebar, NavigationTab } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { FilterBar } from './components/common/FilterBar';

// Pages
import { ExecutiveOverviewPage } from './pages/ExecutiveOverviewPage';
import { SalesAnalyticsPage } from './pages/SalesAnalyticsPage';
import { ProfitabilityAnalyticsPage } from './pages/ProfitabilityAnalyticsPage';
import { CustomerAnalyticsPage } from './pages/CustomerAnalyticsPage';
import { ProductAnalyticsPage } from './pages/ProductAnalyticsPage';
import { RegionalAnalyticsPage } from './pages/RegionalAnalyticsPage';
import { ReturnsCancellationsPage } from './pages/ReturnsCancellationsPage';
import { DataExplorerPage } from './pages/DataExplorerPage';
import { BusinessInsightsPage } from './pages/BusinessInsightsPage';
import { AnalystToolkitPage } from './pages/AnalystToolkitPage';
import { SqlAnalysisPage } from './pages/SqlAnalysisPage';
import { PythonEdaPage } from './pages/PythonEdaPage';

const TAB_TITLES: Record<NavigationTab, string> = {
  overview: 'Executive Business Overview',
  sales: 'Sales & Revenue Analytics',
  profitability: 'Profitability & Margin Analysis',
  customers: 'Customer Segmentation (RFM)',
  products: 'Product & SKU Performance',
  regions: 'Geographic & Regional Performance',
  returns: 'Returns & Reverse Logistics',
  explorer: 'Raw Data Explorer (FactSales)',
  insights: 'Business Insights & Action Plan',
  toolkit: 'Data Quality & Modeling Toolkit',
  sql: 'SQL Analysis Portfolio',
  python: 'Python & Exploratory Data Analysis'
};

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <ExecutiveOverviewPage onNavigateToTab={setActiveTab} />;
      case 'sales':
        return <SalesAnalyticsPage />;
      case 'profitability':
        return <ProfitabilityAnalyticsPage />;
      case 'customers':
        return <CustomerAnalyticsPage />;
      case 'products':
        return <ProductAnalyticsPage />;
      case 'regions':
        return <RegionalAnalyticsPage />;
      case 'returns':
        return <ReturnsCancellationsPage />;
      case 'explorer':
        return <DataExplorerPage />;
      case 'insights':
        return <BusinessInsightsPage />;
      case 'toolkit':
        return <AnalystToolkitPage />;
      case 'sql':
        return <SqlAnalysisPage />;
      case 'python':
        return <PythonEdaPage />;
      default:
        return <ExecutiveOverviewPage onNavigateToTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (offset by sidebar width on lg screens) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Global Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          activeTabTitle={TAB_TITLES[activeTab]}
        />

        {/* Inner Content Container */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Global Interactive Filter Slicers Bar */}
          <FilterBar />

          {/* Active View */}
          <div className="animate-in fade-in duration-150">
            {renderActivePage()}
          </div>
        </main>

        {/* Global Professional Portfolio Footer */}
        <footer className="mt-12 border-t border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-6 py-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <strong className="text-slate-800 dark:text-slate-200">ShopSphere Analytics</strong> — E-Commerce Customer & Sales Intelligence
              <p className="text-[11px] text-slate-400 mt-0.5">
                Simulating an enterprise retail data warehouse (10,500 transactions, 24 months, Star-Schema FactSales & 5 Dimensions).
              </p>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>SQL Queries: 12</span>
              <span>•</span>
              <span>Python / SciPy: Included</span>
              <span>•</span>
              <span>RFM Quintiles: 1-5 Scoring</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  );
}
