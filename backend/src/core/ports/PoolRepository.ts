import { Pool, PoolMember } from '../domain/Pooling';

export interface PoolRepository {
  save(pool: Pool): Promise<void>;
  saveMembers(members: PoolMember[]): Promise<void>;
  findById(poolId: string): Promise<Pool | null>;
  findByYear(year: number): Promise<Pool[]>;
}

