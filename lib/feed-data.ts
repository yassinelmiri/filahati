// Feed database based on FILAHATI nutritional values
export interface Feed {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  category: 'forage' | 'concentrate' | 'mineral';
  subCategory?: string;
  ms: number; // Matière sèche %
  ufl: number; // UFL/kg MS
  ufv?: number; // UFV/kg MS
  pdin: number; // g/kg MS
  pdie: number; // g/kg MS
  uel: number; // UEL/kg MS
  ca: number; // g/kg MS
  p: number; // g/kg MS
  caAbs?: number; // Ca absorbable
  pAbs?: number; // P absorbable
}

export const defaultFeeds: Feed[] = [
  // Fourrages - Ensilages
  {
    id: '1',
    name: 'Corn Silage',
    nameFr: 'Ensilage de maïs',
    nameAr: 'سيلاج الذرة',
    category: 'forage',
    subCategory: 'silage',
    ms: 35,
    ufl: 0.90,
    ufv: 0.80,
    pdin: 50,
    pdie: 68,
    uel: 1.05,
    ca: 3.5,
    p: 2.5,
    caAbs: 0.8,
    pAbs: 1.3
  },
  {
    id: '2',
    name: 'Grass Silage',
    nameFr: 'Ensilage d\'herbe',
    nameAr: 'سيلاج العشب',
    category: 'forage',
    subCategory: 'silage',
    ms: 30,
    ufl: 0.85,
    ufv: 0.75,
    pdin: 85,
    pdie: 75,
    uel: 1.10,
    ca: 6.0,
    p: 3.5,
    caAbs: 1.4,
    pAbs: 1.8
  },
  // Fourrages - Foins
  {
    id: '3',
    name: 'Alfalfa Hay',
    nameFr: 'Foin de luzerne',
    nameAr: 'تبن البرسيم',
    category: 'forage',
    subCategory: 'hay',
    ms: 85,
    ufl: 0.67,
    ufv: 0.58,
    pdin: 114,
    pdie: 94,
    uel: 1.04,
    ca: 13.0,
    p: 2.1,
    caAbs: 3.1,
    pAbs: 1.1
  },
  {
    id: '4',
    name: 'Oat Hay',
    nameFr: 'Foin d\'avoine',
    nameAr: 'تبن الشوفان',
    category: 'forage',
    subCategory: 'hay',
    ms: 88,
    ufl: 0.65,
    ufv: 0.55,
    pdin: 40,
    pdie: 59,
    uel: 1.75,
    ca: 3.0,
    p: 2.5,
    caAbs: 0.7,
    pAbs: 1.3
  },
  {
    id: '5',
    name: 'Vetch-Oat Hay',
    nameFr: 'Foin de vesce-avoine',
    nameAr: 'تبن البيقية والشوفان',
    category: 'forage',
    subCategory: 'hay',
    ms: 88,
    ufl: 0.70,
    ufv: 0.60,
    pdin: 75,
    pdie: 70,
    uel: 1.20,
    ca: 8.0,
    p: 2.8,
    caAbs: 1.9,
    pAbs: 1.4
  },
  // Fourrages - Pailles
  {
    id: '6',
    name: 'Wheat Straw',
    nameFr: 'Paille de blé',
    nameAr: 'قش القمح',
    category: 'forage',
    subCategory: 'straw',
    ms: 88,
    ufl: 0.42,
    ufv: 0.31,
    pdin: 22,
    pdie: 44,
    uel: 2.0,
    ca: 2.0,
    p: 1.0,
    caAbs: 0.5,
    pAbs: 0.5
  },
  // Fourrages verts
  {
    id: '7',
    name: 'Fresh Berseem',
    nameFr: 'Bersim vert',
    nameAr: 'برسيم أخضر',
    category: 'forage',
    subCategory: 'fresh',
    ms: 11.1,
    ufl: 0.79,
    ufv: 0.73,
    pdin: 140,
    pdie: 124,
    uel: 0.85,
    ca: 15.0,
    p: 3.5,
    caAbs: 3.6,
    pAbs: 1.8
  },
  // Concentrés énergétiques
  {
    id: '8',
    name: 'Corn Grain',
    nameFr: 'Maïs grain',
    nameAr: 'حبوب الذرة',
    category: 'concentrate',
    subCategory: 'energy',
    ms: 86,
    ufl: 1.10,
    ufv: 1.12,
    pdin: 71,
    pdie: 103,
    uel: 0,
    ca: 0.3,
    p: 2.2,
    caAbs: 0.07,
    pAbs: 1.1
  },
  {
    id: '9',
    name: 'Barley Grain',
    nameFr: 'Orge grain',
    nameAr: 'حبوب الشعير',
    category: 'concentrate',
    subCategory: 'energy',
    ms: 86,
    ufl: 1.00,
    ufv: 1.00,
    pdin: 78,
    pdie: 94,
    uel: 0,
    ca: 0.5,
    p: 3.5,
    caAbs: 0.12,
    pAbs: 1.8
  },
  {
    id: '10',
    name: 'Wheat Bran',
    nameFr: 'Son de blé',
    nameAr: 'نخالة القمح',
    category: 'concentrate',
    subCategory: 'energy',
    ms: 87,
    ufl: 0.73,
    ufv: 0.67,
    pdin: 92,
    pdie: 74,
    uel: 0,
    ca: 1.4,
    p: 12.2,
    caAbs: 0.34,
    pAbs: 6.1
  },
  {
    id: '11',
    name: 'Dry Beet Pulp',
    nameFr: 'Pulpe sèche de betterave',
    nameAr: 'لب البنجر الجاف',
    category: 'concentrate',
    subCategory: 'energy',
    ms: 90,
    ufl: 0.90,
    ufv: 0.88,
    pdin: 56,
    pdie: 94,
    uel: 0,
    ca: 13.0,
    p: 1.0,
    caAbs: 3.1,
    pAbs: 0.5
  },
  // Concentrés azotés
  {
    id: '12',
    name: 'Soybean Meal 44',
    nameFr: 'Tourteau de soja 44',
    nameAr: 'كسب فول الصويا 44',
    category: 'concentrate',
    subCategory: 'protein',
    ms: 87.2,
    ufl: 0.99,
    ufv: 0.98,
    pdin: 303,
    pdie: 210,
    uel: 0,
    ca: 3.0,
    p: 6.1,
    caAbs: 0.72,
    pAbs: 3.05
  },
  {
    id: '13',
    name: 'Soybean Meal 48',
    nameFr: 'Tourteau de soja 48',
    nameAr: 'كسب فول الصويا 48',
    category: 'concentrate',
    subCategory: 'protein',
    ms: 87.5,
    ufl: 1.05,
    ufv: 1.03,
    pdin: 343,
    pdie: 234,
    uel: 0,
    ca: 3.2,
    p: 6.5,
    caAbs: 0.77,
    pAbs: 3.25
  },
  {
    id: '14',
    name: 'Sunflower Meal',
    nameFr: 'Tourteau de tournesol',
    nameAr: 'كسب دوار الشمس',
    category: 'concentrate',
    subCategory: 'protein',
    ms: 89,
    ufl: 0.65,
    ufv: 0.56,
    pdin: 219,
    pdie: 115,
    uel: 0,
    ca: 3.5,
    p: 10.0,
    caAbs: 0.84,
    pAbs: 5.0
  },
  {
    id: '15',
    name: 'Rapeseed Meal',
    nameFr: 'Tourteau de colza',
    nameAr: 'كسب الكولزا',
    category: 'concentrate',
    subCategory: 'protein',
    ms: 88,
    ufl: 0.85,
    ufv: 0.78,
    pdin: 231,
    pdie: 149,
    uel: 0,
    ca: 7.5,
    p: 11.5,
    caAbs: 1.8,
    pAbs: 5.75
  },
  // Concentré VL
  {
    id: '16',
    name: 'Dairy Concentrate VL',
    nameFr: 'Concentré VL 1/2kg de lait',
    nameAr: 'علف مركز VL',
    category: 'concentrate',
    subCategory: 'compound',
    ms: 90,
    ufl: 0.98,
    ufv: 0.95,
    pdin: 107,
    pdie: 106,
    uel: 0,
    ca: 10.0,
    p: 6.0,
    caAbs: 2.4,
    pAbs: 3.0
  },
  // Minéraux
  {
    id: '17',
    name: 'Calcium Carbonate',
    nameFr: 'Carbonate de calcium (CaCO3)',
    nameAr: 'كربونات الكالسيوم',
    category: 'mineral',
    subCategory: 'calcium',
    ms: 100,
    ufl: 0,
    pdin: 0,
    pdie: 0,
    uel: 0,
    ca: 400,
    p: 0,
    caAbs: 160,
    pAbs: 0
  },
  {
    id: '18',
    name: 'Dicalcium Phosphate',
    nameFr: 'Phosphate bicalcique',
    nameAr: 'فوسفات ثنائي الكالسيوم',
    category: 'mineral',
    subCategory: 'phosphorus',
    ms: 100,
    ufl: 0,
    pdin: 0,
    pdie: 0,
    uel: 0,
    ca: 260,
    p: 180,
    caAbs: 104,
    pAbs: 117
  }
];

// AMV (Aliment Minéral Vitaminé) options based on Ca/P ratio
export interface AMV {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  caPercent: number;
  pPercent: number;
  ratio: number;
}

export const amvOptions: AMV[] = [
  { id: 'amv1', name: '5/25', nameFr: 'AMV 5/25', nameAr: 'AMV 5/25', caPercent: 25, pPercent: 5, ratio: 5 },
  { id: 'amv2', name: '5/20', nameFr: 'AMV 5/20', nameAr: 'AMV 5/20', caPercent: 20, pPercent: 5, ratio: 4 },
  { id: 'amv3', name: '7/21', nameFr: 'AMV 7/21', nameAr: 'AMV 7/21', caPercent: 21, pPercent: 7, ratio: 3 },
  { id: 'amv4', name: '8/16', nameFr: 'AMV 8/16', nameAr: 'AMV 8/16', caPercent: 16, pPercent: 8, ratio: 2 },
  { id: 'amv5', name: '10/20', nameFr: 'AMV 10/20', nameAr: 'AMV 10/20', caPercent: 20, pPercent: 10, ratio: 2 },
  { id: 'amv6', name: '12/22', nameFr: 'AMV 12/22', nameAr: 'AMV 12/22', caPercent: 22, pPercent: 12, ratio: 1.83 },
  { id: 'amv7', name: '8/12', nameFr: 'AMV 8/12', nameAr: 'AMV 8/12', caPercent: 12, pPercent: 8, ratio: 1.5 },
  { id: 'amv8', name: '10/10', nameFr: 'AMV 10/10', nameAr: 'AMV 10/10', caPercent: 10, pPercent: 10, ratio: 1 },
  { id: 'amv9', name: '12/12', nameFr: 'AMV 12/12', nameAr: 'AMV 12/12', caPercent: 12, pPercent: 12, ratio: 1 },
  { id: 'amv10', name: '16/16', nameFr: 'AMV 16/16', nameAr: 'AMV 16/16', caPercent: 16, pPercent: 16, ratio: 1 },
  { id: 'amv11', name: '12/8', nameFr: 'AMV 12/8', nameAr: 'AMV 12/8', caPercent: 8, pPercent: 12, ratio: 0.67 },
  { id: 'amv12', name: '20/15', nameFr: 'AMV 20/15', nameAr: 'AMV 20/15', caPercent: 15, pPercent: 20, ratio: 0.75 },
];

// Choose AMV based on Ca/P ratio of deficit
export function selectAMV(caDeficit: number, pDeficit: number): AMV | null {
  if (pDeficit <= 0) return null;
  const ratio = caDeficit / pDeficit;
  
  if (ratio > 1.7) {
    return amvOptions.find(amv => amv.ratio >= 3) || amvOptions[0];
  } else if (ratio >= 1.1 && ratio <= 1.7) {
    return amvOptions.find(amv => amv.ratio >= 1.5 && amv.ratio < 2) || amvOptions[6];
  } else if (ratio >= 0.9 && ratio < 1.1) {
    return amvOptions.find(amv => amv.ratio === 1) || amvOptions[7];
  } else {
    return amvOptions.find(amv => amv.ratio < 1) || amvOptions[10];
  }
}
