import { Request, Response } from 'express';
import { PoolRepository } from '../../../core/ports/PoolRepository';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { CreatePool } from '../../../core/application/CreatePool';
import { CreatePoolRequest } from '../../../core/domain/Pooling';
import { v4 as uuidv4 } from 'uuid';

export class PoolingController {
  constructor(
    private poolRepository: PoolRepository,
    private complianceRepository: ComplianceRepository,
    private createPool: CreatePool
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const request: CreatePoolRequest = req.body;

      if (!request.year || !request.shipIds || request.shipIds.length === 0) {
        res.status(400).json({ error: 'year and shipIds are required' });
        return;
      }

      // Get adjusted CBs for all ships
      const memberCbs = new Map<string, number>();
      for (const shipId of request.shipIds) {
        const adjustedCb = await this.complianceRepository.findAdjustedByShipAndYear(
          shipId,
          request.year
        );

        if (!adjustedCb) {
          // Calculate if not exists
          res.status(404).json({
            error: `Compliance balance not found for ship ${shipId}`,
          });
          return;
        }

        memberCbs.set(shipId, adjustedCb.adjustedCb);
      }

      // Create pool
      const result = this.createPool.execute(request, memberCbs, () => uuidv4());

      if (!result.valid) {
        res.status(400).json({
          error: 'Pool is invalid: sum of CBs must be >= 0 and exit conditions must be met',
          poolSum: result.poolSum,
        });
        return;
      }

      // Save pool and members
      await this.poolRepository.save({
        id: result.poolId,
        year: request.year,
        createdAt: new Date(),
      });
      await this.poolRepository.saveMembers(result.members);

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create pool' });
    }
  }
}

