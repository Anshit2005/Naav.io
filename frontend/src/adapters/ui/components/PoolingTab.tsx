import { useEffect, useState } from 'react';
import { ApiClient } from '../../../core/ports/ApiClient';
import { AdjustedComplianceBalance } from '../../../core/domain/Compliance';
import { Route } from '../../../core/domain/Route';
import { CreatePoolRequest, CreatePoolResult } from '../../../core/domain/Pooling';

interface PoolingTabProps {
  apiClient: ApiClient;
}

export default function PoolingTab({ apiClient }: PoolingTabProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedShips, setSelectedShips] = useState<string[]>([]);
  const [adjustedCbs, setAdjustedCbs] = useState<Map<string, AdjustedComplianceBalance>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poolResult, setPoolResult] = useState<CreatePoolResult | null>(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  useEffect(() => {
    if (selectedShips.length > 0) {
      loadAdjustedCbs();
    } else {
      setAdjustedCbs(new Map());
    }
  }, [selectedShips, selectedYear]);

  const loadRoutes = async () => {
    try {
      const data = await apiClient.getRoutes();
      setRoutes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load routes');
    }
  };

  const loadAdjustedCbs = async () => {
    try {
      setLoading(true);
      setError(null);
      const cbs = new Map<string, AdjustedComplianceBalance>();

      for (const shipId of selectedShips) {
        try {
          const cb = await apiClient.getAdjustedComplianceBalance(shipId, selectedYear);
          cbs.set(shipId, cb);
        } catch (err) {
          // Try to calculate CB first
          try {
            await apiClient.getComplianceBalance(shipId, selectedYear);
            const cb = await apiClient.getAdjustedComplianceBalance(shipId, selectedYear);
            cbs.set(shipId, cb);
          } catch (e) {
            console.error(`Failed to load CB for ${shipId}:`, e);
          }
        }
      }

      setAdjustedCbs(cbs);
    } catch (err: any) {
      setError(err.message || 'Failed to load adjusted CBs');
    } finally {
      setLoading(false);
    }
  };

  const handleShipToggle = (shipId: string) => {
    if (selectedShips.includes(shipId)) {
      setSelectedShips(selectedShips.filter((id) => id !== shipId));
    } else {
      setSelectedShips([...selectedShips, shipId]);
    }
  };

  const handleCreatePool = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure all CBs are calculated
      for (const shipId of selectedShips) {
        if (!adjustedCbs.has(shipId)) {
          try {
            await apiClient.getComplianceBalance(shipId, selectedYear);
            const cb = await apiClient.getAdjustedComplianceBalance(shipId, selectedYear);
            adjustedCbs.set(shipId, cb);
          } catch (e) {
            throw new Error(`Compliance balance not found for ship ${shipId}. Please calculate CB first.`);
          }
        }
      }

      const request: CreatePoolRequest = {
        year: selectedYear,
        shipIds: selectedShips,
      };

      const result = await apiClient.createPool(request);
      setPoolResult(result);
      await loadAdjustedCbs();
    } catch (err: any) {
      setError(err.message || 'Failed to create pool');
    } finally {
      setLoading(false);
    }
  };

  const poolSum = Array.from(adjustedCbs.values()).reduce(
    (sum, cb) => sum + cb.adjustedCb,
    0
  );
  const isValid = poolSum >= 0 && selectedShips.length > 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Pooling (Article 21)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <h3 className="font-semibold mb-3">Select Ships for Pool</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {routes.map((route) => (
              <label
                key={route.id}
                className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedShips.includes(route.routeId)}
                  onChange={() => handleShipToggle(route.routeId)}
                  className="mr-2"
                />
                <span className="text-sm">{route.routeId}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedShips.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Pool Members</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ship ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CB Before (gCO₂e)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      CB After (gCO₂e)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedShips.map((shipId) => {
                    const cb = adjustedCbs.get(shipId);
                    return (
                      <tr key={shipId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {shipId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {cb ? (
                            <span
                              className={
                                cb.adjustedCb >= 0 ? 'text-green-600' : 'text-red-600'
                              }
                            >
                              {cb.adjustedCb.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400">Loading...</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {poolResult ? (
                            (() => {
                              const member = poolResult.members.find((m) => m.shipId === shipId);
                              return member ? (
                                <span
                                  className={
                                    member.cbAfter >= 0 ? 'text-green-600' : 'text-red-600'
                                  }
                                >
                                  {member.cbAfter.toLocaleString(undefined, {
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              );
                            })()
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {cb ? (
                            cb.adjustedCb >= 0 ? (
                              <span className="text-green-600">Surplus</span>
                            ) : (
                              <span className="text-red-600">Deficit</span>
                            )
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded" style={{ backgroundColor: isValid ? '#d1fae5' : '#fee2e2' }}>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Pool Sum:</span>
                <span
                  className={`font-bold text-lg ${
                    isValid ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {poolSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e
                </span>
              </div>
              {!isValid && (
                <p className="text-sm text-red-700 mt-1">
                  Pool sum must be ≥ 0 to create pool
                </p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleCreatePool}
          disabled={!isValid || loading || selectedShips.length === 0}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Pool...' : 'Create Pool'}
        </button>

        {poolResult && poolResult.valid && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold mb-2">Pool Created Successfully</h4>
            <p className="text-sm text-gray-600">Pool ID: {poolResult.poolId}</p>
            <div className="mt-2 text-sm">
              <p>
                Pool Sum: <strong>{poolResult.poolSum.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

