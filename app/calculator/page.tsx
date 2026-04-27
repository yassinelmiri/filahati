// C:\Users\PC\Desktop\Agricole\filahati\app\calculator\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { AppLayout } from '@/components/app-layout';
import { CalculatorView } from '@/components/calculator-view';
import { LoginForm } from '@/components/login-form';
import { Skeleton } from '@/components/ui/skeleton';

function CalculatorContent() {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useApp();

  useEffect(() => {
    // Simulate loading for smoother UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
              <div>
                <Skeleton className="h-[600px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
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