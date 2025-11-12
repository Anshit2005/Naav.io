import { useEffect, useState } from 'react';
import { ApiClient } from '../../../core/ports/ApiClient';
import { ComplianceBalance } from '../../../core/domain/Compliance';
import { BankEntry, BankingResult } from '../../../core/domain/Banking';

interface BankingTabProps {
  apiClient: ApiClient;
}

export default function BankingTab({ apiClient }: BankingTabProps) {
  const [shipId, setShipId] = useState('R001');
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<ComplianceBalance | null>(null);
  const [records, setRecords] = useState<BankEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applyAmount, setApplyAmount] = useState('');
  const [bankResult, setBankResult] = useState<BankingResult | null>(null);

  useEffect(() => {
    loadData();
  }, [shipId, year]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cbData, recordsData] = await Promise.all([
        apiClient.getComplianceBalance(shipId, year).catch(() => null),
        apiClient.getBankingRecords(shipId, year).catch(() => []),
      ]);
      setCb(cbData);
      setRecords(recordsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBank = async () => {
    try {
      setError(null);
      await apiClient.bankSurplus(shipId, year);
      await loadData();
      alert('Surplus banked successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to bank surplus');
    }
  };

  const handleApply = async () => {
    try {
      setError(null);
      const amount = parseFloat(applyAmount);
      if (isNaN(amount) || amount <= 0) {
        setError('Please enter a valid positive amount');
        return;
      }
      const result = await apiClient.applyBanked(shipId, year, amount);
      setBankResult(result);
      setApplyAmount('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to apply banked amount');
    }
  };

  const totalBanked = records.reduce((sum, r) => sum + r.amountGco2eq, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Banking (Article 20)</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ship ID (Route ID)
            </label>
            <input
              type="text"
              value={shipId}
              onChange={(e) => setShipId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="R001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {loading && <div className="text-center py-4">Loading...</div>}

        {cb && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Current Compliance Balance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">CB (gCO₂e):</span>
                <span
                  className={`ml-2 font-semibold ${
                    cb.cbGco2eq >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {cb.cbGco2eq.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Target Intensity:</span>
                <span className="ml-2 font-semibold">{cb.targetIntensity.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Actual Intensity:</span>
                <span className="ml-2 font-semibold">{cb.actualIntensity.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Energy in Scope (MJ):</span>
                <span className="ml-2 font-semibold">
                  {cb.energyInScope.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Bank Surplus</h3>
            <p className="text-sm text-gray-600 mb-3">
              Bank positive compliance balance for future use.
            </p>
            <button
              onClick={handleBank}
              disabled={!cb || cb.cbGco2eq <= 0 || loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Bank Surplus
            </button>
            {cb && cb.cbGco2eq <= 0 && (
              <p className="text-xs text-red-600 mt-2">
                Cannot bank: CB is not positive
              </p>
            )}
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Apply Banked</h3>
            <p className="text-sm text-gray-600 mb-3">
              Apply banked surplus to current deficit.
            </p>
            <div className="flex gap-2">
              <input
                type="number"
                value={applyAmount}
                onChange={(e) => setApplyAmount(e.target.value)}
                placeholder="Amount to apply"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              />
              <button
                onClick={handleApply}
                disabled={loading || !applyAmount}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {bankResult && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-semibold mb-2">Application Result</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">CB Before:</span>
                <span className="ml-2 font-semibold">
                  {bankResult.cbBefore.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Applied:</span>
                <span className="ml-2 font-semibold">
                  {bankResult.applied.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-600">CB After:</span>
                <span className="ml-2 font-semibold">
                  {bankResult.cbAfter.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        )}

        {records.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Banking Records</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Amount Banked (gCO₂e)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.amountGco2eq.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Total Banked: <strong>{totalBanked.toLocaleString(undefined, { maximumFractionDigits: 2 })} gCO₂e</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

