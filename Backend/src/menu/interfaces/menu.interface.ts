import { Types } from 'mongoose';

import {
  MenuItemStatus,
  MenuItemType,
  MenuStatus,
  PricingType,
  SpiceLevel,
} from '../menu.types.js';

export interface IMenu {
  _id: Types.ObjectId;

  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;

  name: string;
  description?: string;

  status: MenuStatus;

  isDefault: boolean;
  isActive: boolean;

  publishedAt?: Date | null;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface IMenuItem {
  _id: Types.ObjectId;

  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  branchId: Types.ObjectId;

  menuId: Types.ObjectId;
  categoryId: Types.ObjectId;

  name: string;
  description?: string;

  type: MenuItemType;
  status: MenuItemStatus;
  pricingType: PricingType;

  price?: number;
  compareAtPrice?: number;

  spiceLevel: SpiceLevel;

  dietaryTags: string[];
  allergenIds: string[];
  tags: string[];

  isVegetarian: boolean;
  isVegan: boolean;
  isJain: boolean;
  isHalal: boolean;

  isFeatured: boolean;

  preparationTimeMinutes?: number;
  calories?: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
