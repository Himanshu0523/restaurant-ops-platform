import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import {
  ReviewSource,
  ReviewStatus,
  ReviewTargetType,
  ReviewVisibility,
} from '../review.types.js';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ _id: false })
export class ReviewRatings {
  @Prop({ min: 1, max: 5 })
  overall: number;

  @Prop({ min: 1, max: 5 })
  food?: number;

  @Prop({ min: 1, max: 5 })
  service?: number;

  @Prop({ min: 1, max: 5 })
  ambience?: number;

  @Prop({ min: 1, max: 5 })
  value?: number;

  @Prop({ min: 1, max: 5 })
  delivery?: number;
}

@Schema({
  timestamps: true,
  collection: 'reviews',
})
export class Review {
  @Prop({
    type: Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  })
  tenantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  customerId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  })
  orderId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    index: true,
  })
  restaurantId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Branch',
    index: true,
  })
  branchId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'MenuItem',
    index: true,
  })
  menuItemId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    index: true,
  })
  deliveryId?: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(ReviewTargetType),
  })
  targetType: ReviewTargetType;

  @Prop({
    required: true,
    type: ReviewRatings,
  })
  ratings: ReviewRatings;

  @Prop({
    trim: true,
    maxlength: 3000,
  })
  title?: string;

  @Prop({
    trim: true,
    maxlength: 3000,
  })
  comment?: string;

  @Prop({
    type: [String],
    default: [],
  })
  imageUrls: string[];

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    enum: Object.values(ReviewStatus),
    default: ReviewStatus.PENDING,
    index: true,
  })
  status: ReviewStatus;

  @Prop({
    enum: Object.values(ReviewVisibility),
    default: ReviewVisibility.PUBLIC,
  })
  visibility: ReviewVisibility;

  @Prop({
    enum: Object.values(ReviewSource),
    default: ReviewSource.CUSTOMER_APP,
  })
  source: ReviewSource;

  @Prop({
    default: 0,
  })
  helpfulCount: number;

  @Prop({
    default: false,
  })
  verifiedPurchase: boolean;

  @Prop()
  publishedAt?: Date;

  @Prop()
  hiddenAt?: Date;

  @Prop()
  deletedAt?: Date;

  @Prop()
  moderationReason?: string;
}

export const ReviewSchema =
  SchemaFactory.createForClass(Review);

ReviewSchema.index({
  restaurantId: 1,
  status: 1,
  createdAt: -1,
});

ReviewSchema.index({
  branchId: 1,
  status: 1,
  createdAt: -1,
});

ReviewSchema.index({
  menuItemId: 1,
  status: 1,
  createdAt: -1,
});

ReviewSchema.index({
  customerId: 1,
  createdAt: -1,
});

ReviewSchema.index({
  orderId: 1,
  customerId: 1,
});

ReviewSchema.index({
  targetType: 1,
  status: 1,
  'ratings.overall': 1,
});

// Prevent duplicate restaurant reviews per order
ReviewSchema.index(
  {
    customerId: 1,
    orderId: 1,
    restaurantId: 1,
    targetType: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      restaurantId: { $exists: true },
      targetType: ReviewTargetType.RESTAURANT,
    },
  },
);

// Prevent duplicate menu-item reviews per order
ReviewSchema.index(
  {
    customerId: 1,
    orderId: 1,
    menuItemId: 1,
    targetType: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      menuItemId: { $exists: true },
      targetType: ReviewTargetType.MENU_ITEM,
    },
  },
);
