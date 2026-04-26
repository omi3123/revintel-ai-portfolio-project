import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import SurfaceCard from '../components/ui/SurfaceCard';
import { fetchDataHealth, uploadDataset } from '../services/api';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { data: health } = useQuery({ queryKey: ['data-health'], queryFn: fetchDataHealth });
  const mutation = useMutation({
    mutationFn: uploadDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-health'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['revenue-trend'] });
      queryClient.invalidateQueries({ queryKey: ['profit-trend'] });
      queryClient.invalidateQueries({ queryKey: ['category-performance'] });
      queryClient.invalidateQueries({ queryKey: ['region-summary'] });
      setSelectedFile(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  });

  const metrics = [
    ['Records loaded', health?.records_loaded || '—'],
    ['Date coverage', health?.date_coverage || '—'],
    ['Null rate', health?.null_rate || '—'],
    ['Schema match', health?.schema_match || '—']
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        eyebrow="Settings & Data Upload"
        title="Data source and workspace settings"
        description="Upload a retail-style CSV to replace the seeded dataset and instantly refresh the analytics workspace."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SurfaceCard title="Dataset upload" subtitle="CSV ingestion wired into the backend analytics layer.">
          <div className="rounded-4xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
            <p className="text-lg font-semibold text-slate-950">Drop CSV file here</p>
            <p className="mt-2 text-sm text-slate-600">Required columns: order_id, order_date, product_name, category, sub_category, region, city, channel, customer_segment, sales, profit, quantity, discount.</p>
            <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
            <button onClick={() => inputRef.current?.click()} className="mt-5 rounded-3xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">Choose file</button>
            {selectedFile && <p className="mt-3 text-sm text-slate-600">Selected: <span className="font-medium text-slate-900">{selectedFile.name}</span></p>}
            <button disabled={!selectedFile || mutation.isPending} onClick={() => selectedFile && mutation.mutate(selectedFile)} className="mt-4 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
              {mutation.isPending ? 'Uploading...' : 'Upload dataset'}
            </button>
            {mutation.data && <p className="mt-3 text-sm text-emerald-700">{mutation.data.message}</p>}
            {mutation.error && <p className="mt-3 text-sm text-rose-700">{mutation.error.response?.data?.detail || 'Upload failed.'}</p>}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Active dataset coverage</p>
            <p className="mt-2 text-sm text-slate-600">Using data from <span className="font-medium text-slate-900">{health?.start_date || '—'}</span> to <span className="font-medium text-slate-900">{health?.end_date || '—'}</span>.</p>
          </div>
        </SurfaceCard>

        <SurfaceCard title="Data health summary" subtitle="Checks computed from the currently active dataset.">
          <div className="grid gap-4 md:grid-cols-2">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <h3 className="mt-2 text-3xl font-semibold text-slate-950">{value}</h3>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">Available columns</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(health?.available_columns || []).map((column) => (
                <span key={column} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  {column}
                </span>
              ))}
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
