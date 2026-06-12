'use client';

import { memo } from 'react';
import { CheckCircle2, ClipboardList, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPercent } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface DashboardStatsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

const statCards = [
  { key: 'totalTasks' as const, label: 'Total Tasks', icon: ClipboardList, color: 'text-blue-600' },
  { key: 'completedTasks' as const, label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600' },
  { key: 'pendingTasks' as const, label: 'Pending', icon: Clock, color: 'text-amber-600' },
  { key: 'completionPercentage' as const, label: 'Completion', icon: TrendingUp, color: 'text-violet-600' },
];

function DashboardStatsComponent({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ key, label, icon: Icon, color }) => (
          <Card key={key} className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {key === 'completionPercentage'
                  ? formatPercent(stats?.[key] ?? 0)
                  : (stats?.[key] ?? 0)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={stats?.completionPercentage ?? 0} />
          <p className="text-xs text-muted-foreground">
            {formatPercent(stats?.completionPercentage ?? 0)} of tasks completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export const DashboardStatsCards = memo(DashboardStatsComponent);
