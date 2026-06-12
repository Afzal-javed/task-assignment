import type { Metadata } from 'next';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Register | TaskFlow',
  description: 'Create your TaskFlow account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
