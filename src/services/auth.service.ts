import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  AuthResponse,
  LoginInput,
  RegisterInput,
} from '@/types';

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/register',
      input
    );
    return data.data;
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/login',
      input
    );
    return data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  }
}

export const authService = new AuthService();
