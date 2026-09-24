import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Review,
  ReviewSchema,
} from './schemas/review.schema.js';
import {
  ReviewResponse,
  ReviewResponseSchema,
} from './schemas/review-response.schema.js';
import {
  ReviewHelpful,
  ReviewHelpfulSchema,
} from './schemas/review-helpful.schema.js';
import {
  Order,
  OrderSchema,
} from '../orders/schemas/order.schema.js';

import { ReviewsController } from './reviews.controller.js';
import { ReviewsService } from './reviews.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: ReviewResponse.name, schema: ReviewResponseSchema },
      { name: ReviewHelpful.name, schema: ReviewHelpfulSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
