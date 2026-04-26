import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SurfaceCard from '../ui/SurfaceCard';

export default function AnomalyTrendChart({ data = [] }) {
  return (
    <SurfaceCard title="Anomaly timeline" subtitle="Track severity accumulation and operational risk by period.">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="week" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
