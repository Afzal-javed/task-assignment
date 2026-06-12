'use client';

import { Navbar } from '@/components/common/navbar';
import { Sidebar } from '@/components/common/sidebar';
import { useAuthUser } from '@/hooks/use-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user } = useAuthUser();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Navbar user={user} />
      <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar user={user} />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
