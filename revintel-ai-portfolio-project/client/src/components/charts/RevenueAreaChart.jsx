import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import SurfaceCard from '../ui/SurfaceCard';

export default function RevenueAreaChart({ revenueData = [], profitData = [] }) {
  const merged = revenueData.map((item, index) => ({
    month: item.month,
    revenue: item.revenue,
    profit: profitData[index]?.profit || 0
  }));

  return (
    <SurfaceCard
      title="Revenue and profit momentum"
      subtitle="Compare commercial growth and profit expansion across the current planning window."
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={merged}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#356dff" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#356dff" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#356dff" fill="url(#revFill)" strokeWidth={3} />
            <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#profitFill)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
