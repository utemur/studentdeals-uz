import { Controller, Get, Post, Body, Headers, HttpStatus, HttpException } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

interface BetterStackWebhook {
  request_id: string;
  monitor_id: string;
  monitor_name: string;
  monitor_url: string;
  status: 'up' | 'down' | 'paused';
  started_at?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  cause?: string;
  ssl_expiry_date?: string;
}

@Controller('monitoring')
export class MonitoringController {
  constructor(
    @InjectPinoLogger(MonitoringController.name)
    private readonly logger: PinoLogger
  ) {}

  /**
   * Health check endpoint for Better Stack uptime monitoring
   * This endpoint is called by Better Stack to check if the API is up
   */
  @Get('health')
  healthCheck() {
    this.logger.info('Better Stack health check called');
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'studentdeals-api',
      uptime: process.uptime(),
    };
  }

  /**
   * Webhook endpoint to receive Better Stack alerts
   * Configured in Better Stack dashboard: https://betterstack.com/uptime
   * 
   * Endpoint URL: https://api.studentdeals.uz/monitoring/webhook
   * Method: POST
   * Headers: Content-Type: application/json
   */
  @Post('webhook')
  async handleWebhook(
    @Body() payload: BetterStackWebhook,
    @Headers('x-betterstack-signature') signature?: string
  ) {
    // Verify signature (optional, for security)
    const expectedSignature = process.env.BETTERSTACK_WEBHOOK_SECRET;
    if (expectedSignature && signature !== expectedSignature) {
      this.logger.warn(
        { signature, expected: expectedSignature },
        'Invalid Better Stack webhook signature'
      );
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    // Log the webhook payload
    this.logger.info(
      {
        requestId: payload.request_id,
        monitorId: payload.monitor_id,
        monitorName: payload.monitor_name,
        monitorUrl: payload.monitor_url,
        status: payload.status,
        cause: payload.cause,
      },
      `Better Stack alert: ${payload.monitor_name} is ${payload.status}`
    );

    // Handle different statuses
    switch (payload.status) {
      case 'down':
        this.logger.error(
          {
            monitor: payload.monitor_name,
            url: payload.monitor_url,
            cause: payload.cause,
            startedAt: payload.started_at,
          },
          'Monitor is DOWN'
        );
        // TODO: Send Slack/Email notification
        // TODO: Trigger Sentry alert
        break;

      case 'up':
        this.logger.info(
          {
            monitor: payload.monitor_name,
            url: payload.monitor_url,
            resolvedAt: payload.resolved_at,
          },
          'Monitor is UP (recovered)'
        );
        // TODO: Send recovery notification
        break;

      case 'paused':
        this.logger.info(
          {
            monitor: payload.monitor_name,
            url: payload.monitor_url,
          },
          'Monitor is PAUSED'
        );
        break;
    }

    return {
      success: true,
      message: 'Webhook received',
      requestId: payload.request_id,
    };
  }

  /**
   * Get monitoring status
   * Returns current monitoring configuration
   */
  @Get('status')
  getStatus() {
    return {
      monitoring: {
        provider: 'Better Stack',
        endpoints: [
          {
            name: 'API Health',
            url: '/health',
            checkInterval: '1 minute',
          },
          {
            name: 'Auth Health',
            url: '/auth/me',
            checkInterval: '5 minutes',
          },
          {
            name: 'Database Health',
            url: '/health/db',
            checkInterval: '5 minutes',
          },
        ],
        webhookUrl: process.env.API_URL + '/monitoring/webhook',
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}

