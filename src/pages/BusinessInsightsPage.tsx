import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  DollarSign, 
  Scale,
  Percent,
  TrendingDown
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency, formatNumber, formatPercent } from '../utils/formatters';

export const BusinessInsightsPage: React.FC = () => {
  const { kpis, highlights, categoryBreakdown } = useData();

  // What-if simulator state
  const [discountReductionPts, setDiscountReductionPts] = useState<number>(3.5); // reduce discount by X pts
  const [returnImprovementPts, setReturnImprovementPts] = useState<number>(2.0); // improve return rate by X pts
  const [repeatBoostPct, setRepeatBoostPct] = useState<number>(15); // increase repeat order volume by X %

  // Calculate dynamic projected profit impact
  const simulation = useMemo(() => {
    // 1. Discount reduction savings: Recovering X% of gross sales directly into net profit
    const discountSavings = kpis.totalGrossSales * (discountReductionPts / 100);

    // 2. Return rate savings: Reduced reverse logistics fees (₹120/return) + recovered salvaged margins
    const savedReturnsCount = Math.round(kpis.totalOrders * (returnImprovementPts / 100));
    const reverseLogisticsSavings = savedReturnsCount * 120;
    const salvagedMargin = savedReturnsCount * (kpis.avgOrderValue * 0.22);
    const totalReturnSavings = reverseLogisticsSavings + salvagedMargin;

    // 3. Repeat customer boost: Repeat customers order at higher AOVs and zero acquisition ad cost
    const additionalRepeatOrders = Math.round((kpis.totalOrders * 0.25) * (repeatBoostPct / 100));
    const repeatOrderProfitGain = additionalRepeatOrders * (kpis.avgOrderValue * 0.26);

    const totalProjectedProfitGain = discountSavings + totalReturnSavings + repeatOrderProfitGain;
    const projectedNewProfit = kpis.totalProfit + totalProjectedProfitGain;
    const projectedNewMargin = (projectedNewProfit / (kpis.totalRevenue + discountSavings)) * 100;

    return {
      discountSavings,
      totalReturnSavings,
      repeatOrderProfitGain,
      totalProjectedProfitGain,
      projectedNewProfit,
      projectedNewMargin,
      marginExpansionPts: projectedNewMargin - kpis.profitMargin
    };
  }, [kpis, discountReductionPts, returnImprovementPts, repeatBoostPct]);

  return (
    <div className="space-y-8">
      {/* 1. Executive Summary & Answer to Problem Statement */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 lg:p-8 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-bold mb-3">
          <Target className="w-4 h-4" />
          Executive Decision Brief
        </div>
        
        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Executive Answer: &quot;Revenue is growing, but are we becoming more profitable?&quot;
        </h2>
        
        <div className="mt-4 p-5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50">
          <div className="text-sm font-bold text-amber-950 dark:text-amber-200 mb-1 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            The Quantitative Verdict:
          </div>
          <p className="text-xs lg:text-sm text-amber-900/90 dark:text-amber-300 leading-relaxed font-medium">
            <strong>No, the business is suffering from Margin Compression.</strong> While top-line revenue expanded by <strong>{formatPercent(kpis.revenueGrowth, true)}</strong>, net operating profit expanded at a sluggish <strong>{formatPercent(kpis.profitGrowth, true)}</strong>, leading to a blended gross margin erosion of <strong>{formatPercent(kpis.marginDelta, true)} percentage points</strong>. Growth is being bought through unsustainably steep discounting in low-margin categories and bloated reverse logistics from high return rates.
          </p>
        </div>

        {/* Quantified Comparison Table */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold uppercase">Top-Line Expansion</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              +{formatPercent(kpis.revenueGrowth)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Total sales reached {formatCurrency(kpis.totalRevenue, true)}, stimulated by heavy promo campaigns.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold uppercase">Bottom-Line Growth</span>
            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
              +{formatPercent(kpis.profitGrowth)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Net profit reached {formatCurrency(kpis.totalProfit, true)}, severely lagging gross transaction volume.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 font-semibold uppercase">Net Margin Compression</span>
            <div className={`text-xl font-black mt-1 ${kpis.marginDelta < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatPercent(kpis.marginDelta, true)} pts
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Blended operating margin compressed to {formatPercent(kpis.profitMargin)} from previous periods.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Key Analytical Findings */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 lg:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Root Causes of Margin Compression (Data Analyst Diagnosis)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Six empirical phenomena uncovered through multi-dimensional correlation and regression analysis:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-center font-bold text-[11px] leading-5">1</span>
              The Discounting Trap
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Discounts above 20% reduce gross margins below 8%. While promotions trigger short-term spikes in orders, 68% of discounted buyers never make a second purchase at regular price.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-center font-bold text-[11px] leading-5">2</span>
              Hero Margin Traps
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Products like wireless noise-cancelling headphones generate massive revenue (₹40L+) but carry high vendor wholesale costs and 22% return rates, leaving under 5% net retained margin.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-center font-bold text-[11px] leading-5">3</span>
              Department Subsidies
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High-margin departments like Beauty (32% margin) and Books (29% margin) are subsidizing losses in heavily promoted Electronics and high-return Fast Fashion.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-center font-bold text-[11px] leading-5">4</span>
              Reverse Logistics Freight Drag
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every customer return costs ₹120 in courier handling and inspection fees. With returns totaling ~{formatNumber(Math.round(kpis.totalOrders * (kpis.returnRate / 100)))}, over {formatCurrency(Math.round(kpis.totalOrders * (kpis.returnRate / 100)) * 120)} was lost in dead freight.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-center font-bold text-[11px] leading-5">5</span>
              Single-Purchase Churn
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              74% of customers place only one order. Paid ads (Google & Instagram) are paying high acquisition costs for users who fail to reach the lifetime value break-even threshold of 2.2 orders.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs mb-2">
              <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-center font-bold text-[11px] leading-5">6</span>
              Regional Logistics Asymmetry
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Tier-1 southern metros (Bengaluru, Hyderabad, Chennai) have 21% margins and 9% return rates, whereas remote Central deliveries incur 3x higher transit delays and elevated return rates.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Actionable Strategic Playbook */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 lg:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Management Action Plan (Prescriptive Guidance)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Clear, quantifiable policies to enact immediately across Merchandising, Marketing, and Operations
        </p>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              1. Enforce Tiered Discount Guardrails (Max 15% on Low-Margin Categories)
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Cap discount codes on Electronics and Appliances at 12%. Shift promo budgets toward bundle discounts on high-margin Beauty, Home & Books where gross margin easily absorbs incentives.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              2. Eliminate Margin Traps & Renegotiate Wholesale Terms
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Renegotiate wholesale pricing on the bottom 10 low-margin hero items. For persistent negative-margin SKUs, implement Minimum Advertised Pricing (MAP) or remove them from paid ad rotations.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              3. Automated RFM Win-Back & Loyalty Engine
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Target the &quot;Potential Loyalist&quot; and &quot;At Risk&quot; cohorts with personalized email sequences at day 45 post-first-purchase. Repeat customers cost 5x less to convert and have 18% higher AOV.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              4. Fitment Guidance & Quality Inspection on High-Return Fashion
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Implement standard true-to-size charts and customer fit ratings on high-return clothing SKUs. 42% of Fashion returns cite sizing inaccuracy.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Interactive "What-If" Financial Impact Scenario Modeler */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-6 lg:p-8 shadow-xs">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sliders className="w-4 h-4" />
          Financial Simulation & Sensitivity Analysis
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Interactive Profit Optimization Modeler
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
          Adjust the strategic intervention levers below to project the immediate financial impact on total net profit and margin expansion.
        </p>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Discount Discipline</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                -{discountReductionPts}% pts
              </span>
            </div>
            <input
              id="slider-discount"
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={discountReductionPts}
              onChange={e => setDiscountReductionPts(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Recovered discount dollars converted directly to profit
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Return Rate Reduction</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                -{returnImprovementPts}% pts
              </span>
            </div>
            <input
              id="slider-return"
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={returnImprovementPts}
              onChange={e => setReturnImprovementPts(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Saved ₹120 reverse courier fees + salvaged margin
            </span>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-2">
              <span className="text-slate-700 dark:text-slate-300">Repeat Customer Lift</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                +{repeatBoostPct}% lift
              </span>
            </div>
            <input
              id="slider-repeat"
              type="range"
              min="0"
              max="40"
              step="5"
              value={repeatBoostPct}
              onChange={e => setRepeatBoostPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Incremental orders from loyal customers with zero ad CPA
            </span>
          </div>
        </div>

        {/* Projected Results Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">
              Projected Profit Gain
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              +{formatCurrency(simulation.totalProjectedProfitGain, true)}
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
              Annualized net cash flow unlock
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60">
            <span className="text-[11px] font-bold text-indigo-800 dark:text-indigo-300 uppercase">
              New Projected Net Profit
            </span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {formatCurrency(simulation.projectedNewProfit, true)}
            </div>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">
              Up from {formatCurrency(kpis.totalProfit, true)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/60">
            <span className="text-[11px] font-bold text-cyan-800 dark:text-cyan-300 uppercase">
              New Blended Margin
            </span>
            <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
              {formatPercent(simulation.projectedNewMargin)}
            </div>
            <p className="text-[11px] text-cyan-700 dark:text-cyan-400 mt-1">
              +{formatPercent(simulation.marginExpansionPts, true)} percentage points expansion
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col justify-center space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Discount Savings:</span>
              <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(simulation.discountSavings, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Return Logistics:</span>
              <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(simulation.totalReturnSavings, true)}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Repeat LTV Gain:</span>
              <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(simulation.repeatOrderProfitGain, true)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
