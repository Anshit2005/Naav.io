import { Route } from '../Route';

describe('Route Domain Model', () => {
  it('should create a valid route object', () => {
    const route: Route = {
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
    };

    expect(route.routeId).toBe('R001');
    expect(route.vesselType).toBe('Container');
    expect(route.ghgIntensity).toBe(91.0);
    expect(route.isBaseline).toBe(true);
  });
});

