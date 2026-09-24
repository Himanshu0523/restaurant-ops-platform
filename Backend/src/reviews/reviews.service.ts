import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Review,
  ReviewDocument,
} from './schemas/review.schema.js';
import {
  ReviewResponse,
  ReviewResponseDocument,
} from './schemas/review-response.schema.js';
import {
  ReviewHelpful,
  ReviewHelpfulDocument,
} from './schemas/review-helpful.schema.js';
import {
  Order,
  OrderDocument,
} from '../orders/schemas/order.schema.js';

import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto.js';
import { CreateReviewResponseDto } from './dto/create-review-response.dto.js';
import { MarkReviewHelpfulDto } from './dto/mark-review-helpful.dto.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';

import {
  ReviewStatus,
  ReviewTargetType,
} from './review.types.js';
import { REVIEW_EDIT_WINDOW_DAYS } from './constants/review.constants.js';
import { OrderStatus } from '../orders/order.types.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    @InjectModel(ReviewResponse.name)
    private readonly reviewResponseModel: Model<ReviewResponseDocument>,
    @InjectModel(ReviewHelpful.name)
    private readonly reviewHelpfulModel: Model<ReviewHelpfulDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createReview(
    tenantId: string,
    customerId: string,
    orderId: string,
    dto: CreateReviewDto,
  ): Promise<Review> {
    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      tenantId: new Types.ObjectId(tenantId),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.customerId && order.customerId.toString() !== customerId) {
      throw new ForbiddenException('You can only review your own orders');
    }

    if (order.status !== OrderStatus.COMPLETED) {
      throw new BadRequestException(
        'Reviews can only be submitted for completed orders',
      );
    }

    if (dto.targetType === ReviewTargetType.MENU_ITEM) {
      if (!dto.menuItemId) {
        throw new BadRequestException(
          'menuItemId is required when targetType is MENU_ITEM',
        );
      }
      const itemInOrder = order.items?.some(
        (item) => item.menuItemId?.toString() === dto.menuItemId,
      );
      if (!itemInOrder) {
        throw new BadRequestException(
          'The specified menu item was not part of this order',
        );
      }
    }

    // Check duplicate review
    const existingQuery: Record<string, any> = {
      tenantId: new Types.ObjectId(tenantId),
      customerId: new Types.ObjectId(customerId),
      orderId: new Types.ObjectId(orderId),
      targetType: dto.targetType,
      status: { $ne: ReviewStatus.DELETED },
    };

    if (dto.targetType === ReviewTargetType.MENU_ITEM && dto.menuItemId) {
      existingQuery.menuItemId = new Types.ObjectId(dto.menuItemId);
    }

    const existing = await this.reviewModel.findOne(existingQuery);
    if (existing) {
      throw new ConflictException(
        'You have already submitted a review for this order/item',
      );
    }

    const review = new this.reviewModel({
      tenantId: new Types.ObjectId(tenantId),
      customerId: new Types.ObjectId(customerId),
      orderId: new Types.ObjectId(orderId),
      restaurantId: order.restaurantId,
      branchId: order.branchId,
      menuItemId: dto.menuItemId ? new Types.ObjectId(dto.menuItemId) : undefined,
      targetType: dto.targetType,
      ratings: {
        overall: dto.overall,
        food: dto.food,
        service: dto.service,
        ambience: dto.ambience,
        value: dto.value,
        delivery: dto.delivery,
      },
      title: dto.title,
      comment: dto.comment,
      imageUrls: dto.imageUrls || [],
      tags: dto.tags || [],
      status: ReviewStatus.PUBLISHED,
      verifiedPurchase: true,
      publishedAt: new Date(),
    });

    return review.save();
  }

  async updateReview(
    tenantId: string,
    customerId: string,
    reviewId: string,
    dto: UpdateReviewDto,
  ): Promise<Review> {
    const review = await this.reviewModel.findOne({
      _id: new Types.ObjectId(reviewId),
      tenantId: new Types.ObjectId(tenantId),
      customerId: new Types.ObjectId(customerId),
      status: { $ne: ReviewStatus.DELETED },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const createdAt = (review as any).createdAt || new Date();
    const now = new Date();
    const diffDays =
      (now.getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24);

    if (diffDays > REVIEW_EDIT_WINDOW_DAYS) {
      throw new BadRequestException(
        `Reviews can only be edited within ${REVIEW_EDIT_WINDOW_DAYS} days of creation`,
      );
    }

    if (dto.overall !== undefined) review.ratings.overall = dto.overall;
    if (dto.food !== undefined) review.ratings.food = dto.food;
    if (dto.service !== undefined) review.ratings.service = dto.service;
    if (dto.ambience !== undefined) review.ratings.ambience = dto.ambience;
    if (dto.value !== undefined) review.ratings.value = dto.value;
    if (dto.delivery !== undefined) review.ratings.delivery = dto.delivery;

    if (dto.title !== undefined) review.title = dto.title;
    if (dto.comment !== undefined) review.comment = dto.comment;
    if (dto.imageUrls !== undefined) review.imageUrls = dto.imageUrls;
    if (dto.tags !== undefined) review.tags = dto.tags;

    return review.save();
  }

  async deleteReview(
    tenantId: string,
    customerId: string,
    reviewId: string,
  ): Promise<Review> {
    const review = await this.reviewModel.findOne({
      _id: new Types.ObjectId(reviewId),
      tenantId: new Types.ObjectId(tenantId),
      customerId: new Types.ObjectId(customerId),
      status: { $ne: ReviewStatus.DELETED },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.status = ReviewStatus.DELETED;
    review.deletedAt = new Date();
    return review.save();
  }

  async findAll(tenantId: string, query: ReviewQueryDto) {
    const {
      targetType,
      status,
      branchId,
      menuItemId,
      rating,
      search,
      page = 1,
      limit = 10,
    } = query;

    const filter: Record<string, any> = {
      tenantId: new Types.ObjectId(tenantId),
      status: status || ReviewStatus.PUBLISHED,
    };

    if (targetType) filter.targetType = targetType;
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    if (menuItemId) filter.menuItemId = new Types.ObjectId(menuItemId);
    if (rating) filter['ratings.overall'] = rating;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { comment: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.reviewModel.countDocuments(filter).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(tenantId: string, reviewId: string) {
    const review = await this.reviewModel
      .findOne({
        _id: new Types.ObjectId(reviewId),
        tenantId: new Types.ObjectId(tenantId),
      })
      .lean()
      .exec();

    if (!review || review.status === ReviewStatus.DELETED) {
      throw new NotFoundException('Review not found');
    }

    const response = await this.reviewResponseModel
      .findOne({
        reviewId: new Types.ObjectId(reviewId),
        isVisible: true,
      })
      .lean()
      .exec();

    return {
      ...review,
      ownerResponse: response || null,
    };
  }

  async updateStatus(
    tenantId: string,
    reviewId: string,
    dto: UpdateReviewStatusDto,
  ): Promise<Review> {
    const review = await this.reviewModel.findOne({
      _id: new Types.ObjectId(reviewId),
      tenantId: new Types.ObjectId(tenantId),
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.status = dto.status;
    if (dto.reason) review.moderationReason = dto.reason;

    if (dto.status === ReviewStatus.PUBLISHED) {
      review.publishedAt = new Date();
    } else if (dto.status === ReviewStatus.HIDDEN) {
      review.hiddenAt = new Date();
    }

    return review.save();
  }

  async addResponse(
    tenantId: string,
    reviewId: string,
    authorId: string,
    dto: CreateReviewResponseDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewModel.findOne({
      _id: new Types.ObjectId(reviewId),
      tenantId: new Types.ObjectId(tenantId),
      status: { $ne: ReviewStatus.DELETED },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    let response = await this.reviewResponseModel.findOne({
      reviewId: new Types.ObjectId(reviewId),
    });

    if (response) {
      response.authorId = new Types.ObjectId(authorId);
      response.message = dto.message;
      response.isVisible = true;
      response.deletedAt = undefined;
    } else {
      response = new this.reviewResponseModel({
        reviewId: new Types.ObjectId(reviewId),
        authorId: new Types.ObjectId(authorId),
        message: dto.message,
        isVisible: true,
      });
    }

    return response.save();
  }

  async deleteResponse(
    tenantId: string,
    reviewId: string,
  ): Promise<ReviewResponse> {
    const response = await this.reviewResponseModel.findOne({
      reviewId: new Types.ObjectId(reviewId),
    });

    if (!response) {
      throw new NotFoundException('Review response not found');
    }

    response.isVisible = false;
    response.deletedAt = new Date();
    return response.save();
  }

  async markHelpful(
    tenantId: string,
    userId: string,
    reviewId: string,
    dto: MarkReviewHelpfulDto,
  ) {
    const review = await this.reviewModel.findOne({
      _id: new Types.ObjectId(reviewId),
      tenantId: new Types.ObjectId(tenantId),
      status: { $ne: ReviewStatus.DELETED },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const existingVote = await this.reviewHelpfulModel.findOne({
      reviewId: new Types.ObjectId(reviewId),
      userId: new Types.ObjectId(userId),
    });

    if (existingVote) {
      if (existingVote.helpful !== dto.helpful) {
        existingVote.helpful = dto.helpful;
        await existingVote.save();

        const delta = dto.helpful ? 1 : -1;
        review.helpfulCount = Math.max(0, (review.helpfulCount || 0) + delta);
        await review.save();
      }
    } else {
      await this.reviewHelpfulModel.create({
        reviewId: new Types.ObjectId(reviewId),
        userId: new Types.ObjectId(userId),
        helpful: dto.helpful,
      });

      if (dto.helpful) {
        review.helpfulCount = (review.helpfulCount || 0) + 1;
        await review.save();
      }
    }

    return {
      reviewId,
      helpfulCount: review.helpfulCount,
      userHelpful: dto.helpful,
    };
  }

  async getRatingSummary(
    tenantId: string,
    targetType?: ReviewTargetType,
    branchId?: string,
    menuItemId?: string,
  ) {
    const filter: Record<string, any> = {
      tenantId: new Types.ObjectId(tenantId),
      status: ReviewStatus.PUBLISHED,
    };

    if (targetType) filter.targetType = targetType;
    if (branchId) filter.branchId = new Types.ObjectId(branchId);
    if (menuItemId) filter.menuItemId = new Types.ObjectId(menuItemId);

    const stats = await this.reviewModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          avgOverall: { $avg: '$ratings.overall' },
          avgFood: { $avg: '$ratings.food' },
          avgService: { $avg: '$ratings.service' },
          avgAmbience: { $avg: '$ratings.ambience' },
          avgValue: { $avg: '$ratings.value' },
          avgDelivery: { $avg: '$ratings.delivery' },
          rating1: {
            $sum: { $cond: [{ $eq: ['$ratings.overall', 1] }, 1, 0] },
          },
          rating2: {
            $sum: { $cond: [{ $eq: ['$ratings.overall', 2] }, 1, 0] },
          },
          rating3: {
            $sum: { $cond: [{ $eq: ['$ratings.overall', 3] }, 1, 0] },
          },
          rating4: {
            $sum: { $cond: [{ $eq: ['$ratings.overall', 4] }, 1, 0] },
          },
          rating5: {
            $sum: { $cond: [{ $eq: ['$ratings.overall', 5] }, 1, 0] },
          },
        },
      },
    ]);

    if (!stats.length) {
      return {
        totalReviews: 0,
        averageRatings: {
          overall: 0,
          food: 0,
          service: 0,
          ambience: 0,
          value: 0,
          delivery: 0,
        },
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const s = stats[0];
    return {
      totalReviews: s.totalReviews,
      averageRatings: {
        overall: Number(s.avgOverall?.toFixed(2) || 0),
        food: Number(s.avgFood?.toFixed(2) || 0),
        service: Number(s.avgService?.toFixed(2) || 0),
        ambience: Number(s.avgAmbience?.toFixed(2) || 0),
        value: Number(s.avgValue?.toFixed(2) || 0),
        delivery: Number(s.avgDelivery?.toFixed(2) || 0),
      },
      distribution: {
        1: s.rating1,
        2: s.rating2,
        3: s.rating3,
        4: s.rating4,
        5: s.rating5,
      },
    };
  }
}
