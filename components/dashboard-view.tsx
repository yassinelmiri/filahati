'use client';

import { useApp } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Calculator,
  Database,
  BarChart3,
  ClipboardList,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export function DashboardView() {
  const { t, user, statistics, savedRations, feeds, language } = useApp();

  const stats = [
    {
      title: t('totalCalculations'),
      value: statistics.totalCalculations,
      icon: Calculator,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: t('savedRations'),
      value: savedRations.length,
      icon: ClipboardList,
      color: 'bg-accent/10 text-accent'
    },
    {
      title: t('feedsInDatabase'),
      value: feeds.length,
      icon: Database,
      color: 'bg-chart-3/10 text-chart-3'
    },
    {
      title: language === 'fr' ? 'Moyenne lait (kg/j)' : 'متوسط الحليب (كجم/يوم)',
      value: statistics.averageMilkProduction || 25,
      icon: TrendingUp,
      color: 'bg-chart-4/10 text-chart-4'
    }
  ];

  const quickActions = [
    {
      title: t('newCalculation'),
      description: language === 'fr' 
        ? 'Calculer une nouvelle ration alimentaire'
        : 'حساب حصة غذائية جديدة',
      href: '/calculator',
      icon: Calculator,
      color: 'bg-primary text-primary-foreground'
    },
    {
      title: t('feeds'),
      description: language === 'fr'
        ? 'Gérer la base de données des aliments'
        : 'إدارة قاعدة بيانات الأعلاف',
      href: '/feeds',
      icon: Database,
      color: 'bg-secondary text-secondary-foreground'
    },
    {
      title: t('viewStatistics'),
      description: language === 'fr'
        ? 'Voir les statistiques détaillées'
        : 'عرض الإحصائيات المفصلة',
      href: '/statistics',
      icon: BarChart3,
      color: 'bg-secondary text-secondary-foreground'
    }
  ];

  const recentRations = savedRations.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">
          {t('welcomeBack')}, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          {language === 'fr'
            ? 'Voici un aperçu de votre activité'
            : 'إليك نظرة عامة على نشاطك'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions and recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
            <CardDescription>
              {language === 'fr'
                ? 'Accédez rapidement aux fonctionnalités principales'
                : 'الوصول السريع إلى الميزات الرئيسية'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors group">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent rations */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
            <CardDescription>
              {language === 'fr'
                ? 'Vos dernières rations enregistrées'
                : 'آخر حصصك المسجلة'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentRations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('noData')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentRations.map((ration) => (
                  <div
                    key={ration.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">{ration.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ration.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-SA')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {ration.results.milkPermitted.toFixed(1)} {t('kgPerDay')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ration.cowCharacteristics.liveWeight} kg
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {savedRations.length > 5 && (
              <div className="mt-4">
                <Link href="/statistics">
                  <Button variant="outline" className="w-full">
                    {language === 'fr' ? 'Voir tout' : 'عرض الكل'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
