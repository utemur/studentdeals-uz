import { Controller, Post, Body, Logger } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
  url: string;
  timestamp: number;
}

@Controller('metrics')
@SkipThrottle() // Metrics endpoints don't need rate limiting
export class MetricsController {
  private readonly logger = new Logger(MetricsController.name);

  @Post()
  async receiveMetric(@Body() metric: WebVitalMetric) {
    // Log metric in development
    if (process.env.NODE_ENV === 'development') {
      this.logger.log(`📊 Web Vital: ${metric.name} = ${metric.value}ms (${metric.rating})`);
    }

    // In production, you would:
    // 1. Store in database
    // 2. Send to analytics service
    // 3. Aggregate for dashboards
    // 4. Alert on poor metrics

    // For now, just acknowledge receipt
    return {
      received: true,
      metric: metric.name,
      timestamp: Date.now(),
    };
  }
}

