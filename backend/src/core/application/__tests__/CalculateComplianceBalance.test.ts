import { CalculateComplianceBalance } from '../CalculateComplianceBalance';

describe('CalculateComplianceBalance', () => {
  let calculateCB: CalculateComplianceBalance;

  beforeEach(() => {
    calculateCB = new CalculateComplianceBalance();
  });

  it('should calculate positive CB for vessel below target intensity', () => {
    const result = calculateCB.execute('SHIP001', 2024, 85.0, 5000);
    
    expect(result.shipId).toBe('SHIP001');
    expect(result.year).toBe(2024);
    expect(result.actualIntensity).toBe(85.0);
    expect(result.targetIntensity).toBe(89.3368);
    expect(result.energyInScope).toBe(205000000); // 5000 * 41000
    expect(result.cbGco2eq).toBeGreaterThan(0); // Positive CB (surplus)
  });

  it('should calculate negative CB for vessel above target intensity', () => {
    const result = calculateCB.execute('SHIP002', 2024, 95.0, 5000);
    
    expect(result.cbGco2eq).toBeLessThan(0); // Negative CB (deficit)
  });

  it('should calculate zero CB when actual equals target', () => {
    const result = calculateCB.execute('SHIP003', 2024, 89.3368, 5000);
    
    expect(result.cbGco2eq).toBeCloseTo(0, 2);
  });

  it('should calculate correct energy in scope', () => {
    const result = calculateCB.execute('SHIP004', 2024, 90.0, 1000);
    
    expect(result.energyInScope).toBe(41000000); // 1000 * 41000
  });
});

