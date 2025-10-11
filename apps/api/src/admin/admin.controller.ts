import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  async listUsers(@Query('search') search?: string) {
    if (search) {
      return this.authService.searchUsers(search);
    }
    return this.authService.getAllUsers();
  }

  @Get('stats')
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

