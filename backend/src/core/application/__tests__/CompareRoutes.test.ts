import { CompareRoutes } from '../CompareRoutes';
import { Route } from '../../domain/Route';

describe('CompareRoutes', () => {
  let compareRoutes: CompareRoutes;

  beforeEach(() => {
    compareRoutes = new CompareRoutes();
  });

  const createRoute = (routeId: string, ghgIntensity: number, year: number = 2024): Route => ({
    id: `id-${routeId}`,
    routeId,
    vesselType: 'Container',
    fuelType: 'HFO',
    year,
    ghgIntensity,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: false,
  });

  it('should calculate percentage difference correctly', () => {
    const baseline = createRoute('R001', 91.0);
    const comparison = createRoute('R002', 88.0);

    const result = compareRoutes.execute(baseline, comparison);

    expect(result.percentDiff).toBeCloseTo(-3.3, 1); // (88/91 - 1) * 100
  });

  it('should mark route as compliant when below target', () => {
    const baseline = createRoute('R001', 91.0);
    const comparison = createRoute('R002', 85.0); // Below 89.3368

    const result = compareRoutes.execute(baseline, comparison);

    expect(result.compliant).toBe(true);
  });

  it('should mark route as non-compliant when above target', () => {
    const baseline = createRoute('R001', 91.0);
    const comparison = createRoute('R002', 95.0); // Above 89.3368

    const result = compareRoutes.execute(baseline, comparison);

    expect(result.compliant).toBe(false);
  });

  it('should include baseline and comparison routes in result', () => {
    const baseline = createRoute('R001', 91.0);
    const comparison = createRoute('R002', 88.0);

    const result = compareRoutes.execute(baseline, comparison);

    expect(result.baseline).toEqual(baseline);
    expect(result.comparison).toEqual(comparison);
    expect(result.routeId).toBe('R002');
  });
});

