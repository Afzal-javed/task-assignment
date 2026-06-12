'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { Plus, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/common/header';
import { SearchBar } from '@/components/common/search-bar';
import { Pagination } from '@/components/common/pagination';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { TaskCard } from '@/components/common/task-card';
import { TaskTable } from '@/components/common/task-table';

const TaskFormDialog = dynamic(
  () => import('./task-form-dialog').then((m) => m.TaskFormDialog),
  { ssr: false, loading: () => null }
);
import { useDebounce } from '@/hooks/use-debounce';
import {
  useCreateTask,
  useDeleteTask,
  useMarkTaskCompleted,
  useTasks,
  useUpdateTask,
} from '@/hooks/use-tasks';
import { DEFAULT_PAGE_SIZE, TASK_STATUSES } from '@/lib/constants';
import { STATUS_LABELS } from '@/utils/task-status';
import type { Task, TaskStatus } from '@/types';
import type { TaskFormValues } from '../schemas/task.schema';

export function TasksPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  const debouncedSearch = useDebounce(search);

  const taskParams = useMemo(
    () => ({
      page,
      limit: DEFAULT_PAGE_SIZE,
      search: debouncedSearch || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      sortOrder: 'desc' as const,
    }),
    [page, debouncedSearch, statusFilter]
  );

  const { data, isLoading, isError } = useTasks(taskParams);

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const markComplete = useMarkTaskCompleted();

  const tasks = data?.data ?? [];
  const meta = data?.meta;

  const handleCreate = useCallback(() => {
    setEditingTask(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  }, []);

  const handleFormSubmit = (values: TaskFormValues) => {
    const payload = {
      title: values.title,
      description: values.description,
      status: values.status,
      dueDate: values.dueDate
        ? new Date(values.dueDate).toISOString()
        : undefined,
    };

    if (editingTask) {
      updateTask.mutate(
        { id: editingTask.id, input: payload },
        { onSuccess: () => setDialogOpen(false) }
      );
    } else {
      createTask.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTask.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const isFormLoading = createTask.isPending || updateTask.isPending;

  return (
    <div className="space-y-6">
      <Header
        title="Tasks"
        description="Manage and track all your tasks"
        actions={
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as TaskStatus | 'all');
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {TASK_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <EmptyState
          icon={ClipboardList}
          title="Failed to load tasks"
          description="Something went wrong. Please try again later."
        />
      ) : !isLoading && tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No tasks found"
          description={
            debouncedSearch || statusFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Create your first task to get started.'
          }
          actionLabel={!debouncedSearch && statusFilter === 'all' ? 'Create Task' : undefined}
          onAction={!debouncedSearch && statusFilter === 'all' ? handleCreate : undefined}
        />
      ) : (
        <>
          <TaskTable
            tasks={tasks}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={setDeleteTarget}
            onMarkComplete={(task) => markComplete.mutate(task.id)}
          />
          <div className="grid gap-4 md:hidden">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
                ))
              : tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                    onMarkComplete={(t) => markComplete.mutate(t.id)}
                  />
                ))}
          </div>
          {meta && (
            <Pagination meta={meta} onPageChange={setPage} />
          )}
        </>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        isLoading={isFormLoading}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={deleteTask.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
