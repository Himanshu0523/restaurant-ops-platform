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
  IngredientCategory,
  IngredientStatus,
  MeasurementUnit,
  StorageType,
} from '../ingredient.types.js';

export type IngredientDocument =
  HydratedDocument<Ingredient>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Ingredient {
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
      index: true,
    })
    name: string;

    @Prop({
      trim: true,
      maxlength: 500,
    })
    description?: string;

    @Prop({
      trim: true,
      maxlength: 100,
      index: true,
    })
    sku?: string;

    @Prop({
      type: String,
      enum: Object.values(IngredientCategory),
      default: IngredientCategory.OTHER,
      index: true,
    })
    category: IngredientCategory;

    @Prop({
      type: String,
      enum: Object.values(IngredientStatus),
      default: IngredientStatus.ACTIVE,
      index: true,
    })
    status: IngredientStatus;

    @Prop({
      type: String,
      enum: Object.values(MeasurementUnit),
    required: true,
    })
    baseUnit: MeasurementUnit;

    @Prop({
      type: String,
      enum: Object.values(StorageType),
      default: StorageType.AMBIENT,
    })
  storageType: StorageType;

  @Prop({
    default: false,
  })
  isPerishable: boolean;

  @Prop({
    min: 0,
  })
  shelfLifeDays?: number;

  @Prop({
    type: [String],
    default: [],
  })
  allergenIds: string[];

  @Prop({
    type: [String],
    default: [],
  })
  dietaryTags: string[];

  @Prop({
    min: 0,
  })
  reorderLevel?: number;

  @Prop({
    min: 0,
  })
  reorderQuantity?: number;

  @Prop({
    min: 0,
  })
  estimatedUnitCost?: number;

  @Prop({
    trim: true,
  })
  preferredSupplier?: string;

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

export const IngredientSchema =
  SchemaFactory.createForClass(Ingredient);

IngredientSchema.index(
  {
    branchId: 1,
    name: 1,
  },
  {
    unique: true,
  },
);

IngredientSchema.index(
  {
    branchId: 1,
    sku: 1,
  },
  {
    unique: true,
    sparse: true,
  },
);

IngredientSchema.index({
  tenantId: 1,
  category: 1,
});

IngredientSchema.index({
  branchId: 1,
  status: 1,
});

IngredientSchema.index({
  branchId: 1,
  isPerishable: 1,
});
