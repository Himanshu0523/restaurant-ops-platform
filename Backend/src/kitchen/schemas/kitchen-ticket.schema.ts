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
  KitchenPriority,
  KitchenTicketStatus,
} from '../kitchen.types.js';

import {
  KitchenTicketItem,
  KitchenTicketItemSchema,
} from './kitchen-ticket-item.schema.js';

export type KitchenTicketDocument =
  HydratedDocument<KitchenTicket>;

@Schema({
  timestamps: true,
  collection: 'kitchen_tickets',
})
export class KitchenTicket {
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
    required: true,
    unique: true,
    index: true,
  })
  orderId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  orderNumber: string;

  @Prop({
    type: String,
    enum: Object.values(KitchenTicketStatus),
    default: KitchenTicketStatus.QUEUED,
    index: true,
  })
  status: KitchenTicketStatus;

  @Prop({
    type: String,
    enum: Object.values(KitchenPriority),
    default: KitchenPriority.NORMAL,
    index: true,
  })
  priority: KitchenPriority;

  @Prop({
    type: [KitchenTicketItemSchema],
    default: [],
  })
  items: KitchenTicketItem[];

  @Prop({
    type: Number,
    default: 0,
  })
  estimatedPreparationMinutes: number;

  @Prop({
    type: Date,
    index: true,
  })
  queuedAt: Date;

  @Prop({
    type: Date,
  })
  acceptedAt?: Date;

  @Prop({
    type: Date,
  })
  startedAt?: Date;

  @Prop({
    type: Date,
  })
  readyAt?: Date;

  @Prop({
    type: Date,
  })
  completedAt?: Date;

  @Prop({
    type: Types.ObjectId,
  })
  assignedStaffId?: Types.ObjectId;

  @Prop({
    type: String,
  })
  customerNote?: string;

  @Prop({
    type: Number,
    default: 0,
  })
  queuePosition: number;
}

export const KitchenTicketSchema =
  SchemaFactory.createForClass(KitchenTicket);

KitchenTicketSchema.index({
  branchId: 1,
  status: 1,
  priority: 1,
  queuedAt: 1,
});

KitchenTicketSchema.index({
  branchId: 1,
  createdAt: -1,
});
