export type Language = 'fr' | 'ar';

export const translations = {
  fr: {
    // App
    appName: 'RationPro',
    appDescription: 'Système de rationnement alimentaire pour vaches laitières',
    
    // Auth
    login: 'Connexion',
    logout: 'Déconnexion',
    email: 'Email',
    password: 'Mot de passe',
    loginButton: 'Se connecter',
    loginError: 'Email ou mot de passe incorrect',
    welcomeBack: 'Bienvenue',
    
    // Navigation
    dashboard: 'Tableau de bord',
    calculator: 'Calculateur',
    feeds: 'Aliments',
    animals: 'Animaux',
    rations: 'Rations',
    statistics: 'Statistiques',
    settings: 'Paramètres',
    admin: 'Administration',
    
    // Dashboard
    totalCalculations: 'Calculs totaux',
    savedRations: 'Rations sauvegardées',
    feedsInDatabase: 'Aliments en base',
    recentActivity: 'Activité récente',
    quickActions: 'Actions rapides',
    newCalculation: 'Nouveau calcul',
    viewStatistics: 'Voir les statistiques',
    
    // Calculator
    cowCharacteristics: 'Caractéristiques de la vache',
    liveWeight: 'Poids vif (kg)',
    milkProduction: 'Production laitière potentielle (kg/j)',
    lactationWeek: 'Semaine de lactation',
    bodyConditionScore: 'Note d\'état corporel (NEC)',
    age: 'Âge (mois)',
    gestationWeek: 'Semaine de gestation',
    parity: 'Parité',
    primiparous: 'Primipare',
    multiparous: 'Multipare',
    
    // Feeds
    feedName: 'Nom de l\'aliment',
    feedCategory: 'Catégorie',
    dryMatter: 'Matière sèche (%)',
    ufl: 'UFL/kg MS',
    pdin: 'PDIN (g/kg MS)',
    pdie: 'PDIE (g/kg MS)',
    uel: 'UEL/kg MS',
    calcium: 'Calcium (g/kg MS)',
    phosphorus: 'Phosphore (g/kg MS)',
    
    // Categories
    forage: 'Fourrage',
    concentrate: 'Concentré',
    mineral: 'Minéral',
    silage: 'Ensilage',
    hay: 'Foin',
    straw: 'Paille',
    
    // Results
    results: 'Résultats',
    ingestionCapacity: 'Capacité d\'ingestion',
    energyNeeds: 'Besoins énergétiques',
    proteinNeeds: 'Besoins protéiques',
    calciumNeeds: 'Besoins en calcium',
    phosphorusNeeds: 'Besoins en phosphore',
    rationBalance: 'Équilibre de la ration',
    balanced: 'Équilibrée',
    unbalanced: 'Déséquilibrée',
    
    // Actions
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    calculate: 'Calculer',
    reset: 'Réinitialiser',
    export: 'Exporter',
    import: 'Importer',
    search: 'Rechercher',
    
    // Admin
    manageFeeds: 'Gérer les aliments',
    manageUsers: 'Gérer les utilisateurs',
    systemSettings: 'Paramètres système',
    addFeed: 'Ajouter un aliment',
    editFeed: 'Modifier l\'aliment',
    deleteFeed: 'Supprimer l\'aliment',
    confirmDelete: 'Confirmer la suppression',
    deleteConfirmMessage: 'Êtes-vous sûr de vouloir supprimer cet élément?',
    
    // Messages
    saveSuccess: 'Enregistrement réussi',
    deleteSuccess: 'Suppression réussie',
    error: 'Erreur',
    loading: 'Chargement...',
    noData: 'Aucune donnée',
    
    // Units
    kgPerDay: 'kg/jour',
    gPerDay: 'g/jour',
    percentage: '%',
    
    // Theme
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    language: 'Langue',
    french: 'Français',
    arabic: 'العربية',
    
    // Needs calculation
    maintenanceNeeds: 'Besoins d\'entretien',
    productionNeeds: 'Besoins de production',
    gestationNeeds: 'Besoins de gestation',
    totalNeeds: 'Besoins totaux',
    
    // Ration steps
    step1: 'Étape 1: Estimation CI et besoins',
    step2: 'Étape 2: Calcul MS fourrage',
    step3: 'Étape 3: Vérification densité énergétique',
    step4: 'Étape 4: Détermination E et Sg',
    step5: 'Étape 5: Calcul quantités fourrage/concentré',
    step6: 'Étape 6: Calcul apports ration de base',
    step7: 'Étape 7: Calcul concentrés',
    step8: 'Étape 8: Vérification',
    step9: 'Étape 9: Équilibre minéral',
  },
  ar: {
    // App
    appName: 'راشن برو',
    appDescription: 'نظام تغذية الأبقار الحلوب',
    
    // Auth
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    loginButton: 'دخول',
    loginError: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    welcomeBack: 'مرحباً بعودتك',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    calculator: 'الحاسبة',
    feeds: 'الأعلاف',
    animals: 'الحيوانات',
    rations: 'الحصص',
    statistics: 'الإحصائيات',
    settings: 'الإعدادات',
    admin: 'الإدارة',
    
    // Dashboard
    totalCalculations: 'إجمالي الحسابات',
    savedRations: 'الحصص المحفوظة',
    feedsInDatabase: 'الأعلاف في القاعدة',
    recentActivity: 'النشاط الأخير',
    quickActions: 'إجراءات سريعة',
    newCalculation: 'حساب جديد',
    viewStatistics: 'عرض الإحصائيات',
    
    // Calculator
    cowCharacteristics: 'خصائص البقرة',
    liveWeight: 'الوزن الحي (كجم)',
    milkProduction: 'إنتاج الحليب المحتمل (كجم/يوم)',
    lactationWeek: 'أسبوع الحلب',
    bodyConditionScore: 'درجة حالة الجسم',
    age: 'العمر (أشهر)',
    gestationWeek: 'أسبوع الحمل',
    parity: 'عدد الولادات',
    primiparous: 'بكرية',
    multiparous: 'متعددة الولادات',
    
    // Feeds
    feedName: 'اسم العلف',
    feedCategory: 'الفئة',
    dryMatter: 'المادة الجافة (%)',
    ufl: 'UFL/كجم مج',
    pdin: 'PDIN (جم/كجم مج)',
    pdie: 'PDIE (جم/كجم مج)',
    uel: 'UEL/كجم مج',
    calcium: 'الكالسيوم (جم/كجم مج)',
    phosphorus: 'الفوسفور (جم/كجم مج)',
    
    // Categories
    forage: 'علف خشن',
    concentrate: 'علف مركز',
    mineral: 'معدني',
    silage: 'سيلاج',
    hay: 'تبن',
    straw: 'قش',
    
    // Results
    results: 'النتائج',
    ingestionCapacity: 'قدرة الاستهلاك',
    proteinNeeds: 'الاحتياجات البروتينية',
    energyNeeds: 'الاحتياجات الطاقوية',
    calciumNeeds: 'الاحتياجات من الكالسيوم',
    phosphorusNeeds: 'الاحتياجات من الفوسفور',
    rationBalance: 'توازن الحصة',
    balanced: 'متوازنة',
    unbalanced: 'غير متوازنة',
    
    // Actions
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    calculate: 'حساب',
    reset: 'إعادة تعيين',
    export: 'تصدير',
    import: 'استيراد',
    search: 'بحث',
    
    // Admin
    manageFeeds: 'إدارة الأعلاف',
    manageUsers: 'إدارة المستخدمين',
    systemSettings: 'إعدادات النظام',
    addFeed: 'إضافة علف',
    editFeed: 'تعديل العلف',
    deleteFeed: 'حذف العلف',
    confirmDelete: 'تأكيد الحذف',
    deleteConfirmMessage: 'هل أنت متأكد من حذف هذا العنصر؟',
    
    // Messages
    saveSuccess: 'تم الحفظ بنجاح',
    deleteSuccess: 'تم الحذف بنجاح',
    error: 'خطأ',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات',
    
    // Units
    kgPerDay: 'كجم/يوم',
    gPerDay: 'جم/يوم',
    percentage: '%',
    
    // Theme
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    language: 'اللغة',
    french: 'Français',
    arabic: 'العربية',
    
    // Needs calculation
    maintenanceNeeds: 'احتياجات الصيانة',
    productionNeeds: 'احتياجات الإنتاج',
    gestationNeeds: 'احتياجات الحمل',
    totalNeeds: 'إجمالي الاحتياجات',
    
    // Ration steps
    step1: 'المرحلة 1: تقدير CI والاحتياجات',
    step2: 'المرحلة 2: حساب مج العلف',
    step3: 'المرحلة 3: التحقق من الكثافة الطاقوية',
    step4: 'المرحلة 4: تحديد E و Sg',
    step5: 'المرحلة 5: حساب كميات العلف/المركز',
    step6: 'المرحلة 6: حساب مدخلات الحصة الأساسية',
    step7: 'المرحلة 7: حساب المركزات',
    step8: 'المرحلة 8: التحقق',
    step9: 'المرحلة 9: التوازن المعدني',
  }
} as const;

export type TranslationKey = keyof typeof translations.fr;
