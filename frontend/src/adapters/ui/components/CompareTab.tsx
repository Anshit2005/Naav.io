import { useEffect, useState } from 'react';
import { ApiClient } from '../../../core/ports/ApiClient';
import { RouteComparison } from '../../../core/domain/Route';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompareTabProps {
  apiClient: ApiClient;
}

export default function CompareTab({ apiClient }: CompareTabProps) {
  const [comparisons, setComparisons] = useState<RouteComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getComparison();
      setComparisons(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load comparison');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading comparison data...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">Error: {error}</div>;
  }

  const chartData = comparisons.map((comp) => ({
    routeId: comp.routeId,
    baseline: comp.baseline.ghgIntensity,
    comparison: comp.comparison.ghgIntensity,
    target: 89.3368,
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Route Comparison</h2>
        <p className="text-sm text-gray-600 mb-4">
          Target Intensity: <strong>89.3368 gCO₂e/MJ</strong> (2% below 91.16)
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Baseline GHG (gCO₂e/MJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comparison GHG (gCO₂e/MJ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Compliant
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisons.map((comp) => (
                <tr key={comp.routeId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {comp.routeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comp.baseline.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {comp.comparison.ghgIntensity.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={
                        comp.percentDiff > 0 ? 'text-red-600' : 'text-green-600'
                      }
                    >
                      {comp.percentDiff > 0 ? '+' : ''}
                      {comp.percentDiff.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {comp.compliant ? (
                      <span className="text-green-600 font-semibold">✅ Compliant</span>
                    ) : (
                      <span className="text-red-600 font-semibold">❌ Non-Compliant</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">GHG Intensity Comparison Chart</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="routeId" />
              <YAxis label={{ value: 'GHG Intensity (gCO₂e/MJ)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="baseline" fill="#3b82f6" name="Baseline" />
              <Bar dataKey="comparison" fill="#10b981" name="Comparison" />
              <Bar dataKey="target" fill="#ef4444" name="Target (89.34)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

