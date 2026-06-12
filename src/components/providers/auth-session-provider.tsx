'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { clearAuth, getToken } from '@/lib/auth-storage';
import { isTokenExpired } from '@/lib/token-utils';
import { AUTH_ROUTES, PROTECTED_ROUTES } from '@/lib/constants';

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const validateSession = () => {
      const token = getToken();
      const isProtected = PROTECTED_ROUTES.some((route) =>
        pathname.startsWith(route)
      );
      const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

      if (token && isTokenExpired(token)) {
        clearAuth();
        if (isProtected) {
          router.replace('/login?expired=1');
        }
        return;
      }

      if (!token && isProtected) {
        router.replace('/login');
        return;
      }

      if (token && isAuthRoute) {
        router.replace('/dashboard');
      }
    };

    validateSession();

    const interval = setInterval(validateSession, 60_000);
    return () => clearInterval(interval);
  }, [pathname, router]);

  return <>{children}</>;
}
