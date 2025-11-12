export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number; // Amount banked (gCO₂e)
  createdAt: Date;
}

export interface BankingOperation {
  shipId: string;
  year: number;
  amount: number;
}

export interface BankingResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

