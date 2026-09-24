import { Types } from 'mongoose';

import {
  IngredientCategory,
  IngredientStatus,
  MeasurementUnit,
  StorageType,
} from '../ingredient.types.js';

export interface IIngredient {
    _id: Types.ObjectId;

    tenantId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    branchId: Types.ObjectId;

    name: string;
    description?: string;
    sku?: string;

    category: IngredientCategory;
    status: IngredientStatus;

    baseUnit: MeasurementUnit;
    storageType: StorageType;

    isPerishable: boolean;
    shelfLifeDays?: number;

    allergenIds: string[];
    dietaryTags: string[];

    reorderLevel?: number;
    reorderQuantity?: number;

    estimatedUnitCost?: number;
    preferredSupplier?: string;

    isActive: boolean;
    deletedAt?: Date | null;

    createdAt: Date;
    updatedAt: Date;
  }
