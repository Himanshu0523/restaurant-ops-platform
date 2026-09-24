import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  InventoryMovementType,
  InventoryReferenceType,
} from '../inventory.types.js';

export type InventoryMovementDocument =
  HydratedDocument<InventoryMovement>;

@Schema({
  timestamps: true,
  collection: 'inventory_movements',
})
export class InventoryMovement {
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
    enum: Object.values(InventoryMovementType),
    required: true,
    index: true,
  })
  type: InventoryMovementType;

  @Prop({
    type: Number,
    required: true,
  })
  quantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  beforeQuantity: number;

  @Prop({
    type: Number,
    required: true,
  })
  afterQuantity: number;

  @Prop({
    type: String,
    enum: Object.values(InventoryReferenceType),
  })
  referenceType?: InventoryReferenceType;

  @Prop({
    type: Types.ObjectId,
  })
  referenceId?: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  performedBy: Types.ObjectId;

  @Prop({
    type: String,
    trim: true,
    maxlength: 500,
  })
  reason?: string;

  @Prop({
    type: Object,
    default: {},
  })
  metadata?: Record<string, unknown>;
}

export const InventoryMovementSchema =
  SchemaFactory.createForClass(InventoryMovement);

InventoryMovementSchema.index({
  branchId: 1,
  inventoryItemId: 1,
  createdAt: -1,
});

InventoryMovementSchema.index({
  branchId: 1,
  ingredientId: 1,
  createdAt: -1,
});

InventoryMovementSchema.index({
  referenceType: 1,
  referenceId: 1,
});
