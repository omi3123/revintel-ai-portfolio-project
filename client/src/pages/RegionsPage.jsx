import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import RegionDonutChart from '../components/charts/RegionDonutChart';
import SurfaceCard from '../components/ui/SurfaceCard';
import { fetchRegionsHeatmap, fetchRegionsPerformance } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function RegionsPage() {
  const { data: regions } = useQuery({ queryKey: ['regions-performance'], queryFn: fetchRegionsPerformance });
  const { data: heatmap } = useQuery({ queryKey: ['regions-heatmap'], queryFn: fetchRegionsHeatmap });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader eyebrow="Regional Intelligence" title="Regional revenue visibility" description="Compare performance, growth, and demand risk across territories, cities, and commercial regions." />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <RegionDonutChart data={regions || []} />
        <SurfaceCard title="Region performance table" subtitle="Spot strong and weak territories quickly.">
          <div className="space-y-3">
            {(regions || []).map((item) => (
              <div key={item.region} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-950">{item.region}</p>
                  <p className="text-sm text-slate-500">{item.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-950">{formatCurrency(item.revenue)}</p>
                  <p className={`text-sm ${item.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{item.growth}% growth</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <SurfaceCard title="Heatmap-style territory board" subtitle="A polished proxy for regional intensity and commercial health.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(heatmap || []).map((item) => (
            <div key={item.region} className={`rounded-4xl border p-5 ${item.tone}`}>
              <p className="text-sm font-medium">{item.region}</p>
              <h3 className="mt-3 text-3xl font-semibold">{item.score}</h3>
              <p className="mt-2 text-sm leading-6">{item.comment}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
