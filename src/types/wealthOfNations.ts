export interface CountryShiftTrajectory {
  countryCode: string; // ISO 2-letter or short code e.g. "GB", "US", "DE"
  countryName: string;
  flagEmoji: string;
  region: 'Western Europe' | 'North America' | 'East Asia' | 'Eurasia / Latin America / Other';
  
  // Start of Era Snapshot
  startYear: number;
  startSkillDiversity: number; // 0 - 100 (Spectrum: Narrow mono-craft / agrarian -> Highly diversified craft guilds & technical specialisms)
  startTechMight: number; // 0 - 100 (Technological manufacturing might / steam horsepower / electrification / computational output)
  startGdpPerCapita: number; // Maddison Project equivalent in 1990 Int$ or 2011 Int$ PPP
  startTotalGdpBillions?: number;
  
  // End of Era Snapshot
  endYear: number;
  endSkillDiversity: number; // 0 - 100
  endTechMight: number; // 0 - 100
  endGdpPerCapita: number;
  endTotalGdpBillions?: number;

  // Replacement / Automation Exposure Risk (0 - 100)
  // Expresses the share / severity of the country's workforce skills at risk of being replaced by machines in this era
  riskSummary: {
    manualReplacementRisk: number; // 0 - 100% (physical mechanization / robotics / conveyor speedup)
    cognitiveReplacementRisk: number; // 0 - 100% (computational calculation / LLM / white-collar office synthesis)
    compositeAutomationExposure: number; // 0 - 100%
    mostVulnerableSector: string;
    safestOrAscendantSector: string;
  };

  historicalContext: string;
  economicMechanism: string; // How skills and technological might drove GDP growth or divergence
  academicSource: string; // e.g. Maddison Historical Statistics, Broadberry, Crafts, Acemoglu, UNIDO
}

export interface EraNationsDataset {
  eraId: string; // 'era-1', 'era-2', 'era-3', 'era-4'
  eraNumber: number;
  eraTitle: string;
  timeRange: string;
  startYear: number;
  endYear: number;
  historicalThesis: string;
  xAxisLabel: string; // "Skill Diversity & Complexity Spectrum (Low / Agrarian Mono-craft → High / Hyper-Specialized Technicians)"
  yAxisLabel: string; // "Technological Manufacturing Might & Mechanized Horsepower / Output"
  countries: CountryShiftTrajectory[];
  eraKeyInsights: string[];
}
