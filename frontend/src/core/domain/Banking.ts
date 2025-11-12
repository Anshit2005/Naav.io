export interface BankEntry {
  id: string;
  shipId: string;
  year: number;
  amountGco2eq: number;
  createdAt: string;
}

export interface BankingResult {
  cbBefore: number;
  applied: number;
  cbAfter: number;
}

