import { Route, RouteComparison } from '../domain/Route';
import { ComplianceBalance, AdjustedComplianceBalance } from '../domain/Compliance';
import { BankEntry, BankingResult } from '../domain/Banking';
import { CreatePoolRequest, CreatePoolResult } from '../domain/Pooling';

export interface ApiClient {
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  getComparison(): Promise<RouteComparison[]>;
  getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance>;
  getAdjustedComplianceBalance(shipId: string, year: number): Promise<AdjustedComplianceBalance>;
  getBankingRecords(shipId: string, year: number): Promise<BankEntry[]>;
  bankSurplus(shipId: string, year: number, amount?: number): Promise<BankEntry>;
  applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult>;
  createPool(request: CreatePoolRequest): Promise<CreatePoolResult>;
}

