import { Injectable, BadRequestException, UnauthorizedException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthTokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  private signAccessToken(userId: string, email: string, role: string): string {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    return jwt.sign({ sub: userId, email, role }, secret, { expiresIn: '30m' });
  }

  private generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async register(dto: RegisterDto): Promise<{ id: string; email: string }> {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (exists) throw new BadRequestException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        role: 'USER',
        emailVerifiedAt: null,
        telegramVerifiedAt: null, // Will be set by Telegram bot
      },
    });

    // Generate verification token
    const token = this.generateVerificationToken();
    const tokenTtlHours = Number(process.env.EMAIL_TOKEN_TTL_HOURS) || 24;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + tokenTtlHours);

    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        usedAt: null,
      },
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
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // Check if user has completed Telegram bot registration
    // Users can only log in if telegramVerifiedAt is set (not null)
    if (!user.telegramVerifiedAt) {
      throw new ForbiddenException({
        error: 'TELEGRAM_REGISTRATION_REQUIRED',
        message: 'Registration via Telegram bot is required before login',
      });
    }

    const accessToken = this.signAccessToken(user.id, user.email, user.role);
    return { accessToken };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
        telegramVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return null;
    
    return user;
  }

  // Get all users (admin only)
  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
        telegramVerifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Search users by email (admin only)
  async searchUsers(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.prisma.user.findMany({
      where: {
        email: {
          contains: lowerQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerifiedAt: true,
        telegramVerifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const verificationToken = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new NotFoundException('Invalid verification token');
    }

    if (verificationToken.usedAt) {
      throw new BadRequestException('Token already used');
    }

    const now = new Date();
    if (now > verificationToken.expiresAt) {
      throw new BadRequestException('Token expired');
    }

    // Mark token as used and update user email verification
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: now },
      }),
      this.prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerifiedAt: now },
      }),
    ]);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }
}
