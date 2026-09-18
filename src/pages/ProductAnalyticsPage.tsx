import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  Search, 
  Filter, 
  ArrowUpDown,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export const ProductAnalyticsPage: React.FC = () => {
  const { kpis, productPerformance, categoryBreakdown } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortField, setSortField] = useState<'revenue' | 'profit' | 'margin' | 'units_sold' | 'return_rate'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const top10ByRevenue = useMemo(() => {
    return [...productPerformance].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [productPerformance]);

  const top10ByProfit = useMemo(() => {
    return [...productPerformance].sort((a, b) => b.profit - a.profit).slice(0, 10);
  }, [productPerformance]);

  const bottom10ByProfit = useMemo(() => {
    return [...productPerformance].sort((a, b) => a.profit - b.profit).slice(0, 10);
  }, [productPerformance]);

  const bestProduct = top10ByRevenue[0] || { product_name: 'N/A', revenue: 0 };
  const bestCategory = categoryBreakdown[0] || { category: 'N/A', revenue: 0 };

  // Filter and Sort Table
  const filteredProducts = useMemo(() => {
    return productPerformance
      .filter(p => {
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          return p.product_name.toLowerCase().includes(q) || p.product_id.toLowerCase().includes(q) || p.sub_category.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        let diff = b[sortField] - a[sortField];
        return sortDirection === 'desc' ? diff : -diff;
      });
  }, [productPerformance, selectedCategory, selectedStatus, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Package className="w-4 h-4" />
          Merchandising & Product Catalog Analytics
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          SKU Level Profitability, Volume & Return Velocity
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Evaluating catalog performance across 100+ items, identifying margin traps and reverse logistics drags
        </p>
      </div>

      {/* Product KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active SKUs Sold"
          value={formatNumber(productPerformance.length)}
          subtitle="Across 8 departments"
          icon={<Package className="w-4 h-4 text-indigo-500" />}
        />
        <KPICard
          title="Top Revenue Generator"
          value={bestProduct.product_name}
          subtitle={formatCurrency(bestProduct.revenue)}
          icon={<Award className="w-4 h-4 text-emerald-500" />}
        />
        <KPICard
          title="Top Category"
          value={bestCategory.category}
          subtitle={formatCurrency(bestCategory.revenue)}
          icon={<Layers className="w-4 h-4 text-blue-500" />}
        />
        <KPICard
          title="Average Product Margin"
          value={formatPercent(kpis.profitMargin)}
          change={kpis.marginDelta}
          changeLabel="margin delta"
          icon={<Percent className="w-4 h-4 text-amber-500" />}
        />
      </div>

      {/* Top 10 by Revenue vs Top 10 by Profit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Top 10 Products by Net Revenue"
          subtitle="Hero revenue contributors across the catalog"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={top10ByRevenue} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 10 }} />
              <YAxis dataKey="product_name" type="category" tick={{ fontSize: 9 }} width={120} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Bar dataKey="revenue" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top 10 Products by Absolute Net Profit"
          subtitle="Demonstrating how high-margin items generate true cash flow"
        >
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={top10ByProfit} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
              <YAxis dataKey="product_name" type="category" tick={{ fontSize: 9 }} width={120} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Bar dataKey="profit" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom 10 Products by Profit (Underperformers) */}
      <ChartCard
        title="Bottom 10 Products by Profitability (Margin Erosion Watchlist)"
        subtitle="SKUs yielding either negative or near-zero profit margins due to high returns, markdown discounting, or high COGS"
        badge="Audit Required"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={bottom10ByProfit} margin={{ top: 10, right: 10, left: 10, bottom: 35 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="product_name" tick={{ fontSize: 9 }} angle={-25} textAnchor="end" />
            <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
            <Bar dataKey="profit" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Product Performance Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Product Performance Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive audit across Revenue, Profit, Margin %, Units, Return Rate, and BI Status
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="all">All Categories</option>
              {categoryBreakdown.map(c => (
                <option key={c.category} value={c.category}>{c.category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="all">All Classifications</option>
              <option value="Star Performer">Star Performer</option>
              <option value="Margin Trap">Margin Trap</option>
              <option value="Cash Cow">Cash Cow</option>
              <option value="Problem Child">Problem Child</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortField('revenue');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Revenue <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortField('profit');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Profit <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortField('margin');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Margin % <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortField('units_sold');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Units <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortField('return_rate');
                    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Return % <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 text-center">BI Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedProducts.map(p => (
                <tr key={p.product_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{p.product_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.product_id} • {p.sub_category}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(p.revenue)}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${
                    p.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-semibold ${
                      p.margin >= 25 ? 'text-emerald-600 dark:text-emerald-400' : p.margin < 12 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {p.margin}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {formatNumber(p.units_sold)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-medium ${p.return_rate > 15 ? 'text-rose-600 dark:text-rose-400 font-semibold' : 'text-slate-600 dark:text-slate-400'}`}>
                      {p.return_rate}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Star Performer'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : p.status === 'Cash Cow'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : p.status === 'Margin Trap'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredProducts.length)} of {filteredProducts.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 font-semibold">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
