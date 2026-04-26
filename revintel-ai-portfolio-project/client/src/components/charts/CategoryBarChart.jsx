import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import SurfaceCard from '../ui/SurfaceCard';

const fills = ['#356dff', '#10b981', '#0f172a', '#7c3aed'];

export default function CategoryBarChart({ data = [] }) {
  return (
    <SurfaceCard title="Category performance" subtitle="Revenue contribution split by product family and business line.">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="category" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="revenue" radius={[14, 14, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`${entry.category}-${index}`} fill={fills[index % fills.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
