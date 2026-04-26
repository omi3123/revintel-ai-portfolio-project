import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import AnomalyTrendChart from '../components/charts/AnomalyTrendChart';
import SurfaceCard from '../components/ui/SurfaceCard';
import { fetchAnomalies, fetchAnomaliesSummary, fetchAnomaliesTimeline } from '../services/api';
import { severityTone } from '../utils/formatters';

export default function AnomaliesPage() {
  const { data } = useQuery({ queryKey: ['anomalies'], queryFn: fetchAnomalies });
  const { data: summary } = useQuery({ queryKey: ['anomalies-summary'], queryFn: fetchAnomaliesSummary });
  const { data: timeline } = useQuery({ queryKey: ['anomalies-timeline'], queryFn: fetchAnomaliesTimeline });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader eyebrow="Anomaly Detection" title="Revenue risk and anomaly timeline" description="Review unusual spikes, sharp drops, demand distortions, and operational signals that need fast action." />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'High severity', value: summary?.high, tone: 'bg-rose-50 border-rose-200 text-rose-700' },
          { label: 'Medium severity', value: summary?.medium, tone: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Low severity', value: summary?.low, tone: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
        ].map((item) => (
          <div key={item.label} className={`rounded-4xl border p-5 shadow-soft ${item.tone}`}>
            <p className="text-sm font-semibold">{item.label}</p>
            <h3 className="mt-3 text-4xl font-semibold text-slate-950">{item.value ?? 0}</h3>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AnomalyTrendChart data={timeline || []} />
        <SurfaceCard title="Latest alerts" subtitle="Human-readable business messages for faster stakeholder action.">
          <div className="space-y-3">
            {(data || []).map((item) => (
              <div key={item.message} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityTone[item.severity]}`}>
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="text-sm text-slate-500">{item.date}</span>
                </div>
                <p className="mt-3 font-semibold text-slate-950">{item.message}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.context}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
