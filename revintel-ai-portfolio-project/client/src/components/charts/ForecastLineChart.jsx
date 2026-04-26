import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import SurfaceCard from '../ui/SurfaceCard';

export default function ForecastLineChart({ data = [] }) {
  return (
    <SurfaceCard title="Actual vs forecast" subtitle="Projected performance with upper and lower confidence bands.">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <ReferenceArea x1={data.find((item) => item.type === 'forecast')?.label} x2={data[data.length - 1]?.label} fill="#356dff" fillOpacity={0.05} />
            <Line type="monotone" dataKey="actual" stroke="#0f172a" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="forecast" stroke="#356dff" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="upper" stroke="#94a3b8" strokeDasharray="6 6" dot={false} />
            <Line type="monotone" dataKey="lower" stroke="#94a3b8" strokeDasharray="6 6" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
