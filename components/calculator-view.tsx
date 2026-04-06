'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '@/lib/store';
import { Feed } from '@/lib/feed-data';
import {
  CowCharacteristics,
  calculateNutrientNeeds,
  calculateIngestionCapacity,
  calculateRation,
  calculateMineralSupplement,
} from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Calculator,
  Beef,
  FlaskConical,
  Save,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Users,
  Import,
  Plus,
  Bell,
  BellRing,
  DollarSign,
  Gauge,
  AlertTriangle,
  Leaf,
  Sun,
  CloudRain,
  Snowflake,
  X,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Predefined animal profiles
const animalProfiles = [
  { id: 'holstein-high', nameFr: 'Holstein haute production', nameAr: 'هولشتاين عالية الإنتاج', liveWeight: 700, milkProductionPotential: 40, lactationWeek: 8, bodyConditionScore: 2.5, ageMonths: 48, gestationWeek: 0, isMultiparous: true },
  { id: 'holstein-medium', nameFr: 'Holstein production moyenne', nameAr: 'هولشتاين متوسطة الإنتاج', liveWeight: 650, milkProductionPotential: 30, lactationWeek: 16, bodyConditionScore: 3, ageMonths: 44, gestationWeek: 0, isMultiparous: true },
  { id: 'montbeliarde', nameFr: 'Montbéliarde', nameAr: 'مونبيليارد', liveWeight: 680, milkProductionPotential: 28, lactationWeek: 12, bodyConditionScore: 3, ageMonths: 50, gestationWeek: 8, isMultiparous: true },
  { id: 'primipare', nameFr: 'Primipare standard', nameAr: 'بكرية قياسية', liveWeight: 550, milkProductionPotential: 22, lactationWeek: 10, bodyConditionScore: 2.5, ageMonths: 28, gestationWeek: 0, isMultiparous: false },
  { id: 'tarie', nameFr: 'Vache tarie', nameAr: 'بقرة جافة', liveWeight: 700, milkProductionPotential: 0, lactationWeek: 0, bodyConditionScore: 3.5, ageMonths: 60, gestationWeek: 30, isMultiparous: true },
];

// Feed prices (MAD/kg)
const feedPrices: Record<string, number> = {
  '1': 1.5,   // Corn silage
  '2': 1.8,   // Grass silage
  '3': 3.5,   // Alfalfa hay
  '4': 2.8,   // Oat hay
  '5': 3.0,   // Vetch-Oat hay
  '6': 1.2,   // Wheat straw
  '7': 0.8,   // Fresh berseem
  '8': 4.2,   // Corn grain
  '9': 3.8,   // Barley
  '10': 3.2,  // Wheat bran
  '11': 4.5,  // Beet pulp
  '12': 6.5,  // Soybean meal 44
  '13': 7.0,  // Soybean meal 48
  '14': 5.5,  // Sunflower meal
  '15': 5.8,  // Rapeseed meal
  '16': 5.0,  // VL concentrate
  '17': 2.0,  // CaCO3
  '18': 8.0,  // Dicalcium phosphate
};

// Seasonal alarm types
type Season = 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonalAlarm {
  season: Season;
  message: string;
  messageAr: string;
  type: 'warning' | 'info';
  recommendations: string[];
  recommendationsAr: string[];
}

const seasonalAlarms: SeasonalAlarm[] = [
  {
    season: 'spring',
    message: 'Printemps: Transition vers le pâturage',
    messageAr: 'الربيع: الانتقال إلى المرعى',
    type: 'info',
    recommendations: [
      'Transition progressive vers l\'herbe fraîche (10-15 jours)',
      'Surveiller les risques de météorisation',
      'Adapter les apports en minéraux (Mg++)',
      'Réduire progressivement les concentrés'
    ],
    recommendationsAr: [
      'انتقال تدريجي للعشب الطازج (10-15 يوم)',
      'مراقبة مخاطر النفخ',
      'تعديل المعادن (Mg++)',
      'تقليل العلف المركز تدريجياً'
    ]
  },
  {
    season: 'summer',
    message: 'Été: Stress thermique et qualité fourragère',
    messageAr: 'الصيف: الإجهاد الحراري وجودة العلف',
    type: 'warning',
    recommendations: [
      'Augmenter l\'accès à l\'eau fraîche',
      'Distribuer les repas aux heures fraîches',
      'Compenser la baisse d\'ingestion par des concentrés',
      'Surveiller le TB et TP du lait'
    ],
    recommendationsAr: [
      'زيادة الوصول للماء البارد',
      'توزيع الوجبات في الساعات الباردة',
      'تعويض انخفاض الاستهلاك بالعلف المركز',
      'مراقبة نسبة الدهون والبروتين'
    ]
  },
  {
    season: 'autumn',
    message: 'Automne: Préparation à l\'hivernage',
    messageAr: 'الخريف: التحضير للشتاء',
    type: 'info',
    recommendations: [
      'Constituer les réserves corporelles',
      'Vérifier la qualité des ensilages',
      'Planifier les besoins en fourrages',
      'Préparer le tarissement des vaches'
    ],
    recommendationsAr: [
      'تكوين الاحتياطيات الجسدية',
      'التحقق من جودة السيلاج',
      'التخطيط لاحتياجات العلف',
      'تحضير تجفيف الأبقار'
    ]
  },
  {
    season: 'winter',
    message: 'Hiver: Besoins énergétiques accrus',
    messageAr: 'الشتاء: زيادة الاحتياجات الطاقوية',
    type: 'warning',
    recommendations: [
      'Augmenter les apports énergétiques (+10-15%)',
      'Assurer un fourrage de qualité',
      'Surveiller l\'état corporel',
      'Maintenir l\'eau à température modérée'
    ],
    recommendationsAr: [
      'زيادة الطاقة (+10-15%)',
      'توفير علف عالي الجودة',
      'مراقبة حالة الجسم',
      'الحفاظ على درجة حرارة الماء معتدلة'
    ]
  }
];

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

const SeasonIcon = ({ season }: { season: Season }) => {
  switch (season) {
    case 'spring': return <Leaf className="w-5 h-5" />;
    case 'summer': return <Sun className="w-5 h-5" />;
    case 'autumn': return <CloudRain className="w-5 h-5" />;
    case 'winter': return <Snowflake className="w-5 h-5" />;
  }
};

export function CalculatorView() {
  const { t, feeds, language, incrementCalculations, saveRation } = useApp();
  
  // Number of animals
  const [numberOfAnimals, setNumberOfAnimals] = useState(1);
  
  // Cow characteristics state
  const [cowData, setCowData] = useState<CowCharacteristics>({
    liveWeight: 650,
    milkProductionPotential: 30,
    lactationWeek: 16,
    bodyConditionScore: 2.5,
    ageMonths: 44,
    gestationWeek: 0,
    isMultiparous: true
  });

  // Selected feeds
  const [selectedForage, setSelectedForage] = useState<string>('1');
  const [selectedConcentrate, setSelectedConcentrate] = useState<string>('12');
  const [forageQuantity, setForageQuantity] = useState<number | undefined>(undefined);

  // Results
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [rationName, setRationName] = useState('');
  
  // Animal selection popup
  const [isAnimalDialogOpen, setIsAnimalDialogOpen] = useState(false);
  const [animalInputMode, setAnimalInputMode] = useState<'import' | 'manual'>('import');
  
  // Seasonal alarms
  const [showAlarms, setShowAlarms] = useState(true);
  const [dismissedAlarms, setDismissedAlarms] = useState<Season[]>([]);
  
  // Refs for focus management
  const liveWeightRef = useRef<HTMLInputElement>(null);
  const calculateButtonRef = useRef<HTMLButtonElement>(null);

  // Get feed objects
  const forages = feeds.filter(f => f.category === 'forage');
  const concentrates = feeds.filter(f => f.category === 'concentrate');
  const forage = feeds.find(f => f.id === selectedForage);
  const concentrate = feeds.find(f => f.id === selectedConcentrate);

  // Current season alarm
  const currentSeason = getCurrentSeason();
  const currentAlarm = seasonalAlarms.find(a => a.season === currentSeason);
  const isAlarmDismissed = dismissedAlarms.includes(currentSeason);

  // Calculate results
  const results = useMemo(() => {
    if (!forage || !concentrate) return null;

    const needs = calculateNutrientNeeds(cowData);
    const ci = calculateIngestionCapacity(cowData);
    const ration = calculateRation(cowData, forage, concentrate, forageQuantity);
    const mineral = calculateMineralSupplement(
      ration.caSupply,
      ration.pSupply,
      needs.caAbs,
      needs.pAbs
    );

    // Calculate prices
    const foragePrice = feedPrices[selectedForage] || 3;
    const concentratePrice = feedPrices[selectedConcentrate] || 5;
    const mineralPrice = 8; // Average AMV price
    
    const dailyCostPerAnimal = 
      (ration.forageDM * foragePrice) + 
      (ration.concentrateDM * concentratePrice) + 
      ((mineral.amvQuantity / 1000) * mineralPrice) +
      ((mineral.caco3Quantity / 1000) * feedPrices['17']);
    
    const totalDailyCost = dailyCostPerAnimal * numberOfAnimals;
    const monthlyCost = totalDailyCost * 30;

    return { 
      needs, 
      ci, 
      ration, 
      mineral,
      pricing: {
        foragePrice,
        concentratePrice,
        dailyCostPerAnimal,
        totalDailyCost,
        monthlyCost
      }
    };
  }, [cowData, forage, concentrate, forageQuantity, numberOfAnimals, selectedForage, selectedConcentrate]);

  const handleCalculate = useCallback(() => {
    setHasCalculated(true);
    incrementCalculations();
  }, [incrementCalculations]);

  const handleReset = () => {
    setCowData({
      liveWeight: 650,
      milkProductionPotential: 30,
      lactationWeek: 16,
      bodyConditionScore: 2.5,
      ageMonths: 44,
      gestationWeek: 0,
      isMultiparous: true
    });
    setSelectedForage('1');
    setSelectedConcentrate('12');
    setForageQuantity(undefined);
    setHasCalculated(false);
    setNumberOfAnimals(1);
  };

  const handleSave = () => {
    if (results && rationName.trim()) {
      saveRation({
        name: rationName,
        cowCharacteristics: cowData,
        feeds: [
          { feedId: selectedForage, quantity: results.ration.forageDM },
          { feedId: selectedConcentrate, quantity: results.ration.concentrateDM }
        ],
        results: {
          uflSupply: results.ration.uflSupply,
          pdinSupply: results.ration.pdinSupply,
          pdieSupply: results.ration.pdieSupply,
          milkPermitted: Math.min(
            results.ration.milkPermittedByUFL,
            results.ration.milkPermittedByPDIN,
            results.ration.milkPermittedByPDIE
          )
        }
      });
      setIsSaveDialogOpen(false);
      setRationName('');
    }
  };

  const handleSelectProfile = (profile: typeof animalProfiles[0]) => {
    setCowData({
      liveWeight: profile.liveWeight,
      milkProductionPotential: profile.milkProductionPotential,
      lactationWeek: profile.lactationWeek,
      bodyConditionScore: profile.bodyConditionScore,
      ageMonths: profile.ageMonths,
      gestationWeek: profile.gestationWeek,
      isMultiparous: profile.isMultiparous
    });
    setIsAnimalDialogOpen(false);
    // Focus on calculate button after selection
    setTimeout(() => calculateButtonRef.current?.focus(), 100);
  };

  const handleManualAnimalConfirm = () => {
    setIsAnimalDialogOpen(false);
    // Focus on live weight input for manual entry
    setTimeout(() => liveWeightRef.current?.focus(), 100);
  };

  const dismissAlarm = () => {
    setDismissedAlarms(prev => [...prev, currentSeason]);
  };

  const getFeedName = (feed: Feed) => {
    return language === 'ar' ? feed.nameAr : feed.nameFr;
  };

  return (
    <div className="space-y-6">
      {/* Seasonal Alarm Banner */}
      {showAlarms && currentAlarm && !isAlarmDismissed && (
        <Card className={cn(
          "border-2",
          currentAlarm.type === 'warning' ? "border-warning bg-warning/5" : "border-primary bg-primary/5"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  currentAlarm.type === 'warning' ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                )}>
                  <SeasonIcon season={currentSeason} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BellRing className="w-4 h-4" />
                    <h3 className="font-semibold">
                      {language === 'ar' ? currentAlarm.messageAr : currentAlarm.message}
                    </h3>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(language === 'ar' ? currentAlarm.recommendationsAr : currentAlarm.recommendations).map((rec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={dismissAlarm}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('calculator')}</h1>
          <p className="text-muted-foreground">
            {language === 'fr'
              ? 'Calculateur de ration selon le système FILAHATI'
              : 'حاسبة الحصة وفق نظام FILAHATI'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAlarms(!showAlarms)}>
            {showAlarms ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('reset')}
          </Button>
          {hasCalculated && results && (
            <Button onClick={() => setIsSaveDialogOpen(true)}>
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input panel */}
        <div className="space-y-6">
          {/* Number of animals */}
          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {language === 'fr' ? 'Nombre d\'animaux' : 'عدد الحيوانات'}
              </CardTitle>
              <CardDescription>
                {language === 'fr' 
                  ? 'Le calcul sera multiplié automatiquement'
                  : 'سيتم ضرب الحساب تلقائياً'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={1}
                  max={1000}
                  value={numberOfAnimals}
                  onChange={(e) => setNumberOfAnimals(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center text-lg font-bold"
                />
                <span className="text-muted-foreground">
                  {language === 'fr' ? 'vaches laitières' : 'أبقار حلوب'}
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAnimalDialogOpen(true)}
                  className="ml-auto"
                >
                  <Import className="w-4 h-4 mr-2" />
                  {language === 'fr' ? 'Profil animal' : 'ملف الحيوان'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cow characteristics */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beef className="w-5 h-5 text-primary" />
                {t('cowCharacteristics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>{t('liveWeight')}</FieldLabel>
                    <Input
                      ref={liveWeightRef}
                      type="number"
                      value={cowData.liveWeight}
                      onChange={(e) => setCowData({ ...cowData, liveWeight: parseFloat(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('milkProduction')}</FieldLabel>
                    <Input
                      type="number"
                      value={cowData.milkProductionPotential}
                      onChange={(e) => setCowData({ ...cowData, milkProductionPotential: parseFloat(e.target.value) || 0 })}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>{t('lactationWeek')}</FieldLabel>
                    <Input
                      type="number"
                      value={cowData.lactationWeek}
                      onChange={(e) => setCowData({ ...cowData, lactationWeek: parseInt(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('age')}</FieldLabel>
                    <Input
                      type="number"
                      value={cowData.ageMonths}
                      onChange={(e) => setCowData({ ...cowData, ageMonths: parseInt(e.target.value) || 0 })}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel>{t('bodyConditionScore')} ({cowData.bodyConditionScore})</FieldLabel>
                  <Slider
                    value={[cowData.bodyConditionScore]}
                    onValueChange={([value]) => setCowData({ ...cowData, bodyConditionScore: value })}
                    min={1}
                    max={5}
                    step={0.5}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1</span>
                    <span>5</span>
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>{t('gestationWeek')}</FieldLabel>
                    <Input
                      type="number"
                      value={cowData.gestationWeek}
                      onChange={(e) => setCowData({ ...cowData, gestationWeek: parseInt(e.target.value) || 0 })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>{t('parity')}</FieldLabel>
                    <Select
                      value={cowData.isMultiparous ? 'multi' : 'primi'}
                      onValueChange={(v) => setCowData({ ...cowData, isMultiparous: v === 'multi' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primi">{t('primiparous')}</SelectItem>
                        <SelectItem value="multi">{t('multiparous')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          {/* Feed selection */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-primary" />
                {t('feeds')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field>
                <FieldLabel className="flex items-center justify-between">
                  <span>{t('forage')}</span>
                  {forage && (
                    <Badge variant="outline" className="text-xs">
                      {feedPrices[selectedForage]} MAD/kg
                    </Badge>
                  )}
                </FieldLabel>
                <Select value={selectedForage} onValueChange={setSelectedForage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {forages.map((feed) => (
                      <SelectItem key={feed.id} value={feed.id}>
                        {getFeedName(feed)} - {feedPrices[feed.id] || '?'} MAD/kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel className="flex items-center justify-between">
                  <span>{t('concentrate')}</span>
                  {concentrate && (
                    <Badge variant="outline" className="text-xs">
                      {feedPrices[selectedConcentrate]} MAD/kg
                    </Badge>
                  )}
                </FieldLabel>
                <Select value={selectedConcentrate} onValueChange={setSelectedConcentrate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {concentrates.map((feed) => (
                      <SelectItem key={feed.id} value={feed.id}>
                        {getFeedName(feed)} - {feedPrices[feed.id] || '?'} MAD/kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>
                  {language === 'fr' ? 'Quantité fourrage fixe (kg MS)' : 'كمية العلف الثابتة (كجم مج)'} ({language === 'fr' ? 'optionnel' : 'اختياري'})
                </FieldLabel>
                <Input
                  type="number"
                  placeholder={language === 'fr' ? 'Automatique si vide' : 'تلقائي إذا فارغ'}
                  value={forageQuantity ?? ''}
                  onChange={(e) => setForageQuantity(e.target.value ? parseFloat(e.target.value) : undefined)}
                />
              </Field>

              <Button ref={calculateButtonRef} onClick={handleCalculate} className="w-full">
                <Calculator className="w-4 h-4 mr-2" />
                {t('calculate')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results panel */}
        <div className="space-y-6">
          {hasCalculated && results ? (
            <>
              {/* Ingestion Capacity Card - Prominent display */}
              <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/10 to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/20 rounded-full">
                      <Gauge className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{t('ingestionCapacity')}</h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'fr' ? 'Capacité d\'ingestion estimée' : 'القدرة على الاستهلاك المقدرة'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-background rounded-lg">
                      <p className="text-4xl font-bold text-primary">{results.ci.ci.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">UEL / {language === 'fr' ? 'animal' : 'حيوان'}</p>
                    </div>
                    <div className="text-center p-4 bg-background rounded-lg">
                      <p className="text-4xl font-bold text-chart-1">{(results.ci.ci * numberOfAnimals).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">UEL / {numberOfAnimals} {language === 'fr' ? 'animaux' : 'حيوانات'}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-muted-foreground">{language === 'fr' ? 'Base' : 'أساسي'}</p>
                      <p className="font-medium">{results.ci.baseCI.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-muted-foreground">{language === 'fr' ? 'Production' : 'إنتاج'}</p>
                      <p className="font-medium">+{results.ci.productionEffect.toFixed(2)}</p>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="text-muted-foreground">NEC</p>
                      <p className="font-medium">{results.ci.necEffect >= 0 ? '+' : ''}{results.ci.necEffect.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary card */}
              <Card className={cn(
                "border-2",
                results.ration.isBalanced ? "border-success/50 bg-success/5" : "border-warning/50 bg-warning/5"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {results.ration.isBalanced ? (
                          <CheckCircle2 className="w-6 h-6 text-success" />
                        ) : (
                          <XCircle className="w-6 h-6 text-warning" />
                        )}
                        <h3 className="text-lg font-semibold">
                          {t('rationBalance')}
                        </h3>
                      </div>
                      <Badge className={cn(
                        "mt-2",
                        results.ration.isBalanced 
                          ? "bg-success/10 text-success border-success/20" 
                          : "bg-warning/10 text-warning border-warning/20"
                      )} variant="outline">
                        {results.ration.isBalanced ? t('balanced') : t('unbalanced')}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {language === 'fr' ? 'Production lait permise' : 'إنتاج الحليب المسموح'}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {Math.min(
                          results.ration.milkPermittedByUFL,
                          results.ration.milkPermittedByPDIN,
                          results.ration.milkPermittedByPDIE
                        ).toFixed(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">{t('kgPerDay')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Card */}
              <Card className="border-border/50 bg-gradient-to-br from-chart-2/10 to-transparent">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-chart-2" />
                    {language === 'fr' ? 'Coût de l\'alimentation' : 'تكلفة التغذية'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'fr' ? 'Par animal/jour' : 'لكل حيوان/يوم'}
                      </p>
                      <p className="text-xl font-bold text-chart-2">
                        {results.pricing.dailyCostPerAnimal.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">MAD</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'fr' ? 'Total/jour' : 'الإجمالي/يوم'}
                      </p>
                      <p className="text-xl font-bold text-chart-1">
                        {results.pricing.totalDailyCost.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">MAD</p>
                    </div>
                    <div className="text-center p-3 bg-background rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        {language === 'fr' ? 'Total/mois' : 'الإجمالي/شهر'}
                      </p>
                      <p className="text-xl font-bold text-primary">
                        {results.pricing.monthlyCost.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">MAD</p>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>{getFeedName(forage!)}</span>
                      <span>{results.ration.forageDM.toFixed(2)} kg x {results.pricing.foragePrice} MAD = {(results.ration.forageDM * results.pricing.foragePrice).toFixed(2)} MAD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{getFeedName(concentrate!)}</span>
                      <span>{results.ration.concentrateDM.toFixed(2)} kg x {results.pricing.concentratePrice} MAD = {(results.ration.concentrateDM * results.pricing.concentratePrice).toFixed(2)} MAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed results tabs */}
              <Tabs defaultValue="ration" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ration">
                    {language === 'fr' ? 'Ration' : 'الحصة'}
                  </TabsTrigger>
                  <TabsTrigger value="needs">
                    {language === 'fr' ? 'Besoins' : 'الاحتياجات'}
                  </TabsTrigger>
                  <TabsTrigger value="mineral">
                    {language === 'fr' ? 'Minéraux' : 'المعادن'}
                  </TabsTrigger>
                </TabsList>

                {/* Ration tab */}
                <TabsContent value="ration">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>{language === 'fr' ? 'Composition de la ration' : 'تركيبة الحصة'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-chart-1/10 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">{t('forage')}</p>
                          <p className="text-2xl font-bold text-chart-1">
                            {results.ration.forageDM.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">kg MS / {language === 'fr' ? 'animal' : 'حيوان'}</p>
                          {numberOfAnimals > 1 && (
                            <p className="text-sm text-chart-1 mt-1">
                              {(results.ration.forageDM * numberOfAnimals).toFixed(2)} kg {language === 'fr' ? 'total' : 'إجمالي'}
                            </p>
                          )}
                        </div>
                        <div className="p-4 bg-chart-2/10 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">{t('concentrate')}</p>
                          <p className="text-2xl font-bold text-chart-2">
                            {results.ration.concentrateDM.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">kg MS / {language === 'fr' ? 'animal' : 'حيوان'}</p>
                          {numberOfAnimals > 1 && (
                            <p className="text-sm text-chart-2 mt-1">
                              {(results.ration.concentrateDM * numberOfAnimals).toFixed(2)} kg {language === 'fr' ? 'total' : 'إجمالي'}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">E (correction)</span>
                          <span className="font-medium">{results.ration.E.toFixed(3)} UFL</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">Sg (substitution)</span>
                          <span className="font-medium">{results.ration.Sg.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">% Concentré</span>
                          <span className="font-medium">{results.ration.concentratePercentage.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-sm text-muted-foreground">Rmic (PDIN-PDIE)/UFL</span>
                          <span className={cn(
                            "font-medium",
                            results.ration.rmic >= -4 ? "text-success" : "text-warning"
                          )}>
                            {results.ration.rmic.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">{language === 'fr' ? 'Lait permis par nutriment' : 'الحليب المسموح به حسب المغذيات'}</p>
                        <div className="space-y-2">
                          <ProgressBar
                            label="UFL"
                            value={results.ration.milkPermittedByUFL}
                            max={cowData.milkProductionPotential * 1.2}
                            target={cowData.milkProductionPotential}
                          />
                          <ProgressBar
                            label="PDIN"
                            value={results.ration.milkPermittedByPDIN}
                            max={cowData.milkProductionPotential * 1.2}
                            target={cowData.milkProductionPotential}
                          />
                          <ProgressBar
                            label="PDIE"
                            value={results.ration.milkPermittedByPDIE}
                            max={cowData.milkProductionPotential * 1.2}
                            target={cowData.milkProductionPotential}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Needs tab */}
                <TabsContent value="needs">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>{t('totalNeeds')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ResultRow
                        label={t('energyNeeds')}
                        value={results.needs.uflTotal.toFixed(2)}
                        unit="UFL/j"
                        breakdown={[
                          { label: t('maintenanceNeeds'), value: results.needs.uflMaintenance.toFixed(2) },
                          { label: t('productionNeeds'), value: results.needs.uflProduction.toFixed(2) },
                          { label: t('gestationNeeds'), value: results.needs.uflGestation.toFixed(2) },
                        ]}
                      />
                      <ResultRow
                        label={t('proteinNeeds')}
                        value={results.needs.pdiTotal.toFixed(0)}
                        unit="g PDI/j"
                        breakdown={[
                          { label: t('maintenanceNeeds'), value: results.needs.pdiMaintenance.toFixed(0) },
                          { label: t('productionNeeds'), value: results.needs.pdiProduction.toFixed(0) },
                          { label: t('gestationNeeds'), value: results.needs.pdiGestation.toFixed(0) },
                        ]}
                      />
                      <ResultRow
                        label={t('calciumNeeds')}
                        value={results.needs.caAbs.toFixed(1)}
                        unit="g Ca abs/j"
                      />
                      <ResultRow
                        label={t('phosphorusNeeds')}
                        value={results.needs.pAbs.toFixed(1)}
                        unit="g P abs/j"
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Mineral tab */}
                <TabsContent value="mineral">
                  <Card className="border-border/50">
                    <CardHeader>
                      <CardTitle>{language === 'fr' ? 'Équilibre minéral' : 'التوازن المعدني'}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Déficit Ca' : 'عجز Ca'}</p>
                          <p className="text-xl font-bold">{results.mineral.caDeficit.toFixed(1)} g</p>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                          <p className="text-sm text-muted-foreground">{language === 'fr' ? 'Déficit P' : 'عجز P'}</p>
                          <p className="text-xl font-bold">{results.mineral.pDeficit.toFixed(1)} g</p>
                        </div>
                      </div>

                      {results.mineral.amv && (
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm font-medium mb-2">{language === 'fr' ? 'AMV recommandé' : 'AMV الموصى به'}</p>
                          <div className="flex justify-between items-center">
                            <span>{results.mineral.amv.nameFr}</span>
                            <span className="font-bold">{results.mineral.amvQuantity} g / {language === 'fr' ? 'animal' : 'حيوان'}</span>
                          </div>
                          {numberOfAnimals > 1 && (
                            <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                              <span>{language === 'fr' ? 'Total troupeau' : 'إجمالي القطيع'}</span>
                              <span>{results.mineral.amvQuantity * numberOfAnimals} g</span>
                            </div>
                          )}
                        </div>
                      )}

                      {results.mineral.caco3Quantity > 0 && (
                        <div className="p-4 bg-secondary/50 rounded-lg">
                          <p className="text-sm font-medium mb-2">CaCO3</p>
                          <div className="flex justify-between items-center">
                            <span>{language === 'fr' ? 'Carbonate de calcium' : 'كربونات الكالسيوم'}</span>
                            <span className="font-bold">{results.mineral.caco3Quantity} g / {language === 'fr' ? 'animal' : 'حيوان'}</span>
                          </div>
                          {numberOfAnimals > 1 && (
                            <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                              <span>{language === 'fr' ? 'Total troupeau' : 'إجمالي القطيع'}</span>
                              <span>{results.mineral.caco3Quantity * numberOfAnimals} g</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card className="border-border/50 h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">
                  {language === 'fr' 
                    ? 'Configurez les paramètres et cliquez sur Calculer'
                    : 'قم بتكوين المعلمات واضغط على حساب'}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Animal Selection Dialog */}
      <Dialog open={isAnimalDialogOpen} onOpenChange={setIsAnimalDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {language === 'fr' ? 'Sélection du profil animal' : 'اختيار ملف الحيوان'}
            </DialogTitle>
            <DialogDescription>
              {language === 'fr' 
                ? 'Choisissez un profil prédéfini ou saisissez manuellement'
                : 'اختر ملفًا محددًا مسبقًا أو أدخل يدويًا'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 mb-4">
            <Button
              variant={animalInputMode === 'import' ? 'default' : 'outline'}
              onClick={() => setAnimalInputMode('import')}
              className="flex-1"
            >
              <Import className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Profils prédéfinis' : 'ملفات محددة مسبقًا'}
            </Button>
            <Button
              variant={animalInputMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setAnimalInputMode('manual')}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === 'fr' ? 'Saisie manuelle' : 'إدخال يدوي'}
            </Button>
          </div>

          {animalInputMode === 'import' ? (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {animalProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile)}
                  className="w-full p-4 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {language === 'ar' ? profile.nameAr : profile.nameFr}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profile.liveWeight} kg | {profile.milkProductionPotential} kg/j | {profile.isMultiparous ? (language === 'fr' ? 'Multipare' : 'متعددة') : (language === 'fr' ? 'Primipare' : 'بكرية')}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Beef className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {language === 'fr' 
                  ? 'Vous allez pouvoir saisir les caractéristiques manuellement dans le formulaire'
                  : 'ستتمكن من إدخال الخصائص يدويًا في النموذج'}
              </p>
              <Button onClick={handleManualAnimalConfirm}>
                {language === 'fr' ? 'Commencer la saisie' : 'بدء الإدخال'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Save dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('save')}</DialogTitle>
          </DialogHeader>
          <Field>
            <FieldLabel>{language === 'fr' ? 'Nom de la ration' : 'اسم الحصة'}</FieldLabel>
            <Input
              value={rationName}
              onChange={(e) => setRationName(e.target.value)}
              placeholder={language === 'fr' ? 'Ma ration...' : 'حصتي...'}
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} disabled={!rationName.trim()}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper components
function ResultRow({ 
  label, 
  value, 
  unit, 
  breakdown 
}: { 
  label: string; 
  value: string; 
  unit: string;
  breakdown?: { label: string; value: string }[];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-border pb-3">
      <div 
        className={cn(
          "flex justify-between items-center",
          breakdown && "cursor-pointer"
        )}
        onClick={() => breakdown && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          {breakdown && (
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-90"
            )} />
          )}
          <span className="text-sm text-muted-foreground">{label}</span>
        </div>
        <span className="font-medium">{value} <span className="text-muted-foreground text-xs">{unit}</span></span>
      </div>
      {breakdown && expanded && (
        <div className="mt-2 ml-6 space-y-1">
          {breakdown.map((item, idx) => (
            <div key={idx} className="flex justify-between text-xs text-muted-foreground">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProgressBar({ 
  label, 
  value, 
  max, 
  target 
}: { 
  label: string; 
  value: number; 
  max: number;
  target: number;
}) {
  const percentage = (value / max) * 100;
  const targetPercentage = (target / max) * 100;
  const isAboveTarget = value >= target;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn(
          "font-medium",
          isAboveTarget ? "text-success" : "text-warning"
        )}>
          {value.toFixed(1)} kg
        </span>
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "absolute h-full rounded-full transition-all",
            isAboveTarget ? "bg-success" : "bg-warning"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
        <div 
          className="absolute h-full w-0.5 bg-foreground/50"
          style={{ left: `${targetPercentage}%` }}
        />
      </div>
    </div>
  );
}
