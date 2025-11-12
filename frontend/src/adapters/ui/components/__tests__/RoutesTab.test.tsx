import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RoutesTab from '../RoutesTab';
import { ApiClient } from '../../../../core/ports/ApiClient';
import { Route } from '../../../../core/domain/Route';

describe('RoutesTab', () => {
  const mockApiClient: ApiClient = {
    getRoutes: vi.fn(),
    setBaseline: vi.fn(),
    getComparison: vi.fn(),
    getComplianceBalance: vi.fn(),
    getAdjustedComplianceBalance: vi.fn(),
    getBankingRecords: vi.fn(),
    bankSurplus: vi.fn(),
    applyBanked: vi.fn(),
    createPool: vi.fn(),
  };

  it('should render routes tab', async () => {
    const mockRoutes: Route[] = [
      {
        id: '1',
        routeId: 'R001',
        vesselType: 'Container',
        fuelType: 'HFO',
        year: 2024,
        ghgIntensity: 91.0,
        fuelConsumption: 5000,
        distance: 12000,
        totalEmissions: 4500,
        isBaseline: true,
      },
    ];

    vi.mocked(mockApiClient.getRoutes).mockResolvedValue(mockRoutes);

    render(<RoutesTab apiClient={mockApiClient} />);

    // Wait for routes to load
    expect(await screen.findByText('R001')).toBeInTheDocument();
    // Check for Container in the table (not in the filter dropdown)
    const table = screen.getByRole('table');
    expect(table).toHaveTextContent('Container');
  });
});

