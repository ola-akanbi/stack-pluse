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