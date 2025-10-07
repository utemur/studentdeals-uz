import { Controller, Get } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Controller()
export class HealthController {
  private prisma = new PrismaClient();

  @Get('/')
  root() {
    return { ok: true, service: 'api' };
  }

  @Get('/health')
  health() {
    return { ok: true };
  }

  @Get('/health/db')
  async healthDb() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { ok: true, db: 'up' };
  }
}
