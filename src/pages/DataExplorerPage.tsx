import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Search, 
  Download, 
  ArrowUpDown, 
  Eye, 
  X, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Transaction } from '../types';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';

export const DataExplorerPage: React.FC = () => {
  const { filteredTransactions } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Transaction>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filtered & Sorted
  const processedData = useMemo(() => {
    let result = filteredTransactions;

    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.order_id.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q) ||
        t.product_name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q) ||
        t.payment_method.toLowerCase().includes(q)
      );
    }

    return [...result].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [filteredTransactions, searchTerm, sortField, sortDirection]);

  const totalRecords = processedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (field: keyof Transaction) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Order ID', 'Order Date', 'Customer ID', 'Customer Name', 'Segment',
      'Category', 'Sub-Category', 'Product ID', 'Product Name', 'Quantity',
      'Unit Price', 'Gross Sales', 'Discount %', 'Net Sales', 'Cost',
      'Profit', 'Region', 'State', 'City', 'Payment Method', 'Channel', 'Status'
    ];

    const rows = processedData.slice(0, 5000).map(t => [
      t.order_id, t.order_date, t.customer_id, `"${t.customer_name}"`, t.customer_segment,
      t.category, t.sub_category, t.product_id, `"${t.product_name}"`, t.quantity,
      t.unit_price, t.gross_sales, t.discount_percentage, t.net_sales, t.cost,
      t.profit, t.region, t.state, t.city, t.payment_method, t.acquisition_channel, t.order_status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopSphere_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Table className="w-4 h-4" />
              Granular Data Explorer
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Raw Transaction Records ({totalRecords.toLocaleString()} Matching)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect underlying FactSales records, drill into unit margins, discounts, customer segments, and order statuses
            </p>
          </div>

          <button
            id="export-csv-btn"
            onClick={exportToCSV}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            Export to CSV
          </button>
        </div>
      </div>

      {/* Control Bar: Search & Page Size */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="data-explorer-search"
            type="text"
            placeholder="Search Order ID, Customer, Product, City..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <span className="text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Order</th>
                <th 
                  className="py-2.5 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => handleSort('order_date')}
                >
                  <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Category</th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => handleSort('quantity')}
                >
                  <div className="flex items-center justify-end gap-1">Qty <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => handleSort('discount_percentage')}
                >
                  <div className="flex items-center justify-end gap-1">Disc % <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => handleSort('net_sales')}
                >
                  <div className="flex items-center justify-end gap-1">Net Sales <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th 
                  className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center justify-end gap-1">Profit <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedData.map(t => (
                <tr key={t.order_id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {t.order_id}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {formatDate(t.order_date)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{t.customer_name}</div>
                    <div className="text-[10px] text-slate-400">{t.customer_segment}</div>
                  </td>
                  <td className="py-2.5 px-3 max-w-xs">
                    <div className="font-medium text-slate-900 dark:text-white truncate">{t.product_name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{t.sub_category}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-800 dark:text-slate-200">
                    {t.quantity}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className={t.discount_percentage >= 20 ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>
                      {t.discount_percentage}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900 dark:text-white">
                    {formatCurrency(t.net_sales)}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-bold ${
                    t.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {formatCurrency(t.profit)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="text-slate-700 dark:text-slate-300">{t.city}</div>
                    <div className="text-[10px] text-slate-400">{t.region}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.order_status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : t.order_status === 'Returned'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : t.order_status === 'Cancelled'
                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {t.order_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setSelectedTx(t)}
                      className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Inspect Transaction"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords.toLocaleString()} records
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 font-medium">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40"
            >
              Last
            </button>
          </div>
        </div>
      </div>

      {/* Row Detail Inspection Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-mono font-bold">
                {selectedTx.order_id}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transaction Line-Item Detail</h3>
                <span className="text-slate-400">{formatDate(selectedTx.order_date)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Customer</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{selectedTx.customer_name}</div>
                <div className="text-slate-500">{selectedTx.customer_id} • {selectedTx.customer_segment}</div>
                <div className="text-slate-500">{selectedTx.city}, {selectedTx.state} ({selectedTx.region})</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Product</span>
                <div className="font-bold text-slate-800 dark:text-slate-200">{selectedTx.product_name}</div>
                <div className="text-slate-500">{selectedTx.category} &gt; {selectedTx.sub_category}</div>
                <div className="text-slate-500 font-mono">{selectedTx.product_id}</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 space-y-2 mb-4">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Financial Ledger Entry</div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-400">Unit Price:</span>
                  <div className="font-bold">{formatCurrency(selectedTx.unit_price)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Quantity:</span>
                  <div className="font-bold">{selectedTx.quantity} units</div>
                </div>
                <div>
                  <span className="text-slate-400">Gross Sales:</span>
                  <div className="font-bold">{formatCurrency(selectedTx.gross_sales)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Discount:</span>
                  <div className="font-bold text-rose-500">{selectedTx.discount_percentage}% ({formatCurrency(selectedTx.gross_sales - selectedTx.net_sales)})</div>
                </div>
                <div>
                  <span className="text-slate-400">Net Sales:</span>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(selectedTx.net_sales)}</div>
                </div>
                <div>
                  <span className="text-slate-400">Total Cost:</span>
                  <div className="font-bold text-amber-500">{formatCurrency(selectedTx.cost)}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Net Profit Recognized:</span>
                <span className={`text-sm font-black ${
                  selectedTx.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {formatCurrency(selectedTx.profit)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <div>
                Acquired via: <strong className="text-slate-700 dark:text-slate-300">{selectedTx.acquisition_channel}</strong>
              </div>
              <div>
                Payment: <strong className="text-slate-700 dark:text-slate-300">{selectedTx.payment_method}</strong>
              </div>
              <div>
                Status: <strong className="text-slate-700 dark:text-slate-300">{selectedTx.order_status}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
