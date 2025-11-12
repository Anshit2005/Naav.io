import { BankSurplus } from '../BankSurplus';

describe('BankSurplus', () => {
  let bankSurplus: BankSurplus;

  beforeEach(() => {
    bankSurplus = new BankSurplus();
  });

  it('should create bank entry for positive CB', () => {
    let idCounter = 0;
    const generateId = () => `bank-${++idCounter}`;

    const result = bankSurplus.execute('SHIP001', 2024, 1000, generateId);

    expect(result.shipId).toBe('SHIP001');
    expect(result.year).toBe(2024);
    expect(result.amountGco2eq).toBe(1000);
    expect(result.id).toBe('bank-1');
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error for non-positive CB', () => {
    const generateId = () => 'test-id';

    expect(() => {
      bankSurplus.execute('SHIP001', 2024, 0, generateId);
    }).toThrow('Cannot bank non-positive compliance balance');

    expect(() => {
      bankSurplus.execute('SHIP001', 2024, -100, generateId);
    }).toThrow('Cannot bank non-positive compliance balance');
  });
});

