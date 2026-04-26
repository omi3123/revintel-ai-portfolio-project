import { Bell, CalendarRange, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import SectionBadge from '../ui/SectionBadge';

export default function TopNavbar() {
  return (
    <div className="mb-6 rounded-4xl border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search KPIs, product lines, regional signals..."
              className="w-full border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <SectionBadge tone="premium">Live demo data</SectionBadge>
            <SectionBadge tone="positive">Forecast healthy</SectionBadge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <CalendarRange size={16} />
            Last 12 Months
          </button>
          <button className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            <SlidersHorizontal size={16} />
            Filters
          </button>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-950 px-4 py-3 text-sm font-medium text-white shadow-soft transition hover:translate-y-[-1px]">
            <Sparkles size={16} />
            Generate Insights
          </button>
          <button className="rounded-3xl border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
