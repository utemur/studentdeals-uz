import { Controller, Get, Query, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('migrate')
  async runMigrations() {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      console.log('🔄 Running database migrations...');
      const { stdout: migrateOut, stderr: migrateErr } = await execAsync('pnpm prisma migrate deploy', {
        cwd: process.cwd(),
        env: process.env,
      });
      
      console.log('🌱 Running database seeding...');
      const { stdout: seedOut, stderr: seedErr } = await execAsync('pnpm prisma:seed', {
        cwd: process.cwd(),
        env: process.env,
      });
      
      return {
        success: true,
        message: 'Migrations and seeding completed',
        migrateOutput: migrateOut,
        seedOutput: seedOut,
      };
    } catch (error) {
      console.error('⚠️ Migration error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async listUsers(@Query('search') search?: string) {
    if (search) {
      return this.authService.searchUsers(search);
    }
    return this.authService.getAllUsers();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getStats() {
    const users = await this.authService.getAllUsers();
    
    return {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.emailVerifiedAt).length,
      adminUsers: users.filter(u => u.role === 'ADMIN').length,
      regularUsers: users.filter(u => u.role === 'USER').length,
    };
  }
}

