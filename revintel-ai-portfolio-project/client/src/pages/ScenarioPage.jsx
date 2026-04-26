import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import PageHeader from '../components/ui/PageHeader';
import SurfaceCard from '../components/ui/SurfaceCard';
import { fetchScenarioHistory, runScenario } from '../services/api';
import { formatCurrency } from '../utils/formatters';

const initialState = {
  price_change: 5,
  discount_change: -2,
  ad_spend_change: 10,
  seasonality_uplift: 8,
  inventory_shortage: 4
};

export default function ScenarioPage() {
  const [form, setForm] = useState(initialState);
  const mutation = useMutation({ mutationFn: runScenario });
  const { data: history } = useQuery({ queryKey: ['scenario-history', mutation.data], queryFn: fetchScenarioHistory });

  const handleRun = () => mutation.mutate(form);
  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: Number(value) }));

  return (
    <div className="space-y-6 pb-8">
      <PageHeader eyebrow="Scenario Planner" title="Test pricing and growth scenarios" description="Model price changes, discounting, ad spend, seasonality, and inventory impact before making a commercial decision." />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Scenario inputs" subtitle="Tune each lever to simulate the likely business effect.">
          <div className="space-y-5">
            {[
              ['price_change', 'Price change %'],
              ['discount_change', 'Discount change %'],
              ['ad_spend_change', 'Ad spend change %'],
              ['seasonality_uplift', 'Seasonality uplift %'],
              ['inventory_shortage', 'Inventory shortage %']
            ].map(([key, label]) => (
              <label key={key} className="block">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>{label}</span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{form[key]}%</span>
                </div>
                <input type="range" min={key === 'discount_change' ? -20 : 0} max={25} step={1} value={form[key]} onChange={(e) => updateField(key, e.target.value)} className="w-full" />
              </label>
            ))}
            <button onClick={handleRun} className="w-full rounded-3xl bg-slate-950 px-4 py-3 font-medium text-white shadow-soft transition hover:translate-y-[-1px]">
              Run scenario
            </button>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Scenario output" subtitle="Projected commercial effect and business interpretation.">
          {mutation.data ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Projected revenue</p>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-950">{formatCurrency(mutation.data.projected_revenue)}</h3>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Projected profit</p>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-950">{formatCurrency(mutation.data.projected_profit)}</h3>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Projected order volume</p>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-950">{mutation.data.projected_orders.toLocaleString()}</h3>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Margin rate / Risk</p>
                  <h3 className="mt-2 text-3xl font-semibold text-slate-950">{mutation.data.margin_rate}%</h3>
                  <p className="mt-1 text-sm text-slate-600">Risk level: <span className="font-semibold uppercase">{mutation.data.risk_level}</span></p>
                </div>
              </div>
              <div className="space-y-3">
                {mutation.data.notes.map((note) => (
                  <div key={note} className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700">{note}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm leading-6 text-slate-600">
              Run the scenario to see projected revenue, projected profit, order volume, margin impact, and decision-ready risk notes.
            </div>
          )}
        </SurfaceCard>
      </div>

      <SurfaceCard title="Recent scenario runs" subtitle="Persisted scenario history from the backend workspace.">
        <div className="space-y-3">
          {(history || []).map((item) => (
            <div key={item.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 md:grid-cols-5">
              <div>
                <p className="text-xs uppercase text-slate-500">Created</p>
                <p className="font-medium text-slate-950">{item.created_at?.replace('T', ' ')}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Revenue</p>
                <p className="font-medium text-slate-950">{formatCurrency(item.projected_revenue)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Profit</p>
                <p className="font-medium text-slate-950">{formatCurrency(item.projected_profit)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Margin</p>
                <p className="font-medium text-slate-950">{item.margin_rate}%</p>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-500">Risk</p>
                <p className="font-medium uppercase text-slate-950">{item.risk_level}</p>
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
