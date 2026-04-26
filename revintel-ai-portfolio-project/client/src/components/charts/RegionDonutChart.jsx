import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import SurfaceCard from '../ui/SurfaceCard';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#356dff', '#10b981', '#0f172a', '#8b5cf6'];

export default function RegionDonutChart({ data = [] }) {
  return (
    <SurfaceCard title="Regional revenue mix" subtitle="Understand how sales are distributed across core territories.">
      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="revenue" nameKey="region" innerRadius={70} outerRadius={102} paddingAngle={4}>
                {data.map((entry, index) => (
                  <Cell key={entry.region} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.region} className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.region}</p>
                  <p className="text-xs text-slate-500">Commercial territory</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </SurfaceCard>
  );
}
