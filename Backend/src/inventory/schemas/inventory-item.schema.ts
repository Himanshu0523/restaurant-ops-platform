import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  InventoryStatus,
} from '../inventory.types.js';

export type InventoryItemDocument =
  HydratedDocument<InventoryItem>;

@Schema({
  timestamps: true,
  collection: 'inventory_items',
})
export class InventoryItem {
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
    index: true,
  })
  ingredientId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    min: 0,
  })
  currentQuantity: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    min: 0,
  })
  reservedQuantity: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    min: 0,
  })
  reorderLevel: number;

  @Prop({
    type: Number,
    required: true,
    default: 0,
    min: 0,
  })
  reorderQuantity: number;

  @Prop({
    type: Number,
    default: 0,
    min: 0,
  })
  averageUnitCost: number;

  @Prop({
    type: String,
    enum: Object.values(InventoryStatus),
    default: InventoryStatus.OUT_OF_STOCK,
    index: true,
  })
  status: InventoryStatus;

  @Prop({
    type: Boolean,
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}

export const InventoryItemSchema =
  SchemaFactory.createForClass(InventoryItem);

InventoryItemSchema.index(
  {
    branchId: 1,
    ingredientId: 1,
  },
  {
    unique: true,
  },
);

InventoryItemSchema.index({
  tenantId: 1,
  branchId: 1,
  status: 1,
});

InventoryItemSchema.index({
  branchId: 1,
  currentQuantity: 1,
});
