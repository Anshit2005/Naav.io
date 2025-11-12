import { Route } from '../domain/Route';

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  findById(id: string): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  updateBaseline(routeId: string, isBaseline: boolean): Promise<void>;
  findBaseline(): Promise<Route | null>;
}

