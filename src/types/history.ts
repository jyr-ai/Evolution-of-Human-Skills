export type SkillCategory = 'obsolescent' | 'transformed' | 'emergent';

export interface WorkforcePrevalence {
  percentage: number; // estimated percentage of relevant working population
  populationDescription: string; // e.g. "~240,000 workers, 1820 British Census (12.5% of manufacturing labor)"
  peakEraYear: string; // e.g. "c. 1820"
  censusSource: string; // academic or census reference
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  craftDomain: string;
  description: string;
  displacingOrEnablingTech: string;
  cognitiveShift: string;
  dexterityLevel: 'High' | 'Moderate' | 'Low';
  cognitiveLoad: 'High' | 'Moderate' | 'Low';
  historicalContext: string;
  scholarNote?: string;
  workforcePrevalence?: WorkforcePrevalence;
  demonstratorArchetype?: 'loom' | 'steam' | 'lineman' | 'assembly' | 'cad' | 'ai' | 'chemistry' | 'code' | 'medical' | 'general' | 'telegraph' | 'telephone' | 'bio';
  imagePath?: string;
}

export interface SocietalGroup {
  name: string;
  category: 'loser' | 'winner';
  roleType: string;
  whyAffected: string;
  reactionOrLeverage: string;
  longTermOutcome: string;
  historicalIncident: string;
}

export interface TransitionNode {
  id: string;
  roleTitle: string;
  oldRole: string;
  newRole: string;
  oldSkillRequired: string;
  newSkillRequired: string;
  physicalLoadShift: {
    before: number; // 0-100
    after: number; // 0-100
    description: string;
  };
  cognitiveLoadShift: {
    before: number; // 0-100
    after: number; // 0-100
    description: string;
  };
  dexterityShift: {
    before: number; // 0-100
    after: number; // 0-100
    description: string;
  };
  oversightLoadShift: {
    before: number; // 0-100
    after: number; // 0-100
    description: string;
  };
  keyFriction: string;
  typicalTrainingTime: string;
}

export interface IndustrialEra {
  id: string;
  number: number;
  romanNumeral: string;
  title: string;
  timeframe: string;
  imagePath: string;
  coreTechShock: string;
  keyQuote: {
    text: string;
    author: string;
    context: string;
  };
  coreTechnologies: string[];
  macroMetrics: {
    capitalIntensity: 'Low' | 'Moderate' | 'High' | 'Extreme' | string;
    primaryDisplacedTier: string;
    primaryAscendantTier: string;
    diffusionSpeedYears: string;
    polanyiParadoxStatus: string;
  };
  skills: SkillItem[];
  losers: SocietalGroup[];
  winners: SocietalGroup[];
  transitions: TransitionNode[];
}

export interface EnduringSkill {
  id: string;
  name: string;
  archetype: string;
  whyEnduring: string;
  manifestationInEra1: string;
  manifestationInEra2: string;
  manifestationInEra3: string;
  manifestationInEra4: string;
  aiImmunityRationale: string;
}

export interface SynthesisPoint {
  dimension: string;
  eras1to3: string;
  era4AI: string;
  economicMechanism: string;
}
