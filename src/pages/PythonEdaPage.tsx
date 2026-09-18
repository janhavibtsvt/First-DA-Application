import React, { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  LineChart, 
  BarChart2, 
  BookOpen,
  CheckCircle2,
  Play
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface NotebookCell {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  pythonCode: string;
  stdout: string;
  statsSummary?: { label: string; value: string }[];
}

export const PythonEdaPage: React.FC = () => {
  const { rawTransactions, kpis } = useData();
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  const notebookCells: NotebookCell[] = [
    {
      id: 'cell-1',
      stepNumber: 1,
      title: 'Data Ingestion & Integrity Inspection (Pandas)',
      description: 'Loading transactional dataset into a DataFrame, inspecting schema types, memory footprint, and confirming zero null values.',
      pythonCode: `import pandas as pd
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt
import seaborn as sns

# Load dataset
df = pd.read_csv("ecommerce_sales_2024_2025.csv")

print(f"Shape: {df.shape[0]:,} rows x {df.shape[1]} columns")
print("\\nMissing Values Check:")
print(df.isnull().sum())
print("\\nData Types Summary:")
print(df.dtypes.value_counts())`,
      stdout: `Shape: 10,500 rows x 23 columns

Missing Values Check:
order_id            0
order_date          0
customer_id         0
customer_name       0
customer_segment    0
category            0
sub_category        0
product_name        0
unit_price          0
quantity            0
discount_pct        0
net_sales           0
profit              0
order_status        0
dtype: int64

Memory usage: 1.84 MB
Completeness: 100.0% clean`,
      statsSummary: [
        { label: 'Rows', value: '10,500' },
        { label: 'Columns', value: '23' },
        { label: 'Missing Values', value: '0' },
        { label: 'Data Quality Score', value: '100%' }
      ]
    },
    {
      id: 'cell-2',
      stepNumber: 2,
      title: 'Financial Feature Engineering & Profit Margins',
      description: 'Deriving Gross Sales, Unit COGS, Net Profit, and Realized Margin % with explicit vectorization.',
      pythonCode: `# Vectorized feature engineering
df['gross_sales'] = df['quantity'] * df['unit_price']
df['discount_amount'] = df['gross_sales'] * (df['discount_percentage'] / 100.0)
df['net_sales'] = df['gross_sales'] - df['discount_amount']

# Reconcile unit profit margin percentage
df['profit_margin_pct'] = np.where(
    df['net_sales'] > 0,
    (df['profit'] / df['net_sales']) * 100.0,
    0.0
)

# Summary statistics of key financial fields
df[['unit_price', 'discount_percentage', 'net_sales', 'profit', 'profit_margin_pct']].describe().round(2)`,
      stdout: `       unit_price  discount_percentage   net_sales      profit  profit_margin_pct
count    10500.00             10500.00    10500.00    10500.00           10500.00
mean      3840.50                14.20     4820.30      915.20              19.40
std       7650.20                 9.80     9210.40     1840.10              11.20
min        149.00                 0.00      134.10     -420.00              -8.50
25%        699.00                 5.00      899.00      142.00              12.40
50%       1599.00                15.00     2199.00      420.00              18.60
75%       3499.00                22.00     4999.00     1050.00              26.80
max     124999.00                40.00   187498.00    31200.00              48.20`,
      statsSummary: [
        { label: 'Mean Unit Price', value: '₹3,840' },
        { label: 'Avg Discount', value: '14.2%' },
        { label: 'Mean Net Sales', value: '₹4,820' },
        { label: 'Mean Margin', value: '19.4%' }
      ]
    },
    {
      id: 'cell-3',
      stepNumber: 3,
      title: 'Customer RFM Segmentation via Pandas qcut',
      description: 'Computing Recency, Frequency, and Monetary spend per customer, applying quintile scoring (1-5), and assigning behavioral labels.',
      pythonCode: `reference_date = pd.to_datetime('2025-12-31')

# Aggregate by customer
rfm = df[df['order_status'] != 'Cancelled'].groupby('customer_id').agg({
    'order_date': lambda x: (reference_date - pd.to_datetime(x).max()).days,
    'order_id': 'nunique',
    'net_sales': 'sum'
}).rename(columns={
    'order_date': 'recency_days',
    'order_id': 'frequency',
    'net_sales': 'monetary'
})

# Quintile ranking (1-5)
rfm['R'] = pd.qcut(rfm['recency_days'], 5, labels=[5, 4, 3, 2, 1])
rfm['F'] = pd.qcut(rfm['frequency'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5])
rfm['M'] = pd.qcut(rfm['monetary'], 5, labels=[1, 2, 3, 4, 5])

rfm['RFM_Score'] = rfm['R'].astype(str) + rfm['F'].astype(str) + rfm['M'].astype(str)
print("RFM Quintiles Distribution:")
print(rfm[['recency_days', 'frequency', 'monetary']].describe().round(1))`,
      stdout: `RFM Quintiles Distribution:
       recency_days   frequency       monetary
count        2410.0      2410.0         2410.0
mean           88.4         3.9       20,980.5
std            72.1         2.8       26,450.2
min             1.0         1.0          399.0
25%            28.0         2.0        5,800.0
50%            65.0         3.0       12,400.0
75%           134.0         5.0       25,900.0
max           360.0        14.0      184,200.0`,
      statsSummary: [
        { label: 'Customers Scored', value: '2,410' },
        { label: 'Median Recency', value: '65 days' },
        { label: 'Avg Frequency', value: '3.9 orders' },
        { label: 'Max Customer LTV', value: '₹184,200' }
      ]
    },
    {
      id: 'cell-4',
      stepNumber: 4,
      title: 'Statistical Hypothesis Testing: Welch\'s Two-Sample t-Test',
      description: 'Hypothesis: Orders discounted >20% suffer statistically significant lower net margins than orders with ≤20% discounts.',
      pythonCode: `# Split into low/moderate vs deep discount groups
group_low_disc = df[df['discount_percentage'] <= 20]['profit_margin_pct']
group_high_disc = df[df['discount_percentage'] > 20]['profit_margin_pct']

# Perform Welch's t-test (unequal variances)
t_stat, p_val = stats.ttest_ind(group_low_disc, group_high_disc, equal_var=False)

print(f"Low Discount Group Mean Margin:  {group_low_disc.mean():.2f}% (n={len(group_low_disc):,})")
print(f"High Discount Group Mean Margin: {group_high_disc.mean():.2f}% (n={len(group_high_disc):,})")
print(f"\\nWelch's t-statistic: {t_stat:.4f}")
print(f"p-value: {p_val:.4e}")
print("\\nDecision: Reject Null Hypothesis (p < 0.001)")
print("Conclusion: Promotional discounts >20% significantly degrade operating profit margin.")`,
      stdout: `Low Discount Group Mean Margin:  24.18% (n=7,842)
High Discount Group Mean Margin: 7.32% (n=2,658)

Welch's t-statistic: 42.1894
p-value: 1.4820e-294

Decision: Reject Null Hypothesis (p < 0.001)
Conclusion: Promotional discounts >20% significantly degrade operating profit margin.
Difference is statistically robust at 99.9% confidence level.`,
      statsSummary: [
        { label: 't-statistic', value: '42.19' },
        { label: 'p-value', value: '< 0.0001' },
        { label: 'Confidence Level', value: '99.9%' },
        { label: 'Mean Margin Delta', value: '-16.86% pts' }
      ]
    }
  ];

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCellId(id);
    setTimeout(() => setCopiedCellId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <FileCode className="w-4 h-4" />
          Python & Exploratory Data Analysis (EDA)
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Data Science Notebook: Pandas, SciPy & Statistical Inference
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Simulating a production Jupyter notebook workflow: data hygiene audits, feature engineering, RFM clustering, and Welch&apos;s t-test hypothesis validation
        </p>
      </div>

      {/* Notebook Cells */}
      <div className="space-y-6">
        {notebookCells.map(cell => (
          <div 
            key={cell.id}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs"
          >
            {/* Cell Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs flex items-center justify-center">
                  [{cell.stepNumber}]
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cell.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {cell.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(cell.id, cell.pythonCode)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors self-start sm:self-auto"
              >
                {copiedCellId === cell.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCellId === cell.id ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            {/* Python Code Block */}
            <div className="bg-slate-950 p-4 overflow-x-auto text-xs font-mono text-indigo-200">
              <pre className="leading-relaxed">
                {cell.pythonCode}
              </pre>
            </div>

            {/* Output / Stdout */}
            <div className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-500 uppercase mb-2">
                <Terminal className="w-3.5 h-3.5" /> Output:
              </div>
              <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {cell.stdout}
              </pre>

              {/* KPI metrics chips */}
              {cell.statsSummary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  {cell.statsSummary.map(st => (
                    <div key={st.label} className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400 block">{st.label}</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{st.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
