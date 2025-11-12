import { Request, Response } from 'express';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { CalculateComplianceBalance } from '../../../core/application/CalculateComplianceBalance';

export class ComplianceController {
  constructor(
    private complianceRepository: ComplianceRepository,
    private routeRepository: RouteRepository,
    private calculateCB: CalculateComplianceBalance
  ) {}

  async getComplianceBalance(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      // Find route for this ship (using routeId as shipId for simplicity)
      const route = await this.routeRepository.findByRouteId(shipId);
      if (!route) {
        res.status(404).json({ error: 'Route not found' });
        return;
      }

      // Calculate CB
      const cb = this.calculateCB.execute(
        shipId,
        year,
        route.ghgIntensity,
        route.fuelConsumption
      );

      // Save to database
      await this.complianceRepository.save(cb);

      res.json(cb);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to calculate CB' });
    }
  }

  async getAdjustedComplianceBalance(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const adjustedCb = await this.complianceRepository.findAdjustedByShipAndYear(
        shipId,
        year
      );

      if (!adjustedCb) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      res.json(adjustedCb);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch adjusted CB' });
    }
  }
}

