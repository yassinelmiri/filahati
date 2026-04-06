'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { AdminView } from '@/components/admin-view';

function AdminContent() {
  const { isAuthenticated, user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return (
    <AppLayout>
      <AdminView />
    </AppLayout>
  );
}

export default function AdminPage() {
  return (
    <AppProvider>
      <AdminContent />
    </AppProvider>
  );
}
