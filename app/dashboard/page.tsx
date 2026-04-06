'use client';

import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { DashboardView } from '@/components/dashboard-view';

function DashboardContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <DashboardView />
    </AppLayout>
  );
}

export default function DashboardPage() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
