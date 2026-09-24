import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  IngredientCategory,
  IngredientStatus,
  StorageType,
} from '../ingredient.types.js';

export class IngredientQueryDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(IngredientCategory)
    category?: IngredientCategory;

    @IsOptional()
    @IsEnum(IngredientStatus)
    status?: IngredientStatus;

    @IsOptional()
    @IsEnum(StorageType)
    storageType?: StorageType;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isPerishable?: boolean;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;
}
