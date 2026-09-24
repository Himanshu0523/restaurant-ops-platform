import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  TableShape,
  TableStatus,
  TableType,
} from '../tables.types.js';

export type TableDocument = HydratedDocument<Table>;

@Schema({ _id: false })
export class TablePosition {
  @Prop({ type: Number, default: 0 })
  x: number;

  @Prop({ type: Number, default: 0 })
  y: number;

  @Prop({ type: Number, default: 0 })
  rotation: number;
}

export const TablePositionSchema =
  SchemaFactory.createForClass(TablePosition);

@Schema({ _id: false })
export class TableSettings {
  @Prop({ default: true })
  allowReservations: boolean;

  @Prop({ default: true })
  allowDineIn: boolean;

  @Prop({ default: true })
  allowQrOrdering: boolean;

  @Prop({ default: false })
  isVip: boolean;
}

export const TableSettingsSchema =
  SchemaFactory.createForClass(TableSettings);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Table {
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
    required: true,
    trim: true,
    maxlength: 100,
  })
  tableNumber: string;

  @Prop({
    trim: true,
    maxlength: 100,
  })
  label?: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(TableType),
    default: TableType.STANDARD,
    index: true,
  })
  type: TableType;

  @Prop({
    type: String,
    enum: Object.values(TableShape),
    default: TableShape.SQUARE,
  })
  shape: TableShape;

  @Prop({
    required: true,
    min: 1,
    max: 50,
  })
  capacity: number;

  @Prop({
    min: 1,
    max: 50,
  })
  minCapacity?: number;

  @Prop({
    min: 1,
    max: 50,
  })
  maxCapacity?: number;

  @Prop({
    type: String,
    enum: Object.values(TableStatus),
    default: TableStatus.AVAILABLE,
    index: true,
  })
  status: TableStatus;

  @Prop({
    trim: true,
    index: true,
  })
  floor?: string;

  @Prop({
    trim: true,
    index: true,
  })
  zone?: string;

  @Prop({
    type: TablePositionSchema,
    default: () => ({}),
  })
  position: TablePosition;

  @Prop({
    trim: true,
  })
  qrCodeToken?: string;

  @Prop({
    trim: true,
  })
  qrCodeUrl?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    default: null,
  })
  currentOrderId?: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Reservation',
    default: null,
  })
  currentReservationId?: Types.ObjectId | null;

  @Prop({
    type: TableSettingsSchema,
    default: () => ({}),
  })
  settings: TableSettings;

  @Prop({
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

export const TableSchema = SchemaFactory.createForClass(Table);

TableSchema.index({
  tenantId: 1,
  restaurantId: 1,
  branchId: 1,
});

TableSchema.index({
  branchId: 1,
  tableNumber: 1,
}, {
  unique: true,
});

TableSchema.index({
  branchId: 1,
  status: 1,
});

TableSchema.index({
  branchId: 1,
  floor: 1,
  zone: 1,
});

TableSchema.index({
  deletedAt: 1,
});