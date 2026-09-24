import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { Types } from 'mongoose';

import {
  KitchenTicketItemStatus,
  KitchenStationType,
} from '../kitchen.types.js';

@Schema({
  _id: true,
})
export class KitchenTicketItem {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  orderItemId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  menuItemId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  nameSnapshot: string;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  quantity: number;

  @Prop({
    type: String,
    enum: Object.values(KitchenTicketItemStatus),
    default: KitchenTicketItemStatus.PENDING,
  })
  status: KitchenTicketItemStatus;

  @Prop({
    type: String,
    enum: Object.values(KitchenStationType),
    default: KitchenStationType.GENERAL,
  })
  station: KitchenStationType;

  @Prop({
    type: Number,
    default: 15,
    min: 0,
  })
  estimatedPreparationMinutes: number;

  @Prop({
    type: Number,
    default: 0,
  })
  elapsedPreparationMinutes: number;

  @Prop({
    type: String,
  })
  specialInstructions?: string;

  @Prop({
    type: Date,
  })
  startedAt?: Date;

  @Prop({
    type: Date,
  })
  readyAt?: Date;

  @Prop({
    type: Types.ObjectId,
  })
  assignedStaffId?: Types.ObjectId;
}

export const KitchenTicketItemSchema =
  SchemaFactory.createForClass(KitchenTicketItem);
