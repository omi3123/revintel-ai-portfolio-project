import { Sparkles } from 'lucide-react';

export default function InsightPanel({ insights = [] }) {
  return (
    <div className="rounded-4xl bg-panel p-6 text-white shadow-panel">
      <div className="flex items-center gap-3">
        <div className="rounded-3xl bg-white/10 p-3 text-brand-100">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-brand-100">Executive Summary</p>
          <h3 className="mt-1 text-2xl font-semibold">Revenue story at a glance</h3>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {insights.map((insight, index) => (
          <div key={insight} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-200">
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
              {index + 1}
            </span>
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}
