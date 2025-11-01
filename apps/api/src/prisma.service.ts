import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Prisma } from '@prisma/client';
import * as Sentry from '@sentry/nestjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private extendedClient: any;

  constructor(private configService: ConfigService) {
    super({
      log: configService.get('NODE_ENV') === 'production' 
        ? ['error', 'warn']
        : ['query', 'error', 'warn'],
    });
  }

  async onModuleInit() {
    // Run migrations in production automatically
    if (this.configService.get('NODE_ENV') === 'production') {
      console.log('🔄 Running database migrations...');
      try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        await execAsync('pnpm prisma migrate deploy', {
          cwd: process.cwd(),
          env: process.env,
        });
        console.log('✅ Database migrations completed');
      } catch (error) {
        console.error('⚠️ Migration error (might be already applied):', error);
      }
      
      // Run seed after migrations to populate brands and categories
      console.log('🌱 Running database seeding...');
      try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);
        
        await execAsync('pnpm prisma:seed', {
          cwd: process.cwd(),
          env: process.env,
        });
        console.log('✅ Database seeding completed');
      } catch (error) {
        console.error('⚠️ Seeding error:', error);
      }
    }
    
    await this.$connect();

    // Create Sentry extension for query tracing
    const sentryExt = Prisma.defineExtension({
      query: {
        $allModels: {
          $allOperations({ args, query, model, operation }) {
            const span = Sentry.startInactiveSpan({
              op: 'db.query',
              name: `${model}.${operation}`,
              attributes: {
                'db.system': 'sqlite',
                'db.operation': operation,
                'db.name': model,
              },
            });

            try {
              const result = query(args);
              span?.end();
              return result;
            } catch (error) {
              span?.end();
              // Capture error in Sentry
              Sentry.captureException(error, {
                tags: {
                  prisma_model: model,
                  prisma_action: operation,
                },
              });
              throw error;
            }
          },
        },
      },
    });

    // Create logging extension for development
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const logExt = Prisma.defineExtension({
      query: {
        $allModels: {
          $allOperations({ args, query, model, operation }) {
            const start = Date.now();
            return query(args).finally(() => {
              if (!isProduction) {
                const duration = Date.now() - start;
                if (duration > 100) {
                  console.warn(
                    `⚠️  Slow query detected: ${model}.${operation} took ${duration}ms`
                  );
                }
                console.log(`[PRISMA] ${model}.${operation} in ${duration}ms`);
              }
            });
          },
        },
      },
    });

    // Apply extensions
    this.extendedClient = this.$extends(sentryExt).$extends(logExt);

    // Forward all methods to the extended client
    Object.assign(this, this.extendedClient);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
