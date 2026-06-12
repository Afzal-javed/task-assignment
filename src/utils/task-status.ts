import type { TaskStatus } from '@/types';

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_VARIANTS: Record<
  TaskStatus,
  'warning' | 'info' | 'success' | 'secondary'
> = {
  pending: 'warning',
  in_progress: 'info',
  completed: 'success',
  cancelled: 'secondary',
};
