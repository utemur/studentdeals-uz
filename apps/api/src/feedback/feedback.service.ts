import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { PrismaService } from '../prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectPinoLogger(FeedbackService.name)
    private readonly logger: PinoLogger
  ) {}

  async create(
    dto: CreateFeedbackDto,
    userId?: string,
    userAgent?: string,
    page?: string
  ) {
    this.logger.info(
      {
        userId,
        email: dto.email,
        rating: dto.rating,
        hasMessage: !!dto.message,
        page,
      },
      'Creating feedback'
    );

    const feedback = await this.prisma.feedback.create({
      data: {
        rating: dto.rating,
        message: dto.message,
        email: dto.email,
        page,
        userAgent,
        userId,
      },
    });

    this.logger.info(
      {
        feedbackId: feedback.id,
        userId,
        rating: dto.rating,
      },
      'Feedback created successfully'
    );

    return feedback;
  }

  async findAll(userId?: string) {
    return this.prisma.feedback.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getStats() {
    const [total, avgRating, ratingDistribution] = await Promise.all([
      this.prisma.feedback.count(),
      this.prisma.feedback.aggregate({
        _avg: {
          rating: true,
        },
      }),
      this.prisma.feedback.groupBy({
        by: ['rating'],
        _count: {
          rating: true,
        },
      }),
    ]);

    return {
      total,
      averageRating: avgRating._avg.rating || 0,
      distribution: ratingDistribution.reduce((acc, item) => {
        if (item.rating !== null) {
          acc[item.rating] = item._count.rating;
        }
        return acc;
      }, {} as Record<number, number>),
    };
  }
}

