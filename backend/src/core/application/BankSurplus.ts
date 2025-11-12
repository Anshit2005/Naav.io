import { BankEntry } from '../domain/Banking';

export class BankSurplus {
  execute(
    shipId: string,
    year: number,
    cbAmount: number, // Positive CB to bank
    generateId: () => string
  ): BankEntry {
    if (cbAmount <= 0) {
      throw new Error('Cannot bank non-positive compliance balance');
    }

    return {
      id: generateId(),
      shipId,
      year,
      amountGco2eq: cbAmount,
      createdAt: new Date(),
    };
  }
}

