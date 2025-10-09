'use client';

import { useState, useEffect } from 'react';
import { Container, Card, CardContent, CardHeader } from "@studentdeals/ui";
import { api } from '@/lib/api';

export default function HealthPage() {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        
        // Fetch basic health
        const health = await api('/health');
        setHealthStatus(health);
        
        // Fetch database health
        try {
          const db = await api('/health/db');
          setDbStatus(db);
        } catch (dbErr: any) {
          setDbStatus({ ok: false, error: dbErr.message });
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch health status');
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  if (loading) {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent>
              <p className="text-center py-8">Загрузка...</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent>
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-gray-900">Health Check</h1>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">API Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  healthStatus?.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {healthStatus?.ok ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Database:</span>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  dbStatus?.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {dbStatus?.ok ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Timestamp:</span>
                <span className="text-sm text-gray-600">
                  {new Date().toISOString()}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Response Data:</h3>
                <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto">
                  {JSON.stringify({ health: healthStatus, db: dbStatus }, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
