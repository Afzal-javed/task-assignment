'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { makeStore, type AppStore } from '@/store';
import { ErrorBoundary } from '@/components/common/error-boundary';
import { AuthSessionProvider } from './auth-session-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <ErrorBoundary>
      <Provider store={storeRef.current}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Toaster position="top-right" richColors closeButton />
      </Provider>
    </ErrorBoundary>
  );
}
