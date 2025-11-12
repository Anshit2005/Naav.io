import { BankEntry } from '../../../core/domain/Banking';
import { BankingRepository } from '../../../core/ports/BankingRepository';
import { dbPool } from '../../../infrastructure/db/connection';

export class PostgresBankingRepository implements BankingRepository {
  async save(entry: BankEntry): Promise<void> {
    await dbPool.query(
      `INSERT INTO bank_entries (id, ship_id, year, amount_gco2eq, applied_amount_gco2eq, created_at)
       VALUES ($1, $2, $3, $4, 0, $5)`,
      [
        entry.id,
        entry.shipId,
        entry.year,
        entry.amountGco2eq,
        entry.createdAt,
      ]
    );
  }

  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await dbPool.query(
      'SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at DESC',
      [shipId, year]
    );

    return result.rows.map((row) => ({
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGco2eq: parseFloat(row.amount_gco2eq),
      createdAt: new Date(row.created_at),
    }));
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await dbPool.query(
      `SELECT COALESCE(SUM(amount_gco2eq), 0) as total
       FROM bank_entries
       WHERE ship_id = $1 AND year = $2`,
      [shipId, year]
    );

    return parseFloat(result.rows[0].total || '0');
  }

  async getAvailableBanked(shipId: string, year: number): Promise<number> {
    const result = await dbPool.query(
      `SELECT COALESCE(SUM(amount_gco2eq - applied_amount_gco2eq), 0) as available
       FROM bank_entries
       WHERE ship_id = $1 AND year = $2`,
      [shipId, year]
    );

    return parseFloat(result.rows[0].available || '0');
  }

  async applyBanked(
    shipId: string,
    year: number,
    amount: number
  ): Promise<void> {
    // Apply using FIFO (first in, first out)
    const entries = await this.findByShipAndYear(shipId, year);
    let remaining = amount;

    for (const entry of entries) {
      if (remaining <= 0) break;

      const available = entry.amountGco2eq - (await this.getAppliedAmount(entry.id));
      const toApply = Math.min(remaining, available);

      if (toApply > 0) {
        await dbPool.query(
          `UPDATE bank_entries
           SET applied_amount_gco2eq = applied_amount_gco2eq + $1
           WHERE id = $2`,
          [toApply, entry.id]
        );
        remaining -= toApply;
      }
    }
  }

  private async getAppliedAmount(entryId: string): Promise<number> {
    const result = await dbPool.query(
      'SELECT applied_amount_gco2eq FROM bank_entries WHERE id = $1',
      [entryId]
    );
    return parseFloat(result.rows[0]?.applied_amount_gco2eq || '0');
  }
}

