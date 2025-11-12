import { Route } from '../../../core/domain/Route';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { dbPool } from '../../../infrastructure/db/connection';

export class PostgresRouteRepository implements RouteRepository {
  async findAll(): Promise<Route[]> {
    const result = await dbPool.query(
      'SELECT * FROM routes ORDER BY year, route_id'
    );
    return result.rows.map(this.mapRowToRoute);
  }

  async findById(id: string): Promise<Route | null> {
    const result = await dbPool.query('SELECT * FROM routes WHERE id = $1', [id]);
    return result.rows.length > 0 ? this.mapRowToRoute(result.rows[0]) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await dbPool.query('SELECT * FROM routes WHERE route_id = $1', [
      routeId,
    ]);
    return result.rows.length > 0 ? this.mapRowToRoute(result.rows[0]) : null;
  }

  async updateBaseline(routeId: string, isBaseline: boolean): Promise<void> {
    // First, unset all baselines for the same year
    const route = await this.findByRouteId(routeId);
    if (!route) {
      throw new Error(`Route ${routeId} not found`);
    }

    await dbPool.query(
      'UPDATE routes SET is_baseline = FALSE WHERE year = $1',
      [route.year]
    );

    // Then set the new baseline
    await dbPool.query(
      'UPDATE routes SET is_baseline = $1 WHERE route_id = $2',
      [isBaseline, routeId]
    );
  }

  async findBaseline(): Promise<Route | null> {
    const result = await dbPool.query(
      'SELECT * FROM routes WHERE is_baseline = TRUE LIMIT 1'
    );
    return result.rows.length > 0 ? this.mapRowToRoute(result.rows[0]) : null;
  }

  private mapRowToRoute(row: any): Route {
    return {
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline,
    };
  }
}

