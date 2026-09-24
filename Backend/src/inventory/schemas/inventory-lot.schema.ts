import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  InventoryLotStatus,
} from '../inventory.types.js';

export type InventoryLotDocument =
  HydratedDocument<InventoryLot>;

@Schema({
  timestamps: true,
  collection: 'inventory_lots',
})
export class InventoryLot {
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
  branchId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  ingredientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  inventoryItemId: Types.ObjectId;

  @Prop({
    type: String,
    trim: true,
  })
  batchNumber?: string;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  quantityReceived: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  remainingQuantity: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  unitCost: number;

  @Prop({
    type: String,
    trim: true,
  })
  supplier?: string;

  @Prop({
    type: Date,
    required: true,
  })
  receivedAt: Date;

  @Prop({
    type: Date,
  })
  expiryDate?: Date;

  @Prop({
    type: String,
    enum: Object.values(InventoryLotStatus),
    default: InventoryLotStatus.ACTIVE,
    index: true,
  })
  status: InventoryLotStatus;
}

export const InventoryLotSchema =
  SchemaFactory.createForClass(InventoryLot);

InventoryLotSchema.index({
  branchId: 1,
  ingredientId: 1,
  expiryDate: 1,
});

InventoryLotSchema.index({
  inventoryItemId: 1,
  status: 1,
});
