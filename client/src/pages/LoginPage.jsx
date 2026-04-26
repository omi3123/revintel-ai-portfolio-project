import { LockKeyhole, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-slate-100 lg:grid-cols-[1fr_520px]">
      <div className="hidden bg-panel p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-brand-100">Premium portfolio demo</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Step into a polished analytics workspace built to win business clients.</h1>
        </div>
        <div className="rounded-4xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="rounded-3xl bg-white/10 p-3 text-brand-100">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-semibold">What you will see</p>
              <p className="mt-1 text-sm text-slate-300">Executive dashboard, forecasting studio, anomaly center, scenario planning, and export-ready reporting.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-panel backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Demo Workspace</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Access RevIntel AI</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use the guided demo flow to preview the flagship dashboard experience and business intelligence modules.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><Mail size={15} /> Email address</span>
              <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-300" placeholder="Email address" defaultValue="demo@revintel.ai" />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"><LockKeyhole size={15} /> Password</span>
              <input className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-brand-300" type="password" placeholder="Password" defaultValue="demo123" />
            </label>
            <Link to="/app/dashboard" className="block rounded-3xl bg-slate-950 px-4 py-3 text-center font-medium text-white shadow-soft transition hover:translate-y-[-1px]">
              Enter Demo Workspace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
