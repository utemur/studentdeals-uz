import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  async create(
    @Body(ValidationPipe) dto: CreateFeedbackDto,
    @Req() req: Request
  ) {
    const userId = req.user?.['sub'];
    const userAgent = req.headers['user-agent'];

    const feedback = await this.feedbackService.create(dto, userId, userAgent);

    return {
      success: true,
      feedbackId: feedback.id,
      message: 'Thank you for your feedback!',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findMy(@Req() req: Request) {
    const userId = req.user?.['sub'];
    return this.feedbackService.findAll(userId);
  }

  @Get('stats')
  async getStats() {
    return this.feedbackService.getStats();
  }
}

