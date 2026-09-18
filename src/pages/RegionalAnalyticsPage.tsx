import React, { useMemo, useState } from 'react';
import { 
  MapPin, 
  TrendingUp, 
  Building2, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Award,
  Navigation
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
  Cell 
} from 'recharts';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

const REGION_COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6'];

export const RegionalAnalyticsPage: React.FC = () => {
  const { kpis, regionalBreakdown, filteredTransactions } = useData();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // State-level breakdown
  const stateData = useMemo(() => {
    const map = new Map<string, { state: string; region: string; revenue: number; profit: number; orders: number }>();
    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      if (selectedRegion !== 'all' && t.region !== selectedRegion) return false;
      const existing = map.get(t.state) || { state: t.state, region: t.region, revenue: 0, profit: 0, orders: 0 };
      existing.revenue += t.net_sales;
      existing.profit += t.profit;
      existing.orders += 1;
      map.set(t.state, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredTransactions, selectedRegion]);

  // City-level breakdown (Top 15 cities)
  const cityData = useMemo(() => {
    const map = new Map<string, { city: string; state: string; region: string; revenue: number; profit: number; orders: number; aov: number }>();
    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      if (selectedRegion !== 'all' && t.region !== selectedRegion) return false;
      const existing = map.get(t.city) || { city: t.city, state: t.state, region: t.region, revenue: 0, profit: 0, orders: 0, aov: 0 };
      existing.revenue += t.net_sales;
      existing.profit += t.profit;
      existing.orders += 1;
      map.set(t.city, existing);
    });
    return Array.from(map.values()).map(c => ({
      ...c,
      margin: c.revenue > 0 ? Number(((c.profit / c.revenue) * 100).toFixed(1)) : 0,
      aov: c.orders > 0 ? Math.round(c.revenue / c.orders) : 0
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 15);
  }, [filteredTransactions, selectedRegion]);

  const topRegion = regionalBreakdown[0] || { region: 'South', revenue: 0 };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          Geographic & Territorial Performance
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Indian Regional, State & Urban Hub Distribution
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Evaluating revenue contribution, order frequency, logistics turnarounds, and profitability across India&apos;s commercial hubs
        </p>
      </div>

      {/* Regional KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Leading Region"
          value={topRegion.region}
          subtitle={`Delivered: ${formatCurrency(topRegion.revenue)}`}
          icon={<Award className="w-4 h-4 text-emerald-500" />}
        />
        <KPICard
          title="Total Markets Served"
          value="5 Geographic Zones"
          subtitle="20+ Major Urban Hubs"
          icon={<Building2 className="w-4 h-4 text-indigo-500" />}
        />
        <KPICard
          title="National AOV"
          value={formatCurrency(kpis.avgOrderValue)}
          change={kpis.aovGrowth}
          icon={<DollarSign className="w-4 h-4 text-amber-500" />}
        />
        <KPICard
          title="National Return Rate"
          value={formatPercent(kpis.returnRate)}
          change={kpis.returnRateDelta}
          isInverseMetric={true}
          icon={<TrendingUp className="w-4 h-4 text-rose-500" />}
        />
      </div>

      {/* Regional Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Regional Net Revenue vs Absolute Profit"
          subtitle="Comparing top-line sales capture against final operating margins per territory"
          badge="Zone Split"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalBreakdown} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="region" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="revenue" name="Net Revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="State-Level Sales Contribution"
          subtitle="Top contributing Indian states across current filtered data"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stateData.slice(0, 8)} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 10 }} />
              <YAxis dataKey="state" type="category" tick={{ fontSize: 10 }} width={90} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Bar dataKey="revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Urban Hub / City-Level Ranking Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Urban Hub Performance (Top 15 Cities)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranking metropolitan & tier-2 demand density, average order value, and profit margins
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Filter Zone:</span>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            >
              <option value="all">All Zones</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="West">West</option>
              <option value="East">East</option>
              <option value="Central">Central</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">City & State</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Profit</th>
                <th className="py-2.5 px-3 text-right">Margin %</th>
                <th className="py-2.5 px-3 text-right">AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {cityData.map((c, idx) => (
                <tr key={c.city} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {idx + 1}. {c.city}
                    </div>
                    <div className="text-[11px] text-slate-400">{c.state}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {c.region}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300 font-medium">
                    {formatNumber(c.orders)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(c.revenue)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(c.profit)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-semibold ${
                      c.margin >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {c.margin}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400 font-medium">
                    {formatCurrency(c.aov)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
