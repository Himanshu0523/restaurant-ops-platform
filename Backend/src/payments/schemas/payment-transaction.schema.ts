import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import {
  PaymentTransactionStatus,
  PaymentTransactionType,
} from '../payments.types.js';

export type PaymentTransactionDocument =
  HydratedDocument<PaymentTransaction>;

@Schema({
  timestamps: true,
  collection: 'payment_transactions',
})
export class PaymentTransaction {
  @Prop({
    type: Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true,
  })
  paymentId: Types.ObjectId;

  @Prop({
    required: true,
    enum: Object.values(PaymentTransactionType),
  })
  type: PaymentTransactionType;

  @Prop({
    required: true,
    enum: Object.values(PaymentTransactionStatus),
  })
  status: PaymentTransactionStatus;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop()
  gatewayTransactionId?: string;

  @Prop()
  idempotencyKey?: string;

  @Prop()
  failureCode?: string;

  @Prop()
  failureMessage?: string;

  @Prop()
  processedAt?: Date;

  @Prop({
    type: Object,
  })
  metadata?: Record<string, unknown>;
}

export const PaymentTransactionSchema =
  SchemaFactory.createForClass(PaymentTransaction);

PaymentTransactionSchema.index({
  paymentId: 1,
  createdAt: -1,
});

PaymentTransactionSchema.index({
  gatewayTransactionId: 1,
});