export type Region = 'North' | 'South' | 'West' | 'East' | 'Central';

export type ProductCategory = 
  | 'Electronics'
  | 'Fashion'
  | 'Home & Kitchen'
  | 'Beauty'
  | 'Sports'
  | 'Grocery'
  | 'Books'
  | 'Accessories';

export type OrderStatus = 'Delivered' | 'Cancelled' | 'Returned' | 'Pending';
export type ReturnStatus = 'Not Returned' | 'Returned' | 'Replacement Requested';
export type CustomerSegment = 'New' | 'Returning' | 'Loyal' | 'High Value' | 'At Risk' | 'Inactive';
export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery';
export type AcquisitionChannel = 'Organic Search' | 'Google Ads' | 'Instagram' | 'Email Referral' | 'Direct';

export interface Transaction {
  order_id: string;
  order_date: string; // YYYY-MM-DD
  year: number;
  month: number;
  day_of_week: string;
  is_weekend: boolean;
  
  // Customer Dim
  customer_id: string;
  customer_name: string;
  customer_segment: CustomerSegment;
  age_group: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  gender: 'Male' | 'Female' | 'Other';
  acquisition_channel: AcquisitionChannel;

  // Location Dim
  city: string;
  state: string;
  region: Region;

  // Product Dim
  product_id: string;
  product_name: string;
  category: ProductCategory;
  sub_category: string;
  unit_price: number;
  unit_cost: number;

  // Transaction Financials
  quantity: number;
  gross_sales: number;
  discount_percentage: number;
  discount_amount: number;
  net_sales: number;
  cost: number;
  profit: number;
  profit_margin: number; // percentage

  // Operational
  payment_method: PaymentMethod;
  order_status: OrderStatus;
  return_status: ReturnStatus;
  return_reason?: string;
  shipping_days: number;
  customer_rating: number; // 1 - 5
}

export interface CustomerRFM {
  customer_id: string;
  customer_name: string;
  segment: CustomerSegment;
  total_orders: number;
  total_revenue: number;
  total_profit: number;
  avg_order_value: number;
  first_order_date: string;
  last_order_date: string;
  recency_days: number;
  r_score: number;
  f_score: number;
  m_score: number;
  rfm_score: string;
  rfm_segment: string;
}

export interface ProductPerformance {
  product_id: string;
  product_name: string;
  category: ProductCategory;
  sub_category: string;
  revenue: number;
  profit: number;
  margin: number;
  units_sold: number;
  orders: number;
  return_rate: number;
  avg_discount: number;
  avg_rating: number;
  status: 'Star Performer' | 'Cash Cow' | 'Margin Trap' | 'Problem Child';
}

export interface FilterState {
  datePreset: 'all' | '2024' | '2025' | 'last12m' | 'festive';
  startDate: string;
  endDate: string;
  region: string; // 'all' or specific
  category: string; // 'all' or specific
  customerSegment: string; // 'all' or specific
  orderStatus: string; // 'all' or specific
  searchQuery: string;
}

export interface KPISummary {
  totalRevenue: number;
  prevRevenue: number;
  revenueGrowth: number;

  totalProfit: number;
  prevProfit: number;
  profitGrowth: number;

  profitMargin: number;
  prevProfitMargin: number;
  marginDelta: number;

  totalOrders: number;
  prevOrders: number;
  ordersGrowth: number;

  uniqueCustomers: number;
  prevCustomers: number;
  customersGrowth: number;

  avgOrderValue: number;
  prevAOV: number;
  aovGrowth: number;

  returnRate: number;
  prevReturnRate: number;
  returnRateDelta: number;

  cancellationRate: number;
  prevCancellationRate: number;
  cancellationRateDelta: number;

  retentionRate: number;
  prevRetentionRate: number;
  retentionRateDelta: number;

  totalGrossSales: number;
  totalCost: number;
  totalDiscount: number;
  avgDiscountRate: number;
  unitsSold: number;
}

export interface ManagementHighlight {
  id: string;
  title: string;
  status: 'positive' | 'warning' | 'critical' | 'neutral';
  finding: string;
  impact: string;
  recommendation: string;
  metric: string;
}

export interface DataQualityReport {
  totalRecords: number;
  missingValues: number;
  duplicateRecords: number;
  invalidRecords: number;
  cancelledOrders: number;
  returnedOrders: number;
  deliveredOrders: number;
  dateRange: { start: string; end: string };
  uniqueCustomerCount: number;
  uniqueProductCount: number;
}
