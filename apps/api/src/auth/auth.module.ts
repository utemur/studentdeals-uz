import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { PrismaService } from '../prisma.service';
import { EmailService } from '../email.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, EmailService, JwtStrategy], // PrismaService temporarily disabled
  controllers: [AuthController],
})
export class AuthModule {}
