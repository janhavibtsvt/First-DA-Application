import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  MapPin, 
  Tag, 
  UserCheck, 
  CheckCircle2, 
  Calendar 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Region, ProductCategory, CustomerSegment, OrderStatus } from '../../types';

export const FilterBar: React.FC = () => {
  const { 
    filters, 
    updateFilter, 
    resetFilters, 
    activeFilterCount, 
    filteredTransactions,
    rawTransactions 
  } = useData();

  const regions: Region[] = ['North', 'South', 'West', 'East', 'Central'];
  const categories: ProductCategory[] = [
    'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Grocery', 'Books', 'Accessories'
  ];
  const segments: CustomerSegment[] = ['New', 'Returning', 'Loyal', 'High Value', 'At Risk'];
  const orderStatuses: OrderStatus[] = ['Delivered', 'Returned', 'Cancelled', 'Pending'];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs mb-6 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Interactive Slicers & Filters
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Update all visualizations, KPIs, and calculated data dynamically
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-800 dark:text-slate-200">{filteredTransactions.length.toLocaleString()}</strong> of {rawTransactions.length.toLocaleString()} records
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              id="filterbar-reset-btn"
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Grid of Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
        {/* Search Input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="filter-search-input"
              type="text"
              placeholder="Order, Product, Customer..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Region
          </label>
          <select
            id="filter-region-select"
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Regions (India)</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Product Category
          </label>
          <select
            id="filter-category-select"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Categories (8)</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Customer Segment */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Customer Segment
          </label>
          <select
            id="filter-segment-select"
            value={filters.customerSegment}
            onChange={(e) => updateFilter('customerSegment', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Customer Segments</option>
            {segments.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Order Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Order Status
          </label>
          <select
            id="filter-status-select"
            value={filters.orderStatus}
            onChange={(e) => updateFilter('orderStatus', e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Order Statuses</option>
            {orderStatuses.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Date Preset Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Date Range
          </label>
          <select
            id="filter-datepreset-select"
            value={filters.datePreset}
            onChange={(e) => updateFilter('datePreset', e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Full 24 Months (2024-2025)</option>
            <option value="2025">Calendar Year 2025</option>
            <option value="2024">Calendar Year 2024</option>
            <option value="festive">Q4 Festive Season</option>
          </select>
        </div>
      </div>
    </div>
  );
};
