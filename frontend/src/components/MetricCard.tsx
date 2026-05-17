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