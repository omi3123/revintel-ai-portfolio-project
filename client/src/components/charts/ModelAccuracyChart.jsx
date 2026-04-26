import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SurfaceCard from '../ui/SurfaceCard';

export default function ModelAccuracyChart({ data = [] }) {
  return (
    <SurfaceCard title="Model scorecard" subtitle="Quick view of relative accuracy across forecasting options.">
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="model" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="mape" fill="#356dff" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
