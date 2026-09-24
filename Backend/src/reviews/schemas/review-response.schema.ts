import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReviewResponseDocument = HydratedDocument<ReviewResponse>;

@Schema({
  timestamps: true,
  collection: 'review_responses',
})
export class ReviewResponse {
  @Prop({
    type: Types.ObjectId,
    ref: 'Review',
    required: true,
    unique: true,
    index: true,
  })
  reviewId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  authorId: Types.ObjectId;

  @Prop({
    required: true,
    maxlength: 3000,
    trim: true,
  })
  message: string;

  @Prop({
    default: true,
  })
  isVisible: boolean;

  @Prop()
  deletedAt?: Date;
}

export const ReviewResponseSchema =
  SchemaFactory.createForClass(ReviewResponse);
