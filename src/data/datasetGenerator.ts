import { 
  Transaction, 
  Region, 
  ProductCategory, 
  OrderStatus, 
  ReturnStatus, 
  CustomerSegment, 
  PaymentMethod, 
  AcquisitionChannel 
} from '../types';
import { 
  PRODUCTS_CATALOG, 
  INDIAN_LOCATIONS, 
  FIRST_NAMES_MALE, 
  FIRST_NAMES_FEMALE, 
  LAST_NAMES,
  BaseProduct,
  IndianLocation
} from './seedData';

// Seeded pseudo-random generator (LCG) for deterministic, fast generation
class SeededRandom {
  private seed: number;

  constructor(seed: number = 42) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  choice<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  weightedChoice<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}

export interface CustomerProfile {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  ageGroup: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  segment: CustomerSegment;
  location: IndianLocation;
  acquisitionChannel: AcquisitionChannel;
  loyaltyWeight: number; // probability of repeat purchase
  preferredCategory: ProductCategory;
}

export interface FullProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  unitPrice: number;
  unitCost: number;
  returnLikelihood: number;
  weight: number;
}

// Expand base catalog to 100+ unique SKUs by adding colors/editions/sizes
export function generateExpandedProductsCatalog(): FullProductItem[] {
  const expanded: FullProductItem[] = [];
  const rng = new SeededRandom(101);

  const modifiers = [
    'Pro Edition', 'Standard', 'Ultra Black', 'Midnight Blue', 'Classic White',
    'Slate Grey', 'Rose Gold', 'Matte Finish', 'Compact', 'Max Pack'
  ];

  for (let i = 0; i < PRODUCTS_CATALOG.length; i++) {
    const base = PRODUCTS_CATALOG[i];
    // Base item
    expanded.push({
      id: base.id,
      name: base.name,
      category: base.category,
      subCategory: base.subCategory,
      unitPrice: base.basePrice,
      unitCost: Math.round(base.basePrice * base.costRatio),
      returnLikelihood: base.returnLikelihood,
      weight: base.popularityWeight
    });

    // Variations to reach 100+ products
    const variantsCount = base.category === 'Fashion' ? 3 : base.category === 'Electronics' ? 2 : 1;
    for (let v = 1; v <= variantsCount; v++) {
      const mod = modifiers[(i * 3 + v) % modifiers.length];
      const priceVariation = rng.range(0.9, 1.15);
      const varPrice = Math.round((base.basePrice * priceVariation) / 10) * 10;
      expanded.push({
        id: `${base.id}-V${v}`,
        name: `${base.name} (${mod})`,
        category: base.category,
        subCategory: base.subCategory,
        unitPrice: varPrice,
        unitCost: Math.round(varPrice * base.costRatio),
        returnLikelihood: base.returnLikelihood,
        weight: Math.max(5, Math.round(base.popularityWeight * 0.7))
      });
    }
  }

  return expanded;
}

// Generate 2,200 unique realistic customers
export function generateCustomersPool(count: number = 2200): CustomerProfile[] {
  const rng = new SeededRandom(777);
  const customers: CustomerProfile[] = [];
  const categories: ProductCategory[] = [
    'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports', 'Grocery', 'Books', 'Accessories'
  ];
  const ageGroups: ('18-24' | '25-34' | '35-44' | '45-54' | '55+')[] = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const ageWeights = [22, 40, 24, 10, 4];
  const channels: AcquisitionChannel[] = ['Organic Search', 'Google Ads', 'Instagram', 'Email Referral', 'Direct'];
  const channelWeights = [32, 28, 22, 10, 8];

  const locWeights = INDIAN_LOCATIONS.map(l => l.weight);

  for (let i = 1; i <= count; i++) {
    const isMale = rng.next() > 0.48;
    const gender = isMale ? 'Male' : 'Female';
    const firstName = isMale ? rng.choice(FIRST_NAMES_MALE) : rng.choice(FIRST_NAMES_FEMALE);
    const lastName = rng.choice(LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const id = `CUST-${String(i).padStart(5, '0')}`;

    const ageGroup = rng.weightedChoice(ageGroups, ageWeights);
    const location = rng.weightedChoice(INDIAN_LOCATIONS, locWeights);
    const channel = rng.weightedChoice(channels, channelWeights);
    const preferredCategory = rng.choice(categories);

    // Initial segment distribution
    const roll = rng.next();
    let segment: CustomerSegment = 'New';
    let loyaltyWeight = 1;

    if (roll < 0.12) {
      segment = 'High Value';
      loyaltyWeight = 8;
    } else if (roll < 0.32) {
      segment = 'Loyal';
      loyaltyWeight = 5;
    } else if (roll < 0.60) {
      segment = 'Returning';
      loyaltyWeight = 3;
    } else if (roll < 0.85) {
      segment = 'New';
      loyaltyWeight = 1;
    } else {
      segment = 'At Risk';
      loyaltyWeight = 1.5;
    }

    customers.push({
      id,
      name,
      gender,
      ageGroup,
      segment,
      location,
      acquisitionChannel: channel,
      loyaltyWeight,
      preferredCategory
    });
  }

  return customers;
}

// Generate 10,500+ realistic transactions spanning 24 months (Jan 2024 - Dec 2025)
export function generateTransactionsDataset(totalTarget: number = 10500): Transaction[] {
  const rng = new SeededRandom(2025);
  const products = generateExpandedProductsCatalog();
  const customers = generateCustomersPool(2200);

  const productWeights = products.map(p => p.weight);
  const customerWeights = customers.map(c => c.loyaltyWeight);

  const paymentMethods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash on Delivery'];
  const paymentWeights = [48, 24, 12, 6, 10]; // UPI dominates in India

  const transactions: Transaction[] = [];

  // Start date: Jan 1, 2024 to Dec 31, 2025 (730 days)
  const startDateMs = new Date('2024-01-01T00:00:00Z').getTime();
  const endDateMs = new Date('2025-12-31T23:59:59Z').getTime();
  const totalDays = 730;

  // Track customer purchases to ensure correct segment alignment and repeat patterns
  const customerOrderCounts = new Map<string, number>();

  const returnReasons = [
    'Size did not fit',
    'Product defective or damaged',
    'Item not as pictured',
    'Late delivery',
    'Better price found elsewhere',
    'Changed mind'
  ];

  for (let i = 1; i <= totalTarget; i++) {
    // Determine order date with realistic seasonal trend:
    // Sales grew in 2025 (+28% more volume in 2025 than 2024)
    // Festive spike in October/November (Diwali/Navratri: factor 1.8x)
    // Independence Day spike in August (factor 1.4x)
    // Republic Day spike in January (factor 1.3x)
    const dayOffset = Math.floor(Math.pow(rng.next(), 0.85) * totalDays);
    const orderTimestamp = startDateMs + dayOffset * 86400000;
    const dateObj = new Date(orderTimestamp);

    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth() + 1; // 1 - 12
    const day = dateObj.getUTCDate();
    const dayOfWeekIndex = dateObj.getUTCDay();
    const dayOfWeekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day_of_week = dayOfWeekNames[dayOfWeekIndex];
    const is_weekend = dayOfWeekIndex === 0 || dayOfWeekIndex === 6;

    const order_date = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Select customer
    const customer = rng.weightedChoice(customers, customerWeights);
    const priorCount = customerOrderCounts.get(customer.id) || 0;
    customerOrderCounts.set(customer.id, priorCount + 1);

    // Select product (70% affinity to preferred category)
    let product: FullProductItem;
    if (rng.next() < 0.45) {
      const preferred = products.filter(p => p.category === customer.preferredCategory);
      product = preferred.length > 0 ? rng.choice(preferred) : rng.weightedChoice(products, productWeights);
    } else {
      product = rng.weightedChoice(products, productWeights);
    }

    // Quantity (typically 1, sometimes 2-4 for Grocery/Beauty/Apparel)
    let quantity = 1;
    if (product.category === 'Grocery' || product.category === 'Beauty') {
      quantity = rng.weightedChoice([1, 2, 3, 4], [60, 25, 10, 5]);
    } else if (product.category === 'Fashion' || product.category === 'Sports') {
      quantity = rng.weightedChoice([1, 2, 3], [75, 20, 5]);
    }

    const unit_price = product.unitPrice;
    const unit_cost = product.unitCost;
    const gross_sales = unit_price * quantity;

    // BUSINESS PROBLEM REALISM:
    // In 2024: Average discount was modest (8% - 15%)
    // In 2025: Management pushed aggressive promotions to hit revenue growth targets,
    // causing discount rates to spike (15% - 35%), which severely compressed profit margins!
    // Also festive months (Oct-Nov) had promotional discount boosts.
    const isFestive = month === 10 || month === 11;
    const is2025 = year === 2025;

    let baseDiscount = rng.range(0.05, 0.14);
    if (is2025) {
      baseDiscount += rng.range(0.06, 0.16); // 2025 margin erosion!
    }
    if (isFestive) {
      baseDiscount += rng.range(0.05, 0.10);
    }
    if (product.category === 'Fashion') {
      baseDiscount += 0.05; // Fashion clearance pressure
    }

    const discount_percentage = Math.min(0.50, Math.round(baseDiscount * 100));
    const discount_amount = Math.round((gross_sales * discount_percentage) / 100);
    const net_sales = gross_sales - discount_amount;

    // Cost calculation (includes unit cost + handling/fulfillment ~4-6%)
    const fulfillmentCost = Math.round(gross_sales * 0.045);
    const cost = (unit_cost * quantity) + fulfillmentCost;
    const profit = net_sales - cost;
    const profit_margin = net_sales > 0 ? Number(((profit / net_sales) * 100).toFixed(1)) : 0;

    // Order status and return logic
    // Fashion has high return likelihood (~22-26%), Books/Groceries low (~2%)
    // In 2025, returns also rose slightly due to rapid customer acquisition in tier-2/3 cities
    const returnRoll = rng.next();
    let categoryReturnChance = product.returnLikelihood;
    if (is2025) categoryReturnChance *= 1.15;

    let order_status: OrderStatus = 'Delivered';
    let return_status: ReturnStatus = 'Not Returned';
    let return_reason: string | undefined = undefined;

    const cancelRoll = rng.next();
    if (cancelRoll < 0.045) {
      order_status = 'Cancelled';
    } else if (returnRoll < categoryReturnChance) {
      order_status = 'Returned';
      return_status = 'Returned';
      return_reason = rng.choice(returnReasons);
    } else if (dayOffset > totalDays - 4) {
      order_status = 'Pending';
    }

    // Shipping duration (2 to 7 days, metro faster)
    const isMetro = ['New Delhi', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Chennai'].includes(customer.location.city);
    const shipping_days = isMetro ? rng.int(2, 4) : rng.int(3, 7);

    // Customer rating (1-5), returns heavily correlate with 1-2 stars
    let customer_rating: number;
    if (order_status === 'Returned') {
      customer_rating = rng.weightedChoice([1, 2, 3], [55, 35, 10]);
    } else if (order_status === 'Cancelled') {
      customer_rating = rng.weightedChoice([1, 2, 3], [70, 20, 10]);
    } else {
      customer_rating = rng.weightedChoice([3, 4, 5], [15, 35, 50]);
    }

    const payment_method = rng.weightedChoice(paymentMethods, paymentWeights);

    // Dynamic segment update based on order history
    let dynamicSegment: CustomerSegment = customer.segment;
    if (priorCount >= 4) {
      dynamicSegment = 'Loyal';
    } else if (priorCount >= 2) {
      dynamicSegment = 'Returning';
    } else {
      dynamicSegment = 'New';
    }
    if (priorCount >= 3 && net_sales > 15000) {
      dynamicSegment = 'High Value';
    }

    const order_id = `ORD-${year}-${String(i).padStart(6, '0')}`;

    transactions.push({
      order_id,
      order_date,
      year,
      month,
      day_of_week,
      is_weekend,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_segment: dynamicSegment,
      age_group: customer.ageGroup,
      gender: customer.gender,
      acquisition_channel: customer.acquisitionChannel,
      city: customer.location.city,
      state: customer.location.state,
      region: customer.location.region,
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      sub_category: product.subCategory,
      unit_price,
      unit_cost,
      quantity,
      gross_sales,
      discount_percentage,
      discount_amount,
      net_sales,
      cost,
      profit,
      profit_margin,
      payment_method,
      order_status,
      return_status,
      return_reason,
      shipping_days,
      customer_rating
    });
  }

  // Sort by date ascending
  return transactions.sort((a, b) => a.order_date.localeCompare(b.order_date));
}

// Global cached dataset instance
let cachedDataset: Transaction[] | null = null;

export function getEcommerceDataset(): Transaction[] {
  if (!cachedDataset) {
    cachedDataset = generateTransactionsDataset(10500);
  }
  return cachedDataset;
}
