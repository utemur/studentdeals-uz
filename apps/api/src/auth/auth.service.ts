import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokens } from './types';

// Temporary in-memory storage for development
const users: Array<{ id: string; email: string; passwordHash: string; emailVerifiedAt: string | null; createdAt: string; updatedAt: string }> = [];

@Injectable()
export class AuthService {
  // constructor(private prisma: PrismaService) {}

  private signAccessToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    return jwt.sign({ sub: userId, email }, secret, { expiresIn: '30m' });
  }

  async register(dto: RegisterDto): Promise<{ id: string; email: string }> {
    const exists = users.find(u => u.email.toLowerCase() === dto.email.toLowerCase());
    if (exists) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = {
      id: `user_${Date.now()}`,
      email: dto.email.toLowerCase(),
      passwordHash,
      emailVerifiedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    users.push(user);
    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = users.find(u => u.email.toLowerCase() === dto.email.toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signAccessToken(user.id, user.email);
    return { accessToken };
  }

  async me(userId: string) {
    const user = users.find(u => u.id === userId);
    if (!user) return null;
    
    return {
      id: user.id,
      email: user.email,
      emailVerifiedAt: user.emailVerifiedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
