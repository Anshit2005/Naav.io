import { CreatePool } from '../CreatePool';
import { CreatePoolRequest } from '../../domain/Pooling';

describe('CreatePool', () => {
  let createPool: CreatePool;

  beforeEach(() => {
    createPool = new CreatePool();
  });

  it('should create valid pool when sum is positive', () => {
    let idCounter = 0;
    const generateId = () => `pool-${++idCounter}`;

    const request: CreatePoolRequest = {
      year: 2024,
      shipIds: ['SHIP1', 'SHIP2'],
    };

    const memberCbs = new Map<string, number>();
    memberCbs.set('SHIP1', 1000); // Surplus
    memberCbs.set('SHIP2', -500); // Deficit

    const result = createPool.execute(request, memberCbs, generateId);

    expect(result.valid).toBe(true);
    expect(result.poolSum).toBe(500);
    expect(result.members).toHaveLength(2);
    expect(result.members[0].cbBefore).toBe(1000);
    expect(result.members[1].cbBefore).toBe(-500);
  });

  it('should reject pool when sum is negative', () => {
    const generateId = () => 'pool-1';

    const request: CreatePoolRequest = {
      year: 2024,
      shipIds: ['SHIP1', 'SHIP2'],
    };

    const memberCbs = new Map<string, number>();
    memberCbs.set('SHIP1', -1000); // Deficit
    memberCbs.set('SHIP2', -500); // Deficit

    const result = createPool.execute(request, memberCbs, generateId);

    expect(result.valid).toBe(false);
    expect(result.poolSum).toBe(-1500);
  });

  it('should allocate surplus to deficits correctly', () => {
    let idCounter = 0;
    const generateId = () => `pool-${++idCounter}`;

    const request: CreatePoolRequest = {
      year: 2024,
      shipIds: ['SHIP1', 'SHIP2', 'SHIP3'],
    };

    const memberCbs = new Map<string, number>();
    memberCbs.set('SHIP1', 1000); // Surplus
    memberCbs.set('SHIP2', -500); // Deficit
    memberCbs.set('SHIP3', -300); // Deficit

    const result = createPool.execute(request, memberCbs, generateId);

    expect(result.valid).toBe(true);
    // SHIP1 should transfer 500 to SHIP2 and 300 to SHIP3
    const ship1 = result.members.find((m) => m.shipId === 'SHIP1');
    const ship2 = result.members.find((m) => m.shipId === 'SHIP2');
    const ship3 = result.members.find((m) => m.shipId === 'SHIP3');

    expect(ship1?.cbAfter).toBe(200); // 1000 - 500 - 300
    expect(ship2?.cbAfter).toBe(0); // -500 + 500
    expect(ship3?.cbAfter).toBe(0); // -300 + 300
  });
});

