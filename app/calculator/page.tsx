'use client';

import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { CalculatorView } from '@/components/calculator-view';

function CalculatorContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <CalculatorView />
    </AppLayout>
  );
}

export default function CalculatorPage() {
  return (
    <AppProvider>
      <CalculatorContent />
    </AppProvider>
  );
}
