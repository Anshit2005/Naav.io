import { Request, Response } from 'express';
import { BankingRepository } from '../../../core/ports/BankingRepository';
import { ComplianceRepository } from '../../../core/ports/ComplianceRepository';
import { BankSurplus } from '../../../core/application/BankSurplus';
import { ApplyBanked } from '../../../core/application/ApplyBanked';
import { v4 as uuidv4 } from 'uuid';

export class BankingController {
  constructor(
    private bankingRepository: BankingRepository,
    private complianceRepository: ComplianceRepository,
    private bankSurplus: BankSurplus,
    private applyBanked: ApplyBanked
  ) {}

  async getRecords(req: Request, res: Response): Promise<void> {
    try {
      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string);

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      const records = await this.bankingRepository.findByShipAndYear(shipId, year);
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch records' });
    }
  }

  async bank(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year) {
        res.status(400).json({ error: 'shipId and year are required' });
        return;
      }

      // Get current CB
      const cb = await this.complianceRepository.findByShipAndYear(shipId, year);
      if (!cb) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      if (cb.cbGco2eq <= 0) {
        res.status(400).json({ error: 'Cannot bank non-positive compliance balance' });
        return;
      }

      const bankAmount = amount || cb.cbGco2eq;
      const entry = this.bankSurplus.execute(shipId, year, bankAmount, () => uuidv4());
      await this.bankingRepository.save(entry);

      res.json(entry);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to bank surplus' });
    }
  }

  async apply(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(400).json({ error: 'shipId, year, and amount are required' });
        return;
      }

      // Get current CB
      const cb = await this.complianceRepository.findByShipAndYear(shipId, year);
      if (!cb) {
        res.status(404).json({ error: 'Compliance balance not found' });
        return;
      }

      // Get available banked
      const availableBanked = await this.bankingRepository.getAvailableBanked(
        shipId,
        year
      );

      // Apply banked
      const result = this.applyBanked.execute(cb.cbGco2eq, availableBanked, amount);

      // Update applied amounts in database
      await this.bankingRepository.applyBanked(shipId, year, amount);

      // Update CB
      const updatedCb = { ...cb, cbGco2eq: result.cbAfter };
      await this.complianceRepository.save(updatedCb);

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to apply banked' });
    }
  }
}

