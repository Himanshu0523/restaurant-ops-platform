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
  DropAvailability,
  DropStatus,
  DropType,
} from '../drop.types.js';

export type DropDocument = HydratedDocument<Drop>;

@Schema({
  timestamps: true,
  collection: 'drops',
})
export class Drop {
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
  menuItemId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
    maxlength: 150,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: 1000,
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(DropType),
    required: true,
    index: true,
  })
  type: DropType;

  @Prop({
    type: String,
    enum: Object.values(DropStatus),
    default: DropStatus.DRAFT,
    index: true,
  })
  status: DropStatus;

  @Prop({
    type: Number,
    required: true,
    min: 1,
  })
  totalQuantity: number;

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
  reservedQuantity: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    type: Number,
    min: 0,
  })
  originalPrice?: number;

  @Prop({
    type: [String],
    enum: Object.values(DropAvailability),
    default: [DropAvailability.DINE_IN],
  })
  availability: DropAvailability[];

  @Prop({
    type: Date,
    required: true,
    index: true,
  })
  startAt: Date;

  @Prop({
    type: Date,
    required: true,
    index: true,
  })
  endAt: Date;

  @Prop({
    type: String,
    trim: true,
  })
  imageUrl?: string;

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    type: Boolean,
    default: false,
    index: true,
  })
  isFeatured: boolean;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Types.ObjectId,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
  })
  publishedBy?: Types.ObjectId;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}

export const DropSchema =
  SchemaFactory.createForClass(Drop);

DropSchema.index({
  branchId: 1,
  status: 1,
  startAt: 1,
});

DropSchema.index({
  branchId: 1,
  menuItemId: 1,
  status: 1,
});

DropSchema.index({
  tenantId: 1,
  branchId: 1,
  endAt: 1,
});
