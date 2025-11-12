import { BankingResult } from '../domain/Banking';

export class ApplyBanked {
  execute(
    currentCb: number,
    availableBanked: number,
    amountToApply: number
  ): BankingResult {
    if (amountToApply <= 0) {
      throw new Error('Amount to apply must be positive');
    }

    if (amountToApply > availableBanked) {
      throw new Error('Cannot apply more than available banked amount');
    }

    const cbBefore = currentCb;
    const applied = amountToApply;
    const cbAfter = cbBefore + applied;

    return {
      cbBefore,
      applied,
      cbAfter,
    };
  }
}

