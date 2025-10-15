'use client';

import { useEffect, useState } from 'react';
import { Container, Card, CardHeader, CardContent, Button } from '@studentdeals/ui';
import { api } from '@/lib/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  database?: string;
}

interface HealthCheck {
  name: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  timestamp?: string;
}

export default function HealthPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([
    {
      name: 'API Health',
      status: 'loading',
      message: 'Checking API connection...',
    },
    {
      name: 'Database Health',
      status: 'loading',
      message: 'Checking database connection...',
    },
  ]);

  const checkHealth = async () => {
    // Reset all checks to loading
    setChecks(prev => prev.map(check => ({
      ...check,
      status: 'loading' as const,
      message: 'Checking...',
    })));

    // Check API health
    try {
      const healthResponse = await api('/health');
      setChecks(prev => prev.map(check => 
        check.name === 'API Health' 
          ? {
              ...check,
              status: 'success',
              message: `API is healthy (${healthResponse.status})`,
              timestamp: healthResponse.timestamp,
            }
          : check
      ));
    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.name === 'API Health' 
          ? {
              ...check,
              status: 'error',
              message: `API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }
          : check
      ));
    }

    // Check database health
    try {
      const dbResponse = await api('/health/db');
      setChecks(prev => prev.map(check => 
        check.name === 'Database Health' 
          ? {
              ...check,
              status: 'success',
              message: `Database is ${dbResponse.database}`,
              timestamp: dbResponse.timestamp,
            }
          : check
      ));
    } catch (error) {
      setChecks(prev => prev.map(check => 
        check.name === 'Database Health' 
          ? {
              ...check,
              status: 'error',
              message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            }
          : check
      ));
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'loading':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'loading':
        return '⏳';
      default:
        return '❓';
    }
  };

  const allHealthy = checks.every(check => check.status === 'success');
  const hasErrors = checks.some(check => check.status === 'error');

  return (
    <Container className="py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            System Health Check
          </h1>
          <p className="text-lg text-gray-600">
            Monitor the health of StudentDeals.uz services
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {checks.map((check, index) => (
            <Card key={index} className={`border-2 ${getStatusColor(check.status)}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span>{getStatusIcon(check.status)}</span>
                    {check.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    check.status === 'success' ? 'bg-green-100 text-green-800' :
                    check.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {check.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{check.message}</p>
                {check.timestamp && (
                  <p className="text-xs text-gray-500">
                    Last checked: {new Date(check.timestamp).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={checkHealth}
            className="mr-4"
            disabled={checks.some(check => check.status === 'loading')}
          >
            Refresh Health Check
          </Button>
          
          {allHealthy && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                🎉 All systems are operational!
              </p>
            </div>
          )}
          
          {hasErrors && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                ⚠️ Some systems are experiencing issues
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">API Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>API Base URL:</strong>
              <br />
              <code className="text-blue-600">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}
              </code>
            </div>
            <div>
              <strong>Environment:</strong>
              <br />
              <code className="text-blue-600">
                {process.env.NODE_ENV || 'development'}
              </code>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}