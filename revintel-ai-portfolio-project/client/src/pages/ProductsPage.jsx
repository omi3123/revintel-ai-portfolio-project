import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import SurfaceCard from '../components/ui/SurfaceCard';
import { fetchLowProducts, fetchProductSummary, fetchTopProductTable } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function ProductsPage() {
  const { data: summary } = useQuery({ queryKey: ['product-summary'], queryFn: fetchProductSummary });
  const { data: topProducts } = useQuery({ queryKey: ['product-table'], queryFn: fetchTopProductTable });
  const { data: lowProducts } = useQuery({ queryKey: ['low-products'], queryFn: fetchLowProducts });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader eyebrow="Product Intelligence" title="Product and category performance" description="Analyze high-performing products, margin contribution, low performers, and demand patterns across categories." />

      <div className="grid gap-4 md:grid-cols-3">
        {(summary || []).map((item) => (
          <div key={item.label} className="rounded-4xl border border-white/70 bg-white/90 p-5 shadow-soft">
            <p className="text-sm text-slate-500">{item.label}</p>
            <h3 className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <SurfaceCard title="Top products" subtitle="Revenue leaders with healthy growth and contribution quality.">
          <div className="overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Revenue</th>
                  <th className="px-4 py-3 font-medium">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {(topProducts || []).map((item) => (
                  <tr key={item.product}>
                    <td className="px-4 py-4 font-medium text-slate-950">{item.product}</td>
                    <td className="px-4 py-4 text-slate-600">{item.category}</td>
                    <td className="px-4 py-4 text-slate-950">{formatCurrency(item.revenue)}</td>
                    <td className="px-4 py-4 text-emerald-600">{item.growth}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Low-performing products" subtitle="Revenue leakage candidates that need repricing, repositioning, or inventory review.">
          <div className="space-y-3">
            {(lowProducts || []).map((item) => (
              <div key={item.product} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{item.product}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.issue}</p>
                  </div>
                  <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Review needed</div>
                </div>
                <p className="mt-3 text-sm text-slate-600">{item.action}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
