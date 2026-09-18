import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Award, 
  TrendingUp, 
  Search, 
  ArrowUpDown, 
  ShieldAlert,
  Sparkles,
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
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../utils/formatters';

const SEGMENT_COLORS: Record<string, string> = {
  'Champions': '#10b981',
  'Loyal Customers': '#4f46e5',
  'Potential Loyalist': '#06b6d4',
  'New & Promising': '#f59e0b',
  'At Risk': '#f43f5e',
  'Hibernating': '#64748b'
};

export const CustomerAnalyticsPage: React.FC = () => {
  const { kpis, customerRFM, filteredTransactions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'revenue' | 'orders' | 'recency' | 'profit'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Aggregate RFM Segments distribution
  const rfmClusterSummary = useMemo(() => {
    const map = new Map<string, { name: string; count: number; revenue: number; profit: number }>();
    customerRFM.forEach(c => {
      const seg = c.rfm_segment;
      const existing = map.get(seg) || { name: seg, count: 0, revenue: 0, profit: 0 };
      existing.count += 1;
      existing.revenue += c.total_revenue;
      existing.profit += c.total_profit;
      map.set(seg, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [customerRFM]);

  // CLV Brackets
  const clvDistribution = useMemo(() => {
    const brackets = [
      { range: '< ₹5,000', count: 0, revenue: 0 },
      { range: '₹5k - ₹15k', count: 0, revenue: 0 },
      { range: '₹15k - ₹35k', count: 0, revenue: 0 },
      { range: '₹35k - ₹75k', count: 0, revenue: 0 },
      { range: '₹75k+', count: 0, revenue: 0 }
    ];

    customerRFM.forEach(c => {
      if (c.total_revenue < 5000) {
        brackets[0].count++;
        brackets[0].revenue += c.total_revenue;
      } else if (c.total_revenue < 15000) {
        brackets[1].count++;
        brackets[1].revenue += c.total_revenue;
      } else if (c.total_revenue < 35000) {
        brackets[2].count++;
        brackets[2].revenue += c.total_revenue;
      } else if (c.total_revenue < 75000) {
        brackets[3].count++;
        brackets[3].revenue += c.total_revenue;
      } else {
        brackets[4].count++;
        brackets[4].revenue += c.total_revenue;
      }
    });

    return brackets;
  }, [customerRFM]);

  // Filter & Sort Customer Table
  const filteredCustomers = useMemo(() => {
    return customerRFM
      .filter(c => {
        if (selectedSegmentFilter !== 'all' && c.rfm_segment !== selectedSegmentFilter) return false;
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase();
          return c.customer_name.toLowerCase().includes(q) || c.customer_id.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'revenue') diff = b.total_revenue - a.total_revenue;
        else if (sortBy === 'orders') diff = b.total_orders - a.total_orders;
        else if (sortBy === 'profit') diff = b.total_profit - a.total_profit;
        else if (sortBy === 'recency') diff = a.recency_days - b.recency_days;
        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [customerRFM, selectedSegmentFilter, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const avgCLV = customerRFM.length > 0 ? kpis.totalRevenue / customerRFM.length : 0;
  const newCustomersCount = customerRFM.filter(c => c.total_orders === 1).length;
  const returningCustomersCount = customerRFM.filter(c => c.total_orders > 1).length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          Customer Intelligence & Lifecycle Analysis
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          RFM Segmentation, Retention & Cohort Value
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Quantifying customer value through Recency (days since purchase), Frequency (total orders), and Monetary Value (lifetime spend)
        </p>
      </div>

      {/* Customer KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Total Customers"
          value={formatNumber(customerRFM.length)}
          change={kpis.customersGrowth}
          icon={<Users className="w-4 h-4 text-indigo-500" />}
        />
        <KPICard
          title="New Customers"
          value={formatNumber(newCustomersCount)}
          subtitle="Single-order purchasers"
          icon={<UserPlus className="w-4 h-4 text-blue-500" />}
        />
        <KPICard
          title="Repeat Customers"
          value={formatNumber(returningCustomersCount)}
          change={kpis.retentionRateDelta}
          changeLabel="repeat rate"
          icon={<UserCheck className="w-4 h-4 text-emerald-500" />}
        />
        <KPICard
          title="Repeat Rate"
          value={formatPercent(kpis.retentionRate)}
          change={kpis.retentionRateDelta}
          icon={<TrendingUp className="w-4 h-4 text-teal-500" />}
        />
        <KPICard
          title="Avg Customer Value"
          value={formatCurrency(avgCLV)}
          subtitle="Cumulative net revenue"
          icon={<Award className="w-4 h-4 text-amber-500" />}
        />
        <KPICard
          title="High Value Tier"
          value={formatNumber(customerRFM.filter(c => c.total_revenue > 35000).length)}
          subtitle="Spend > ₹35,000"
          icon={<Sparkles className="w-4 h-4 text-purple-500" />}
        />
      </div>

      {/* RFM Segmentation Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="RFM Customer Clusters"
          subtitle="Proportion of customer database by RFM behavior cluster"
          badge="RFM Mix"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={rfmClusterSummary}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {rfmClusterSummary.map(entry => (
                  <Cell key={entry.name} fill={SEGMENT_COLORS[entry.name] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `${formatNumber(Number(v))} customers`} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue Generated by RFM Cluster"
          subtitle="Demonstrates how Champions and Loyal customers generate the bulk of profits"
          badge="Pareto Effect"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rfmClusterSummary} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="revenue" name="Net Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* CLV Distribution Bracket */}
      <ChartCard
        title="Customer Lifetime Value (CLV) Distribution"
        subtitle="Customer distribution across cumulative lifetime spending tiers"
      >
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={clvDistribution} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="range" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: any, name: any) => name === 'Revenue' ? formatCurrency(Number(v)) : formatNumber(Number(v))} />
            <Bar dataKey="count" name="Customers" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Interactive Customer Drill-Down Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Customer Profiles & RFM Scoring Roster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Granular inspection of individual purchaser velocity, Recency/Frequency/Monetary scores (1-5)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name or ID..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Segment Filter */}
            <select
              value={selectedSegmentFilter}
              onChange={e => { setSelectedSegmentFilter(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="all">All RFM Clusters</option>
              {Object.keys(SEGMENT_COLORS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">RFM Cluster</th>
                <th 
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortBy('orders');
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center gap-1">Orders <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortBy('revenue');
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Revenue <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 text-right">Profit</th>
                <th className="py-2.5 px-3 text-right">AOV</th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => {
                    setSortBy('recency');
                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  <div className="flex items-center justify-end gap-1">Recency <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3 text-center">RFM Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedCustomers.map(c => (
                <tr key={c.customer_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{c.customer_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{c.customer_id}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: SEGMENT_COLORS[c.rfm_segment] || '#64748b' }}
                    >
                      {c.rfm_segment}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                    {c.total_orders}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(c.total_revenue)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(c.total_profit)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {formatCurrency(c.avg_order_value)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400">
                    {c.recency_days}d ago
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-indigo-600 dark:text-indigo-400">
                      {c.rfm_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length}
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
