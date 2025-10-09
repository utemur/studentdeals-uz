import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, MailerService, JwtStrategy], // PrismaService temporarily disabled
  controllers: [AuthController],
})
export class AuthModule {}
