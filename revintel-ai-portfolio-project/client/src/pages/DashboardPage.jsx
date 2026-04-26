import { Activity, DollarSign, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import KpiCard from '../components/dashboard/KpiCard';
import RevenueAreaChart from '../components/charts/RevenueAreaChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import InsightPanel from '../components/dashboard/InsightPanel';
import RegionDonutChart from '../components/charts/RegionDonutChart';
import SurfaceCard from '../components/ui/SurfaceCard';
import {
  fetchAnomaliesSummary,
  fetchCategoryPerformance,
  fetchDashboardSummary,
  fetchProfitTrend,
  fetchRegionSummary,
  fetchRevenueTrend,
  fetchTopProducts
} from '../services/api';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function DashboardPage() {
  const { data: summary } = useQuery({ queryKey: ['dashboard-summary'], queryFn: fetchDashboardSummary });
  const { data: revenueTrend } = useQuery({ queryKey: ['revenue-trend'], queryFn: fetchRevenueTrend });
  const { data: profitTrend } = useQuery({ queryKey: ['profit-trend'], queryFn: fetchProfitTrend });
  const { data: categories } = useQuery({ queryKey: ['category-performance'], queryFn: fetchCategoryPerformance });
  const { data: regions } = useQuery({ queryKey: ['region-summary'], queryFn: fetchRegionSummary });
  const { data: topProducts } = useQuery({ queryKey: ['top-products'], queryFn: fetchTopProducts });
  const { data: anomalySummary } = useQuery({ queryKey: ['anomaly-summary'], queryFn: fetchAnomaliesSummary });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Revenue performance overview"
        description="Track revenue, orders, margin quality, regional growth, and top commercial signals from one premium executive workspace."
        action={<div className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-soft">Updated 5 minutes ago</div>}
      />

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-5">
        <KpiCard label="Total Revenue" value={summary?.total_revenue || 0} change={summary?.revenue_growth} icon={DollarSign} note="Healthy year-over-year momentum across core categories." />
        <KpiCard label="Total Orders" value={summary?.total_orders || 0} change={summary?.order_growth} kind="number" icon={ShoppingCart} note="Order flow remains stable in enterprise accounts." />
        <KpiCard label="Total Profit" value={summary?.total_profit || 0} change={summary?.profit_growth} icon={Wallet} note="Margin pressure softened after discount normalization." />
        <KpiCard label="Forecasted 30-Day Revenue" value={summary?.forecast_revenue || 0} change={summary?.forecast_growth} icon={TrendingUp} note="Forecast remains above baseline demand expectations." />
        <KpiCard label="Average Order Value" value={summary?.average_order_value || 0} change={summary?.aov_growth} icon={Activity} tone="dark" note="Premium order mix holding up despite softer western demand." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <RevenueAreaChart revenueData={revenueTrend || []} profitData={profitTrend || []} />
        <InsightPanel insights={summary?.insights || []} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <CategoryBarChart data={categories || []} />
        <RegionDonutChart data={regions || []} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <SurfaceCard title="Top revenue-driving products" subtitle="High-performing products that are carrying growth this cycle.">
          <div className="space-y-3">
            {(topProducts || []).map((item, index) => (
              <div key={item.product} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-white text-sm font-semibold text-slate-900 shadow-soft">0{index + 1}</div>
                  <div>
                    <p className="font-semibold text-slate-950">{item.product}</p>
                    <p className="text-sm text-slate-500">{item.segment}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-950">{formatCurrency(item.revenue)}</p>
                  <p className="text-sm text-emerald-600">{item.growth}% growth</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Risk watch" subtitle="Operational issues that need executive review before the next campaign cycle.">
          <div className="space-y-3">
            <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-4">
              <p className="text-sm font-semibold text-rose-700">High severity anomalies</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{formatNumber(anomalySummary?.high)}</p>
              <p className="mt-2 text-sm text-slate-600">Commercial furniture softness in the West region remains the top priority.</p>
            </div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-4">
              <p className="text-sm font-semibold text-amber-700">Medium severity anomalies</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{formatNumber(anomalySummary?.medium)}</p>
              <p className="mt-2 text-sm text-slate-600">Campaign-driven spikes need validation to separate true demand from promo distortion.</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
