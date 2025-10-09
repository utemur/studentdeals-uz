import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
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
    // Temporarily return mock response until DB connection is fixed
    return { ok: true, db: 'mock', message: 'DB connection pending' };
  }
}
