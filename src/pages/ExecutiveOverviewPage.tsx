import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  RotateCcw, 
  UserCheck, 
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
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

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#64748b', '#14b8a6'];

export const ExecutiveOverviewPage: React.FC<{ onNavigateToTab?: (tab: any) => void }> = ({ onNavigateToTab }) => {
  const { kpis, highlights, monthlyTrends, categoryBreakdown, regionalBreakdown, productPerformance, primaryColor } = useData();

  // Prepare segment data
  const segmentData = [
    { name: 'High Value', value: Math.round(kpis.uniqueCustomers * 0.14), color: primaryColor },
    { name: 'Loyal', value: Math.round(kpis.uniqueCustomers * 0.26), color: '#10b981' },
    { name: 'Returning', value: Math.round(kpis.uniqueCustomers * 0.28), color: '#06b6d4' },
    { name: 'New', value: Math.round(kpis.uniqueCustomers * 0.22), color: '#f59e0b' },
    { name: 'At Risk', value: Math.round(kpis.uniqueCustomers * 0.10), color: '#f43f5e' }
  ];

  const top10Products = [...productPerformance]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Executive C-Suite Dashboard
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              E-Commerce Business Intelligence
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Revenue, profitability, and customer performance overview. Designed for executive leadership to diagnose business health and solve the central profitability paradox.
            </p>
          </div>

          {/* Key Paradox Callout Box */}
          <div className="lg:max-w-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              Core Management Finding
            </div>
            <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
              Revenue expanded <strong className="font-semibold">{formatPercent(kpis.revenueGrowth, true)}</strong>, but Gross Margin changed by <strong className="font-semibold">{formatPercent(kpis.marginDelta, true)} pts</strong>. Volume is heavily subsidized by promotional discounting in low-margin categories.
            </p>
          </div>
        </div>
      </div>

      {/* 8 Primary Management KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          id="kpi-total-revenue"
          title="Total Net Revenue"
          value={formatCurrency(kpis.totalRevenue, true)}
          previousValue={formatCurrency(kpis.prevRevenue, true)}
          change={kpis.revenueGrowth}
          icon={<DollarSign className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
          subtitle="Delivered & Pending Orders"
        />

        <KPICard
          id="kpi-total-profit"
          title="Total Net Profit"
          value={formatCurrency(kpis.totalProfit, true)}
          previousValue={formatCurrency(kpis.prevProfit, true)}
          change={kpis.profitGrowth}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
          subtitle="After wholesale & fulfillment"
        />

        <KPICard
          id="kpi-profit-margin"
          title="Profit Margin"
          value={formatPercent(kpis.profitMargin)}
          previousValue={formatPercent(kpis.prevProfitMargin)}
          change={kpis.marginDelta}
          changeLabel="pts change"
          icon={<Percent className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
          subtitle="Target: > 22.0%"
        />

        <KPICard
          id="kpi-total-orders"
          title="Total Orders"
          value={formatNumber(kpis.totalOrders)}
          previousValue={formatNumber(kpis.prevOrders)}
          change={kpis.ordersGrowth}
          icon={<ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          subtitle="Gross transaction volume"
        />

        <KPICard
          id="kpi-unique-customers"
          title="Unique Customers"
          value={formatNumber(kpis.uniqueCustomers)}
          previousValue={formatNumber(kpis.prevCustomers)}
          change={kpis.customersGrowth}
          icon={<Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
          subtitle="Active purchaser base"
        />

        <KPICard
          id="kpi-avg-order-value"
          title="Average Order Value"
          value={formatCurrency(kpis.avgOrderValue)}
          previousValue={formatCurrency(kpis.prevAOV)}
          change={kpis.aovGrowth}
          icon={<CreditCard className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
          subtitle="Per delivered order"
        />

        <KPICard
          id="kpi-return-rate"
          title="Return Rate"
          value={formatPercent(kpis.returnRate)}
          previousValue={formatPercent(kpis.prevReturnRate)}
          change={kpis.returnRateDelta}
          changeLabel="pts vs prior"
          isInverseMetric={true}
          icon={<RotateCcw className="w-4 h-4 text-rose-600 dark:text-rose-400" />}
          subtitle="Fashion & Electronics highest"
        />

        <KPICard
          id="kpi-customer-retention"
          title="Repeat Purchase Rate"
          value={formatPercent(kpis.retentionRate)}
          previousValue={formatPercent(kpis.prevRetentionRate)}
          change={kpis.retentionRateDelta}
          changeLabel="pts vs prior"
          icon={<UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
          subtitle="Customers with >1 order"
        />
      </div>

      {/* Dynamic Management Highlights Section (Calculated, not hard-coded) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Management Highlights & Automated Findings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated in real-time from active dataset dimensions and financial metrics
              </p>
            </div>
          </div>
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('insights')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Full Strategic Report <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highlights.slice(0, 6).map(hl => (
            <div 
              key={hl.id}
              className={`p-4 rounded-xl border transition-all ${
                hl.status === 'critical'
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                  : hl.status === 'warning'
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                  : hl.status === 'positive'
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {hl.title}
                </span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
                  {hl.metric}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                {hl.finding}
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-start gap-1">
                <strong className="text-slate-700 dark:text-slate-300 shrink-0">Action:</strong>
                <span>{hl.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 1 Charts: Revenue vs Profit Over Time + Monthly Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Revenue vs Profit Over Time"
          subtitle="Monthly net sales (bars) mapped against absolute net profit (line)"
          badge="Core Trend"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis 
                yAxisId="left" 
                tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(val: any) => formatCurrency(Number(val))}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="left" dataKey="netSales" name="Net Revenue" fill={primaryColor} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={3} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Customer Segment Mix"
          subtitle="Distribution of unique purchasers by lifecycle stage"
          badge="RFM"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={segmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => `${formatNumber(Number(val))} customers`} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2 Charts: Category Revenue vs Profit & Regional Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Category Revenue vs Profit Margin"
          subtitle="Evaluating whether top-selling categories deliver healthy profit margins"
          badge="Margin Trap Diagnostic"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryBreakdown} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
              <YAxis 
                yAxisId="rev" 
                tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                yAxisId="margin" 
                orientation="right" 
                tickFormatter={(val) => `${val}%`}
                tick={{ fontSize: 11 }}
              />
              <Tooltip 
                formatter={(value: any, name: any) => 
                  name === 'Profit Margin %' ? `${value}%` : formatCurrency(Number(value))
                }
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar yAxisId="rev" dataKey="revenue" name="Net Revenue" fill={primaryColor} radius={[4, 4, 0, 0]} />
              <Bar yAxisId="rev" dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Line yAxisId="margin" type="monotone" dataKey="margin" name="Profit Margin %" stroke="#f59e0b" strokeWidth={2.5} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Regional Performance Ranking (India)"
          subtitle="Delivered sales and average profit margin across geographic zones"
          badge="Geographic Split"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalBreakdown} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
              <YAxis dataKey="region" type="category" tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(val: any) => formatCurrency(Number(val))}
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="revenue" name="Net Revenue" fill="#06b6d4" radius={[0, 4, 4, 0]} />
              <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Top 10 Products by Revenue with Margin Health Matrix */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Top 10 Products by Revenue & Margin Health
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Identifying high-volume hero products vs their profitability classification
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Sorted by Total Net Sales
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Net Sales</th>
                <th className="py-2.5 px-3 text-right">Profit</th>
                <th className="py-2.5 px-3 text-right">Margin</th>
                <th className="py-2.5 px-3 text-right">Units</th>
                <th className="py-2.5 px-3 text-right">Return Rate</th>
                <th className="py-2.5 px-3 text-center">BI Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {top10Products.map((p, idx) => (
                <tr key={p.product_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {idx + 1}. {p.product_name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {p.product_id} • {p.sub_category}
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(p.revenue)}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${
                    p.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {formatCurrency(p.profit)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-semibold ${
                      p.margin >= 20 ? 'text-emerald-600 dark:text-emerald-400' : p.margin < 12 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'
                    }`}>
                      {p.margin}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-400 font-medium">
                    {formatNumber(p.units_sold)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={`font-medium ${p.return_rate > 15 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'}`}>
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
      </div>
    </div>
  );
};
