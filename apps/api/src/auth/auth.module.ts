import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { PrismaService } from '../prisma.service';
import { MailerService } from '../mailer.service';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [EmailModule],
  providers: [AuthService, MailerService, JwtStrategy], // PrismaService temporarily disabled
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
