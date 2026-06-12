import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  CreateTaskInput,
  Task,
  TaskListParams,
  UpdateTaskInput,
} from '@/types';

export class TaskService {
  async getTasks(params: TaskListParams = {}): Promise<ApiResponse<Task[]>> {
    const { data } = await apiClient.get<ApiResponse<Task[]>>('/api/tasks', {
      params,
    });
    return data;
  }

  async getTaskById(id: string): Promise<Task> {
    const { data } = await apiClient.get<ApiResponse<Task>>(`/api/tasks/${id}`);
    return data.data;
  }

  async createTask(input: CreateTaskInput): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<Task>>('/api/tasks', input);
    return data.data;
  }

  async updateTask(id: string, input: UpdateTaskInput): Promise<Task> {
    const { data } = await apiClient.patch<ApiResponse<Task>>(
      `/api/tasks/${id}`,
      input
    );
    return data.data;
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/api/tasks/${id}`);
  }
}

export const taskService = new TaskService();
