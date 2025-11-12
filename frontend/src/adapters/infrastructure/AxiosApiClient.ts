import axios from 'axios';
import { ApiClient } from '../../core/ports/ApiClient';
import { Route, RouteComparison } from '../../core/domain/Route';
import { ComplianceBalance, AdjustedComplianceBalance } from '../../core/domain/Compliance';
import { BankEntry, BankingResult } from '../../core/domain/Banking';
import { CreatePoolRequest, CreatePoolResult } from '../../core/domain/Pooling';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export class AxiosApiClient implements ApiClient {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getRoutes(): Promise<Route[]> {
    const response = await this.client.get<Route[]>('/routes');
    return response.data;
  }

  async setBaseline(routeId: string): Promise<void> {
    await this.client.post(`/routes/${routeId}/baseline`);
  }

  async getComparison(): Promise<RouteComparison[]> {
    const response = await this.client.get<RouteComparison[]>('/routes/comparison');
    return response.data;
  }

  async getComplianceBalance(shipId: string, year: number): Promise<ComplianceBalance> {
    const response = await this.client.get<ComplianceBalance>('/compliance/cb', {
      params: { shipId, year },
    });
    return response.data;
  }

  async getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance> {
    const response = await this.client.get<AdjustedComplianceBalance>(
      '/compliance/adjusted-cb',
      {
        params: { shipId, year },
      }
    );
    return response.data;
  }

  async getBankingRecords(shipId: string, year: number): Promise<BankEntry[]> {
    const response = await this.client.get<BankEntry[]>('/banking/records', {
      params: { shipId, year },
    });
    return response.data;
  }

  async bankSurplus(shipId: string, year: number, amount?: number): Promise<BankEntry> {
    const response = await this.client.post<BankEntry>('/banking/bank', {
      shipId,
      year,
      amount,
    });
    return response.data;
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankingResult> {
    const response = await this.client.post<BankingResult>('/banking/apply', {
      shipId,
      year,
      amount,
    });
    return response.data;
  }

  async createPool(request: CreatePoolRequest): Promise<CreatePoolResult> {
    const response = await this.client.post<CreatePoolResult>('/pools', request);
    return response.data;
  }
}

