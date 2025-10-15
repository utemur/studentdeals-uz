import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
// import { PrismaService } from '../prisma.service'; // Temporarily disabled

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService], // PrismaService temporarily disabled
  exports: [FeedbackService],
})
export class FeedbackModule {}

