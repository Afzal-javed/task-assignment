export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">TaskFlow</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Task Management Dashboard
        </p>
      </div>
      {children}
    </div>
  );
}
