'use client';

import { AppProvider, useApp } from '@/lib/store';
import { LoginForm } from '@/components/login-form';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Moon, Sun, Languages, User, Shield } from 'lucide-react';

function SettingsView() {
  const { t, user, language, setLanguage, isDarkMode, toggleDarkMode } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('settings')}</h1>
        <p className="text-muted-foreground">
          {language === 'fr'
            ? 'Personnalisez votre expérience'
            : 'خصص تجربتك'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {language === 'fr' ? 'Profil' : 'الملف الشخصي'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {user?.role === 'admin' ? (
                  <Shield className="w-8 h-8 text-primary" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <p className="text-lg font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              {language === 'fr' ? 'Apparence' : 'المظهر'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <div className="flex items-center justify-between">
                  <div>
                    <FieldLabel>{isDarkMode ? t('darkMode') : t('lightMode')}</FieldLabel>
                    <p className="text-sm text-muted-foreground">
                      {language === 'fr'
                        ? 'Basculer entre le mode clair et sombre'
                        : 'التبديل بين الوضع الفاتح والداكن'}
                    </p>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Language card */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              {t('language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>{language === 'fr' ? 'Langue de l\'interface' : 'لغة الواجهة'}</FieldLabel>
              <Select value={language} onValueChange={(v) => setLanguage(v as 'fr' | 'ar')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>

        {/* System info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Informations système' : 'معلومات النظام'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">{language === 'fr' ? 'Système' : 'النظام'}</span>
              <span className="font-medium">FILAHATI</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">{language === 'fr' ? 'Stockage' : 'التخزين'}</span>
              <span className="font-medium">Local Storage</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsContent() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <AppLayout>
      <SettingsView />
    </AppLayout>
  );
}

export default function SettingsPage() {
  return (
    <AppProvider>
      <SettingsContent />
    </AppProvider>
  );
}
