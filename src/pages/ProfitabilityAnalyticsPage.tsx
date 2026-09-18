import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  AlertOctagon, 
  Percent, 
  Scale, 
  Receipt,
  HelpCircle,
  Award,
  AlertTriangle
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
  ScatterChart, 
  Scatter, 
  ZAxis, 
  Cell 
} from 'recharts';
import { useData } from '../context/DataContext';
import { KPICard } from '../components/common/KPICard';
import { ChartCard } from '../components/common/ChartCard';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export const ProfitabilityAnalyticsPage: React.FC = () => {
  const { kpis, monthlyTrends, categoryBreakdown, productPerformance, filteredTransactions, primaryColor } = useData();

  // Average profit per order
  const validOrders = filteredTransactions.filter(t => t.order_status !== 'Cancelled').length;
  const avgProfitPerOrder = validOrders > 0 ? kpis.totalProfit / validOrders : 0;

  // Top 5 Profitable and Bottom 5 Loss/Low-profit products
  const sortedByProfit = useMemo(() => {
    return [...productPerformance].sort((a, b) => b.profit - a.profit);
  }, [productPerformance]);

  const topProfitable = sortedByProfit.slice(0, 5);
  const bottomProfitable = sortedByProfit.slice(-5).reverse();

  // Scatter plot data for Quadrant Analysis:
  // X: Revenue, Y: Profit, Z: Orders
  const scatterData = useMemo(() => {
    return productPerformance.map(p => ({
      name: p.product_name,
      category: p.category,
      revenue: p.revenue,
      profit: p.profit,
      orders: p.orders,
      margin: p.margin,
      status: p.status
    }));
  }, [productPerformance]);

  // Discount vs Margin buckets
  const discountVsMarginData = useMemo(() => {
    const buckets = [
      { range: '0% - 10% Discount', min: 0, max: 10, totalNet: 0, totalProfit: 0, count: 0 },
      { range: '11% - 20% Discount', min: 11, max: 20, totalNet: 0, totalProfit: 0, count: 0 },
      { range: '21% - 30% Discount', min: 21, max: 30, totalNet: 0, totalProfit: 0, count: 0 },
      { range: '31%+ Discount (Deep)', min: 31, max: 100, totalNet: 0, totalProfit: 0, count: 0 }
    ];

    filteredTransactions.forEach(t => {
      if (t.order_status === 'Cancelled') return;
      const bucket = buckets.find(b => t.discount_percentage >= b.min && t.discount_percentage <= b.max);
      if (bucket) {
        bucket.totalNet += t.net_sales;
        bucket.totalProfit += t.profit;
        bucket.count += 1;
      }
    });

    return buckets.map(b => ({
      range: b.range,
      revenue: b.totalNet,
      profit: b.totalProfit,
      margin: b.totalNet > 0 ? Number(((b.totalProfit / b.totalNet) * 100).toFixed(1)) : 0,
      orders: b.count
    }));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      {/* Management Theme Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Scale className="w-4 h-4" />
              Strategic Financial Diagnosis
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              &quot;Are We Actually Making Money?&quot;
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Unpacking the critical disconnect between top-line gross revenue expansion and bottom-line net profit capture.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 max-w-md text-xs">
            <div className="font-bold text-white flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              The Data Analyst Takeaway:
            </div>
            <p className="text-slate-200 leading-relaxed">
              <strong>High revenue does NOT guarantee high profitability.</strong> Discount vouchers exceeding 20% erode gross margin to single digits, rendering entire categories operating profit-negative after shipping and packaging overhead.
            </p>
          </div>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard
          title="Gross Sales"
          value={formatCurrency(kpis.totalGrossSales, true)}
          subtitle="Pre-discount sticker value"
          icon={<Receipt className="w-4 h-4 text-slate-500" />}
        />
        <KPICard
          title="Total Discounts"
          value={formatCurrency(kpis.totalDiscount, true)}
          change={kpis.avgDiscountRate}
          changeLabel="avg markdown"
          isInverseMetric={true}
          icon={<Percent className="w-4 h-4 text-rose-500" />}
          subtitle="Direct margin markdown"
        />
        <KPICard
          title="Net Revenue"
          value={formatCurrency(kpis.totalRevenue, true)}
          change={kpis.revenueGrowth}
          icon={<DollarSign className="w-4 h-4 text-indigo-500" />}
          subtitle="After customer discounts"
        />
        <KPICard
          title="Total COGS & Logistics"
          value={formatCurrency(kpis.totalCost, true)}
          subtitle="Supplier cost + 4.5% pick/pack"
          icon={<TrendingDown className="w-4 h-4 text-amber-500" />}
        />
        <KPICard
          title="Net Profit"
          value={formatCurrency(kpis.totalProfit, true)}
          previousValue={formatCurrency(kpis.prevProfit, true)}
          change={kpis.profitGrowth}
          icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
          subtitle="True operating earnings"
        />
        <KPICard
          title="Blended Net Margin"
          value={formatPercent(kpis.profitMargin)}
          previousValue={formatPercent(kpis.prevProfitMargin)}
          change={kpis.marginDelta}
          changeLabel="pts change"
          icon={<Percent className="w-4 h-4 text-cyan-500" />}
          subtitle={`Avg ${formatCurrency(avgProfitPerOrder)} / order`}
        />
      </div>

      {/* Critical 4-Quadrant Scatter Plot */}
      <ChartCard
        title="Product Profitability Matrix (4-Quadrant Scatter Analysis)"
        subtitle="X-Axis: Net Revenue | Y-Axis: Net Profit | Bubble Size: Order Volume. Diagnosing Star Performers vs Margin Traps."
        badge="Quadrant Matrix"
      >
        <div className="mb-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="font-bold text-emerald-800 dark:text-emerald-300">★ Star Performers</span>
            <p className="text-emerald-700 dark:text-emerald-400">High Revenue & High Profit</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
            <span className="font-bold text-amber-800 dark:text-amber-300">⚠️ Margin Traps</span>
            <p className="text-amber-700 dark:text-amber-400">High Revenue, Thin/Low Profit</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60">
            <span className="font-bold text-blue-800 dark:text-blue-300">💎 Cash Cows</span>
            <p className="text-blue-700 dark:text-blue-400">Low Revenue, High Margin</p>
          </div>
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
            <span className="font-bold text-rose-800 dark:text-rose-300">🛑 Problem Children</span>
            <p className="text-rose-700 dark:text-rose-400">Low Revenue, Negative/Low Profit</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="revenue" 
              name="Net Revenue" 
              tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} 
              label={{ value: 'Net Revenue (₹)', position: 'insideBottom', offset: -10, fontSize: 11 }}
            />
            <YAxis 
              type="number" 
              dataKey="profit" 
              name="Net Profit" 
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              label={{ value: 'Net Profit (₹)', angle: -90, position: 'insideLeft', fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="orders" range={[60, 400]} name="Orders" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                      <div className="font-bold text-indigo-300">{data.name}</div>
                      <div>Category: {data.category}</div>
                      <div>Revenue: {formatCurrency(data.revenue)}</div>
                      <div>Profit: {formatCurrency(data.profit)} ({data.margin}%)</div>
                      <div>Orders: {formatNumber(data.orders)}</div>
                      <div className="pt-1 font-semibold text-amber-300">Status: {data.status}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={scatterData}>
              {scatterData.map((entry, index) => {
                let color = '#10b981';
                if (entry.status === 'Margin Trap') color = '#f59e0b';
                else if (entry.status === 'Cash Cow') color = '#3b82f6';
                else if (entry.status === 'Problem Child') color = '#f43f5e';
                return <Cell key={`scatter-${index}`} fill={color} fillOpacity={0.8} />;
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 2: Revenue vs Cost vs Profit Waterfall & Discount % Impact on Margin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue vs Cost vs Profit (Monthly)"
          subtitle="Tracking wholesale COGS escalation against captured gross margin"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="netSales" name="Net Sales" fill={primaryColor} radius={[3, 3, 0, 0]} />
              <Bar dataKey="cost" name="Total Cost" fill="#f43f5e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Discount Intensity vs Profit Margin"
          subtitle="Direct empirical proof: as promotional discount rises, profit margin decays"
          badge="Discount Trap"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={discountVsMarginData} margin={{ top: 10, right: 15, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis 
                yAxisId="rev" 
                tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} 
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                yAxisId="margin" 
                orientation="right" 
                tickFormatter={(v) => `${v}%`} 
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(v: any, name: any) => name === 'Profit Margin' ? `${v}%` : formatCurrency(Number(v))} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="rev" dataKey="revenue" name="Sales Volume" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Line yAxisId="margin" type="monotone" dataKey="margin" name="Profit Margin" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Top Profitable vs Loss-Making / Underperforming Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Top 5 Profit-Generating SKUs
            </h3>
          </div>
          <div className="space-y-2.5">
            {topProfitable.map(p => (
              <div key={p.product_id} className="p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.product_name}</div>
                  <div className="text-[11px] text-slate-500">{p.category} • {formatNumber(p.units_sold)} units</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(p.profit)}
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {p.margin}% margin
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Bottom 5 Underperforming / Low-Margin SKUs
            </h3>
          </div>
          <div className="space-y-2.5">
            {bottomProfitable.map(p => (
              <div key={p.product_id} className="p-3 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.product_name}</div>
                  <div className="text-[11px] text-slate-500">{p.category} • Revenue: {formatCurrency(p.revenue)}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {p.profit >= 0 ? '+' : ''}{formatCurrency(p.profit)}
                  </div>
                  <div className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                    {p.margin}% margin
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
