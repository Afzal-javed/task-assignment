import type { Metadata } from 'next';
import { TasksPageContent } from '@/features/tasks/components/tasks-page-content';

export const metadata: Metadata = {
  title: 'Tasks | TaskFlow',
  description: 'Manage your tasks',
};

export default function TasksPage() {
  return <TasksPageContent />;
}
