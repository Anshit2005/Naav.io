import { ComplianceBalance } from '../domain/Compliance';

const TARGET_INTENSITY_2025 = 89.3368; // gCO₂e/MJ (2% below 91.16)
const ENERGY_PER_TONNE = 41000; // MJ per tonne of fuel

export class CalculateComplianceBalance {
  execute(
    shipId: string,
    year: number,
    actualIntensity: number, // gCO₂e/MJ
    fuelConsumption: number // tonnes
  ): ComplianceBalance {
    const energyInScope = fuelConsumption * ENERGY_PER_TONNE;
    const targetIntensity = TARGET_INTENSITY_2025;
    const cbGco2eq = (targetIntensity - actualIntensity) * energyInScope;

    return {
      shipId,
      year,
      cbGco2eq,
      targetIntensity,
      actualIntensity,
      energyInScope,
    };
  }
}

