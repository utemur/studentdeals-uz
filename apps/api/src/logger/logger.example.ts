import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

/**
 * Example service showing how to use Pino logger
 * 
 * Features:
 * - Request-scoped logger with requestId
 * - Structured logging
 * - Automatic sensitive field masking
 * - Context-aware logging
 */

@Injectable()
export class ExampleService {
  constructor(
    @InjectPinoLogger(ExampleService.name)
    private readonly logger: PinoLogger
  ) {}

  /**
   * Basic logging
   */
  basicLogging() {
    this.logger.info('This is an info message');
    this.logger.warn('This is a warning message');
    this.logger.error('This is an error message');
    this.logger.debug('This is a debug message');
  }

  /**
   * Structured logging with context
   */
  structuredLogging(userId: string, action: string) {
    this.logger.info(
      {
        userId,
        action,
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'example-service',
          version: '1.0.0',
        },
      },
      'User performed action'
    );
  }

  /**
   * Logging with sensitive data (will be masked)
   */
  logSensitiveData(email: string, password: string) {
    // Password will be automatically masked
    this.logger.info(
      {
        email,
        password, // Will be redacted as [REDACTED]
      },
      'User login attempt'
    );
  }

  /**
   * Error logging with stack trace
   */
  logError(error: Error) {
    this.logger.error(
      {
        err: error, // Pino will serialize the error
        context: 'payment-processing',
      },
      'Payment processing failed'
    );
  }

  /**
   * Performance logging
   */
  async performanceLogging<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    this.logger.info({ operation }, 'Starting operation');
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      this.logger.info(
        {
          operation,
          duration,
          success: true,
        },
        'Operation completed'
      );
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error(
        {
          operation,
          duration,
          success: false,
          err: error,
        },
        'Operation failed'
      );
      
      throw error;
    }
  }

  /**
   * Child logger with additional context
   */
  childLogger(userId: string) {
    const child = this.logger.logger.child({ userId });
    
    child.info('User logged in');
    child.info('User viewed profile');
    child.info('User logged out');
    
    // All logs will include userId in the context
  }

  /**
   * Logging with business metrics
   */
  logBusinessMetric(metric: string, value: number) {
    this.logger.info(
      {
        metric,
        value,
        type: 'business-metric',
        timestamp: new Date().toISOString(),
      },
      `Business metric: ${metric}`
    );
  }

  /**
   * Logging database queries
   */
  logDatabaseQuery(query: string, duration: number) {
    this.logger.debug(
      {
        query,
        duration,
        type: 'database-query',
      },
      'Database query executed'
    );
  }

  /**
   * Logging external API calls
   */
  logExternalApiCall(
    service: string,
    endpoint: string,
    statusCode: number,
    duration: number
  ) {
    this.logger.info(
      {
        service,
        endpoint,
        statusCode,
        duration,
        type: 'external-api-call',
      },
      `External API call to ${service}`
    );
  }
}

