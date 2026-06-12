import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from './constants';
import type { User } from '@/types';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function buildCookie(value: string, maxAge: number): string {
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : '';
  return `${AUTH_TOKEN_KEY}=${value}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

export function setToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  document.cookie = buildCookie(token, 86400);
}

export function clearToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  document.cookie = buildCookie('', 0);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(AUTH_USER_KEY);
}

export function clearAuth(): void {
  clearToken();
  clearStoredUser();
}
