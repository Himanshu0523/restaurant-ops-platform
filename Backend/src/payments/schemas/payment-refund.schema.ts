import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { RefundStatus } from '../payments.types.js';

export type PaymentRefundDocument =
  HydratedDocument<PaymentRefund>;

@Schema({
  timestamps: true,
  collection: 'payment_refunds',
})
export class PaymentRefund {
  @Prop({
    type: Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true,
  })
  paymentId: Types.ObjectId;

  @Prop({
    required: true,
    min: 1,
  })
  amount: number;

  @Prop({
    required: true,
    enum: Object.values(RefundStatus),
    default: RefundStatus.PENDING,
    index: true,
  })
  status: RefundStatus;

  @Prop({
    unique: true,
    sparse: true,
    index: true,
  })
  refundNumber?: string;

  @Prop({
    index: true,
  })
  gatewayRefundId?: string;

  @Prop()
  reason?: string;

  @Prop()
  failureMessage?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  initiatedBy?: Types.ObjectId;

  @Prop()
  completedAt?: Date;
}

export const PaymentRefundSchema =
  SchemaFactory.createForClass(PaymentRefund);

PaymentRefundSchema.index({
  paymentId: 1,
  createdAt: -1,
});