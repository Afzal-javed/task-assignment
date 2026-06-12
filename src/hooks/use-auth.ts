'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  hydrateAuth,
  loginUser,
  logoutUser,
  registerUser,
} from '@/store/slices/authSlice';
import type { LoginInput, RegisterInput } from '@/types';

export function useAuthUser() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  return { data: user };
}

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isPending = useAppSelector((state) => state.auth.loginLoading);

  const mutate = useCallback(
    (input: LoginInput) => {
      dispatch(loginUser(input))
        .unwrap()
        .then(() => {
          toast.success('Welcome back!');
          router.push('/dashboard');
        })
        .catch((message: string) => {
          toast.error(message);
        });
    },
    [dispatch, router]
  );

  return { mutate, isPending };
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isPending = useAppSelector((state) => state.auth.registerLoading);

  const mutate = useCallback(
    (input: RegisterInput) => {
      dispatch(registerUser(input))
        .unwrap()
        .then(() => {
          toast.success('Account created successfully!');
          router.push('/dashboard');
        })
        .catch((message: string) => {
          toast.error(message);
        });
    },
    [dispatch, router]
  );

  return { mutate, isPending };
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isPending = useAppSelector((state) => state.auth.logoutLoading);

  const mutate = useCallback(() => {
    dispatch(logoutUser())
      .finally(() => {
        toast.success('Logged out successfully');
        router.push('/login');
      });
  }, [dispatch, router]);

  return { mutate, isPending };
}
