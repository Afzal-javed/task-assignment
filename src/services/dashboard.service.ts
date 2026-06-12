import { apiClient } from '@/lib/api-client';
import type { ApiResponse, DashboardStats } from '@/types';

export class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>(
      '/api/dashboard/stats'
    );
    return data.data;
  }
}

export const dashboardService = new DashboardService();
