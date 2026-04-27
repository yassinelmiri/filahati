// C:\Users\PC\Desktop\Agricole\filahati\components\calculator-view.tsx
"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useApp } from "@/lib/store";
import { defaultFeeds } from "@/lib/feed-data";
import {
  CowCharacteristics,
  calculateNutrientNeeds,
  calculateIngestionCapacity,
  calculateRation,
  calculateMineralSupplement,
  checkMetabolicRisks,
  calculateCompleteRation,
  CompleteRationFormula,
} from "@/lib/calculations";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  FileSpreadsheet,
  Printer,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Shield,
  Heart,
  Activity,
  Droplets,
  Bone,
  Brain,
  Sparkles,
  Zap,
  ShieldCheck,
  Flame,
  Milk,
  Scale,
  Thermometer,
  Footprints,
  Calendar,
  Clock,
  Settings,
  Info,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================

const ANIMAL_PROFILES = [
  {
    id: "holstein-high",
    nameFr: "Holstein Haute Production",
    nameAr: "هولشتاين عالية الإنتاج",
    descriptionFr: "Vache laitière haute performance (>40kg/jour)",
    descriptionAr: "بقرة حلوب عالية الأداء",
    icon: "⭐",
    liveWeight: 700,
    milkProductionPotential: 45,
    lactationWeek: 6,
    bodyConditionScore: 2.5,
    ageMonths: 48,
    gestationWeek: 0,
    isMultiparous: true,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "holstein-medium",
    nameFr: "Holstein Production Moyenne",
    nameAr: "هولشتاين متوسطة الإنتاج",
    descriptionFr: "Vache laitière standard (30-35kg/jour)",
    descriptionAr: "بقرة حلوب قياسية",
    icon: "⭐",
    liveWeight: 650,
    milkProductionPotential: 32,
    lactationWeek: 12,
    bodyConditionScore: 3,
    ageMonths: 44,
    gestationWeek: 0,
    isMultiparous: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "montbeliarde",
    nameFr: "Montbéliarde",
    nameAr: "مونبيليارد",
    descriptionFr: "Race mixte robuste (25-30kg/jour)",
    descriptionAr: "سلالة مختلطة قوية",
    icon: "🐂",
    liveWeight: 680,
    milkProductionPotential: 28,
    lactationWeek: 14,
    bodyConditionScore: 3,
    ageMonths: 50,
    gestationWeek: 8,
    isMultiparous: true,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "primipare",
    nameFr: "Primipare Standard",
    nameAr: "بكرية قياسية",
    descriptionFr: "Première lactation (20-25kg/jour)",
    descriptionAr: "أول موسم حليب",
    icon: "🌸",
    liveWeight: 550,
    milkProductionPotential: 22,
    lactationWeek: 10,
    bodyConditionScore: 2.5,
    ageMonths: 28,
    gestationWeek: 0,
    isMultiparous: false,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "tarie",
    nameFr: "Vache Tarie (Période sèche)",
    nameAr: "بقرة جافة",
    descriptionFr: "Période de préparation au vêlage",
    descriptionAr: "فترة التحضير للولادة",
    icon: "🤰",
    liveWeight: 700,
    milkProductionPotential: 0,
    lactationWeek: 0,
    bodyConditionScore: 3.5,
    ageMonths: 60,
    gestationWeek: 32,
    isMultiparous: true,
    color: "from-slate-500 to-gray-500",
  },
  {
    id: "post-partum",
    nameFr: "Début Lactation (Post-vêlage)",
    nameAr: "بداية الحليب",
    descriptionFr: "2-4 semaines après vêlage - Période critique",
    descriptionAr: "2-4 أسابيع بعد الولادة - فترة حرجة",
    icon: "🤱",
    liveWeight: 630,
    milkProductionPotential: 35,
    lactationWeek: 3,
    bodyConditionScore: 2,
    ageMonths: 46,
    gestationWeek: 0,
    isMultiparous: true,
    color: "from-red-500 to-rose-500",
  },
];

const FEED_PRICES: Record<string, number> = {
  "1": 1.5,
  "2": 1.8,
  "2a": 2.2,
  "3": 3.5,
  "4": 2.8,
  "5": 3.0,
  "5a": 2.9,
  "6": 1.2,
  "6a": 1.1,
  "7": 0.8,
  "7a": 0.9,
  "8": 4.2,
  "9": 3.8,
  "10": 3.2,
  "11": 4.5,
  "11a": 3.5,
  "12": 6.5,
  "13": 7.0,
  "14": 5.5,
  "15": 5.8,
  "15a": 5.2,
  "15b": 6.0,
  "16": 5.0,
  "16a": 6.5,
  "17": 2.0,
  "18": 8.0,
  "19": 3.0,
  "20": 4.0,
  "21": 15.0,
};

type Season = "spring" | "summer" | "autumn" | "winter";

interface SeasonalAlarm {
  season: Season;
  message: string;
  messageAr: string;
  type: "warning" | "info" | "critical";
  recommendations: string[];
  recommendationsAr: string[];
  icon: React.ReactNode;
}

const SEASONAL_ALARMS: SeasonalAlarm[] = [
  {
    season: "spring",
    message: "🌸 Printemps: Risque de météorisation et transition au pâturage",
    messageAr: "🌸 الربيع: خطر النفخ والانتقال إلى المرعى",
    type: "warning",
    icon: <Leaf className="w-5 h-5" />,
    recommendations: [
      "🔄 Transition progressive vers l'herbe fraîche sur 10-15 jours",
      "⚠️ Surveiller les signes de météorisation (ballonnement)",
      "🧂 Augmenter les apports en magnésium (MgO)",
      "📉 Réduire progressivement les concentrés azotés",
      "🚰 Assurer un accès permanent à l'eau propre",
    ],
    recommendationsAr: [
      "🔄 انتقال تدريجي للعشب الطازج خلال 10-15 يوم",
      "⚠️ مراقبة علامات النفخ",
      "🧂 زيادة المغنيسيوم",
      "📉 تقليل العلف المركز البروتيني تدريجياً",
      "🚰 توفير ماء نظيف باستمرار",
    ],
  },
  {
    season: "summer",
    message:
      "☀️ Été: Stress thermique sévère - Risque d'acidose et baisse d'ingestion",
    messageAr: "☀️ الصيف: إجهاد حراري شديد - خطر الحموضة وانخفاض الاستهلاك",
    type: "critical",
    icon: <Sun className="w-5 h-5" />,
    recommendations: [
      "💧 Augmenter l'accès à l'eau fraîche (minimum 120-150 L/vache/jour)",
      "🌙 Distribuer les repas aux heures fraîches (6h et 20h)",
      "🧊 Installer des brumisateurs ou ventilateurs",
      "📈 Compenser la baisse d'ingestion par des concentrés énergétiques",
      "🧂 Ajouter bicarbonate de sodium (100-200g/jour)",
      "🔬 Surveiller la température corporelle et la fréquence respiratoire",
    ],
    recommendationsAr: [
      "💧 زيادة الماء البارد (120-150 لتر/بقرة/يوم)",
      "🌙 توزيع الوجبات في الساعات الباردة",
      "🧊 تركيب مراوح أو بخاخات ماء",
      "📈 تعويض انخفاض الاستهلاك بالطاقة",
      "🧂 إضافة بيكربونات الصوديوم",
      "🔬 مراقبة درجة الحرارة والتنفس",
    ],
  },
  {
    season: "autumn",
    message:
      "🍂 Automne: Préparation à l'hivernage et constitution des réserves",
    messageAr: "🍂 الخريف: التحضير للشتاء وتكوين الاحتياطيات",
    type: "info",
    icon: <CloudRain className="w-5 h-5" />,
    recommendations: [
      "📦 Constituer les réserves corporelles (NEC = 2.5-3)",
      "🔍 Vérifier la qualité des ensilages (pH, fermentation)",
      "📊 Planifier les besoins en fourrages pour l'hiver",
      "🤰 Préparer le tarissement des vaches gestantes",
      "💉 Réaliser les vaccinations de routine",
    ],
    recommendationsAr: [
      "📦 تكوين الاحتياطيات الجسدية",
      "🔍 التحقق من جودة السيلاج",
      "📊 التخطيط لاحتياجات الشتاء",
      "🤰 تحضير تجفيف الأبقار الحامل",
      "💉 إجراء التطعيمات الروتينية",
    ],
  },
  {
    season: "winter",
    message: "❄️ Hiver: Besoins énergétiques accrus - Risque d'hypothermie",
    messageAr: "❄️ الشتاء: زيادة الاحتياجات الطاقوية - خطر انخفاض الحرارة",
    type: "warning",
    icon: <Snowflake className="w-5 h-5" />,
    recommendations: [
      "📈 Augmenter les apports énergétiques (+15-20%)",
      "🏠 Assurer un abri sec et protégé des courants d'air",
      "🌾 Distribuer un fourrage de qualité (UFL > 0.75)",
      "📊 Surveiller l'état corporel (cible NEC = 2.5-3)",
      "💧 Maintenir l'eau à température modérée (10-15°C)",
      "🧂 Ajouter du magnésium pour prévenir la tétanie d'herbe",
    ],
    recommendationsAr: [
      "📈 زيادة الطاقة بنسبة 15-20%",
      "🏠 توفير مأوى جاف",
      "🌾 توزيع علف عالي الجودة",
      "📊 مراقبة حالة الجسم",
      "💧 الحفاظ على درجة حرارة الماء 10-15°C",
      "🧂 إضافة المغنيسيوم",
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

function getRmicColor(rmic: number): string {
  if (rmic >= -2 && rmic <= 2) return "text-success";
  if (rmic > 2 && rmic <= 5) return "text-warning";
  if (rmic < -2 && rmic >= -5) return "text-warning";
  return "text-destructive";
}

function getRmicMessage(rmic: number, language: string): string {
  if (language === "fr") {
    if (rmic >= -2 && rmic <= 2) return "✅ Équilibre PDIN/PDIE optimal";
    if (rmic > 2 && rmic <= 5)
      return "⚠️ Excès de PDIN - Risque d'azote uréique élevé";
    if (rmic < -2 && rmic >= -5)
      return "⚠️ Excès de PDIE - Peut limiter la production";
    return "❌ Déséquilibre sévère - Vérifier les apports protéiques";
  } else {
    if (rmic >= -2 && rmic <= 2) return "✅ توازن PDIN/PDIE مثالي";
    if (rmic > 2 && rmic <= 5) return "⚠️ زيادة PDIN - خطر ارتفاع يوريا الدم";
    if (rmic < -2 && rmic >= -5) return "⚠️ زيادة PDIE - قد يحد من الإنتاج";
    return "❌ خلل شديد - راجع البروتين";
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CalculatorView() {
  const { t, feeds, language, incrementCalculations, saveRation } = useApp();

  // UI State
  const [numberOfAnimals, setNumberOfAnimals] = useState(1);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isAnimalDialogOpen, setIsAnimalDialogOpen] = useState(false);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [animalInputMode, setAnimalInputMode] = useState<"import" | "manual">(
    "import",
  );
  const [rationName, setRationName] = useState("");
  const [showAlarms, setShowAlarms] = useState(true);
  const [dismissedAlarms, setDismissedAlarms] = useState<Season[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>("ingestion");
  const [activeTab, setActiveTab] = useState("overview");

  // Cow characteristics state
  const [cowData, setCowData] = useState<CowCharacteristics>({
    liveWeight: 650,
    milkProductionPotential: 30,
    lactationWeek: 12,
    bodyConditionScore: 3,
    ageMonths: 44,
    gestationWeek: 0,
    isMultiparous: true,
    temperature: 20,
    walkingDistance: 0,
  });

  // Selected feeds
  const [selectedForage, setSelectedForage] = useState<string>("1");
  const [selectedConcentrate, setSelectedConcentrate] = useState<string>("12");
  const [forageQuantity, setForageQuantity] = useState<number | undefined>(
    undefined,
  );

  // Refs for focus management
  const liveWeightRef = useRef<HTMLInputElement>(null);
  const calculateButtonRef = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Get feed objects
  const forages = feeds.filter((f) => f.category === "forage");
  const concentrates = feeds.filter((f) => f.category === "concentrate");
  const forage = feeds.find((f) => f.id === selectedForage);
  const concentrate = feeds.find((f) => f.id === selectedConcentrate);

  // Current season alarm
  const currentSeason = getCurrentSeason();
  const currentAlarm = SEASONAL_ALARMS.find((a) => a.season === currentSeason);
  const isAlarmDismissed = dismissedAlarms.includes(currentSeason);

  // Calculate complete results
  const completeResults = useMemo(() => {
    if (!forage || !concentrate) return null;
    try {
      return calculateCompleteRation(
        cowData,
        forage,
        concentrate,
        FEED_PRICES,
        forageQuantity,
        numberOfAnimals,
      );
    } catch (error) {
      console.error("Calculation error:", error);
      return null;
    }
  }, [cowData, forage, concentrate, forageQuantity, numberOfAnimals]);

  const handleCalculate = useCallback(() => {
    setHasCalculated(true);
    incrementCalculations();
    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }, [incrementCalculations]);

  const handleReset = () => {
    setCowData({
      liveWeight: 650,
      milkProductionPotential: 30,
      lactationWeek: 12,
      bodyConditionScore: 3,
      ageMonths: 44,
      gestationWeek: 0,
      isMultiparous: true,
      temperature: 20,
      walkingDistance: 0,
    });
    setSelectedForage("1");
    setSelectedConcentrate("12");
    setForageQuantity(undefined);
    setHasCalculated(false);
    setNumberOfAnimals(1);
    setActiveTab("overview");
    // Focus on calculate button after reset
    setTimeout(() => calculateButtonRef.current?.focus(), 100);
  };

  const handleSave = () => {
    if (completeResults && rationName.trim()) {
      saveRation({
        name: rationName,
        cowCharacteristics: cowData,
        feeds: [
          { feedId: selectedForage, quantity: completeResults.ration.forageDM },
          {
            feedId: selectedConcentrate,
            quantity: completeResults.ration.concentrateDM,
          },
        ],
        results: {
          uflSupply: completeResults.ration.uflSupply,
          pdinSupply: completeResults.ration.pdinSupply,
          pdieSupply: completeResults.ration.pdieSupply,
          milkPermitted: Math.min(
            completeResults.ration.milkPermittedByUFL,
            completeResults.ration.milkPermittedByPDIN,
            completeResults.ration.milkPermittedByPDIE,
          ),
        },
      });
      setIsSaveDialogOpen(false);
      setRationName("");
    }
  };

  const handleSelectProfile = (profile: (typeof ANIMAL_PROFILES)[0]) => {
    setCowData({
      liveWeight: profile.liveWeight,
      milkProductionPotential: profile.milkProductionPotential,
      lactationWeek: profile.lactationWeek,
      bodyConditionScore: profile.bodyConditionScore,
      ageMonths: profile.ageMonths,
      gestationWeek: profile.gestationWeek,
      isMultiparous: profile.isMultiparous,
      temperature: 20,
      walkingDistance: 0,
    });
    setIsAnimalDialogOpen(false);
    setTimeout(() => calculateButtonRef.current?.focus(), 100);
  };

  const dismissAlarm = () => {
    setDismissedAlarms((prev) => [...prev, currentSeason]);
  };

  const printResults = () => {
    window.print();
    setIsPrintDialogOpen(false);
  };

  const exportToCSV = () => {
    if (!completeResults) return;

    const headers = ["Paramètre", "Valeur", "Unité"];
    const rows = [
      ["Date", new Date().toLocaleDateString(), ""],
      ["Poids vif", cowData.liveWeight, "kg"],
      ["Production laitière", cowData.milkProductionPotential, "kg/j"],
      ["Semaine lactation", cowData.lactationWeek, "semaines"],
      ["Note état corporel", cowData.bodyConditionScore, "/5"],
      ["Fourrage (kg MS)", completeResults.ration.forageDM, "kg"],
      ["Concentré (kg MS)", completeResults.ration.concentrateDM, "kg"],
      ["Apport UFL", completeResults.ration.uflSupply, "UFL"],
      ["Bilan UFL", completeResults.ration.uflBalance, "UFL"],
      ["Apport PDI", completeResults.ration.pdinSupply, "g"],
      ["Bilan PDI", completeResults.ration.pdiBalance, "g"],
      ["Lait permis UFL", completeResults.ration.milkPermittedByUFL, "kg"],
      ["Lait permis PDIN", completeResults.ration.milkPermittedByPDIN, "kg"],
      ["Lait permis PDIE", completeResults.ration.milkPermittedByPDIE, "kg"],
      [
        "Coût journalier",
        completeResults.cost?.dailyCostPerAnimalMAD || 0,
        "MAD",
      ],
    ];

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `ration_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFeedName = (feed: Feed) => {
    return language === "ar" ? feed.nameAr : feed.nameFr;
  };

  const toggleCard = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Calculator className="w-6 h-6 text-primary" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {language === "fr"
                      ? "Calculateur de Ration FILAHATI"
                      : "حاسبة الحصة FILAHATI"}
                  </h1>
                </div>
                <p className="text-muted-foreground ml-12">
                  {language === "fr"
                    ? "Système précis d'équilibrage des rations pour vaches laitières"
                    : "نظام دقيق لموازنة حصص الأبقار الحلوب"}
                </p>
              </div>

              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsHelpDialogOpen(true)}
                    >
                      <HelpCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {language === "fr"
                      ? "Aide et documentation"
                      : "مساعدة وتوثيق"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowAlarms(!showAlarms)}
                    >
                      {showAlarms ? (
                        <BellRing className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {language === "fr"
                      ? "Alertes saisonnières"
                      : "تنبيهات موسمية"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleReset}>
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t("reset")}</TooltipContent>
                </Tooltip>

                {hasCalculated && completeResults && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={exportToCSV}
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {language === "fr"
                          ? "Exporter en CSV"
                          : "تصدير إلى CSV"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsPrintDialogOpen(true)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {language === "fr" ? "Imprimer" : "طباعة"}
                      </TooltipContent>
                    </Tooltip>

                    <Button onClick={() => setIsSaveDialogOpen(true)}>
                      <Save className="w-4 h-4 mr-2" />
                      {t("save")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Seasonal Alarm Banner */}
          {showAlarms && currentAlarm && !isAlarmDismissed && (
            <Card
              className={cn(
                "mb-6 border-l-8 overflow-hidden transition-all",
                currentAlarm.type === "critical" &&
                  "border-l-destructive bg-destructive/5",
                currentAlarm.type === "warning" &&
                  "border-l-warning bg-warning/5",
                currentAlarm.type === "info" && "border-l-primary bg-primary/5",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        currentAlarm.type === "critical" &&
                          "bg-destructive/20 text-destructive",
                        currentAlarm.type === "warning" &&
                          "bg-warning/20 text-warning",
                        currentAlarm.type === "info" &&
                          "bg-primary/20 text-primary",
                      )}
                    >
                      {currentAlarm.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {currentAlarm.type === "critical" && (
                          <AlertCircle className="w-4 h-4 text-destructive" />
                        )}
                        <h3 className="font-semibold">
                          {language === "ar"
                            ? currentAlarm.messageAr
                            : currentAlarm.message}
                        </h3>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {(language === "ar"
                          ? currentAlarm.recommendationsAr
                          : currentAlarm.recommendations
                        ).map((rec, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <ChevronRight className="w-3 h-3 flex-shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissAlarm}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* LEFT COLUMN - INPUT PANEL */}
            <div className="space-y-6">
              {/* Number of Animals Card */}
              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    {language === "fr" ? "Nombre d'animaux" : "عدد الحيوانات"}
                  </CardTitle>
                  <CardDescription>
                    {language === "fr"
                      ? "Le calcul sera multiplié automatiquement pour le troupeau"
                      : "سيتم ضرب الحساب تلقائياً للقطيع"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setNumberOfAnimals(Math.max(1, numberOfAnimals - 1))
                        }
                        className="h-10 w-10 rounded-full"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <div className="text-center">
                        <span className="text-3xl font-bold text-primary">
                          {numberOfAnimals}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          {language === "fr" ? "vaches" : "بقرة"}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setNumberOfAnimals(numberOfAnimals + 1)}
                        className="h-10 w-10 rounded-full"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => setIsAnimalDialogOpen(true)}
                      className="sm:ml-auto gap-2"
                    >
                      <Import className="w-4 h-4" />
                      {language === "fr" ? "Choisir un profil" : "اختيار ملف"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cow Characteristics Card */}
              <Card className="border-border/50 overflow-hidden">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleCard("cow")}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Beef className="w-5 h-5 text-primary" />
                      {t("cowCharacteristics")}
                    </CardTitle>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-transform",
                        expandedCard === "cow" && "rotate-90",
                      )}
                    />
                  </div>
                </CardHeader>
                {expandedCard === "cow" && (
                  <CardContent className="space-y-5 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel className="flex items-center gap-1">
                          <Scale className="w-3 h-3" />
                          {t("liveWeight")}
                        </FieldLabel>
                        <Input
                          ref={liveWeightRef}
                          type="number"
                          value={cowData.liveWeight}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              liveWeight: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="transition-all focus:ring-2 focus:ring-primary"
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="flex items-center gap-1">
                          <Milk className="w-3 h-3" />
                          {t("milkProduction")}
                        </FieldLabel>
                        <Input
                          type="number"
                          value={cowData.milkProductionPotential}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              milkProductionPotential:
                                parseFloat(e.target.value) || 0,
                            })
                          }
                          className="transition-all focus:ring-2 focus:ring-primary"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {t("lactationWeek")}
                        </FieldLabel>
                        <Input
                          type="number"
                          value={cowData.lactationWeek}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              lactationWeek: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t("age")}
                        </FieldLabel>
                        <Input
                          type="number"
                          value={cowData.ageMonths}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              ageMonths: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {t("bodyConditionScore")}
                        </span>
                        <Badge variant="outline" className="font-mono">
                          NEC: {cowData.bodyConditionScore}/5
                        </Badge>
                      </FieldLabel>
                      <Slider
                        value={[cowData.bodyConditionScore]}
                        onValueChange={([value]) =>
                          setCowData({ ...cowData, bodyConditionScore: value })
                        }
                        min={1}
                        max={5}
                        step={0.5}
                        className="mt-3"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>🐌 Maigre (1)</span>
                        <span>⚖️ Idéal (3)</span>
                        <span>🐖 Gras (5)</span>
                      </div>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          {language === "fr"
                            ? "Température (°C)"
                            : "درجة الحرارة"}
                        </FieldLabel>
                        <Input
                          type="number"
                          value={cowData.temperature || 20}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              temperature: parseFloat(e.target.value) || 20,
                            })
                          }
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="flex items-center gap-1">
                          <Footprints className="w-3 h-3" />
                          {language === "fr"
                            ? "Marche (km/j)"
                            : "المشي (كم/يوم)"}
                        </FieldLabel>
                        <Input
                          type="number"
                          value={cowData.walkingDistance || 0}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              walkingDistance: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>{t("parity")}</FieldLabel>
                        <Select
                          value={cowData.isMultiparous ? "multi" : "primi"}
                          onValueChange={(v) =>
                            setCowData({
                              ...cowData,
                              isMultiparous: v === "multi",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="primi">
                              <span className="flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                {t("primiparous")}
                              </span>
                            </SelectItem>
                            <SelectItem value="multi">
                              <span className="flex items-center gap-2">
                                <Award className="w-3 h-3" />
                                {t("multiparous")}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel>{t("gestationWeek")}</FieldLabel>
                        <Input
                          type="number"
                          value={cowData.gestationWeek}
                          onChange={(e) =>
                            setCowData({
                              ...cowData,
                              gestationWeek: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </Field>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Feed Selection Card */}
              <Card className="border-border/50 overflow-hidden">
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleCard("feeds")}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-primary" />
                      {t("feeds")}
                    </CardTitle>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 transition-transform",
                        expandedCard === "feeds" && "rotate-90",
                      )}
                    />
                  </div>
                </CardHeader>
                {expandedCard === "feeds" && (
                  <CardContent className="space-y-5 pt-0">
                    <Field>
                      <FieldLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          {t("forage")}
                        </span>
                        {forage && (
                          <Badge variant="outline" className="text-xs">
                            {FEED_PRICES[selectedForage] || 2} MAD/kg
                          </Badge>
                        )}
                      </FieldLabel>
                      <Select
                        value={selectedForage}
                        onValueChange={setSelectedForage}
                      >
                        <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {forages.map((feed) => (
                            <SelectItem key={feed.id} value={feed.id}>
                              <div className="flex justify-between w-full">
                                <span>{getFeedName(feed)}</span>
                                <span className="text-muted-foreground text-xs">
                                  UFL: {feed.ufl} | UEL: {feed.uel}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {t("concentrate")}
                        </span>
                        {concentrate && (
                          <Badge variant="outline" className="text-xs">
                            {FEED_PRICES[selectedConcentrate] || 5} MAD/kg
                          </Badge>
                        )}
                      </FieldLabel>
                      <Select
                        value={selectedConcentrate}
                        onValueChange={setSelectedConcentrate}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {concentrates.map((feed) => (
                            <SelectItem key={feed.id} value={feed.id}>
                              <div className="flex justify-between w-full">
                                <span>{getFeedName(feed)}</span>
                                <span className="text-muted-foreground text-xs">
                                  UFL: {feed.ufl} | PDI: {feed.pdin}g
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <FieldLabel className="flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        {language === "fr"
                          ? "Quantité fourrage fixe (kg MS)"
                          : "كمية العلف الثابتة (كجم مج)"}
                        <Badge variant="secondary" className="text-xs ml-2">
                          {language === "fr" ? "Optionnel" : "اختياري"}
                        </Badge>
                      </FieldLabel>
                      <Input
                        type="number"
                        placeholder={
                          language === "fr"
                            ? "Laisser vide pour auto-calcul"
                            : "اترك فارغاً للحساب التلقائي"
                        }
                        value={forageQuantity ?? ""}
                        onChange={(e) =>
                          setForageQuantity(
                            e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          )
                        }
                        className="transition-all focus:ring-2 focus:ring-primary"
                      />
                    </Field>

                    <Button
                      ref={calculateButtonRef}
                      onClick={handleCalculate}
                      className="w-full gap-2 h-12 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
                    >
                      <Calculator className="w-5 h-5" />
                      {t("calculate")}
                    </Button>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* RIGHT COLUMN - RESULTS PANEL */}
            <div ref={resultsRef} className="space-y-6">
              {hasCalculated && completeResults ? (
                <>
                  {/* Overall Balance Card */}
                  <Card
                    className={cn(
                      "border-2 overflow-hidden transition-all",
                      completeResults.ration.isBalanced
                        ? "border-success/50 bg-gradient-to-br from-success/10 to-transparent"
                        : "border-warning/50 bg-gradient-to-br from-warning/10 to-transparent",
                    )}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "p-3 rounded-full",
                              completeResults.ration.isBalanced
                                ? "bg-success/20"
                                : "bg-warning/20",
                            )}
                          >
                            {completeResults.ration.isBalanced ? (
                              <CheckCircle2 className="w-8 h-8 text-success" />
                            ) : (
                              <AlertTriangle className="w-8 h-8 text-warning" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">
                              {language === "fr"
                                ? "Équilibre de la ration"
                                : "توازن الحصة"}
                            </h3>
                            <Badge
                              variant="outline"
                              className={cn(
                                "mt-1",
                                completeResults.ration.isBalanced
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-warning/10 text-warning border-warning/20",
                              )}
                            >
                              {completeResults.ration.isBalanced
                                ? t("balanced")
                                : t("unbalanced")}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-sm text-muted-foreground">
                            {language === "fr"
                              ? "Production laitière permise"
                              : "إنتاج الحليب المسموح"}
                          </p>
                          <p className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {Math.min(
                              completeResults.ration.milkPermittedByUFL,
                              completeResults.ration.milkPermittedByPDIN,
                              completeResults.ration.milkPermittedByPDIE,
                            ).toFixed(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("kgPerDay")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-card rounded-lg p-3 text-center border border-border/50">
                      <p className="text-xs text-muted-foreground">UFL/kg MS</p>
                      <p className="text-xl font-bold text-primary">
                        {(
                          completeResults.ration.uflSupply /
                          completeResults.ration.totalDM
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-3 text-center border border-border/50">
                      <p className="text-xs text-muted-foreground">
                        PDI (g/kg MS)
                      </p>
                      <p className="text-xl font-bold text-chart-1">
                        {Math.round(
                          completeResults.ration.pdinSupply /
                            completeResults.ration.totalDM,
                        )}
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-3 text-center border border-border/50">
                      <p className="text-xs text-muted-foreground">
                        % Concentré
                      </p>
                      <p
                        className={cn(
                          "text-xl font-bold",
                          completeResults.ration.concentratePercentage > 50
                            ? "text-warning"
                            : "text-success",
                        )}
                      >
                        {completeResults.ration.concentratePercentage.toFixed(
                          0,
                        )}
                        %
                      </p>
                    </div>
                    <div className="bg-card rounded-lg p-3 text-center border border-border/50">
                      <p className="text-xs text-muted-foreground">Coût/jour</p>
                      <p className="text-xl font-bold text-chart-2">
                        {completeResults.cost?.dailyCostPerAnimalMAD.toFixed(0)}{" "}
                        MAD
                      </p>
                    </div>
                  </div>

                  {/* Detailed Results Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="overview" className="gap-1">
                        <Activity className="w-3 h-3" />
                        {language === "fr" ? "Synthèse" : "ملخص"}
                      </TabsTrigger>
                      <TabsTrigger value="ration" className="gap-1">
                        <FlaskConical className="w-3 h-3" />
                        {language === "fr" ? "Ration" : "الحصة"}
                      </TabsTrigger>
                      <TabsTrigger value="needs" className="gap-1">
                        <Target className="w-3 h-3" />
                        {language === "fr" ? "Besoins" : "الاحتياجات"}
                      </TabsTrigger>
                      <TabsTrigger value="mineral" className="gap-1">
                        <Droplets className="w-3 h-3" />
                        {language === "fr" ? "Minéraux" : "المعادن"}
                      </TabsTrigger>
                      <TabsTrigger value="risks" className="gap-1">
                        <Shield className="w-3 h-3" />
                        {language === "fr" ? "Risques" : "المخاطر"}
                      </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            {language === "fr"
                              ? "Synthèse de la ration"
                              : "ملخص الحصة"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-chart-1/10 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                {t("forage")}
                              </p>
                              <p className="text-2xl font-bold text-chart-1">
                                {formatNumber(
                                  completeResults.ration.forageDM *
                                    numberOfAnimals,
                                )}{" "}
                                kg MS
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {completeResults.ration.forageDM} kg/animal
                              </p>
                            </div>
                            <div className="p-4 bg-chart-2/10 rounded-lg text-center">
                              <p className="text-sm text-muted-foreground">
                                {t("concentrate")}
                              </p>
                              <p className="text-2xl font-bold text-chart-2">
                                {formatNumber(
                                  completeResults.ration.concentrateDM *
                                    numberOfAnimals,
                                )}{" "}
                                kg MS
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {completeResults.ration.concentrateDM} kg/animal
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">
                                Apport UFL
                              </span>
                              <span className="font-bold">
                                {formatNumber(completeResults.ration.uflSupply)}{" "}
                                UFL
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">
                                Besoins UFL
                              </span>
                              <span className="font-bold">
                                {formatNumber(completeResults.needs.uflTotal)}{" "}
                                UFL
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">
                                Bilan UFL
                              </span>
                              <span
                                className={cn(
                                  "font-bold",
                                  completeResults.ration.uflBalance >= 0
                                    ? "text-success"
                                    : "text-destructive",
                                )}
                              >
                                {completeResults.ration.uflBalance >= 0
                                  ? "+"
                                  : ""}
                                {formatNumber(
                                  completeResults.ration.uflBalance,
                                )}{" "}
                                UFL
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">
                                Apport PDI
                              </span>
                              <span className="font-bold">
                                {Math.round(completeResults.ration.pdinSupply)}{" "}
                                g
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">
                                Besoins PDI
                              </span>
                              <span className="font-bold">
                                {Math.round(completeResults.needs.pdiTotal)} g
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">
                                Bilan PDI
                              </span>
                              <span
                                className={cn(
                                  "font-bold",
                                  completeResults.ration.pdiBalance >= 0
                                    ? "text-success"
                                    : "text-destructive",
                                )}
                              >
                                {completeResults.ration.pdiBalance >= 0
                                  ? "+"
                                  : ""}
                                {Math.round(completeResults.ration.pdiBalance)}{" "}
                                g
                              </span>
                            </div>
                          </div>

                          {completeResults.cost && (
                            <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <DollarSign className="w-4 h-4 text-primary" />
                                <span className="font-semibold">
                                  {language === "fr"
                                    ? "Récapitulatif financier"
                                    : "ملخص مالي"}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>
                                    {language === "fr"
                                      ? "Coût par animal/jour"
                                      : "التكلفة لكل حيوان/يوم"}
                                  </span>
                                  <span className="font-medium">
                                    {completeResults.cost.dailyCostPerAnimalMAD.toFixed(
                                      2,
                                    )}{" "}
                                    MAD
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>
                                    {language === "fr"
                                      ? "Coût total troupeau/jour"
                                      : "إجمالي تكلفة القطيع/يوم"}
                                  </span>
                                  <span className="font-medium">
                                    {completeResults.cost.totalDailyCost.toFixed(
                                      2,
                                    )}{" "}
                                    MAD
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>
                                    {language === "fr"
                                      ? "Coût par litre de lait"
                                      : "التكلفة لكل لتر حليب"}
                                  </span>
                                  <span className="font-medium">
                                    {completeResults.cost.costPerKgMilk.toFixed(
                                      2,
                                    )}{" "}
                                    MAD
                                  </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                  <span className="font-semibold">
                                    {language === "fr"
                                      ? "Budget mensuel"
                                      : "الميزانية الشهرية"}
                                  </span>
                                  <span className="font-bold text-primary">
                                    {completeResults.cost.monthlyCost.toFixed(
                                      0,
                                    )}{" "}
                                    MAD
                                  </span>
                                  // CONTINUATION OF
                                  components/calculator-view.tsx
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Ration Tab */}
                    <TabsContent value="ration" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-primary" />
                            {language === "fr"
                              ? "Détail de la ration"
                              : "تفاصيل الحصة"}
                          </CardTitle>
                          <CardDescription>
                            {language === "fr"
                              ? "Composition détaillée et équilibre nutritionnel"
                              : "التركيبة التفصيلية والتوازن الغذائي"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Composition */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {language === "fr"
                                ? "Quantités distribuées"
                                : "الكميات الموزعة"}
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-muted/30 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {getFeedName(forage!)}
                                </p>
                                <p className="text-2xl font-bold">
                                  {formatNumber(
                                    completeResults.ration.forageDM,
                                  )}{" "}
                                  kg MS
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {language === "fr"
                                    ? "par animal"
                                    : "لكل حيوان"}
                                </p>
                                {numberOfAnimals > 1 && (
                                  <p className="text-sm text-primary mt-2">
                                    {language === "fr"
                                      ? "Total troupeau"
                                      : "إجمالي القطيع"}
                                    :{" "}
                                    {formatNumber(
                                      completeResults.ration.forageDM *
                                        numberOfAnimals,
                                    )}{" "}
                                    kg
                                  </p>
                                )}
                              </div>
                              <div className="p-4 bg-muted/30 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-1">
                                  {getFeedName(concentrate!)}
                                </p>
                                <p className="text-2xl font-bold">
                                  {formatNumber(
                                    completeResults.ration.concentrateDM,
                                  )}{" "}
                                  kg MS
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {language === "fr"
                                    ? "par animal"
                                    : "لكل حيوان"}
                                </p>
                                {numberOfAnimals > 1 && (
                                  <p className="text-sm text-primary mt-2">
                                    {language === "fr"
                                      ? "Total troupeau"
                                      : "إجمالي القطيع"}
                                    :{" "}
                                    {formatNumber(
                                      completeResults.ration.concentrateDM *
                                        numberOfAnimals,
                                    )}{" "}
                                    kg
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Energy Balance */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-warning" />
                              {language === "fr"
                                ? "Équilibre énergétique"
                                : "التوازن الطاقوي"}
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  {language === "fr"
                                    ? "Apport UFL"
                                    : "إمداد UFL"}
                                </span>
                                <span className="font-mono font-semibold">
                                  {formatNumber(
                                    completeResults.ration.uflSupply,
                                  )}{" "}
                                  UFL
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  {language === "fr"
                                    ? "Besoins UFL"
                                    : "احتياجات UFL"}
                                </span>
                                <span className="font-mono font-semibold">
                                  {formatNumber(completeResults.needs.uflTotal)}{" "}
                                  UFL
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-medium">
                                  {language === "fr"
                                    ? "Bilan UFL"
                                    : "توازن UFL"}
                                </span>
                                <span
                                  className={cn(
                                    "font-mono font-bold text-lg",
                                    completeResults.ration.uflBalance >= 0
                                      ? "text-success"
                                      : "text-destructive",
                                  )}
                                >
                                  {completeResults.ration.uflBalance >= 0
                                    ? "+"
                                    : ""}
                                  {formatNumber(
                                    completeResults.ration.uflBalance,
                                  )}{" "}
                                  UFL
                                </span>
                              </div>
                              {completeResults.ration.uflBalance < 0 && (
                                <div className="p-3 bg-warning/10 rounded-lg text-sm text-warning">
                                  ⚠️{" "}
                                  {language === "fr"
                                    ? "Déficit énergétique - Augmenter les concentrés ou améliorer la qualité du fourrage"
                                    : "عجز في الطاقة - زيادة المركزات أو تحسين جودة العلف"}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Protein Balance */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-primary" />
                              {language === "fr"
                                ? "Équilibre protéique"
                                : "التوازن البروتيني"}
                            </h4>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  PDIN
                                </span>
                                <span className="font-mono font-semibold">
                                  {Math.round(
                                    completeResults.ration.pdinSupply,
                                  )}{" "}
                                  g
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  PDIE
                                </span>
                                <span className="font-mono font-semibold">
                                  {Math.round(
                                    completeResults.ration.pdieSupply,
                                  )}{" "}
                                  g
                                </span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-sm font-medium">
                                  {language === "fr"
                                    ? "Bilan PDI"
                                    : "توازن PDI"}
                                </span>
                                <span
                                  className={cn(
                                    "font-mono font-bold text-lg",
                                    completeResults.ration.pdiBalance >= 0
                                      ? "text-success"
                                      : "text-destructive",
                                  )}
                                >
                                  {completeResults.ration.pdiBalance >= 0
                                    ? "+"
                                    : ""}
                                  {Math.round(
                                    completeResults.ration.pdiBalance,
                                  )}{" "}
                                  g
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                  Rmic
                                </span>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <span
                                      className={cn(
                                        "font-mono font-semibold cursor-help",
                                        getRmicColor(
                                          completeResults.ration.rmic,
                                        ),
                                      )}
                                    >
                                      {formatNumber(
                                        completeResults.ration.rmic,
                                        2,
                                      )}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {getRmicMessage(
                                      completeResults.ration.rmic,
                                      language,
                                    )}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          </div>

                          {/* Ingestion Parameters */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Gauge className="w-4 h-4" />
                              {language === "fr"
                                ? "Paramètres d'ingestion"
                                : "معاملات الاستهلاك"}
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  E (correction)
                                </p>
                                <p className="font-mono font-semibold">
                                  {formatNumber(completeResults.ration.E, 3)}
                                </p>
                              </div>
                              <div className="p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  Sg (substitution)
                                </p>
                                <p className="font-mono font-semibold">
                                  {formatNumber(completeResults.ration.Sg, 3)}
                                </p>
                              </div>
                              <div className="p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  {language === "fr"
                                    ? "Densité énergétique min"
                                    : "الكثافة الطاقوية الدنيا"}
                                </p>
                                <p className="font-mono font-semibold">
                                  {formatNumber(
                                    completeResults.ration.energyDensityMin,
                                    3,
                                  )}{" "}
                                  UFL/UEL
                                </p>
                              </div>
                              <div className="p-2 bg-muted/30 rounded">
                                <p className="text-muted-foreground">
                                  {language === "fr"
                                    ? "Densité fourrage"
                                    : "كثافة العلف"}
                                </p>
                                <p className="font-mono font-semibold">
                                  {formatNumber(
                                    completeResults.ration.energyDensityForage,
                                    3,
                                  )}{" "}
                                  UFL/UEL
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Milk Permitted by Each Nutrient */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Milk className="w-4 h-4 text-blue-500" />
                              {language === "fr"
                                ? "Lait permis par nutriment"
                                : "الحليب المسموح حسب المغذيات"}
                            </h4>
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>
                                    UFL:{" "}
                                    {formatNumber(
                                      completeResults.ration.milkPermittedByUFL,
                                      1,
                                    )}{" "}
                                    kg
                                  </span>
                                  <span className="text-muted-foreground">
                                    {Math.round(
                                      (completeResults.ration
                                        .milkPermittedByUFL /
                                        cowData.milkProductionPotential) *
                                        100,
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min((completeResults.ration.milkPermittedByUFL / cowData.milkProductionPotential) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>
                                    PDIN:{" "}
                                    {formatNumber(
                                      completeResults.ration
                                        .milkPermittedByPDIN,
                                      1,
                                    )}{" "}
                                    kg
                                  </span>
                                  <span className="text-muted-foreground">
                                    {Math.round(
                                      (completeResults.ration
                                        .milkPermittedByPDIN /
                                        cowData.milkProductionPotential) *
                                        100,
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min((completeResults.ration.milkPermittedByPDIN / cowData.milkProductionPotential) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>
                                    PDIE:{" "}
                                    {formatNumber(
                                      completeResults.ration
                                        .milkPermittedByPDIE,
                                      1,
                                    )}{" "}
                                    kg
                                  </span>
                                  <span className="text-muted-foreground">
                                    {Math.round(
                                      (completeResults.ration
                                        .milkPermittedByPDIE /
                                        cowData.milkProductionPotential) *
                                        100,
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-purple-500 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min((completeResults.ration.milkPermittedByPDIE / cowData.milkProductionPotential) * 100, 100)}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Needs Tab */}
                    <TabsContent value="needs" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            {language === "fr"
                              ? "Détail des besoins nutritionnels"
                              : "تفاصيل الاحتياجات الغذائية"}
                          </CardTitle>
                          <CardDescription>
                            {language === "fr"
                              ? "Besoins calculés selon les équations FILAHATI"
                              : "الاحتياجات المحسوبة حسب معادلات FILAHATI"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Energy Needs Breakdown */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Zap className="w-4 h-4 text-warning" />
                              {language === "fr"
                                ? "Besoins énergétiques (UFL/jour)"
                                : "الاحتياجات الطاقوية (UFL/يوم)"}
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {t("maintenanceNeeds")}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(
                                    completeResults.needs.uflMaintenance,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {t("productionNeeds")}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(
                                    completeResults.needs.uflProduction,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {t("gestationNeeds")}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(
                                    completeResults.needs.uflGestation,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {language === "fr" ? "Croissance" : "نمو"}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(
                                    completeResults.needs.uflGrowth,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {language === "fr"
                                    ? "Thermorégulation"
                                    : "تنظيم حراري"}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(
                                    completeResults.needs.uflThermoregulation,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {language === "fr" ? "Exercice" : "حركة"}
                                </span>
                                <span className="font-mono">
                                  {formatNumber(
                                    completeResults.needs.uflExercise,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 mt-2 bg-primary/5 rounded-lg px-2">
                                <span className="font-semibold">
                                  {language === "fr"
                                    ? "TOTAL UFL"
                                    : "الإجمالي UFL"}
                                </span>
                                <span className="font-bold text-primary">
                                  {formatNumber(completeResults.needs.uflTotal)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Protein Needs Breakdown */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-primary" />
                              {language === "fr"
                                ? "Besoins protéiques (g PDI/jour)"
                                : "الاحتياجات البروتينية (جم PDI/يوم)"}
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {t("maintenanceNeeds")}
                                </span>
                                <span className="font-mono">
                                  {Math.round(
                                    completeResults.needs.pdiMaintenance,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {t("productionNeeds")}
                                </span>
                                <span className="font-mono">
                                  {Math.round(
                                    completeResults.needs.pdiProduction,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {t("gestationNeeds")}
                                </span>
                                <span className="font-mono">
                                  {Math.round(
                                    completeResults.needs.pdiGestation,
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between py-1 border-b border-border/50">
                                <span className="text-muted-foreground">
                                  {language === "fr" ? "Croissance" : "نمو"}
                                </span>
                                <span className="font-mono">
                                  {Math.round(completeResults.needs.pdiGrowth)}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 mt-2 bg-primary/5 rounded-lg px-2">
                                <span className="font-semibold">
                                  {language === "fr"
                                    ? "TOTAL PDI"
                                    : "الإجمالي PDI"}
                                </span>
                                <span className="font-bold text-primary">
                                  {Math.round(completeResults.needs.pdiTotal)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Mineral Needs */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Droplets className="w-4 h-4 text-cyan-500" />
                              {language === "fr"
                                ? "Besoins minéraux (absorbables)"
                                : "الاحتياجات المعدنية (القابلة للامتصاص)"}
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-muted/30 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Calcium (Ca)
                                </p>
                                <p className="text-xl font-bold">
                                  {formatNumber(completeResults.needs.caAbs)} g
                                </p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Phosphore (P)
                                </p>
                                <p className="text-xl font-bold">
                                  {formatNumber(completeResults.needs.pAbs)} g
                                </p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Magnésium (Mg)
                                </p>
                                <p className="text-xl font-bold">
                                  {formatNumber(completeResults.needs.mgAbs)} g
                                </p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Sodium (Na)
                                </p>
                                <p className="text-xl font-bold">
                                  {formatNumber(completeResults.needs.naAbs)} g
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                              <div className="flex justify-between text-sm">
                                <span>
                                  {language === "fr"
                                    ? "Rapport Ca/P idéal"
                                    : "نسبة Ca/P المثالية"}
                                </span>
                                <span className="font-mono">1.5 - 2.0 : 1</span>
                              </div>
                              <div className="flex justify-between text-sm mt-1">
                                <span>
                                  {language === "fr"
                                    ? "Rapport calculé"
                                    : "النسبة المحسوبة"}
                                </span>
                                <span
                                  className={cn(
                                    "font-mono font-semibold",
                                    completeResults.needs.caPCoeff >= 1.5 &&
                                      completeResults.needs.caPCoeff <= 2.0
                                      ? "text-success"
                                      : "text-warning",
                                  )}
                                >
                                  {formatNumber(
                                    completeResults.needs.caPCoeff,
                                    2,
                                  )}{" "}
                                  : 1
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Mineral Tab */}
                    <TabsContent value="mineral" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-primary" />
                            {language === "fr"
                              ? "Complémentation minérale"
                              : "الإكمال المعدني"}
                          </CardTitle>
                          <CardDescription>
                            {language === "fr"
                              ? "Additifs recommandés pour équilibrer la ration"
                              : "الإضافات الموصى بها لموازنة الحصة"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Deficits */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3">
                              {language === "fr"
                                ? "Déficits à corriger"
                                : "العجز المطلوب تصحيحه"}
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-destructive/10 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Ca
                                </p>
                                <p className="text-xl font-bold text-destructive">
                                  {formatNumber(
                                    completeResults.mineral.caDeficit,
                                  )}{" "}
                                  g
                                </p>
                              </div>
                              <div className="p-3 bg-destructive/10 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  P
                                </p>
                                <p className="text-xl font-bold text-destructive">
                                  {formatNumber(
                                    completeResults.mineral.pDeficit,
                                  )}{" "}
                                  g
                                </p>
                              </div>
                              <div className="p-3 bg-destructive/10 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Mg
                                </p>
                                <p className="text-xl font-bold text-destructive">
                                  {formatNumber(
                                    completeResults.mineral.mgDeficit,
                                  )}{" "}
                                  g
                                </p>
                              </div>
                              <div className="p-3 bg-destructive/10 rounded-lg text-center">
                                <p className="text-xs text-muted-foreground">
                                  Na
                                </p>
                                <p className="text-xl font-bold text-destructive">
                                  {formatNumber(
                                    completeResults.mineral.naDeficit,
                                  )}{" "}
                                  g
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* AMV Recommendation */}
                          {completeResults.mineral.amv &&
                            completeResults.mineral.amvQuantity > 0 && (
                              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 bg-primary/20 rounded-full">
                                    <Package className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      {language === "fr"
                                        ? "AMV Recommandé"
                                        : "AMV الموصى به"}
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                      {completeResults.mineral.amv.nameFr}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>
                                      {language === "fr"
                                        ? "Quantité/animal"
                                        : "الكمية/حيوان"}
                                    </span>
                                    <span className="font-mono font-semibold">
                                      {completeResults.mineral.amvQuantity} g
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>
                                      {language === "fr"
                                        ? "Quantité troupeau"
                                        : "كمية القطيع"}
                                    </span>
                                    <span className="font-mono font-semibold">
                                      {completeResults.mineral.amvQuantity *
                                        numberOfAnimals}{" "}
                                      g
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Ca</span>
                                    <span>
                                      {completeResults.mineral.amv.caPercent}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>P</span>
                                    <span>
                                      {completeResults.mineral.amv.pPercent}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                          {/* Additives */}
                          <div>
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              {language === "fr"
                                ? "Additifs complémentaires"
                                : "إضافات تكميلية"}
                            </h4>
                            <div className="space-y-3">
                              {completeResults.mineral.caco3Quantity > 0 && (
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span>Carbonate de calcium (CaCO₃)</span>
                                  </div>
                                  <span className="font-mono font-semibold">
                                    {completeResults.mineral.caco3Quantity} g
                                  </span>
                                </div>
                              )}

                              {completeResults.mineral
                                .sodiumBicarbonateQuantity > 0 && (
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span>Bicarbonate de sodium (NaHCO₃)</span>
                                  </div>
                                  <span className="font-mono font-semibold">
                                    {
                                      completeResults.mineral
                                        .sodiumBicarbonateQuantity
                                    }{" "}
                                    g
                                  </span>
                                </div>
                              )}

                              {completeResults.mineral.magnesiumOxideQuantity >
                                0 && (
                                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    <span>Oxyde de magnésium (MgO)</span>
                                  </div>
                                  <span className="font-mono font-semibold">
                                    {
                                      completeResults.mineral
                                        .magnesiumOxideQuantity
                                    }{" "}
                                    g
                                  </span>
                                </div>
                              )}

                              {completeResults.mineral.propyleneGlycolQuantity >
                                0 && (
                                <div className="flex justify-between items-center p-3 bg-warning/20 rounded-lg border border-warning/30">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-warning"></div>
                                    <span className="font-medium">
                                      💊 Propylène Glycol (Propaline)
                                    </span>
                                  </div>
                                  <span className="font-mono font-semibold text-warning">
                                    {
                                      completeResults.mineral
                                        .propyleneGlycolQuantity
                                    }{" "}
                                    ml
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ca/P Ratio Info */}
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>
                                {language === "fr"
                                  ? "Rapport Ca/P de la ration"
                                  : "نسبة Ca/P في الحصة"}
                              </span>
                              <span className="font-mono">
                                {formatNumber(
                                  completeResults.mineral.dcalciumRatio,
                                  2,
                                )}{" "}
                                : 1
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span>
                                {language === "fr"
                                  ? "Rapport Ca/P cible"
                                  : "النسبة المستهدفة Ca/P"}
                              </span>
                              <span className="font-mono text-muted-foreground">
                                1.5 - 2.0 : 1
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Risks Tab */}
                    <TabsContent value="risks" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            {language === "fr"
                              ? "Prévention des maladies métaboliques"
                              : "الوقاية من الأمراض الأيضية"}
                          </CardTitle>
                          <CardDescription>
                            {language === "fr"
                              ? "Évaluation des risques et recommandations"
                              : "تقييم المخاطر والتوصيات"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Risk Levels */}
                          <div className="grid grid-cols-2 gap-3">
                            <div
                              className={cn(
                                "p-3 rounded-lg text-center",
                                completeResults.risks.milkFeverRisk === "high"
                                  ? "bg-destructive/20 text-destructive"
                                  : completeResults.risks.milkFeverRisk ===
                                      "moderate"
                                    ? "bg-warning/20 text-warning"
                                    : "bg-success/20 text-success",
                              )}
                            >
                              <Bone className="w-5 h-5 mx-auto mb-1" />
                              <p className="text-xs font-medium">
                                {language === "fr"
                                  ? "Fièvre de lait"
                                  : "حمى الحليب"}
                              </p>
                              <p className="text-sm font-bold">
                                {language === "fr"
                                  ? completeResults.risks.milkFeverRisk ===
                                    "high"
                                    ? "Élevé"
                                    : completeResults.risks.milkFeverRisk ===
                                        "moderate"
                                      ? "Modéré"
                                      : "Faible"
                                  : completeResults.risks.milkFeverRisk ===
                                      "high"
                                    ? "مرتفع"
                                    : completeResults.risks.milkFeverRisk ===
                                        "moderate"
                                      ? "متوسط"
                                      : "منخفض"}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "p-3 rounded-lg text-center",
                                completeResults.risks.ketosisRisk === "high"
                                  ? "bg-destructive/20 text-destructive"
                                  : completeResults.risks.ketosisRisk ===
                                      "moderate"
                                    ? "bg-warning/20 text-warning"
                                    : "bg-success/20 text-success",
                              )}
                            >
                              <Brain className="w-5 h-5 mx-auto mb-1" />
                              <p className="text-xs font-medium">
                                {language === "fr" ? "Cétose" : "كيتوزية"}
                              </p>
                              <p className="text-sm font-bold">
                                {language === "fr"
                                  ? completeResults.risks.ketosisRisk === "high"
                                    ? "Élevé"
                                    : completeResults.risks.ketosisRisk ===
                                        "moderate"
                                      ? "Modéré"
                                      : "Faible"
                                  : completeResults.risks.ketosisRisk === "high"
                                    ? "مرتفع"
                                    : completeResults.risks.ketosisRisk ===
                                        "moderate"
                                      ? "متوسط"
                                      : "منخفض"}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "p-3 rounded-lg text-center",
                                completeResults.risks.acidosisRisk === "high"
                                  ? "bg-destructive/20 text-destructive"
                                  : completeResults.risks.acidosisRisk ===
                                      "moderate"
                                    ? "bg-warning/20 text-warning"
                                    : "bg-success/20 text-success",
                              )}
                            >
                              <FlaskConical className="w-5 h-5 mx-auto mb-1" />
                              <p className="text-xs font-medium">
                                {language === "fr" ? "Acidose" : "حموضة"}
                              </p>
                              <p className="text-sm font-bold">
                                {language === "fr"
                                  ? completeResults.risks.acidosisRisk ===
                                    "high"
                                    ? "Élevé"
                                    : completeResults.risks.acidosisRisk ===
                                        "moderate"
                                      ? "Modéré"
                                      : "Faible"
                                  : completeResults.risks.acidosisRisk ===
                                      "high"
                                    ? "مرتفع"
                                    : completeResults.risks.acidosisRisk ===
                                        "moderate"
                                      ? "متوسط"
                                      : "منخفض"}
                              </p>
                            </div>
                            <div
                              className={cn(
                                "p-3 rounded-lg text-center",
                                completeResults.risks.tetanyRisk === "high"
                                  ? "bg-destructive/20 text-destructive"
                                  : completeResults.risks.tetanyRisk ===
                                      "moderate"
                                    ? "bg-warning/20 text-warning"
                                    : "bg-success/20 text-success",
                              )}
                            >
                              <Activity className="w-5 h-5 mx-auto mb-1" />
                              <p className="text-xs font-medium">
                                {language === "fr" ? "Tétanie" : "كزاز"}
                              </p>
                              <p className="text-sm font-bold">
                                {language === "fr"
                                  ? completeResults.risks.tetanyRisk === "high"
                                    ? "Élevé"
                                    : completeResults.risks.tetanyRisk ===
                                        "moderate"
                                      ? "Modéré"
                                      : "Faible"
                                  : completeResults.risks.tetanyRisk === "high"
                                    ? "مرتفع"
                                    : completeResults.risks.tetanyRisk ===
                                        "moderate"
                                      ? "متوسط"
                                      : "منخفض"}
                              </p>
                            </div>
                          </div>

                          {/* Recommendations */}
                          {completeResults.risks.recommendations.length > 0 && (
                            <div className="p-4 bg-primary/5 rounded-lg">
                              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-success" />
                                {language === "fr"
                                  ? "Recommandations"
                                  : "توصيات"}
                              </h4>
                              <ul className="space-y-2">
                                {completeResults.risks.recommendations.map(
                                  (rec, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm"
                                    >
                                      <span className="text-primary mt-0.5">
                                        •
                                      </span>
                                      <span>{rec}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Prevention Tips */}
                          <div className="p-4 bg-muted/20 rounded-lg">
                            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                              <Heart className="w-4 h-4 text-rose-500" />
                              {language === "fr"
                                ? "Conseils de prévention"
                                : "نصائح وقائية"}
                            </h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-success mt-0.5" />
                                <span>
                                  {language === "fr"
                                    ? "Transition alimentaire progressive (10-14 jours) avant et après vêlage"
                                    : "انتقال غذائي تدريجي (10-14 يوم) قبل وبعد الولادة"}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-success mt-0.5" />
                                <span>
                                  {language === "fr"
                                    ? "Surveiller l'état corporel (NEC cible: 2.5-3 au vêlage)"
                                    : "مراقبة حالة الجسم (الهدف: 2.5-3 عند الولادة)"}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-success mt-0.5" />
                                <span>
                                  {language === "fr"
                                    ? "Assurer une eau propre et fraîche en permanence"
                                    : "توفير ماء نظيف وبارد باستمرار"}
                                </span>
                              </li>
                              <li className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-success mt-0.5" />
                                <span>
                                  {language === "fr"
                                    ? "Maintenir une bonne hygiène des logettes et des aires d'alimentation"
                                    : "الحفاظ على نظافة أماكن النوم والتغذية"}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                // Empty State
                <Card className="border-border/50 h-[500px] flex items-center justify-center">
                  <div className="text-center text-muted-foreground p-8">
                    <div className="p-4 bg-muted/30 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                      <Calculator className="w-12 h-12 opacity-30" />
                    </div>
                    <p className="text-lg font-medium">
                      {language === "fr"
                        ? "Configurez la ration et cliquez sur Calculer"
                        : "قم بتكوين الحصة واضغط على حساب"}
                    </p>
                    <p className="text-sm mt-2">
                      {language === "fr"
                        ? "Le système FILAHATI calculera la ration équilibrée"
                        : "سيقوم نظام FILAHATI بحساب الحصة المتوازنة"}
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animal Selection Dialog */}
      <Dialog open={isAnimalDialogOpen} onOpenChange={setIsAnimalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Beef className="w-5 h-5 text-primary" />
              {language === "fr"
                ? "Sélection du profil animal"
                : "اختيار ملف الحيوان"}
            </DialogTitle>
            <DialogDescription>
              {language === "fr"
                ? "Choisissez un profil prédéfini pour un calcul rapide"
                : "اختر ملفًا محددًا مسبقًا للحساب السريع"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
            {ANIMAL_PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleSelectProfile(profile)}
                className={cn(
                  "p-4 text-left rounded-xl transition-all",
                  "bg-gradient-to-r hover:shadow-lg hover:scale-[1.02]",
                  profile.color,
                  "text-white",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-1">{profile.icon}</div>
                    <p className="font-semibold">
                      {language === "ar" ? profile.nameAr : profile.nameFr}
                    </p>
                    <p className="text-xs opacity-90 mt-1">
                      {language === "ar"
                        ? profile.descriptionAr
                        : profile.descriptionFr}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs opacity-80">
                      <span>{profile.liveWeight} kg</span>
                      <span>•</span>
                      <span>{profile.milkProductionPotential} kg/j</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-70" />
                </div>
              </button>
            ))}
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsAnimalDialogOpen(false)}
              className="flex-1"
            >
              {language === "fr" ? "Fermer" : "إغلاق"}
            </Button>
            <Button
              onClick={() => {
                setIsAnimalDialogOpen(false);
                liveWeightRef.current?.focus();
              }}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              {language === "fr" ? "Saisie manuelle" : "إدخال يدوي"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("save")}</DialogTitle>
            <DialogDescription>
              {language === "fr"
                ? "Donnez un nom à cette ration pour la retrouver plus tard"
                : "قم بتسمية هذه الحصة للعثور عليها لاحقًا"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Field>
              <FieldLabel>
                {language === "fr" ? "Nom de la ration" : "اسم الحصة"}
              </FieldLabel>
              <Input
                value={rationName}
                onChange={(e) => setRationName(e.target.value)}
                placeholder={
                  language === "fr"
                    ? "Ex: Ration Holstein 40L"
                    : "مثال: حصة هولشتاين 40 لتر"
                }
                autoFocus
              />
            </Field>
            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              <p className="text-muted-foreground mb-1">
                {language === "fr" ? "Résumé" : "ملخص"}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>
                    {cowData.liveWeight} kg, {cowData.milkProductionPotential}{" "}
                    L/j
                  </span>
                  <span>
                    {completeResults?.ration.milkPermittedByUFL.toFixed(1)} L
                    max
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSave} disabled={!rationName.trim()}>
              <Save className="w-4 h-4 mr-2" />
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "fr" ? "Impression de la ration" : "طباعة الحصة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {language === "fr"
                ? "Préparez-vous à imprimer le rapport complet de la ration"
                : "استعد لطباعة تقرير الحصة الكامل"}
            </p>
            <div className="flex gap-3">
              <Button onClick={printResults} className="flex-1 gap-2">
                <Printer className="w-4 h-4" />
                {language === "fr" ? "Imprimer" : "طباعة"}
              </Button>
              <Button
                variant="outline"
                onClick={exportToCSV}
                className="flex-1 gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                CSV
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={isHelpDialogOpen} onOpenChange={setIsHelpDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              {language === "fr" ? "Guide FILAHATI" : "دليل FILAHATI"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Équations */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-primary" />
                {language === "fr"
                  ? "Équations clés du système"
                  : "المعادلات الرئيسية للنظام"}
              </h3>
              <div className="space-y-2 text-sm font-mono bg-muted/30 p-4 rounded-lg">
                <p>
                  <span className="text-primary">Éq 1:</span> UFL_entretien =
                  1.4 + 0.006 × PV
                </p>
                <p>
                  <span className="text-primary">Éq 2:</span> UFL_production =
                  0.44 × Lait
                </p>
                <p>
                  <span className="text-primary">Éq 3:</span> CI = (Base + Prod
                  + NEC) × Coeff
                </p>
                <p>
                  <span className="text-primary">Éq 4:</span> E = f(Lait, UEL,
                  UFL)
                </p>
                <p>
                  <span className="text-primary">Éq 5:</span> Sg = f(Lait, UEL,
                  UFL)
                </p>
                <p>
                  <span className="text-primary">Éq 6:</span> CI = X×VEf +
                  Y×VEf×Sg
                </p>
                <p>
                  <span className="text-primary">Éq 7:</span> UFL_needs + E =
                  X×UFLf + Y×UFLc
                </p>
                <p>
                  <span className="text-primary">Éq 8:</span> Lait_UFL =
                  (UFL_ration - UFL_entretien) / 0.44
                </p>
                <p>
                  <span className="text-primary">Éq 9:</span> Rmic = (PDIN -
                  PDIE) / UFL
                </p>
              </div>
            </div>

            {/* Abréviations */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === "fr" ? "Abréviations" : "الاختصارات"}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-mono text-primary">UFL</span> = Unité
                  Fourragère Lait
                </div>
                <div>
                  <span className="font-mono text-primary">PDI</span> =
                  Protéines Digestibles dans l'Intestin
                </div>
                <div>
                  <span className="font-mono text-primary">UEL</span> = Unité
                  d'Encombrement Lait
                </div>
                <div>
                  <span className="font-mono text-primary">CI</span> = Capacité
                  d'Ingestion
                </div>
                <div>
                  <span className="font-mono text-primary">NEC</span> = Note
                  d'État Corporel
                </div>
                <div>
                  <span className="font-mono text-primary">CAR</span> =
                  Coefficient d'Absorption Réelle
                </div>
                <div>
                  <span className="font-mono text-primary">AMV</span> = Aliment
                  Minéral Vitaminé
                </div>
                <div>
                  <span className="font-mono text-primary">PV</span> = Poids Vif
                </div>
              </div>
            </div>

            {/* Seuils critiques */}
            <div>
              <h3 className="font-semibold mb-3">
                {language === "fr" ? "Seuils critiques" : "العتبات الحرجة"}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>NEC (vêlage)</span>
                  <span className="font-mono">2.5 - 3.0</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>% Concentré (max recommandé)</span>
                  <span className="font-mono text-warning">&lt; 50%</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>Rapport Ca/P</span>
                  <span className="font-mono">1.5 - 2.0</span>
                </div>
                <div className="flex justify-between p-2 bg-muted/20 rounded">
                  <span>RMIC (équilibre PDIN/PDIE)</span>
                  <span className="font-mono">-2 à +2</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHelpDialogOpen(false)}>
              {language === "fr" ? "Fermer" : "إغلاق"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

// Helper Components
function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function Package(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10h16" />
      <path d="M4 14h16" />
      <path d="M4 18h16" />
      <path d="M4 6h16" />
    </svg>
  );
}
