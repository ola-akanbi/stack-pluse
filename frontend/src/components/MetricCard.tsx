import { cn } from '@/lib/utils';
import { motion, animate } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useEffect, useRef } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: { value: string; positive: boolean };
  icon?: LucideIcon;
  sparkline?: number[];
  className?: string;
}

function AnimatedValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const numMatch = value.match(/^([\d,.]+)/);
    if (!numMatch || !ref.current) return;
    const target = parseFloat(numMatch[1].replace(/,/g, ''));
    if (isNaN(target)) return;
    const suffix = value.slice(numMatch[1].length);
    const controls = animate(0, target, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(v) {
        if (!ref.current) return;
        const formatted = target >= 1000
          ? v.toLocaleString(undefined, { maximumFractionDigits: target % 1 === 0 ? 0 : 2 })
          : v.toFixed(target % 1 === 0 ? 0 : 2);
        ref.current.textContent = formatted + suffix;
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span ref={ref}>{value}</span>;
}

function SparklineTooltipContent({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md border border-border">
      <span className="font-medium tabular-nums">{payload[0].value}</span>
    </div>
  );
}

export function MetricCard({ label, value, sublabel, trend, icon: Icon, sparkline, className }: MetricCardProps) {
  const chartData = sparkline?.map((v, i) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={cn(
        'relative rounded-lg bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-border/50',
        className
      )}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/40 to-primary/0 rounded-l-lg" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-card-foreground">
            <AnimatedValue value={value} />
          </p>
          <div className="mt-1 flex items-center gap-2">
            {sublabel && <span className="text-xs text-muted-foreground">{sublabel}</span>}
            {trend && (
              <span className={cn('text-xs font-medium', trend.positive ? 'text-success' : 'text-destructive')}>
                {trend.positive ? '↑' : '↓'} {trend.value}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Sparkline with tooltip */}
      {chartData && chartData.length > 0 && (
        <div className="relative mt-3 h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <RechartsTooltip
                content={<SparklineTooltipContent />}
                cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Area
                type="monotone"
                dataKey="v"
                stroke="hsl(var(--primary))"
                strokeWidth={1.5}
                fill={`url(#spark-${label})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
