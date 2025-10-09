'use client';

import { useState, useEffect } from 'react';
import { Container, Card, CardContent, CardHeader } from "@studentdeals/ui";
import { api } from '@/lib/api';

interface HealthCheck {
  name: string;
  url: string;
  status: 'pending' | 'success' | 'error';
  ok: boolean;
  responseTime: number | null;
  error?: string;
  data?: any;
}

export default function HealthPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    { name: 'API Health', url: '/health', status: 'pending', ok: false, responseTime: null },
    { name: 'Database', url: '/health/db', status: 'pending', ok: false, responseTime: null },
    { name: 'Frontend Edge', url: '/api/hello', status: 'pending', ok: false, responseTime: null },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      setLoading(true);
      const newChecks = [...checks];

      // 1. Check API Health
      try {
        const start = performance.now();
        const health = await api('/health');
        const responseTime = Math.round(performance.now() - start);
        newChecks[0] = {
          ...newChecks[0],
          status: 'success',
          ok: health.ok === true,
          responseTime,
          data: health,
        };
      } catch (err: any) {
        newChecks[0] = {
          ...newChecks[0],
          status: 'error',
          ok: false,
          responseTime: null,
          error: err.message,
        };
      }

      // 2. Check Database
      try {
        const start = performance.now();
        const db = await api('/health/db');
        const responseTime = Math.round(performance.now() - start);
        newChecks[1] = {
          ...newChecks[1],
          status: 'success',
          ok: db.ok === true,
          responseTime,
          data: db,
        };
      } catch (err: any) {
        newChecks[1] = {
          ...newChecks[1],
          status: 'error',
          ok: false,
          responseTime: null,
          error: err.message,
        };
      }

      // 3. Check Frontend Edge Route
      try {
        const start = performance.now();
        const response = await fetch('/api/hello');
        const responseTime = Math.round(performance.now() - start);
        const data = await response.json();
        newChecks[2] = {
          ...newChecks[2],
          status: 'success',
          ok: response.ok && data.ok === true,
          responseTime,
          data,
        };
      } catch (err: any) {
        newChecks[2] = {
          ...newChecks[2],
          status: 'error',
          ok: false,
          responseTime: null,
          error: err.message,
        };
      }

      setChecks(newChecks);
      setLoading(false);
    };

    fetchHealth();
  }, []);

  const allHealthy = checks.every(check => check.ok);

  if (loading) {
    return (
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent>
              <p className="text-center py-8">Проверка статуса...</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Health Check</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                allHealthy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {allHealthy ? '✓ All Systems Operational' : '✗ Some Issues Detected'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {checks.map((check, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-3 w-3 rounded-full ${
                            check.ok ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{check.name}</div>
                            <div className="text-xs text-gray-500">{check.url}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          check.ok 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {check.ok ? 'Healthy' : 'Error'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {check.responseTime !== null ? (
                          <span className={`font-mono ${
                            check.responseTime < 100 ? 'text-green-600' :
                            check.responseTime < 500 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {check.responseTime}ms
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {check.error ? (
                          <span className="text-red-600 text-xs">{check.error}</span>
                        ) : check.data ? (
                          <details className="cursor-pointer">
                            <summary className="text-blue-600 hover:text-blue-800 text-xs">
                              View Response
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-w-md">
                              {JSON.stringify(check.data, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Last checked: {new Date().toLocaleString('ru-RU')}</span>
                <button
                  onClick={() => window.location.reload()}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
