import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard, ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  async create(
    @Body(ValidationPipe) dto: CreateFeedbackDto,
    @Req() req: Request
  ) {
    const userId = (req.user as any)?.sub;
    const userAgent = req.headers['user-agent'];
    const page = req.headers['referer'] || 'unknown';

    const feedback = await this.feedbackService.create(dto, userId, userAgent, page);

    return {
      success: true,
      feedbackId: feedback.id,
      message: 'Thank you for your feedback!',
    };
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async findMy(@Req() req: Request) {
    const userId = (req.user as any)?.sub;
    if (!userId) {
      return [];
    }
    return this.feedbackService.findAll(userId);
  }

  @Get('stats')
  async getStats() {
    return this.feedbackService.getStats();
  }
}

