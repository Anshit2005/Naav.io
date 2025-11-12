import { BankEntry } from '../domain/Banking';

export interface BankingRepository {
  save(entry: BankEntry): Promise<void>;
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
  getAvailableBanked(shipId: string, year: number): Promise<number>;
  applyBanked(shipId: string, year: number, amount: number): Promise<void>;
}

