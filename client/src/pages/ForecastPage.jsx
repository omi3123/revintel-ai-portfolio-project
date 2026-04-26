import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import ForecastLineChart from '../components/charts/ForecastLineChart';
import ModelAccuracyChart from '../components/charts/ModelAccuracyChart';
import SurfaceCard from '../components/ui/SurfaceCard';
import { fetchForecastMetrics, fetchForecastOverall } from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function ForecastPage() {
  const [horizon, setHorizon] = useState(30);
  const { data: forecast } = useQuery({ queryKey: ['forecast-overall', horizon], queryFn: () => fetchForecastOverall(horizon) });
  const { data: metrics } = useQuery({ queryKey: ['forecast-metrics'], queryFn: fetchForecastMetrics });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Forecasting Studio"
        title="Multi-model sales forecasting"
        description="Compare moving average, linear regression, and random forest performance to choose the strongest predictive view for the next planning cycle."
        action={
          <div className="flex gap-2 rounded-3xl border border-slate-200 bg-white p-2 shadow-soft">
            {[7, 30, 90].map((item) => (
              <button
                key={item}
                onClick={() => setHorizon(item)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${horizon === item ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {item} days
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_.7fr]">
        <ForecastLineChart data={forecast?.series || []} />
        <SurfaceCard title="Forecast summary" subtitle="Selected model and business interpretation for the current horizon.">
          <p className="text-sm text-slate-500">Projected revenue</p>
          <h3 className="mt-3 text-4xl font-semibold text-slate-950">{formatCurrency(forecast?.projected_revenue || 0)}</h3>
          <p className="mt-3 text-sm text-slate-600">Best model selected: <span className="font-semibold text-slate-950">{forecast?.best_model}</span></p>
          <p className="mt-2 text-sm text-slate-600">Projected delta vs latest comparable window: <span className={`font-semibold ${forecast?.projected_delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{forecast?.projected_delta}%</span></p>
          <div className="mt-5 space-y-3">
            {(forecast?.narrative || []).map((line) => (
              <div key={line} className="rounded-3xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{line}</div>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <ModelAccuracyChart data={metrics || []} />
        <SurfaceCard title="Model metrics" subtitle="Accuracy and error profile by model.">
          <div className="space-y-3">
            {(metrics || []).map((item, index) => (
              <div key={item.model} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-slate-50 text-sm font-semibold text-slate-900">0{index + 1}</div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.model}</p>
                      <p className="text-xs text-slate-500">Ranking by MAPE</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">MAPE {item.mape}%</span>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-3xl bg-slate-50 px-3 py-3 text-sm text-slate-700">MAE <span className="mt-1 block font-semibold text-slate-950">{item.mae}</span></div>
                  <div className="rounded-3xl bg-slate-50 px-3 py-3 text-sm text-slate-700">RMSE <span className="mt-1 block font-semibold text-slate-950">{item.rmse}</span></div>
                  <div className="rounded-3xl bg-slate-50 px-3 py-3 text-sm text-slate-700">Bias <span className="mt-1 block font-semibold text-slate-950">{item.bias}</span></div>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
