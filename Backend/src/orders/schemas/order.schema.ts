import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import {
  HydratedDocument,
  Types,
} from 'mongoose';

import {
  FulfillmentStatus,
  OrderStatus,
  OrderType,
  PaymentStatus,
} from '../order.types.js';

import {
  OrderItem,
  OrderItemSchema,
} from './order-item.schema.js';

export type OrderDocument =
  HydratedDocument<Order>;

@Schema({
  timestamps: true,
  collection: 'orders',
})
export class Order {
  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  tenantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  restaurantId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  branchId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    index: true,
  })
  customerId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    index: true,
  })
  tableId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    index: true,
  })
  reservationId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    index: true,
  })
  dropId?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  orderNumber: string;

  @Prop({
    type: String,
    enum: Object.values(OrderType),
    required: true,
    index: true,
  })
  type: OrderType;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.DRAFT,
    index: true,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    enum: Object.values(FulfillmentStatus),
    default: FulfillmentStatus.UNFULFILLED,
  })
  fulfillmentStatus: FulfillmentStatus;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.UNPAID,
    index: true,
  })
  paymentStatus: PaymentStatus;

  @Prop({
    type: [OrderItemSchema],
    default: [],
  })
  items: OrderItem[];

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  subtotal: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  discountAmount: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  taxAmount: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  deliveryFee: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  serviceFee: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    min: 0,
  })
  totalAmount: number;

  @Prop({
    type: String,
  })
  couponCode?: string;

  @Prop({
    type: String,
  })
  customerNote?: string;

  @Prop({
    type: String,
  })
  cancellationReason?: string;

  @Prop({
    type: Object,
  })
  deliveryAddress?: Record<string, unknown>;

  @Prop({
    type: Date,
  })
  confirmedAt?: Date;

  @Prop({
    type: Date,
  })
  completedAt?: Date;

  @Prop({
    type: Date,
  })
  cancelledAt?: Date;

  @Prop({
    type: Types.ObjectId,
  })
  createdBy?: Types.ObjectId;
}

export const OrderSchema =
  SchemaFactory.createForClass(Order);

OrderSchema.index({
  tenantId: 1,
  branchId: 1,
  createdAt: -1,
});

OrderSchema.index({
  branchId: 1,
  status: 1,
  createdAt: -1,
});

OrderSchema.index({
  customerId: 1,
  createdAt: -1,
});
