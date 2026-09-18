import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string;
  previousValue?: string;
  change?: number; // e.g. 12.4 for +12.4%
  changeLabel?: string;
  isInverseMetric?: boolean; // For Return Rate or Cancellation Rate where down is positive
  icon?: React.ReactNode;
  subtitle?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  previousValue,
  change,
  changeLabel = 'vs prior benchmark',
  isInverseMetric = false,
  icon,
  subtitle
}) => {
  const hasChange = change !== undefined && !isNaN(change);
  
  // For standard metrics (revenue, profit, orders): > 0 is good.
  // For inverse metrics (return rate, cancellation rate): < 0 is good.
  const isPositive = isInverseMetric ? (change || 0) < 0 : (change || 0) > 0;
  const isNeutral = (change || 0) === 0;

  return (
    <div 
      id={id}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
            {title}
          </span>
          {icon && (
            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {icon}
            </div>
          )}
        </div>

        <div className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          {value}
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {hasChange ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-semibold ${
                isNeutral
                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  : isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
              }`}
            >
              {isNeutral ? (
                <Minus className="w-3 h-3" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`}
            </span>
            <span className="truncate">{changeLabel}</span>
          </div>
        ) : subtitle ? (
          <span className="truncate">{subtitle}</span>
        ) : null}

        {previousValue && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto whitespace-nowrap">
            Prev: {previousValue}
          </span>
        )}
      </div>
    </div>
  );
};
