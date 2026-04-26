import {
  BarChart3,
  BellRing,
  Boxes,
  ChevronRight,
  FileText,
  Globe2,
  Home,
  LineChart,
  Rocket,
  Settings2,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/app/dashboard', label: 'Dashboard', icon: Home },
  { to: '/app/forecasting', label: 'Forecasting', icon: LineChart },
  { to: '/app/products', label: 'Products', icon: Boxes },
  { to: '/app/regions', label: 'Regions', icon: Globe2 },
  { to: '/app/anomalies', label: 'Anomalies', icon: BellRing },
  { to: '/app/scenario-planner', label: 'Scenario Planner', icon: SlidersHorizontal },
  { to: '/app/reports', label: 'Reports', icon: FileText },
  { to: '/app/settings', label: 'Settings', icon: Settings2 }
];

export default function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-[290px] border-r border-slate-200/80 bg-panel bg-cover px-5 py-6 text-white lg:flex lg:flex-col lg:justify-between">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="rounded-3xl bg-white/10 p-3 text-white shadow-glow backdrop-blur">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">RevIntel AI</h2>
            <p className="text-sm text-slate-300">Revenue Intelligence Suite</p>
          </div>
        </div>

        <div className="mb-6 rounded-4xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Flagship Demo</p>
              <h3 className="mt-2 text-lg font-semibold">Q1 Revenue Sprint</h3>
            </div>
            <Sparkles size={18} className="text-brand-200" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Modern portfolio build for forecasting, executive analytics, anomalies, and scenario planning.</p>
        </div>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-soft'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </div>
              <ChevronRight size={16} className="opacity-40 transition group-hover:translate-x-0.5" />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="rounded-4xl border border-brand-200/20 bg-brand-500/10 p-4 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-500/20 p-2 text-brand-100">
            <Rocket size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Ready for an upgraded build</p>
            <p className="text-xs text-slate-300">Replace sample data with real business inputs next.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
