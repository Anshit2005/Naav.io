import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';

export interface ComplianceRepository {
  save(cb: ComplianceBalance): Promise<void>;
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  findAdjustedByShipAndYear(shipId: string, year: number): Promise<AdjustedComplianceBalance | null>;
}

