import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface VolumeChartProps {
  data: { label: string; volume: number }[];
  timeRange: string;
}

export function VolumeChart({ data, timeRange }: VolumeChartProps) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Transaction Volume</h3>
        <p className="text-xs text-muted-foreground">Pulse volume over the last {timeRange}</p>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 89%)" strokeOpacity={0.4} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'hsl(220, 10%, 46%)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(224, 18%, 10%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'hsl(210, 20%, 95%)',
              }}
              formatter={(value: number) => [`${value.toLocaleString()} STX`, 'Volume']}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2}
              fill="url(#volumeGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
