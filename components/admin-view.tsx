'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeedsView } from './feeds-view';
import {
  Database,
  Users,
  Settings,
  Shield,
  Activity,
  Server
} from 'lucide-react';

export function AdminView() {
  const { t, statistics, savedRations, feeds, language } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin')}</h1>
        <p className="text-muted-foreground">
          {language === 'fr'
            ? 'Panneau d\'administration du système'
            : 'لوحة إدارة النظام'}
        </p>
      </div>

      {/* System overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Aliments' : 'الأعلاف'}
                </p>
                <p className="text-3xl font-bold text-foreground">{feeds.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Rations' : 'الحصص'}
                </p>
                <p className="text-3xl font-bold text-foreground">{savedRations.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Calculs' : 'الحسابات'}
                </p>
                <p className="text-3xl font-bold text-foreground">{statistics.totalCalculations}</p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <Server className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Statut' : 'الحالة'}
                </p>
                <Badge className="mt-2 bg-success/10 text-success border-success/20" variant="outline">
                  {language === 'fr' ? 'Actif' : 'نشط'}
                </Badge>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin tabs */}
      <Tabs defaultValue="feeds" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="feeds" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            {t('manageFeeds')}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {t('manageUsers')}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t('systemSettings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="mt-6">
          <FeedsView />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>{t('manageUsers')}</CardTitle>
              <CardDescription>
                {language === 'fr'
                  ? 'Gestion des comptes utilisateurs'
                  : 'إدارة حسابات المستخدمين'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Administrateur</p>
                      <p className="text-sm text-muted-foreground">admin@agr.com</p>
                    </div>
                  </div>
                  <Badge>Admin</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Utilisateur</p>
                      <p className="text-sm text-muted-foreground">user@agr.com</p>
                    </div>
                  </div>
                  <Badge variant="secondary">User</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>{t('systemSettings')}</CardTitle>
              <CardDescription>
                {language === 'fr'
                  ? 'Configuration du système'
                  : 'إعدادات النظام'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{language === 'fr' ? 'Version du système' : 'إصدار النظام'}</p>
                    <p className="text-sm text-muted-foreground">RationPro v1.0.0</p>
                  </div>
                  <Badge variant="outline">FILAHATI</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{language === 'fr' ? 'Stockage des données' : 'تخزين البيانات'}</p>
                    <p className="text-sm text-muted-foreground">Local Storage</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                    {language === 'fr' ? 'Actif' : 'نشط'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{language === 'fr' ? 'Support multilingue' : 'دعم متعدد اللغات'}</p>
                    <p className="text-sm text-muted-foreground">Français, العربية</p>
                  </div>
                  <Badge className="bg-success/10 text-success border-success/20" variant="outline">
                    {language === 'fr' ? 'Activé' : 'مفعل'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
