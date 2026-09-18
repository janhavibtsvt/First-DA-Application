import React, { useMemo } from 'react';
import { 
  RotateCcw, 
  Ban, 
  AlertTriangle, 
  DollarSign, 
  Percent, 
  Truck, 
  ShieldX,
  CheckCircle2,
  PackageX
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
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

const REASON_COLORS = ['#f43f5e', '#f59e0b', '#8b5cf6', '#06b6d4', '#64748b'];

export const ReturnsCancellationsPage: React.FC = () => {
  const { kpis, filteredTransactions, productPerformance, monthlyTrends } = useData();

  // Returns and cancellations aggregates
  const stats = useMemo(() => {
    let returnedCount = 0;
    let cancelledCount = 0;
    let deliveredCount = 0;
    let returnedGrossLoss = 0;
    let cancelledGrossLoss = 0;

    const returnReasonsMap = new Map<string, number>();
    const categoryReturnsMap = new Map<string, { total: number; returned: number }>();

    filteredTransactions.forEach(t => {
      // Category map tracking
      const catRec = categoryReturnsMap.get(t.category) || { total: 0, returned: 0 };
      catRec.total += 1;

      if (t.order_status === 'Returned') {
        returnedCount += 1;
        returnedGrossLoss += t.net_sales;
        catRec.returned += 1;
        const reason = t.return_reason || 'Other';
        returnReasonsMap.set(reason, (returnReasonsMap.get(reason) || 0) + 1);
      } else if (t.order_status === 'Cancelled') {
        cancelledCount += 1;
        cancelledGrossLoss += t.net_sales;
      } else if (t.order_status === 'Delivered') {
        deliveredCount += 1;
      }

      categoryReturnsMap.set(t.category, catRec);
    });

    const totalOrders = filteredTransactions.length;
    const returnRate = (returnedCount + deliveredCount) > 0 ? (returnedCount / (returnedCount + deliveredCount)) * 100 : 0;
    const cancellationRate = totalOrders > 0 ? (cancelledCount / totalOrders) * 100 : 0;

    // Reverse logistics estimated cost: ₹120 per returned item
    const reverseLogisticsCost = returnedCount * 120;

    // Category returns formatted
    const categoryReturns = Array.from(categoryReturnsMap.entries()).map(([category, data]) => ({
      category,
      returnedOrders: data.returned,
      totalOrders: data.total,
      returnRate: data.total > 0 ? Number(((data.returned / data.total) * 100).toFixed(1)) : 0
    })).sort((a, b) => b.returnRate - a.returnRate);

    // Return reasons formatted
    const returnReasons = Array.from(returnReasonsMap.entries()).map(([name, value]) => ({
      name,
      value
    })).sort((a, b) => b.value - a.value);

    return {
      returnedCount,
      cancelledCount,
      deliveredCount,
      returnedGrossLoss,
      cancelledGrossLoss,
      reverseLogisticsCost,
      returnRate,
      cancellationRate,
      categoryReturns,
      returnReasons
    };
  }, [filteredTransactions]);

  // High return rate SKUs
  const highReturnProducts = useMemo(() => {
    return [...productPerformance]
      .filter(p => p.orders >= 15)
      .sort((a, b) => b.return_rate - a.return_rate)
      .slice(0, 8);
  }, [productPerformance]);

  return (
    <div className="space-y-6">
      {/* Title & Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <RotateCcw className="w-4 h-4" />
          Reverse Logistics & Margin Bleed Diagnostic
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Returns, Cancellations & Reverse Supply Chain Costs
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Evaluating post-purchase dissatisfaction, reverse logistics freight overhead, and category return vulnerabilities
        </p>
      </div>

      {/* Return KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Total Returns"
          value={formatNumber(stats.returnedCount)}
          subtitle="Processed RMAs"
          icon={<RotateCcw className="w-4 h-4 text-rose-500" />}
        />
        <KPICard
          title="Return Rate %"
          value={formatPercent(stats.returnRate)}
          previousValue={formatPercent(kpis.prevReturnRate)}
          change={kpis.returnRateDelta}
          changeLabel="pts vs prior"
          isInverseMetric={true}
          icon={<Percent className="w-4 h-4 text-amber-500" />}
        />
        <KPICard
          title="Gross Lost Sales"
          value={formatCurrency(stats.returnedGrossLoss, true)}
          subtitle="Reversed revenue"
          icon={<DollarSign className="w-4 h-4 text-rose-600" />}
        />
        <KPICard
          title="Reverse Freight Cost"
          value={formatCurrency(stats.reverseLogisticsCost, true)}
          subtitle="₹120 / return penalty"
          icon={<Truck className="w-4 h-4 text-indigo-500" />}
        />
        <KPICard
          title="Cancellation Rate"
          value={formatPercent(stats.cancellationRate)}
          subtitle={`${formatNumber(stats.cancelledCount)} drop-offs`}
          icon={<Ban className="w-4 h-4 text-slate-500" />}
        />
      </div>

      {/* Charts Row 1: Returns by Category & Return Reasons Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Return Rate % by Product Department"
          subtitle="Fashion and Electronics sustain disproportionately high return rates"
          badge="Category Hazard"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.categoryReturns} margin={{ top: 10, right: 20, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
              <YAxis tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `${v}%`} />
              <Bar dataKey="returnRate" name="Return Rate %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Return Reasons Breakdown"
          subtitle="Categorized customer feedback at point of reverse RMA creation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.returnReasons}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                paddingAngle={3}
              >
                {stats.returnReasons.map((entry, idx) => (
                  <Cell key={entry.name} fill={REASON_COLORS[idx % REASON_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: any) => `${formatNumber(Number(v))} orders`} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* High Return Rate SKU Offender Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Repeat Offender SKUs (Highest Return Rates &gt; 15%)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Products with recurring quality, sizing, or fit complaints draining supply chain margin
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            QA Audit Priority
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-right">Net Revenue</th>
                <th className="py-2.5 px-3 text-right">Return Rate %</th>
                <th className="py-2.5 px-3 text-right">Profit Captured</th>
                <th className="py-2.5 px-3 text-center">Impact Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {highReturnProducts.map(p => (
                <tr key={p.product_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{p.product_name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{p.product_id} • {p.sub_category}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                    {formatNumber(p.orders)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(p.revenue)}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
                      {p.return_rate}%
                    </span>
                  </td>
                  <td className={`py-2.5 px-3 text-right font-semibold ${
                    p.profit >= 0 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {formatCurrency(p.profit)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                      {p.return_rate > 22 ? 'Critical Drag' : 'High Concern'}
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
