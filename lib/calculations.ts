// C:\Users\PC\Desktop\Agricole\filahati\lib\calculations.ts
// FILAHATI Calculation Engine for Dairy Cow Ration - Complete Edition

export interface Feed {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  category: 'forage' | 'concentrate' | 'mineral';
  subCategory?: string;
  ms: number; // Dry matter %
  ufl: number; // UFL/kg DM
  ufv?: number;
  pdin: number; // g/kg DM
  pdie: number; // g/kg DM
  uel: number; // UEL/kg DM
  ca: number; // g/kg DM
  p: number; // g/kg DM
  mg: number; // Magnesium g/kg DM
  na: number; // Sodium g/kg DM
  k: number; // Potassium g/kg DM
  cl: number; // Chlorine g/kg DM
  s: number; // Sulfur g/kg DM
}

export interface CowCharacteristics {
  liveWeight: number; // kg
  milkProductionPotential: number; // kg/day
  lactationWeek: number;
  bodyConditionScore: number; // 1-5
  ageMonths: number;
  gestationWeek: number;
  isMultiparous: boolean;
  temperature?: number; // ambient temperature °C
  humidity?: number; // relative humidity %
  walkingDistance?: number; // km/day
}

export interface NutrientNeeds {
  // Energy
  uflMaintenance: number;
  uflProduction: number;
  uflGestation: number;
  uflGrowth: number;
  uflThermoregulation: number;
  uflExercise: number;
  uflTotal: number;
  
  // Protein
  pdiMaintenance: number;
  pdiProduction: number;
  pdiGestation: number;
  pdiGrowth: number;
  pdiTotal: number;
  
  // Minerals (absorbable)
  caAbs: number;
  pAbs: number;
  mgAbs: number;
  naAbs: number;
  kAbs: number;
  
  // Corrected needs with coefficients
  caNeedsWithCoeff: number;
  pNeedsWithCoeff: number;
  caPCoeff: number;
}

export interface IngestionCapacity {
  ci: number; // UEL
  baseCI: number;
  productionEffect: number;
  necEffect: number;
  lactationEffect: number;
  parityEffect: number;
  gestationEffect: number;
  maturityEffect: number;
  temperatureEffect: number;
}

export interface RationResult {
  forageDM: number; // kg DM forage
  concentrateDM: number; // kg DM concentrate
  totalDM: number;
  uflSupply: number;
  pdinSupply: number;
  pdieSupply: number;
  caSupply: number;
  pSupply: number;
  mgSupply: number;
  naSupply: number;
  kSupply: number;
  uflBalance: number;
  pdiBalance: number;
  caBalance: number;
  pBalance: number;
  mgBalance: number;
  naBalance: number;
  kBalance: number;
  milkPermittedByUFL: number;
  milkPermittedByPDIN: number;
  milkPermittedByPDIE: number;
  rmic: number;
  concentratePercentage: number;
  isBalanced: boolean;
  E: number; // Energy correction
  Sg: number; // Substitution rate
  energyDensityMin: number;
  energyDensityForage: number;
  needsConcentrate: boolean;
  forageUEL: number;
  forageUFL: number;
}

// AMV (Aliment Minéral Vitaminé) interface
export interface AMV {
  id: string;
  name: string;
  nameFr: string;
  nameAr: string;
  caPercent: number;
  pPercent: number;
  mgPercent: number;
  naPercent: number;
  ratio: number;
}

export interface MineralSupplement {
  amv: AMV | null;
  amvQuantity: number; // grams per animal
  caco3Quantity: number; // grams per animal
  sodiumBicarbonateQuantity: number; // grams per animal
  magnesiumOxideQuantity: number; // grams per animal
  propyleneGlycolQuantity: number; // ml per animal (Propaline)
  caDeficit: number;
  pDeficit: number;
  mgDeficit: number;
  naDeficit: number;
  dcalciumRatio: number;
}

export interface CorrectedNeeds {
  uflCorrection: number;
  pdiCorrection: number;
  caCorrection: number;
  pCorrection: number;
  description: string;
  descriptionAr: string;
}

// ============================================================================
// PART 1: COEFFICIENTS AND CORRECTIONS - Based on FILAHATI Tables
// ============================================================================

// Table 2.1: Correction factors for different conditions
export const correctionFactors = {
  // Temperature correction (Table 2.8)
  thermoregulation: {
    below5: { ufl: 0.15, pdi: 0, description: "Froid extrême - Augmentation des besoins énergétiques" },
    between5and10: { ufl: 0.10, pdi: 0, description: "Froid modéré - Augmentation des besoins énergétiques" },
    between10and20: { ufl: 0, pdi: 0, description: "Température confortable" },
    between20and25: { ufl: 0.05, pdi: 0.03, description: "Stress thermique léger" },
    between25and30: { ufl: 0.10, pdi: 0.05, description: "Stress thermique modéré" },
    above30: { ufl: 0.20, pdi: 0.10, description: "Stress thermique sévère" }
  },
  
  // Exercise correction
  exercise: {
    perKm: { ufl: 0.02, pdi: 0.01, description: "Par km de marche/jour" }
  },
  
  // Growth correction for young animals
  growth: {
    under24months: { ufl: 0.30, pdi: 35, description: "Croissance (primipare)" }
  },
  
  // Body condition score correction (NEC)
  necCorrection: {
    2: { value: 1.5, description: "État maigre - Besoin de reconstitution" },
    2.5: { value: 0.75, description: "État assez maigre" },
    3: { value: 0, description: "État idéal" },
    3.5: { value: -0.75, description: "État assez gras" },
    4: { value: -1.5, description: "État gras - Mobilisation possible" }
  },
  
  // Ca and P absorption coefficients (CAR)
  absorptionCoefficients: {
    calcium: {
      forage: 0.40,
      concentrate: 0.55,
      mineral: 0.60
    },
    phosphorus: {
      forage: 0.65,
      concentrate: 0.70,
      mineral: 0.80
    }
  },
  
  // Milk production correction for Ca and P
  milkCOR: {
    calcium: 1.25, // g Ca par kg de lait
    phosphorus: 0.90 // g P par kg de lait
  }
};

// ============================================================================
// PART 2: AMV OPTIONS - Complete list according to FILAHATI
// ============================================================================

export const amvOptions: AMV[] = [
  { id: 'amv1', name: '4/16', nameFr: 'AMV 4/16', nameAr: 'AMV 4/16', caPercent: 16, pPercent: 4, mgPercent: 3, naPercent: 5, ratio: 4 },
  { id: 'amv2', name: '5/20', nameFr: 'AMV 5/20', nameAr: 'AMV 5/20', caPercent: 20, pPercent: 5, mgPercent: 3, naPercent: 5, ratio: 4 },
  { id: 'amv3', name: '5/25', nameFr: 'AMV 5/25', nameAr: 'AMV 5/25', caPercent: 25, pPercent: 5, mgPercent: 3, naPercent: 5, ratio: 5 },
  { id: 'amv4', name: '7/21', nameFr: 'AMV 7/21', nameAr: 'AMV 7/21', caPercent: 21, pPercent: 7, mgPercent: 4, naPercent: 6, ratio: 3 },
  { id: 'amv5', name: '8/16', nameFr: 'AMV 8/16', nameAr: 'AMV 8/16', caPercent: 16, pPercent: 8, mgPercent: 4, naPercent: 6, ratio: 2 },
  { id: 'amv6', name: '10/20', nameFr: 'AMV 10/20', nameAr: 'AMV 10/20', caPercent: 20, pPercent: 10, mgPercent: 3, naPercent: 5, ratio: 2 },
  { id: 'amv7', name: '12/22', nameFr: 'AMV 12/22', nameAr: 'AMV 12/22', caPercent: 22, pPercent: 12, mgPercent: 4, naPercent: 6, ratio: 1.83 },
  { id: 'amv8', name: '8/12', nameFr: 'AMV 8/12', nameAr: 'AMV 8/12', caPercent: 12, pPercent: 8, mgPercent: 5, naPercent: 7, ratio: 1.5 },
  { id: 'amv9', name: '10/10', nameFr: 'AMV 10/10', nameAr: 'AMV 10/10', caPercent: 10, pPercent: 10, mgPercent: 5, naPercent: 7, ratio: 1 },
  { id: 'amv10', name: '12/12', nameFr: 'AMV 12/12', nameAr: 'AMV 12/12', caPercent: 12, pPercent: 12, mgPercent: 4, naPercent: 6, ratio: 1 },
  { id: 'amv11', name: '14/14', nameFr: 'AMV 14/14', nameAr: 'AMV 14/14', caPercent: 14, pPercent: 14, mgPercent: 4, naPercent: 6, ratio: 1 },
  { id: 'amv12', name: '16/16', nameFr: 'AMV 16/16', nameAr: 'AMV 16/16', caPercent: 16, pPercent: 16, mgPercent: 3, naPercent: 5, ratio: 1 },
  { id: 'amv13', name: '12/8', nameFr: 'AMV 12/8', nameAr: 'AMV 12/8', caPercent: 8, pPercent: 12, mgPercent: 5, naPercent: 7, ratio: 0.67 },
  { id: 'amv14', name: '15/20', nameFr: 'AMV 15/20', nameAr: 'AMV 15/20', caPercent: 20, pPercent: 15, mgPercent: 4, naPercent: 6, ratio: 0.75 },
  { id: 'amv15', name: '20/15', nameFr: 'AMV 20/15', nameAr: 'AMV 20/15', caPercent: 15, pPercent: 20, mgPercent: 3, naPercent: 5, ratio: 0.75 },
  { id: 'amv16', name: '18/12', nameFr: 'AMV 18/12', nameAr: 'AMV 18/12', caPercent: 12, pPercent: 18, mgPercent: 4, naPercent: 6, ratio: 0.67 }
];

// ============================================================================
// PART 3: MAINTENANCE NEEDS CALCULATION
// ============================================================================

// Calculate maintenance needs - Equation 1
export function calculateMaintenanceNeeds(liveWeight: number, isMultiparous: boolean = true): { 
  ufl: number; 
  pdi: number; 
  ca: number; 
  p: number;
  mg: number;
  na: number;
  k: number;
} {
  // Energy: UFL = 1.4 + 0.006 * LW (Equation FILAHATI)
  const ufl = 1.4 + 0.006 * liveWeight;
  
  // Protein: PDI = 95 + 0.5 * LW (Equation FILAHATI)
  const pdi = 95 + 0.5 * liveWeight;
  
  // Calcium: 6g per 100kg LW (FILAHATI Table 2.4)
  // Converted to absorbable: CAR Ca = 0.40 for forage-based diet
  const ca = 6 * (liveWeight / 100);
  
  // Phosphorus: 5g per 100kg LW (FILAHATI Table 2.4)
  // Converted to absorbable: CAR P = 0.65 for forage-based diet
  const p = 5 * (liveWeight / 100);
  
  // Magnesium: 1.5g per 100kg LW
  const mg = 1.5 * (liveWeight / 100);
  
  // Sodium: 1g per 100kg LW
  const na = 1 * (liveWeight / 100);
  
  // Potassium: 12g per 100kg LW
  const k = 12 * (liveWeight / 100);
  
  return { ufl, pdi, ca, p, mg, na, k };
}

// ============================================================================
// PART 4: PRODUCTION NEEDS CALCULATION
// ============================================================================

// Calculate production needs - Equation 2
export function calculateProductionNeeds(milkProduction: number): { 
  ufl: number; 
  pdi: number; 
  ca: number; 
  p: number;
  mg: number;
  na: number;
} {
  // Energy: 0.44 UFL per kg of milk (standard 40g fat, 32g protein)
  const ufl = 0.44 * milkProduction;
  
  // Protein: 48g PDI per kg of milk
  const pdi = 48 * milkProduction;
  
  // Calcium: 1.25g absorbable Ca per kg of milk (COR)
  const ca = 1.25 * milkProduction;
  
  // Phosphorus: 0.90g absorbable P per kg of milk (COR)
  const p = 0.90 * milkProduction;
  
  // Magnesium: 0.15g per kg of milk
  const mg = 0.15 * milkProduction;
  
  // Sodium: 0.35g per kg of milk
  const na = 0.35 * milkProduction;
  
  return { ufl, pdi, ca, p, mg, na };
}

// ============================================================================
// PART 5: GESTATION NEEDS CALCULATION
// ============================================================================

// Calculate gestation needs - Table 2.5 FILAHATI
export function calculateGestationNeeds(gestationMonth: number): { 
  ufl: number; 
  pdi: number; 
  ca: number; 
  p: number;
  mg: number;
  na: number;
} {
  const gestationNeeds: Record<number, { ufl: number; pdi: number; ca: number; p: number; mg: number; na: number }> = {
    6: { ufl: 0.4, pdi: 36, ca: 1.9, p: 1.5, mg: 0.3, na: 0.2 },
    7: { ufl: 0.8, pdi: 68, ca: 3.8, p: 2.8, mg: 0.5, na: 0.3 },
    8: { ufl: 1.4, pdi: 116, ca: 6.7, p: 4.2, mg: 0.8, na: 0.5 },
    9: { ufl: 2.3, pdi: 179, ca: 9.7, p: 5.3, mg: 1.1, na: 0.7 }
  };
  
  if (gestationMonth < 6) return { ufl: 0, pdi: 0, ca: 0, p: 0, mg: 0, na: 0 };
  return gestationNeeds[Math.min(gestationMonth, 9)] || { ufl: 0, pdi: 0, ca: 0, p: 0, mg: 0, na: 0 };
}

// ============================================================================
// PART 6: GROWTH NEEDS FOR PRIMIPAROUS
// ============================================================================

// Calculate growth needs for young animals - Table 2.6
export function calculateGrowthNeeds(ageMonths: number, liveWeight: number, isMultiparous: boolean): {
  ufl: number;
  pdi: number;
  ca: number;
  p: number;
} {
  if (isMultiparous) return { ufl: 0, pdi: 0, ca: 0, p: 0 };
  
  // Growth needs for primiparous (FILAHATI Table 2.6)
  let ufl = 0;
  let pdi = 0;
  let ca = 0;
  let p = 0;
  
  if (ageMonths < 24) {
    ufl = 0.4;
    pdi = 45;
    ca = 3.5;
    p = 2.2;
  } else if (ageMonths >= 24 && ageMonths < 30) {
    ufl = 0.3;
    pdi = 35;
    ca = 2.8;
    p = 1.7;
  } else if (ageMonths >= 30 && ageMonths < 36) {
    ufl = 0.2;
    pdi = 25;
    ca = 2.0;
    p = 1.2;
  }
  
  return { ufl, pdi, ca, p };
}

// ============================================================================
// PART 7: THERMOREGULATION AND EXERCISE CORRECTIONS
// ============================================================================

// Calculate thermoregulation needs - Table 2.8
export function calculateThermoregulationNeeds(temperature: number = 20): { ufl: number; pdi: number } {
  if (temperature < 5) {
    return { ufl: 0.15, pdi: 0 };
  } else if (temperature >= 5 && temperature < 10) {
    return { ufl: 0.10, pdi: 0 };
  } else if (temperature >= 20 && temperature < 25) {
    return { ufl: 0.05, pdi: 0.03 };
  } else if (temperature >= 25 && temperature < 30) {
    return { ufl: 0.10, pdi: 0.05 };
  } else if (temperature >= 30) {
    return { ufl: 0.20, pdi: 0.10 };
  }
  return { ufl: 0, pdi: 0 };
}

// Calculate exercise needs
export function calculateExerciseNeeds(walkingDistance: number = 0): { ufl: number; pdi: number } {
  return {
    ufl: 0.02 * walkingDistance,
    pdi: 0.01 * walkingDistance
  };
}

// ============================================================================
// PART 8: TOTAL NUTRIENT NEEDS CALCULATION
// ============================================================================

// Calculate total nutrient needs - Complete equation
export function calculateNutrientNeeds(cow: CowCharacteristics): NutrientNeeds {
  const maintenance = calculateMaintenanceNeeds(cow.liveWeight, cow.isMultiparous);
  const production = calculateProductionNeeds(cow.milkProductionPotential);
  const gestationMonth = Math.floor(cow.gestationWeek / 4);
  const gestation = calculateGestationNeeds(gestationMonth);
  const growth = calculateGrowthNeeds(cow.ageMonths, cow.liveWeight, cow.isMultiparous);
  const thermo = calculateThermoregulationNeeds(cow.temperature || 20);
  const exercise = calculateExerciseNeeds(cow.walkingDistance || 0);
  
  // Total UFL
  const uflTotal = maintenance.ufl + production.ufl + gestation.ufl + growth.ufl + thermo.ufl + exercise.ufl;
  
  // Total PDI
  const pdiTotal = maintenance.pdi + production.pdi + gestation.pdi + growth.pdi + thermo.pdi + exercise.pdi;
  
  // Absorbable Ca and P needs
  const caAbs = maintenance.ca + production.ca + gestation.ca + growth.ca;
  const pAbs = maintenance.p + production.p + gestation.p + growth.p;
  
  // Mg and Na needs
  const mgAbs = maintenance.mg + production.mg + gestation.mg;
  const naAbs = maintenance.na + production.na + gestation.na;
  const kAbs = maintenance.k;
  
  // Calculate Ca/P ratio of needs
  const caPCoeff = caAbs > 0 && pAbs > 0 ? caAbs / pAbs : 2;
  
  // Corrected needs with safety margins (prevention of milk fever and other metabolic diseases)
  let caNeedsWithCoeff = caAbs;
  let pNeedsWithCoeff = pAbs;
  
  // Special correction for transition period (3 weeks before calving)
  if (cow.gestationWeek >= 36 && cow.milkProductionPotential === 0) {
    // Dry period - prevent milk fever
    caNeedsWithCoeff = caAbs * 0.7; // Reduce Ca for dry cows
    pNeedsWithCoeff = pAbs * 1.1;   // Maintain P
  } else if (cow.lactationWeek <= 2) {
    // Early lactation - high requirement
    caNeedsWithCoeff = caAbs * 1.2;
    pNeedsWithCoeff = pAbs * 1.15;
  }
  
  return {
    uflMaintenance: maintenance.ufl,
    uflProduction: production.ufl,
    uflGestation: gestation.ufl,
    uflGrowth: growth.ufl,
    uflThermoregulation: thermo.ufl,
    uflExercise: exercise.ufl,
    uflTotal,
    
    pdiMaintenance: maintenance.pdi,
    pdiProduction: production.pdi,
    pdiGestation: gestation.pdi,
    pdiGrowth: growth.pdi,
    pdiTotal,
    
    caAbs,
    pAbs,
    mgAbs,
    naAbs,
    kAbs,
    
    caNeedsWithCoeff,
    pNeedsWithCoeff,
    caPCoeff
  };
}

// ============================================================================
// PART 9: INGESTION CAPACITY CALCULATION - FILAHATI Table 2.3
// ============================================================================

// Calculate ingestion capacity (CI) based on FILAHATI Table 2.3 - Equation 3
export function calculateIngestionCapacity(cow: CowCharacteristics): IngestionCapacity {
  // Base CI based on live weight (from table 2.3)
  const weightFactors: Record<number, number> = {
    400: 11.20,
    450: 11.80,
    500: 12.40,
    550: 13.05,
    600: 13.70,
    650: 14.65,
    700: 15.40,
    750: 16.15,
    800: 16.90
  };
  
  // Get closest weight factor with interpolation
  const weights = Object.keys(weightFactors).map(Number);
  let baseCI = 12.40; // default for 500kg
  
  if (cow.liveWeight <= weights[0]) {
    baseCI = weightFactors[weights[0]];
  } else if (cow.liveWeight >= weights[weights.length - 1]) {
    baseCI = weightFactors[weights[weights.length - 1]];
  } else {
    for (let i = 0; i < weights.length - 1; i++) {
      if (cow.liveWeight >= weights[i] && cow.liveWeight <= weights[i + 1]) {
        const ratio = (cow.liveWeight - weights[i]) / (weights[i + 1] - weights[i]);
        baseCI = weightFactors[weights[i]] + ratio * (weightFactors[weights[i + 1]] - weightFactors[weights[i]]);
        break;
      }
    }
  }
  
  // NEC effect based on body condition score
  const necFactors: Record<number, number> = {
    2: 1.5,
    2.5: 0.75,
    3: 0,
    3.5: -0.75,
    4: -1.5,
    4.5: -2.25,
    5: -3
  };
  const necEffect = necFactors[cow.bodyConditionScore] ?? 0;
  
  // Production effect (0.15 UEL per kg of milk potential)
  const productionEffect = 0.15 * cow.milkProductionPotential;
  
  // Lactation week effect (Table 2.3)
  let lactationEffect = 1;
  if (cow.lactationWeek <= 2) lactationEffect = 0.80;
  else if (cow.lactationWeek <= 4) lactationEffect = 0.88;
  else if (cow.lactationWeek <= 8) lactationEffect = 0.92;
  else if (cow.lactationWeek <= 16) lactationEffect = 0.98;
  else if (cow.lactationWeek <= 24) lactationEffect = 1.00;
  else if (cow.lactationWeek <= 32) lactationEffect = 0.98;
  else lactationEffect = 0.95;
  
  // Parity effect
  const parityEffect = cow.isMultiparous ? 1 : 0.85;
  
  // Gestation effect (Table 2.3)
  let gestationEffect = 1;
  if (cow.gestationWeek >= 30) {
    gestationEffect = 1 - 0.02 * Math.floor((cow.gestationWeek - 30) / 2);
  }
  gestationEffect = Math.max(0.85, gestationEffect);
  
  // Maturity effect based on age
  let maturityEffect = 1;
  if (cow.ageMonths < 24) maturityEffect = 0.85;
  else if (cow.ageMonths < 30) maturityEffect = 0.90;
  else if (cow.ageMonths < 36) maturityEffect = 0.94;
  else if (cow.ageMonths < 42) maturityEffect = 0.97;
  else if (cow.ageMonths < 48) maturityEffect = 0.99;
  else maturityEffect = 1.0;
  
  // Temperature effect on ingestion
  let temperatureEffect = 1;
  if (cow.temperature) {
    if (cow.temperature > 25) temperatureEffect = 0.95;
    if (cow.temperature > 30) temperatureEffect = 0.90;
    if (cow.temperature < 5) temperatureEffect = 0.98;
  }
  
  // Final CI calculation - Equation 4
  const ci = (baseCI + productionEffect + necEffect) 
    * lactationEffect 
    * parityEffect 
    * gestationEffect 
    * maturityEffect 
    * temperatureEffect;
  
  return {
    ci,
    baseCI,
    productionEffect,
    necEffect,
    lactationEffect,
    parityEffect,
    gestationEffect,
    maturityEffect,
    temperatureEffect
  };
}

// ============================================================================
// PART 10: ENERGY CORRECTION E - FILAHATI Table 2.6
// ============================================================================

// Calculate energy correction E (Table 2.6) - Equation 5
export function calculateEnergyCorrection(
  milkPotential: number,
  forageUEL: number,
  forageUFL: number,
  isMultiparous: boolean
): number {
  // Base values from FILAHATI Table 2.6
  // For 25kg milk, UEL 0.95, UFL 0.90 => E = 0.25
  
  let E = 0.25; // base
  
  // Milk production effect
  if (milkPotential > 25) {
    E += (milkPotential - 25) * 0.03;
  } else if (milkPotential < 25) {
    E += (milkPotential - 25) * 0.02;
  }
  
  // Forage UEL effect (higher UEL = higher E)
  if (forageUEL > 0.95) {
    E += (forageUEL - 0.95) * 0.2;
  } else if (forageUEL < 0.95) {
    E += (forageUEL - 0.95) * 0.1;
  }
  
  // Forage UFL effect
  if (forageUFL > 0.90) {
    E -= (forageUFL - 0.90) * 0.15;
  } else if (forageUFL < 0.90) {
    E += (0.90 - forageUFL) * 0.1;
  }
  
  // Parity adjustment
  if (!isMultiparous) E *= 0.85;
  
  // Clamp values
  return Math.max(0, Math.min(1, E));
}

// ============================================================================
// PART 11: SUBSTITUTION RATE Sg - FILAHATI Table 2.7
// ============================================================================

// Calculate substitution rate Sg (Table 2.7) - Equation 6
export function calculateSubstitutionRate(
  milkPotential: number,
  forageUEL: number,
  forageUFL: number,
  isMultiparous: boolean
): number {
  // Base from FILAHATI Table 2.7
  // For 30kg milk, UEL 0.95, UFL 0.85 => Sg = 0.44
  
  let Sg = 0.44; // base
  
  // Milk production effect
  if (milkPotential > 30) {
    Sg += (milkPotential - 30) * 0.008;
  } else if (milkPotential < 30) {
    Sg += (milkPotential - 30) * 0.006;
  }
  
  // Forage UEL effect
  if (forageUEL > 0.95) {
    Sg -= (forageUEL - 0.95) * 0.1;
  } else if (forageUEL < 0.95) {
    Sg += (0.95 - forageUEL) * 0.15;
  }
  
  // Forage UFL effect
  if (forageUFL > 0.85) {
    Sg += (forageUFL - 0.85) * 0.15;
  } else if (forageUFL < 0.85) {
    Sg -= (0.85 - forageUFL) * 0.1;
  }
  
  // Parity adjustment
  if (!isMultiparous) Sg *= 0.9;
  
  // Clamp values
  return Math.max(0.2, Math.min(0.8, Sg));
}

// ============================================================================
// PART 12: RATION BALANCE CALCULATION - MAIN EQUATION SYSTEM
// ============================================================================

// Main ration balance calculation - Equations 7, 8, 9
export function calculateRation(
  cow: CowCharacteristics,
  forage: Feed,
  concentrate: Feed,
  forageQuantity?: number
): RationResult {
  const needs = calculateNutrientNeeds(cow);
  const ciData = calculateIngestionCapacity(cow);
  const ci = ciData.ci;
  
  // Calculate energy densities
  const energyDensityMin = needs.uflTotal / ci;
  const energyDensityForage = forage.ufl / forage.uel;
  const needsConcentrate = energyDensityForage < energyDensityMin;
  
  let forageDM: number;
  let concentrateDM: number;
  let E: number;
  let Sg: number;
  
  if (!needsConcentrate) {
    // Case 1: Forage alone sufficient
    forageDM = needs.uflTotal / forage.ufl;
    concentrateDM = 0;
    E = 0;
    Sg = 0;
  } else {
    // Case 2: Need concentrate addition
    // Calculate E and Sg using FILAHATI Tables
    E = calculateEnergyCorrection(
      cow.milkProductionPotential, 
      forage.uel, 
      forage.ufl, 
      cow.isMultiparous
    );
    Sg = calculateSubstitutionRate(
      cow.milkProductionPotential, 
      forage.uel, 
      forage.ufl, 
      cow.isMultiparous
    );
    
    // Solve system of equations:
    // Equation 7: CI = X * VEf + Y * VEf * Sg
    // Equation 8: UFL_needs + E = X * UFLf + Y * UFLc
    // Equation 9: Y = (UFL_needs + E - CI * (UFLf/VEf)) / (UFLc - Sg * UFLf)
    
    const VEf = forage.uel;
    const UFLf = forage.ufl;
    const UFLc = concentrate.ufl;
    const needsWithE = needs.uflTotal + E;
    
    const denominator = UFLc - Sg * UFLf;
    
    if (Math.abs(denominator) > 0.001) {
      concentrateDM = (needsWithE - ci * UFLf / VEf) / denominator;
      concentrateDM = Math.max(0, concentrateDM);
      forageDM = (ci - concentrateDM * VEf * Sg) / VEf;
      forageDM = Math.max(0, forageDM);
    } else {
      // Fallback solution
      forageDM = ci / VEf * 0.7;
      concentrateDM = ci / VEf * 0.3 / Sg;
    }
  }
  
  // Override if fixed quantity provided
  if (forageQuantity !== undefined && forageQuantity > 0) {
    forageDM = forageQuantity;
    // Recalculate concentrate based on fixed forage
    const remainingCI = ci - forageDM * forage.uel;
    if (remainingCI > 0 && concentrate.uel > 0) {
      concentrateDM = remainingCI / (concentrate.uel * Sg);
    } else {
      concentrateDM = 0;
    }
  }
  
  const totalDM = forageDM + concentrateDM;
  
  // Calculate supplies
  const uflSupply = forageDM * forage.ufl + concentrateDM * concentrate.ufl - E;
  const pdinSupply = forageDM * forage.pdin + concentrateDM * concentrate.pdin;
  const pdieSupply = forageDM * forage.pdie + concentrateDM * concentrate.pdie;
  const caSupply = forageDM * forage.ca + concentrateDM * concentrate.ca;
  const pSupply = forageDM * forage.p + concentrateDM * concentrate.p;
  const mgSupply = forageDM * (forage.mg || 1.5) + concentrateDM * (concentrate.mg || 2);
  const naSupply = forageDM * (forage.na || 0.5) + concentrateDM * (concentrate.na || 1);
  const kSupply = forageDM * (forage.k || 12) + concentrateDM * (concentrate.k || 8);
  
  // Convert to absorbable using CAR (Coefficient d'Absorption Réelle)
  const carCaForage = 0.40; // CAR for forage Ca
  const carPForage = 0.65; // CAR for forage P
  const carCaConc = 0.55; // CAR for concentrate Ca
  const carPConc = 0.70; // CAR for concentrate P
  
  const caAbsSupply = forageDM * forage.ca * carCaForage + concentrateDM * concentrate.ca * carCaConc;
  const pAbsSupply = forageDM * forage.p * carPForage + concentrateDM * concentrate.p * carPConc;
  
  // Calculate balances
  const uflBalance = uflSupply - needs.uflTotal;
  const pdiBalance = Math.min(pdinSupply, pdieSupply) - needs.pdiTotal;
  const caBalance = caAbsSupply - needs.caAbs;
  const pBalance = pAbsSupply - needs.pAbs;
  const mgBalance = mgSupply - needs.mgAbs;
  const naBalance = naSupply - needs.naAbs;
  const kBalance = kSupply - needs.kAbs;
  
  // Milk permitted by each nutrient - Equation 10
  const maintenanceUFL = needs.uflMaintenance;
  const maintenancePDI = needs.pdiMaintenance;
  
  const milkPermittedByUFL = (uflSupply - maintenanceUFL) / 0.44;
  const milkPermittedByPDIN = (pdinSupply - maintenancePDI) / 48;
  const milkPermittedByPDIE = (pdieSupply - maintenancePDI) / 48;
  
  // Rmic calculation - Equation 11
  const rmic = uflSupply > 0 ? (pdinSupply - pdieSupply) / uflSupply : 0;
  
  // Concentrate percentage
  const concentratePercentage = totalDM > 0 ? (concentrateDM / totalDM) * 100 : 0;
  
  // Check if balanced (within 5% tolerance)
  const isBalanced = 
    Math.abs(uflBalance) < needs.uflTotal * 0.05 &&
    pdiBalance >= -needs.pdiTotal * 0.05 &&
    caBalance >= -needs.caAbs * 0.1 &&
    pBalance >= -needs.pAbs * 0.1;
  
  return {
    forageDM,
    concentrateDM,
    totalDM,
    uflSupply,
    pdinSupply,
    pdieSupply,
    caSupply,
    pSupply,
    mgSupply,
    naSupply,
    kSupply,
    uflBalance,
    pdiBalance,
    caBalance,
    pBalance,
    mgBalance,
    naBalance,
    kBalance,
    milkPermittedByUFL,
    milkPermittedByPDIN,
    milkPermittedByPDIE,
    rmic,
    concentratePercentage,
    isBalanced,
    E,
    Sg,
    energyDensityMin,
    energyDensityForage,
    needsConcentrate,
    forageUEL: forage.uel,
    forageUFL: forage.ufl
  };
}

// ============================================================================
// PART 13: AMV AND MINERAL SUPPLEMENT CALCULATION
// ============================================================================

// Select AMV based on Ca/P deficit ratio
export function selectAMV(caDeficit: number, pDeficit: number): AMV | null {
  if (pDeficit <= 0 && caDeficit <= 0) return null;
  if (pDeficit <= 0) return amvOptions.find(amv => amv.pPercent === 0) || null;
  
  const ratio = caDeficit / pDeficit;
  
  // Select AMV based on Ca/P ratio (FILAHATI recommendation)
  if (ratio > 3) {
    return amvOptions.find(amv => amv.ratio >= 3 && amv.ratio < 4) || amvOptions[2];
  } else if (ratio >= 2 && ratio <= 3) {
    return amvOptions.find(amv => amv.ratio >= 2 && amv.ratio < 3) || amvOptions[4];
  } else if (ratio >= 1.5 && ratio < 2) {
    return amvOptions.find(amv => amv.ratio >= 1.5 && amv.ratio < 2) || amvOptions[7];
  } else if (ratio >= 1 && ratio < 1.5) {
    return amvOptions.find(amv => amv.ratio === 1) || amvOptions[9];
  } else if (ratio >= 0.75 && ratio < 1) {
    return amvOptions.find(amv => amv.ratio < 1 && amv.ratio >= 0.75) || amvOptions[12];
  } else {
    return amvOptions.find(amv => amv.ratio < 0.75) || amvOptions[13];
  }
}

// Calculate mineral supplement needs including bicarbonate, calcium, sodium, propoline, AMG
export function calculateMineralSupplement(
  caSupply: number,
  pSupply: number,
  mgSupply: number,
  naSupply: number,
  caNeeds: number,
  pNeeds: number,
  mgNeeds: number,
  naNeeds: number,
  lactationWeek: number,
  milkProduction: number,
  isHighProducing: boolean = false
): MineralSupplement {
  // CAR coefficients
  const carCa = 0.40;
  const carP = 0.65;
  const carMg = 0.30;
  const carNa = 0.90;
  
  // Convert to absorbable
  const caAbsSupply = caSupply * carCa;
  const pAbsSupply = pSupply * carP;
  const mgAbsSupply = mgSupply * carMg;
  const naAbsSupply = naSupply * carNa;
  
  // Calculate deficits
  let caDeficit = Math.max(0, caNeeds - caAbsSupply);
  let pDeficit = Math.max(0, pNeeds - pAbsSupply);
  let mgDeficit = Math.max(0, mgNeeds - mgAbsSupply);
  let naDeficit = Math.max(0, naNeeds - naAbsSupply);
  
  // Special corrections for early lactation
  if (lactationWeek <= 4) {
    // High requirement for Ca and Mg during early lactation
    caDeficit = Math.max(0, caNeeds * 1.2 - caAbsSupply);
    mgDeficit = Math.max(0, mgNeeds * 1.3 - mgAbsSupply);
  }
  
  // Convert absorbable deficit to gross quantity needed
  const caGrossDeficit = caDeficit / carCa;
  const pGrossDeficit = pDeficit / carP;
  const mgGrossDeficit = mgDeficit / carMg;
  const naGrossDeficit = naDeficit / carNa;
  
  const ratio = pGrossDeficit > 0 ? caGrossDeficit / pGrossDeficit : 999;
  
  // Select AMV based on Ca/P ratio
  const amv = selectAMV(caGrossDeficit, pGrossDeficit);
  
  let amvQuantity = 0;
  let caco3Quantity = 0;
  let sodiumBicarbonateQuantity = 0;
  let magnesiumOxideQuantity = 0;
  let propyleneGlycolQuantity = 0; // Propaline
  
  // Calculate AMV quantity to cover P deficit first
  if (amv && pGrossDeficit > 0) {
    amvQuantity = (pGrossDeficit * 100) / amv.pPercent;
    
    // Ca provided by AMV
    const caFromAMV = (amvQuantity * amv.caPercent) / 100;
    
    // Additional CaCO3 if Ca deficit not covered
    const remainingCaDeficit = caGrossDeficit - caFromAMV;
    if (remainingCaDeficit > 0) {
      // CaCO3 contains 40% Ca
      caco3Quantity = (remainingCaDeficit * 100) / 40;
    }
    
    // Mg from AMV
    const mgFromAMV = (amvQuantity * (amv.mgPercent || 3)) / 100;
    const remainingMgDeficit = mgGrossDeficit - mgFromAMV;
    if (remainingMgDeficit > 0) {
      // MgO contains 60% Mg
      magnesiumOxideQuantity = (remainingMgDeficit * 100) / 60;
    }
    
    // Na from AMV
    const naFromAMV = (amvQuantity * (amv.naPercent || 5)) / 100;
    const remainingNaDeficit = naGrossDeficit - naFromAMV;
    if (remainingNaDeficit > 0) {
      // Sodium bicarbonate contains 27% Na
      sodiumBicarbonateQuantity = (remainingNaDeficit * 100) / 27;
    }
  } else if (caGrossDeficit > 0) {
    // Only Ca deficit, use CaCO3
    caco3Quantity = (caGrossDeficit * 100) / 40;
  }
  
  // Special case: High producing cows need Propylene Glycol (Propaline) to prevent ketosis
  if (isHighProducing && milkProduction > 40) {
    propyleneGlycolQuantity = 300; // 300ml per day for high producers
  } else if (milkProduction > 35) {
    propyleneGlycolQuantity = 200;
  } else if (milkProduction > 30) {
    propyleneGlycolQuantity = 150;
  }
  
  // Additional sodium bicarbonate for high concentrate diets
  if (isHighProducing) {
    sodiumBicarbonateQuantity += 100; // Add 100g for rumen buffering
  }
  
  return {
    amv,
    amvQuantity: Math.round(amvQuantity),
    caco3Quantity: Math.round(caco3Quantity),
    sodiumBicarbonateQuantity: Math.round(sodiumBicarbonateQuantity),
    magnesiumOxideQuantity: Math.round(magnesiumOxideQuantity),
    propyleneGlycolQuantity: Math.round(propyleneGlycolQuantity),
    caDeficit: caGrossDeficit,
    pDeficit: pGrossDeficit,
    mgDeficit: mgGrossDeficit,
    naDeficit: naGrossDeficit,
    dcalciumRatio: ratio
  };
}

// ============================================================================
// PART 14: METABOLIC DISEASE PREVENTION CHECK
// ============================================================================

export interface MetabolicRisk {
  milkFeverRisk: 'low' | 'moderate' | 'high';
  ketosisRisk: 'low' | 'moderate' | 'high';
  acidosisRisk: 'low' | 'moderate' | 'high';
  tetanyRisk: 'low' | 'moderate' | 'high';
  recommendations: string[];
  recommendationsAr: string[];
}

export function checkMetabolicRisks(
  cow: CowCharacteristics,
  ration: RationResult,
  mineral: MineralSupplement
): MetabolicRisk {
  const risks = {
    milkFeverRisk: 'low' as const,
    ketosisRisk: 'low' as const,
    acidosisRisk: 'low' as const,
    tetanyRisk: 'low' as const,
    recommendations: [] as string[],
    recommendationsAr: [] as string[]
  };
  
  // Milk fever risk (Ca deficiency)
  const caDeficitPercent = Math.abs(mineral.caDeficit) / (cow.liveWeight / 100);
  if (caDeficitPercent > 0.3 || (cow.gestationWeek >= 36 && mineral.caDeficit > 20)) {
    risks.milkFeverRisk = 'high';
    risks.recommendations.push("⚠️ Risque élevé de fièvre de lait - Augmenter l'apport en calcium");
    risks.recommendationsAr.push("⚠️ خطر مرتفع لإصابة بحمى الحليب - زيادة تناول الكالسيوم");
    if (cow.gestationWeek >= 36) {
      risks.recommendations.push("📅 Période de tarissement - Utiliser une ration pauvre en calcium (DCAD négatif)");
      risks.recommendationsAr.push("📅 فترة الجفاف - استخدم علف منخفض الكالسيوم (DCAD سالب)");
    }
  } else if (caDeficitPercent > 0.15) {
    risks.milkFeverRisk = 'moderate';
    risks.recommendations.push("⚠️ Risque modéré de fièvre de lait - Surveiller l'apport en calcium");
    risks.recommendationsAr.push("⚠️ خطر متوسط لإصابة بحمى الحليب - مراقبة الكالسيوم");
  }
  
  // Ketosis risk (energy deficiency)
  const energyDeficit = -ration.uflBalance;
  const energyDeficitPercent = energyDeficit / (cow.liveWeight / 100);
  if (cow.lactationWeek <= 4 && energyDeficitPercent > 0.5) {
    risks.ketosisRisk = 'high';
    risks.recommendations.push("⚠️ Risque élevé de cétose - Augmenter l'apport énergétique");
    risks.recommendationsAr.push("⚠️ خطر مرتفع للإصابة بالكيتوزية - زيادة الطاقة");
    if (mineral.propyleneGlycolQuantity === 0) {
      risks.recommendations.push("💊 Ajouter Propylène Glycol (Propaline) 200-300 ml/jour");
      risks.recommendationsAr.push("💊 أضف بروبيلين جليكول (بروبالين) 200-300 مل/يوم");
    }
  } else if (cow.lactationWeek <= 8 && energyDeficitPercent > 0.3) {
    risks.ketosisRisk = 'moderate';
    risks.recommendations.push("⚠️ Risque modéré de cétose - Surveiller l'état corporel");
    risks.recommendationsAr.push("⚠️ خطر متوسط للكيتوزية - مراقبة حالة الجسم");
  }
  
  // Acidosis risk (starch/fiber imbalance)
  if (ration.concentratePercentage > 50) {
    risks.acidosisRisk = 'high';
    risks.recommendations.push("⚠️ Risque élevé d'acidose - Réduire les concentrés ou ajouter du bicarbonate");
    risks.recommendationsAr.push("⚠️ خطر مرتفع للحموضة - قلل من المركزات أو أضف البيكربونات");
    if (mineral.sodiumBicarbonateQuantity < 100) {
      risks.recommendations.push("💊 Ajouter bicarbonate de sodium 100-200 g/jour");
      risks.recommendationsAr.push("💊 أضف بيكربونات الصوديوم 100-200 جم/يوم");
    }
  } else if (ration.concentratePercentage > 40) {
    risks.acidosisRisk = 'moderate';
    risks.recommendations.push("⚠️ Risque modéré d'acidose - Équilibrer fibre/concentré");
    risks.recommendationsAr.push("⚠️ خطر متوسط للحموضة - وازن بين الألياف والمركزات");
  }
  
  // Tetany risk (grass tetany - Mg deficiency)
  if (mineral.mgDeficit > 10) {
    risks.tetanyRisk = 'high';
    risks.recommendations.push("⚠️ Risque élevé de tétanie d'herbe - Augmenter l'apport en magnésium");
    risks.recommendationsAr.push("⚠️ خطر مرتفع للكزاز العشبي - زيادة المغنيسيوم");
  } else if (mineral.mgDeficit > 5) {
    risks.tetanyRisk = 'moderate';
    risks.recommendations.push("⚠️ Risque modéré de tétanie - Surveiller les signes");
    risks.recommendationsAr.push("⚠️ خطر متوسط للكزاز - مراقبة العلامات");
  }
  
  return risks;
}

// ============================================================================
// PART 15: FEED PRICE CALCULATION AND OPTIMIZATION
// ============================================================================

export interface FeedPrice {
  feedId: string;
  priceMADPerKg: number;
  priceMADPerKgDM: number;
  costPerUFL: number;
  costPer100gPDI: number;
}

export interface RationCost {
  dailyCostPerAnimal: number;
  dailyCostPerAnimalMAD: number;
  totalDailyCost: number;
  costPerKgMilk: number;
  costPerUFL: number;
  costPer100gPDI: number;
  monthlyCost: number;
  annualCost: number;
  breakdown: {
    forage: number;
    concentrate: number;
    mineral: number;
    additives: number;
  };
}

export function calculateRationCost(
  ration: RationResult,
  mineral: MineralSupplement,
  feedPrices: Record<string, number>,
  forageId: string,
  concentrateId: string,
  numberOfAnimals: number = 1
): RationCost {
  const foragePrice = feedPrices[forageId] || 2;
  const concentratePrice = feedPrices[concentrateId] || 5;
  const amvPrice = 8; // MAD/kg for AMV
  const caco3Price = 1.5; // MAD/kg
  const sodiumBicarbPrice = 3; // MAD/kg
  const magnesiumOxidePrice = 4; // MAD/kg
  const propyleneGlycolPrice = 15; // MAD/liter
  
  const forageCost = ration.forageDM * foragePrice;
  const concentrateCost = ration.concentrateDM * concentratePrice;
  const mineralCost = 
    (mineral.amvQuantity / 1000) * amvPrice +
    (mineral.caco3Quantity / 1000) * caco3Price +
    (mineral.sodiumBicarbonateQuantity / 1000) * sodiumBicarbPrice +
    (mineral.magnesiumOxideQuantity / 1000) * magnesiumOxidePrice +
    (mineral.propyleneGlycolQuantity / 1000) * propyleneGlycolPrice;
  
  const dailyCostPerAnimal = forageCost + concentrateCost + mineralCost;
  const dailyCostPerAnimalMAD = dailyCostPerAnimal;
  const totalDailyCost = dailyCostPerAnimal * numberOfAnimals;
  
  const milkProduced = Math.min(
    ration.milkPermittedByUFL,
    ration.milkPermittedByPDIN,
    ration.milkPermittedByPDIE
  );
  
  const costPerKgMilk = milkProduced > 0 ? dailyCostPerAnimal / milkProduced : 0;
  const costPerUFL = ration.uflSupply > 0 ? dailyCostPerAnimal / ration.uflSupply : 0;
  const costPer100gPDI = ration.pdinSupply > 0 ? dailyCostPerAnimal / (ration.pdinSupply / 100) : 0;
  
  return {
    dailyCostPerAnimal,
    dailyCostPerAnimalMAD,
    totalDailyCost,
    costPerKgMilk,
    costPerUFL,
    costPer100gPDI,
    monthlyCost: totalDailyCost * 30,
    annualCost: totalDailyCost * 365,
    breakdown: {
      forage: forageCost,
      concentrate: concentrateCost,
      mineral: mineralCost,
      additives: mineralCost
    }
  };
}

// ============================================================================
// PART 16: COMPLETE RATION FORMULA - MAIN EXPORT FUNCTION
// ============================================================================

export interface CompleteRationFormula {
  cow: CowCharacteristics;
  needs: NutrientNeeds;
  ingestionCapacity: IngestionCapacity;
  ration: RationResult;
  mineral: MineralSupplement;
  risks: MetabolicRisk;
  cost?: RationCost;
  
  // Complete formula results
  equationResults: {
    equation1: string; // Maintenance: UFL = 1.4 + 0.006 * LW
    equation2: string; // Production: UFL = 0.44 * milk
    equation3: string; // CI = (Base + Prod + NEC) * Effects
    equation4: string; // E = f(milk, UEL, UFL)
    equation5: string; // Sg = f(milk, UEL, UFL)
    equation6: string; // CI = X*VEf + Y*VEf*Sg
    equation7: string; // UFL_needs + E = X*UFLf + Y*UFLc
    equation8: string; // Milk = (Supply - Maintenance) / 0.44
    equation9: string; // RMIC = (PDIN - PDIE) / UFL
  };
  
  recommendations: {
    fr: string[];
    ar: string[];
  };
}

export function calculateCompleteRation(
  cow: CowCharacteristics,
  forage: Feed,
  concentrate: Feed,
  feedPrices?: Record<string, number>,
  forageQuantity?: number,
  numberOfAnimals: number = 1
): CompleteRationFormula {
  
  // Step 1: Calculate all needs
  const needs = calculateNutrientNeeds(cow);
  
  // Step 2: Calculate ingestion capacity
  const ingestionCapacity = calculateIngestionCapacity(cow);
  
  // Step 3: Calculate ration
  const ration = calculateRation(cow, forage, concentrate, forageQuantity);
  
  // Step 4: Calculate mineral supplement with Propaline and AMG
  const mineral = calculateMineralSupplement(
    ration.caSupply,
    ration.pSupply,
    ration.mgSupply,
    ration.naSupply,
    needs.caNeedsWithCoeff,
    needs.pNeedsWithCoeff,
    needs.mgAbs,
    needs.naAbs,
    cow.lactationWeek,
    cow.milkProductionPotential,
    cow.milkProductionPotential > 35
  );
  
  // Step 5: Check metabolic risks
  const risks = checkMetabolicRisks(cow, ration, mineral);
  
  // Step 6: Calculate cost if prices provided
  let cost: RationCost | undefined;
  if (feedPrices) {
    cost = calculateRationCost(ration, mineral, feedPrices, forage.id, concentrate.id, numberOfAnimals);
  }
  
  // Step 7: Generate recommendations
  const recommendations = {
    fr: [] as string[],
    ar: [] as string[]
  };
  
  // Add recommendations based on results
  if (!ration.isBalanced) {
    if (ration.uflBalance < 0) {
      recommendations.fr.push("❌ Déficit énergétique - Augmenter la quantité de concentré");
      recommendations.ar.push("❌ عجز في الطاقة - زيادة كمية المركزات");
    }
    if (ration.pdiBalance < 0) {
      recommendations.fr.push("❌ Déficit protéique - Utiliser un tourteau plus riche");
      recommendations.ar.push("❌ عجز في البروتين - استخدام كسب أغنى");
    }
  }
  
  if (mineral.amv) {
    recommendations.fr.push(`✅ Ajouter ${mineral.amvQuantity}g/jour de ${mineral.amv.nameFr}`);
    recommendations.ar.push(`✅ أضف ${mineral.amvQuantity}جم/يوم من ${mineral.amv.nameAr}`);
  }
  
  if (mineral.propyleneGlycolQuantity > 0) {
    recommendations.fr.push(`💊 Ajouter Propaline (Propylène Glycol) ${mineral.propyleneGlycolQuantity}ml/jour pour prévenir l'acétonémie`);
    recommendations.ar.push(`💊 أضف بروبالين (بروبيلين جليكول) ${mineral.propyleneGlycolQuantity}مل/يوم للوقاية من الأسيتونيميا`);
  }
  
  if (mineral.sodiumBicarbonateQuantity > 0) {
    recommendations.fr.push(`🧂 Ajouter bicarbonate de sodium ${mineral.sodiumBicarbonateQuantity}g/jour pour tamponner le rumen`);
    recommendations.ar.push(`🧂 أضف بيكربونات الصوديوم ${mineral.sodiumBicarbonateQuantity}جم/يوم لمعادلة الكرش`);
  }
  
  if (mineral.magnesiumOxideQuantity > 0) {
    recommendations.fr.push(`🪨 Ajouter oxyde de magnésium ${mineral.magnesiumOxideQuantity}g/jour pour prévenir la tétanie`);
    recommendations.ar.push(`🪨 أضف أكسيد المغنيسيوم ${mineral.magnesiumOxideQuantity}جم/يوم للوقاية من الكزاز`);
  }
  
  // Equation results for transparency
  const equationResults = {
    equation1: `Maintenance UFL = 1.4 + 0.006 × ${cow.liveWeight} = ${needs.uflMaintenance.toFixed(2)} UFL`,
    equation2: `Production UFL = 0.44 × ${cow.milkProductionPotential} = ${needs.uflProduction.toFixed(2)} UFL`,
    equation3: `CI = Base(${ingestionCapacity.baseCI.toFixed(2)}) + Prod(${ingestionCapacity.productionEffect.toFixed(2)}) + NEC(${ingestionCapacity.necEffect.toFixed(2)}) × Effects = ${ingestionCapacity.ci.toFixed(2)} UEL`,
    equation4: `E Correction = ${ration.E.toFixed(3)} UFL`,
    equation5: `Sg Substitution = ${ration.Sg.toFixed(3)}`,
    equation6: `${ingestionCapacity.ci.toFixed(2)} = X × ${ration.forageUEL.toFixed(2)} + Y × ${ration.forageUEL.toFixed(2)} × ${ration.Sg.toFixed(3)}`,
    equation7: `${needs.uflTotal.toFixed(2)} + ${ration.E.toFixed(3)} = X × ${ration.forageUFL.toFixed(2)} + Y × ${concentrate.ufl.toFixed(2)}`,
    equation8: `Lait permis = (${ration.uflSupply.toFixed(2)} - ${needs.uflMaintenance.toFixed(2)}) / 0.44 = ${ration.milkPermittedByUFL.toFixed(1)} kg`,
    equation9: `RMIC = (${ration.pdinSupply.toFixed(0)} - ${ration.pdieSupply.toFixed(0)}) / ${ration.uflSupply.toFixed(2)} = ${ration.rmic.toFixed(2)}`
  };
  
  return {
    cow,
    needs,
    ingestionCapacity,
    ration,
    mineral,
    risks,
    cost,
    equationResults,
    recommendations
  };
}

// Export default for easy importing
export default {
  calculateMaintenanceNeeds,
  calculateProductionNeeds,
  calculateGestationNeeds,
  calculateNutrientNeeds,
  calculateIngestionCapacity,
  calculateRation,
  calculateMineralSupplement,
  calculateCompleteRation
};