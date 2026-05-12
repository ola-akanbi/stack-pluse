import { useState, useMemo } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { VolumeChart } from '@/components/VolumeChart';
import { SkeletonMetricCard, SkeletonActivityRow } from '@/components/SkeletonCard';
import { getMockPlatformStats, getMockPulses, generateVolumeData, generateSparkline } from '@/lib/mock-data';
import { formatSTX, truncateAddress } from '@/lib/stx-utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Clock, CheckCircle2, XCircle, Zap, Users, TrendingUp, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/use-page-title';
import { useSimulatedLoading } from '@/hooks/use-simulated-loading';
import { formatDistanceToNow } from 'date-fns';

const stats = getMockPlatformStats();
const pulses = getMockPulses();
const sparklines = {
  pulses: generateSparkline(),
  volume: generateSparkline(),
  fees: generateSparkline(),
  senders: generateSparkline(),
};

const TIME_RANGES = ['24h', '7d', '30d'] as const;

export default function Dashboard() {
  usePageTitle('Dashboard');
  const loading = useSimulatedLoading(600);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const volumeData = useMemo(() => generateVolumeData(timeRange), [timeRange]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-56 bg-muted rounded animate-pulse" />
            <div className="h-4 w-72 bg-muted rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonMetricCard key={i} />)}
        </div>
        <div className="rounded-lg bg-card p-6 shadow-sm">
          <div className="h-[240px] bg-muted/50 rounded animate-pulse" />
        </div>
        <div className="rounded-lg bg-card shadow-sm overflow-hidden divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonActivityRow key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-display text-foreground">Protocol Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time overview of StackPulse on-chain micro-tipping activity
          </p>
        </div>
        <Link to="/send">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200">
            <Send className="h-4 w-4" />
            Send a Pulse
          </Button>
        </Link>
      </motion.div>

      {/* Time range pills */}
      <div className="flex items-center gap-2">
        {TIME_RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setTimeRange(r)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-all',
              timeRange === r
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Pulses"
          value={stats.totalPulses.toLocaleString()}
          trend={{ value: '12.3%', positive: true }}
          icon={Zap}
          sparkline={sparklines.pulses}
        />
        <MetricCard
          label="Total Volume"
          value={formatSTX(stats.totalVolume)}
          sublabel="All time"
          trend={{ value: '8.7%', positive: true }}
          icon={TrendingUp}
          sparkline={sparklines.volume}
        />
        <MetricCard
          label="Platform Fees"
          value={formatSTX(stats.totalFees)}
          sublabel="1% of volume"
          icon={Coins}
          sparkline={sparklines.fees}
        />
        <MetricCard
          label="Unique Senders"
          value={stats.uniqueSenders.toLocaleString()}
          trend={{ value: '5.1%', positive: true }}
          icon={Users}
          sparkline={sparklines.senders}
        />
      </div>

      {/* Volume Chart */}
      <VolumeChart data={volumeData} timeRange={timeRange} />

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Pulses</h2>
          <Link to="/activity" className="text-sm text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="rounded-lg bg-card shadow-sm overflow-hidden border border-border/50">
          <div className="divide-y divide-border">
            {pulses.slice(0, 8).map((pulse, i) => (
              <motion.div
                key={pulse.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 px-4 py-3 hover:bg-muted/40 hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <Send className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">
                      {truncateAddress(pulse.sender)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {truncateAddress(pulse.recipient)}
                    </span>
                  </div>
                  {pulse.message && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate max-w-md">
                      {pulse.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:inline whitespace-nowrap">
                    {formatDistanceToNow(new Date(pulse.timestamp), { addSuffix: true })}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-foreground whitespace-nowrap">
                    {formatSTX(pulse.amount)}
                  </span>
                  <StatusIcon status={pulse.status} />
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'confirmed')
    return <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />;
  if (status === 'pending')
    return <Clock className="h-4 w-4 text-warning flex-shrink-0" />;
  return <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />;
}
