import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Login | TaskFlow',
  description: 'Sign in to your TaskFlow account',
};

export default function LoginPage() {
  return <LoginForm />;
}
