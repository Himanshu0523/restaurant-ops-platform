import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
} from '../payments.types.js';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({
  timestamps: true,
  collection: 'payments',
})
export class Payment {
  @Prop({
    type: Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  })
  tenantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Restaurant',
    required: true,
    index: true,
  })
  restaurantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Branch',
    required: true,
    index: true,
  })
  branchId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true,
    index: true,
  })
  orderId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    index: true,
  })
  customerId?: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  paymentNumber: string;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    required: true,
    default: 0,
  })
  refundedAmount: number;

  @Prop({
    required: true,
    default: 'INR',
    uppercase: true,
  })
  currency: string;

  @Prop({
    required: true,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.CREATED,
    index: true,
  })
  status: PaymentStatus;

  @Prop({
    enum: Object.values(PaymentMethod),
  })
  method?: PaymentMethod;

  @Prop({
    required: true,
    enum: Object.values(PaymentGateway),
  })
  gateway: PaymentGateway;

  @Prop({
    index: true,
  })
  gatewayOrderId?: string;

  @Prop({
    index: true,
  })
  gatewayPaymentId?: string;

  @Prop()
  gatewayCustomerId?: string;

  @Prop({
    required: true,
    index: true,
  })
  idempotencyKey: string;

  @Prop()
  failureCode?: string;

  @Prop()
  failureMessage?: string;

  @Prop()
  paidAt?: Date;

  @Prop()
  cancelledAt?: Date;
}

export const PaymentSchema =
  SchemaFactory.createForClass(Payment);

PaymentSchema.index({
  tenantId: 1,
  createdAt: -1,
});

PaymentSchema.index({
  orderId: 1,
  status: 1,
});

PaymentSchema.index(
  {
    tenantId: 1,
    idempotencyKey: 1,
  },
  {
    unique: true,
  },
);