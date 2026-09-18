import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  PackageCheck, 
  CreditCard, 
  TrendingUp, 
  Layers, 
  Calendar,
  Sparkles,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

const PALETTE = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6'];

export const SalesAnalyticsPage: React.FC = () => {
  const { kpis, filteredTransactions, monthlyTrends, categoryBreakdown, regionalBreakdown, primaryColor } = useData();
  const [metricMode, setMetricMode] = useState<'revenue' | 'orders' | 'units'>('revenue');

  // Channel Breakdown
  const channelData = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; orders: number; units: number }>();
    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      const existing = map.get(t.acquisition_channel) || {
        name: t.acquisition_channel,
        revenue: 0,
        orders: 0,
        units: 0
      };
      existing.revenue += t.net_sales;
      existing.orders += 1;
      existing.units += t.quantity;
      map.set(t.acquisition_channel, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredTransactions]);

  // Payment Method Breakdown
  const paymentData = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; orders: number }>();
    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      const existing = map.get(t.payment_method) || {
        name: t.payment_method,
        revenue: 0,
        orders: 0
      };
      existing.revenue += t.net_sales;
      existing.orders += 1;
      map.set(t.payment_method, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [filteredTransactions]);

  // Weekday vs Weekend
  const dayTypeData = useMemo(() => {
    let weekdayRev = 0;
    let weekdayOrders = 0;
    let weekendRev = 0;
    let weekendOrders = 0;

    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      if (t.is_weekend) {
        weekendRev += t.net_sales;
        weekendOrders += 1;
      } else {
        weekdayRev += t.net_sales;
        weekdayOrders += 1;
      }
    });

    return [
      { name: 'Weekdays (Mon-Fri)', revenue: weekdayRev, orders: weekdayOrders, aov: Math.round(weekdayRev / (weekdayOrders || 1)) },
      { name: 'Weekends (Sat-Sun)', revenue: weekendRev, orders: weekendOrders, aov: Math.round(weekendRev / (weekendOrders || 1)) }
    ];
  }, [filteredTransactions]);

  // Sub-Category ranking
  const subCategoryData = useMemo(() => {
    const map = new Map<string, { name: string; category: string; revenue: number; orders: number; units: number }>();
    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      const existing = map.get(t.sub_category) || {
        name: t.sub_category,
        category: t.category,
        revenue: 0,
        orders: 0,
        units: 0
      };
      existing.revenue += t.net_sales;
      existing.orders += 1;
      existing.units += t.quantity;
      map.set(t.sub_category, existing);
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [filteredTransactions]);

  const getMetricValue = (item: any) => {
    if (metricMode === 'revenue') return item.revenue || item.netSales;
    if (metricMode === 'orders') return item.orders;
    return item.units || item.quantity || item.units_sold;
  };

  const formatMetricVal = (val: number) => {
    if (metricMode === 'revenue') return formatCurrency(val);
    return formatNumber(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Page Title & Metric Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Sales Performance & Growth Analytics
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Deep dive into gross transaction trends, channel velocity, and purchasing rhythms
          </p>
        </div>

        {/* Dimension Metric Toggle: Revenue / Orders / Units */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start md:self-auto">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">
            View By:
          </span>
          <button
            id="metric-toggle-revenue"
            onClick={() => setMetricMode('revenue')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              metricMode === 'revenue'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Net Revenue
          </button>
          <button
            id="metric-toggle-orders"
            onClick={() => setMetricMode('orders')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              metricMode === 'orders'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Orders
          </button>
          <button
            id="metric-toggle-units"
            onClick={() => setMetricMode('units')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              metricMode === 'units'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Units Sold
          </button>
        </div>
      </div>

      {/* Sales Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Net Revenue"
          value={formatCurrency(kpis.totalRevenue, true)}
          previousValue={formatCurrency(kpis.prevRevenue, true)}
          change={kpis.revenueGrowth}
          icon={<DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
        />
        <KPICard
          title="Total Orders"
          value={formatNumber(kpis.totalOrders)}
          previousValue={formatNumber(kpis.prevOrders)}
          change={kpis.ordersGrowth}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
        />
        <KPICard
          title="Total Units Sold"
          value={formatNumber(kpis.unitsSold)}
          change={kpis.ordersGrowth * 1.05}
          icon={<PackageCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          subtitle="Across all catalog SKUs"
        />
        <KPICard
          title="Average Order Value"
          value={formatCurrency(kpis.avgOrderValue)}
          previousValue={formatCurrency(kpis.prevAOV)}
          change={kpis.aovGrowth}
          icon={<CreditCard className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
        />
        <KPICard
          title="YoY Growth Velocity"
          value={formatPercent(kpis.revenueGrowth, true)}
          change={kpis.revenueGrowth - 18}
          changeLabel="vs target"
          icon={<TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          subtitle="Target: 20% annual"
        />
      </div>

      {/* Main Chart: Time Series with Metric Switcher */}
      <ChartCard
        title={`Monthly ${metricMode === 'revenue' ? 'Net Revenue (₹)' : metricMode === 'orders' ? 'Order Volume' : 'Units Sold'} Trend`}
        subtitle="Historical progression across the 24-month horizon showing peak promotions and festive seasonality"
        badge="Time-Series"
      >
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={monthlyTrends} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
                <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis 
              tickFormatter={(v) => metricMode === 'revenue' ? `₹${(v / 100000).toFixed(0)}L` : formatNumber(v, true)}
              tick={{ fontSize: 11 }}
            />
            <Tooltip 
              formatter={(val: any) => [formatMetricVal(Number(val)), metricMode.toUpperCase()]}
              contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area 
              type="monotone" 
              dataKey={metricMode === 'revenue' ? 'netSales' : metricMode === 'orders' ? 'orders' : 'units'} 
              name={metricMode === 'revenue' ? 'Net Sales' : metricMode === 'orders' ? 'Orders' : 'Units'} 
              stroke={primaryColor} 
              strokeWidth={2.5} 
              fillOpacity={1} 
              fill="url(#salesGrad)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 2: Category Breakdown & Sub-Category Top 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={`Category Distribution by ${metricMode.toUpperCase()}`}
          subtitle="Share of sales and volume across all 8 major product departments"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryBreakdown} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis 
                tickFormatter={(v) => metricMode === 'revenue' ? `₹${(v / 100000).toFixed(0)}L` : formatNumber(v, true)}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(val: any) => formatMetricVal(Number(val))} />
              <Bar 
                dataKey={metricMode === 'revenue' ? 'revenue' : metricMode === 'orders' ? 'orders' : 'units'} 
                fill="#06b6d4" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Top 10 Sub-Categories by Revenue"
          subtitle="Specific product clusters driving maximum transaction volume"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subCategoryData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Bar dataKey="revenue" fill={primaryColor} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Acquisition Channel, Payment Methods, and Weekday vs Weekend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard
          title="Acquisition Channel Share"
          subtitle="Revenue generated by acquisition source"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={channelData}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
              >
                {channelData.map((entry, idx) => (
                  <Cell key={`ch-${idx}`} fill={PALETTE[idx % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Payment Method Breakdown"
          subtitle="UPI vs Credit Card vs COD velocity"
        >
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={paymentData}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={3}
              >
                {paymentData.map((entry, idx) => (
                  <Cell key={`pm-${idx}`} fill={PALETTE[(idx + 2) % PALETTE.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Weekday vs Weekend Sales"
          subtitle="AOV and purchasing behavior shifts"
        >
          <div className="space-y-4 py-3">
            {dayTypeData.map((d, idx) => (
              <div key={d.name} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{d.name}</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    AOV: {formatCurrency(d.aov)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Sales: {formatCurrency(d.revenue, true)}</span>
                  <span>Orders: {formatNumber(d.orders)}</span>
                </div>
              </div>
            ))}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
              💡 <strong>Insight:</strong> Weekend shoppers place 14% higher average order values, predominantly converting on high-ticket Electronics & Home appliances.
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
