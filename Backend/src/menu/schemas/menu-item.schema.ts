import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import {
  MenuItemStatus,
  MenuItemType,
  PricingType,
  SpiceLevel,
} from '../menu.types.js';

export type MenuItemDocument =
  HydratedDocument<MenuItem>;

@Schema({
  _id: false,
})
export class MenuItemVariant {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    min: 0,
  })
  price: number;

  @Prop({
    min: 0,
  })
  compareAtPrice?: number;

  @Prop({
    default: true,
  })
  isAvailable: boolean;
}

export const MenuItemVariantSchema =
  SchemaFactory.createForClass(MenuItemVariant);

@Schema({
  timestamps: true,
  versionKey: false,
})
export class MenuItem {
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
    type: Types.ObjectId,
    ref: 'MenuCategory',
    required: true,
    index: true,
  })
  categoryId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 150,
    index: true,
  })
  name: string;

  @Prop({
    trim: true,
    maxlength: 1000,
  })
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(MenuItemType),
    default: MenuItemType.FOOD,
    index: true,
  })
  type: MenuItemType;

  @Prop({
    type: String,
    enum: Object.values(MenuItemStatus),
    default: MenuItemStatus.AVAILABLE,
    index: true,
  })
  status: MenuItemStatus;

  @Prop({
    type: String,
    enum: Object.values(PricingType),
    default: PricingType.FIXED,
  })
  pricingType: PricingType;

  @Prop({
    min: 0,
  })
  price?: number;

  @Prop({
    min: 0,
  })
  compareAtPrice?: number;

  @Prop({
    type: [MenuItemVariantSchema],
    default: [],
  })
  variants: MenuItemVariant[];

  @Prop({
    type: String,
    enum: Object.values(SpiceLevel),
    default: SpiceLevel.NONE,
  })
  spiceLevel: SpiceLevel;

  @Prop({
    type: [String],
    default: [],
    index: true,
  })
  cuisineTypes: string[];

  @Prop({
    type: [String],
    default: [],
  })
  dietaryTags: string[];

  @Prop({
    type: [String],
    default: [],
  })
  allergenIds: string[];

  @Prop({
    type: [String],
    default: [],
  })
  tags: string[];

  @Prop({
    trim: true,
  })
  imageUrl?: string;

  @Prop({
    type: [String],
    default: [],
  })
  gallery: string[];

  @Prop({
    default: false,
  })
  isVegetarian: boolean;

  @Prop({
    default: false,
  })
  isVegan: boolean;

  @Prop({
    default: false,
  })
  isJain: boolean;

  @Prop({
    default: false,
  })
  isHalal: boolean;

  @Prop({
    default: false,
  })
  isFeatured: boolean;

  @Prop({
    default: false,
  })
  isRecommended: boolean;

  @Prop({
    min: 0,
  })
  preparationTimeMinutes?: number;

  @Prop({
    min: 0,
  })
  calories?: number;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt?: Date | null;
}

export const MenuItemSchema =
  SchemaFactory.createForClass(MenuItem);

MenuItemSchema.index({
  branchId: 1,
  categoryId: 1,
});

MenuItemSchema.index({
  branchId: 1,
  status: 1,
});

MenuItemSchema.index({
  branchId: 1,
  isFeatured: 1,
});

MenuItemSchema.index({
  branchId: 1,
  isVegetarian: 1,
});

MenuItemSchema.index({
  menuId: 1,
  name: 1,
});
