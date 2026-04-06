'use client';

import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { StatisticsView } from '@/components/statistics-view';

function StatisticsContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <StatisticsView />
    </AppLayout>
  );
}

export default function StatisticsPage() {
  return (
    <AppProvider>
      <StatisticsContent />
    </AppProvider>
  );
}
