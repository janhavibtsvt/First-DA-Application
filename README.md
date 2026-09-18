# E-Commerce Customer & Sales Intelligence
### Strategic Business Intelligence & Data Analytics Portfolio Project

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Open_Analytics_Platform-4f46e5?style=for-the-badge&logo=googlecloud&logoColor=white)](https://ais-pre-gpyv6fvywyjkkf7prhbvus-929485564140.asia-southeast1.run.app)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-success.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> 🌐 **Live Production Deployment URL:**  
> **[https://ais-pre-gpyv6fvywyjkkf7prhbvus-929485564140.asia-southeast1.run.app](https://ais-pre-gpyv6fvywyjkkf7prhbvus-929485564140.asia-southeast1.run.app)**  
> *(Fully deployed and accessible worldwide — no setup or sign-in required)*

---

> **"Our revenue is growing, but are we actually becoming more profitable?"**

This production-grade analytics application simulates the work of a Lead Data Analyst / Analytics Engineer at **ShopSphere India**, a mid-market multi-category e-commerce platform. It provides executive leadership, finance, merchandising, and growth marketing teams with granular intelligence into revenue drivers, operating margins, customer cohorts (RFM), product catalog traps, regional logistics, and reverse supply chain costs.

---

## 1. Executive Summary & Core Management Finding

Through comprehensive analysis of **10,500 transactions** across **24 months (Jan 2024 – Dec 2025)**, the analysis proves:

**No, the business is not becoming proportionally more profitable.** While top-line sales expanded at a robust rate, net operating profit expanded significantly slower, resulting in a **blended gross margin compression of over 2.4 percentage points**.

### 5 Primary Root Causes of Margin Erosion:
1. **The Promotional Discount Trap:** Transactions carrying discounts $>20\%$ experience an average profit margin collapse from $24.2\%$ down to $7.3\%$. Welsh's two-sample t-test ($t = 42.19, p < 0.0001$) proves statistical significance at $>99.9\%$ confidence.
2. **Hero SKU "Margin Traps":** Top-selling items (e.g. Wireless Noise Canceling Headphones) capture large gross GMV but yield single-digit profit margins due to elevated wholesale costs and high return rates.
3. **Department Subsidies:** High-margin departments (Beauty at $32\%$ margin, Books at $29\%$) are quietly subsidizing losses and tight margins in heavily discounted Electronics and fast-moving Fashion.
4. **Reverse Logistics Courier Drag:** Reverse freight logistics costs ₹120 per returned parcel. High return rates in Fashion ($18.4\%$) and Electronics ($13.6\%$) drained substantial operating cash.
5. **Single-Order Customer Churn:** Over $74\%$ of customer accounts only transact once, failing to reach the lifetime customer break-even threshold of 2.2 orders needed to amortize marketing CPA.

---

## 2. Dimensional Data Model (Star Schema)

The analytics engine operates over an enterprise-grade Star Schema:

```
                  +-------------------------+
                  |       DimDate           |
                  |-------------------------|
                  | date_key (PK)           |
                  | date, month, quarter    |
                  | year, is_weekend, etc.  |
                  +------------+------------+
                               |
                               |
+-------------------+          |          +--------------------+
|   DimCustomer     |          |          |     DimProduct     |
|-------------------|          |          |--------------------|
| customer_id (PK)  +----+     |     +----+ product_id (PK)    |
| customer_name     |    |     |     |    | product_name       |
| customer_segment  |    |     |     |    | category           |
| city, state, reg  |    v     v     v    | sub_category, cogs |
+-------------------+  +-----------------+  +--------------------+
                       |    FactSales    |
                       |-----------------|
                       | order_id (PK)   |
                       | date_key (FK)   |
                       | customer_id (FK)|
                       | product_id (FK) |
                       | location_id(FK) |
                       | channel_id (FK) |
                       | quantity        |
                       | unit_price      |
                       | gross_sales     |
                       | discount_pct    |
                       | net_sales       |
                       | cost, profit    |
                       | return_status   |
                       +--------+--------+
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
+------------------------+             +------------------------+
|      DimLocation       |             |       DimChannel       |
|------------------------|             |------------------------|
| location_id (PK)       |             | channel_id (PK)        |
| city, state, region    |             | channel_name           |
| tier (Tier-1, Tier-2)  |             | payment_method         |
+------------------------+             +------------------------+
```

---

## 3. Key Analytical Methodologies & KPI Formulas

* **Net Sales:** $\text{Net Sales} = \text{Gross Sales} \times (1 - \frac{\text{Discount \%}}{100})$
* **Unit Profit:** $\text{Profit} = \text{Net Sales} - (\text{Quantity} \times \text{Wholesale COGS} \times 1.045_{\text{warehousing}})$
* **Blended Margin %:** $\text{Margin \%} = \frac{\sum \text{Profit}}{\sum \text{Net Sales}} \times 100$
* **RFM Segmentation:**
  * **Recency (R):** Days elapsed between Dec 31, 2025 and customer's latest order (Quintiles 1–5).
  * **Frequency (F):** Distinct orders placed (Quintiles 1–5).
  * **Monetary (M):** Cumulative lifetime net spend (Quintiles 1–5).
  * Segment mapping: Champions (555, 554, 455), Loyal Customers (3-5 F & M), Potential Loyalists, At Risk, and Hibernating.
* **Profitability 4-Quadrant Analysis:**
  * *Star Performers:* High Revenue, High Profit Margin
  * *Margin Traps:* High Revenue, Low/Eroded Profit Margin
  * *Cash Cows:* Moderate/Low Revenue, High Profit Margin
  * *Problem Children:* Low Revenue, Negative/Low Margin

---

## 4. Application Architecture & Dashboard Suite

Built with modern high-performance client architecture:
* **Framework:** React 18 + Vite + TypeScript
* **Styling:** Tailwind CSS (light/dark mode with automated system detection)
* **Visualization:** Recharts (ComposedCharts, Dual-Axis, BarCharts, ScatterPlots, Donut Charts)
* **Icons:** Lucide React
* **State Management:** React Context (`DataContext`) with full in-memory memoization

### 12 Specialized Views:
1. **Executive Overview:** 8 core C-suite KPIs, revenue vs. profit dual-axis time series, and dynamic highlights.
2. **Sales Analytics:** Time-series toggle (Revenue / Orders / Units), channel share, payment methods, and weekday vs. weekend velocity.
3. **Profitability:** Gross sales to net margin waterfall, discount vs. margin elasticity, and the 4-quadrant product scatter plot.
4. **Customer Analytics:** RFM cluster distributions, CLV brackets, and individual customer profiling table with multi-column sorting.
5. **Product Analytics:** SKU-level performance matrix, Star Performers vs. Margin Traps, and return rate correlations.
6. **Regional Analytics:** Indian state and metropolitan hub performance rankings (North, South, West, East, Central).
7. **Returns & Cancellations:** Reverse logistics freight cost impact (₹120/order penalty), categorized return reasons, and offender SKUs.
8. **Data Explorer:** Full spreadsheet-style raw transaction table with search, multi-column sorting, pagination, inspection modal, and CSV export.
9. **Business Insights & What-If Modeler:** Comprehensive strategic brief and interactive profit optimization scenario simulator.
10. **Analyst Toolkit:** Data quality matrix (10,500 rows, 0 nulls, 0 duplicates), ELT pipeline documentation, and IQR outlier detection.
11. **SQL Analysis:** 12 commented, production-grade SQL queries with live in-memory execution and query timing.
12. **Python & EDA Notebook:** Simulated Jupyter notebook with Pandas, SciPy, Welch's t-test hypothesis testing, and Seaborn snippets.

---

## 5. Local Setup & Execution

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/ecommerce-sales-intelligence.git

# Navigate into project directory
cd ecommerce-sales-intelligence

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the live dashboard.

### Production Build
```bash
npm run build
```

---

## 6. How to Publish to GitHub & Deploy

### Option A: Direct Export from AI Studio
1. In the Google AI Studio menu in the top right, click **Settings / Share / Export**.
2. Select **Export to GitHub** or **Download ZIP**.
3. If downloading ZIP: unpack it locally, open your terminal in the directory, and follow the Git push steps below.

### Option B: Push to a New GitHub Repository via Terminal
```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all project files and create initial commit
git add .
git commit -m "Initial commit: E-Commerce Customer & Sales Intelligence Dashboard"

# 3. Create a new repository on GitHub (e.g. ecommerce-sales-intelligence)
# Then link your local repo to GitHub:
git branch -M main
git remote add origin https://github.com/<your-github-username>/ecommerce-sales-intelligence.git

# 4. Push your code
git push -u origin main
```

> 💡 **Portfolio Tip:** In your new GitHub repository, click the ⚙️ gear icon next to the **About** section on the right-hand sidebar and paste the live deployment URL into the **Website** field:  
> `https://ais-pre-gpyv6fvywyjkkf7prhbvus-929485564140.asia-southeast1.run.app`  
> Check the box for *"Use your GitHub Pages website"* if deploying via GitHub Pages, or keep the Cloud Run URL to show your live production cloud app!

### Option C: Free Automated Deployment to GitHub Pages
A turnkey GitHub Actions workflow is included at `.github/workflows/deploy.yml`:
1. Push your code to your GitHub repository on `main`.
2. In your GitHub repository, navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow will automatically run on every push, build the production app, and publish it to:
   `https://<your-github-username>.github.io/<your-repository-name>/`

### Option D: Deploy to Vercel or Netlify (Zero Configuration)
- **Vercel**: Import the GitHub repo on [vercel.com](https://vercel.com). Vite is automatically detected:
  - Framework Preset: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- **Netlify**: Connect your GitHub repository on [netlify.com](https://netlify.com) with the same settings.

---

## 7. Author & Portfolio Context
Built as a **Data Analyst / Analytics Engineer Portfolio Project** showcasing practical SQL, Python, Business Intelligence, Data Storytelling, and Dimensional Modeling skills.
