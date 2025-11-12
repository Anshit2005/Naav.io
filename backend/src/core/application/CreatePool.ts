import { PoolMember, CreatePoolRequest, CreatePoolResult } from '../domain/Pooling';

export class CreatePool {
  execute(
    request: CreatePoolRequest,
    memberCbs: Map<string, number>, // shipId -> CB
    generateId: () => string
  ): CreatePoolResult {
    // Calculate pool sum
    const poolSum = Array.from(memberCbs.values()).reduce((sum, cb) => sum + cb, 0);

    if (poolSum < 0) {
      return {
        poolId: '',
        members: [],
        poolSum,
        valid: false,
      };
    }

    // Greedy allocation: sort by CB descending (surplus first)
    const sortedMembers = Array.from(memberCbs.entries())
      .map(([shipId, cb]) => ({ shipId, cb }))
      .sort((a, b) => b.cb - a.cb);

    const members: PoolMember[] = [];
    const deficits: Array<{ shipId: string; deficit: number }> = [];
    const surpluses: Array<{ shipId: string; surplus: number }> = [];

    // Separate deficits and surpluses
    sortedMembers.forEach(({ shipId, cb }) => {
      if (cb < 0) {
        deficits.push({ shipId, deficit: -cb });
      } else if (cb > 0) {
        surpluses.push({ shipId, surplus: cb });
      }
    });

    // Track final CBs
    const finalCbs = new Map(memberCbs);

    // Allocate surpluses to deficits
    let surplusIndex = 0;
    for (const deficit of deficits) {
      while (deficit.deficit > 0 && surplusIndex < surpluses.length) {
        const surplus = surpluses[surplusIndex];
        const transfer = Math.min(deficit.deficit, surplus.surplus);

        finalCbs.set(deficit.shipId, finalCbs.get(deficit.shipId)! + transfer);
        finalCbs.set(surplus.shipId, finalCbs.get(surplus.shipId)! - transfer);

        deficit.deficit -= transfer;
        surplus.surplus -= transfer;

        if (surplus.surplus === 0) {
          surplusIndex++;
        }
      }
    }

    // Validate exit conditions
    let valid = true;
    for (const [shipId, originalCb] of memberCbs.entries()) {
      const finalCb = finalCbs.get(shipId)!;

      // Deficit ship cannot exit worse
      if (originalCb < 0 && finalCb < originalCb) {
        valid = false;
        break;
      }

      // Surplus ship cannot exit negative
      if (originalCb > 0 && finalCb < 0) {
        valid = false;
        break;
      }
    }

    if (!valid) {
      return {
        poolId: '',
        members: [],
        poolSum,
        valid: false,
      };
    }

    // Create members list
    const poolId = generateId();
    for (const [shipId, originalCb] of memberCbs.entries()) {
      members.push({
        poolId,
        shipId,
        cbBefore: originalCb,
        cbAfter: finalCbs.get(shipId)!,
      });
    }

    return {
      poolId,
      members,
      poolSum,
      valid: true,
    };
  }
}

