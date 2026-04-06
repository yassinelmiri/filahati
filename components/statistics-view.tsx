'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  Calculator, 
  ClipboardList, 
  TrendingUp, 
  Calendar,
  Trash2,
  Download
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function StatisticsView() {
  const { t, statistics, savedRations, deleteRation, feeds, language } = useApp();

  // Calculate statistics
  const stats = useMemo(() => {
    const milkProductions = savedRations.map(r => r.results.milkPermitted);
    const avgMilk = milkProductions.length > 0 
      ? milkProductions.reduce((a, b) => a + b, 0) / milkProductions.length 
      : 0;
    const maxMilk = milkProductions.length > 0 ? Math.max(...milkProductions) : 0;
    const minMilk = milkProductions.length > 0 ? Math.min(...milkProductions) : 0;

    const weights = savedRations.map(r => r.cowCharacteristics.liveWeight);
    const avgWeight = weights.length > 0
      ? weights.reduce((a, b) => a + b, 0) / weights.length
      : 0;

    return {
      avgMilk: avgMilk.toFixed(1),
      maxMilk: maxMilk.toFixed(1),
      minMilk: minMilk.toFixed(1),
      avgWeight: avgWeight.toFixed(0)
    };
  }, [savedRations]);

  // Activity chart data (last 30 days)
  const activityData = useMemo(() => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const existing = statistics.calculationsByDate.find(d => d.date === dateStr);
      last30Days.push({
        date: date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-SA', { 
          month: 'short', 
          day: 'numeric' 
        }),
        count: existing?.count || 0
      });
    }
    
    return last30Days;
  }, [statistics.calculationsByDate, language]);

  // Feed usage data
  const feedUsageData = useMemo(() => {
    const feedCounts: Record<string, number> = {};
    
    savedRations.forEach(ration => {
      ration.feeds.forEach(feed => {
        feedCounts[feed.feedId] = (feedCounts[feed.feedId] || 0) + 1;
      });
    });

    return Object.entries(feedCounts)
      .map(([feedId, count]) => {
        const feed = feeds.find(f => f.id === feedId);
        return {
          name: feed ? (language === 'ar' ? feed.nameAr : feed.nameFr) : feedId,
          value: count
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [savedRations, feeds, language]);

  // Milk production distribution
  const milkDistribution = useMemo(() => {
    const ranges = [
      { range: '< 20', min: 0, max: 20 },
      { range: '20-25', min: 20, max: 25 },
      { range: '25-30', min: 25, max: 30 },
      { range: '30-35', min: 30, max: 35 },
      { range: '> 35', min: 35, max: 999 }
    ];

    return ranges.map(r => ({
      range: r.range,
      count: savedRations.filter(
        ration => ration.results.milkPermitted >= r.min && ration.results.milkPermitted < r.max
      ).length
    }));
  }, [savedRations]);

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const chartConfig = {
    count: {
      label: language === 'fr' ? 'Calculs' : 'الحسابات',
      color: 'hsl(var(--chart-1))',
    },
    value: {
      label: language === 'fr' ? 'Utilisations' : 'الاستخدامات',
      color: 'hsl(var(--chart-2))',
    },
  };

  const exportData = () => {
    const data = savedRations.map(r => ({
      name: r.name,
      date: r.date,
      weight: r.cowCharacteristics.liveWeight,
      milkPotential: r.cowCharacteristics.milkProductionPotential,
      milkPermitted: r.results.milkPermitted,
      uflSupply: r.results.uflSupply,
      pdinSupply: r.results.pdinSupply,
      pdieSupply: r.results.pdieSupply
    }));

    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rations-export.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('statistics')}</h1>
          <p className="text-muted-foreground">
            {language === 'fr'
              ? 'Analyses et statistiques de vos calculs'
              : 'تحليلات وإحصائيات حساباتك'}
          </p>
        </div>
        {savedRations.length > 0 && (
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            {t('export')}
          </Button>
        )}
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalCalculations')}</p>
                <p className="text-3xl font-bold text-foreground">{statistics.totalCalculations}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('savedRations')}</p>
                <p className="text-3xl font-bold text-foreground">{savedRations.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Moy. lait permis' : 'متوسط الحليب المسموح'}
                </p>
                <p className="text-3xl font-bold text-foreground">{stats.avgMilk}</p>
                <p className="text-xs text-muted-foreground">{t('kgPerDay')}</p>
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' ? 'Poids moyen' : 'متوسط الوزن'}
                </p>
                <p className="text-3xl font-bold text-foreground">{stats.avgWeight}</p>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Activité (30 derniers jours)' : 'النشاط (آخر 30 يوم)'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Feed usage pie chart */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Aliments les plus utilisés' : 'الأعلاف الأكثر استخداماً'}</CardTitle>
          </CardHeader>
          <CardContent>
            {feedUsageData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={feedUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name.slice(0, 15)}${name.length > 15 ? '...' : ''} ${(percent * 100).toFixed(0)}%`}
                  >
                    {feedUsageData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                {t('noData')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Milk distribution */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Distribution production laitière' : 'توزيع إنتاج الحليب'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart data={milkDistribution} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--chart-2))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Min/Max stats */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>{language === 'fr' ? 'Résumé des performances' : 'ملخص الأداء'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Maximum' : 'الحد الأقصى'}</p>
                <p className="text-2xl font-bold text-success">{stats.maxMilk}</p>
                <p className="text-xs text-muted-foreground">{t('kgPerDay')}</p>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Moyenne' : 'المتوسط'}</p>
                <p className="text-2xl font-bold text-primary">{stats.avgMilk}</p>
                <p className="text-xs text-muted-foreground">{t('kgPerDay')}</p>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Minimum' : 'الحد الأدنى'}</p>
                <p className="text-2xl font-bold text-warning">{stats.minMilk}</p>
                <p className="text-xs text-muted-foreground">{t('kgPerDay')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Saved rations table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>{language === 'fr' ? 'Rations enregistrées' : 'الحصص المسجلة'}</CardTitle>
          <CardDescription>
            {language === 'fr'
              ? 'Historique de vos calculs sauvegardés'
              : 'سجل حساباتك المحفوظة'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {savedRations.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'fr' ? 'Nom' : 'الاسم'}</TableHead>
                    <TableHead>{language === 'fr' ? 'Date' : 'التاريخ'}</TableHead>
                    <TableHead className="text-center">{language === 'fr' ? 'Poids (kg)' : 'الوزن (كجم)'}</TableHead>
                    <TableHead className="text-center">{language === 'fr' ? 'Pot. lait (kg/j)' : 'إمكانية الحليب'}</TableHead>
                    <TableHead className="text-center">{language === 'fr' ? 'Lait permis (kg/j)' : 'الحليب المسموح'}</TableHead>
                    <TableHead className="text-center">UFL</TableHead>
                    <TableHead className="text-center">PDIN</TableHead>
                    <TableHead className="text-center">PDIE</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedRations.slice().reverse().map((ration) => (
                    <TableRow key={ration.id}>
                      <TableCell className="font-medium">{ration.name}</TableCell>
                      <TableCell>
                        {new Date(ration.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'ar-SA')}
                      </TableCell>
                      <TableCell className="text-center">{ration.cowCharacteristics.liveWeight}</TableCell>
                      <TableCell className="text-center">{ration.cowCharacteristics.milkProductionPotential}</TableCell>
                      <TableCell className="text-center font-medium text-primary">
                        {ration.results.milkPermitted.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center">{ration.results.uflSupply.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{ration.results.pdinSupply.toFixed(0)}</TableCell>
                      <TableCell className="text-center">{ration.results.pdieSupply.toFixed(0)}</TableCell>
                      <TableCell className="text-center">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
                              <AlertDialogDescription>
                                {t('deleteConfirmMessage')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => deleteRation(ration.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                {t('delete')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t('noData')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
