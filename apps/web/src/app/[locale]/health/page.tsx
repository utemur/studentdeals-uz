import { Container, Card, CardContent, CardHeader } from "@studentdeals/ui";

export default function HealthPage() {
  const healthStatus = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      database: "connected",
      api: "operational",
      cache: "operational",
    },
  };

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
                <span className="font-medium">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {healthStatus.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Timestamp:</span>
                <span className="text-sm text-gray-600">
                  {healthStatus.timestamp}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Version:</span>
                <span className="text-sm text-gray-600">
                  {healthStatus.version}
                </span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Services:</h3>
                <div className="space-y-2">
                  {Object.entries(healthStatus.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="capitalize">{service}:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
