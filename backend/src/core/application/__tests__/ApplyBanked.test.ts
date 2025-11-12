import { ApplyBanked } from '../ApplyBanked';

describe('ApplyBanked', () => {
  let applyBanked: ApplyBanked;

  beforeEach(() => {
    applyBanked = new ApplyBanked();
  });

  it('should apply banked amount to current CB', () => {
    const result = applyBanked.execute(-500, 1000, 300);

    expect(result.cbBefore).toBe(-500);
    expect(result.applied).toBe(300);
    expect(result.cbAfter).toBe(-200); // -500 + 300
  });

  it('should throw error when amount exceeds available banked', () => {
    expect(() => {
      applyBanked.execute(-500, 1000, 1500);
    }).toThrow('Cannot apply more than available banked amount');
  });

  it('should throw error for non-positive amount', () => {
    expect(() => {
      applyBanked.execute(-500, 1000, 0);
    }).toThrow('Amount to apply must be positive');

    expect(() => {
      applyBanked.execute(-500, 1000, -100);
    }).toThrow('Amount to apply must be positive');
  });

  it('should handle full application of banked amount', () => {
    const result = applyBanked.execute(-500, 1000, 1000);

    expect(result.applied).toBe(1000);
    expect(result.cbAfter).toBe(500);
  });
});

