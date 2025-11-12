export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbGco2eq: number; // Compliance Balance in gCO₂e
  targetIntensity: number; // Target GHG intensity (gCO₂e/MJ)
  actualIntensity: number; // Actual GHG intensity (gCO₂e/MJ)
  energyInScope: number; // Energy in scope (MJ)
}

export interface AdjustedComplianceBalance extends ComplianceBalance {
  adjustedCb: number; // CB after banking applications
}

