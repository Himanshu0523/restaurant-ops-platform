import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewHelpfulDocument =
  HydratedDocument<ReviewHelpful>;

@Schema({
  timestamps: true,
  collection: 'review_helpful',
})
export class ReviewHelpful {
  @Prop({
    type: Types.ObjectId,
    ref: 'Review',
    required: true,
    index: true,
  })
  reviewId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({
    default: true,
  })
  helpful: boolean;
}

export const ReviewHelpfulSchema =
  SchemaFactory.createForClass(ReviewHelpful);

ReviewHelpfulSchema.index(
  {
    reviewId: 1,
    userId: 1,
  },
  {
    unique: true,
  },
);
