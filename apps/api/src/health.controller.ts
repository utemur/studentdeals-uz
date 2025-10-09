import { Controller, Get, Header } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

const API_VERSION = require('../package.json').version;

@Controller()
@SkipThrottle() // Health endpoints don't need rate limiting
export class HealthController {
  @Get('/')
  @Header('X-API-Version', API_VERSION)
  root() {
    return { ok: true, service: 'api', version: API_VERSION };
  }

  @Get('/health')
  @Header('X-API-Version', API_VERSION)
  health() {
    return { ok: true };
  }

  @Get('/health/db')
  @Header('X-API-Version', API_VERSION)
  async healthDb() {
    // Temporarily return mock response until DB connection is fixed
    return { ok: true, db: 'mock', message: 'DB connection pending' };
  }
}
