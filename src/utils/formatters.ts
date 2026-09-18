export function formatCurrency(amount: number, compact: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  
  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';
    if (abs >= 10000000) { // 1 Crore
      return `${sign}₹${(abs / 10000000).toFixed(2)} Cr`;
    }
    if (abs >= 100000) { // 1 Lakh
      return `${sign}₹${(abs / 100000).toFixed(2)} L`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(abs / 1000).toFixed(1)}k`;
    }
    return `${sign}₹${Math.round(abs)}`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num: number, compact: boolean = false): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  
  if (compact) {
    const abs = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (abs >= 10000000) return `${sign}${(abs / 10000000).toFixed(1)} Cr`;
    if (abs >= 100000) return `${sign}${(abs / 100000).toFixed(1)} L`;
    if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}k`;
    return `${sign}${Math.round(abs)}`;
  }

  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercent(value: number, includeSign: boolean = false): string {
  if (isNaN(value) || value === null || value === undefined) return '0.0%';
  const formatted = `${value.toFixed(1)}%`;
  if (includeSign && value > 0) return `+${formatted}`;
  return formatted;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}
