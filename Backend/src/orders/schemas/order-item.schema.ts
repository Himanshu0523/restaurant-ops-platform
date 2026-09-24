import {
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';

import { Types } from 'mongoose';

@Schema({
  _id: true,
})
export class OrderItem {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  menuItemId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  categoryId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  dropId?: Types.ObjectId;

  // Historical snapshot
  @Prop({
    type: String,
    required: true,
  })
  nameSnapshot: string;

  @Prop({
    type: String,
  })
  descriptionSnapshot?: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  unitPrice: number;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  quantity: number;

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
    required: true,
    min: 0,
  })
  subtotal: number;

  @Prop({
    type: [Object],
    default: [],
  })
  variants: Record<string, unknown>[];

  @Prop({
    type: [String],
    default: [],
  })
  addons: string[];

  @Prop({
    type: String,
  })
  specialInstructions?: string;

  @Prop({
    type: Number,
    default: 0,
  })
  preparationTimeMinutes: number;
}

export const OrderItemSchema =
  SchemaFactory.createForClass(OrderItem);
