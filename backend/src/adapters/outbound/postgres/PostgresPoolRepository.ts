import { Pool, PoolMember } from '../../../core/domain/Pooling';
import { PoolRepository } from '../../../core/ports/PoolRepository';
import { dbPool } from '../../../infrastructure/db/connection';

export class PostgresPoolRepository implements PoolRepository {
  async save(pool: Pool): Promise<void> {
    await dbPool.query(
      `INSERT INTO pools (id, year, created_at)
       VALUES ($1, $2, $3)`,
      [pool.id, pool.year, pool.createdAt]
    );
  }

  async saveMembers(members: PoolMember[]): Promise<void> {
    for (const member of members) {
      await dbPool.query(
        `INSERT INTO pool_members (id, pool_id, ship_id, cb_before, cb_after)
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4)`,
        [member.poolId, member.shipId, member.cbBefore, member.cbAfter]
      );
    }
  }

  async findById(poolId: string): Promise<Pool | null> {
    const result = await dbPool.query('SELECT * FROM pools WHERE id = $1', [
      poolId,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      year: row.year,
      createdAt: new Date(row.created_at),
    };
  }

  async findByYear(year: number): Promise<Pool[]> {
    const result = await dbPool.query('SELECT * FROM pools WHERE year = $1', [
      year,
    ]);

    return result.rows.map((row) => ({
      id: row.id,
      year: row.year,
      createdAt: new Date(row.created_at),
    }));
  }
}

