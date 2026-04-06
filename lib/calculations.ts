// FILAHATI Calculation Engine for Dairy Cow Ration
import { Feed, selectAMV, AMV } from './feed-data';

export interface CowCharacteristics {
  liveWeight: number; // kg
  milkProductionPotential: number; // kg/day
  lactationWeek: number;
  bodyConditionScore: number; // 1-5
  ageMonths: number;
  gestationWeek: number;
  isMultiparous: boolean;
}

export interface NutrientNeeds {
  uflMaintenance: number;
  uflProduction: number;
  uflGestation: number;
  uflTotal: number;
  pdiMaintenance: number;
  pdiProduction: number;
  pdiGestation: number;
  pdiTotal: number;
  caAbs: number;
  pAbs: number;
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
}

export interface RationResult {
  forageDM: number; // kg MS fourrage
  concentrateDM: number; // kg MS concentré
  totalDM: number;
  uflSupply: number;
  pdinSupply: number;
  pdieSupply: number;
  caSupply: number;
  pSupply: number;
  uflBalance: number;
  pdiBalance: number;
  caBalance: number;
  pBalance: number;
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
}

// Table 2.1: Potential milk production based on stage and max potential
export function getPotentialMilkProduction(
  maxPotential: number,
  lactationWeek: number,
  isMultiparous: boolean
): number {
  // Simplified calculation based on lactation curve
  const peakWeek = isMultiparous ? 6 : 8;
  const persistency = isMultiparous ? 0.97 : 0.98;
  
  if (lactationWeek <= peakWeek) {
    return maxPotential * (0.8 + 0.2 * (lactationWeek / peakWeek));
  } else {
    const weeksAfterPeak = lactationWeek - peakWeek;
    return maxPotential * Math.pow(persistency, weeksAfterPeak);
  }
}

// Calculate maintenance needs
export function calculateMaintenanceNeeds(liveWeight: number): { ufl: number; pdi: number; ca: number; p: number } {
  const ufl = 1.4 + 0.006 * liveWeight;
  const pdi = 95 + 0.5 * liveWeight;
  const ca = 6 * liveWeight / 100;
  const p = 5 * liveWeight / 100;
  return { ufl, pdi, ca, p };
}

// Calculate production needs
export function calculateProductionNeeds(milkProduction: number): { ufl: number; pdi: number; ca: number; p: number } {
  const ufl = 0.44 * milkProduction;
  const pdi = 48 * milkProduction;
  const ca = 3.5 * milkProduction; // or 1.25 * milk for Ca abs
  const p = 1.7 * milkProduction; // or 0.9 * milk for P abs
  return { ufl, pdi, ca, p };
}

// Calculate gestation needs
export function calculateGestationNeeds(gestationMonth: number): { ufl: number; pdi: number; ca: number; p: number } {
  const gestationNeeds: Record<number, { ufl: number; pdi: number; ca: number; p: number }> = {
    6: { ufl: 0.4, pdi: 36, ca: 1.9, p: 1.5 },
    7: { ufl: 0.8, pdi: 68, ca: 3.8, p: 2.8 },
    8: { ufl: 1.4, pdi: 116, ca: 6.7, p: 4.2 },
    9: { ufl: 2.3, pdi: 179, ca: 9.7, p: 5.3 }
  };
  
  if (gestationMonth < 6) return { ufl: 0, pdi: 0, ca: 0, p: 0 };
  return gestationNeeds[Math.min(gestationMonth, 9)] || { ufl: 0, pdi: 0, ca: 0, p: 0 };
}

// Calculate total nutrient needs
export function calculateNutrientNeeds(cow: CowCharacteristics): NutrientNeeds {
  const maintenance = calculateMaintenanceNeeds(cow.liveWeight);
  const production = calculateProductionNeeds(cow.milkProductionPotential);
  const gestationMonth = Math.floor(cow.gestationWeek / 4);
  const gestation = calculateGestationNeeds(gestationMonth);
  
  // Ca and P absorbable for dairy production
  const caAbsMaintenance = 17.4; // for 650kg cow
  const pAbsMaintenance = 17;
  const caAbsProduction = 1.25 * cow.milkProductionPotential;
  const pAbsProduction = 0.9 * cow.milkProductionPotential;
  
  return {
    uflMaintenance: maintenance.ufl,
    uflProduction: production.ufl,
    uflGestation: gestation.ufl,
    uflTotal: maintenance.ufl + production.ufl + gestation.ufl,
    pdiMaintenance: maintenance.pdi,
    pdiProduction: production.pdi,
    pdiGestation: gestation.pdi,
    pdiTotal: maintenance.pdi + production.pdi + gestation.pdi,
    caAbs: caAbsMaintenance + caAbsProduction + gestation.ca,
    pAbs: pAbsMaintenance + pAbsProduction + gestation.p
  };
}

// Calculate ingestion capacity (CI) based on FILAHATI Table 2.3
export function calculateIngestionCapacity(cow: CowCharacteristics): IngestionCapacity {
  // Base CI based on live weight (from table 2.3)
  const weightFactors: Record<number, number> = {
    500: 12.40,
    550: 13.05,
    600: 13.70,
    650: 14.65,
    700: 15.40,
    750: 16.15
  };
  
  // Get closest weight factor
  const weights = Object.keys(weightFactors).map(Number);
  const closestWeight = weights.reduce((prev, curr) => 
    Math.abs(curr - cow.liveWeight) < Math.abs(prev - cow.liveWeight) ? curr : prev
  );
  let baseCI = weightFactors[closestWeight];
  
  // Interpolate if needed
  if (cow.liveWeight !== closestWeight) {
    const idx = weights.indexOf(closestWeight);
    if (cow.liveWeight > closestWeight && idx < weights.length - 1) {
      const nextWeight = weights[idx + 1];
      const ratio = (cow.liveWeight - closestWeight) / (nextWeight - closestWeight);
      baseCI = baseCI + ratio * (weightFactors[nextWeight] - baseCI);
    } else if (cow.liveWeight < closestWeight && idx > 0) {
      const prevWeight = weights[idx - 1];
      const ratio = (closestWeight - cow.liveWeight) / (closestWeight - prevWeight);
      baseCI = baseCI - ratio * (baseCI - weightFactors[prevWeight]);
    }
  }
  
  // Production effect (from table - approximately 0.15 UEL per kg of milk potential)
  const productionEffect = 0.15 * cow.milkProductionPotential;
  
  // NEC effect
  const necFactors: Record<number, number> = {
    2: 1.5,
    2.5: 0.75,
    3: 0,
    3.5: -0.75,
    4: -1.5
  };
  const necEffect = necFactors[cow.bodyConditionScore] ?? 0;
  
  // Lactation week effect
  let lactationEffect = 1;
  if (cow.lactationWeek <= 2) lactationEffect = 0.80;
  else if (cow.lactationWeek <= 4) lactationEffect = 0.88;
  else if (cow.lactationWeek <= 8) lactationEffect = 0.92;
  else if (cow.lactationWeek <= 16) lactationEffect = 0.98;
  else lactationEffect = 1.0;
  
  // Parity effect
  const parityEffect = cow.isMultiparous ? 1 : 0.85;
  
  // Gestation effect
  let gestationEffect = 1;
  if (cow.gestationWeek >= 30) {
    gestationEffect = 1 - 0.02 * Math.floor((cow.gestationWeek - 30) / 4);
  }
  
  // Maturity effect based on age
  let maturityEffect = 1;
  if (cow.ageMonths < 36) maturityEffect = 0.90;
  else if (cow.ageMonths < 42) maturityEffect = 0.94;
  else if (cow.ageMonths < 48) maturityEffect = 0.97;
  else maturityEffect = 1.0;
  
  const ci = (baseCI + productionEffect + necEffect) * lactationEffect * parityEffect * gestationEffect * maturityEffect;
  
  return {
    ci,
    baseCI,
    productionEffect,
    necEffect,
    lactationEffect,
    parityEffect,
    gestationEffect,
    maturityEffect
  };
}

// Calculate energy correction E (Table 2.6)
export function calculateEnergyCorrection(
  milkPotential: number,
  forageUEL: number,
  forageUFL: number,
  isMultiparous: boolean
): number {
  // Simplified interpolation based on FILAHATI Table 2.6
  // Values increase with milk production and forage quality
  const baseE = 0.25; // Base correction for 25kg milk, UEL 0.95, UFL 0.90
  
  const milkFactor = (milkPotential - 25) * 0.03;
  const uelFactor = (forageUEL - 0.95) * 0.2;
  const uflFactor = (forageUFL - 0.90) * 0.15;
  
  let E = baseE + milkFactor + uelFactor - uflFactor;
  
  // Primiparous have lower E
  if (!isMultiparous) E *= 0.8;
  
  return Math.max(0, E);
}

// Calculate substitution rate Sg (Table 2.7)
export function calculateSubstitutionRate(
  milkPotential: number,
  forageUEL: number,
  forageUFL: number,
  isMultiparous: boolean
): number {
  // Simplified interpolation based on FILAHATI Table 2.7
  const baseSg = 0.44; // Base for 30kg milk, UEL 0.95, UFL 0.85
  
  const milkFactor = (milkPotential - 30) * 0.008;
  const uelFactor = (forageUEL - 0.95) * 0.1;
  const uflFactor = (forageUFL - 0.85) * 0.15;
  
  let Sg = baseSg + milkFactor - uelFactor + uflFactor;
  
  // Primiparous have lower substitution
  if (!isMultiparous) Sg *= 0.9;
  
  return Math.min(0.8, Math.max(0.2, Sg));
}

// Calculate ration balance
export function calculateRation(
  cow: CowCharacteristics,
  forage: Feed,
  concentrate: Feed,
  forageQuantity?: number // Optional fixed quantity
): RationResult {
  const needs = calculateNutrientNeeds(cow);
  const ciData = calculateIngestionCapacity(cow);
  const ci = ciData.ci;
  
  // Step 2: Calculate forage DM if fed alone
  const forageDMAlone = ci / forage.uel;
  
  // Step 3: Calculate energy densities
  const energyDensityMin = needs.uflTotal / ci;
  const energyDensityForage = forage.ufl / forage.uel;
  const needsConcentrate = energyDensityForage < energyDensityMin;
  
  let forageDM: number;
  let concentrateDM: number;
  let E: number;
  let Sg: number;
  
  if (!needsConcentrate) {
    // Forage alone is sufficient
    forageDM = needs.uflTotal / forage.ufl;
    concentrateDM = 0;
    E = 0;
    Sg = 0;
  } else {
    // Need to add concentrate
    E = calculateEnergyCorrection(cow.milkProductionPotential, forage.uel, forage.ufl, cow.isMultiparous);
    Sg = calculateSubstitutionRate(cow.milkProductionPotential, forage.uel, forage.ufl, cow.isMultiparous);
    
    // Solve system of equations:
    // CI = X * VEf + Y * VEf * Sg
    // Needs UFL + E = X * UFLf + Y * UFLc
    
    const VEf = forage.uel;
    const UFLf = forage.ufl;
    const UFLc = concentrate.ufl;
    const needsWithE = needs.uflTotal + E;
    
    // Solving the system
    // From CI equation: X = (CI - Y * VEf * Sg) / VEf
    // Substitute into energy equation:
    // needsWithE = ((CI - Y * VEf * Sg) / VEf) * UFLf + Y * UFLc
    // needsWithE = CI * UFLf / VEf - Y * Sg * UFLf + Y * UFLc
    // Y * (UFLc - Sg * UFLf) = needsWithE - CI * UFLf / VEf
    
    const denominator = UFLc - Sg * UFLf;
    if (Math.abs(denominator) > 0.001) {
      concentrateDM = (needsWithE - ci * UFLf / VEf) / denominator;
      concentrateDM = Math.max(0, concentrateDM);
      forageDM = (ci - concentrateDM * VEf * Sg) / VEf;
      forageDM = Math.max(0, forageDM);
    } else {
      // Fallback
      forageDM = ci / VEf * 0.7;
      concentrateDM = ci / VEf * 0.3 / Sg;
    }
  }
  
  // Override if fixed quantity provided
  if (forageQuantity !== undefined) {
    forageDM = forageQuantity;
  }
  
  const totalDM = forageDM + concentrateDM;
  
  // Calculate supplies
  const uflSupply = forageDM * forage.ufl + concentrateDM * concentrate.ufl - E;
  const pdinSupply = forageDM * forage.pdin + concentrateDM * concentrate.pdin;
  const pdieSupply = forageDM * forage.pdie + concentrateDM * concentrate.pdie;
  const caSupply = forageDM * forage.ca + concentrateDM * concentrate.ca;
  const pSupply = forageDM * forage.p + concentrateDM * concentrate.p;
  
  // Calculate balances
  const uflBalance = uflSupply - needs.uflTotal;
  const pdiBalance = Math.min(pdinSupply, pdieSupply) - needs.pdiTotal;
  const caBalance = caSupply - needs.caAbs * 100 / 40; // Convert abs to total
  const pBalance = pSupply - needs.pAbs * 100 / 65;
  
  // Milk permitted by each nutrient
  const maintenanceUFL = needs.uflMaintenance;
  const maintenancePDI = needs.pdiMaintenance;
  
  const milkPermittedByUFL = (uflSupply - maintenanceUFL) / 0.44;
  const milkPermittedByPDIN = (pdinSupply - maintenancePDI) / 48;
  const milkPermittedByPDIE = (pdieSupply - maintenancePDI) / 48;
  
  // Rmic calculation
  const rmic = uflSupply > 0 ? (pdinSupply - pdieSupply) / uflSupply : 0;
  
  // Concentrate percentage
  const concentratePercentage = totalDM > 0 ? (concentrateDM / totalDM) * 100 : 0;
  
  // Check if balanced (within 5% tolerance)
  const isBalanced = 
    Math.abs(uflBalance) < needs.uflTotal * 0.05 &&
    pdiBalance >= -needs.pdiTotal * 0.05;
  
  return {
    forageDM,
    concentrateDM,
    totalDM,
    uflSupply,
    pdinSupply,
    pdieSupply,
    caSupply,
    pSupply,
    uflBalance,
    pdiBalance,
    caBalance,
    pBalance,
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
    needsConcentrate
  };
}

// Calculate corrector quantity to balance the ration
export function calculateCorrector(
  baseRation: RationResult,
  needs: NutrientNeeds,
  corrector: Feed
): number {
  // Find the limiting PDI
  const pdinDeficit = needs.pdiTotal - baseRation.pdinSupply;
  const pdieDeficit = needs.pdiTotal - baseRation.pdieSupply;
  
  // Use PDIN as limiting if it's lower
  if (baseRation.milkPermittedByPDIN < baseRation.milkPermittedByPDIE) {
    // Correct with protein-rich feed
    // Solve: milkByUFL = milkByPDIN after adding corrector
    // (UFL_base + X * UFL_corr - maintenance) / 0.44 = (PDIN_base + X * PDIN_corr - maintenance) / 48
    
    const a = corrector.ufl / 0.44 - corrector.pdin / 48;
    const b = (baseRation.uflSupply - needs.uflMaintenance) / 0.44 - 
              (baseRation.pdinSupply - needs.pdiMaintenance) / 48;
    
    if (Math.abs(a) > 0.001) {
      return Math.max(0, -b / a);
    }
  }
  
  return 0;
}

// Calculate mineral supplement needs
export interface MineralSupplement {
  amv: AMV | null;
  amvQuantity: number;
  caco3Quantity: number;
  caDeficit: number;
  pDeficit: number;
  ratio: number;
}

export function calculateMineralSupplement(
  caSupply: number,
  pSupply: number,
  caNeeds: number,
  pNeeds: number
): MineralSupplement {
  // Convert to absorbable values using CAR
  const carCa = 0.40; // Coefficient d'absorption réelle Ca
  const carP = 0.65; // Coefficient d'absorption réelle P
  
  const caDeficit = Math.max(0, caNeeds - caSupply * carCa);
  const pDeficit = Math.max(0, pNeeds - pSupply * carP);
  
  // Convert absorbable deficit to gross
  const caGrossDeficit = caDeficit / carCa;
  const pGrossDeficit = pDeficit / carP;
  
  const ratio = pGrossDeficit > 0 ? caGrossDeficit / pGrossDeficit : 999;
  
  // Select appropriate AMV
  const amv = selectAMV(caGrossDeficit, pGrossDeficit);
  
  let amvQuantity = 0;
  let caco3Quantity = 0;
  
  if (amv && pGrossDeficit > 0) {
    // Calculate AMV quantity to cover P deficit
    amvQuantity = (pGrossDeficit * 100) / amv.pPercent;
    
    // Ca provided by AMV
    const caFromAMV = (amvQuantity * amv.caPercent) / 100;
    
    // Additional CaCO3 if Ca deficit not covered
    const remainingCaDeficit = caGrossDeficit - caFromAMV;
    if (remainingCaDeficit > 0) {
      // CaCO3 contains 40% Ca
      caco3Quantity = (remainingCaDeficit * 100) / 40;
    }
  } else if (caGrossDeficit > 0) {
    // Only Ca deficit, use CaCO3
    caco3Quantity = (caGrossDeficit * 100) / 40;
  }
  
  return {
    amv,
    amvQuantity: Math.round(amvQuantity),
    caco3Quantity: Math.round(caco3Quantity),
    caDeficit: caGrossDeficit,
    pDeficit: pGrossDeficit,
    ratio
  };
}
