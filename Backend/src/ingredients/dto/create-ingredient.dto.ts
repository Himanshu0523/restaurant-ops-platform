import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  IngredientCategory,
  MeasurementUnit,
  StorageType,
} from '../ingredient.types.js';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @IsOptional()
  @IsEnum(IngredientCategory)
  category?: IngredientCategory;

  @IsEnum(MeasurementUnit)
  baseUnit: MeasurementUnit;

  @IsOptional()
  @IsEnum(StorageType)
  storageType?: StorageType;

  @IsOptional()
  @IsBoolean()
  isPerishable?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(3650)
  shelfLifeDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergenIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietaryTags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderQuantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedUnitCost?: number;

  @IsOptional()
  @IsString()
  preferredSupplier?: string;
}
