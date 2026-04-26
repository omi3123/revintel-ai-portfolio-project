import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

export default function KpiCard({ label, value, change, kind = 'currency', icon: Icon, tone = 'default', note }) {
  const formattedValue = kind === 'currency' ? formatCurrency(value) : formatNumber(value);
  const positive = (change || 0) >= 0;
  const toneClass = tone === 'dark'
    ? 'bg-slate-950 text-white border-slate-900'
    : 'bg-white/90 text-slate-950 border-white/80';

  return (
    <div className={`rounded-4xl border p-5 shadow-soft backdrop-blur md:p-6 ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={`text-sm ${tone === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>{label}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight md:text-[2rem]">{formattedValue}</h3>
          {typeof change === 'number' && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-slate-50/80 px-3 py-1 text-xs font-semibold text-slate-700">
              {positive ? <ArrowUpRight size={14} className="text-emerald-600" /> : <ArrowDownRight size={14} className="text-rose-600" />}
              <span className={positive ? 'text-emerald-600' : 'text-rose-600'}>{formatPercent(change)}</span>
              <span className="text-slate-500">vs previous period</span>
            </div>
          )}
          {note ? <p className={`mt-3 text-sm leading-6 ${tone === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>{note}</p> : null}
        </div>
        {Icon ? (
          <div className={`rounded-3xl p-3 ${tone === 'dark' ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-600'}`}>
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
