'use client';

import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { FeedsView } from '@/components/feeds-view';

function FeedsContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <FeedsView />
    </AppLayout>
  );
}

export default function FeedsPage() {
  return (
    <AppProvider>
      <FeedsContent />
    </AppProvider>
  );
}
