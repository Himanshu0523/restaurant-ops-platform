import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { DeliveryAttemptStatus } from '../delivery.types.js';

export type DeliveryAttemptDocument = HydratedDocument<DeliveryAttempt>;

@Schema({
  timestamps: true,
  collection: 'delivery_attempts',
})
export class DeliveryAttempt {
  @Prop({
    type: Types.ObjectId,
    ref: 'Delivery',
    required: true,
    index: true,
  })
  deliveryId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(DeliveryAttemptStatus),
  })
  status: DeliveryAttemptStatus;

  @Prop()
  reason?: string;

  @Prop()
  notes?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  performedBy?: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  attemptedAt: Date;
}

export const DeliveryAttemptSchema =
  SchemaFactory.createForClass(DeliveryAttempt);

DeliveryAttemptSchema.index({
  deliveryId: 1,
  attemptedAt: -1,
});
