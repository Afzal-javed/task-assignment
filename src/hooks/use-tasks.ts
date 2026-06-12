'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import {
  createTask,
  deleteTask,
  fetchTasks,
  getTasksQueryKey,
  invalidateAllTasks,
  optimisticUpdateTask,
  updateTask,
} from '@/store/slices/tasksSlice';
import type { CreateTaskInput, TaskListParams, UpdateTaskInput } from '@/types';

type MutationOptions = {
  onSuccess?: () => void;
};

export function useTasks(params: TaskListParams) {
  const dispatch = useAppDispatch();
  const queryKey = getTasksQueryKey(params);
  const query = useAppSelector((state) => state.tasks.queries[queryKey]);

  // Keep latest params without triggering effect on new object references
  const paramsRef = useRef(params);
  paramsRef.current = params;

  useEffect(() => {
    // Only fetch when query key changes (page, filter, search, etc.)
    // Do NOT put `params` in deps — inline objects create a new reference every render → infinite loop
    dispatch(fetchTasks(paramsRef.current));
  }, [dispatch, queryKey]);

  // Refetch once when cache was invalidated after a mutation
  useEffect(() => {
    if (query?.invalidated && !query.isLoading) {
      dispatch(fetchTasks(paramsRef.current));
    }
  }, [dispatch, queryKey, query?.invalidated, query?.isLoading]);

  return {
    data: query?.data,
    isLoading: query?.isLoading ?? true,
    isError: query?.isError ?? false,
  };
}

export function useCreateTask() {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector((state) => state.tasks.createLoading);

  const mutate = useCallback(
    (input: CreateTaskInput, options?: MutationOptions) => {
      dispatch(createTask(input))
        .unwrap()
        .then(() => {
          dispatch(invalidateAllTasks());
          dispatch(fetchDashboardStats());
          toast.success('Task created successfully');
          options?.onSuccess?.();
        })
        .catch((message: string) => toast.error(message));
    },
    [dispatch]
  );

  return { mutate, isPending };
}

export function useUpdateTask() {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector((state) => state.tasks.updateLoading);

  const mutate = useCallback(
    (
      { id, input }: { id: string; input: UpdateTaskInput },
      options?: MutationOptions
    ) => {
      dispatch(optimisticUpdateTask({ id, input }));
      dispatch(updateTask({ id, input }))
        .unwrap()
        .then(() => {
          dispatch(invalidateAllTasks());
          dispatch(fetchDashboardStats());
          toast.success('Task updated successfully');
          options?.onSuccess?.();
        })
        .catch((message: string) => {
          toast.error(message);
        });
    },
    [dispatch]
  );

  return { mutate, isPending };
}

export function useDeleteTask() {
  const dispatch = useAppDispatch();
  const isPending = useAppSelector((state) => state.tasks.deleteLoading);

  const mutate = useCallback(
    (id: string, options?: MutationOptions) => {
      dispatch(deleteTask(id))
        .unwrap()
        .then(() => {
          dispatch(invalidateAllTasks());
          dispatch(fetchDashboardStats());
          toast.success('Task deleted successfully');
          options?.onSuccess?.();
        })
        .catch((message: string) => toast.error(message));
    },
    [dispatch]
  );

  return { mutate, isPending };
}

export function useMarkTaskCompleted() {
  const update = useUpdateTask();

  return {
    mutate: (id: string) => update.mutate({ id, input: { status: 'completed' } }),
    isPending: update.isPending,
  };
}
