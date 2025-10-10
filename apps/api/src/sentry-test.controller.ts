import { Controller, Get, Post } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import * as Sentry from '@sentry/nestjs';

@Controller('test-sentry')
@SkipThrottle() // Test endpoints don't need rate limiting
export class SentryTestController {
  @Get('error')
  testError() {
    throw new Error('Test Sentry error - this is intentional!');
  }

  @Get('exception')
  testException() {
    Sentry.captureException(new Error('Test Sentry exception - manually captured'));
    return { message: 'Exception captured in Sentry' };
  }

  @Get('message')
  testMessage() {
    Sentry.captureMessage('Test Sentry message - hello from API!', 'info');
    return { message: 'Message sent to Sentry' };
  }

  @Post('transaction')
  async testTransaction() {
    // Create a custom transaction
    return await Sentry.startSpan(
      {
        op: 'test.transaction',
        name: 'Test Transaction',
      },
      async () => {
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Create a child span
        await Sentry.startSpan(
          {
            op: 'test.child',
            name: 'Test Child Span',
          },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        );

        return { message: 'Transaction traced in Sentry' };
      }
    );
  }

  @Get('breadcrumb')
  testBreadcrumb() {
    Sentry.addBreadcrumb({
      category: 'test',
      message: 'Test breadcrumb added',
      level: 'info',
    });

    Sentry.captureMessage('Test with breadcrumb', 'info');
    return { message: 'Breadcrumb added and message sent' };
  }

  @Get('user-context')
  testUserContext() {
    Sentry.setUser({
      id: 'test-user-123',
      email: 'test@example.com',
      username: 'testuser',
    });

    Sentry.captureMessage('Test with user context', 'info');
    return { message: 'User context set and message sent' };
  }

  @Get('tags')
  testTags() {
    Sentry.setTag('test_tag', 'test_value');
    Sentry.setTag('environment', 'testing');

    Sentry.captureMessage('Test with custom tags', 'info');
    return { message: 'Tags set and message sent' };
  }

  @Get('health')
  health() {
    return {
      sentry: {
        enabled: !!process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      },
    };
  }
}

