'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/common/header';
const DashboardStatsCards = dynamic(
  () => import('@/components/common/dashboard-stats').then((m) => m.DashboardStatsCards),
  { ssr: false, loading: () => <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />)}</div> }
);
import { useDashboardStats } from '@/hooks/use-dashboard';
import { useTasks } from '@/hooks/use-tasks';

const RECENT_TASKS_PARAMS = { page: 1, limit: 5, sortOrder: 'desc' as const };

export function DashboardContent() {
  const { data: stats, isLoading } = useDashboardStats();
  const recentTasksParams = useMemo(() => RECENT_TASKS_PARAMS, []);
  const { data: recentTasks } = useTasks(recentTasksParams);

  const tasks = recentTasks?.data ?? [];

  return (
    <div className="space-y-8">
      <Header
        title="Dashboard"
        description="Overview of your task management activity"
        actions={
          <Button asChild>
            <Link href="/tasks">
              View all tasks
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <DashboardStatsCards stats={stats} isLoading={isLoading} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Tasks</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks">See all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <ClipboardList className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No tasks yet</p>
              <Button className="mt-4" size="sm" asChild>
                <Link href="/tasks">Create your first task</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between py-3">
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="truncate font-medium">{task.title}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {task.status.replace('_', ' ')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/tasks">View</Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
