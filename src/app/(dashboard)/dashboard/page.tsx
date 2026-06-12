import type { Metadata } from 'next';
import { DashboardContent } from '@/features/dashboard/components/dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard | TaskFlow',
  description: 'Task management dashboard overview',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
