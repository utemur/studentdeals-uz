import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokens } from './types';

// Temporary in-memory storage for development
const users: Array<{ id: string; email: string; passwordHash: string; emailVerifiedAt: string | null; createdAt: string; updatedAt: string }> = [];
const verificationTokens: Array<{ id: string; userId: string; token: string; expiresAt: string; usedAt: string | null }> = [];

@Injectable()
export class AuthService {
  constructor(private mailerService: MailerService) {}

  private signAccessToken(userId: string, email: string): string {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    return jwt.sign({ sub: userId, email }, secret, { expiresIn: '30m' });
  }

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
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

    // Generate verification token
    const token = this.generateVerificationToken();
    const tokenTtlHours = Number(process.env.EMAIL_TOKEN_TTL_HOURS) || 24;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + tokenTtlHours);

    verificationTokens.push({
      id: `token_${Date.now()}`,
      userId: user.id,
      token,
      expiresAt: expiresAt.toISOString(),
      usedAt: null,
    });

    // Send verification email via Resend
    try {
      await this.mailerService.sendVerificationEmail(user.email, token);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Don't fail registration if email fails
    }

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

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const verificationToken = verificationTokens.find(t => t.token === token);

    if (!verificationToken) {
      throw new NotFoundException('Invalid verification token');
    }

    if (verificationToken.usedAt) {
      throw new BadRequestException('Token already used');
    }

    const now = new Date();
    const expiresAt = new Date(verificationToken.expiresAt);

    if (now > expiresAt) {
      throw new BadRequestException('Token expired');
    }

    // Mark token as used
    verificationToken.usedAt = now.toISOString();

    // Update user email verification
    const user = users.find(u => u.id === verificationToken.userId);
    if (user) {
      user.emailVerifiedAt = now.toISOString();
      user.updatedAt = now.toISOString();
    }

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }
}
