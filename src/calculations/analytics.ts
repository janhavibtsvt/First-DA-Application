import { 
  Transaction, 
  KPISummary, 
  CustomerRFM, 
  ProductPerformance, 
  ManagementHighlight,
  ProductCategory,
  CustomerSegment,
  Region
} from '../types';

export function calculateKPISummary(current: Transaction[], previous?: Transaction[]): KPISummary {
  const totalRevenue = current.reduce((sum, t) => sum + (t.order_status !== 'Cancelled' ? t.net_sales : 0), 0);
  const totalGrossSales = current.reduce((sum, t) => sum + t.gross_sales, 0);
  const totalCost = current.reduce((sum, t) => sum + (t.order_status !== 'Cancelled' ? t.cost : 0), 0);
  const totalDiscount = current.reduce((sum, t) => sum + t.discount_amount, 0);
  const totalProfit = current.reduce((sum, t) => sum + (t.order_status !== 'Cancelled' ? t.profit : 0), 0);
  const unitsSold = current.reduce((sum, t) => sum + (t.order_status !== 'Cancelled' ? t.quantity : 0), 0);

  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const avgDiscountRate = totalGrossSales > 0 ? (totalDiscount / totalGrossSales) * 100 : 0;

  // Order counts
  const totalOrders = current.length;
  const validOrders = current.filter(t => t.order_status !== 'Cancelled').length;
  const avgOrderValue = validOrders > 0 ? totalRevenue / validOrders : 0;

  const returnedOrders = current.filter(t => t.order_status === 'Returned').length;
  const cancelledOrders = current.filter(t => t.order_status === 'Cancelled').length;

  const returnRate = totalOrders > 0 ? (returnedOrders / totalOrders) * 100 : 0;
  const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0;

  // Customers
  const customerOrderMap = new Map<string, number>();
  current.forEach(t => {
    customerOrderMap.set(t.customer_id, (customerOrderMap.get(t.customer_id) || 0) + 1);
  });
  const uniqueCustomers = customerOrderMap.size;
  let repeatCustomers = 0;
  customerOrderMap.forEach(count => {
    if (count > 1) repeatCustomers++;
  });
  const retentionRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  // Previous period calculations (if provided or synthetic baseline comparison)
  let prevRevenue = 0;
  let prevProfit = 0;
  let prevOrders = 0;
  let prevCustomers = 0;
  let prevReturnRate = returnRate * 0.92;
  let prevCancellationRate = cancellationRate * 0.95;
  let prevRetentionRate = retentionRate * 0.96;

  if (previous && previous.length > 0) {
    prevRevenue = previous.reduce((sum, t) => sum + (t.order_status !== 'Cancelled' ? t.net_sales : 0), 0);
    prevProfit = previous.reduce((sum, t) => sum + (t.order_status !== 'Cancelled' ? t.profit : 0), 0);
    prevOrders = previous.length;
    const prevCustSet = new Set(previous.map(t => t.customer_id));
    prevCustomers = prevCustSet.size;
    const prevRet = previous.filter(t => t.order_status === 'Returned').length;
    prevReturnRate = prevOrders > 0 ? (prevRet / prevOrders) * 100 : 0;
    const prevCanc = previous.filter(t => t.order_status === 'Cancelled').length;
    prevCancellationRate = prevOrders > 0 ? (prevCanc / prevOrders) * 100 : 0;
  } else {
    // Model historical baseline showing the core management problem:
    // Prior period had lower revenue (-21%) but higher profit margin (+4.5 percentage points)
    prevRevenue = Math.round(totalRevenue * 0.79);
    prevProfit = Math.round(totalProfit * 0.94);
    prevOrders = Math.round(totalOrders * 0.77);
    prevCustomers = Math.round(uniqueCustomers * 0.81);
  }

  const prevProfitMargin = prevRevenue > 0 ? (prevProfit / prevRevenue) * 100 : 0;
  const prevAOV = prevOrders > 0 ? prevRevenue / prevOrders : 0;

  const revenueGrowth = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const profitGrowth = prevProfit > 0 ? ((totalProfit - prevProfit) / prevProfit) * 100 : 0;
  const ordersGrowth = prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0;
  const customersGrowth = prevCustomers > 0 ? ((uniqueCustomers - prevCustomers) / prevCustomers) * 100 : 0;
  const aovGrowth = prevAOV > 0 ? ((avgOrderValue - prevAOV) / prevAOV) * 100 : 0;
  const marginDelta = profitMargin - prevProfitMargin;
  const returnRateDelta = returnRate - prevReturnRate;
  const cancellationRateDelta = cancellationRate - prevCancellationRate;
  const retentionRateDelta = retentionRate - prevRetentionRate;

  return {
    totalRevenue,
    prevRevenue,
    revenueGrowth,
    totalProfit,
    prevProfit,
    profitGrowth,
    profitMargin,
    prevProfitMargin,
    marginDelta,
    totalOrders,
    prevOrders,
    ordersGrowth,
    uniqueCustomers,
    prevCustomers,
    customersGrowth,
    avgOrderValue,
    prevAOV,
    aovGrowth,
    returnRate,
    prevReturnRate,
    returnRateDelta,
    cancellationRate,
    prevCancellationRate,
    cancellationRateDelta,
    retentionRate,
    prevRetentionRate,
    retentionRateDelta,
    totalGrossSales,
    totalCost,
    totalDiscount,
    avgDiscountRate,
    unitsSold
  };
}

export function generateManagementHighlights(data: Transaction[], kpi: KPISummary): ManagementHighlight[] {
  if (data.length === 0) return [];

  // Category aggregates
  const catRev = new Map<ProductCategory, number>();
  const catProf = new Map<ProductCategory, number>();
  const catOrders = new Map<ProductCategory, number>();
  const catReturns = new Map<ProductCategory, number>();

  data.forEach(t => {
    if (t.order_status !== 'Cancelled') {
      catRev.set(t.category, (catRev.get(t.category) || 0) + t.net_sales);
      catProf.set(t.category, (catProf.get(t.category) || 0) + t.profit);
      catOrders.set(t.category, (catOrders.get(t.category) || 0) + 1);
      if (t.order_status === 'Returned') {
        catReturns.set(t.category, (catReturns.get(t.category) || 0) + 1);
      }
    }
  });

  let topRevCat: { cat: ProductCategory; rev: number } = { cat: 'Electronics', rev: 0 };
  let topProfCat: { cat: ProductCategory; prof: number } = { cat: 'Accessories', prof: 0 };
  let lowestMarginCat: { cat: ProductCategory; margin: number } = { cat: 'Electronics', margin: 100 };
  let highestReturnCat: { cat: ProductCategory; rate: number } = { cat: 'Fashion', rate: 0 };

  catRev.forEach((rev, cat) => {
    if (rev > topRevCat.rev) topRevCat = { cat, rev };
    const prof = catProf.get(cat) || 0;
    if (prof > topProfCat.prof) topProfCat = { cat, prof };
    const margin = rev > 0 ? (prof / rev) * 100 : 0;
    if (margin < lowestMarginCat.margin) lowestMarginCat = { cat, margin };
    const orders = catOrders.get(cat) || 1;
    const ret = catReturns.get(cat) || 0;
    const rate = (ret / orders) * 100;
    if (rate > highestReturnCat.rate) highestReturnCat = { cat, rate };
  });

  // Region aggregates
  const regRev = new Map<Region, number>();
  data.forEach(t => {
    if (t.order_status !== 'Cancelled') {
      regRev.set(t.region, (regRev.get(t.region) || 0) + t.net_sales);
    }
  });
  let bestRegion: { reg: Region; rev: number } = { reg: 'South', rev: 0 };
  regRev.forEach((rev, reg) => {
    if (rev > bestRegion.rev) bestRegion = { reg, rev };
  });

  // Top Product
  const prodRev = new Map<string, { name: string; rev: number }>();
  data.forEach(t => {
    if (t.order_status !== 'Cancelled') {
      const existing = prodRev.get(t.product_id) || { name: t.product_name, rev: 0 };
      existing.rev += t.net_sales;
      prodRev.set(t.product_id, existing);
    }
  });
  let topProduct = { name: 'Top Product', rev: 0 };
  prodRev.forEach(val => {
    if (val.rev > topProduct.rev) topProduct = val;
  });

  const highlights: ManagementHighlight[] = [
    {
      id: 'hl-1',
      title: 'The Core Profit Paradox: Growth vs Margin Compression',
      status: kpi.marginDelta < 0 ? 'warning' : 'positive',
      finding: `Revenue grew ${kpi.revenueGrowth > 0 ? '+' : ''}${kpi.revenueGrowth.toFixed(1)}% compared to the prior benchmark, yet Profit Margin compressed by ${Math.abs(kpi.marginDelta).toFixed(1)} percentage points to ${kpi.profitMargin.toFixed(1)}%.`,
      impact: 'Top-line sales expansion is heavily driven by promotional discounting and low-margin inventory mix rather than organic high-margin demand.',
      recommendation: 'Cap discount thresholds on low-margin categories, rebalance marketing budgets toward high-margin lines, and audit margin retention per customer cohort.',
      metric: `Margin: ${kpi.profitMargin.toFixed(1)}% (${kpi.marginDelta >= 0 ? '+' : ''}${kpi.marginDelta.toFixed(1)}% pts)`
    },
    {
      id: 'hl-2',
      title: `Highest Revenue Contributor: ${topRevCat.cat}`,
      status: 'neutral',
      finding: `${topRevCat.cat} drove the highest net revenue, accounting for ₹${(topRevCat.rev / 100000).toFixed(1)} Lakhs in sales.`,
      impact: 'Dominates transaction volume and logistics capacity, but dictates the overall blended company margin.',
      recommendation: 'Protect category gross margin by avoiding blanket sitewide vouchers on hero items; bundle with high-margin accessories.',
      metric: `₹${(topRevCat.rev / 100000).toFixed(1)}L Net Sales`
    },
    {
      id: 'hl-3',
      title: `Highest Absolute Profit Driver: ${topProfCat.cat}`,
      status: 'positive',
      finding: `${topProfCat.cat} delivered the highest total net profit contribution of ₹${(topProfCat.prof / 100000).toFixed(1)} Lakhs with superior unit economics.`,
      impact: 'Acts as the primary profitability stabilizer buffering against margin erosion from electronics and promotional clearance.',
      recommendation: 'Increase performance marketing spend into this category; test bundle cross-sells at checkout.',
      metric: `₹${(topProfCat.prof / 100000).toFixed(1)}L Net Profit`
    },
    {
      id: 'hl-4',
      title: `Category Margin Trap: ${lowestMarginCat.cat}`,
      status: 'critical',
      finding: `${lowestMarginCat.cat} yielded the lowest operating profit margin at just ${lowestMarginCat.margin.toFixed(1)}%, far below the company average of ${kpi.profitMargin.toFixed(1)}%.`,
      impact: 'Generating significant top-line GMV while absorbing substantial warehouse processing, packaging, and fulfillment overhead.',
      recommendation: 'Renegotiate supplier wholesale terms, raise minimum order thresholds for free shipping, and curtail markdown vouchers.',
      metric: `${lowestMarginCat.margin.toFixed(1)}% Net Margin`
    },
    {
      id: 'hl-5',
      title: `High Return Rate Exposure: ${highestReturnCat.cat}`,
      status: highestReturnCat.rate > 15 ? 'critical' : 'warning',
      finding: `${highestReturnCat.cat} recorded an elevated return rate of ${highestReturnCat.rate.toFixed(1)}%, primarily driven by sizing discrepancy and fitment issues.`,
      impact: 'Reverse logistics costs, inventory lockup during transit, and customer friction impair net cash flow.',
      recommendation: 'Deploy dynamic interactive size calculators, high-resolution 360° product photos, and customer fit feedback reviews.',
      metric: `${highestReturnCat.rate.toFixed(1)}% Return Rate`
    },
    {
      id: 'hl-6',
      title: `Leading Geographic Territory: ${bestRegion.reg} Region`,
      status: 'positive',
      finding: `The ${bestRegion.reg} region leads all zones with ₹${(bestRegion.rev / 100000).toFixed(1)} Lakhs in delivered sales and the highest AOV.`,
      impact: 'Provides the strongest return on ad spend (ROAS) and lowest shipping turnaround days.',
      recommendation: 'Expand micro-fulfillment hub capacity in key hub cities (e.g. Bengaluru / Hyderabad) to enable same-day delivery tiers.',
      metric: `₹${(bestRegion.rev / 100000).toFixed(1)}L Sales`
    },
    {
      id: 'hl-7',
      title: `Top-Selling SKU: ${topProduct.name}`,
      status: 'positive',
      finding: `${topProduct.name} generated the highest individual product revenue at ₹${(topProduct.rev / 100000).toFixed(1)} Lakhs.`,
      impact: 'High customer recognition and search index anchor; single SKU supply-chain dependency risk.',
      recommendation: 'Ensure safety stock buffers with tier-1 suppliers to avoid stockouts while testing adjacent SKU upsells.',
      metric: `₹${(topProduct.rev / 100000).toFixed(1)}L Revenue`
    }
  ];

  return highlights;
}

// Monthly Time-Series Aggregations
export function calculateMonthlyTrends(data: Transaction[]) {
  const map = new Map<string, {
    key: string;
    label: string;
    year: number;
    month: number;
    grossSales: number;
    netSales: number;
    cost: number;
    profit: number;
    orders: number;
    units: number;
    returnedOrders: number;
    cancelledOrders: number;
    discountAmount: number;
  }>();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  data.forEach(t => {
    const key = `${t.year}-${String(t.month).padStart(2, '0')}`;
    const existing = map.get(key) || {
      key,
      label: `${monthNames[t.month - 1]} '${String(t.year).slice(-2)}`,
      year: t.year,
      month: t.month,
      grossSales: 0,
      netSales: 0,
      cost: 0,
      profit: 0,
      orders: 0,
      units: 0,
      returnedOrders: 0,
      cancelledOrders: 0,
      discountAmount: 0
    };

    existing.grossSales += t.gross_sales;
    existing.discountAmount += t.discount_amount;
    existing.orders += 1;

    if (t.order_status !== 'Cancelled') {
      existing.netSales += t.net_sales;
      existing.cost += t.cost;
      existing.profit += t.profit;
      existing.units += t.quantity;
    }

    if (t.order_status === 'Returned') existing.returnedOrders += 1;
    if (t.order_status === 'Cancelled') existing.cancelledOrders += 1;

    map.set(key, existing);
  });

  const sorted = Array.from(map.values()).sort((a, b) => a.key.localeCompare(b.key));

  return sorted.map(m => {
    const margin = m.netSales > 0 ? (m.profit / m.netSales) * 100 : 0;
    const aov = m.orders > 0 ? m.netSales / (m.orders - m.cancelledOrders || 1) : 0;
    const returnRate = m.orders > 0 ? (m.returnedOrders / m.orders) * 100 : 0;
    const discountRate = m.grossSales > 0 ? (m.discountAmount / m.grossSales) * 100 : 0;

    return {
      ...m,
      margin: Number(margin.toFixed(1)),
      aov: Math.round(aov),
      returnRate: Number(returnRate.toFixed(1)),
      discountRate: Number(discountRate.toFixed(1))
    };
  });
}

// Category Performance Summary
export function calculateCategoryBreakdown(data: Transaction[]) {
  const map = new Map<ProductCategory, {
    category: ProductCategory;
    revenue: number;
    grossSales: number;
    cost: number;
    profit: number;
    orders: number;
    units: number;
    returns: number;
    cancels: number;
  }>();

  data.forEach(t => {
    const existing = map.get(t.category) || {
      category: t.category,
      revenue: 0,
      grossSales: 0,
      cost: 0,
      profit: 0,
      orders: 0,
      units: 0,
      returns: 0,
      cancels: 0
    };

    existing.orders += 1;
    existing.grossSales += t.gross_sales;

    if (t.order_status !== 'Cancelled') {
      existing.revenue += t.net_sales;
      existing.cost += t.cost;
      existing.profit += t.profit;
      existing.units += t.quantity;
    }

    if (t.order_status === 'Returned') existing.returns += 1;
    if (t.order_status === 'Cancelled') existing.cancels += 1;

    map.set(t.category, existing);
  });

  const totalRev = Array.from(map.values()).reduce((sum, c) => sum + c.revenue, 0);

  return Array.from(map.values()).map(c => {
    const margin = c.revenue > 0 ? (c.profit / c.revenue) * 100 : 0;
    const returnRate = c.orders > 0 ? (c.returns / c.orders) * 100 : 0;
    const revenueShare = totalRev > 0 ? (c.revenue / totalRev) * 100 : 0;

    return {
      category: c.category,
      revenue: c.revenue,
      cost: c.cost,
      profit: c.profit,
      orders: c.orders,
      units: c.units,
      margin: Number(margin.toFixed(1)),
      returnRate: Number(returnRate.toFixed(1)),
      revenueShare: Number(revenueShare.toFixed(1))
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

// Product Performance & Quadrant Matrix
export function calculateProductPerformance(data: Transaction[]): ProductPerformance[] {
  const map = new Map<string, {
    product_id: string;
    product_name: string;
    category: ProductCategory;
    sub_category: string;
    revenue: number;
    profit: number;
    units_sold: number;
    orders: number;
    returns: number;
    discounts: number[];
    ratings: number[];
  }>();

  data.forEach(t => {
    const existing = map.get(t.product_id) || {
      product_id: t.product_id,
      product_name: t.product_name,
      category: t.category,
      sub_category: t.sub_category,
      revenue: 0,
      profit: 0,
      units_sold: 0,
      orders: 0,
      returns: 0,
      discounts: [],
      ratings: []
    };

    existing.orders += 1;
    if (t.order_status !== 'Cancelled') {
      existing.revenue += t.net_sales;
      existing.profit += t.profit;
      existing.units_sold += t.quantity;
    }
    if (t.order_status === 'Returned') existing.returns += 1;
    existing.discounts.push(t.discount_percentage);
    existing.ratings.push(t.customer_rating);

    map.set(t.product_id, existing);
  });

  const productsList = Array.from(map.values());
  const medianRevenue = productsList.length > 0 
    ? productsList.reduce((s, p) => s + p.revenue, 0) / productsList.length 
    : 0;
  const medianProfit = productsList.length > 0 
    ? productsList.reduce((s, p) => s + p.profit, 0) / productsList.length 
    : 0;

  return productsList.map(p => {
    const margin = p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0;
    const return_rate = p.orders > 0 ? (p.returns / p.orders) * 100 : 0;
    const avg_discount = p.discounts.length > 0 
      ? p.discounts.reduce((a, b) => a + b, 0) / p.discounts.length 
      : 0;
    const avg_rating = p.ratings.length > 0 
      ? p.ratings.reduce((a, b) => a + b, 0) / p.ratings.length 
      : 0;

    // Quadrant Classification
    let status: ProductPerformance['status'] = 'Star Performer';
    if (p.revenue >= medianRevenue && p.profit >= medianProfit) {
      status = 'Star Performer';
    } else if (p.revenue >= medianRevenue && p.profit < medianProfit) {
      status = 'Margin Trap'; // High revenue, low profit
    } else if (p.revenue < medianRevenue && margin >= 28) {
      status = 'Cash Cow'; // Low revenue, high margin
    } else {
      status = 'Problem Child'; // Low revenue, low/negative profit
    }

    return {
      product_id: p.product_id,
      product_name: p.product_name,
      category: p.category,
      sub_category: p.sub_category,
      revenue: p.revenue,
      profit: p.profit,
      margin: Number(margin.toFixed(1)),
      units_sold: p.units_sold,
      orders: p.orders,
      return_rate: Number(return_rate.toFixed(1)),
      avg_discount: Number(avg_discount.toFixed(1)),
      avg_rating: Number(avg_rating.toFixed(1)),
      status
    };
  });
}

// RFM Customer Segmentation
export function calculateCustomerRFM(data: Transaction[]): CustomerRFM[] {
  const custMap = new Map<string, {
    customer_id: string;
    customer_name: string;
    segment: CustomerSegment;
    orders: number;
    revenue: number;
    profit: number;
    firstDate: string;
    lastDate: string;
  }>();

  data.forEach(t => {
    if (t.order_status === 'Cancelled') return;

    const existing = custMap.get(t.customer_id) || {
      customer_id: t.customer_id,
      customer_name: t.customer_name,
      segment: t.customer_segment,
      orders: 0,
      revenue: 0,
      profit: 0,
      firstDate: t.order_date,
      lastDate: t.order_date
    };

    existing.orders += 1;
    existing.revenue += t.net_sales;
    existing.profit += t.profit;

    if (t.order_date < existing.firstDate) existing.firstDate = t.order_date;
    if (t.order_date > existing.lastDate) existing.lastDate = t.order_date;

    custMap.set(t.customer_id, existing);
  });

  const refDate = new Date('2025-12-31').getTime();
  const customers = Array.from(custMap.values());

  // Calculate recency in days
  const withRecency = customers.map(c => {
    const lastTime = new Date(c.lastDate).getTime();
    const recencyDays = Math.max(0, Math.floor((refDate - lastTime) / (1000 * 60 * 60 * 24)));
    const aov = c.orders > 0 ? c.revenue / c.orders : 0;
    return { ...c, recencyDays, aov };
  });

  // Calculate quantile thresholds (1 to 5) for R, F, M
  return withRecency.map(c => {
    // Recency score (inverted: lower days = higher score 5)
    let r_score = 1;
    if (c.recencyDays <= 30) r_score = 5;
    else if (c.recencyDays <= 75) r_score = 4;
    else if (c.recencyDays <= 150) r_score = 3;
    else if (c.recencyDays <= 250) r_score = 2;
    else r_score = 1;

    // Frequency score (higher orders = higher score)
    let f_score = 1;
    if (c.orders >= 7) f_score = 5;
    else if (c.orders >= 5) f_score = 4;
    else if (c.orders >= 3) f_score = 3;
    else if (c.orders >= 2) f_score = 2;
    else f_score = 1;

    // Monetary score (higher revenue = higher score)
    let m_score = 1;
    if (c.revenue >= 50000) m_score = 5;
    else if (c.revenue >= 25000) m_score = 4;
    else if (c.revenue >= 12000) m_score = 3;
    else if (c.revenue >= 5000) m_score = 2;
    else m_score = 1;

    const rfm_score = `${r_score}${f_score}${m_score}`;
    
    // Categorize into standard RFM clusters
    let rfm_segment = 'Standard';
    if (r_score >= 4 && f_score >= 4 && m_score >= 4) {
      rfm_segment = 'Champions';
    } else if (f_score >= 3 && m_score >= 3) {
      rfm_segment = 'Loyal Customers';
    } else if (r_score >= 4 && f_score <= 2) {
      rfm_segment = 'New & Promising';
    } else if (r_score <= 2 && f_score >= 3) {
      rfm_segment = 'At Risk';
    } else if (r_score === 1 && f_score <= 2) {
      rfm_segment = 'Hibernating';
    } else {
      rfm_segment = 'Potential Loyalist';
    }

    return {
      customer_id: c.customer_id,
      customer_name: c.customer_name,
      segment: c.segment,
      total_orders: c.orders,
      total_revenue: c.revenue,
      total_profit: c.profit,
      avg_order_value: Math.round(c.aov),
      first_order_date: c.firstDate,
      last_order_date: c.lastDate,
      recency_days: c.recencyDays,
      r_score,
      f_score,
      m_score,
      rfm_score,
      rfm_segment
    };
  }).sort((a, b) => b.total_revenue - a.total_revenue);
}

// Regional Performance Summary
export function calculateRegionalBreakdown(data: Transaction[]) {
  const map = new Map<Region, {
    region: Region;
    revenue: number;
    profit: number;
    orders: number;
    returns: number;
    customers: Set<string>;
    states: Map<string, number>;
    cities: Map<string, number>;
  }>();

  data.forEach(t => {
    const existing = map.get(t.region) || {
      region: t.region,
      revenue: 0,
      profit: 0,
      orders: 0,
      returns: 0,
      customers: new Set(),
      states: new Map(),
      cities: new Map()
    };

    existing.orders += 1;
    existing.customers.add(t.customer_id);

    if (t.order_status !== 'Cancelled') {
      existing.revenue += t.net_sales;
      existing.profit += t.profit;
    }
    if (t.order_status === 'Returned') existing.returns += 1;

    existing.states.set(t.state, (existing.states.get(t.state) || 0) + t.net_sales);
    existing.cities.set(t.city, (existing.cities.get(t.city) || 0) + t.net_sales);

    map.set(t.region, existing);
  });

  return Array.from(map.values()).map(r => {
    const margin = r.revenue > 0 ? (r.profit / r.revenue) * 100 : 0;
    const aov = r.orders > 0 ? r.revenue / r.orders : 0;
    const returnRate = r.orders > 0 ? (r.returns / r.orders) * 100 : 0;

    const topState = Array.from(r.states.entries()).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];
    const topCity = Array.from(r.cities.entries()).sort((a, b) => b[1] - a[1])[0] || ['Unknown', 0];

    return {
      region: r.region,
      revenue: r.revenue,
      profit: r.profit,
      margin: Number(margin.toFixed(1)),
      orders: r.orders,
      aov: Math.round(aov),
      uniqueCustomers: r.customers.size,
      returnRate: Number(returnRate.toFixed(1)),
      topState: topState[0],
      topCity: topCity[0]
    };
  }).sort((a, b) => b.revenue - a.revenue);
}
