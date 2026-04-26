export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value || 0);

export const formatPercent = (value) => `${value > 0 ? '+' : ''}${(value || 0).toFixed(1)}%`;

export const severityTone = {
  high: 'bg-rose-100 text-rose-700 border-rose-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200'
};
