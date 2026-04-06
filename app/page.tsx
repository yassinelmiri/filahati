'use client';

import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { DashboardView } from '@/components/dashboard-view';
import { LandingPage } from '@/components/landing-page';
import { Language } from '@/lib/translations';

function AppContent() {
  const { isAuthenticated, language, setLanguage, theme, setTheme } = useApp();
  const [showLogin, setShowLogin] = useState(false);

  // If not authenticated and not showing login, show landing page
  if (!isAuthenticated && !showLogin) {
    return (
      <LandingPage
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        onLogin={() => setShowLogin(true)}
      />
    );
  }

  // If showing login form
  if (!isAuthenticated && showLogin) {
    return (
      <div className="relative">
        <LoginForm />
        <button
          onClick={() => setShowLogin(false)}
          className="fixed top-4 left-4 text-muted-foreground hover:text-foreground transition-colors z-50"
        >
          {language === 'fr' ? '← Retour' : '← العودة'}
        </button>
      </div>
    );
  }

  // If authenticated, show dashboard
  return (
    <AppLayout>
      <DashboardView />
    </AppLayout>
  );
}

export default function HomePage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
