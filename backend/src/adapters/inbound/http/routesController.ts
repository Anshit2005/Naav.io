import { Request, Response } from 'express';
import { RouteRepository } from '../../../core/ports/RouteRepository';
import { CompareRoutes } from '../../../core/application/CompareRoutes';

export class RoutesController {
  constructor(
    private routeRepository: RouteRepository,
    private compareRoutes: CompareRoutes
  ) {}

  async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const routes = await this.routeRepository.findAll();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch routes' });
    }
  }

  async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;
      await this.routeRepository.updateBaseline(routeId, true);
      res.json({ message: 'Baseline set successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to set baseline' });
    }
  }

  async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const baseline = await this.routeRepository.findBaseline();
      if (!baseline) {
        res.status(404).json({ error: 'No baseline route found' });
        return;
      }

      const allRoutes = await this.routeRepository.findAll();
      const comparisons = allRoutes
        .filter((route) => route.id !== baseline.id)
        .map((route) => this.compareRoutes.execute(baseline, route));

      res.json(comparisons);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch comparison' });
    }
  }
}

