import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'production' 
        ? ['error', 'warn']
        : ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // Add Sentry middleware for Prisma query tracing
    // @ts-ignore - $use is available but not in types
    this.$use(async (params: any, next: any) => {
      const span = Sentry.startInactiveSpan({
        op: 'db.query',
        name: `${params.model}.${params.action}`,
        attributes: {
          'db.system': 'postgresql',
          'db.operation': params.action,
          'db.name': params.model,
        },
      });

      try {
        const result = await next(params);
        span?.end();
        return result;
      } catch (error) {
        span?.end();
        // Capture error in Sentry
        Sentry.captureException(error, {
          tags: {
            prisma_model: params.model,
            prisma_action: params.action,
          },
        });
        throw error;
      }
    });

    // Log slow queries in development
    if (process.env.NODE_ENV !== 'production') {
      // @ts-ignore - $use is available but not in types
      this.$use(async (params: any, next: any) => {
        const before = Date.now();
        const result = await next(params);
        const after = Date.now();
        const duration = after - before;

        // Log queries that take more than 100ms
        if (duration > 100) {
          console.warn(
            `⚠️  Slow query detected: ${params.model}.${params.action} took ${duration}ms`
          );
        }

        return result;
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
