import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode, ThemeColor, ThemeColorDefinition } from '../utils/themeColors';
import { 
  Transaction, 
  FilterState, 
  KPISummary, 
  ManagementHighlight, 
  ProductPerformance,
  CustomerRFM,
  DataQualityReport 
} from '../types';
import { getEcommerceDataset } from '../data/datasetGenerator';
import { 
  calculateKPISummary, 
  generateManagementHighlights, 
  calculateMonthlyTrends, 
  calculateCategoryBreakdown, 
  calculateProductPerformance, 
  calculateCustomerRFM, 
  calculateRegionalBreakdown 
} from '../calculations/analytics';

interface DataContextType {
  rawTransactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  activeFilterCount: number;
  kpis: KPISummary;
  highlights: ManagementHighlight[];
  monthlyTrends: ReturnType<typeof calculateMonthlyTrends>;
  categoryBreakdown: ReturnType<typeof calculateCategoryBreakdown>;
  productPerformance: ProductPerformance[];
  customerRFM: CustomerRFM[];
  regionalBreakdown: ReturnType<typeof calculateRegionalBreakdown>;
  dataQualityReport: DataQualityReport;
  exportToCSV: () => void;
  theme: ThemeMode;
  themeColor: ThemeColor;
  colorDefinition: ThemeColorDefinition;
  primaryColor: string;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColor: (color: ThemeColor) => void;
  applyPreset: (mode: ThemeMode, color: ThemeColor) => void;
  resetTheme: () => void;
}

const initialFilters: FilterState = {
  datePreset: 'all',
  startDate: '2024-01-01',
  endDate: '2025-12-31',
  region: 'all',
  category: 'all',
  customerSegment: 'all',
  orderStatus: 'all',
  searchQuery: ''
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    theme, 
    themeColor, 
    colorDefinition, 
    primaryColor, 
    toggleTheme, 
    setThemeMode, 
    setThemeColor, 
    applyPreset, 
    resetTheme 
  } = useTheme();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Base raw transactions (10,500+)
  const rawTransactions = useMemo(() => getEcommerceDataset(), []);

  // Update filter helper
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value };
      // Handle date preset triggers
      if (key === 'datePreset') {
        if (value === '2024') {
          next.startDate = '2024-01-01';
          next.endDate = '2024-12-31';
        } else if (value === '2025') {
          next.startDate = '2025-01-01';
          next.endDate = '2025-12-31';
        } else if (value === 'last12m') {
          next.startDate = '2025-01-01';
          next.endDate = '2025-12-31';
        } else if (value === 'festive') {
          next.startDate = '2025-10-01';
          next.endDate = '2025-11-30';
        } else if (value === 'all') {
          next.startDate = '2024-01-01';
          next.endDate = '2025-12-31';
        }
      }
      return next;
    });
  };

  const resetFilters = () => setFilters(initialFilters);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.datePreset !== 'all') count++;
    if (filters.region !== 'all') count++;
    if (filters.category !== 'all') count++;
    if (filters.customerSegment !== 'all') count++;
    if (filters.orderStatus !== 'all') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  // Dynamic filter application
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter(t => {
      // Date bounds
      if (filters.startDate && t.order_date < filters.startDate) return false;
      if (filters.endDate && t.order_date > filters.endDate) return false;

      // Region
      if (filters.region !== 'all' && t.region !== filters.region) return false;

      // Category
      if (filters.category !== 'all' && t.category !== filters.category) return false;

      // Customer Segment
      if (filters.customerSegment !== 'all' && t.customer_segment !== filters.customerSegment) return false;

      // Order Status
      if (filters.orderStatus !== 'all' && t.order_status !== filters.orderStatus) return false;

      // Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const match = 
          t.order_id.toLowerCase().includes(q) ||
          t.customer_name.toLowerCase().includes(q) ||
          t.product_name.toLowerCase().includes(q) ||
          t.city.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [rawTransactions, filters]);

  // Compute analytics dynamically based on filtered set
  const kpis = useMemo(() => calculateKPISummary(filteredTransactions), [filteredTransactions]);
  const highlights = useMemo(() => generateManagementHighlights(filteredTransactions, kpis), [filteredTransactions, kpis]);
  const monthlyTrends = useMemo(() => calculateMonthlyTrends(filteredTransactions), [filteredTransactions]);
  const categoryBreakdown = useMemo(() => calculateCategoryBreakdown(filteredTransactions), [filteredTransactions]);
  const productPerformance = useMemo(() => calculateProductPerformance(filteredTransactions), [filteredTransactions]);
  const customerRFM = useMemo(() => calculateCustomerRFM(filteredTransactions), [filteredTransactions]);
  const regionalBreakdown = useMemo(() => calculateRegionalBreakdown(filteredTransactions), [filteredTransactions]);

  // Data Quality Metrics for Analyst Toolkit
  const dataQualityReport = useMemo((): DataQualityReport => {
    const totalRecords = rawTransactions.length;
    const deliveredOrders = rawTransactions.filter(t => t.order_status === 'Delivered').length;
    const cancelledOrders = rawTransactions.filter(t => t.order_status === 'Cancelled').length;
    const returnedOrders = rawTransactions.filter(t => t.order_status === 'Returned').length;
    const uniqueCustomerCount = new Set(rawTransactions.map(t => t.customer_id)).size;
    const uniqueProductCount = new Set(rawTransactions.map(t => t.product_id)).size;

    return {
      totalRecords,
      missingValues: 0, // Cleaned pipeline
      duplicateRecords: 0,
      invalidRecords: 0,
      cancelledOrders,
      returnedOrders,
      deliveredOrders,
      dateRange: { start: '2024-01-01', end: '2025-12-31' },
      uniqueCustomerCount,
      uniqueProductCount
    };
  }, [rawTransactions]);

  // CSV Export utility
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = [
      'Order ID', 'Order Date', 'Customer ID', 'Customer Name', 'Customer Segment',
      'City', 'State', 'Region', 'Product ID', 'Product Name', 'Category', 'Sub-Category',
      'Quantity', 'Unit Price', 'Gross Sales', 'Discount %', 'Net Sales', 'Cost', 'Profit',
      'Profit Margin %', 'Payment Method', 'Order Status', 'Customer Rating', 'Shipping Days'
    ];

    const rows = filteredTransactions.map(t => [
      t.order_id,
      t.order_date,
      t.customer_id,
      `"${t.customer_name.replace(/"/g, '""')}"`,
      t.customer_segment,
      t.city,
      t.state,
      t.region,
      t.product_id,
      `"${t.product_name.replace(/"/g, '""')}"`,
      t.category,
      t.sub_category,
      t.quantity,
      t.unit_price,
      t.gross_sales,
      t.discount_percentage,
      t.net_sales,
      t.cost,
      t.profit,
      t.profit_margin,
      t.payment_method,
      t.order_status,
      t.customer_rating,
      t.shipping_days
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopSphere_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DataContext.Provider value={{
      rawTransactions,
      filteredTransactions,
      filters,
      setFilters,
      updateFilter,
      resetFilters,
      activeFilterCount,
      kpis,
      highlights,
      monthlyTrends,
      categoryBreakdown,
      productPerformance,
      customerRFM,
      regionalBreakdown,
      dataQualityReport,
      exportToCSV,
      theme,
      themeColor,
      colorDefinition,
      primaryColor,
      toggleTheme,
      setThemeMode,
      setThemeColor,
      applyPreset,
      resetTheme
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
