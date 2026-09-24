import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MenuCategoryDocument =
  HydratedDocument<MenuCategory>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class MenuCategory {
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
    type: Types.ObjectId,
    ref: 'Menu',
    required: true,
    index: true,
  })
  menuId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    default: 0,
  })
  sortOrder: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    trim: true,
  })
  imageUrl?: string;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}

export const MenuCategorySchema =
  SchemaFactory.createForClass(MenuCategory);

MenuCategorySchema.index({
  menuId: 1,
  sortOrder: 1,
});

MenuCategorySchema.index(
  {
    menuId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);
