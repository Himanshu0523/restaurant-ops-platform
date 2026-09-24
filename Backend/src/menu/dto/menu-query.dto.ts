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
  MenuItemStatus,
  MenuItemType,
} from '../menu.types.js';

export class MenuQueryDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(MenuItemStatus)
  status?: MenuItemStatus;

  @IsOptional()
  @IsEnum(MenuItemType)
  type?: MenuItemType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  vegan?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  jain?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  halal?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

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
