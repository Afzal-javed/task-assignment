export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const AUTH_TOKEN_KEY = 'accessToken';
export const AUTH_USER_KEY = 'authUser';

export const TASK_STATUSES = [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export const DEFAULT_PAGE_SIZE = 10;

export const PROTECTED_ROUTES = ['/dashboard', '/tasks'] as const;
export const AUTH_ROUTES = ['/login', '/register'] as const;
