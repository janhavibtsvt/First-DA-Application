import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Terminal, 
  Play, 
  Copy, 
  Check, 
  Code2, 
  HelpCircle, 
  Sparkles,
  Table as TableIcon
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

interface QueryItem {
  id: string;
  title: string;
  businessQuestion: string;
  techniques: string[];
  sql: string;
  run: (transactions: any[]) => { columns: string[]; rows: any[][] };
}

export const SqlAnalysisPage: React.FC = () => {
  const { filteredTransactions, rawTransactions } = useData();
  const [selectedQueryId, setSelectedQueryId] = useState<string>('q1');
  const [copied, setCopied] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<{ columns: string[]; rows: any[][]; timeMs: number } | null>(null);

  const queries: QueryItem[] = [
    {
      id: 'q1',
      title: '1. Monthly Revenue & Profit Growth (MoM % with LAG)',
      businessQuestion: 'Are revenue and profit expanding at equal rates month-over-month, or is profit margin deteriorating?',
      techniques: ['Common Table Expressions (CTE)', 'Window Functions (LAG)', 'Conditional Aggregations', 'Percentage Calculations'],
      sql: `-- 1. Monthly Revenue & Profit Growth with MoM% Comparison
WITH monthly_metrics AS (
    SELECT 
        DATE_TRUNC('month', order_date)::DATE AS sales_month,
        COUNT(DISTINCT order_id) AS total_orders,
        SUM(net_sales) AS total_net_sales,
        SUM(profit) AS total_profit,
        ROUND((SUM(profit) / NULLIF(SUM(net_sales), 0)) * 100, 2) AS profit_margin_pct
    FROM fact_sales
    WHERE order_status != 'Cancelled'
    GROUP BY 1
)
SELECT 
    sales_month,
    total_orders,
    total_net_sales,
    total_profit,
    profit_margin_pct,
    ROUND(
        ((total_net_sales - LAG(total_net_sales) OVER (ORDER BY sales_month)) 
        / NULLIF(LAG(total_net_sales) OVER (ORDER BY sales_month), 0)) * 100, 
        2
    ) AS revenue_mom_pct,
    ROUND(
        ((total_profit - LAG(total_profit) OVER (ORDER BY sales_month)) 
        / NULLIF(LAG(total_profit) OVER (ORDER BY sales_month), 0)) * 100, 
        2
    ) AS profit_mom_pct
FROM monthly_metrics
ORDER BY sales_month DESC;`,
      run: (txs) => {
        const monthMap = new Map<string, { month: string; orders: number; sales: number; profit: number }>();
        txs.filter(t => t.order_status !== 'Cancelled').forEach(t => {
          const m = t.order_date.slice(0, 7);
          const rec = monthMap.get(m) || { month: m, orders: 0, sales: 0, profit: 0 };
          rec.orders += 1;
          rec.sales += t.net_sales;
          rec.profit += t.profit;
          monthMap.set(m, rec);
        });

        const sorted = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
        const rows = sorted.map((cur, i) => {
          const prev = i > 0 ? sorted[i - 1] : null;
          const revMoM = prev && prev.sales > 0 ? (((cur.sales - prev.sales) / prev.sales) * 100).toFixed(1) + '%' : '-';
          const profitMoM = prev && prev.profit > 0 ? (((cur.profit - prev.profit) / prev.profit) * 100).toFixed(1) + '%' : '-';
          const margin = cur.sales > 0 ? ((cur.profit / cur.sales) * 100).toFixed(1) + '%' : '0%';

          return [
            cur.month,
            formatNumber(cur.orders),
            formatCurrency(cur.sales),
            formatCurrency(cur.profit),
            margin,
            revMoM,
            profitMoM
          ];
        }).reverse();

        return {
          columns: ['Sales Month', 'Orders', 'Net Sales', 'Net Profit', 'Margin %', 'Revenue MoM %', 'Profit MoM %'],
          rows
        };
      }
    },
    {
      id: 'q2',
      title: '2. Top 10 Products by Revenue with Profit Margin & Rank()',
      businessQuestion: 'Which products generate maximum revenue, and how do their profitability ranks compare?',
      techniques: ['Window Function (DENSE_RANK)', 'Aggregations', 'Join on DimProduct', 'Calculated Metrics'],
      sql: `-- 2. Top 10 Products by Revenue with Rank Comparison
SELECT 
    p.product_id,
    p.product_name,
    p.category,
    SUM(f.quantity) AS total_units_sold,
    SUM(f.net_sales) AS total_revenue,
    SUM(f.profit) AS total_profit,
    ROUND((SUM(f.profit) / NULLIF(SUM(f.net_sales), 0)) * 100, 2) AS profit_margin_pct,
    DENSE_RANK() OVER (ORDER BY SUM(f.net_sales) DESC) AS revenue_rank,
    DENSE_RANK() OVER (ORDER BY SUM(f.profit) DESC) AS profit_rank
FROM fact_sales f
JOIN dim_product p ON f.product_id = p.product_id
WHERE f.order_status != 'Cancelled'
GROUP BY p.product_id, p.product_name, p.category
ORDER BY total_revenue DESC
LIMIT 10;`,
      run: (txs) => {
        const pMap = new Map<string, { id: string; name: string; cat: string; units: number; rev: number; profit: number }>();
        txs.filter(t => t.order_status !== 'Cancelled').forEach(t => {
          const rec = pMap.get(t.product_id) || { id: t.product_id, name: t.product_name, cat: t.category, units: 0, rev: 0, profit: 0 };
          rec.units += t.quantity;
          rec.rev += t.net_sales;
          rec.profit += t.profit;
          pMap.set(t.product_id, rec);
        });

        const sorted = Array.from(pMap.values()).sort((a, b) => b.rev - a.rev).slice(0, 10);
        const rows = sorted.map((p, idx) => {
          const margin = p.rev > 0 ? ((p.profit / p.rev) * 100).toFixed(1) + '%' : '0%';
          return [
            `#${idx + 1}`,
            p.name,
            p.cat,
            formatNumber(p.units),
            formatCurrency(p.rev),
            formatCurrency(p.profit),
            margin
          ];
        });

        return {
          columns: ['Rank', 'Product Name', 'Category', 'Units', 'Total Revenue', 'Total Profit', 'Margin %'],
          rows
        };
      }
    },
    {
      id: 'q3',
      title: '3. Category Profitability & Contribution % (SUM OVER)',
      businessQuestion: 'What percentage of company gross profits does each product department contribute?',
      techniques: ['Window Function (SUM() OVER())', 'Ratio of Total', 'Percentage formatting', 'Group By'],
      sql: `-- 3. Category Profit Contribution % vs Revenue Share
SELECT 
    p.category,
    COUNT(DISTINCT f.order_id) AS total_orders,
    SUM(f.net_sales) AS category_revenue,
    ROUND((SUM(f.net_sales) / SUM(SUM(f.net_sales)) OVER ()) * 100, 2) AS revenue_share_pct,
    SUM(f.profit) AS category_profit,
    ROUND((SUM(f.profit) / SUM(SUM(f.profit)) OVER ()) * 100, 2) AS profit_contribution_pct,
    ROUND((SUM(f.profit) / NULLIF(SUM(f.net_sales), 0)) * 100, 2) AS category_margin_pct
FROM fact_sales f
JOIN dim_product p ON f.product_id = p.product_id
WHERE f.order_status != 'Cancelled'
GROUP BY p.category
ORDER BY category_profit DESC;`,
      run: (txs) => {
        const catMap = new Map<string, { cat: string; orders: number; rev: number; profit: number }>();
        let totalRev = 0;
        let totalProfit = 0;

        txs.filter(t => t.order_status !== 'Cancelled').forEach(t => {
          const rec = catMap.get(t.category) || { cat: t.category, orders: 0, rev: 0, profit: 0 };
          rec.orders += 1;
          rec.rev += t.net_sales;
          rec.profit += t.profit;
          catMap.set(t.category, rec);
          totalRev += t.net_sales;
          totalProfit += t.profit;
        });

        const rows = Array.from(catMap.values())
          .sort((a, b) => b.profit - a.profit)
          .map(c => [
            c.cat,
            formatNumber(c.orders),
            formatCurrency(c.rev),
            ((c.rev / totalRev) * 100).toFixed(1) + '%',
            formatCurrency(c.profit),
            ((c.profit / totalProfit) * 100).toFixed(1) + '%',
            ((c.profit / c.rev) * 100).toFixed(1) + '%'
          ]);

        return {
          columns: ['Category', 'Orders', 'Revenue', 'Revenue Share', 'Profit', 'Profit Share', 'Margin %'],
          rows
        };
      }
    },
    {
      id: 'q4',
      title: '4. Customer RFM Segmentation via NTILE(5)',
      businessQuestion: 'How can we rank our customers into statistical quintiles based on Recency, Frequency, and Monetary spend?',
      techniques: ['NTILE(5) Ranking', 'Multi-CTE Pipeline', 'Date Arithmetic', 'CASE WHEN Segment Mapping'],
      sql: `-- 4. RFM Segmentation with Statistical NTILE Quintiles
WITH customer_aggregates AS (
    SELECT 
        customer_id,
        MAX(customer_name) AS customer_name,
        CURRENT_DATE - MAX(order_date)::DATE AS recency_days,
        COUNT(DISTINCT order_id) AS frequency,
        SUM(net_sales) AS monetary_value
    FROM fact_sales
    WHERE order_status != 'Cancelled'
    GROUP BY customer_id
),
rfm_scores AS (
    SELECT 
        customer_id,
        customer_name,
        recency_days,
        frequency,
        monetary_value,
        NTILE(5) OVER (ORDER BY recency_days DESC) AS r_score,
        NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,
        NTILE(5) OVER (ORDER BY monetary_value ASC) AS m_score
    FROM customer_aggregates
)
SELECT 
    customer_id,
    customer_name,
    recency_days,
    frequency,
    monetary_value,
    (r_score || f_score || m_score) AS rfm_combined,
    CASE 
        WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
        WHEN r_score >= 3 AND f_score >= 3 THEN 'Loyal Customers'
        WHEN r_score >= 3 AND f_score < 3 THEN 'Potential Loyalist'
        WHEN r_score <= 2 AND f_score >= 3 THEN 'At Risk'
        ELSE 'Hibernating'
    END AS segment_label
FROM rfm_scores
ORDER BY monetary_value DESC
LIMIT 15;`,
      run: (txs) => {
        const cMap = new Map<string, { id: string; name: string; maxDate: string; orders: number; rev: number }>();
        txs.filter(t => t.order_status !== 'Cancelled').forEach(t => {
          const rec = cMap.get(t.customer_id) || { id: t.customer_id, name: t.customer_name, maxDate: t.order_date, orders: 0, rev: 0 };
          rec.orders += 1;
          rec.rev += t.net_sales;
          if (t.order_date > rec.maxDate) rec.maxDate = t.order_date;
          cMap.set(t.customer_id, rec);
        });

        const rows = Array.from(cMap.values())
          .sort((a, b) => b.rev - a.rev)
          .slice(0, 15)
          .map(c => {
            const recency = Math.round((new Date('2025-12-31').getTime() - new Date(c.maxDate).getTime()) / (1000 * 3600 * 24));
            const rScore = recency < 30 ? 5 : recency < 60 ? 4 : recency < 120 ? 3 : recency < 200 ? 2 : 1;
            const fScore = c.orders >= 5 ? 5 : c.orders >= 3 ? 4 : c.orders >= 2 ? 3 : 2;
            const mScore = c.rev > 50000 ? 5 : c.rev > 25000 ? 4 : c.rev > 10000 ? 3 : 2;
            const label = rScore >= 4 && fScore >= 4 ? 'Champions' : rScore >= 3 && fScore >= 3 ? 'Loyal' : 'Potential Loyalist';

            return [
              c.id,
              c.name,
              `${recency}d`,
              c.orders.toString(),
              formatCurrency(c.rev),
              `${rScore}${fScore}${mScore}`,
              label
            ];
          });

        return {
          columns: ['Customer ID', 'Name', 'Recency', 'Frequency', 'Monetary Value', 'RFM Score', 'Segment'],
          rows
        };
      }
    },
    {
      id: 'q5',
      title: '5. Return Rate & Reverse Logistics Cost by Category',
      businessQuestion: 'How much direct gross margin and logistics handling fee is lost to returns in each department?',
      techniques: ['Conditional Sums (FILTER / CASE)', 'Cost Accounting Calculation', 'Group By', 'Null Handling'],
      sql: `-- 5. Return Rate & Reverse Courier Costs
SELECT 
    category,
    COUNT(*) AS total_orders,
    COUNT(*) FILTER (WHERE order_status = 'Returned') AS returned_orders,
    ROUND(
        (COUNT(*) FILTER (WHERE order_status = 'Returned')::NUMERIC / 
        NULLIF(COUNT(*), 0)) * 100, 
        2
    ) AS return_rate_pct,
    SUM(CASE WHEN order_status = 'Returned' THEN net_sales ELSE 0 END) AS gross_returned_value,
    (COUNT(*) FILTER (WHERE order_status = 'Returned') * 120) AS reverse_freight_cost
FROM fact_sales
GROUP BY category
ORDER BY return_rate_pct DESC;`,
      run: (txs) => {
        const catMap = new Map<string, { cat: string; total: number; ret: number; retVal: number }>();
        txs.forEach(t => {
          const rec = catMap.get(t.category) || { cat: t.category, total: 0, ret: 0, retVal: 0 };
          rec.total += 1;
          if (t.order_status === 'Returned') {
            rec.ret += 1;
            rec.retVal += t.net_sales;
          }
          catMap.set(t.category, rec);
        });

        const rows = Array.from(catMap.values())
          .sort((a, b) => (b.ret / b.total) - (a.ret / a.total))
          .map(c => [
            c.cat,
            formatNumber(c.total),
            formatNumber(c.ret),
            ((c.ret / c.total) * 100).toFixed(1) + '%',
            formatCurrency(c.retVal),
            formatCurrency(c.ret * 120)
          ]);

        return {
          columns: ['Category', 'Total Orders', 'Returned Orders', 'Return Rate %', 'Gross Value Lost', 'Reverse Courier Fee (₹120)'],
          rows
        };
      }
    },
    {
      id: 'q6',
      title: '6. Discount Elasticity & Profit Margin Degradation',
      businessQuestion: 'What is the empirical effect of discount tiers on final operating profit margin?',
      techniques: ['CASE WHEN Bucketing', 'Conditional Aggregation', 'Margin Elasticity Analysis'],
      sql: `-- 6. Discount Tier Impact on Margin Health
SELECT 
    CASE 
        WHEN discount_percentage = 0 THEN '0% Full Price'
        WHEN discount_percentage <= 10 THEN '1% - 10% Low Discount'
        WHEN discount_percentage <= 20 THEN '11% - 20% Moderate Discount'
        ELSE '21%+ Deep Promo Discount'
    END AS discount_tier,
    COUNT(order_id) AS order_count,
    SUM(gross_sales) AS total_gross_sales,
    SUM(net_sales) AS total_net_sales,
    SUM(profit) AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(net_sales), 0)) * 100, 2) AS realized_margin_pct
FROM fact_sales
WHERE order_status != 'Cancelled'
GROUP BY 1
ORDER BY realized_margin_pct DESC;`,
      run: (txs) => {
        const tiers = [
          { name: '0% Full Price', min: 0, max: 0, orders: 0, gross: 0, net: 0, profit: 0 },
          { name: '1% - 10% Low Discount', min: 0.1, max: 10, orders: 0, gross: 0, net: 0, profit: 0 },
          { name: '11% - 20% Moderate Discount', min: 10.1, max: 20, orders: 0, gross: 0, net: 0, profit: 0 },
          { name: '21%+ Deep Promo Discount', min: 20.1, max: 100, orders: 0, gross: 0, net: 0, profit: 0 }
        ];

        txs.filter(t => t.order_status !== 'Cancelled').forEach(t => {
          const tier = tiers.find(b => t.discount_percentage >= b.min && t.discount_percentage <= b.max);
          if (tier) {
            tier.orders += 1;
            tier.gross += t.gross_sales;
            tier.net += t.net_sales;
            tier.profit += t.profit;
          }
        });

        const rows = tiers.map(t => [
          t.name,
          formatNumber(t.orders),
          formatCurrency(t.gross),
          formatCurrency(t.net),
          formatCurrency(t.profit),
          t.net > 0 ? ((t.profit / t.net) * 100).toFixed(1) + '%' : '0%'
        ]);

        return {
          columns: ['Discount Tier', 'Orders', 'Gross Sales', 'Net Sales', 'Net Profit', 'Realized Margin %'],
          rows
        };
      }
    }
  ];

  const currentQuery = queries.find(q => q.id === selectedQueryId) || queries[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentQuery.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunQuery = () => {
    const start = performance.now();
    const result = currentQuery.run(filteredTransactions);
    const end = performance.now();
    setExecutionResult({
      ...result,
      timeMs: Math.round(end - start)
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          SQL Analytics Portfolio & Interactive Execution Engine
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Production SQL Queries & Window Functions
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Demonstrating enterprise SQL proficiency: Window functions (LAG, NTILE, DENSE_RANK), Common Table Expressions (CTEs), and in-memory execution over the 10,500 record database
        </p>
      </div>

      {/* Query Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {queries.map(q => (
          <button
            key={q.id}
            onClick={() => {
              setSelectedQueryId(q.id);
              setExecutionResult(null);
            }}
            className={`text-left p-3 rounded-xl border text-xs font-medium transition-all ${
              selectedQueryId === q.id
                ? 'bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="truncate">{q.title}</div>
            <div className="text-[10px] text-slate-400 font-normal mt-0.5 truncate">
              {q.techniques.join(' • ')}
            </div>
          </button>
        ))}
      </div>

      {/* Query Detail & Code Block */}
      <div className="bg-slate-950 text-slate-100 rounded-xl p-6 shadow-xl border border-slate-800 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 font-sans">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              {currentQuery.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              <strong>Business Problem:</strong> {currentQuery.businessQuestion}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy SQL'}
            </button>

            <button
              id="run-sql-btn"
              onClick={handleRunQuery}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run Query on Live Data
            </button>
          </div>
        </div>

        {/* Formatted Code Block */}
        <div className="mt-4 overflow-x-auto">
          <pre className="text-slate-300 leading-relaxed text-[11px] font-mono">
            {currentQuery.sql}
          </pre>
        </div>

        {/* Techniques Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-800/80 font-sans text-xs">
          <span className="text-slate-400 text-[11px]">Key Techniques:</span>
          {currentQuery.techniques.map(t => (
            <span key={t} className="px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 text-[10px] font-semibold">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Query Execution Result Section */}
      {executionResult && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Query Execution Output
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Returned <strong className="text-slate-800 dark:text-slate-200">{executionResult.rows.length} rows</strong> in {executionResult.timeMs}ms
            </div>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                  {executionResult.columns.map(c => (
                    <th key={c} className="py-2 px-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {executionResult.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
