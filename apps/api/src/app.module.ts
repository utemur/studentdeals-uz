import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { SentryTestController } from './sentry-test.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SentryModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 seconds = 1 minute
      limit: 100, // 100 requests per minute per IP
    }]),
    AuthModule,
  ],
  controllers: [
    HealthController,
    // Only enable Sentry test controller in non-production
    ...(process.env.NODE_ENV !== 'production' ? [SentryTestController] : []),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
