import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ReviewsService } from './reviews.service.js';

import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto.js';
import { CreateReviewResponseDto } from './dto/create-review-response.dto.js';
import { MarkReviewHelpfulDto } from './dto/mark-review-helpful.dto.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';

import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard.js';
import { TenantGuard } from '../common/guards/tenant/tenant.guard.js';
import { TenantId } from '../common/decorators/tenant/tenant.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ReviewTargetType } from './review.types.js';

@Controller()
@UseGuards(JwtAuthGuard, TenantGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('orders/:orderId/reviews')
  async createReview(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
    @Body() dto: CreateReviewDto,
  ) {
    const customerId = user.sub || user.id || user._id;
    return this.reviewsService.createReview(
      tenantId,
      customerId,
      orderId,
      dto,
    );
  }

  @Patch('reviews/:reviewId')
  async updateReview(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const customerId = user.sub || user.id || user._id;
    return this.reviewsService.updateReview(
      tenantId,
      customerId,
      reviewId,
      dto,
    );
  }

  @Delete('reviews/:reviewId')
  async deleteReview(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string,
  ) {
    const customerId = user.sub || user.id || user._id;
    return this.reviewsService.deleteReview(tenantId, customerId, reviewId);
  }

  @Get('reviews')
  async findAll(
    @TenantId() tenantId: string,
    @Query() query: ReviewQueryDto,
  ) {
    return this.reviewsService.findAll(tenantId, query);
  }

  @Get('reviews/summary')
  async getRatingSummary(
    @TenantId() tenantId: string,
    @Query('targetType') targetType?: ReviewTargetType,
    @Query('branchId') branchId?: string,
    @Query('menuItemId') menuItemId?: string,
  ) {
    return this.reviewsService.getRatingSummary(
      tenantId,
      targetType,
      branchId,
      menuItemId,
    );
  }

  @Get('reviews/:reviewId')
  async findOne(
    @TenantId() tenantId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.findOne(tenantId, reviewId);
  }

  @Patch('reviews/:reviewId/status')
  async updateStatus(
    @TenantId() tenantId: string,
    @Param('reviewId') reviewId: string,
    @Body() dto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateStatus(tenantId, reviewId, dto);
  }

  @Post('reviews/:reviewId/response')
  async addResponse(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string,
    @Body() dto: CreateReviewResponseDto,
  ) {
    const authorId = user.sub || user.id || user._id;
    return this.reviewsService.addResponse(
      tenantId,
      reviewId,
      authorId,
      dto,
    );
  }

  @Delete('reviews/:reviewId/response')
  async deleteResponse(
    @TenantId() tenantId: string,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewsService.deleteResponse(tenantId, reviewId);
  }

  @Post('reviews/:reviewId/helpful')
  async markHelpful(
    @TenantId() tenantId: string,
    @CurrentUser() user: any,
    @Param('reviewId') reviewId: string,
    @Body() dto: MarkReviewHelpfulDto,
  ) {
    const userId = user.sub || user.id || user._id;
    return this.reviewsService.markHelpful(tenantId, userId, reviewId, dto);
  }
}
