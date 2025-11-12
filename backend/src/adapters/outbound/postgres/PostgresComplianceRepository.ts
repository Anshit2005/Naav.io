import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from '../../../core/domain/Compliance';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { dbPool } from '../../../infrastructure/db/connection';

export class PostgresComplianceRepository implements ComplianceRepository {
  async save(cb: ComplianceBalance): Promise<void> {
    await dbPool.query(
      `INSERT INTO ship_compliance (id, ship_id, year, cb_gco2eq, target_intensity, actual_intensity, energy_in_scope)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
       ON CONFLICT (ship_id, year) 
       DO UPDATE SET 
         cb_gco2eq = EXCLUDED.cb_gco2eq,
         target_intensity = EXCLUDED.target_intensity,
         actual_intensity = EXCLUDED.actual_intensity,
         energy_in_scope = EXCLUDED.energy_in_scope`,
      [
        cb.shipId,
        cb.year,
        cb.cbGco2eq,
        cb.targetIntensity,
        cb.actualIntensity,
        cb.energyInScope,
      ]
    );
  }

  async findByShipAndYear(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance | null> {
    const result = await dbPool.query(
      'SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2',
      [shipId, year]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: parseFloat(row.cb_gco2eq),
      targetIntensity: parseFloat(row.target_intensity),
      actualIntensity: parseFloat(row.actual_intensity),
      energyInScope: parseFloat(row.energy_in_scope),
    };
  }

  async findAdjustedByShipAndYear(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance | null> {
    const baseCb = await this.findByShipAndYear(shipId, year);
    if (!baseCb) {
      return null;
    }

    // Calculate applied banking
    const appliedResult = await dbPool.query(
      `SELECT COALESCE(SUM(applied_amount_gco2eq), 0) as applied
       FROM bank_entries
       WHERE ship_id = $1 AND year = $2`,
      [shipId, year]
    );

    const applied = parseFloat(appliedResult.rows[0].applied || '0');
    const adjustedCb = baseCb.cbGco2eq + applied;

    return {
      ...baseCb,
      adjustedCb,
    };
  }
}

