import { Route, RouteComparison } from '../domain/Route';

const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ

export class CompareRoutes {
  execute(baseline: Route, comparison: Route): RouteComparison {
    const percentDiff = ((comparison.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    const compliant = comparison.ghgIntensity <= TARGET_INTENSITY;

    return {
      routeId: comparison.routeId,
      baseline,
      comparison,
      percentDiff,
      compliant,
    };
  }
}

