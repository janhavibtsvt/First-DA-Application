import { ProductCategory, Region } from '../types';

export interface BaseProduct {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory: string;
  basePrice: number;
  costRatio: number; // Wholesale cost as % of price
  returnLikelihood: number; // 0 to 1
  popularityWeight: number; // How often ordered
}

export const PRODUCTS_CATALOG: BaseProduct[] = [
  // --- ELECTRONICS (High price, low margin, moderate returns) ---
  { id: 'EL-001', name: 'Nova Pro 5G Smartphone (128GB)', category: 'Electronics', subCategory: 'Smartphones', basePrice: 24999, costRatio: 0.86, returnLikelihood: 0.08, popularityWeight: 18 },
  { id: 'EL-002', name: 'Apex UltraBook 14" i5', category: 'Electronics', subCategory: 'Laptops', basePrice: 58999, costRatio: 0.88, returnLikelihood: 0.06, popularityWeight: 9 },
  { id: 'EL-003', name: 'BassPulse ANC Wireless Earbuds', category: 'Electronics', subCategory: 'Audio', basePrice: 3499, costRatio: 0.62, returnLikelihood: 0.12, popularityWeight: 25 },
  { id: 'EL-004', name: 'Chronos Fit Smartwatch Gen 4', category: 'Electronics', subCategory: 'Wearables', basePrice: 4299, costRatio: 0.68, returnLikelihood: 0.10, popularityWeight: 22 },
  { id: 'EL-005', name: 'VoltCharge 20000mAh Power Bank', category: 'Electronics', subCategory: 'Accessories', basePrice: 1699, costRatio: 0.58, returnLikelihood: 0.05, popularityWeight: 30 },
  { id: 'EL-006', name: 'ViewMax 27" IPS 144Hz Monitor', category: 'Electronics', subCategory: 'Monitors', basePrice: 17499, costRatio: 0.82, returnLikelihood: 0.07, popularityWeight: 7 },
  { id: 'EL-007', name: 'SonicBoom Portable Bluetooth Speaker', category: 'Electronics', subCategory: 'Audio', basePrice: 2199, costRatio: 0.60, returnLikelihood: 0.06, popularityWeight: 20 },
  { id: 'EL-008', name: 'HyperGlide Wireless Optical Mouse', category: 'Electronics', subCategory: 'Computer Peripherals', basePrice: 899, costRatio: 0.52, returnLikelihood: 0.04, popularityWeight: 28 },
  { id: 'EL-009', name: 'MechKeys RGB Mechanical Keyboard', category: 'Electronics', subCategory: 'Computer Peripherals', basePrice: 3899, costRatio: 0.65, returnLikelihood: 0.07, popularityWeight: 14 },
  { id: 'EL-010', name: 'ClearCam 1080p FHD USB Webcam', category: 'Electronics', subCategory: 'Computer Peripherals', basePrice: 1999, costRatio: 0.55, returnLikelihood: 0.05, popularityWeight: 16 },
  { id: 'EL-011', name: 'UltraSync 1TB External SSD USB-C', category: 'Electronics', subCategory: 'Storage', basePrice: 7499, costRatio: 0.84, returnLikelihood: 0.03, popularityWeight: 12 },
  { id: 'EL-012', name: '65W GaN Fast Dual-Port Wall Charger', category: 'Electronics', subCategory: 'Accessories', basePrice: 1499, costRatio: 0.48, returnLikelihood: 0.04, popularityWeight: 35 },
  { id: 'EL-013', name: 'Lumiere Smart WiFi LED Desk Lamp', category: 'Electronics', subCategory: 'Smart Home', basePrice: 2299, costRatio: 0.58, returnLikelihood: 0.05, popularityWeight: 11 },

  // --- FASHION (Moderate price, HIGH return rate due to size/fit, high markdown) ---
  { id: 'FA-001', name: 'Raw Indigo Slim-Fit Denim Jeans', category: 'Fashion', subCategory: "Men's Apparel", basePrice: 2499, costRatio: 0.52, returnLikelihood: 0.24, popularityWeight: 28 },
  { id: 'FA-002', name: 'Handcrafted Chanderi Silk Saree', category: 'Fashion', subCategory: "Women's Ethnic", basePrice: 4899, costRatio: 0.48, returnLikelihood: 0.16, popularityWeight: 15 },
  { id: 'FA-003', name: 'Breeze Cotton Printed Kurti Set', category: 'Fashion', subCategory: "Women's Ethnic", basePrice: 1799, costRatio: 0.42, returnLikelihood: 0.22, popularityWeight: 32 },
  { id: 'FA-004', name: 'Classic Oxford Formal Button-Down', category: 'Fashion', subCategory: "Men's Apparel", basePrice: 1899, costRatio: 0.46, returnLikelihood: 0.19, popularityWeight: 26 },
  { id: 'FA-005', name: 'UrbanStreet Retro White Sneakers', category: 'Fashion', subCategory: 'Footwear', basePrice: 3299, costRatio: 0.55, returnLikelihood: 0.26, popularityWeight: 24 },
  { id: 'FA-006', name: 'AeroDry Performance Running T-Shirt', category: 'Fashion', subCategory: 'Sportswear', basePrice: 899, costRatio: 0.38, returnLikelihood: 0.15, popularityWeight: 35 },
  { id: 'FA-007', name: 'All-Weather Quilted Bomber Jacket', category: 'Fashion', subCategory: 'Outerwear', basePrice: 3999, costRatio: 0.54, returnLikelihood: 0.21, popularityWeight: 14 },
  { id: 'FA-008', name: 'Boho Floral Midi Summer Dress', category: 'Fashion', subCategory: "Women's Western", basePrice: 2199, costRatio: 0.40, returnLikelihood: 0.25, popularityWeight: 22 },
  { id: 'FA-009', name: 'ComfortFlex Chino Trousers', category: 'Fashion', subCategory: "Men's Apparel", basePrice: 1999, costRatio: 0.48, returnLikelihood: 0.18, popularityWeight: 20 },
  { id: 'FA-010', name: 'Casual Canvas Slip-On Loafers', category: 'Fashion', subCategory: 'Footwear', basePrice: 1599, costRatio: 0.50, returnLikelihood: 0.23, popularityWeight: 19 },
  { id: 'FA-011', name: 'Organic Cotton Graphic Oversized Tee', category: 'Fashion', subCategory: 'Streetwear', basePrice: 999, costRatio: 0.35, returnLikelihood: 0.14, popularityWeight: 38 },
  { id: 'FA-012', name: 'Embroidered Anarkali Festive Gown', category: 'Fashion', subCategory: "Women's Ethnic", basePrice: 5999, costRatio: 0.46, returnLikelihood: 0.20, popularityWeight: 12 },
  { id: 'FA-013', name: 'Seamless High-Waist Gym Leggings', category: 'Fashion', subCategory: 'Sportswear', basePrice: 1299, costRatio: 0.38, returnLikelihood: 0.17, popularityWeight: 27 },

  // --- HOME & KITCHEN (Mid-high ticket, steady margins, low returns) ---
  { id: 'HK-001', name: 'CrispAir Digital 4.5L Air Fryer', category: 'Home & Kitchen', subCategory: 'Small Appliances', basePrice: 6499, costRatio: 0.62, returnLikelihood: 0.06, popularityWeight: 16 },
  { id: 'HK-002', name: 'CastCraft 3-Piece Pre-Seasoned Skillet', category: 'Home & Kitchen', subCategory: 'Cookware', basePrice: 2899, costRatio: 0.50, returnLikelihood: 0.04, popularityWeight: 18 },
  { id: 'HK-003', name: 'PureFlow 7-Stage RO Water Purifier', category: 'Home & Kitchen', subCategory: 'Water Purifiers', basePrice: 12999, costRatio: 0.70, returnLikelihood: 0.05, popularityWeight: 8 },
  { id: 'HK-004', name: '400TC Egyptian Cotton King Bed Sheet', category: 'Home & Kitchen', subCategory: 'Home Furnishing', basePrice: 2499, costRatio: 0.44, returnLikelihood: 0.07, popularityWeight: 20 },
  { id: 'HK-005', name: 'NutriBlend 750W Mixer Grinder 3-Jar', category: 'Home & Kitchen', subCategory: 'Small Appliances', basePrice: 3899, costRatio: 0.64, returnLikelihood: 0.05, popularityWeight: 22 },
  { id: 'HK-006', name: 'ErgoRest Orthopedic Memory Foam Pillow', category: 'Home & Kitchen', subCategory: 'Bedding', basePrice: 1799, costRatio: 0.42, returnLikelihood: 0.08, popularityWeight: 19 },
  { id: 'HK-007', name: 'AromaMist Ultrasonic Essential Diffuser', category: 'Home & Kitchen', subCategory: 'Home Decor', basePrice: 1499, costRatio: 0.38, returnLikelihood: 0.05, popularityWeight: 17 },
  { id: 'HK-008', name: 'ThermoShield Stainless Electric Kettle', category: 'Home & Kitchen', subCategory: 'Small Appliances', basePrice: 1299, costRatio: 0.52, returnLikelihood: 0.04, popularityWeight: 26 },
  { id: 'HK-009', name: 'BakeWell 10-Piece Silicone Bakeware', category: 'Home & Kitchen', subCategory: 'Kitchenware', basePrice: 999, costRatio: 0.40, returnLikelihood: 0.03, popularityWeight: 21 },
  { id: 'HK-010', name: 'Ceramic Glazed 12-Piece Dinner Set', category: 'Home & Kitchen', subCategory: 'Tableware', basePrice: 3499, costRatio: 0.56, returnLikelihood: 0.09, popularityWeight: 10 },
  { id: 'HK-011', name: 'Dual-Bin Motion Sensor Trash Can', category: 'Home & Kitchen', subCategory: 'Storage & Org', basePrice: 2199, costRatio: 0.50, returnLikelihood: 0.05, popularityWeight: 12 },

  // --- BEAUTY & PERSONAL CARE (Low ticket, high gross margin ~65%, low returns) ---
  { id: 'BE-001', name: 'GlowRevive 10% Niacinamide Face Serum', category: 'Beauty', subCategory: 'Skincare', basePrice: 699, costRatio: 0.28, returnLikelihood: 0.04, popularityWeight: 36 },
  { id: 'BE-002', name: 'AquaGel SPF 50 PA++++ Sunscreen 80g', category: 'Beauty', subCategory: 'Sun Care', basePrice: 499, costRatio: 0.30, returnLikelihood: 0.03, popularityWeight: 42 },
  { id: 'BE-003', name: 'VelvetMatte Liquid Lip Tint (Ruby Red)', category: 'Beauty', subCategory: 'Makeup', basePrice: 549, costRatio: 0.25, returnLikelihood: 0.05, popularityWeight: 30 },
  { id: 'BE-004', name: 'RootStrengthen Red Onion Hair Oil 200ml', category: 'Beauty', subCategory: 'Haircare', basePrice: 399, costRatio: 0.32, returnLikelihood: 0.02, popularityWeight: 38 },
  { id: 'BE-005', name: 'Midnight Oud Luxury Eau de Parfum 100ml', category: 'Beauty', subCategory: 'Fragrances', basePrice: 2199, costRatio: 0.34, returnLikelihood: 0.06, popularityWeight: 18 },
  { id: 'BE-006', name: 'HydraPlump Hyaluronic Acid Gel Cream', category: 'Beauty', subCategory: 'Skincare', basePrice: 799, costRatio: 0.30, returnLikelihood: 0.03, popularityWeight: 26 },
  { id: 'BE-007', name: 'ClayDetox Charcoal Foaming Face Wash', category: 'Beauty', subCategory: 'Cleansers', basePrice: 349, costRatio: 0.27, returnLikelihood: 0.02, popularityWeight: 35 },
  { id: 'BE-008', name: 'Keratin Infused Hair Repair Mask 250g', category: 'Beauty', subCategory: 'Haircare', basePrice: 649, costRatio: 0.33, returnLikelihood: 0.03, popularityWeight: 24 },
  { id: 'BE-009', name: 'RoseGold Professional Facial Roller Kit', category: 'Beauty', subCategory: 'Tools', basePrice: 899, costRatio: 0.35, returnLikelihood: 0.05, popularityWeight: 15 },
  { id: 'BE-010', name: 'Gentle Derm Ultra-Soothing Cica Balm', category: 'Beauty', subCategory: 'Skincare', basePrice: 599, costRatio: 0.29, returnLikelihood: 0.03, popularityWeight: 21 },

  // --- SPORTS & FITNESS (Moderate ticket, healthy margins) ---
  { id: 'SP-001', name: 'ZenFlex Anti-Slip 6mm TPE Yoga Mat', category: 'Sports', subCategory: 'Yoga & Pilates', basePrice: 1299, costRatio: 0.45, returnLikelihood: 0.05, popularityWeight: 26 },
  { id: 'SP-002', name: 'TitanCore Hex Rubber Dumbbells (Pair 5kg)', category: 'Sports', subCategory: 'Strength Training', basePrice: 1899, costRatio: 0.58, returnLikelihood: 0.03, popularityWeight: 20 },
  { id: 'SP-003', name: 'AeroSmash Carbon Graphite Badminton Racket', category: 'Sports', subCategory: 'Racquet Sports', basePrice: 2499, costRatio: 0.52, returnLikelihood: 0.06, popularityWeight: 18 },
  { id: 'SP-004', name: 'FitLoop 5-Level Resistance Bands Set', category: 'Sports', subCategory: 'Fitness Accessories', basePrice: 699, costRatio: 0.35, returnLikelihood: 0.04, popularityWeight: 32 },
  { id: 'SP-005', name: 'ProIsolate 100% Whey Protein 1kg Choc', category: 'Sports', subCategory: 'Supplements', basePrice: 2899, costRatio: 0.66, returnLikelihood: 0.03, popularityWeight: 24 },
  { id: 'SP-006', name: 'HydraTrek 1000ml Insulated Gym Sipper', category: 'Sports', subCategory: 'Hydration', basePrice: 799, costRatio: 0.40, returnLikelihood: 0.02, popularityWeight: 28 },
  { id: 'SP-007', name: 'SpeedRope Weighted Bearing Jump Rope', category: 'Sports', subCategory: 'Cardio', basePrice: 499, costRatio: 0.38, returnLikelihood: 0.03, popularityWeight: 29 },
  { id: 'SP-008', name: 'GripMaster Adjustable Hand Gripper', category: 'Sports', subCategory: 'Strength Training', basePrice: 349, costRatio: 0.36, returnLikelihood: 0.02, popularityWeight: 25 },
  { id: 'SP-009', name: 'ProStrap Padded Weightlifting Wrist Wraps', category: 'Sports', subCategory: 'Strength Training', basePrice: 449, costRatio: 0.35, returnLikelihood: 0.03, popularityWeight: 22 },

  // --- GROCERY & GOURMET (High repeat, lower basket price, tight margins, tiny return) ---
  { id: 'GR-001', name: 'Organic Royale Aged Basmati Rice 5kg', category: 'Grocery', subCategory: 'Staples', basePrice: 799, costRatio: 0.76, returnLikelihood: 0.01, popularityWeight: 35 },
  { id: 'GR-002', name: 'Cold-Pressed Kachi Ghani Mustard Oil 2L', category: 'Grocery', subCategory: 'Oils & Ghee', basePrice: 450, costRatio: 0.78, returnLikelihood: 0.01, popularityWeight: 38 },
  { id: 'GR-003', name: 'Raw Whole California Almonds 500g', category: 'Grocery', subCategory: 'Dry Fruits', basePrice: 599, costRatio: 0.72, returnLikelihood: 0.02, popularityWeight: 30 },
  { id: 'GR-004', name: 'Darjeeling First Flush Whole Leaf Green Tea 250g', category: 'Grocery', subCategory: 'Beverages', basePrice: 499, costRatio: 0.55, returnLikelihood: 0.01, popularityWeight: 26 },
  { id: 'GR-005', name: 'Peri-Peri Roasted Crispy Makhana 200g', category: 'Grocery', subCategory: 'Healthy Snacks', basePrice: 299, costRatio: 0.50, returnLikelihood: 0.02, popularityWeight: 32 },
  { id: 'GR-006', name: 'Single-Origin 72% Dark Chocolate Bar 100g', category: 'Grocery', subCategory: 'Confectionery', basePrice: 249, costRatio: 0.52, returnLikelihood: 0.01, popularityWeight: 28 },
  { id: 'GR-007', name: 'Himalayan Organic Wildflower Raw Honey 500g', category: 'Grocery', subCategory: 'Spreads & Honey', basePrice: 449, costRatio: 0.60, returnLikelihood: 0.02, popularityWeight: 24 },
  { id: 'GR-008', name: 'Stone-Ground Desi A2 Cow Ghee 1L', category: 'Grocery', subCategory: 'Oils & Ghee', basePrice: 1499, costRatio: 0.74, returnLikelihood: 0.01, popularityWeight: 20 },

  // --- BOOKS (High intellectual value, very low returns, fixed price) ---
  { id: 'BK-001', name: 'Data Science & Machine Learning from Scratch', category: 'Books', subCategory: 'Technology', basePrice: 899, costRatio: 0.55, returnLikelihood: 0.02, popularityWeight: 25 },
  { id: 'BK-002', name: 'Atomic Micro-Habits for Peak Focus', category: 'Books', subCategory: 'Self-Help', basePrice: 499, costRatio: 0.48, returnLikelihood: 0.01, popularityWeight: 35 },
  { id: 'BK-003', name: 'The Psychology of Money & Wealth Creation', category: 'Books', subCategory: 'Personal Finance', basePrice: 450, costRatio: 0.46, returnLikelihood: 0.01, popularityWeight: 40 },
  { id: 'BK-004', name: 'India Unbound: The Economic Story', category: 'Books', subCategory: 'Economics', basePrice: 650, costRatio: 0.52, returnLikelihood: 0.02, popularityWeight: 18 },
  { id: 'BK-005', name: 'System Design Interview Practical Manual', category: 'Books', subCategory: 'Technology', basePrice: 1199, costRatio: 0.58, returnLikelihood: 0.03, popularityWeight: 20 },
  { id: 'BK-006', name: 'Modern SQL for Analytics & Data Engineers', category: 'Books', subCategory: 'Technology', basePrice: 950, costRatio: 0.54, returnLikelihood: 0.02, popularityWeight: 22 },
  { id: 'BK-007', name: 'Product Sense: How Modern Startups Build', category: 'Books', subCategory: 'Business', basePrice: 799, costRatio: 0.50, returnLikelihood: 0.01, popularityWeight: 19 },
  { id: 'BK-008', name: 'The Art of Clear Strategic Communication', category: 'Books', subCategory: 'Business', basePrice: 599, costRatio: 0.48, returnLikelihood: 0.01, popularityWeight: 24 },

  // --- ACCESSORIES (High margin 60-70%, low return, compact shipping) ---
  { id: 'AC-001', name: 'Full-Grain Top Leather Bi-Fold Wallet', category: 'Accessories', subCategory: 'Wallets', basePrice: 1499, costRatio: 0.38, returnLikelihood: 0.05, popularityWeight: 28 },
  { id: 'AC-002', name: 'Polarized Aviator Sunglasses UV400', category: 'Accessories', subCategory: 'Eyewear', basePrice: 1899, costRatio: 0.32, returnLikelihood: 0.08, popularityWeight: 24 },
  { id: 'AC-003', name: 'Voyager Water-Resistant 25L Laptop Backpack', category: 'Accessories', subCategory: 'Bags', basePrice: 2799, costRatio: 0.44, returnLikelihood: 0.07, popularityWeight: 26 },
  { id: 'AC-004', name: 'Minimalist Matte Stainless Cardholder', category: 'Accessories', subCategory: 'Wallets', basePrice: 699, costRatio: 0.30, returnLikelihood: 0.04, popularityWeight: 30 },
  { id: 'AC-005', name: 'Handwoven Pashmina Cashmere Wool Scarf', category: 'Accessories', subCategory: 'Scarves', basePrice: 2299, costRatio: 0.42, returnLikelihood: 0.06, popularityWeight: 15 },
  { id: 'AC-006', name: 'Italian Braided Genuine Leather Belt', category: 'Accessories', subCategory: 'Belts', basePrice: 1199, costRatio: 0.36, returnLikelihood: 0.05, popularityWeight: 25 },
  { id: 'AC-007', name: 'HydroFlask Double-Wall Insulated Bottle 750ml', category: 'Accessories', subCategory: 'Drinkware', basePrice: 1299, costRatio: 0.40, returnLikelihood: 0.03, popularityWeight: 27 },
  { id: 'AC-008', name: 'Smart Key Organizer with Multi-Tool Clip', category: 'Accessories', subCategory: 'Keychains', basePrice: 599, costRatio: 0.32, returnLikelihood: 0.03, popularityWeight: 29 },
  { id: 'AC-009', name: 'Waterproof Cable & Tech Organizer Pouch', category: 'Accessories', subCategory: 'Bags', basePrice: 849, costRatio: 0.35, returnLikelihood: 0.04, popularityWeight: 23 },
  { id: 'AC-010', name: 'Vintage Brass Pocket Compass & Case', category: 'Accessories', subCategory: 'Collectibles', basePrice: 999, costRatio: 0.38, returnLikelihood: 0.04, popularityWeight: 14 }
];

export interface IndianLocation {
  city: string;
  state: string;
  region: Region;
  weight: number; // Regional distribution weight
}

export const INDIAN_LOCATIONS: IndianLocation[] = [
  // North
  { city: 'New Delhi', state: 'Delhi', region: 'North', weight: 16 },
  { city: 'Noida', state: 'Uttar Pradesh', region: 'North', weight: 7 },
  { city: 'Gurugram', state: 'Haryana', region: 'North', weight: 9 },
  { city: 'Jaipur', state: 'Rajasthan', region: 'North', weight: 6 },
  { city: 'Lucknow', state: 'Uttar Pradesh', region: 'North', weight: 5 },
  { city: 'Chandigarh', state: 'Punjab', region: 'North', weight: 4 },

  // South
  { city: 'Bengaluru', state: 'Karnataka', region: 'South', weight: 19 },
  { city: 'Hyderabad', state: 'Telangana', region: 'South', weight: 13 },
  { city: 'Chennai', state: 'Tamil Nadu', region: 'South', weight: 11 },
  { city: 'Kochi', state: 'Kerala', region: 'South', weight: 4 },
  { city: 'Coimbatore', state: 'Tamil Nadu', region: 'South', weight: 3 },

  // West
  { city: 'Mumbai', state: 'Maharashtra', region: 'West', weight: 18 },
  { city: 'Pune', state: 'Maharashtra', region: 'West', weight: 10 },
  { city: 'Ahmedabad', state: 'Gujarat', region: 'West', weight: 7 },
  { city: 'Surat', state: 'Gujarat', region: 'West', weight: 4 },
  { city: 'Goa', state: 'Goa', region: 'West', weight: 2 },

  // East
  { city: 'Kolkata', state: 'West Bengal', region: 'East', weight: 9 },
  { city: 'Bhubaneswar', state: 'Odisha', region: 'East', weight: 3 },
  { city: 'Patna', state: 'Bihar', region: 'East', weight: 3 },
  { city: 'Guwahati', state: 'Assam', region: 'East', weight: 2 },

  // Central
  { city: 'Indore', state: 'Madhya Pradesh', region: 'Central', weight: 4 },
  { city: 'Bhopal', state: 'Madhya Pradesh', region: 'Central', weight: 3 },
  { city: 'Nagpur', state: 'Maharashtra', region: 'Central', weight: 3 }
];

export const FIRST_NAMES_MALE = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharva', 'Kabir', 'Rohan', 'Dhruv', 'Aryan', 'Samarth', 'Rishi', 'Kunal', 'Dev',
  'Anand', 'Nikhil', 'Manish', 'Vikram', 'Pranav', 'Siddharth', 'Amit', 'Rahul', 'Gaurav', 'Varun'
];

export const FIRST_NAMES_FEMALE = [
  'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anushka', 'Navya', 'Avani', 'Myra', 'Ira',
  'Riya', 'Sara', 'Meera', 'Aditi', 'Tanvi', 'Tara', 'Kavya', 'Sneha', 'Pooja', 'Neha',
  'Shreya', 'Anjali', 'Deepika', 'Divya', 'Priyanka', 'Simran', 'Ishita', 'Swati', 'Kriti', 'Nandini'
];

export const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Iyer', 'Gupta', 'Singh', 'Chopra',
  'Rao', 'Kulkarni', 'Joshi', 'Deshmukh', 'Bhat', 'Chatterjee', 'Banerjee', 'Mishra', 'Agarwal', 'Malhotra',
  'Saxena', 'Kapoor', 'Menon', 'Pillai', 'Shetty', 'Dutta', 'Choudhury', 'Pandey', 'Trivedi', 'Bose'
];
