import { useQuery } from '@tanstack/react-query';
import { Download, FileText, LayoutTemplate } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import SurfaceCard from '../components/ui/SurfaceCard';
import { API_BASE_URL, fetchReportLibrary } from '../services/api';

export default function ReportsPage() {
  const { data } = useQuery({ queryKey: ['report-library'], queryFn: fetchReportLibrary });

  return (
    <div className="space-y-6 pb-8">
      <PageHeader eyebrow="Reports & Exports" title="Delivery-ready reporting" description="Export dashboards, package executive summaries, and present insights in a polished client-friendly format." />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(data || []).map((item) => (
          <SurfaceCard key={item.title} title={item.title} subtitle={item.subtitle} className="h-full">
            <div className="flex items-center justify-between rounded-3xl bg-slate-50 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-3xl bg-white p-3 text-slate-700 shadow-soft">
                  {item.type === 'PDF' ? <FileText size={18} /> : <LayoutTemplate size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{item.type}</p>
                  <p className="text-sm text-slate-500">{item.size}</p>
                </div>
              </div>
              <a href={`${API_BASE_URL.replace(/\/$/, '')}${item.download.replace('/api', '')}`} target="_blank" rel="noreferrer" className="rounded-3xl border border-slate-200 p-3 text-slate-600 transition hover:bg-white">
                <Download size={18} />
              </a>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
