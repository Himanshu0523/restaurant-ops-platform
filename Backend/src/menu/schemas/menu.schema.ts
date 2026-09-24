import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { MenuStatus } from '../menu.types.js';

export type MenuDocument = HydratedDocument<Menu>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Menu {
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
    maxlength: 150,
  })
  name: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(MenuStatus),
    default: MenuStatus.DRAFT,
    index: true,
  })
  status: MenuStatus;

  @Prop({
    default: false,
  })
  isDefault: boolean;

  @Prop({
    default: true,
    index: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  publishedAt?: Date | null;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}

export const MenuSchema =
  SchemaFactory.createForClass(Menu);

MenuSchema.index({
  branchId: 1,
  status: 1,
});

MenuSchema.index(
  {
    branchId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

MenuSchema.index({
  tenantId: 1,
  branchId: 1,
  isActive: 1,
});
