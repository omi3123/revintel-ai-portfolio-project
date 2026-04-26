import { ArrowRight, BarChart3, BellRing, LineChart, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: LineChart,
    title: 'Forecast future revenue',
    desc: 'Multi-horizon sales forecasting for finance, retail, e-commerce, and operations teams.'
  },
  {
    icon: BellRing,
    title: 'Catch anomalies early',
    desc: 'Detect unusual drops, spikes, campaign distortions, and category-level risk before they hurt growth.'
  },
  {
    icon: BarChart3,
    title: 'Executive analytics',
    desc: 'Track revenue, margin, order value, regional performance, and product contribution in one workspace.'
  },
  {
    icon: ShieldCheck,
    title: 'Scenario planning',
    desc: 'Model pricing, discounting, media spend, and seasonality with decision-ready business context.'
  }
];

const stats = [
  { label: 'Forecasted 30-day revenue', value: '$482K', note: '+12.8% expected lift' },
  { label: 'Forecast accuracy (MAPE)', value: '4.9%', note: 'Best model: Random Forest' },
  { label: 'Priority anomalies', value: '3', note: '1 high severity region alert' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="grid-bg">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-700">RevIntel AI</h1>
            <p className="text-sm text-slate-500">Revenue Intelligence & Sales Forecasting Platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/demo-login" className="rounded-3xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              Demo Access
            </Link>
            <Link to="/app/dashboard" className="rounded-3xl bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:translate-y-[-1px]">
              Open App
            </Link>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.12fr_.88fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
              <Sparkles size={16} />
              Built for retail, e-commerce, SaaS, and operations teams
            </span>
            <h2 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight md:text-6xl">
              Turn raw sales data into <span className="text-brand-600">forecasting</span>, executive insights, anomaly alerts, and business decisions.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              RevIntel AI helps teams monitor revenue performance, predict future demand, identify margin leakage, and test pricing or promotion moves through a premium analytics experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/app/dashboard" className="inline-flex items-center gap-2 rounded-3xl bg-brand-600 px-5 py-3 font-medium text-white shadow-glow transition hover:translate-y-[-1px]">
                Explore Dashboard
                <ArrowRight size={18} />
              </Link>
              <Link to="/demo-login" className="rounded-3xl border border-slate-200 px-5 py-3 font-medium text-slate-800 transition hover:bg-slate-50">
                Try Demo Workspace
              </Link>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-4xl border border-slate-200 bg-white/80 p-4 shadow-soft backdrop-blur">
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
                  <p className="mt-2 text-sm text-emerald-600">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float rounded-[2.2rem] border border-slate-200 bg-hero p-5 shadow-panel">
            <div className="rounded-[1.7rem] border border-white/80 bg-white/80 p-5 backdrop-blur">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-4xl bg-slate-950 p-5 text-white shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">Forecast confidence</p>
                    <TrendingUp size={18} className="text-brand-100" />
                  </div>
                  <h3 className="mt-4 text-4xl font-semibold">94%</h3>
                  <p className="mt-2 text-sm text-slate-300">Demand remains above baseline in 3 core regions.</p>
                </div>
                <div className="rounded-4xl bg-white p-5 shadow-soft">
                  <p className="text-sm text-slate-500">Q2 executive focus</p>
                  <h3 className="mt-4 text-2xl font-semibold">Margin recovery</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Furniture drives volume, but discount depth is compressing profit quality.</p>
                </div>
                <div className="rounded-4xl bg-white p-5 shadow-soft md:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Live signal</p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-950">West region softening against trend</h3>
                    </div>
                    <div className="rounded-3xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">High priority</div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Three-week decline detected in commercial furniture. Recommended action: review pricing mix and campaign allocation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-600">Platform capabilities</p>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight">Built to impress clients fast</h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">A strong Upwork flagship needs polished product thinking, business language, premium visuals, and obvious commercial value. This project is built to signal all four.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-panel">
              <div className="inline-flex rounded-3xl bg-brand-50 p-3 text-brand-600">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
