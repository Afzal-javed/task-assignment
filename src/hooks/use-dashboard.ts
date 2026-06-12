'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';

export function useDashboardStats() {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.dashboard.stats);
  const isLoading = useAppSelector((state) => state.dashboard.isLoading);
  const isError = useAppSelector((state) => state.dashboard.isError);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  return { data: stats ?? undefined, isLoading, isError };
}
